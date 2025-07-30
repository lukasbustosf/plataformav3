# Debug detallado del mockGameData
Write-Host "=== DEBUG DETALLADO MOCKGAMEDATA ===" -ForegroundColor Cyan

# Login
$loginData = '{"email":"teacher@demo.edu21.cl","password":"demo123"}'
$loginResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$headers = @{Authorization = "Bearer $($loginResult.token)"}

Write-Host "Login OK" -ForegroundColor Green

# Sincronizar
Write-Host "`n1. Sincronizando..." -ForegroundColor Yellow
$syncResult = Invoke-RestMethod -Uri "http://localhost:5000/api/demo/force-sync" -Method POST -Headers $headers

Write-Host "Sync Response:" -ForegroundColor White
Write-Host "  - Success: $($syncResult.success)" -ForegroundColor White
Write-Host "  - Games loaded: $($syncResult.details.games_loaded)" -ForegroundColor White
Write-Host "  - Demo sessions count: $($syncResult.details.demo_sessions_count)" -ForegroundColor White
Write-Host "  - Mock sessions count: $($syncResult.details.mock_sessions_count)" -ForegroundColor White
Write-Host "  - Test session found: $($syncResult.details.test_session_found)" -ForegroundColor White

# Probar IDs específicos generados automáticamente
Write-Host "`n2. Probando IDs calculados..." -ForegroundColor Yellow

for ($i = 1; $i -le 5; $i++) {
    $gameNumber = $i.ToString().PadLeft(3, '0')
    $gameId = "game-demo-$gameNumber"
    
    Write-Host "Probando: $gameId" -ForegroundColor White
    
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:5000/api/game/$gameId" -Method GET -Headers $headers
        Write-Host "  ✅ ENCONTRADO: $($result.session.title)" -ForegroundColor Green
        Write-Host "  📋 Session ID: $($result.session.session_id)" -ForegroundColor Cyan
        Write-Host "  🎯 Join Code: $($result.session.join_code)" -ForegroundColor Cyan
        Write-Host "  📊 Status: $($result.session.status)" -ForegroundColor Cyan
        break
    } catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -like "*404*") {
            Write-Host "  ❌ No encontrado (404)" -ForegroundColor Red
        } else {
            Write-Host "  ❌ Error: $errorMsg" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== FIN DEBUG ===" -ForegroundColor Cyan 