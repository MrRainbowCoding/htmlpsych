@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo  FNF PsychEngine Extra - Dependencies Installation Setup
echo ========================================================
echo.

echo [1/5] Checking and Installing WinGet / Package Managers...
where winget >nul 2>nul
if %errorlevel% neq 0 (
    echo WinGet not found. Launching winget.ps1...
    powershell -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File winget.ps1' -Wait"
) else (
    echo WinGet is available!
)

echo.
echo [2/5] Installing Git, Haxe, and Node.js via WinGet...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Git...
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
) else (
    echo Git is already installed!
)

where haxe >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Haxe...
    winget install HaxeFoundation.Haxe -e --source winget --accept-package-agreements --accept-source-agreements
) else (
    echo Haxe is already installed!
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Node.js (required for offline HTML5 asset bundling)...
    winget install OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
) else (
    echo Node.js is already installed!
)

echo.
echo [3/5] Refreshing PATH from registry...
for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "syspath=%%B"
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "userpath=%%B"
set "PATH=%userpath%;%syspath%;%PATH%"
echo PATH successfully reloaded!

echo.
echo [4/5] Installing Haxe and Flixel libraries...
haxelib install lime --always
haxelib install openfl --always
haxelib install flixel 5.6.1 --always
haxelib install flixel-tools --always
haxelib install flixel-addons --always
haxelib install flixel-ui --always
haxelib install hscript --always
haxelib install hxCodec --always

echo.
echo [5/5] Installing Git-based Haxe libraries...
haxelib git hscript-ex https://github.com/ianharrigan/hscript-ex --always
haxelib git discord_rpc https://github.com/Aidan63/linc_discord-rpc --always
haxelib git linc_luajit https://github.com/nebulazorua/linc_luajit --always

echo.
echo Setting up Lime, Flixel, and Flixel Tools...
haxelib run lime setup flixel
haxelib run lime setup
haxelib run flixel-tools setup

echo.
echo ========================================================
echo  All dependencies have been successfully installed!
echo  To build for HTML5: lime build html5
echo  To bundle for offline HTML5: node scripts/bundle_html5_assets.js
echo ========================================================
echo.
pause