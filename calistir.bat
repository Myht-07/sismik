@echo off
chcp 65001 > nul
title Sismik - Canli Deprem Radari

set "PATH=C:\Program Files\nodejs;%PATH%"

echo ========================================================
echo   🌍 Sismik Canli Deprem Radari Baslatiliyor...
echo ========================================================
echo.

npm run dev
pause
