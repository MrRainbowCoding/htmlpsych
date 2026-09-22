@echo off

echo Installing WinGet...
timeout /t 1 /nobreak > nul
powershell -Command "start winget.ps1"
echo Done!
timeout /t 1 /nobreak > nul

echo Installing Git..

winget install --id Git.Git -e --source winget
timeout /t 1 /nobreak > nul
echo Done!
timeout /t 1 /nobreak > nul
echo Installing Haxe...
winget install HaxeFoundation.Haxe -e --source winget
echo Done!
timeout /t 1 /nobreak > nul
echo Installing HaxeFlixel...
timeout /t 1 /nobreak > nul
haxelib install flixel
haxelib install openfl
haxelib install lime
haxelib install flixel-tools
timeout /t 1 /nobreak > nul
echo Done!
timeout /t 1 /nobreak > nul
echo Refreshing PATH from registry...

:: Get System PATH
for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "syspath=%%B"

:: Get User PATH
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "userpath=%%B"

:: Combine and set the current session's PATH
set "PATH=%userpath%;%syspath%"

echo PATH successfully reloaded!
echo Done!
timeout /t 1 /nobreak > nul
echo Setting Up HaxeFlixel...
haxelib run lime setup flixel
haxelib run lime setup
haxelib run flixel-tools setup
echo Done!
timeout /t 1 /nobreak > nul
pause