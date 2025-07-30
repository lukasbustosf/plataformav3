Write-Host "🔄 REINICIANDO SISTEMA COMPLETO EDU21" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow

# Detener todos los procesos de Node.js
Write-Host "🛑 Deteniendo procesos anteriores..." -ForegroundColor Red
try {
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Procesos detenidos" -ForegroundColor Green
} catch {
    Write-Host "⚠️ No había procesos previos corriendo" -ForegroundColor Yellow
}

Start-Sleep 2

# Iniciar servidor backend
Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd '$PWD\server'; node index.js" -WindowStyle Normal

Start-Sleep 3

# Iniciar cliente frontend
Write-Host "🌐 Iniciando cliente frontend..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd '$PWD\client'; npm run dev" -WindowStyle Normal

Start-Sleep 5

Write-Host "✅ SISTEMA INICIADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

Write-Host "🎮 SESIONES OA1 DISPONIBLES:" -ForegroundColor Magenta
Write-Host "1. 🐣 Pollitos: http://localhost:3000/student/games/oa1-pollitos-demo/play" -ForegroundColor White
Write-Host "2. 🐔 Gallinas: http://localhost:3000/student/games/oa1-gallinas-demo/play" -ForegroundColor White
Write-Host "3. 🐄 Vacas: http://localhost:3000/student/games/oa1-vacas-demo/play" -ForegroundColor White
Write-Host "4. 🚜 Granjero: http://localhost:3000/student/games/oa1-granjero-demo/play" -ForegroundColor White

Write-Host "`n🔍 Para probar las sesiones ejecuta: node probar-sesiones-oa1-finales.js" -ForegroundColor Yellow
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan 