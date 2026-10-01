@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo FNF HTML Psych - Dependencies Installation Setup
echo ========================================================
echo

echo [1/5] Checking and Installing WinGet / Package Managers
where winget >nul 2>nul
if !errorlevel! neq 0 (
    echo WinGet not found Launching wingetps1
    powershell -ExecutionPolicy Bypass -File wingetps1
) else (
    echo WinGet is available!
)

echo
echo [2/5] Installing Git, Haxe, and Nodejs via WinGet
where git >nul 2>nul
if !errorlevel! neq 0 (
    echo Installing Git
    winget install --id GitGit -e --source winget --accept-package-agreements --accept-source-agreements
) else (
    echo Git is already installed!
)

where haxe >nul 2>nul
if !errorlevel! neq 0 (
    echo Installing Haxe
    winget install HaxeFoundation.Haxe -e --source winget --accept-package-agreements --accept-source-agreements
) else (
    echo Haxe is already installed!
)

where node >nul 2>nul
if !errorlevel! neq 0 (
    echo Installing Nodejs (required for offline HTML5 asset bundling)
    winget install OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
) else (
    echo Nodejs is already installed!
)

echo
echo [3/5] Refreshing PATH from registry
set "syspath="
set "userpath="
for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "syspath=%%B"
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "userpath=%%B"
if defined userpath set "PATH=%userpath%;%PATH%"
if defined syspath set "PATH=%syspath%;%PATH%"
echo PATH successfully reloaded!

echo
echo [4/5] Installing Haxe and Flixel libraries
haxelib install lime --always
haxelib install openfl --always
haxelib --always install flixel 5.6.1
haxelib install flixel-addons --always
haxelib install flixel-ui --always
haxelib --always install hscript 2.5.0
haxelib set hscript 2.5.0
haxelib install hxCodec --always

echo
echo [5/5] Installing Git-based Haxe libraries
haxelib git hscript-ex https://githubcom/ianharrigan/hscript-ex --always
haxelib git discord_rpc https://githubcom/Aidan63/linc_discord-rpc --always
haxelib git linc_luajit https://githubcom/nebulazorua/linc_luajit --always

echo
echo Setting up Lime, Flixel, and Flixel Tools
haxelib run lime setup flixel
haxelib run lime setup
haxelib run flixel-tools setup

echo
echo ========================================================
echo All dependencies have been successfully installed!
echo To build for HTML5: lime build html5
echo To bundle for offline HTML5: node scripts/bundle_html5_assetsjs
echo ========================================================
echo
pause