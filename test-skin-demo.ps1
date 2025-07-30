#!/usr/bin/env pwsh

# =============================================================================
# DEMO COMPLETO DE SKINS EDU21
# =============================================================================
# Este script demuestra cómo funcionan los skins aplicados a juegos
# y cómo transforman la experiencia educativa
# =============================================================================

Write-Host "`n🎯 DEMO COMPLETO: SKINS EDU21" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host "`n📋 PASOS DE LA DEMO:" -ForegroundColor Yellow
Write-Host "1. ✅ Verificar servidores funcionando" -ForegroundColor White
Write-Host "2. 🎨 Ver skins disponibles" -ForegroundColor White  
Write-Host "3. 🎮 Aplicar skin a un juego demo" -ForegroundColor White
Write-Host "4. 🧪 Probar demo interactivo" -ForegroundColor White
Write-Host "5. 👀 Ver diferencia real en el juego" -ForegroundColor White

Write-Host "`n🔧 PASO 1: Verificando servidores..." -ForegroundColor Green

# Verificar servidor backend
try {
    $serverStatus = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Servidor Backend: FUNCIONANDO (puerto 5000)" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor Backend: NO RESPONDE" -ForegroundColor Red
    Write-Host "   Ejecuta: cd server && npm start" -ForegroundColor Yellow
    exit 1
}

# Verificar cliente frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Cliente Frontend: FUNCIONANDO (puerto 3000)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Cliente Frontend: NO RESPONDE" -ForegroundColor Red
    Write-Host "   Ejecuta: cd client && npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🎨 PASO 2: Consultando skins disponibles..." -ForegroundColor Green

try {
    $skins = Invoke-RestMethod -Uri "http://localhost:5000/api/skins" -Method GET
    $totalSkins = $skins.data.Length
    
    Write-Host "📊 SKINS DISPONIBLES: $totalSkins" -ForegroundColor Cyan
    
    foreach ($skin in $skins.data) {
        $emoji = switch ($skin.category) {
            "animals" { "🐄" }
            "space" { "🚀" }
            "fantasy" { "🧙" }
            "nature" { "🌳" }
            default { "🎨" }
        }
        Write-Host "   $emoji $($skin.name) (Engine: $($skin.engine_id))" -ForegroundColor White
    }
    
    # Seleccionar skin de granja para demo
    $farmSkin = $skins.data | Where-Object { $_.name -like "*Granja*" } | Select-Object -First 1
    
    if ($farmSkin) {
        Write-Host "`n🐄 SKIN SELECCIONADO PARA DEMO:" -ForegroundColor Yellow
        Write-Host "   Nombre: $($farmSkin.name)" -ForegroundColor White
        Write-Host "   Engine: $($farmSkin.engine_id)" -ForegroundColor White
        Write-Host "   Categoría: $($farmSkin.category)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error obteniendo skins: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎮 PASO 3: Aplicando skin al juego demo..." -ForegroundColor Green

try {
    $demoGameId = "game-demo-001"
    $applySkinData = @{
        skin_id = $farmSkin.id
        game_session_id = $demoGameId
    } | ConvertTo-Json
    
    $applyResult = Invoke-RestMethod -Uri "http://localhost:5000/api/skins/apply" -Method POST -Body $applySkinData -ContentType "application/json"
    
    Write-Host "✅ SKIN APLICADO EXITOSAMENTE" -ForegroundColor Green
    Write-Host "   Skin: $($farmSkin.name)" -ForegroundColor White
    Write-Host "   Juego: $demoGameId" -ForegroundColor White
    Write-Host "   Mensaje: $($applyResult.message)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error aplicando skin: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Esto es normal si ya está aplicado" -ForegroundColor Yellow
}

Write-Host "`n🧪 PASO 4: Verificando configuración del juego..." -ForegroundColor Green

try {
    $gameSession = Invoke-RestMethod -Uri "http://localhost:5000/api/game/$demoGameId" -Method GET
    
    if ($gameSession.session.applied_skin) {
        Write-Host "✅ JUEGO CON SKIN APLICADO:" -ForegroundColor Green
        Write-Host "   Título: $($gameSession.session.title)" -ForegroundColor White
        Write-Host "   Engine: $($gameSession.session.engine_id)" -ForegroundColor White
        Write-Host "   Skin: $($gameSession.session.applied_skin.skin_name)" -ForegroundColor Cyan
        Write-Host "   Aplicado: $($gameSession.session.applied_skin.applied_at)" -ForegroundColor White
    } else {
        Write-Host "⚠️  Juego sin skin aplicado (usando configuración básica)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error verificando juego: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🌐 PASO 5: Abriendo demos en el navegador..." -ForegroundColor Green

# URLs para abrir
$urls = @(
    "http://localhost:3000/demos/test-skin",
    "http://localhost:3000/teacher/skins", 
    "http://localhost:3000/demos"
)

Write-Host "`n🎯 DEMOS LISTOS PARA PROBAR:" -ForegroundColor Cyan

foreach ($url in $urls) {
    $description = switch ($url) {
        { $_ -like "*test-skin*" } { "🧪 Demo Interactivo: Diferencia con/sin Skin" }
        { $_ -like "*teacher/skins*" } { "🎨 Gestión de Skins (Aplicar/Preview)" }
        { $_ -like "*/demos" } { "🎮 Lista de Demos Validados" }
    }
    
    Write-Host "   $description" -ForegroundColor White
    Write-Host "   🔗 $url" -ForegroundColor Gray
    
    # Abrir en navegador (Windows)
    try {
        Start-Process $url -ErrorAction SilentlyContinue
    } catch {
        # Silenciar errores de apertura de navegador
    }
}

Write-Host "`n🎯 INSTRUCCIONES PARA LA DEMO:" -ForegroundColor Yellow -BackgroundColor DarkBlue
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host "`n1️⃣  DEMO INTERACTIVO (test-skin):" -ForegroundColor Green
Write-Host "   • Activa/desactiva el toggle de skin" -ForegroundColor White
Write-Host "   • Escucha la diferencia en sonidos" -ForegroundColor White
Write-Host "   • Nota los cambios visuales" -ForegroundColor White
Write-Host "   • Haz clic en 'Escuchar Instrucciones'" -ForegroundColor White

Write-Host "`n2️⃣  GESTIÓN DE SKINS:" -ForegroundColor Green
Write-Host "   • Ve los $totalSkins skins disponibles" -ForegroundColor White
Write-Host "   • Haz Preview de cualquier skin" -ForegroundColor White
Write-Host "   • Aplica skins a diferentes demos" -ForegroundColor White

Write-Host "`n3️⃣  DEMOS VALIDADOS:" -ForegroundColor Green
Write-Host "   • 6 demos fundamentales listos" -ForegroundColor White
Write-Host "   • Cada uno con engines específicos" -ForegroundColor White
Write-Host "   • Contenido educativo real" -ForegroundColor White

Write-Host "`n🎯 ¿QUÉ HACE REALMENTE UN SKIN?" -ForegroundColor Magenta -BackgroundColor Black
Write-Host "• Cambia colores, formas y elementos visuales" -ForegroundColor White
Write-Host "• Personaliza sonidos y feedback de audio" -ForegroundColor White  
Write-Host "• Adapta la narrativa y contexto del juego" -ForegroundColor White
Write-Host "• Mejora la motivación y engagement del estudiante" -ForegroundColor White
Write-Host "• Conecta el aprendizaje con temas familiares" -ForegroundColor White

Write-Host "`n✅ DEMO COMPLETADA - Disfruta explorando!" -ForegroundColor Green -BackgroundColor Black
Write-Host "=================================================" -ForegroundColor Cyan 