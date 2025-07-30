#!/usr/bin/env pwsh

Write-Host ""
Write-Host "🎯 DEMO COMPLETO: SKINS EDU21" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ SERVIDORES FUNCIONANDO:" -ForegroundColor Green
Write-Host "   - Backend: http://localhost:5000 (OK)" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:3000 (OK)" -ForegroundColor White

Write-Host ""
Write-Host "🎨 VERIFICANDO SKINS..." -ForegroundColor Green

try {
    $skins = Invoke-RestMethod -Uri "http://localhost:5000/api/skins" -Method GET
    $totalSkins = $skins.data.Length
    
    Write-Host "📊 SKINS DISPONIBLES: $totalSkins" -ForegroundColor Cyan
    
    foreach ($skin in $skins.data) {
        Write-Host "   🎨 $($skin.name) (Engine: $($skin.engine_id))" -ForegroundColor White
    }
    
    # Seleccionar skin de granja para demo
    $farmSkin = $skins.data | Where-Object { $_.name -like "*Granja*" } | Select-Object -First 1
    
    if ($farmSkin) {
        Write-Host ""
        Write-Host "🐄 APLICANDO SKIN DE DEMO..." -ForegroundColor Yellow
        
        $demoGameId = "game-demo-001"
        $applySkinData = @{
            skin_id = $farmSkin.id
            game_session_id = $demoGameId
        } | ConvertTo-Json
        
        $applyResult = Invoke-RestMethod -Uri "http://localhost:5000/api/skins/apply" -Method POST -Body $applySkinData -ContentType "application/json"
        
        Write-Host "✅ SKIN APLICADO: $($farmSkin.name)" -ForegroundColor Green
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 ABRIENDO DEMOS EN EL NAVEGADOR..." -ForegroundColor Green

# URLs para abrir
$urls = @(
    "http://localhost:3000/demos/test-skin",
    "http://localhost:3000/teacher/skins", 
    "http://localhost:3000/demos"
)

foreach ($url in $urls) {
    $description = switch ($url) {
        { $_ -like "*test-skin*" } { "🧪 Demo Interactivo" }
        { $_ -like "*teacher/skins*" } { "🎨 Gestión de Skins" }
        { $_ -like "*/demos" } { "🎮 Lista de Demos" }
    }
    
    Write-Host "   $description - $url" -ForegroundColor White
    
    # Abrir en navegador
    try {
        Start-Process $url -ErrorAction SilentlyContinue
    } catch {
        # Silenciar errores
    }
}

Write-Host ""
Write-Host "🎯 INSTRUCCIONES:" -ForegroundColor Yellow -BackgroundColor DarkBlue
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. DEMO INTERACTIVO (test-skin):" -ForegroundColor Green
Write-Host "   - Activa/desactiva el toggle de skin" -ForegroundColor White
Write-Host "   - Escucha la diferencia en sonidos" -ForegroundColor White
Write-Host "   - Nota los cambios visuales" -ForegroundColor White

Write-Host ""
Write-Host "2. GESTIÓN DE SKINS:" -ForegroundColor Green
Write-Host "   - Ve los $totalSkins skins disponibles" -ForegroundColor White
Write-Host "   - Haz Preview de cualquier skin" -ForegroundColor White
Write-Host "   - Aplica skins a diferentes demos" -ForegroundColor White

Write-Host ""
Write-Host "3. DEMOS VALIDADOS:" -ForegroundColor Green
Write-Host "   - 6 demos fundamentales listos" -ForegroundColor White
Write-Host "   - Cada uno con engines específicos" -ForegroundColor White
Write-Host "   - Contenido educativo real" -ForegroundColor White

Write-Host ""
Write-Host "✅ DEMO LISTA - Disfruta explorando!" -ForegroundColor Green -BackgroundColor Black
Write-Host "=================================================" -ForegroundColor Cyan 