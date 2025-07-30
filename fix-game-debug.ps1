# Debug específico para el problema de game-demo-001
Write-Host "🎮 === DEBUG ESPECÍFICO: game-demo-001 ===" -ForegroundColor Cyan

# 1. Verificar que el backend esté corriendo
Write-Host "`n1️⃣ Verificando Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend respondiendo: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde. Verificar que esté corriendo en puerto 5000" -ForegroundColor Red
    exit 1
}

# 2. Sincronizar datos demo primero
Write-Host "`n2️⃣ Sincronizando datos demo..." -ForegroundColor Yellow
try {
    $syncResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/demo/force-sync" -Method POST
    $syncData = $syncResponse.Content | ConvertFrom-Json
    Write-Host "✅ Sincronización exitosa:" -ForegroundColor Green
    Write-Host "   📊 Juegos cargados: $($syncData.details.games_loaded_count)" -ForegroundColor Cyan
    Write-Host "   📊 Sesiones mock: $($syncData.details.mock_sessions_count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error en sincronización: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Intentar acceso directo a game-demo-001
Write-Host "`n3️⃣ Probando acceso directo a game-demo-001..." -ForegroundColor Yellow
try {
    $headers = @{
        'Authorization' = 'Bearer demo-token-student'
        'Content-Type' = 'application/json'
    }
    
    $gameResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/game/game-demo-001" -Method GET -Headers $headers
    $gameData = $gameResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ ¡ÉXITO! game-demo-001 accesible:" -ForegroundColor Green
    Write-Host "   📝 Título: $($gameData.session.title)" -ForegroundColor Cyan
    Write-Host "   🎯 Status: $($gameData.session.status)" -ForegroundColor Cyan
    Write-Host "   🎮 Formato: $($gameData.session.format)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ ERROR accediendo a game-demo-001:" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "   📊 Código de error: $statusCode" -ForegroundColor Red
        
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            $reader.Close()
            $errorData = $errorBody | ConvertFrom-Json
            Write-Host "   📝 Mensaje: $($errorData.error.message)" -ForegroundColor Red
            Write-Host "   🔍 Código: $($errorData.error.code)" -ForegroundColor Red
        } catch {
            Write-Host "   📝 No se pudo leer el mensaje de error detallado" -ForegroundColor Gray
        }
    } else {
        Write-Host "   📝 Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 4. URLs para testing
Write-Host "`n4️⃣ URLs para testing:" -ForegroundColor Yellow
Write-Host "   🌐 Frontend: http://localhost:3000/student/games/game-demo-001/play" -ForegroundColor Cyan
Write-Host "   🔗 API: http://localhost:5000/api/game/game-demo-001" -ForegroundColor Cyan

Write-Host "`n🏁 Debug completado." -ForegroundColor Green 