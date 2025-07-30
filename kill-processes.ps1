#!/usr/bin/env pwsh

# =============================================================================
# LIMPIEZA DE PROCESOS NODE.JS - EDU21
# =============================================================================
# Este script termina todos los procesos Node.js para liberar los puertos
# =============================================================================

Write-Host "`n🛑 LIMPIANDO PROCESOS NODE.JS..." -ForegroundColor Red -BackgroundColor Black
Write-Host "=================================================" -ForegroundColor Red

# Buscar procesos Node.js
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "`n📋 PROCESOS NODE.JS ENCONTRADOS:" -ForegroundColor Yellow
    foreach ($process in $nodeProcesses) {
        Write-Host "   PID: $($process.Id) | Memoria: $([math]::Round($process.WS/1MB, 2)) MB" -ForegroundColor White
    }
    
    Write-Host "`n⚠️  Terminando procesos..." -ForegroundColor Yellow
    try {
        $nodeProcesses | Stop-Process -Force
        Write-Host "✅ Todos los procesos Node.js terminados" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error terminando procesos: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "✅ No hay procesos Node.js ejecutándose" -ForegroundColor Green
}

# Verificar puertos específicos
$ports = @(3000, 5000)
Write-Host "`n🔍 VERIFICANDO PUERTOS..." -ForegroundColor Cyan

foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            Write-Host "   Puerto ${port}: OCUPADO" -ForegroundColor Red
            foreach ($conn in $connections) {
                Write-Host "     PID: $($conn.OwningProcess)" -ForegroundColor Gray
            }
        } else {
            Write-Host "   Puerto ${port}: LIBRE" -ForegroundColor Green
        }
    } catch {
        Write-Host "   Puerto ${port}: LIBRE" -ForegroundColor Green
    }
}

# Limpiar caché de npm si es necesario
Write-Host "`n🧹 LIMPIANDO CACHÉ NPM..." -ForegroundColor Cyan
try {
    npm cache clean --force 2>$null
    Write-Host "✅ Caché NPM limpio" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No se pudo limpiar caché NPM" -ForegroundColor Yellow
}

Write-Host "`n✅ LIMPIEZA COMPLETADA - Puertos liberados" -ForegroundColor Green -BackgroundColor Black
Write-Host "=================================================" -ForegroundColor Green

# Pausa para que el usuario vea el resultado
Start-Sleep -Seconds 2 