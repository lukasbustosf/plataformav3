# Aplicar skin de granja 1B al juego demo-001
$applySkinData = @{
    skin_id = "skin-1b-farm"
    game_session_id = "game-demo-001"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/skins/apply" -Method POST -Body $applySkinData -ContentType "application/json"

Write-Host "✅ Skin de granja aplicado al juego demo-001" 