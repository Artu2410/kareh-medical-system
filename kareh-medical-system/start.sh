#!/bin/bash

# 🚀 QUICK START - KAREH PRO
# Script rápido para iniciar el proyecto

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🏥 KAREH PRO - SISTEMA MÉDICO PREMIUM             ║"
echo "║                     QUICK START SCRIPT                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "📥 Instálalo desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Preguntar si instalar dependencias
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias (npm install)..."
    npm install
    echo "✅ Dependencias instaladas"
else
    echo "✅ Dependencias ya instaladas"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                🚀 INICIANDO SERVIDOR                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "👉 El servidor estará disponible en: http://localhost:5173"
echo "💡 Presiona Ctrl+C para detener el servidor"
echo ""

npm run dev
