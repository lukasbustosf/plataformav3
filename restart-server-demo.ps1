# 🚀 EDU21 - Script de Reinicio y Demo 1° Básico
# Reinicia el servidor y muestra URLs de prueba

Write-Host "🔄 === REINICIANDO SERVIDOR EDU21 ===" -ForegroundColor Yellow
Write-Host ""

# 1. Buscar procesos de Node.js y terminarlos
Write-Host "🛑 Terminando procesos existentes..." -ForegroundColor Red
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "   Terminando proceso Node.js (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "   No hay procesos Node.js ejecutándose" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🚀 === INICIANDO SERVIDOR BACKEND ===" -ForegroundColor Green
Write-Host ""

# 2. Ir al directorio del servidor y iniciarlo en background
Set-Location "server"
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Minimized
Write-Host "✅ Servidor backend iniciando en puerto 5000..." -ForegroundColor Green

# Esperar un poco para que el servidor se inicie
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🌐 === INICIANDO SERVIDOR FRONTEND ===" -ForegroundColor Cyan
Write-Host ""

# 3. Ir al directorio del cliente y iniciarlo
Set-Location "..\client"
Write-Host "✅ Servidor frontend iniciando en puerto 3000..." -ForegroundColor Cyan
Write-Host ""

# 4. Mostrar URLs importantes para probar
Write-Host "🎯 === URLS DE PRUEBA 1° BÁSICO ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "📊 ESTADÍSTICAS DEL SISTEMA:" -ForegroundColor White
Write-Host "   • Skins totales: 33 (13 originales + 20 nuevos de 1B)" -ForegroundColor Gray
Write-Host "   • Juegos totales: 41+ (24 originales + 17 nuevos de 1B)" -ForegroundColor Gray
Write-Host "   • Engines cubiertos: ENG01, ENG02, ENG05, ENG06, ENG07" -ForegroundColor Gray
Write-Host ""

Write-Host "🎨 GESTIÓN DE SKINS:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/teacher/skins" -ForegroundColor White
Write-Host "   ↳ Deberías ver 33 skins (filtrar por ENG05, ENG06, ENG07)" -ForegroundColor Gray
Write-Host ""

Write-Host "🎮 JUEGOS Y DEMOS:" -ForegroundColor Green
Write-Host "   http://localhost:3000/demos" -ForegroundColor White
Write-Host "   http://localhost:3000/teacher/games" -ForegroundColor White
Write-Host "   ↳ Buscar juegos con '1B' en el nombre" -ForegroundColor Gray
Write-Host ""

Write-Host "🧪 PRUEBAS ESPECÍFICAS 1° BÁSICO:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/student/games?grade=1B" -ForegroundColor White
Write-Host "   http://localhost:3000/teacher/skins?grade=1B" -ForegroundColor White
Write-Host ""

Write-Host "📚 TEMAS DISPONIBLES PARA 1B:" -ForegroundColor Magenta
Write-Host "   🐄 Granja Divertida    🦊 Amigos del Bosque" -ForegroundColor Gray
Write-Host "   🐠 Mundo Submarino     🚀 Aventura Espacial" -ForegroundColor Gray
Write-Host "   👸 Cuentos de Hadas    🦕 Parque de Dinosaurios" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 === CÓMO PROBAR LA INTEGRACIÓN ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 🌐 Abre: http://localhost:3000/teacher/skins" -ForegroundColor White
Write-Host "   ✓ Verifica que hay 33 skins total" -ForegroundColor Green
Write-Host "   ✓ Filtra por engine 'ENG05' - debes ver 5 skins de 1B" -ForegroundColor Green
Write-Host "   ✓ Filtra por engine 'ENG06' - debes ver 4 skins de 1B" -ForegroundColor Green
Write-Host "   ✓ Filtra por engine 'ENG07' - debes ver 4 skins de 1B" -ForegroundColor Green
Write-Host ""

Write-Host "2. 🎮 Abre: http://localhost:3000/demos" -ForegroundColor White  
Write-Host "   ✓ Busca juegos que contengan '1B' en el nombre" -ForegroundColor Green
Write-Host "   ✓ Deberías ver 17 juegos nuevos de 1° básico" -ForegroundColor Green
Write-Host "   ✓ 7 de matemáticas + 10 de lenguaje" -ForegroundColor Green
Write-Host ""

Write-Host "3. 🔧 Aplicar skin a un juego:" -ForegroundColor White
Write-Host "   ✓ Selecciona un juego de lenguaje (ENG06)" -ForegroundColor Green
Write-Host "   ✓ Aplica el skin 'Granja Divertida' o 'Amigos del Bosque'" -ForegroundColor Green
Write-Host "   ✓ Verifica que el tema visual cambie" -ForegroundColor Green
Write-Host ""

Write-Host "4. 🧪 Probar funcionalidad:" -ForegroundColor White
Write-Host "   ✓ Los juegos deben tener botones grandes para 1B" -ForegroundColor Green
Write-Host "   ✓ Los juegos de lenguaje deben tener soporte TTS" -ForegroundColor Green
Write-Host "   ✓ Los colores deben ser brillantes y contrastantes" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "   Si no ves los cambios, presiona Ctrl+F5 para refrescar el cache" -ForegroundColor Yellow
Write-Host ""

Write-Host "📝 === LOGS DE VERIFICACIÓN ===" -ForegroundColor Cyan
Write-Host "   Los logs del servidor mostrarán 'Skin statistics: total_skins: 33'" -ForegroundColor Gray
Write-Host "   Si aún muestra 13, el servidor no se reinició correctamente" -ForegroundColor Gray
Write-Host ""

# 5. Iniciar el cliente
Write-Host "🔥 ¡Iniciando cliente en 3 segundos!" -ForegroundColor Yellow
Start-Sleep -Seconds 3
npm run dev 