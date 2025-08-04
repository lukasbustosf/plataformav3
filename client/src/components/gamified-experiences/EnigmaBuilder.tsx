'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGameSession } from '@/contexts/GameSessionContext';
import { useRouter } from 'next/navigation';
import './EnigmaBuilder.css';

// Interfaces específicas para enigmas
interface Enigma {
  id: string;
  name: string;
  description: string;
  type: 'counting' | 'patterns' | 'logic';
  difficulty: 'easy' | 'medium' | 'hard';
  clues: string[];
  solution: string | number[];
  hints: string[];
  points: number;
}

interface InvestigationTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  unlocked: boolean;
  effect: string;
}

interface EnigmaSession {
  currentEnigma: Enigma | null;
  discoveredClues: string[];
  formulatedHypotheses: string[];
  investigationPoints: number;
  collaborationActive: boolean;
  sessionStartTime: Date;
  toolsUsed: string[];
}

// Enigmas específicos del OA1
const ENIGMAS: Enigma[] = [
  {
    id: 'mystery-lost-numbers',
    name: 'El Misterio de los Números Perdidos',
    description: 'Algunos números han desaparecido de la secuencia. ¿Puedes encontrarlos?',
    type: 'counting',
    difficulty: 'easy',
    clues: [
      'Los números van de 1 en 1',
      'Faltan 3 números en la secuencia',
      'El primer número es 5'
    ],
    solution: [5, 6, 7, 8, 9, 10],
    hints: [
      'Cuenta desde el primer número',
      'Recuerda que van de 1 en 1',
      'Verifica que no falte ningún número'
    ],
    points: 50
  },
  {
    id: 'secret-pattern',
    name: 'El Patrón Secreto',
    description: 'Hay un patrón oculto en estos números. ¿Puedes descubrirlo?',
    type: 'patterns',
    difficulty: 'medium',
    clues: [
      'Los números siguen una regla especial',
      'Cada número es mayor que el anterior',
      'La diferencia entre números es constante'
    ],
    solution: [2, 4, 6, 8, 10, 12],
    hints: [
      'Observa la diferencia entre números consecutivos',
      '¿Qué número sumas cada vez?',
      'El patrón es de 2 en 2'
    ],
    points: 75
  },
  {
    id: 'logic-investigator',
    name: 'La Lógica del Investigador',
    description: 'Usa tu lógica para resolver este enigma numérico.',
    type: 'logic',
    difficulty: 'hard',
    clues: [
      'Hay una regla matemática oculta',
      'Los números están relacionados',
      'Piensa en sumas y restas'
    ],
    solution: [1, 3, 6, 10, 15, 21],
    hints: [
      'Observa cómo crecen los números',
      '¿Qué número sumas cada vez?',
      'Es una secuencia triangular'
    ],
    points: 100
  }
];

// Herramientas específicas para investigación
const INVESTIGATION_TOOLS: InvestigationTool[] = [
  {
    id: 'magnifying_glass',
    name: 'Lupa de Investigación',
    description: 'Revela pistas ocultas en los números',
    icon: '🔍',
    cost: 20,
    unlocked: true,
    effect: 'Revela una pista adicional'
  },
  {
    id: 'pattern_scanner',
    name: 'Escáner de Patrones',
    description: 'Analiza patrones numéricos automáticamente',
    icon: '📊',
    cost: 30,
    unlocked: false,
    effect: 'Identifica patrones automáticamente'
  },
  {
    id: 'logic_analyzer',
    name: 'Analizador Lógico',
    description: 'Ayuda a resolver enigmas complejos',
    icon: '🧠',
    cost: 40,
    unlocked: false,
    effect: 'Proporciona análisis lógico'
  },
  {
    id: 'collaboration_network',
    name: 'Red de Colaboración',
    description: 'Conecta con otros investigadores',
    icon: '🤝',
    cost: 25,
    unlocked: true,
    effect: 'Permite colaboración en tiempo real'
  }
];

const EnigmaBuilder: React.FC = () => {
  const { state, dispatch } = useGameSession();
  const router = useRouter();

  // Estados específicos para investigación
  const [enigmaSession, setEnigmaSession] = useState<EnigmaSession>({
    currentEnigma: null,
    discoveredClues: [],
    formulatedHypotheses: [],
    investigationPoints: 100,
    collaborationActive: false,
    sessionStartTime: new Date(),
    toolsUsed: []
  });

  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [currentSolution, setCurrentSolution] = useState('');
  const [solutionError, setSolutionError] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);

  // Estados de audio
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Función de voz estandarizada
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
      }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }, []);

  // Funciones específicas para investigación
  const discoverClue = useCallback((clue: string) => {
    if (!enigmaSession.currentEnigma) return;
    
    if (!enigmaSession.discoveredClues.includes(clue)) {
      setEnigmaSession(prev => ({
        ...prev,
        discoveredClues: [...prev.discoveredClues, clue],
        investigationPoints: prev.investigationPoints + 10
      }));
      
      playSound('success');
      speak(`¡Excelente! Has descubierto una pista: ${clue}`);
      
      // Actualizar métricas
      dispatch({ type: 'INCREMENT_ACTION' });
    }
  }, [enigmaSession, playSound, speak, dispatch]);

  const formulateHypothesis = useCallback((hypothesis: string) => {
    if (!enigmaSession.currentEnigma) return;
    
    setEnigmaSession(prev => ({
      ...prev,
      formulatedHypotheses: [...prev.formulatedHypotheses, hypothesis],
      investigationPoints: prev.investigationPoints + 15
    }));
    
    playSound('success');
    speak('¡Buena hipótesis! Sigue investigando.');
    
    // Actualizar métricas
    dispatch({ type: 'INCREMENT_ACTION' });
  }, [enigmaSession, playSound, speak, dispatch]);

  const solveEnigma = useCallback((solution: string) => {
    if (!enigmaSession.currentEnigma) return;
    
    const currentEnigma = enigmaSession.currentEnigma;
    let isCorrect = false;
    
    if (Array.isArray(currentEnigma.solution)) {
      // Para soluciones de arrays (patrones)
      const userSolution = solution.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      isCorrect = JSON.stringify(userSolution) === JSON.stringify(currentEnigma.solution);
    } else {
      // Para soluciones de string (números individuales)
      isCorrect = solution.trim() === currentEnigma.solution.toString();
    }
    
    if (isCorrect) {
      playSound('achievement');
      speak(`¡Felicitaciones! Has resuelto el enigma: ${currentEnigma.name}`);
      
      // Actualizar métricas
      dispatch({ type: 'INCREMENT_ACTION' });
      dispatch({ type: 'INCREMENT_PATTERN_DISCOVERY' });
      
      // Seleccionar siguiente enigma
      const currentIndex = ENIGMAS.findIndex(e => e.id === currentEnigma.id);
      const nextEnigma = ENIGMAS[currentIndex + 1];
      
      if (nextEnigma) {
        setEnigmaSession(prev => ({
          ...prev,
          currentEnigma: nextEnigma,
          discoveredClues: [],
          formulatedHypotheses: []
        }));
        speak(`¡Excelente! Ahora vamos con el siguiente enigma: ${nextEnigma.name}`);
      } else {
        speak('¡Has completado todos los enigmas! ¡Eres un investigador experto!');
      }
    } else {
      playSound('error');
      setSolutionError('Intenta de nuevo. Revisa tu respuesta.');
      speak('Esa no es la respuesta correcta. Sigue investigando.');
    }
  }, [enigmaSession, playSound, speak, dispatch]);

  // Sistema de colaboración
  const startCollaboration = useCallback(() => {
    setEnigmaSession(prev => ({
      ...prev,
      collaborationActive: true
    }));
    setShowCollaborationModal(true);
    speak('Has iniciado una sesión de colaboración. ¡Trabaja en equipo!');
  }, [speak]);

  const completeCollaboration = useCallback(() => {
    setEnigmaSession(prev => ({
      ...prev,
      collaborationActive: false
    }));
    setShowCollaborationModal(false);
    playSound('success');
    speak('¡Excelente trabajo en equipo!');
    
    // Actualizar métricas
    dispatch({ type: 'INCREMENT_ACTION' });
  }, [playSound, speak, dispatch]);

  // Inicializar primer enigma
  useEffect(() => {
    if (!enigmaSession.currentEnigma && ENIGMAS.length > 0) {
      setEnigmaSession(prev => ({
        ...prev,
        currentEnigma: ENIGMAS[0]
      }));
    }
  }, [enigmaSession.currentEnigma]);

  // Actualizar tiempo de engagement
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'INCREMENT_ACTION' });
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, [dispatch]);

  // Bienvenida
  const welcomeSteps = [
    {
      title: "¡Hola Investigador! 🔍",
      message: "Soy el Profesor Carlos y te voy a enseñar a resolver enigmas numéricos. ¿Estás listo para esta aventura?",
      icon: "🔍",
      action: "¡Sí, estoy listo!"
    },
    {
      title: "🔍 Tu Misión",
      message: "Vas a resolver enigmas matemáticos usando herramientas de investigación. Cada enigma tiene pistas ocultas que debes descubrir.",
      icon: "🔍",
      action: "Entiendo"
    },
    {
      title: "🛠️ Herramientas de Investigación",
      message: "Tienes herramientas especiales: Lupa para pistas, Escáner de patrones, Analizador lógico y Red de colaboración.",
      icon: "🛠️",
      action: "¡Genial!"
    },
    {
      title: "🤝 Colaboración",
      message: "Puedes trabajar en equipo con otros investigadores para resolver enigmas más difíciles.",
      icon: "🤝",
      action: "¡Perfecto!"
    },
    {
      title: "🎯 Cómo Investigar",
      message: "1. Lee el enigma cuidadosamente\n2. Usa las herramientas para descubrir pistas\n3. Formula hipótesis\n4. Resuelve el enigma\n5. ¡Colabora con otros!",
      icon: "🎯",
      action: "¡Empezar a investigar!"
    }
  ];

  const handleWelcomeNext = () => {
    if (welcomeStep < welcomeSteps.length - 1) {
      setWelcomeStep(welcomeStep + 1);
      speak(welcomeSteps[welcomeStep + 1].message);
    } else {
      setShowWelcome(false);
      speak('¡Perfecto! Ahora vamos a resolver enigmas. Elige tu primer enigma.');
    }
  };

  const handleWelcomeSkip = () => {
    setShowWelcome(false);
    speak('¡Perfecto! Ahora vamos a resolver enigmas. Elige tu primer enigma.');
  };

  const handleSolutionSubmit = () => {
    if (!currentSolution.trim()) {
      setSolutionError('Por favor, escribe una solución.');
      return;
    }
    
    solveEnigma(currentSolution);
    setCurrentSolution('');
    setSolutionError('');
    setShowSolutionModal(false);
  };

  // Generar reportes específicos para investigación
  const generateChildEnigmaReport = () => {
    return {
      title: '🔍 Reporte de Investigación',
      metrics: {
        enigmasResueltos: {
          value: enigmaSession.currentEnigma ? ENIGMAS.indexOf(enigmaSession.currentEnigma) : 0,
          icon: '🔍',
          label: 'Enigmas Resueltos',
          achievement: '🏆 ¡Excelente Investigador!'
        },
        pistasDescubiertas: {
          value: enigmaSession.discoveredClues.length,
          icon: '🔎',
          label: 'Pistas Descubiertas',
          achievement: '🌟 ¡Muy Observador!'
        },
        hipotesisFormuladas: {
          value: enigmaSession.formulatedHypotheses.length,
          icon: '💭',
          label: 'Hipótesis Formuladas',
          achievement: '🧠 ¡Muy Inteligente!'
        },
        puntosInvestigacion: {
          value: enigmaSession.investigationPoints,
          icon: '⭐',
          label: 'Puntos de Investigación',
          achievement: '⭐ ¡Investigador Experto!'
        }
      },
      progress: {
        enigma1: { completed: enigmaSession.currentEnigma?.id === 'mystery-lost-numbers', icon: '🔍', name: 'Misterio de Números' },
        enigma2: { completed: enigmaSession.currentEnigma?.id === 'secret-pattern', icon: '📊', name: 'Patrón Secreto' },
        enigma3: { completed: enigmaSession.currentEnigma?.id === 'logic-investigator', icon: '🧠', name: 'Lógica del Investigador' }
      },
      specialAchievements: [
        { id: 'first-clue', earned: enigmaSession.discoveredClues.length > 0, icon: '🔎', title: 'Primera Pista' },
        { id: 'first-hypothesis', earned: enigmaSession.formulatedHypotheses.length > 0, icon: '💭', title: 'Primera Hipótesis' },
        { id: 'first-enigma', earned: enigmaSession.currentEnigma?.id !== 'mystery-lost-numbers', icon: '🏆', title: 'Primer Enigma' }
      ]
    };
  };

  const generateParentEnigmaReport = () => {
    return {
      summary: {
        sessionDate: new Date().toLocaleDateString('es-ES'),
        totalTime: `${Math.floor((state.totalActions || 0) / 60)}:${(state.totalActions || 0) % 60}`,
        overallProgress: Math.round(((ENIGMAS.indexOf(enigmaSession.currentEnigma || ENIGMAS[0]) + 1) / ENIGMAS.length) * 100),
        engagementLevel: 'Alto'
      },
      academicMetrics: {
        investigationSkills: {
          value: state.totalActions || 0,
          label: 'Habilidades de Investigación',
          description: 'Capacidad para resolver problemas mediante investigación'
        },
        analyticalThinking: {
          value: enigmaSession.formulatedHypotheses.length * 10,
          label: 'Pensamiento Analítico',
          description: 'Capacidad para formular y probar hipótesis'
        },
        patternRecognition: {
          value: state.patternsDiscovered || 0,
          label: 'Reconocimiento de Patrones',
          description: 'Habilidad para identificar patrones numéricos'
        }
      },
      homeActivities: [
        {
          title: 'Investigador en Casa',
          description: 'Crea enigmas numéricos simples para resolver en familia',
          difficulty: 'Fácil',
          duration: '10-15 minutos',
          materials: 'Papel, lápiz, números del 1 al 20'
        },
        {
          title: 'Búsqueda de Patrones',
          description: 'Busca patrones en objetos cotidianos (escaleras, ventanas)',
          difficulty: 'Medio',
          duration: '15-20 minutos',
          materials: 'Observación del entorno'
        }
      ],
      behavioralObservations: {
        attentionSpan: 'Excelente',
        persistence: 'Muy bueno',
        problemSolving: 'Excelente',
        creativity: 'Muy bueno'
      },
      nextSteps: {
        immediate: 'Continuar con el siguiente enigma',
        shortTerm: 'Completar todos los enigmas disponibles',
        longTerm: 'Desarrollar habilidades de investigación avanzadas'
      }
    };
  };

  const generateTeacherEnigmaReport = () => {
    return {
      studentInfo: {
        name: 'Estudiante',
        grade: '1° Básico',
        sessionDate: new Date().toLocaleDateString('es-ES'),
        sessionDuration: `${Math.floor((state.totalActions || 0) / 60)}:${(state.totalActions || 0) % 60}`
      },
      curricularStandards: {
        MA01OA01: {
          standard: 'Contar números del 0 al 100',
          mastery: Math.round(((state.totalActions || 0) / 300) * 100),
          evidence: [
            `Resolvió ${enigmaSession.currentEnigma ? ENIGMAS.indexOf(enigmaSession.currentEnigma) : 0} enigmas`,
            `Descubrió ${enigmaSession.discoveredClues.length} pistas`,
            `Formuló ${enigmaSession.formulatedHypotheses.length} hipótesis`
          ],
          areasForImprovement: ['Patrones complejos', 'Secuencias avanzadas'],
          recommendations: ['Más práctica con patrones', 'Enigmas más complejos']
        }
      },
      errorAnalysis: {
        mostCommonErrors: [
          { error: 'Patrones no identificados', frequency: 0, percentage: 0 },
          { error: 'Secuencias incompletas', frequency: 0, percentage: 0 }
        ],
        errorPatterns: 'Necesita más práctica con patrones complejos',
        interventionStrategies: ['Más enigmas de patrones', 'Práctica con secuencias']
      },
      classComparison: {
        studentPercentile: 85,
        classAverage: 75,
        peerComparison: 'Por encima del promedio de la clase',
        growthRate: 15
      },
      interventionPlan: {
        immediateActions: ['Continuar con enigmas de patrones', 'Fomentar colaboración'],
        shortTermGoals: ['Completar todos los enigmas', 'Mejorar reconocimiento de patrones'],
        longTermObjectives: ['Desarrollar pensamiento lógico avanzado', 'Aplicar investigación a otros OAs']
      }
    };
  };

  if (showWelcome) {
    return (
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
            <button className="welcome-btn welcome-skip" onClick={handleWelcomeSkip}>
              Saltar
            </button>
            <button className="welcome-btn welcome-next" onClick={handleWelcomeNext}>
              {welcomeSteps[welcomeStep].action}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enigma-container">
      <div className="enigma-main">
        <div className="enigma-workspace">
          <div className="enigma-header">
            <h1>🔍 El Enigma Numérico</h1>
            <div className="enigma-stats">
              <span>⭐ {enigmaSession.investigationPoints} puntos</span>
              <span>🔍 {enigmaSession.discoveredClues.length} pistas</span>
              <span>💭 {enigmaSession.formulatedHypotheses.length} hipótesis</span>
            </div>
          </div>

          {enigmaSession.currentEnigma && (
            <div className="enigma-card">
              <h2>{enigmaSession.currentEnigma.name}</h2>
              <p>{enigmaSession.currentEnigma.description}</p>
              
              <div className="enigma-difficulty">
                Dificultad: {enigmaSession.currentEnigma.difficulty === 'easy' ? '🟢 Fácil' : 
                           enigmaSession.currentEnigma.difficulty === 'medium' ? '🟡 Medio' : '🔴 Difícil'}
              </div>
              
              <div className="enigma-clues">
                <h3>🔍 Pistas Disponibles:</h3>
                {enigmaSession.currentEnigma.clues.map((clue, index) => (
                  <div key={index} className="clue-item">
                    <button 
                      className={`clue-btn ${enigmaSession.discoveredClues.includes(clue) ? 'discovered' : ''}`}
                      onClick={() => discoverClue(clue)}
                      disabled={enigmaSession.discoveredClues.includes(clue)}
                    >
                      {enigmaSession.discoveredClues.includes(clue) ? '✅' : '🔍'} {clue}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="enigma-solution">
                <button 
                  className="solve-btn"
                  onClick={() => setShowSolutionModal(true)}
                >
                  🎯 Resolver Enigma
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="enigma-sidebar">
        <div className="investigation-tools">
          <h3>🛠️ Herramientas de Investigación</h3>
          {INVESTIGATION_TOOLS.map(tool => (
            <div key={tool.id} className="tool-item">
              <button 
                className={`tool-btn ${tool.unlocked ? 'unlocked' : 'locked'}`}
                onClick={() => {
                  if (tool.unlocked) {
                    speak(`Usando ${tool.name}: ${tool.effect}`);
                    setEnigmaSession(prev => ({
                      ...prev,
                      toolsUsed: [...prev.toolsUsed, tool.id],
                      investigationPoints: prev.investigationPoints - tool.cost
                    }));
                  }
                }}
                disabled={!tool.unlocked || enigmaSession.investigationPoints < tool.cost}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-name">{tool.name}</span>
                <span className="tool-cost">💎 {tool.cost}</span>
              </button>
            </div>
          ))}
        </div>

        <div className="investigation-area">
          <div className="clues-section">
            <h3>🔍 Pistas Descubiertas</h3>
            {enigmaSession.discoveredClues.map((clue, index) => (
              <div key={index} className="clue-display">
                ✅ {clue}
              </div>
            ))}
          </div>

          <div className="hypothesis-section">
            <h3>💭 Hipótesis Formuladas</h3>
            {enigmaSession.formulatedHypotheses.map((hypothesis, index) => (
              <div key={index} className="hypothesis-display">
                💭 {hypothesis}
              </div>
            ))}
            <button 
              className="formulate-btn"
              onClick={() => {
                const hypothesis = prompt('Formula una hipótesis sobre el enigma:');
                if (hypothesis) {
                  formulateHypothesis(hypothesis);
                }
              }}
            >
              💭 Formular Hipótesis
            </button>
          </div>
        </div>

        <div className="collaboration-section">
          <button 
            className={`collaboration-btn ${enigmaSession.collaborationActive ? 'active' : ''}`}
            onClick={startCollaboration}
          >
            🤝 {enigmaSession.collaborationActive ? 'Colaborando...' : 'Iniciar Colaboración'}
          </button>
        </div>
      </div>

      {/* Modal de Colaboración */}
      {showCollaborationModal && (
        <div className="collaboration-overlay">
          <div className="collaboration-modal">
            <div className="collaboration-header">
              <h2>🤝 Sesión de Colaboración</h2>
              <button onClick={() => setShowCollaborationModal(false)}>✕</button>
            </div>
            <div className="collaboration-content">
              <p>¡Trabaja en equipo con otros investigadores!</p>
              <div className="collaboration-actions">
                <button onClick={completeCollaboration}>
                  ✅ Completar Colaboración
                </button>
                <button onClick={() => setShowCollaborationModal(false)}>
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Solución */}
      {showSolutionModal && enigmaSession.currentEnigma && (
        <div className="solution-overlay">
          <div className="solution-modal">
            <div className="solution-header">
              <h2>🎯 Resolver Enigma</h2>
              <button onClick={() => setShowSolutionModal(false)}>✕</button>
            </div>
            <div className="solution-content">
              <h3>{enigmaSession.currentEnigma.name}</h3>
              <p>{enigmaSession.currentEnigma.description}</p>
              
              <div className="solution-input">
                <label>
                  {Array.isArray(enigmaSession.currentEnigma.solution) 
                    ? "Escribe los números separados por comas:" 
                    : "Escribe tu respuesta:"}
                </label>
                <input
                  type="text"
                  value={currentSolution}
                  onChange={(e) => setCurrentSolution(e.target.value)}
                  placeholder={Array.isArray(enigmaSession.currentEnigma.solution) ? "1, 2, 3, 4, 5" : "Tu respuesta"}
                />
                {solutionError && <div className="error-message">{solutionError}</div>}
              </div>
              
              <div className="solution-actions">
                <button onClick={handleSolutionSubmit}>
                  🎯 Comprobar Solución
                </button>
                <button onClick={() => setShowSolutionModal(false)}>
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnigmaBuilder; 