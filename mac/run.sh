#!/bin/bash
# Запускает сайт на этом Mac: сервер с надписью + туннель Cloudflare,
# записывает адрес туннеля в репозиторий (docs/tunnel.json) и следит, что всё живо.
# Его запускает launchd при входе в систему (см. install.sh) и перезапускает при сбое.
set -u

DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8790
REPO="ijpteb/ohuenny-sayt"
FILE="docs/tunnel.json"
GH="$HOME/.local/bin/gh"
CF="$HOME/.local/bin/cloudflared"
PY=/usr/bin/python3
LOGDIR="$HOME/Library/Logs/ohuenny-sayt"
CFLOG="$LOGDIR/cloudflared.log"

mkdir -p "$LOGDIR"
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*"; }

SERVER_PID=""
CF_PID=""
cleanup() {
  [ -n "$CF_PID" ] && kill "$CF_PID" 2>/dev/null
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  wait 2>/dev/null
  log "остановлено"
}
trap cleanup EXIT
trap 'exit 0' TERM INT

online() { curl -s -o /dev/null --max-time 10 https://api.github.com; }

# 1. Сервер с надписью (только для этого компьютера, 127.0.0.1)
"$PY" "$DIR/server.py" --port "$PORT" &
SERVER_PID=$!
sleep 1
if ! curl -s --max-time 5 "http://127.0.0.1:$PORT/text" >/dev/null; then
  log "сервер не запустился (порт $PORT занят?)"; exit 1
fi
log "сервер запущен на 127.0.0.1:$PORT"

# 2. Ждём интернет (после включения компьютера сеть появляется не сразу)
until online; do sleep 10; done

# 3. Туннель Cloudflare (без аккаунта; адрес новый при каждом запуске)
: > "$CFLOG"
"$CF" tunnel --no-autoupdate --url "http://127.0.0.1:$PORT" >>"$CFLOG" 2>&1 &
CF_PID=$!
URL=""
for _ in $(seq 1 60); do
  URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' "$CFLOG" | head -1)
  [ -n "$URL" ] && break
  kill -0 "$CF_PID" 2>/dev/null || break
  sleep 1
done
if [ -z "$URL" ]; then log "туннель не дал адрес — см. $CFLOG"; exit 1; fi
log "туннель: $URL"

# Ждём, пока адрес начнёт отвечать снаружи
for _ in $(seq 1 30); do
  curl -sf --max-time 10 "$URL/text" >/dev/null && break
  sleep 3
done

# 4. Записываем адрес в репозиторий → GitHub Pages узнаёт его через ~1 мин
publish() {
  local sha content
  sha=$("$GH" api "repos/$REPO/contents/$FILE" --jq .sha 2>/dev/null) || sha=""
  content=$(printf '{"url": "%s"}\n' "$URL" | base64)
  "$GH" api -X PUT "repos/$REPO/contents/$FILE" \
    -f message="Адрес туннеля" -f content="$content" ${sha:+-f sha="$sha"} \
    -f "committer[name]=ijpteb" \
    -f "committer[email]=352851385+ijpteb@users.noreply.github.com" >/dev/null
}
until publish; do log "не удалось записать адрес, повтор через 30 с"; sleep 30; done
log "адрес записан в $REPO/$FILE"

# 5. Дежурство: раз в минуту проверяем, что всё живо; иначе выходим — launchd перезапустит
fails=0
while true; do
  sleep 60 & wait $!   # так остановка (launchctl) срабатывает сразу, а не после sleep
  kill -0 "$SERVER_PID" 2>/dev/null || { log "сервер упал"; exit 1; }
  kill -0 "$CF_PID" 2>/dev/null || { log "туннель упал"; exit 1; }
  if curl -sf --max-time 15 "$URL/text" >/dev/null; then
    fails=0
  elif online; then
    fails=$((fails + 1))
    log "туннель не отвечает ($fails/3)"
    [ "$fails" -ge 3 ] && { log "перезапуск с новым адресом"; exit 1; }
  fi
done
