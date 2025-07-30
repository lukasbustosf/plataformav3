#!/usr/bin/env pwsh

Write-Host "🧪 === TESTING SESSION ID FIX ===" -ForegroundColor Cyan
Write-Host "Este script probará que el fix de IDs de sesión funciona correctamente" -ForegroundColor Gray

$baseUrl = "http://localhost:5000"
$frontendUrl = "http://localhost:3000"

# Headers para las requests
$teacherHeaders = @{
    "Authorization" = "Bearer demo-token-teacher"
    "Content-Type" = "application/json"
}

$studentHeaders = @{
    "Authorization" = "Bearer demo-token-student"
}

try {
    Write-Host "`n1️⃣ Verificando que el servidor esté ejecutándose..." -ForegroundColor Yellow
    
    $healthCheck = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -ErrorAction Stop
    Write-Host "✅ Servidor funcionando correctamente" -ForegroundColor Green
    
    Write-Host "`n2️⃣ Creando evaluación gamificada..." -ForegroundColor Yellow
    
    $evalBody = @{
        title = "Test Session ID Fix - $(Get-Date -Format 'HH:mm:ss')"
        subject = "Matemáticas"
        grade = "1B"
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
    
    $evalResponse = Invoke-WebRequest -Uri "$baseUrl/api/evaluation/gamified" -Method POST -Headers $teacherHeaders -Body $evalBody -ErrorAction Stop
    $evalData = $evalResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Evaluación creada: $($evalData.evaluation_id)" -ForegroundColor Green
    
    Write-Host "`n3️⃣ Iniciando sesión de juego..." -ForegroundColor Yellow
    
    $gameResponse = Invoke-WebRequest -Uri "$baseUrl/api/evaluation/gamified/$($evalData.evaluation_id)/start-game" -Method POST -Headers $teacherHeaders -ErrorAction Stop
    $gameData = $gameResponse.Content | ConvertFrom-Json
    $sessionId = $gameData.gameSession.session_id
    
    Write-Host "✅ Sesión de juego creada: $sessionId" -ForegroundColor Green
    
    # Extraer ID con y sin prefijo
    $idCompleto = $sessionId
    $idSinPrefijo = $sessionId -replace "^game_", ""
    
    Write-Host "`n🔍 IDs a probar:" -ForegroundColor Cyan
    Write-Host "   ID Completo: $idCompleto" -ForegroundColor White
    Write-Host "   ID Sin Prefijo: $idSinPrefijo" -ForegroundColor White
    
    Write-Host "`n4️⃣ Probando GET con ID completo..." -ForegroundColor Yellow
    
    try {
        $getResponse1 = Invoke-WebRequest -Uri "$baseUrl/api/game/$idCompleto" -Headers $studentHeaders -ErrorAction Stop
        $data1 = $getResponse1.Content | ConvertFrom-Json
        Write-Host "✅ ÉXITO con ID completo: $($data1.session.title)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ FALLÓ con ID completo: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "`n5️⃣ Probando GET sin prefijo..." -ForegroundColor Yellow
    
    try {
        $getResponse2 = Invoke-WebRequest -Uri "$baseUrl/api/game/$idSinPrefijo" -Headers $studentHeaders -ErrorAction Stop
        $data2 = $getResponse2.Content | ConvertFrom-Json
        Write-Host "✅ ÉXITO sin prefijo: $($data2.session.title)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ FALLÓ sin prefijo: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "`n6️⃣ Probando POST start con ID completo..." -ForegroundColor Yellow
    
    try {
        $startResponse1 = Invoke-WebRequest -Uri "$baseUrl/api/game/$idCompleto/start" -Method POST -Headers $teacherHeaders -ErrorAction Stop
        Write-Host "✅ START funciona con ID completo" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ START falla con ID completo: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "`n7️⃣ Probando POST start sin prefijo..." -ForegroundColor Yellow
    
    try {
        $startResponse2 = Invoke-WebRequest -Uri "$baseUrl/api/game/$idSinPrefijo/start" -Method POST -Headers $teacherHeaders -ErrorAction Stop
        Write-Host "✅ START funciona sin prefijo" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ START falla sin prefijo: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "`n🎯 RESULTADO DEL TEST:" -ForegroundColor Cyan
    Write-Host "📋 Evaluación ID: $($evalData.evaluation_id)" -ForegroundColor White
    Write-Host "🎮 Sesión ID completo: $idCompleto" -ForegroundColor White
    Write-Host "🎮 Sesión ID sin prefijo: $idSinPrefijo" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 URLs para probar manualmente:" -ForegroundColor Yellow
    Write-Host "   Con prefijo:    $frontendUrl/student/games/$idCompleto/play" -ForegroundColor Cyan
    Write-Host "   Sin prefijo:    $frontendUrl/student/games/$idSinPrefijo/play" -ForegroundColor Cyan
    
    Write-Host "`n💡 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Abre una de las URLs de arriba en tu navegador" -ForegroundColor White
    Write-Host "2. Debería cargar el juego correctamente" -ForegroundColor White
    Write-Host "3. Si hay errores, verifica la consola del navegador" -ForegroundColor White
}
catch {
    Write-Host "`n💥 ERROR en test: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalles: $($_.Exception)" -ForegroundColor DarkRed
    
    Write-Host "`n🔧 Verificaciones:" -ForegroundColor Yellow
    Write-Host "1. ¿Está el servidor ejecutándose en puerto 5000?" -ForegroundColor White
    Write-Host "2. ¿Está el frontend ejecutándose en puerto 3000?" -ForegroundColor White
    Write-Host "3. ¿Hay errores en la consola del servidor?" -ForegroundColor White
}

Write-Host "`nTest completado" -ForegroundColor Cyan 