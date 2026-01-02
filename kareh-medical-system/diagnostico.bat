@echo off
REM Script de diagnóstico para verificar que todo está corriendo correctamente

setlocal enabledelayedexpansion

echo.
echo ====================================
echo   KAREH - Sistema de Diagnóstico
echo ====================================
echo.

REM Verificar si Node.js está instalado
echo 1. Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js instalado
    node --version
) else (
    echo ❌ Node.js NO está instalado
    echo    Descargalo de: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo 2. Verificando npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm instalado
    npm --version
) else (
    echo ❌ npm NO está instalado
    pause
    exit /b 1
)

echo.
echo 3. Verificando Backend (http://localhost:4000/api/health)...
curl -s http://localhost:4000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend está corriendo
) else (
    echo ❌ Backend NO está corriendo
    echo    Necesitas ejecutar: cd backend && npm start
)

echo.
echo 4. Verificando Frontend (http://localhost:5173)...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend está corriendo
) else (
    echo ❌ Frontend NO está corriendo
    echo    Necesitas ejecutar: npm run dev
)

echo.
echo 5. Verificando base de datos (backend/prisma/dev.db)...
if exist "backend\prisma\dev.db" (
    echo ✅ Base de datos existe
) else (
    echo ❌ Base de datos NO existe
    echo    Necesitas ejecutar: cd backend && npm run prisma:migrate
)

echo.
echo ====================================
echo   FIN DEL DIAGNÓSTICO
echo ====================================
echo.

pause
