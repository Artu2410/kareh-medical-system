#!/bin/bash

echo "🔧 Inicializando Kareh Medical System..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd "$(dirname "$0")"

echo -e "${YELLOW}1. Instalando dependencias...${NC}"
npm install

echo ""
echo -e "${YELLOW}2. Generando cliente Prisma...${NC}"
npm run prisma:generate

echo ""
echo -e "${YELLOW}3. Ejecutando migraciones de base de datos...${NC}"
npm run prisma:migrate

if [ $? -ne 0 ]; then
    echo -e "${RED}⚠️  Las migraciones fallaron. Intentando resetear la base de datos...${NC}"
    echo "Esto borrará todos los datos existentes."
    read -p "¿Deseas continuar? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        npm run prisma:reset
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Base de datos reseteada exitosamente${NC}"
        else
            echo -e "${RED}❌ Error al resetear la base de datos${NC}"
            exit 1
        fi
    fi
fi

echo ""
echo -e "${GREEN}✅ Inicialización completada${NC}"
echo ""
echo "Para iniciar el servidor, ejecuta:"
echo -e "${YELLOW}npm start${NC}"
