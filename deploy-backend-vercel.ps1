# Script para desplegar el backend en Vercel
Write-Host "🚀 DESPLEGANDO BACKEND EN VERCEL" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Verificar si Vercel CLI está instalado
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI no encontrado. Instalando..." -ForegroundColor Red
    npm install -g vercel
}

# Navegar al directorio del servidor
Set-Location "server"

Write-Host "📁 Directorio actual: $(Get-Location)" -ForegroundColor Yellow

# Verificar archivos necesarios
$requiredFiles = @("index.js", "vercel.json", "package.json")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ $file NO encontrado" -ForegroundColor Red
        exit 1
    }
}

# Desplegar en Vercel
Write-Host "🚀 Iniciando despliegue..." -ForegroundColor Yellow

try {
    # Desplegar con configuración automática
    vercel --prod --yes
    
    Write-Host "✅ Backend desplegado exitosamente" -ForegroundColor Green
    Write-Host "🔗 URL del backend: https://plataformav3-server.vercel.app" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error en el despliegue: $_" -ForegroundColor Red
    Write-Host "💡 Intenta ejecutar 'vercel' manualmente en el directorio server/" -ForegroundColor Yellow
}

# Volver al directorio raíz
Set-Location ".."

Write-Host "🎯 PASOS SIGUIENTES:" -ForegroundColor Cyan
Write-Host "1. Verifica que el backend esté funcionando" -ForegroundColor White
Write-Host "2. Actualiza las URLs en client/vercel.json si es necesario" -ForegroundColor White
Write-Host "3. Vuelve a desplegar el frontend" -ForegroundColor White 