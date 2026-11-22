#!/bin/bash
# Двойной щелчок: ставит зависимости (первый раз), запускает сайт студии и открывает браузер.
cd "$(dirname "$0")" || exit 1
command -v npm >/dev/null || { echo "Нужен Node.js: https://nodejs.org"; read -r; exit 1; }
[ -d node_modules ] || npm install
(sleep 2 && open http://localhost:5173) &
npm run dev
