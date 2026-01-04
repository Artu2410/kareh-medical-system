@echo off
REM Script para ejecutar Frontend y Backend simultáneamente en Windows
REM Este script abre dos ventanas de terminal: una para el backend y otra para el frontend

echo.
echo ====================================
echo   KAREH Medical System - Dev Server
echo ====================================
echo.

REM Obtener la ruta del directorio raíz
cd /d "%~dp0"

REM Abrir terminal para el Backend
echo Iniciando Backend en puerto 4000...
start cmd /k "cd /d %CD%\backend && npm start"

REM Esperar un poco para que el backend arranque
timeout /t 3 /nobreak

REM Abrir terminal para el Frontend
echo Iniciando Frontend en puerto 5173...
start cmd /k "cd /d %CD% && npm run dev"

echo.
echo ====================================
echo ✅ Servidores iniciados:
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:4000
echo ====================================
echo.
echo Verifica en la consola que ambos estén corriendo correctamente.
echo.
