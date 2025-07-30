# Test sync script
Write-Host "Iniciando sincronizacion..." -ForegroundColor Green

# Login
$loginData = '{"email":"teacher@demo.edu21.cl","password":"demo123"}'
$loginResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"

Write-Host "Login OK - Token obtenido" -ForegroundColor Green

# Sync (cambiar a POST)
$headers = @{Authorization = "Bearer $($loginResult.token)"}
$syncResult = Invoke-RestMethod -Uri "http://localhost:5000/api/demo/force-sync" -Method POST -Headers $headers

Write-Host "Sync OK - Juegos: $($syncResult.details.games_loaded)" -ForegroundColor Green

# Test game
$gameResult = Invoke-RestMethod -Uri "http://localhost:5000/api/game/game-demo-001" -Method GET -Headers $headers

Write-Host "Game OK - $($gameResult.data.name)" -ForegroundColor Green
Write-Host "Listo! Ve a http://localhost:3000/login" -ForegroundColor Yellow 