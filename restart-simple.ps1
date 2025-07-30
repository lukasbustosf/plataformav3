# EDU21 - Reinicio Simplificado
# Reinicia el servidor y muestra URLs de prueba

Write-Host "=== REINICIANDO SERVIDOR EDU21 ===" -ForegroundColor Yellow
Write-Host ""

# 1. Terminar procesos existentes
Write-Host "Terminando procesos existentes..." -ForegroundColor Red
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "   Terminando proceso Node.js (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "   No hay procesos Node.js ejecutandose" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== INICIANDO SERVIDOR BACKEND ===" -ForegroundColor Green
Write-Host ""

# 2. Iniciar servidor backend
Set-Location "server"
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Minimized
Write-Host "Servidor backend iniciando en puerto 5000..." -ForegroundColor Green

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "=== INICIANDO SERVIDOR FRONTEND ===" -ForegroundColor Cyan
Write-Host ""

# 3. Ir al cliente
Set-Location "..\client"
Write-Host "Servidor frontend iniciando en puerto 3000..." -ForegroundColor Cyan
Write-Host ""

# 4. Mostrar URLs de prueba
Write-Host "=== URLS DE PRUEBA 1B ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "ESTADISTICAS DEL SISTEMA:" -ForegroundColor White
Write-Host "   Skins totales: 33 (13 originales + 20 nuevos de 1B)" -ForegroundColor Gray
Write-Host "   Juegos totales: 41+ (24 originales + 17 nuevos de 1B)" -ForegroundColor Gray
Write-Host "   Engines cubiertos: ENG01, ENG02, ENG05, ENG06, ENG07" -ForegroundColor Gray
Write-Host ""

Write-Host "GESTION DE SKINS:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/teacher/skins" -ForegroundColor White
Write-Host "   Deberias ver 33 skins (filtrar por ENG05, ENG06, ENG07)" -ForegroundColor Gray
Write-Host ""

Write-Host "JUEGOS Y DEMOS:" -ForegroundColor Green
Write-Host "   http://localhost:3000/demos" -ForegroundColor White
Write-Host "   http://localhost:3000/teacher/games" -ForegroundColor White
Write-Host "   Buscar juegos con '1B' en el nombre" -ForegroundColor Gray
Write-Host ""

Write-Host "TEMAS DISPONIBLES PARA 1B:" -ForegroundColor Magenta
Write-Host "   Granja Divertida    Amigos del Bosque" -ForegroundColor Gray
Write-Host "   Mundo Submarino     Aventura Espacial" -ForegroundColor Gray
Write-Host "   Cuentos de Hadas    Parque de Dinosaurios" -ForegroundColor Gray
Write-Host ""

Write-Host "=== COMO PROBAR LA INTEGRACION ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abre: http://localhost:3000/teacher/skins" -ForegroundColor White
Write-Host "   Verifica que hay 33 skins total" -ForegroundColor Green
Write-Host "   Filtra por engine 'ENG05' - debes ver 5 skins de 1B" -ForegroundColor Green
Write-Host "   Filtra por engine 'ENG06' - debes ver 4 skins de 1B" -ForegroundColor Green
Write-Host "   Filtra por engine 'ENG07' - debes ver 4 skins de 1B" -ForegroundColor Green
Write-Host ""

Write-Host "2. Abre: http://localhost:3000/demos" -ForegroundColor White  
Write-Host "   Busca juegos que contengan '1B' en el nombre" -ForegroundColor Green
Write-Host "   Deberias ver 17 juegos nuevos de 1 basico" -ForegroundColor Green
Write-Host "   7 de matematicas + 10 de lenguaje" -ForegroundColor Green
Write-Host ""

Write-Host "3. Aplicar skin a un juego:" -ForegroundColor White
Write-Host "   Selecciona un juego de lenguaje (ENG06)" -ForegroundColor Green
Write-Host "   Aplica el skin 'Granja Divertida' o 'Amigos del Bosque'" -ForegroundColor Green
Write-Host "   Verifica que el tema visual cambie" -ForegroundColor Green
Write-Host ""

Write-Host "IMPORTANTE:" -ForegroundColor Red
Write-Host "   Si no ves los cambios, presiona Ctrl+F5 para refrescar el cache" -ForegroundColor Yellow
Write-Host ""

Write-Host "Iniciando cliente en 3 segundos!" -ForegroundColor Yellow
Start-Sleep -Seconds 3
npm run dev 