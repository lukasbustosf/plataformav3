# Script para sincronizar datos demo de EDU21
Write-Host "🔄 Sincronizando datos demo de EDU21..." -ForegroundColor Cyan

# 1. Login para obtener token
Write-Host "1️⃣  Obteniendo token de autenticación..." -ForegroundColor Yellow
$loginData = @{
    email = "teacher@demo.edu21.cl"
    password = "demo123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Token obtenido exitosamente" -ForegroundColor Green
} 
catch {
    Write-Host "❌ Error al obtener token: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔍 ¿Está el servidor corriendo en puerto 5000?" -ForegroundColor Yellow
    exit 1
}

# 2. Sincronizar datos demo
Write-Host "2️⃣  Sincronizando datos demo..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $syncResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/demo/force-sync" -Method GET -Headers $headers
    Write-Host "✅ Datos demo sincronizados exitosamente" -ForegroundColor Green
    Write-Host "📊 Juegos cargados: $($syncResponse.games_loaded)" -ForegroundColor Cyan
    Write-Host "🎮 Test session encontrada: $($syncResponse.test_session_found)" -ForegroundColor Cyan
} 
catch {
    Write-Host "❌ Error al sincronizar datos: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Verificar que game-demo-001 existe
Write-Host "3️⃣  Verificando game-demo-001..." -ForegroundColor Yellow
try {
    $gameResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/game/game-demo-001" -Method GET -Headers $headers
    Write-Host "✅ game-demo-001 encontrado exitosamente" -ForegroundColor Green
    Write-Host "🎯 Título del juego: $($gameResponse.data.name)" -ForegroundColor Cyan
} 
catch {
    Write-Host "❌ Error al verificar game-demo-001: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 ¡Sincronización completa! Ahora puedes:" -ForegroundColor Green
Write-Host "   1. Ir a: http://localhost:3000/login" -ForegroundColor White
Write-Host "   2. Iniciar sesión: teacher@demo.edu21.cl / demo123" -ForegroundColor White  
Write-Host "   3. Ir a: http://localhost:3000/student/games/game-demo-001/play" -ForegroundColor White
Write-Host "" 