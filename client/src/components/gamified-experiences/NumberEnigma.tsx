import React, { useState, useCallback, useEffect } from 'react';
import './NumberEnigma.css';

// Interfaces para el sistema de enigmas
interface Enigma {
  id: string;
  title: string;
  description: string;
  category: 'counting' | 'patterns' | 'logic' | 'investigation';
  difficulty: 'easy' | 'medium' | 'hard';
  clues: string[];
  solution: string;
  hints: string[];
  reward: number;
  timeLimit?: number;
  requiredTools: string[];
  icon?: string;
}

interface InvestigationTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  cost: number;
}

interface EnigmaSession {
  enigmaId: string;
  startTime: Date;
  cluesFound: string[];
  hypotheses: string[];
  attempts: number;
  solved: boolean;
  timeSpent: number;
}

const NumberEnigma: React.FC = () => {
  // Estados principales
  const [currentEnigma, setCurrentEnigma] = useState<Enigma | null>(null);
  const [sessionData, setSessionData] = useState({
    totalEnigmas: 0,
    solvedEnigmas: 0,
    totalTime: 0,
    investigationPoints: 0,
    cluesDiscovered: 0,
    hypothesesFormulated: 0,
    criticalThinking: 0,
    problemSolving: 0,
    collaborationTime: 0,
    researchAccuracy: 0
  });
  const [investigationTools, setInvestigationTools] = useState<InvestigationTool[]>([
    {
      id: 'magnifying_glass',
      name: 'Lupa Investigadora',
      icon: '🔍',
      description: 'Examina números más de cerca',
      unlocked: true,
      cost: 0
    },
    {
      id: 'pattern_scanner',
      name: 'Escáner de Patrones',
      icon: '📊',
      description: 'Detecta patrones ocultos',
      unlocked: false,
      cost: 50
    },
    {
      id: 'logic_analyzer',
      name: 'Analizador Lógico',
      icon: '🧠',
      description: 'Analiza la lógica de secuencias',
      unlocked: false,
      cost: 100
    },
    {
      id: 'collaboration_network',
      name: 'Red de Colaboración',
      icon: '🤝',
      description: 'Conecta con otros investigadores',
      unlocked: false,
      cost: 150
    }
  ]);
  const [currentSession, setCurrentSession] = useState<EnigmaSession | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHints, setShowHints] = useState(true);
  const [hintPosition, setHintPosition] = useState({ x: 20, y: 20 });
  const [showAchievements, setShowAchievements] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [currentHypothesis, setCurrentHypothesis] = useState('');
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [showCollaboration, setShowCollaboration] = useState(false);

  // Enigmas disponibles
  const ENIGMAS: Enigma[] = [
    {
      id: 'enigma_1',
      title: 'El Misterio de los Números Perdidos',
      description: 'Hay números que han desaparecido de la secuencia. ¿Puedes encontrarlos?',
      category: 'counting',
      difficulty: 'easy',
      clues: [
        'Los números van de 1 en 1',
        'Faltan algunos números en el medio',
        'La secuencia termina en 20'
      ],
      solution: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
      hints: [
        'Cuenta de 1 en 1 desde el principio',
        'Busca los espacios vacíos',
        'Verifica que no falte ningún número'
      ],
      reward: 50,
      requiredTools: ['magnifying_glass']
    },
    {
      id: 'enigma_2',
      title: 'El Patrón Secreto',
      description: 'Hay un patrón oculto en esta secuencia. ¿Puedes descubrirlo?',
      category: 'patterns',
      difficulty: 'medium',
      clues: [
        'Los números siguen un patrón especial',
        'Cada número es diferente al anterior',
        'El patrón se repite cada 4 números'
      ],
      solution: '2,4,6,8,10,12,14,16,18,20',
      hints: [
        'Observa la diferencia entre números consecutivos',
        'El patrón es de 2 en 2',
        'Verifica que todos los números sean pares'
      ],
      reward: 75,
      requiredTools: ['magnifying_glass', 'pattern_scanner']
    },
    {
      id: 'enigma_3',
      title: 'La Lógica del Investigador',
      description: 'Resuelve este enigma usando lógica y razonamiento.',
      category: 'logic',
      difficulty: 'hard',
      clues: [
        'Hay una regla matemática oculta',
        'Los números no están en orden normal',
        'Cada número tiene una relación especial'
      ],
      solution: '5,10,15,20,25,30,35,40,45,50',
      hints: [
        'Piensa en grupos de 5',
        'Cada número es múltiplo de 5',
        'La secuencia va de 5 en 5'
      ],
      reward: 100,
      requiredTools: ['magnifying_glass', 'pattern_scanner', 'logic_analyzer']
    }
  ];

  // Logros del enigma
  const [achievements, setAchievements] = useState([
    {
      id: 'primer_enigma',
      title: '🔍 Primer Investigador',
      description: 'Resolviste tu primer enigma',
      requirement: 1,
      reward: 'Lupa Dorada',
      unlocked: false,
      icon: '🔍'
    },
    {
      id: 'detective_novato',
      title: '🕵️ Detective Novato',
      description: 'Resolviste 3 enigmas diferentes',
      requirement: 3,
      reward: 'Capa de Detective',
      unlocked: false,
      icon: '🕵️'
    },
    {
      id: 'maestro_enigma',
      title: '🧩 Maestro de Enigmas',
      description: 'Resolviste todos los enigmas disponibles',
      requirement: ENIGMAS.length,
      reward: 'Corona de Enigmas',
      unlocked: false,
      icon: '🧩'
    },
    {
      id: 'colaborador_experto',
      title: '🤝 Colaborador Experto',
      description: 'Completaste 5 investigaciones colaborativas',
      requirement: 5,
      reward: 'Medalla de Colaboración',
      unlocked: false,
      icon: '🤝'
    }
  ]);

  // Función para hablar
  const speak = useCallback((text: string) => {
    if (speechEnabled && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [speechEnabled]);

  // Función para generar sonidos
  const playSound = useCallback((type: string) => {
    if (window.AudioContext) {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'success':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
          break;
        case 'error':
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
          break;
        case 'achievement':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
          break;
        case 'clue':
          oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(700, audioContext.currentTime + 0.1);
          break;
      }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }, []);

  // Función para iniciar enigma
  const startEnigma = useCallback((enigma: Enigma) => {
    setCurrentEnigma(enigma);
    setCurrentSession({
      enigmaId: enigma.id,
      startTime: new Date(),
      cluesFound: [],
      hypotheses: [],
      attempts: 0,
      solved: false,
      timeSpent: 0
    });
    setDiscoveredClues([]);
    setCurrentHypothesis('');
    speak(`¡Nuevo enigma! ${enigma.title}. ${enigma.description}`);
  }, [speak]);

  // Función para descubrir pista
  const discoverClue = useCallback((clue: string) => {
    if (!currentSession || discoveredClues.includes(clue)) return;
    
    setDiscoveredClues(prev => [...prev, clue]);
    setCurrentSession(prev => prev ? {
      ...prev,
      cluesFound: [...prev.cluesFound, clue]
    } : null);
    
    setSessionData(prev => ({
      ...prev,
      cluesDiscovered: prev.cluesDiscovered + 1,
      investigationPoints: prev.investigationPoints + 10
    }));
    
    playSound('clue');
    speak(`¡Pista descubierta! ${clue}`);
  }, [currentSession, discoveredClues, playSound, speak]);

  // Función para formular hipótesis
  const formulateHypothesis = useCallback((hypothesis: string) => {
    if (!currentSession || !hypothesis.trim()) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      hypotheses: [...prev.hypotheses, hypothesis]
    } : null);
    
    setSessionData(prev => ({
      ...prev,
      hypothesesFormulated: prev.hypothesesFormulated + 1,
      investigationPoints: prev.investigationPoints + 15
    }));
    
    speak(`Hipótesis formulada: ${hypothesis}`);
  }, [currentSession, speak]);

  // Función para resolver enigma
  const solveEnigma = useCallback((solution: string) => {
    if (!currentEnigma || !currentSession) return;
    
    const isCorrect = solution.trim() === currentEnigma.solution;
    
    if (isCorrect) {
      setCurrentSession(prev => prev ? {
        ...prev,
        solved: true,
        timeSpent: Date.now() - prev.startTime.getTime()
      } : null);
      
      setSessionData(prev => ({
        ...prev,
        solvedEnigmas: prev.solvedEnigmas + 1,
        totalEnigmas: prev.totalEnigmas + 1,
        investigationPoints: prev.investigationPoints + currentEnigma.reward,
        criticalThinking: Math.min(prev.criticalThinking + 20, 100),
        problemSolving: Math.min(prev.problemSolving + 25, 100)
      }));
      
      playSound('achievement');
      speak(`¡Enigma resuelto! ¡Excelente trabajo de investigación!`);
      
      // Verificar logros
      checkAchievements();
    } else {
      setCurrentSession(prev => prev ? {
        ...prev,
        attempts: prev.attempts + 1
      } : null);
      
      playSound('error');
      speak('Casi correcto. Revisa tu solución e intenta de nuevo.');
    }
  }, [currentEnigma, currentSession, playSound, speak]);

  // Función para verificar logros
  const checkAchievements = useCallback(() => {
    const solvedCount = sessionData.solvedEnigmas + 1;
    
    achievements.forEach(achievement => {
      if (!achievement.unlocked && solvedCount >= achievement.requirement) {
        setAchievements(prev => prev.map(a => 
          a.id === achievement.id ? { ...a, unlocked: true } : a
        ));
        playSound('achievement');
        speak(`¡Logro desbloqueado! ${achievement.title}`);
      }
    });
  }, [sessionData.solvedEnigmas, achievements, playSound, speak]);

  // Función para generar pistas dinámicas
  const generateEnigmaHint = useCallback(() => {
    if (!currentEnigma) {
      return "🔍 ¡Selecciona un enigma para comenzar tu investigación!";
    }
    
    const solvedCount = sessionData.solvedEnigmas;
    const cluesFound = discoveredClues.length;
    
    if (cluesFound === 0) {
      return `🔍 ${currentEnigma.title}: ${currentEnigma.description}. ¡Busca pistas!`;
    }
    
    if (cluesFound < currentEnigma.clues.length) {
      return `🔍 Ya encontraste ${cluesFound} pistas de ${currentEnigma.clues.length}. ¡Sigue investigando!`;
    }
    
    return `🧩 Tienes todas las pistas. ¡Formula una hipótesis y resuelve el enigma!`;
  }, [currentEnigma, sessionData.solvedEnigmas, discoveredClues]);

  // Función para leer pista con voz
  const readHint = useCallback(() => {
    const hint = generateEnigmaHint();
    speak(hint);
    playSound('clue');
  }, [generateEnigmaHint, speak, playSound]);

  // Función para iniciar colaboración
  const startCollaboration = useCallback(() => {
    setShowCollaboration(true);
    speak("¡Modo colaboración activado! Trabaja con otros investigadores.");
  }, [speak]);

  // Función para completar colaboración
  const completeCollaboration = useCallback(() => {
    setSessionData(prev => ({
      ...prev,
      collaborationTime: prev.collaborationTime + 5,
      investigationPoints: prev.investigationPoints + 25
    }));
    
    setShowCollaboration(false);
    speak("¡Colaboración completada! Ganaste puntos de investigación.");
  }, [speak]);

  // Generar reportes
  const generateChildEnigmaReport = useCallback(() => {
    const accuracy = sessionData.totalEnigmas > 0 
      ? Math.round((sessionData.solvedEnigmas / sessionData.totalEnigmas) * 100) 
      : 0;
    
    return {
      totalEnigmas: sessionData.totalEnigmas,
      solvedEnigmas: sessionData.solvedEnigmas,
      accuracy: accuracy,
      investigationPoints: sessionData.investigationPoints,
      cluesDiscovered: sessionData.cluesDiscovered,
      achievementsUnlocked: achievements.filter(a => a.unlocked).length,
      timeSpent: Math.round(sessionData.totalTime / 60),
      nextChallenge: "¡Resuelve más enigmas para desbloquear nuevos misterios!",
      enigmaTheme: "Investigación Numérica"
    };
  }, [sessionData, achievements]);

  const generateParentEnigmaReport = useCallback(() => {
    return {
      skills: {
        criticalThinking: sessionData.criticalThinking,
        problemSolving: sessionData.problemSolving,
        investigation: sessionData.cluesDiscovered,
        collaboration: sessionData.collaborationTime
      },
      recommendations: [
        "Fomenta la formulación de hipótesis en casa",
        "Practica la observación de patrones",
        "Desarrolla el pensamiento lógico"
      ],
      activities: [
        "Juegos de adivinanzas numéricas",
        "Búsqueda de patrones en la vida cotidiana",
        "Resolución de acertijos familiares"
      ],
      enigmaProgress: {
        enigmasSolved: sessionData.solvedEnigmas,
        cluesFound: sessionData.cluesDiscovered,
        timeSpent: Math.round(sessionData.totalTime / 60)
      }
    };
  }, [sessionData]);

  const generateTeacherEnigmaReport = useCallback(() => {
    return {
      studentInfo: {
        name: "Estudiante",
        grade: "1° Básico",
        oa: "MA01OA01",
        enigmaTheme: "Investigación Numérica"
      },
      academicProgress: {
        oaMastery: sessionData.solvedEnigmas * 20,
        criticalThinking: sessionData.criticalThinking,
        problemSolving: sessionData.problemSolving,
        investigation: sessionData.cluesDiscovered
      },
      recommendations: [
        "Fomentar el pensamiento crítico",
        "Desarrollar habilidades de investigación",
        "Promover la colaboración"
      ],
      enigmaMetrics: {
        totalEnigmas: sessionData.totalEnigmas,
        solvedEnigmas: sessionData.solvedEnigmas,
        investigationAccuracy: sessionData.researchAccuracy,
        timeEngagement: Math.round(sessionData.totalTime / 60)
      }
    };
  }, [sessionData]);

  // Efectos
  useEffect(() => {
    if (currentSession && !currentSession.solved) {
      const interval = setInterval(() => {
        setSessionData(prev => ({
          ...prev,
          totalTime: prev.totalTime + 1
        }));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [currentSession]);

  // Configuración de bienvenida
  const welcomeSteps = [
    {
      title: "🔍 ¡Hola Investigador!",
      message: "Soy la Profesora Elena y te voy a enseñar a resolver enigmas numéricos. ¿Estás listo para esta aventura de investigación?",
      icon: "🔍",
      action: "¡Sí, estoy listo!"
    },
    {
      title: "🧩 Tu Misión",
      message: "Vas a resolver enigmas matemáticos usando investigación, pistas y pensamiento crítico. Cada enigma es un misterio que debes descubrir.",
      icon: "🧩",
      action: "Entiendo"
    },
    {
      title: "🔍 Herramientas de Investigación",
      message: "Tienes herramientas especiales: Lupa Investigadora, Escáner de Patrones, Analizador Lógico y Red de Colaboración.",
      icon: "🔍",
      action: "¡Genial!"
    },
    {
      title: "🤝 Colaboración",
      message: "Puedes trabajar con otros investigadores para resolver enigmas más difíciles. ¡La colaboración es clave!",
      icon: "🤝",
      action: "¡Perfecto!"
    },
    {
      title: "🎯 Cómo Investigar",
      message: "1. Selecciona un enigma\n2. Busca pistas usando tus herramientas\n3. Formula hipótesis\n4. Resuelve el enigma\n5. ¡Colabora con otros!",
      icon: "🎯",
      action: "¡Empezar a investigar!"
    }
  ];

  return (
    <div className="enigma-container">
      {/* Bienvenida */}
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <div className="welcome-header">
              <div className="welcome-avatar">
                {welcomeSteps[welcomeStep].icon}
              </div>
              <h2 className="welcome-title">{welcomeSteps[welcomeStep].title}</h2>
            </div>
            <p className="welcome-message">{welcomeSteps[welcomeStep].message}</p>
            
            <div className="welcome-progress">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${index === welcomeStep ? 'active' : index < welcomeStep ? 'completed' : ''}`}
                />
              ))}
            </div>
            
            <div className="welcome-actions">
              <button
                className="welcome-btn welcome-skip"
                onClick={() => setShowWelcome(false)}
              >
                Saltar
              </button>
              <button
                className="welcome-btn welcome-next"
                onClick={() => {
                  if (welcomeStep < welcomeSteps.length - 1) {
                    setWelcomeStep(welcomeStep + 1);
                  } else {
                    setShowWelcome(false);
                  }
                }}
              >
                {welcomeSteps[welcomeStep].action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="enigma-main">
        {/* Panel izquierdo - Enigmas disponibles */}
        <div className="enigma-sidebar left">
          <div className="sidebar-section">
            <h3>🧩 Enigmas Disponibles</h3>
            <div className="enigma-list">
              {ENIGMAS.map(enigma => (
                <div
                  key={enigma.id}
                  className={`enigma-card ${currentEnigma?.id === enigma.id ? 'active' : ''}`}
                  onClick={() => startEnigma(enigma)}
                >
                  <div className="enigma-icon">{enigma.icon || '🧩'}</div>
                  <div className="enigma-info">
                    <h4>{enigma.title}</h4>
                    <p>{enigma.description}</p>
                    <span className="enigma-difficulty">{enigma.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>🔍 Herramientas de Investigación</h3>
            <div className="tools-list">
              {investigationTools.map(tool => (
                <div
                  key={tool.id}
                  className={`tool-card ${tool.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="tool-icon">{tool.icon}</div>
                  <div className="tool-info">
                    <h4>{tool.name}</h4>
                    <p>{tool.description}</p>
                    {!tool.unlocked && (
                      <span className="tool-cost">Costo: {tool.cost} puntos</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Área central - Enigma actual */}
        <div className="enigma-center">
          {currentEnigma && currentSession ? (
            <div className="enigma-workspace">
              <div className="enigma-header">
                <h2>{currentEnigma.title}</h2>
                <div className="enigma-stats">
                  <span>🔍 Pistas: {discoveredClues.length}/{currentEnigma.clues.length}</span>
                  <span>🧠 Hipótesis: {currentSession.hypotheses.length}</span>
                  <span>⏰ Tiempo: {Math.round(currentSession.timeSpent / 1000)}s</span>
                </div>
              </div>

              <div className="enigma-content">
                <div className="enigma-description">
                  <p>{currentEnigma.description}</p>
                </div>

                <div className="investigation-area">
                  <div className="clues-section">
                    <h3>🔍 Pistas Descubiertas</h3>
                    <div className="clues-list">
                      {discoveredClues.map((clue, index) => (
                        <div key={index} className="clue-item">
                          <span className="clue-icon">💡</span>
                          <span className="clue-text">{clue}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="discover-clue-btn"
                      onClick={() => {
                        const availableClues = currentEnigma.clues.filter(
                          clue => !discoveredClues.includes(clue)
                        );
                        if (availableClues.length > 0) {
                          discoverClue(availableClues[0]);
                        }
                      }}
                    >
                      🔍 Descubrir Pista
                    </button>
                  </div>

                  <div className="hypothesis-section">
                    <h3>🧠 Formular Hipótesis</h3>
                    <div className="hypothesis-input">
                      <input
                        type="text"
                        value={currentHypothesis}
                        onChange={(e) => setCurrentHypothesis(e.target.value)}
                        placeholder="Escribe tu hipótesis..."
                      />
                      <button
                        onClick={() => {
                          formulateHypothesis(currentHypothesis);
                          setCurrentHypothesis('');
                        }}
                      >
                        Formular
                      </button>
                    </div>
                    <div className="hypotheses-list">
                      {currentSession.hypotheses.map((hypothesis, index) => (
                        <div key={index} className="hypothesis-item">
                          <span className="hypothesis-icon">💭</span>
                          <span className="hypothesis-text">{hypothesis}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="solution-section">
                    <h3>🎯 Resolver Enigma</h3>
                    <div className="solution-input">
                      <input
                        type="text"
                        placeholder="Escribe tu solución..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            solveEnigma(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        solveEnigma(input.value);
                        input.value = '';
                      }}>
                        Resolver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="enigma-placeholder">
              <div className="placeholder-icon">🔍</div>
              <h2>Selecciona un Enigma</h2>
              <p>Elige un enigma del panel izquierdo para comenzar tu investigación</p>
            </div>
          )}
        </div>

        {/* Panel derecho - Información y controles */}
        <div className="enigma-sidebar right">
          <div className="sidebar-section">
            <h3>📊 Información</h3>
            <div className="info-stats">
              <div className="stat">
                <span>Enigmas Resueltos</span>
                <span>{sessionData.solvedEnigmas}</span>
              </div>
              <div className="stat">
                <span>Puntos de Investigación</span>
                <span>{sessionData.investigationPoints}</span>
              </div>
              <div className="stat">
                <span>Pensamiento Crítico</span>
                <span>{sessionData.criticalThinking}%</span>
              </div>
              <div className="stat">
                <span>Resolución de Problemas</span>
                <span>{sessionData.problemSolving}%</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>🏆 Logros</h3>
            <div className="achievements-list">
              {achievements.slice(0, 3).map(achievement => (
                <div key={achievement.id} className={`achievement ${achievement.unlocked ? 'unlocked' : ''}`}>
                  <span>{achievement.icon}</span>
                  <span>{achievement.title}</span>
                </div>
              ))}
            </div>
            <button 
              className="view-all-btn"
              onClick={() => setShowAchievements(true)}
            >
              Ver Todos
            </button>
          </div>

          <div className="sidebar-section">
            <h3>🤝 Colaboración</h3>
            <button
              className="collaboration-btn"
              onClick={startCollaboration}
            >
              🤝 Iniciar Colaboración
            </button>
          </div>
        </div>
      </div>

      {/* Pistas */}
      {showHints && (
        <div className="enigma-hints" style={{ left: hintPosition.x, top: hintPosition.y }}>
          <div className="hint-content">
            <span className="hint-icon">💡</span>
            <p>{generateEnigmaHint()}</p>
            <button className="hint-audio-btn" onClick={readHint}>
              🔊
            </button>
          </div>
        </div>
      )}

      {/* Modal de colaboración */}
      {showCollaboration && (
        <div className="collaboration-overlay">
          <div className="collaboration-modal">
            <div className="modal-header">
              <h2>🤝 Modo Colaboración</h2>
              <button onClick={() => setShowCollaboration(false)}>✕</button>
            </div>
            <div className="modal-content">
              <p>¡Trabaja con otros investigadores para resolver enigmas más difíciles!</p>
              <div className="collaboration-actions">
                <button onClick={completeCollaboration}>
                  ✅ Completar Colaboración
                </button>
                <button onClick={() => setShowCollaboration(false)}>
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logros */}
      {showAchievements && (
        <div className="achievements-overlay">
          <div className="achievements-container">
            <div className="achievements-header">
              <h2>🏆 Logros del Investigador</h2>
              <button onClick={() => setShowAchievements(false)}>✕</button>
            </div>
            <div className="achievements-list">
              {achievements.map(achievement => (
                <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''}`}>
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <span className="achievement-reward">Recompensa: {achievement.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reporte final */}
      {sessionData.solvedEnigmas >= 3 && (
        <div className="completion-overlay">
          <div className="completion-card">
            <h2>🎉 ¡Investigación Completada!</h2>
            <p>Has resuelto todos los enigmas disponibles. ¡Felicidades!</p>
            <button onClick={() => setShowReport(true)}>
              Ver Reporte Final
            </button>
          </div>
        </div>
      )}

      {/* Reportes */}
      {showReport && (
        <div className="report-overlay">
          <div className="report-container">
            <div className="report-header">
              <h2>📊 Reporte de Investigación</h2>
              <button onClick={() => setShowReport(false)}>✕</button>
            </div>
            <div className="report-content">
              <div className="report-section">
                <h3>👶 Reporte para el Investigador</h3>
                <div className="child-report">
                  {(() => {
                    const report = generateChildEnigmaReport();
                    return (
                      <div>
                        <div className="metric-card">
                          <span>{report.totalEnigmas}</span>
                          <span>Enigmas Totales</span>
                        </div>
                        <div className="metric-card">
                          <span>{report.solvedEnigmas}</span>
                          <span>Enigmas Resueltos</span>
                        </div>
                        <div className="metric-card">
                          <span>{report.accuracy}%</span>
                          <span>Precisión</span>
                        </div>
                        <div className="metric-card">
                          <span>{report.investigationPoints}</span>
                          <span>Puntos de Investigación</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberEnigma; 