#!/bin/bash

# 🚀 Script de Deployment para Producción - EDU21
# Este script prepara y despliega la versión de producción

echo "🚀 Iniciando deployment de producción..."

# Verificar que estamos en el branch correcto
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Debes estar en el branch 'main' para hacer deployment de producción"
    echo "   Branch actual: $CURRENT_BRANCH"
    echo "   Ejecuta: git checkout main"
    exit 1
fi

# Verificar que no hay cambios pendientes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Hay cambios pendientes en el repositorio"
    echo "   Ejecuta: git add . && git commit -m 'feat: preparar para producción'"
    exit 1
fi

echo "✅ Verificaciones completadas"

# Limpiar logs de debugging
echo "🧹 Limpiando logs de debugging..."
find . -name "*.tsx" -o -name "*.ts" -o -name "*.js" | xargs grep -l "console.log\|🔍\|DEBUG" | head -10

# Construir para producción
echo "🔨 Construyendo para producción..."
cd client
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en la construcción del frontend"
    exit 1
fi

cd ..

# Construir backend
echo "🔨 Construyendo backend..."
cd server
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en la construcción del backend"
    exit 1
fi

cd ..

# Deploy a Vercel
echo "🚀 Desplegando a Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment completado exitosamente!"
    echo "🌐 URL de producción: https://edu21-platform.vercel.app"
else
    echo "❌ Error en el deployment"
    exit 1
fi

echo "🎉 ¡Deployment de producción completado!" 