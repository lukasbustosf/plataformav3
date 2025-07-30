Write-Host "=== TESTING SESSION ID FIX ===" -ForegroundColor Cyan
Write-Host "1. Creando evaluación gamificada..." -ForegroundColor Yellow

$evalData = @{
    class_id = "550e8400-e29b-41d4-a716-446655440002"
    title = "Test Fix $(Get-Date -Format 'HH:mm:ss')"
    subject = "Matemáticas"
    grade = "1B"
    game_format = "ENG01"
    engine_id = "ENG01"
    engine_config = @{
        difficulty = "easy"
        range = @{ min = 1; max = 10 }
    }
    skin_theme = "granja"
    time_limit_minutes = 15
    questions = @(
        @{
            text = "Cuenta de 1 a 5"
            type = "counter"
            correct_answer = "5"
            points = 10
        }
    )
} | ConvertTo-Json -Depth 3

$headers = @{
    "Authorization" = "Bearer demo-token-teacher"
    "Content-Type" = "application/json"
}

try {
    # Crear evaluación
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/evaluation/gamified" -Method POST -Headers $headers -Body $evalData
    Write-Host "Evaluación creada: $($response.evaluation_id)" -ForegroundColor Green

    # Iniciar juego
    Write-Host "2. Iniciando sesión de juego..." -ForegroundColor Yellow
    $gameResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/evaluation/gamified/$($response.evaluation_id)/start-game" -Method POST -Headers $headers
    $sessionId = $gameResponse.gameSession.session_id
    Write-Host "Sesión creada: $sessionId" -ForegroundColor Green

    # Probar ambos IDs
    $idSinPrefijo = $sessionId -replace "^game_", ""
    Write-Host "3. Probando acceso..." -ForegroundColor Yellow
    Write-Host "ID completo: $sessionId" -ForegroundColor White
    Write-Host "ID sin prefijo: $idSinPrefijo" -ForegroundColor White

    $studentHeaders = @{
        "Authorization" = "Bearer demo-token-student"
    }

    # Test 1: ID completo
    try {
        $test1 = Invoke-RestMethod -Uri "http://localhost:5000/api/game/$sessionId" -Headers $studentHeaders
        Write-Host "✅ GET con ID completo: FUNCIONA" -ForegroundColor Green
    } catch {
        Write-Host "❌ GET con ID completo: FALLA" -ForegroundColor Red
    }

    # Test 2: ID sin prefijo
    try {
        $test2 = Invoke-RestMethod -Uri "http://localhost:5000/api/game/$idSinPrefijo" -Headers $studentHeaders
        Write-Host "✅ GET sin prefijo: FUNCIONA" -ForegroundColor Green
    } catch {
        Write-Host "❌ GET sin prefijo: FALLA" -ForegroundColor Red
    }

    Write-Host "`nURLs para probar manualmente:" -ForegroundColor Yellow
    Write-Host "http://localhost:3000/student/games/$sessionId/play" -ForegroundColor Cyan
    Write-Host "http://localhost:3000/student/games/$idSinPrefijo/play" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completado" -ForegroundColor Cyan 