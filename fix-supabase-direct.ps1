# FIX SUPABASE: Agregar columnas gamificadas directamente
# Ejecuta la migración usando PowerShell y la API REST de Supabase

$SUPABASE_URL = "https://jximjwzcivxnoirejlpc.supabase.co"
$SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aW1qd3pjaXZ4bm9pcmVqbHBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY1MDcwNSwiZXhwIjoyMDY3MjI2NzA1fQ.SFd5SgXYxHH1SNa4a368vupVTJ6rfl_Z8oEC5jdRr4g"

$SQL = @"
-- Agregar columnas gamificadas a la tabla evaluations existente
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS game_format VARCHAR(50),
ADD COLUMN IF NOT EXISTS engine_id VARCHAR(20),
ADD COLUMN IF NOT EXISTS skin_theme VARCHAR(50),
ADD COLUMN IF NOT EXISTS engine_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS is_gamified BOOLEAN DEFAULT false;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_evaluations_game_format ON evaluations(game_format);
CREATE INDEX IF NOT EXISTS idx_evaluations_engine_id ON evaluations(engine_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_skin_theme ON evaluations(skin_theme);
CREATE INDEX IF NOT EXISTS idx_evaluations_is_gamified ON evaluations(is_gamified);
"@

Write-Host "🔧 EJECUTANDO MIGRACIÓN EN SUPABASE..." -ForegroundColor Yellow

try {
    # Preparar headers
    $headers = @{
        "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
        "Content-Type" = "application/json"
        "Prefer" = "return=minimal"
    }

    # Preparar body para RPC call
    $body = @{
        "sql" = $SQL
    } | ConvertTo-Json

    # Ejecutar RPC call
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method POST -Headers $headers -Body $body

    Write-Host "✅ MIGRACIÓN EJECUTADA EXITOSAMENTE!" -ForegroundColor Green
    Write-Host "🔄 Reiniciando servidor..." -ForegroundColor Blue
    
    # Reiniciar servidor automáticamente
    Start-Process powershell -ArgumentList "-Command", "cd server; npm run dev" -WindowStyle Normal
    
} catch {
    Write-Host "❌ Error ejecutando migración automática: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 EJECUTA ESTE SQL MANUALMENTE EN SUPABASE:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host $SQL -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host ""
    Write-Host "1. Ve a https://supabase.com/dashboard/project/jximjwzcivxnoirejlpc" -ForegroundColor White
    Write-Host "2. Click en SQL Editor" -ForegroundColor White
    Write-Host "3. Pega el SQL de arriba" -ForegroundColor White
    Write-Host "4. Click Run" -ForegroundColor White
    Write-Host "5. Reinicia: cd server && npm run dev" -ForegroundColor White
}

Read-Host "Presiona Enter para continuar..." 