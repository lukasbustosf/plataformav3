# 🔧 ARREGLAR ERRORES DEL SERVIDOR
Write-Host "🔧 === ARREGLANDO ERRORES DEL SERVIDOR ===" -ForegroundColor Cyan

Write-Host "`n1. 🧹 LIMPIANDO PROCESOS NODE..." -ForegroundColor Yellow
try {
    taskkill /F /IM node.exe 2>$null
    Write-Host "   ✅ Procesos Node.js terminados" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ No hay procesos Node.js para terminar" -ForegroundColor Yellow
}

Write-Host "`n2. 🔍 VERIFICANDO ERRORES COMUNES..." -ForegroundColor Yellow

# Verificar puerto 5000
$port5000 = netstat -ano | Select-String ":5000.*LISTENING"
if ($port5000) {
    Write-Host "   ❌ Puerto 5000 aún ocupado" -ForegroundColor Red
    Write-Host "   Procesos en puerto 5000:" -ForegroundColor Red
    $port5000
} else {
    Write-Host "   ✅ Puerto 5000 libre" -ForegroundColor Green
}

Write-Host "`n3. 🔧 SIMPLIFICANDO IMPORTS PROBLEMÁTICOS..." -ForegroundColor Yellow

# Crear versión simplificada de mockGameData que no cause errores
$simpleMockData = @"
// Simplified Mock Game Data - Emergency version
const mockQuizzes = [
  {
    quiz_id: 'quiz-math-001',
    school_id: 'school-abc',
    author_id: 'teacher-123',
    title: '🐄 Conteo en la Granja - 1° Básico',
    description: 'Juego de conteo con animales de granja',
    mode: 'manual',
    difficulty: 'easy',
    time_limit_minutes: 10,
    active: true,
    created_at: new Date().toISOString(),
    engine_id: 'ENG01',
    engine_name: 'Counter/Number Line',
    questions: [
      {
        question_id: 'count-1b-001',
        question_order: 1,
        stem_md: '🐔 ¿Cuántos pollitos hay en la granja?',
        type: 'multiple_choice',
        options_json: [2, 3, 4, 5],
        correct_answer: '3',
        explanation: 'Hay 3 pollitos. ¡Pío, pío, pío!',
        points: 10,
        difficulty: 'easy',
        bloom_level: 'Recordar',
        farm_context: {
          visual: '🐔🐔🐔',
          narrative: 'Cuenta los pollitos que están en el corral',
          animal_sound: 'pío pío'
        }
      }
    ]
  }
];

const mockGameSessions = [
  {
    session_id: 'game-demo-001',
    school_id: 'school-abc',
    quiz_id: 'quiz-math-001',
    host_id: 'teacher-123',
    format: 'trivia_lightning',
    status: 'active',
    title: '🐄 Conteo en la Granja - 1° Básico',
    join_code: 'DEMO001',
    engine_id: 'ENG01',
    engine_name: 'Counter/Number Line',
    settings_json: {
      demo: true,
      max_players: 30,
      time_limit: 300
    },
    created_at: new Date().toISOString(),
    participants: []
  }
];

class MockGameDataService {
  constructor() {
    this.quizzes = mockQuizzes;
    this.gameSessions = mockGameSessions;
  }
  
  getGameSessionById(sessionId, schoolId) {
    const session = this.gameSessions.find(s => s.session_id === sessionId);
    if (!session) return null;
    
    const quiz = this.quizzes.find(q => q.quiz_id === session.quiz_id);
    return {
      ...session,
      quiz_id: session.quiz_id,
      school_id: session.school_id,
      host_id: session.host_id,
      join_code: session.join_code,
      title: session.title,
      format: session.format,
      status: session.status
    };
  }
  
  getQuizById(quizId, schoolId) {
    const quiz = this.quizzes.find(q => q.quiz_id === quizId);
    return quiz ? { data: quiz } : null;
  }
}

const mockGameData = new MockGameDataService();
module.exports = { mockGameData };
"@

Write-Host "   📝 Creando mockGameData simplificado..." -ForegroundColor Green
$simpleMockData | Out-File -FilePath "server/services/mockGameData-backup.js" -Encoding UTF8

Write-Host "`n4. 🚀 INTENTANDO INICIAR SERVIDOR..." -ForegroundColor Yellow
Set-Location server
try {
    Write-Host "   🔄 Iniciando servidor..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-Command", "npm start" -WindowStyle Normal
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Servidor iniciado (verificar ventana separada)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error iniciando servidor: $($_.Exception.Message)" -ForegroundColor Red
}

Set-Location ..

Write-Host "`n5. 🌐 INICIANDO CLIENTE..." -ForegroundColor Yellow
try {
    Start-Process powershell -ArgumentList "-Command", "cd client; npm run dev" -WindowStyle Normal
    Write-Host "   ✅ Cliente iniciado (verificar ventana separada)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error iniciando cliente: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✨ PROCESO COMPLETADO" -ForegroundColor Green
Write-Host "🚀 URLs para probar:" -ForegroundColor Cyan
Write-Host "   Servidor:  http://localhost:5000/health" -ForegroundColor Cyan
Write-Host "   Cliente:   http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Demo Skin: http://localhost:3000/demos/test-skin" -ForegroundColor Cyan

Write-Host "`n📋 Si aún hay errores:" -ForegroundColor Yellow
Write-Host "   1. Verificar las ventanas separadas del servidor y cliente" -ForegroundColor White
Write-Host "   2. Revisar logs de error específicos" -ForegroundColor White
Write-Host "   3. Usar mockGameData-backup.js si es necesario" -ForegroundColor White 