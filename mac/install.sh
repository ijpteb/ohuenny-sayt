#!/bin/bash
# Включает автозапуск сайта при входе в систему (launchd) и сразу запускает его.
set -eu
DIR="$(cd "$(dirname "$0")" && pwd)"
LABEL="io.github.ijpteb.ohuenny-sayt"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOGDIR="$HOME/Library/Logs/ohuenny-sayt"

[ -x "$HOME/.local/bin/cloudflared" ] || { echo "Нет $HOME/.local/bin/cloudflared"; exit 1; }
[ -x "$HOME/.local/bin/gh" ] || { echo "Нет $HOME/.local/bin/gh"; exit 1; }
mkdir -p "$HOME/Library/LaunchAgents" "$LOGDIR"
chmod +x "$DIR/run.sh"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>/bin/bash</string><string>$DIR/run.sh</string></array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>HOME</key><string>$HOME</string>
    <key>PATH</key><string>/usr/bin:/bin:/usr/sbin:/sbin</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>ThrottleInterval</key><integer>30</integer>
  <key>StandardOutPath</key><string>$LOGDIR/run.log</string>
  <key>StandardErrorPath</key><string>$LOGDIR/run.log</string>
</dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "Автозапуск включён. Журнал: $LOGDIR/run.log"
