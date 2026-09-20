@echo off
setlocal
cd /d "%~dp0"

echo ====================================================
echo        Friday Night Funkin': HT Psych (HTML5)
echo ====================================================
echo.

if not exist "export\release\html5\bin\index.html" (
    echo HTML5 build not found. Compiling now...
    call lime build html5
    if errorlevel 1 (
        echo.
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
)

echo Opening HTML5 build directly in your default browser...
start "" "export\release\html5\bin\index.html"
echo.
echo The game is now running offline directly from disk!
exit /b 0

