# Script simplificado para sincronizar datos demo
Write-Host "🔄 Sincronizando datos demo de EDU21..." -ForegroundColor Cyan

# 1. Login
Write-Host "1️⃣  Haciendo login..." -ForegroundColor Yellow
$loginBody = '{"email":"teacher@demo.edu21.cl","password":"demo123"}'

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"

if ($loginResponse.token) {
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    $token = $loginResponse.token
} else {
    Write-Host "❌ Error en login" -ForegroundColor Red
    exit 1
}

# 2. Sincronizar datos
Write-Host "2️⃣  Sincronizando datos..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

$syncResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/demo/force-sync" -Method GET -Headers $headers

Write-Host "✅ Sincronización exitosa" -ForegroundColor Green
Write-Host "📊 Juegos: $($syncResponse.games_loaded)" -ForegroundColor Cyan

# 3. Probar game-demo-001
Write-Host "3️⃣  Probando game-demo-001..." -ForegroundColor Yellow
$gameResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/game/game-demo-001" -Method GET -Headers $headers

Write-Host "✅ Game encontrado: $($gameResponse.data.name)" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 ¡Listo! Ahora ve a:" -ForegroundColor Green
Write-Host "   http://localhost:3000/login" -ForegroundColor White
Write-Host "   Usa: teacher@demo.edu21.cl / demo123" -ForegroundColor White
Write-Host "" 