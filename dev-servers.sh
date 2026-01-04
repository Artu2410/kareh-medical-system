#!/bin/bash

echo ""
echo "===================================="
echo "  KAREH Medical System - Dev Server"
echo "===================================="
echo ""

cd "$(dirname "$0")"

echo "Iniciando Backend en puerto 4000..."
(cd backend && npm start) &
BACKEND_PID=$!

echo "Esperando a que el Backend esté listo..."
sleep 3

echo "Iniciando Frontend en puerto 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "===================================="
echo "✅ Servidores iniciados:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:4000"
echo "===================================="
echo ""
echo "Presiona Ctrl+C para detener los servidores"
echo ""

# Esperar a que se presione Ctrl+C
wait

diagnostico.bat
