# Script para iniciar el sistema EDU21 con actividades del laboratorio
# Uso: .\iniciar-sistema-actividades.ps1

Write-Host "🚀 INICIANDO SISTEMA EDU21 - ACTIVIDADES LAB" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "server\index.js")) {
    Write-Host "❌ Error: No se encuentra server\index.js" -ForegroundColor Red
    Write-Host "Asegúrate de estar en el directorio raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

# Verificar que el archivo .env existe
if (-not (Test-Path "server\.env")) {
    Write-Host "❌ Error: No se encuentra server\.env" -ForegroundColor Red
    Write-Host "Ejecuta primero la configuración del .env" -ForegroundColor Yellow
    exit 1
}

# Verificar que el archivo .env tenga NODE_ENV=development
$envContent = Get-Content "server\.env" -Raw
if ($envContent -notmatch "NODE_ENV=development") {
    Write-Host "⚠️ Advertencia: NODE_ENV no está configurado como 'development'" -ForegroundColor Yellow
    Write-Host "Esto puede causar problemas con la autenticación demo" -ForegroundColor Yellow
}

# Verificar que DATABASE_URL esté configurada
if ($envContent -notmatch "DATABASE_URL=") {
    Write-Host "⚠️ Advertencia: DATABASE_URL no está configurada" -ForegroundColor Yellow
    Write-Host "Esto puede causar problemas con la base de datos" -ForegroundColor Yellow
}

# Terminar procesos existentes
Write-Host "🔄 Terminando procesos existentes..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null

# Esperar un momento
Start-Sleep -Seconds 2

# Iniciar servidor backend
Write-Host "🔧 Iniciando servidor backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; node index.js" -WindowStyle Normal

# Esperar a que el servidor se inicie
Write-Host "⏳ Esperando que el servidor se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Verificar que el servidor esté corriendo
$backendRunning = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/lab/activities" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 401) {
            $backendRunning = $true
            break
        }
    } catch {
        # Esperar un poco más
        Start-Sleep -Seconds 1
    }
}

if ($backendRunning) {
    Write-Host "✅ Servidor backend iniciado correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error: Servidor backend no responde" -ForegroundColor Red
    Write-Host "Verifica los logs en la ventana del servidor" -ForegroundColor Yellow
}

# Iniciar frontend
Write-Host "🔧 Iniciando frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WindowStyle Normal

# Esperar a que el frontend se inicie
Write-Host "⏳ Esperando que el frontend se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar que el frontend esté corriendo
$frontendRunning = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $frontendRunning = $true
            break
        }
    } catch {
        # Esperar un poco más
        Start-Sleep -Seconds 1
    }
}

if ($frontendRunning) {
    Write-Host "✅ Frontend iniciado correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error: Frontend no responde" -ForegroundColor Red
    Write-Host "Verifica los logs en la ventana del frontend" -ForegroundColor Yellow
}

# Mostrar información final
Write-Host "`n🎯 SISTEMA INICIADO" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`n📋 Para ver las actividades:" -ForegroundColor Yellow
Write-Host "1. Ve a http://localhost:3000/login" -ForegroundColor White
Write-Host "2. Usa: teacher@demo.edu21.cl / demo123" -ForegroundColor White
Write-Host "3. Ve a http://localhost:3000/teacher/labs/activities" -ForegroundColor White
Write-Host "`n🔍 Para diagnosticar problemas:" -ForegroundColor Yellow
Write-Host "node test-diagnostico-rapido.js" -ForegroundColor White

# Abrir el navegador automáticamente
Write-Host "`n🌐 Abriendo navegador..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/login"

Write-Host "`n✅ Sistema iniciado correctamente!" -ForegroundColor Green 