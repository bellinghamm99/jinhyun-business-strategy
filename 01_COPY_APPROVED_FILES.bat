@echo off
chcp 65001 >nul
powershell.exe -NoProfile -STA -ExecutionPolicy Bypass -File "%~dp0tools\copy_public_assets.ps1" %*
echo.
pause
