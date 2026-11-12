#!/bin/bash
# Останавливает сайт и убирает автозапуск. Сайт перестанет показывать надпись.
LABEL="io.github.ijpteb.ohuenny-sayt"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null
rm -f "$HOME/Library/LaunchAgents/$LABEL.plist"
echo "Сайт остановлен, автозапуск выключен."
