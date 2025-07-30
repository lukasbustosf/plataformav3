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

# 3. Verificar juegos demo disponibles
Write-Host "`n3️⃣ Verificando juegos demo disponibles..." -ForegroundColor Yellow
try {
    $demosResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/game/demos" -Method GET
    $demosData = $demosResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Juegos demo encontrados: $($demosData.total)" -ForegroundColor Green
    
    # Buscar específicamente game-demo-001
    $gameDemo001 = $demosData.sessions | Where-Object { $_.session_id -eq 'game-demo-001' }
    
    if ($gameDemo001) {
        Write-Host "✅ game-demo-001 ENCONTRADO en /api/game/demos:" -ForegroundColor Green
        Write-Host "   📝 Título: $($gameDemo001.title)" -ForegroundColor Cyan
        Write-Host "   🎯 Status: $($gameDemo001.status)" -ForegroundColor Cyan
        Write-Host "   🎮 Formato: $($gameDemo001.format)" -ForegroundColor Cyan
        Write-Host "   🏫 School ID: $($gameDemo001.school_id)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ game-demo-001 NO encontrado en /api/game/demos" -ForegroundColor Red
        Write-Host "📝 Sesiones disponibles:" -ForegroundColor Yellow
        $demosData.sessions | ForEach-Object { 
            Write-Host "   - $($_.session_id): $($_.title)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Error obteniendo demos: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Intentar acceso directo a game-demo-001
Write-Host "`n4️⃣ Probando acceso directo a game-demo-001..." -ForegroundColor Yellow
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
            $errorContent = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorContent)
            $errorBody = $reader.ReadToEnd()
            $errorData = $errorBody | ConvertFrom-Json
            Write-Host "   📝 Mensaje: $($errorData.error.message)" -ForegroundColor Red
            Write-Host "   🔍 Código: $($errorData.error.code)" -ForegroundColor Red
        } catch {
            Write-Host "   📝 No se pudo leer el mensaje de error" -ForegroundColor Gray
        }
    } else {
        Write-Host "   📝 Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 5. Verificar si es problema de autorización
Write-Host "`n5️⃣ Probando sin autorización..." -ForegroundColor Yellow
try {
    $noAuthResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/game/game-demo-001" -Method GET
    Write-Host "✅ Sin autorización también funciona" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode
    Write-Host "❌ Error sin autorización: $statusCode" -ForegroundColor Red
    if ($statusCode -eq 401) {
        Write-Host "   📝 Problema de autorización confirmado" -ForegroundColor Yellow
    } elseif ($statusCode -eq 404) {
        Write-Host "   📝 Sesión no encontrada (mismo problema)" -ForegroundColor Yellow
    }
}

# 6. URL del frontend para testing
Write-Host "`n6️⃣ URLs para testing:" -ForegroundColor Yellow
Write-Host "   🌐 Frontend: http://localhost:3000/student/games/game-demo-001/play" -ForegroundColor Cyan
Write-Host "   🔗 API: http://localhost:5000/api/game/game-demo-001" -ForegroundColor Cyan
Write-Host "   📝 Demos: http://localhost:5000/api/game/demos" -ForegroundColor Cyan

Write-Host "`n🏁 Debug completado." -ForegroundColor Green 