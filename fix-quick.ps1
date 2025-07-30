# 🔧 ARREGLO RÁPIDO DEL SERVIDOR
Write-Host "🔧 ARREGLANDO SERVIDOR..." -ForegroundColor Cyan

# 1. Limpiar procesos
Write-Host "1. Terminando procesos Node.js..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# 2. Verificar puerto
Write-Host "2. Verificando puerto 5000..." -ForegroundColor Yellow
$port = netstat -ano | Select-String ":5000.*LISTENING"
if ($port) { 
    Write-Host "   ❌ Puerto ocupado" -ForegroundColor Red 
} else { 
    Write-Host "   ✅ Puerto libre" -ForegroundColor Green 
}

# 3. Ir al servidor
Write-Host "3. Iniciando servidor..." -ForegroundColor Yellow
Set-Location server

# 4. Iniciar servidor en nueva ventana
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

# 5. Esperar e ir al cliente
Start-Sleep -Seconds 3
Set-Location ../client

# 6. Iniciar cliente en nueva ventana
Write-Host "4. Iniciando cliente..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Set-Location ..

Write-Host "✅ COMPLETADO - Revisar ventanas abiertas" -ForegroundColor Green
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "   http://localhost:5000/health" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor White 