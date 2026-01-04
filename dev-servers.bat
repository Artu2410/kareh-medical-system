@echo off
REM Script para iniciar frontend y backend de KAREH Medical System en Windows

REM Abre terminal para el frontend (Vite)
start cmd /k "cd /d %~dp0 && npm run dev"

REM Abre terminal para el backend
start cmd /k "cd /d %~dp0backend && npm run dev"

REM Mensaje de confirmación
ECHO Servidores frontend y backend iniciados en terminales separadas.
ECHO Puedes cerrar esta ventana.
