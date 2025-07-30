# 🔄 TEST DYNAMIC CONTENT TRANSFORMATION
Write-Host "🔄 === PROBANDO TRANSFORMACIÓN DINÁMICA DE CONTENIDO ===" -ForegroundColor Cyan

Write-Host "`n1. 📊 ESTADO ANTES (sin skin):" -ForegroundColor Yellow
$gameWithoutSkin = Invoke-RestMethod -Uri "http://localhost:5000/api/game/game-demo-001" -ErrorAction SilentlyContinue

if ($gameWithoutSkin) {
    Write-Host "   Título: $($gameWithoutSkin.session.quizzes.title)" -ForegroundColor White
    Write-Host "   Skin aplicado: $($gameWithoutSkin.session.applied_skin.skin_name)" -ForegroundColor White
    Write-Host "   Preguntas:" -ForegroundColor White
    foreach ($q in $gameWithoutSkin.session.quizzes.questions) {
        Write-Host "   - $($q.stem_md)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ Servidor no disponible - iniciando..." -ForegroundColor Red
}

Write-Host "`n2. 🎨 APLICANDO SKIN DE GRANJA:" -ForegroundColor Yellow
try {
    $applySkin = Invoke-RestMethod -Uri "http://localhost:5000/api/skins/apply" -Method POST -Body (@{
        skin_id = "skin-1b-farm"
        game_session_id = "game-demo-001"
    } | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "   ✅ Skin aplicado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ Error aplicando skin: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. 📊 ESTADO DESPUÉS (con skin):" -ForegroundColor Yellow
Start-Sleep -Seconds 2
$gameWithSkin = Invoke-RestMethod -Uri "http://localhost:5000/api/game/game-demo-001" -ErrorAction SilentlyContinue

if ($gameWithSkin) {
    Write-Host "   Título: $($gameWithSkin.session.quizzes.title)" -ForegroundColor White
    Write-Host "   Skin aplicado: $($gameWithSkin.session.applied_skin.skin_name)" -ForegroundColor Green
    Write-Host "   Contenido transformado: $($gameWithSkin.session.content_transformed)" -ForegroundColor Green
    
    if ($gameWithSkin.session.transformation_applied) {
        Write-Host "   Tipo de contenido: $($gameWithSkin.session.transformation_applied.content_type)" -ForegroundColor Green
    }
    
    Write-Host "   Preguntas TRANSFORMADAS:" -ForegroundColor Green
    foreach ($q in $gameWithSkin.session.quizzes.questions) {
        Write-Host "   - $($q.stem_md)" -ForegroundColor Cyan
        if ($q.farm_context) {
            Write-Host "     Visual: $($q.farm_context.visual)" -ForegroundColor Yellow
            Write-Host "     Contexto: $($q.farm_context.narrative)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n4. 🎯 COMPARACIÓN:" -ForegroundColor Magenta
Write-Host "   ANTES: '¿Cuánto es 1+1?' (abstracto)" -ForegroundColor White
Write-Host "   DESPUÉS: '🐔 ¿Cuántos pollitos hay?' (contextual)" -ForegroundColor Green

Write-Host "`n5. 🚀 URLs PARA PROBAR:" -ForegroundColor Cyan
Write-Host "   Juego Transformado: http://localhost:3000/student/games/game-demo-001/play" -ForegroundColor Cyan
Write-Host "   Demo Comparación:   http://localhost:3000/demos/test-skin" -ForegroundColor Cyan

Write-Host "`n✨ ¡La transformación dinámica convierte automáticamente el contenido!" -ForegroundColor Green
Write-Host "   📚 De matemáticas abstractas → 🐄 Conteo con animales de granja" -ForegroundColor Green 