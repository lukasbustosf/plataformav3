# Debug script para game-demo-001
Write-Host "Debuggeando game-demo-001..." -ForegroundColor Cyan

# Login
$loginData = '{"email":"teacher@demo.edu21.cl","password":"demo123"}'
$loginResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$headers = @{Authorization = "Bearer $($loginResult.token)"}

Write-Host "Login OK" -ForegroundColor Green

# 1. Verificar sincronización
Write-Host "1. Verificando sincronización..." -ForegroundColor Yellow
$syncResult = Invoke-RestMethod -Uri "http://localhost:5000/api/demo/force-sync" -Method POST -Headers $headers
Write-Host "Juegos sincronizados: $($syncResult.details.games_loaded)" -ForegroundColor Green
Write-Host "Demo sessions: $($syncResult.details.demo_sessions_count)" -ForegroundColor Green
Write-Host "Test session found: $($syncResult.details.test_session_found)" -ForegroundColor Green

# 2. Probar diferentes IDs
Write-Host "`n2. Probando diferentes game IDs..." -ForegroundColor Yellow

$gameIds = @("game-demo-001", "game-demo-01", "DEMO001", "1")

foreach ($gameId in $gameIds) {
    try {
        Write-Host "Probando: $gameId" -ForegroundColor White
        $result = Invoke-RestMethod -Uri "http://localhost:5000/api/game/$gameId" -Method GET -Headers $headers
        Write-Host "  ✅ ENCONTRADO: $($result.session.title)" -ForegroundColor Green
        break
    } catch {
        Write-Host "  ❌ No encontrado: $gameId" -ForegroundColor Red
    }
}

Write-Host "`nDebug completado." -ForegroundColor Cyan 