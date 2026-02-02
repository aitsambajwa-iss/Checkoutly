@echo off
echo Installing Checkoutly dependencies...
echo.

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Installing dependencies...
npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Installation successful!
    echo.
    echo To start the development server, run:
    echo npm run dev
    echo.
    echo Then open http://localhost:3000 in your browser
) else (
    echo.
    echo ❌ Installation failed. Please check the error messages above.
)

pause