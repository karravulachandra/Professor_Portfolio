@echo off
echo ===================================
echo Local RAG Assistant - Setup Script
echo ===================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python 3.9+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH.
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Setting up virtual environment...
python -m venv venv
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Do you want to download the LLM model now? (y/n)
set /p download_model=

if /i "%download_model%"=="y" (
    python download_model.py
)

echo.
echo Setting up frontend...
cd frontend
npm install
cd ..

echo.
echo Setup complete!
echo.
echo To run the application:
echo 1. Start the backend: run_backend.bat
echo 2. Start the frontend: run_frontend.bat
echo.
pause
