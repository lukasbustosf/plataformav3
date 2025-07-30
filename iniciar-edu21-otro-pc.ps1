# 🌟 EDU21 - Script de Inicio Rápido
# Para usar en el otro PC después de clonar el repositorio

Write-Host "🌟 Iniciando Plataforma EDU21..." -ForegroundColor Green

# Verificar que estemos en el directorio correcto
if (!(Test-Path "server") -or !(Test-Path "client")) {
    Write-Host "❌ Error: Ejecuta este script desde la carpeta raíz del proyecto" -ForegroundColor Red
    Write-Host "📂 Asegúrate de estar en: plataforma-edu21" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Directorio correcto detectado" -ForegroundColor Green

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "📥 Descarga desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Instalar dependencias si es necesario
Write-Host "🔧 Verificando dependencias..." -ForegroundColor Yellow

if (!(Test-Path "server\node_modules")) {
    Write-Host "📦 Instalando dependencias del servidor..." -ForegroundColor Yellow
    cd server
    npm install
    cd ..
}

if (!(Test-Path "client\node_modules")) {
    Write-Host "📦 Instalando dependencias del cliente..." -ForegroundColor Yellow
    cd client
    npm install
    cd ..
}

Write-Host "✅ Dependencias verificadas" -ForegroundColor Green

# Iniciar servicios
Write-Host "🚀 Iniciando servicios EDU21..." -ForegroundColor Green
Write-Host "🔧 Servidor: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 Cliente: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🎮 Juego OA1 V2: http://localhost:3000/student/games/oa1-v2-demo/play" -ForegroundColor Cyan

# Abrir dos terminales
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; Write-Host '🔧 Servidor EDU21 - Puerto 5000' -ForegroundColor Green; node index.js"
Start-Sleep 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; Write-Host '🌐 Cliente EDU21 - Puerto 3000' -ForegroundColor Blue; npm run dev"

Write-Host "🎉 EDU21 iniciado correctamente!" -ForegroundColor Green
Write-Host "⏳ Espera 30 segundos y ve a: http://localhost:3000" -ForegroundColor Yellow