# RESTART COMPLETO - Forzar actualización de cache de esquema
Write-Host "🔄 REINICIO COMPLETO DEL SISTEMA EDU21" -ForegroundColor Yellow

# Paso 1: Matar todos los procesos
Write-Host "1. Matando procesos existentes..." -ForegroundColor Blue
Stop-Process -Name "node" -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Paso 2: Limpiar puertos
Write-Host "2. Liberando puertos..." -ForegroundColor Blue
$ports = @(3000, 5000)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process -ErrorAction SilentlyContinue
        Write-Host "   Puerto $port liberado" -ForegroundColor Green
    }
}

Start-Sleep -Seconds 3

# Paso 3: Reiniciar servidor con cache fresco
Write-Host "3. Iniciando servidor..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "cd server; npm run dev" -WindowStyle Normal

# Paso 4: Esperar y verificar servidor
Write-Host "4. Esperando servidor..." -ForegroundColor Blue
Start-Sleep -Seconds 10

# Paso 5: Probar conexión
Write-Host "5. Probando conexión..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Servidor funcionando!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Servidor todavía iniciando..." -ForegroundColor Yellow
}

# Paso 6: Iniciar cliente
Write-Host "6. Iniciando cliente..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "cd client; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "🎉 REINICIO COMPLETO INICIADO" -ForegroundColor Green
Write-Host "📝 Espera 30 segundos y luego prueba:" -ForegroundColor Yellow
Write-Host "   - Backend: http://localhost:5000/health" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Para probar: node test-simple.js" -ForegroundColor Cyan

Read-Host "Presiona Enter para continuar..." 