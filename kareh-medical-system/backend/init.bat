@echo off
REM Script de inicialización para Kareh Medical System Backend en Windows

echo 🔧 Inicializando Kareh Medical System Backend...
echo.

cd /d "%~dp0"

echo 1. Instalando dependencias...
call npm install

echo.
echo 2. Generando cliente Prisma...
call npm run prisma:generate

echo.
echo 3. Ejecutando migraciones de base de datos...
call npm run prisma:migrate

if errorlevel 1 (
    echo.
    echo ⚠️  Las migraciones fallaron. Intentando resetear la base de datos...
    echo Esto borrará todos los datos existentes.
    set /p CONFIRM="¿Deseas continuar? (s/n): "
    
    if /i "%CONFIRM%"=="s" (
        call npm run prisma:reset
        if errorlevel 1 (
            echo ❌ Error al resetear la base de datos
            exit /b 1
        ) else (
            echo ✅ Base de datos reseteada exitosamente
        )
    )
)

echo.
echo ✅ Inicialización completada
echo.
echo Para iniciar el servidor, ejecuta:
echo npm start
echo.
pause
