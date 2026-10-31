#!/bin/bash
# Usage: dev/shoot.sh out.png "query" width,height   (preview served on :8770)
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$C" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=8000 --window-size=$3 --screenshot="$1" "http://localhost:8770/?bare=1&$2" >/dev/null 2>&1
