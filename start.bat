@echo off
echo ========================================
echo    MR-GHOST Quick Start Script
echo ========================================
echo.

echo [1/4] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.11+
    pause
    exit /b 1
)
echo ✓ Python found

echo.
echo [2/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo [3/4] Setting up Backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing Python dependencies...
pip install -r requirements.txt >nul 2>&1
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit backend\.env and add your OpenAI API key!
    echo    Or set DEMO_MODE=true to use mock data
    echo.
)
cd ..

echo.
echo [4/4] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
cd ..

echo.
echo ========================================
echo    Setup Complete! 🎉
echo ========================================
echo.
echo To start MR-GHOST:
echo.
echo 1. Backend (Terminal 1):
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn main:app --reload
echo.
echo 2. Frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open http://localhost:3000
echo.
echo ========================================
pause

@REM Made with Bob
