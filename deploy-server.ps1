# Script para desplegar el servidor backend a Vercel
Write-Host "🚀 Desplegando servidor backend a Vercel..." -ForegroundColor Green

# Navegar al directorio del servidor
Set-Location "server"

# Verificar que estamos en el directorio correcto
if (Test-Path "index.js") {
    Write-Host "✅ Encontrado index.js en el directorio actual" -ForegroundColor Green
} else {
    Write-Host "❌ Error: No se encontró index.js" -ForegroundColor Red
    exit 1
}

# Instalar dependencias si es necesario
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules ya existe" -ForegroundColor Green
} else {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Desplegar a Vercel
Write-Host "🌐 Desplegando a Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Despliegue completado!" -ForegroundColor Green
Write-Host "🔗 URL del servidor: https://plataformav3-server.vercel.app" -ForegroundColor Cyan 