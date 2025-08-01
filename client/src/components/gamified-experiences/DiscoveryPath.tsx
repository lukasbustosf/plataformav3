'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameSession } from '@/contexts/GameSessionContext';
import './DiscoveryPath.css';

interface DiscoveryPathProps {
  experienceId: string;
  sessionId?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  points: number;
}

interface ActivityReport {
  totalScore: number;
  patternsFound: number;
  hypothesesTested: number;
  challengesCompleted: number;
  timeSpent: number;
  recommendations: string[];
}

const DiscoveryPath: React.FC<DiscoveryPathProps> = ({ experienceId, sessionId }) => {
  const { state, startSession, dispatch } = useGameSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [feedbackQueue, setFeedbackQueue] = useState<any[]>([]);
  
  const [showRewards, setShowRewards] = useState(false);
  const [showFamilyMode, setShowFamilyMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showActivityReport, setShowActivityReport] = useState(false);
  
  // Estados para interactividad
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [currentPattern, setCurrentPattern] = useState<string>('');
  const [patternFound, setPatternFound] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  
  // Nuevos estados para mejorar la experiencia
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showTeacher, setShowTeacher] = useState(false);
  const [teacherMessage, setTeacherMessage] = useState('');
  const [showNumberScale, setShowNumberScale] = useState(false);
  const [scaleNumbers, setScaleNumbers] = useState<number[]>([]);
  const [avatar, setAvatar] = useState('🧑‍🎓');
  const [showCelebration, setShowCelebration] = useState(false);

  // Funcionalidad de voz
  const speechRef = useRef<SpeechSynthesis | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  // Estados para checklist minimizable/movible
  const [checklistMinimized, setChecklistMinimized] = useState(false);
  const [checklistPosition, setChecklistPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Estado para reporte de actividad
  const [activityStartTime] = useState(Date.now());
  const [activityReport, setActivityReport] = useState<ActivityReport>({
    totalScore: 0,
    patternsFound: 0,
    hypothesesTested: 0,
    challengesCompleted: 0,
    timeSpent: 0,
    recommendations: []
  });

  // Sistema de desafíos y logros
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'first_pattern',
      title: 'Primer Patrón',
      description: 'Descubre tu primer patrón numérico',
      icon: '🔍',
      completed: false,
      points: 50
    },
    {
      id: 'three_patterns',
      title: 'Explorador Avanzado',
      description: 'Descubre 3 patrones diferentes',
      icon: '🌟',
      completed: false,
      points: 100
    },
    {
      id: 'hypothesis_master',
      title: 'Científico',
      description: 'Prueba 5 hipótesis correctamente',
      icon: '🧪',
      completed: false,
      points: 150
    },
    {
      id: 'sequence_master',
      title: 'Maestro de Secuencias',
      description: 'Completa una secuencia de 5 números',
      icon: '📊',
      completed: false,
      points: 200
    },
    {
      id: 'perfect_score',
      title: 'Puntuación Perfecta',
      description: 'Alcanza 500 puntos',
      icon: '🏆',
      completed: false,
      points: 300
    }
  ]);

  // Tutorial steps
  const tutorialSteps = [
    {
      message: "¡Hola! Soy la Profesora Ana 👩‍🏫. Te voy a enseñar a descubrir patrones numéricos.",
      action: "next"
    },
    {
      message: "Mira esta balanza numérica. Los números están ordenados del 0 al 20.",
      action: "show_scale"
    },
    {
      message: "Tu misión es seleccionar números que sigan un patrón. Por ejemplo: 2, 4, 6, 8...",
      action: "example"
    },
    {
      message: "¿Ves el patrón? Van de 2 en 2. ¡Ahora tú intenta encontrar otros patrones!",
      action: "start_game"
    }
  ];

  // Inicializar funcionalidad de voz
  useEffect(() => {
    initializeSpeech();
  }, []);

  const initializeSpeech = () => {
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
      setSpeechEnabled(true);
      
      // Configurar voz en español si está disponible
      const voices = speechRef.current.getVoices();
      const spanishVoice = voices.find(voice => 
        voice.lang.includes('es') || voice.lang.includes('ES')
      );
      
      // Nota: No podemos establecer defaultVoice directamente, pero podemos usar la voz en speak()
    }
  };

  const speak = (text: string) => {
    if (speechRef.current && speechEnabled) {
      // Cancelar cualquier speech anterior
      speechRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Intentar usar voz en español si está disponible
      const voices = speechRef.current.getVoices();
      const spanishVoice = voices.find(voice => 
        voice.lang.includes('es') || voice.lang.includes('ES')
      );
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      speechRef.current.speak(utterance);
    }
  };

  const playSound = (type: 'success' | 'error' | 'click' | 'celebration') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configurar frecuencia y duración según el tipo de sonido
      let frequency = 440; // A4
      let duration = 0.1;
      
      switch (type) {
        case 'success':
          frequency = 523; // C5
          duration = 0.3;
          break;
        case 'error':
          frequency = 220; // A3
          duration = 0.2;
          break;
        case 'click':
          frequency = 330; // E4
          duration = 0.1;
          break;
        case 'celebration':
          frequency = 659; // E5
          duration = 0.5;
          break;
      }
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  // Función para completar desafíos
  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true }
        : challenge
    ));
  };

  // Función para verificar logros - CORREGIDA
  const checkAchievements = () => {
    const patternsFound = state.rewards.filter(r => 
      r.title.includes('Patrón') || r.title.includes('Descubridor')
    ).length;
    const hypothesesTested = state.hypotheses.length;
    const currentScore = score;

    console.log('Verificando logros:', { patternsFound, hypothesesTested, currentScore, selectedNumbers: selectedNumbers.length });

    // Verificar logros con condiciones más claras
    if (patternsFound >= 1 && !challenges.find(c => c.id === 'first_pattern')?.completed) {
      completeChallenge('first_pattern');
      setScore(prev => prev + 50);
      speak('¡Logro desbloqueado! Descubriste tu primer patrón.');
      console.log('Logro desbloqueado: Primer Patrón');
    }

    if (patternsFound >= 3 && !challenges.find(c => c.id === 'three_patterns')?.completed) {
      completeChallenge('three_patterns');
      setScore(prev => prev + 100);
      speak('¡Excelente! Eres un explorador avanzado.');
      console.log('Logro desbloqueado: Explorador Avanzado');
    }

    if (hypothesesTested >= 5 && !challenges.find(c => c.id === 'hypothesis_master')?.completed) {
      completeChallenge('hypothesis_master');
      setScore(prev => prev + 150);
      speak('¡Felicidades! Eres un científico en acción.');
      console.log('Logro desbloqueado: Científico');
    }

    if (selectedNumbers.length >= 5 && patternFound && !challenges.find(c => c.id === 'sequence_master')?.completed) {
      completeChallenge('sequence_master');
      setScore(prev => prev + 200);
      speak('¡Increíble! Eres un maestro de secuencias.');
      console.log('Logro desbloqueado: Maestro de Secuencias');
    }

    if (currentScore >= 500 && !challenges.find(c => c.id === 'perfect_score')?.completed) {
      completeChallenge('perfect_score');
      setScore(prev => prev + 300);
      speak('¡Puntuación perfecta! ¡Eres un genio de las matemáticas!');
      console.log('Logro desbloqueado: Puntuación Perfecta');
    }
  };

  // Vocalizar el primer mensaje del tutorial inmediatamente
  useEffect(() => {
    if (showTutorial && tutorialStep === 0 && speechEnabled) {
      // Pequeño delay para asegurar que la voz esté lista
      setTimeout(() => {
        speak(tutorialSteps[0].message);
      }, 500);
    }
  }, [showTutorial, tutorialStep, speechEnabled]);

  // Inicializar sesión y voz
  useEffect(() => {
    initializeSession();
  }, [experienceId]);

  // Estado para mostrar checklist siempre visible
  const [showAlwaysVisibleChecklist, setShowAlwaysVisibleChecklist] = useState(true);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [hintMinimized, setHintMinimized] = useState(false);

  // Generar pistas dinámicas basadas en el progreso - MEJORADA
  const generateHint = () => {
    const patternsFound = state.rewards.filter(r => 
      r.title.includes('Patrón') || r.title.includes('Descubridor')
    ).length;
    const selectedCount = selectedNumbers.length;
    const hypothesesCount = state.hypotheses.length;
    
    console.log('Generando pista:', { patternsFound, selectedCount, hypothesesCount, patternFound });
    
    if (patternsFound === 0) {
      return "💡 Pista: Selecciona 3 números que sigan un patrón (ej: 2, 4, 6)";
    } else if (patternsFound === 1) {
      return "💡 Pista: Intenta encontrar un patrón diferente (ej: 1, 3, 5 o 5, 10, 15)";
    } else if (patternsFound === 2) {
      return "💡 Pista: ¡Excelente! Busca tu tercer patrón para ser un explorador avanzado";
    } else if (selectedCount < 3) {
      return "💡 Pista: Necesitas seleccionar al menos 3 números para encontrar un patrón";
    } else if (selectedCount >= 3 && !patternFound) {
      return "💡 Pista: Los números seleccionados no siguen un patrón. Intenta con otros números";
    } else if (hypothesesCount < 3) {
      return "💡 Pista: Prueba más hipótesis para convertirte en científico";
    } else if (hypothesesCount < 5) {
      return "💡 Pista: ¡Casi eres científico! Prueba 2 hipótesis más";
    } else {
      return "💡 Pista: ¡Excelente! Sigue explorando más patrones y secuencias";
    }
  };

  // Actualizar pista cuando cambie el estado
  useEffect(() => {
    setCurrentHint(generateHint());
  }, [selectedNumbers, patternFound, state.rewards]);

  // Función para generar reporte de actividad
  const generateActivityReport = (): ActivityReport => {
    const timeSpent = Math.floor((Date.now() - activityStartTime) / 1000 / 60); // minutos
    const patternsFound = state.rewards.filter(r => r.title.includes('Patrón')).length;
    const hypothesesTested = state.hypotheses.length;
    const challengesCompleted = challenges.filter(c => c.completed).length;
    
    const recommendations = [];
    if (patternsFound < 3) {
      recommendations.push("Practica más patrones numéricos para mejorar tu comprensión");
    }
    if (hypothesesTested < 5) {
      recommendations.push("Prueba más hipótesis para desarrollar tu pensamiento científico");
    }
    if (score < 300) {
      recommendations.push("Completa más actividades para alcanzar una puntuación más alta");
    }
    if (recommendations.length === 0) {
      recommendations.push("¡Excelente trabajo! Continúa explorando las matemáticas");
    }

    return {
      totalScore: score,
      patternsFound,
      hypothesesTested,
      challengesCompleted,
      timeSpent,
      recommendations
    };
  };

  // Función para manejar el drag del checklist
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setChecklistPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const initializeSession = async () => {
    try {
      setLoading(true);
      
      // Inicializar sesión de juego
      if (sessionId) {
        await startSession(sessionId);
      }
      
      // Dar la bienvenida con voz
      setTimeout(() => {
        const welcomeMessage = "¡Bienvenido a la Aventura Numérica! Vamos a descubrir patrones mágicos juntos.";
        setTeacherMessage(welcomeMessage);
        setShowTeacher(true);
        speak(welcomeMessage);
        setTimeout(() => setShowTeacher(false), 3000);
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleTutorialNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
      const step = tutorialSteps[tutorialStep + 1];
      
      // Hablar la instrucción
      speak(step.message);
      
      if (step.action === 'show_scale') {
        setShowNumberScale(true);
        setScaleNumbers([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
      } else if (step.action === 'example') {
        setSelectedNumbers([2, 4, 6, 8]);
        setCurrentPattern('Secuencia de 2 en 2');
        setPatternFound(true);
      } else if (step.action === 'start_game') {
        setShowTutorial(false);
        setShowNumberScale(false);
        setSelectedNumbers([]);
        setCurrentPattern('');
        setPatternFound(false);
        const startMessage = '¡Perfecto! Ahora es tu turno. Selecciona números y descubre patrones.';
        setTeacherMessage(startMessage);
        setShowTeacher(true);
        speak(startMessage);
        setTimeout(() => setShowTeacher(false), 3000);
      }
    }
  };

  const handleNumberClick = (number: number) => {
    playSound('click');
    
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handlePatternDiscovery = async () => {
    try {
      setCurrentAction('pattern_discovery');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedNumbers.length >= 3) {
        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
        const differences: number[] = []; 
        
        for (let i = 1; i < sortedNumbers.length; i++) {
          differences.push(sortedNumbers[i] - sortedNumbers[i-1]);
        }
        
        const isConsistent = differences.every(diff => diff === differences[0]);
        
        if (isConsistent) {
          const pattern = `Secuencia de ${differences[0]} en ${differences[0]}`;
          setCurrentPattern(pattern);
          setPatternFound(true);
          setScore(prev => prev + 50);
          
          playSound('success');
          
          dispatch({
            type: 'ADD_REWARD',
            payload: {
              id: `pattern_${Date.now()}`,
              type: 'achievement',
              title: 'Patrón Descubierto',
              description: `Encontraste el patrón: ${pattern}`,
              icon: '🔍',
              rarity: 'rare',
              unlocked: true,
              claimed: false,
              unlockedAt: new Date()
            }
          });
          
          const successMessage = `¡Excelente! Descubriste el patrón: ${pattern}. ¡Ganaste 50 puntos!`;
          setFeedbackQueue(prev => [...prev, {
            type: 'success',
            message: successMessage,
            timestamp: new Date()
          }]);
          
          speak(successMessage);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2000);
          
          // Verificar logros después de descubrir patrón
          setTimeout(checkAchievements, 1000);
        } else {
          const errorMessage = 'Los números seleccionados no siguen un patrón claro. Intenta seleccionar números que vayan en orden, como 1, 3, 5, 7 o 2, 4, 6, 8.';
          setFeedbackQueue(prev => [...prev, {
            type: 'error',
            message: errorMessage,
            timestamp: new Date()
          }]);
          
          playSound('error');
          speak(errorMessage);
        }
      } else {
        const errorMessage = 'Selecciona al menos 3 números para descubrir un patrón.';
        setFeedbackQueue(prev => [...prev, {
          type: 'error',
          message: errorMessage,
          timestamp: new Date()
        }]);
        
        playSound('error');
        speak(errorMessage);
      }
      setShowFeedback(true);
    } catch (error) {
      console.error('Error al procesar patrón:', error);
      const errorMessage = 'Error al procesar el patrón. Intenta de nuevo.';
      setFeedbackQueue(prev => [...prev, {
        type: 'error',
        message: errorMessage,
        timestamp: new Date()
      }]);
      
      playSound('error');
      speak(errorMessage);
      setShowFeedback(true);
    } finally {
      setCurrentAction(null);
    }
  };

  const handleHypothesisTest = async () => {
    try {
      setCurrentAction('hypothesis_test');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (selectedNumbers.length >= 2) {
        const hypothesis = 'Los números seleccionados siguen una secuencia ascendente';
        const isCorrect = selectedNumbers.every((num, index) => 
          index === 0 || num > selectedNumbers[index - 1]
        );
        
        dispatch({
          type: 'ADD_HYPOTHESIS',
          payload: {
            id: `hypothesis_${Date.now()}`,
            pattern: hypothesis,
            numbers: selectedNumbers,
            isCorrect,
            createdAt: new Date(),
            testedAt: new Date()
          }
        });
        
        if (isCorrect) {
          setScore(prev => prev + 30);
          const successMessage = '¡Hipótesis correcta! Los números siguen una secuencia ascendente. ¡Ganaste 30 puntos!';
          setFeedbackQueue(prev => [...prev, {
            type: 'success',
            message: successMessage,
            timestamp: new Date()
          }]);
          
          playSound('success');
          speak(successMessage);
          
          dispatch({
            type: 'ADD_REWARD',
            payload: {
              id: `hypothesis_${Date.now()}`,
              type: 'achievement',
              title: 'Científico en Acción',
              description: 'Formulaste y probaste una hipótesis correctamente',
              icon: '🧪',
              rarity: 'epic',
              unlocked: true,
              claimed: false,
              unlockedAt: new Date()
            }
          });
          
          // Verificar logros después de probar hipótesis
          setTimeout(checkAchievements, 1000);
        } else {
          const errorMessage = 'Hipótesis incorrecta. Los números no siguen una secuencia ascendente. Intenta con números ordenados.';
          setFeedbackQueue(prev => [...prev, {
            type: 'error',
            message: errorMessage,
            timestamp: new Date()
          }]);
          
          playSound('error');
          speak(errorMessage);
        }
      } else {
        const errorMessage = 'Selecciona al menos 2 números para probar una hipótesis.';
        setFeedbackQueue(prev => [...prev, {
          type: 'error',
          message: errorMessage,
          timestamp: new Date()
        }]);
        
        playSound('error');
        speak(errorMessage);
      }
      setShowFeedback(true);
    } catch (error) {
      console.error('Error al probar hipótesis:', error);
      const errorMessage = 'Error al probar la hipótesis. Intenta de nuevo.';
      setFeedbackQueue(prev => [...prev, {
        type: 'error',
        message: errorMessage,
        timestamp: new Date()
      }]);
      
      playSound('error');
      speak(errorMessage);
      setShowFeedback(true);
    } finally {
      setCurrentAction(null);
    }
  };

  const handleChallengeComplete = async () => {
    try {
      setCurrentAction('challenge_complete');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (patternFound && selectedNumbers.length >= 5) {
        setChallengeCompleted(true);
        setScore(prev => prev + 100);
        setLevel(prev => prev + 1);
        
        playSound('celebration');
        
        dispatch({
          type: 'COMPLETE_CHALLENGE',
          payload: { challengeId: 'pattern_challenge', world: 'bosque_decenas' }
        });
        
        dispatch({
          type: 'ADD_REWARD',
          payload: {
            id: `challenge_${Date.now()}`,
            type: 'achievement',
            title: 'Maestro de Patrones',
            description: 'Completaste el desafío de descubrimiento de patrones',
            icon: '🏆',
            rarity: 'legendary',
            unlocked: true,
            claimed: false,
            unlockedAt: new Date()
          }
        });
        
        const successMessage = `¡Felicidades! Completaste el desafío de patrones numéricos. ¡Ganaste 100 puntos! ¡Subiste al nivel ${level + 1}!`;
        setFeedbackQueue(prev => [...prev, {
          type: 'success',
          message: successMessage,
          timestamp: new Date()
        }]);
        
        speak(successMessage);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        
        // Verificar logros después de completar desafío
        setTimeout(checkAchievements, 1000);
        
        // Mostrar reporte de actividad
        setTimeout(() => {
          const report = generateActivityReport();
          setActivityReport(report);
          setShowActivityReport(true);
        }, 2000);
      } else {
        const errorMessage = 'Para completar el desafío, primero debes descubrir un patrón y seleccionar al menos 5 números.';
        setFeedbackQueue(prev => [...prev, {
          type: 'error',
          message: errorMessage,
          timestamp: new Date()
        }]);
        
        playSound('error');
        speak(errorMessage);
      }
      setShowFeedback(true);
    } catch (error) {
      console.error('Error al completar desafío:', error);
      const errorMessage = 'Error al completar el desafío. Intenta de nuevo.';
      setFeedbackQueue(prev => [...prev, {
        type: 'error',
        message: errorMessage,
        timestamp: new Date()
      }]);
      
      playSound('error');
      speak(errorMessage);
      setShowFeedback(true);
    } finally {
      setCurrentAction(null);
    }
  };

  const handleRewardClaim = async (rewardId: string, rewardType: string) => {
    try {
      dispatch({
        type: 'CLAIM_REWARD',
        payload: { rewardId }
      });

      const successMessage = '¡Recompensa reclamada exitosamente!';
      setFeedbackQueue(prev => [...prev, {
        type: 'success',
        message: successMessage,
        timestamp: new Date()
      }]);
      
      playSound('success');
      speak(successMessage);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error al reclamar recompensa:', error);
      const errorMessage = 'Error al reclamar la recompensa. Intenta de nuevo.';
      setFeedbackQueue(prev => [...prev, {
        type: 'error',
        message: errorMessage,
        timestamp: new Date()
      }]);
      
      playSound('error');
      speak(errorMessage);
      setShowFeedback(true);
    }
  };

  // Función para leer pista con audio
  const readHint = () => {
    speak(currentHint);
  };

  if (loading) {
    return (
      <div className="discovery-path loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Cargando Aventura Numérica...</h2>
          <p>Preparando tu experiencia de aprendizaje</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discovery-path error-screen">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="discovery-path" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-modal">
            <div className="teacher-avatar">👩‍🏫</div>
            <h3>¡Bienvenido a la Aventura Numérica!</h3>
            <p>{tutorialSteps[tutorialStep].message}</p>
            
            {showNumberScale && (
              <div className="number-scale-demo">
                <div className="scale-container">
                  {scaleNumbers.map((num, index) => (
                    <div key={index} className="scale-number selected">
                      {num}
                    </div>
                  ))}
                </div>
                <p className="scale-label">Ejemplo: Patrón de 2 en 2</p>
              </div>
            )}
            
            <button onClick={handleTutorialNext} className="tutorial-button">
              {tutorialStep === tutorialSteps.length - 1 ? '¡Comenzar!' : 'Siguiente'}
            </button>
          </div>
        </div>
      )}

      {/* Teacher Message */}
      {showTeacher && (
        <div className="teacher-message">
          <div className="teacher-avatar">👩‍🏫</div>
          <p>{teacherMessage}</p>
        </div>
      )}

      {/* Celebration */}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <div className="celebration-avatar">🎉</div>
            <h3>¡Excelente Trabajo!</h3>
            <p>¡Has descubierto un patrón!</p>
          </div>
        </div>
      )}

      <header className="discovery-header">
        <div className="header-content">
          <div className="game-info">
            <div className="avatar-display">
              <span className="avatar">{avatar}</span>
              <span className="player-name">Explorador</span>
            </div>
            <div className="score-display">
              <span className="score-label">Puntos:</span>
              <span className="score-value">{score}</span>
            </div>
            <div className="level-display">
              <span className="level-label">Nivel:</span>
              <span className="level-value">{level}</span>
            </div>
          </div>
          
          <div className="header-actions">
            <button onClick={() => setShowChecklist(true)} className="header-button">
              📋 Logros
            </button>
            <button onClick={() => setShowRewards(true)} className="header-button">
              🏆 Recompensas
            </button>
            <button onClick={() => setShowFamilyMode(true)} className="header-button">
              👨‍👩‍👧‍👦 Familia
            </button>
          </div>
        </div>
      </header>

      <main className="discovery-main">
        <div className="discovery-content">
          <div className="welcome-section">
            <h2>🎯 ¡Bienvenido Explorador!</h2>
            <p>Descubre patrones numéricos y conviértete en un maestro de las matemáticas</p>
          </div>
          
          <div className="game-area">
            <div className="number-grid">
              <h3>🔍 Aventura Numérica</h3>
              <p>Selecciona números para analizar patrones</p>
              <div className="grid-container">
                {Array.from({ length: 21 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`number-card ${selectedNumbers.includes(i) ? 'selected' : ''}`}
                    onClick={() => handleNumberClick(i)}
                  >
                    {i}
                  </div>
                ))}
              </div>
              {selectedNumbers.length > 0 && (
                <p className="selected-numbers">
                  Números seleccionados: {selectedNumbers.sort((a, b) => a - b).join(', ')}
                </p>
              )}
            </div>
            
            <div className="controls">
              <button 
                onClick={handlePatternDiscovery}
                className="game-button"
                disabled={currentAction !== null || selectedNumbers.length < 3}
              >
                🔍 Descubrir Patrón
              </button>
              
              <button 
                onClick={handleHypothesisTest}
                className="game-button"
                disabled={currentAction !== null || selectedNumbers.length < 2}
              >
                🧪 Probar Hipótesis
              </button>
              
              <button 
                onClick={handleChallengeComplete}
                className="game-button success"
                disabled={currentAction !== null || !patternFound || selectedNumbers.length < 5}
              >
                ✅ Completar Desafío
              </button>
            </div>
            
            {currentPattern && (
              <div className="pattern-display">
                <h4>🎉 Patrón Descubierto:</h4>
                <p>{currentPattern}</p>
              </div>
            )}
          </div>
          
          {currentAction && (
            <div className="action-status">
              <div className="loading-spinner"></div>
              <p>Procesando acción: {currentAction}</p>
            </div>
          )}
        </div>
      </main>

      {/* Checklist de Logros */}
      {showChecklist && (
        <div className="checklist-overlay">
          <div className="checklist-modal">
            <h3>📋 Mis Logros y Desafíos</h3>
            <div className="checklist-content">
              <div className="checklist-stats">
                <div className="stat-item">
                  <span className="stat-number">{challenges.filter(c => c.completed).length}</span>
                  <span className="stat-label">Logros Completados</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{challenges.length}</span>
                  <span className="stat-label">Total de Desafíos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{score}</span>
                  <span className="stat-label">Puntos Totales</span>
                </div>
              </div>
              
              <div className="challenges-list">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className={`challenge-item ${challenge.completed ? 'completed' : ''}`}>
                    <div className="challenge-icon">
                      {challenge.completed ? '✅' : '⭕'}
                    </div>
                    <div className="challenge-info">
                      <h4>{challenge.title}</h4>
                      <p>{challenge.description}</p>
                      <span className="challenge-points">+{challenge.points} puntos</span>
                    </div>
                    <div className="challenge-status">
                      {challenge.completed ? 'Completado' : 'Pendiente'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowChecklist(false)} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Reporte de Actividad */}
      {showActivityReport && (
        <div className="activity-report-overlay">
          <div className="activity-report-modal">
            <h3>📊 Reporte de Actividad</h3>
            <div className="report-content">
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-number">{activityReport.totalScore}</span>
                  <span className="stat-label">Puntuación Total</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{activityReport.patternsFound}</span>
                  <span className="stat-label">Patrones Encontrados</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{activityReport.hypothesesTested}</span>
                  <span className="stat-label">Hipótesis Probadas</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{activityReport.challengesCompleted}</span>
                  <span className="stat-label">Desafíos Completados</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{activityReport.timeSpent}</span>
                  <span className="stat-label">Minutos Jugados</span>
                </div>
              </div>
              
              <div className="report-recommendations">
                <h4>💡 Recomendaciones para Padres:</h4>
                <ul>
                  {activityReport.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="report-message">
                <h4>🎉 ¡Felicitaciones!</h4>
                <p>Has completado exitosamente la actividad de patrones numéricos. 
                   Continúa practicando para mejorar tus habilidades matemáticas.</p>
              </div>
            </div>
            <button onClick={() => setShowActivityReport(false)} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showFeedback && feedbackQueue.length > 0 && (
        <div className="feedback-overlay">
          <div className="feedback-modal">
            <h3>💬 Feedback</h3>
            {feedbackQueue.map((feedback, index) => (
              <div key={index} className={`feedback-message ${feedback.type}`}>
                {feedback.message}
              </div>
            ))}
            <button onClick={() => setShowFeedback(false)} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showRewards && (
        <div className="rewards-overlay">
          <div className="rewards-modal">
            <h3>🏆 Recompensas</h3>
            <div className="rewards-list">
              {state.rewards.map((reward) => (
                <div key={reward.id} className="reward-item">
                  <span className="reward-icon">{reward.icon}</span>
                  <div className="reward-info">
                    <h4>{reward.title}</h4>
                    <p>{reward.description}</p>
                  </div>
                  <button 
                    onClick={() => handleRewardClaim(reward.id, reward.type)}
                    className="claim-button"
                    disabled={reward.claimed}
                  >
                    {reward.claimed ? 'Reclamado' : 'Reclamar'}
                  </button>
                </div>
              ))}
              {state.rewards.length === 0 && (
                <p>No hay recompensas disponibles aún. ¡Completa actividades para ganarlas!</p>
              )}
            </div>
            <button onClick={() => setShowRewards(false)} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showFamilyMode && (
        <div className="family-overlay">
          <div className="family-modal">
            <h3>👨‍👩‍👧‍👦 Modo Familia</h3>
            <div className="family-content">
              <p>¡Involucra a tu familia en el aprendizaje!</p>
              <div className="family-stats">
                <div className="stat">
                  <span className="stat-number">{state.familyActivities}</span>
                  <span className="stat-label">Actividades Familiares</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{state.totalActions}</span>
                  <span className="stat-label">Acciones Totales</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowFamilyMode(false)} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Checklist siempre visible - MINIMIZABLE Y MOVIBLE */}
      {!showTutorial && (
        <div 
          className={`always-visible-checklist ${checklistMinimized ? 'minimized' : ''}`}
          style={{
            position: 'fixed',
            left: `${checklistPosition.x}px`,
            top: `${checklistPosition.y}px`,
            zIndex: 1000
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="checklist-header">
            <h4>🎯 Mis Desafíos</h4>
            <div className="checklist-controls">
              <button 
                onClick={() => setChecklistMinimized(!checklistMinimized)}
                className="minimize-button"
                title={checklistMinimized ? 'Expandir' : 'Minimizar'}
              >
                {checklistMinimized ? '📖' : '📕'}
              </button>
            </div>
          </div>
          
          {!checklistMinimized && (
            <div className="challenges-list">
              {challenges.map((challenge) => (
                <div key={challenge.id} className={`challenge-item ${challenge.completed ? 'completed' : 'pending'}`}>
                  <div className="challenge-icon">
                    {challenge.completed ? '✅' : '⭕'}
                  </div>
                  <div className="challenge-info">
                    <div className="challenge-title">{challenge.title}</div>
                    <div className="challenge-description">{challenge.description}</div>
                  </div>
                  <div className={`challenge-status ${challenge.completed ? 'completed' : 'pending'}`}>
                    {challenge.completed ? '✓' : '○'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pista siempre visible con botón de audio y minimizar */}
      {!hintMinimized && (
        <div className="hint-overlay">
          <div className="hint-modal">
            <div className="hint-header">
              <h4>💡 Pista:</h4>
              <div className="hint-controls">
                <button 
                  onClick={readHint}
                  className="audio-button"
                  title="Leer pista en voz alta"
                >
                  🔊
                </button>
                <button 
                  onClick={() => setHintMinimized(true)}
                  className="minimize-hint-button"
                  title="Minimizar pista"
                >
                  📕
                </button>
              </div>
            </div>
            <p>{currentHint}</p>
          </div>
        </div>
      )}

      {/* Botón para mostrar pista cuando está minimizada */}
      {hintMinimized && (
        <div className="hint-minimized">
          <button 
            onClick={() => setHintMinimized(false)}
            className="show-hint-button"
            title="Mostrar pista"
          >
            💡
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoveryPath; 