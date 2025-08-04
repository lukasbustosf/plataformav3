import React, { useState, useEffect, useCallback } from 'react';
import './FarmCounter.css';

interface Animal {
  id: string;
  type: string;
  emoji: string;
  x: number;
  y: number;
  count: number;
  isCounted: boolean;
}

interface FarmAchievement {
  id: string;
  title: string;
  description: string;
  requirement: number;
  reward: string;
  unlocked: boolean;
}

interface ChildReport {
  totalAnimals: number;
  levelsCompleted: number;
  achievementsUnlocked: number;
  timeSpent: number;
  accuracy: number;
  nextChallenge: string;
}

interface ParentReport {
  skills: {
    counting: number;
    numberRecognition: number;
    patternRecognition: number;
    problemSolving: number;
  };
  recommendations: string[];
  activities: string[];
}

interface TeacherReport {
  studentInfo: {
    name: string;
    grade: string;
    oa: string;
  };
  academicProgress: {
    oaMastery: number;
    skillDevelopment: number;
    engagement: number;
  };
  recommendations: string[];
}

// Configuración mejorada de niveles con actividades específicas
const LEVEL_CONFIG = {
  pollitos: {
    title: "🐣 Pollitos Pequeños",
    description: "Cuenta los pollitos del 1 al 5",
    maxCount: 5,
    activities: [
      {
        id: "count_pollitos_1",
        instruction: "¡Cuenta cuántos pollitos hay!",
        type: "counting",
        scenario: ["🐣", "🐣", "🐣"],
        correctAnswer: 3,
        options: [2, 3, 4],
        feedback: "¡Correcto! Hay 3 pollitos. ¡Pío pío pío!"
      },
      {
        id: "number_line_pollitos",
        instruction: "El granjero camina por la granja. ¿En qué número está?",
        type: "number_line",
        scenario: [1, 2, 3, 4, 5],
        correctAnswer: 3,
        feedback: "¡Perfecto! El granjero está en el número 3."
      },
      {
        id: "drag_number_pollitos",
        instruction: "Arrastra el número correcto a cada grupo de pollitos",
        type: "drag_drop",
        scenarios: [
          { animals: ["🐣", "🐣"], correctNumber: 2 },
          { animals: ["🐣", "🐣", "🐣", "🐣"], correctNumber: 4 }
        ],
        feedback: "¡Excelente! Has asociado correctamente las cantidades."
      }
    ]
  },
  gallinas: {
    title: "🐔 Gallinas Medianas",
    description: "Cuenta las gallinas del 1 al 10",
    maxCount: 10,
    activities: [
      {
        id: "count_gallinas_1",
        instruction: "Cuenta las gallinas y toca el número correcto",
        type: "counting",
        scenario: ["🐔", "🐔", "🐔", "🐔", "🐔", "🐔"],
        correctAnswer: 6,
        options: [5, 6, 7],
        feedback: "¡Muy bien! Hay 6 gallinas en el corral."
      },
      {
        id: "drag_gallinas_1",
        instruction: "Cuenta cada grupo de gallinas y selecciona el número correcto",
        type: "drag_drop",
        scenarios: [
          { animals: ["🐔", "🐔", "🐔"], correctNumber: 3 },
          { animals: ["🐔", "🐔", "🐔", "🐔", "🐔"], correctNumber: 5 },
          { animals: ["🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐔"], correctNumber: 7 }
        ],
        feedback: "¡Excelente! Has asociado correctamente las cantidades de gallinas."
      },
      {
        id: "backward_counting_gallinas",
        instruction: "Las gallinas entran al corral. Cuenta hacia atrás: 6, 5, 4...",
        type: "backward_counting",
        startNumber: 6,
        endNumber: 1,
        feedback: "¡Increíble! Has contado hacia atrás correctamente."
      }
    ]
  },
  vacas: {
    title: "🐄 Vacas Grandes",
    description: "Cuenta las vacas del 1 al 20",
    maxCount: 20,
    activities: [
      {
        id: "count_vacas_1",
        instruction: "Cuenta las vacas en el establo",
        type: "counting",
        scenario: ["🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄"],
        correctAnswer: 10,
        options: [9, 10, 11],
        feedback: "¡Perfecto! Hay 10 vacas en el establo."
      },
      {
        id: "number_line_vacas",
        instruction: "El granjero cuenta las vacas. ¿Cuántas hay en el establo?",
        type: "number_line",
        scenario: [8, 9, 10, 11, 12],
        correctAnswer: 10,
        feedback: "¡Perfecto! El granjero contó 10 vacas."
      },
      {
        id: "drag_vacas_1",
        instruction: "Arrastra el número correcto a cada grupo de vacas",
        type: "drag_drop",
        scenarios: [
          { animals: ["🐄", "🐄", "🐄", "🐄"], correctNumber: 4 },
          { animals: ["🐄", "🐄", "🐄", "🐄", "🐄", "🐄"], correctNumber: 6 },
          { animals: ["🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄"], correctNumber: 8 }
        ],
        feedback: "¡Excelente! Has asociado correctamente las cantidades de vacas."
      },
      {
        id: "skip_counting_vacas",
        instruction: "Las vacas se agrupan de a 2. Cuenta: 2, 4, 6, 8, 10",
        type: "skip_counting",
        pattern: 2,
        sequence: [2, 4, 6, 8, 10],
        feedback: "¡Excelente! Has dominado el conteo de 2 en 2."
      }
    ]
  },
  granjero: {
    title: "🚜 Granjero Experto",
    description: "Patrones de conteo especiales",
    maxCount: 50,
    activities: [
      {
        id: "skip_counting_5",
        instruction: "Los huevos se guardan de a 5. Cuenta: 5, 10, 15...",
        type: "skip_counting",
        pattern: 5,
        sequence: [5, 10, 15, 20, 25],
        feedback: "¡Fantástico! Has dominado el conteo de 5 en 5."
      },
      {
        id: "mixed_patterns",
        instruction: "Completa la secuencia: 2, 4, ?, 8, 10",
        type: "pattern_completion",
        sequence: [2, 4, 6, 8, 10],
        missingPosition: 2,
        feedback: "¡Perfecto! Has completado el patrón correctamente."
      }
    ]
  }
};

const welcomeSteps = [
  {
    title: "🐄 ¡Bienvenido a la Granja!",
    message: "Hola pequeño granjero. Soy el Granjero Pedro y necesito tu ayuda para contar todos los animales de la granja.",
    icon: "🐄",
    action: "next"
  },
  {
    title: "🔢 Aprenderemos a Contar",
    message: "Vamos a contar pollitos, gallinas, vacas y aprender patrones especiales. ¡Será muy divertido!",
    icon: "🔢",
    action: "next"
  },
  {
    title: "🎯 Tu Misión",
    message: "Completa cada nivel contando correctamente. Gana medallas y desbloquea nuevas herramientas de granjero.",
    icon: "🎯",
    action: "start"
  }
];

const FarmCounter: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<'pollitos' | 'gallinas' | 'vacas' | 'granjero'>('pollitos');
  const [currentActivity, setCurrentActivity] = useState(0);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [achievements, setAchievements] = useState<FarmAchievement[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [sessionData, setSessionData] = useState({
    totalAnimals: 0,
    levelsCompleted: 0,
    achievementsUnlocked: 0,
    timeSpent: 0,
    accuracy: 0
  });
  const [activeReport, setActiveReport] = useState<'child' | 'parent' | 'teacher'>('child');
  const [currentActivityType, setCurrentActivityType] = useState<string>('counting');
  const [numberLinePosition, setNumberLinePosition] = useState<number>(0);
  const [dragDropProgress, setDragDropProgress] = useState<number>(0);
  const [backwardCountProgress, setBackwardCountProgress] = useState<number>(0);
  const [skipCountProgress, setSkipCountProgress] = useState<number>(0);
  const [patternCompletionAnswer, setPatternCompletionAnswer] = useState<number | null>(null);

  // Función para hablar
  const speak = useCallback((text: string) => {
    if (speechEnabled && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [speechEnabled]);

  // Función para reproducir sonidos de animales
  const playAnimalSound = useCallback((animalType: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const sounds = {
      pollito: { frequency: 800, duration: 0.3 },
      gallina: { frequency: 400, duration: 0.5 },
      vaca: { frequency: 200, duration: 0.8 },
      granjero: { frequency: 600, duration: 0.4 }
    };

    const sound = sounds[animalType as keyof typeof sounds] || sounds.pollito;
    oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + sound.duration);
  }, []);

  // Función para reproducir feedback de conteo
  const playCountFeedback = useCallback((isCorrect: boolean) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (isCorrect) {
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
    } else {
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    }

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  const handleWelcomeNext = useCallback(() => {
    if (welcomeStep < welcomeSteps.length - 1) {
      setWelcomeStep(welcomeStep + 1);
      speak(welcomeSteps[welcomeStep + 1].message);
    } else {
      setShowWelcome(false);
      speak("¡Perfecto! Ahora puedes empezar a contar animales. ¡Buena suerte, pequeño granjero!");
    }
  }, [welcomeStep, speak]);

  const handleWelcomeSkip = useCallback(() => {
    setShowWelcome(false);
    speak("¡Perfecto! Ahora puedes empezar a contar animales. ¡Buena suerte, pequeño granjero!");
  }, [speak]);

  // Función para verificar logros
  const checkAchievements = useCallback((count: number) => {
    const newAchievements: FarmAchievement[] = [];
    
    if (count >= 1 && !achievements.find(a => a.id === 'primer_animal')) {
      newAchievements.push({
        id: 'primer_animal',
        title: '🐣 Primer Animal',
        description: 'Contaste tu primer animal',
        requirement: 1,
        reward: 'Medalla de Principiante',
        unlocked: true
      });
    }
    
    if (count >= 5 && !achievements.find(a => a.id === 'contador_basico')) {
      newAchievements.push({
        id: 'contador_basico',
        title: '🔢 Contador Básico',
        description: 'Contaste hasta 5 animales',
        requirement: 5,
        reward: 'Cinta de Contador',
        unlocked: true
      });
    }
    
    if (count >= 10 && !achievements.find(a => a.id === 'contador_avanzado')) {
      newAchievements.push({
        id: 'contador_avanzado',
        title: '🏆 Contador Avanzado',
        description: 'Contaste hasta 10 animales',
        requirement: 10,
        reward: 'Trofeo de Conteo',
        unlocked: true
      });
    }
    
    if (count >= 20 && !achievements.find(a => a.id === 'maestro_contador')) {
      newAchievements.push({
        id: 'maestro_contador',
        title: '👑 Maestro Contador',
        description: 'Contaste hasta 20 animales',
        requirement: 20,
        reward: 'Corona de Maestro',
        unlocked: true
      });
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      speak(`¡Logro desbloqueado! ${newAchievements[0].title}`);
    }
  }, [achievements, speak]);

  // Función para generar animales según el nivel
  const generateAnimals = useCallback(() => {
    const levelConfig = LEVEL_CONFIG[currentLevel];
    const currentActivityConfig = levelConfig.activities[currentActivity];
    
    // Solo generar animales para actividades de conteo normal
    if (currentActivityConfig.type === 'counting' && 'correctAnswer' in currentActivityConfig) {
      const animalCount = currentActivityConfig.correctAnswer;
      const newAnimals: Animal[] = [];
      
      // Verificar que animalCount sea un número válido
      if (typeof animalCount === 'number' && animalCount > 0) {
        for (let i = 0; i < animalCount; i++) {
          newAnimals.push({
            id: `animal-${i}`,
            type: currentLevel,
            emoji: currentLevel === 'pollitos' ? '🐣' : 
                   currentLevel === 'gallinas' ? '🐔' : 
                   currentLevel === 'vacas' ? '🐄' : '🚜',
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20,
            count: i + 1,
            isCounted: false
          });
        }
        
        setAnimals(newAnimals);
      } else {
        setAnimals([]);
      }
    } else {
      // Para actividades especiales
      setAnimals([]);
    }
  }, [currentLevel, currentActivity]);

  // Función para manejar clic en animal
  const handleAnimalClick = useCallback((animal: Animal) => {
    if (animal.isCounted) return;
    
    playAnimalSound(animal.type);
    playCountFeedback(true);
    
    const updatedAnimals = animals.map(a => 
      a.id === animal.id ? { ...a, isCounted: true } : a
    );
    setAnimals(updatedAnimals);
    
    const countedAnimals = updatedAnimals.filter(a => a.isCounted).length;
    const totalAnimals = updatedAnimals.length;
    
    if (countedAnimals === totalAnimals) {
      const levelConfig = LEVEL_CONFIG[currentLevel];
      const currentActivityConfig = levelConfig.activities[currentActivity];
      
      // Verificar respuesta correcta solo para actividades de conteo normal
      const isCorrect = 'correctAnswer' in currentActivityConfig ? 
        countedAnimals === currentActivityConfig.correctAnswer : false;
      
      if (isCorrect) {
        setTotalScore(prev => prev + 100);
        setSessionData(prev => ({
          ...prev,
          totalAnimals: prev.totalAnimals + totalAnimals,
          accuracy: ((prev.accuracy * prev.levelsCompleted + 100) / (prev.levelsCompleted + 1))
        }));
        
        speak(`¡Excelente! Has contado correctamente ${countedAnimals} ${currentLevel}.`);
        
        // Avanzar a siguiente actividad o nivel
        if (currentActivity < levelConfig.activities.length - 1) {
          setCurrentActivity(currentActivity + 1);
        } else {
          // Completar nivel
          setSessionData(prev => ({
            ...prev,
            levelsCompleted: prev.levelsCompleted + 1
          }));
          
          // Avanzar al siguiente nivel
          const levels = ['pollitos', 'gallinas', 'vacas', 'granjero'];
          const currentIndex = levels.indexOf(currentLevel);
          
          if (currentIndex < levels.length - 1) {
            setCurrentLevel(levels[currentIndex + 1] as any);
            setCurrentActivity(0);
            speak(`¡Felicidades! Has completado el nivel ${currentLevel}. Ahora vamos al siguiente nivel.`);
          } else {
            // Completar toda la experiencia
            setShowReport(true);
            speak("¡Felicidades! Has completado toda la granja. ¡Eres un granjero experto!");
          }
        }
      } else {
        speak(`Mmm, creo que hay más animales. ¿Quieres intentar contar otra vez?`);
      }
    }
    
    checkAchievements(countedAnimals);
  }, [animals, currentLevel, currentActivity, playAnimalSound, playCountFeedback, checkAchievements, speak]);

  // Función para manejar actividades interactivas
  const handleInteractiveActivity = useCallback((activityType: string, value: any) => {
    const levelConfig = LEVEL_CONFIG[currentLevel];
    const currentActivityConfig = levelConfig.activities[currentActivity];
    let isCorrect = false;
    
    switch (activityType) {
      case 'number_line':
        if ('correctAnswer' in currentActivityConfig && typeof currentActivityConfig.correctAnswer === 'number') {
          const correctPosition = currentActivityConfig.correctAnswer;
          isCorrect = value === correctPosition;
          if (isCorrect) {
            speak("¡Perfecto! Has encontrado la posición correcta.");
            // Avanzar actividad
            if (currentActivity < levelConfig.activities.length - 1) {
              setCurrentActivity(currentActivity + 1);
            } else {
              // Completar nivel
              setSessionData(prev => ({
                ...prev,
                levelsCompleted: prev.levelsCompleted + 1
              }));
              
              const levels = ['pollitos', 'gallinas', 'vacas', 'granjero'];
              const currentIndex = levels.indexOf(currentLevel);
              
              if (currentIndex < levels.length - 1) {
                setCurrentLevel(levels[currentIndex + 1] as any);
                setCurrentActivity(0);
                speak(`¡Felicidades! Has completado el nivel ${currentLevel}.`);
              } else {
                setShowReport(true);
                speak("¡Felicidades! Has completado toda la granja.");
              }
            }
          } else {
            speak("Intenta de nuevo. Busca el número correcto.");
          }
        }
        break;
        
      case 'drag_drop':
        if ('scenarios' in currentActivityConfig && currentActivityConfig.scenarios) {
          const currentScenario = currentActivityConfig.scenarios[dragDropProgress];
          isCorrect = value === currentScenario.correctNumber;
          if (isCorrect) {
            setDragDropProgress(prev => prev + 1);
            speak("¡Correcto! Ahora arrastra el siguiente número.");
            
            // Verificar si completó todas las actividades de arrastrar
            if (dragDropProgress + 1 >= currentActivityConfig.scenarios.length) {
              speak("¡Excelente! Has completado todas las asociaciones.");
              // Avanzar actividad
              if (currentActivity < levelConfig.activities.length - 1) {
                setCurrentActivity(currentActivity + 1);
                setDragDropProgress(0);
              } else {
                // Completar nivel
                setSessionData(prev => ({
                  ...prev,
                  levelsCompleted: prev.levelsCompleted + 1
                }));
                
                const levels = ['pollitos', 'gallinas', 'vacas', 'granjero'];
                const currentIndex = levels.indexOf(currentLevel);
                
                if (currentIndex < levels.length - 1) {
                  setCurrentLevel(levels[currentIndex + 1] as any);
                  setCurrentActivity(0);
                  setDragDropProgress(0);
                  speak(`¡Felicidades! Has completado el nivel ${currentLevel}.`);
                } else {
                  setShowReport(true);
                  speak("¡Felicidades! Has completado toda la granja.");
                }
              }
            }
          } else {
            speak("Ese número no es correcto. Intenta de nuevo.");
          }
        }
        break;
        
      case 'backward_counting':
        const expectedNumber = 6 - backwardCountProgress;
        isCorrect = value === expectedNumber;
        if (isCorrect) {
          setBackwardCountProgress(prev => prev + 1);
          speak(`¡Correcto! ${value}. Ahora cuenta el siguiente.`);
          
          // Verificar si completó el conteo hacia atrás
          if (backwardCountProgress + 1 >= 6) {
            speak("¡Excelente! Has contado hacia atrás correctamente.");
            // Avanzar actividad
            if (currentActivity < levelConfig.activities.length - 1) {
              setCurrentActivity(currentActivity + 1);
              setBackwardCountProgress(0);
            } else {
              // Completar nivel
              setSessionData(prev => ({
                ...prev,
                levelsCompleted: prev.levelsCompleted + 1
              }));
              
              const levels = ['pollitos', 'gallinas', 'vacas', 'granjero'];
              const currentIndex = levels.indexOf(currentLevel);
              
              if (currentIndex < levels.length - 1) {
                setCurrentLevel(levels[currentIndex + 1] as any);
                setCurrentActivity(0);
                setBackwardCountProgress(0);
                speak(`¡Felicidades! Has completado el nivel ${currentLevel}.`);
              } else {
                setShowReport(true);
                speak("¡Felicidades! Has completado toda la granja.");
              }
            }
          }
        } else {
          speak("Ese número no es correcto. Cuenta hacia atrás: 6, 5, 4...");
        }
        break;
        
      case 'skip_counting':
        if ('sequence' in currentActivityConfig && currentActivityConfig.sequence) {
          const currentSequence = currentActivityConfig.sequence;
          const expectedNext = currentSequence[skipCountProgress];
          isCorrect = value === expectedNext;
          if (isCorrect) {
            setSkipCountProgress(prev => prev + 1);
            speak(`¡Correcto! ${value}. Continúa la secuencia.`);
            
            // Verificar si completó la secuencia
            if (skipCountProgress + 1 >= currentSequence.length) {
              speak("¡Excelente! Has completado la secuencia correctamente.");
              // Avanzar actividad
              if (currentActivity < levelConfig.activities.length - 1) {
                setCurrentActivity(currentActivity + 1);
                setSkipCountProgress(0);
              } else {
                // Completar nivel
                setSessionData(prev => ({
                  ...prev,
                  levelsCompleted: prev.levelsCompleted + 1
                }));
                
                const levels = ['pollitos', 'gallinas', 'vacas', 'granjero'];
                const currentIndex = levels.indexOf(currentLevel);
                
                if (currentIndex < levels.length - 1) {
                  setCurrentLevel(levels[currentIndex + 1] as any);
                  setCurrentActivity(0);
                  setSkipCountProgress(0);
                  speak(`¡Felicidades! Has completado el nivel ${currentLevel}.`);
                } else {
                  setShowReport(true);
                  speak("¡Felicidades! Has completado toda la granja.");
                }
              }
            }
          } else {
            speak("Ese número no es correcto. Sigue el patrón de la secuencia.");
          }
        }
        break;
        
      case 'pattern_completion':
        if ('sequence' in currentActivityConfig && 'missingPosition' in currentActivityConfig && 
            currentActivityConfig.sequence && typeof currentActivityConfig.missingPosition === 'number') {
          const correctAnswer = currentActivityConfig.sequence[currentActivityConfig.missingPosition];
          isCorrect = value === correctAnswer;
          if (isCorrect) {
            speak("¡Correcto! Has completado el patrón.");
            // Avanzar actividad
            if (currentActivity < levelConfig.activities.length - 1) {
              setCurrentActivity(currentActivity + 1);
              setPatternCompletionAnswer(null);
            } else {
              // Completar nivel
              setSessionData(prev => ({
                ...prev,
                levelsCompleted: prev.levelsCompleted + 1
              }));
              
              const levels = ['pollitos', 'gallinas', 'vacas', 'granjero'];
              const currentIndex = levels.indexOf(currentLevel);
              
              if (currentIndex < levels.length - 1) {
                setCurrentLevel(levels[currentIndex + 1] as any);
                setCurrentActivity(0);
                setPatternCompletionAnswer(null);
                speak(`¡Felicidades! Has completado el nivel ${currentLevel}.`);
              } else {
                setShowReport(true);
                speak("¡Felicidades! Has completado toda la granja.");
              }
            }
          } else {
            speak("Intenta de nuevo. Piensa en el patrón de la secuencia.");
          }
        }
        break;
    }
    
    if (isCorrect) {
      setTotalScore(prev => prev + 50);
      playCountFeedback(true);
    } else {
      playCountFeedback(false);
    }
  }, [currentLevel, currentActivity, dragDropProgress, backwardCountProgress, skipCountProgress, speak, playCountFeedback]);

  // Función para generar pistas
  const generateFarmHint = useCallback(() => {
    const levelConfig = LEVEL_CONFIG[currentLevel];
    const currentActivityConfig = levelConfig.activities[currentActivity];
    
    return `Cuenta cada ${currentLevel === 'pollitos' ? 'pollito' : 
                        currentLevel === 'gallinas' ? 'gallina' : 
                        currentLevel === 'vacas' ? 'vaca' : 'granjero'} uno por uno.`;
  }, [currentLevel, currentActivity]);

  // Funciones para reportes
  const generateChildReport = useCallback((): ChildReport => {
    return {
      totalAnimals: sessionData.totalAnimals,
      levelsCompleted: sessionData.levelsCompleted,
      achievementsUnlocked: achievements.filter(a => a.unlocked).length,
      timeSpent: sessionData.timeSpent,
      accuracy: sessionData.accuracy,
      nextChallenge: "¡Prueba el siguiente nivel para más desafíos!"
    };
  }, [sessionData, achievements]);

  const generateParentReport = useCallback((): ParentReport => {
    return {
      skills: {
        counting: Math.min(100, sessionData.accuracy),
        numberRecognition: Math.min(100, achievements.filter(a => a.unlocked).length * 25),
        patternRecognition: Math.min(100, sessionData.levelsCompleted * 25),
        problemSolving: Math.min(100, totalScore / 10)
      },
      recommendations: [
        "Practica conteo en casa con objetos cotidianos",
        "Juega juegos de números en familia",
        "Celebra los logros matemáticos"
      ],
      activities: [
        "Contar juguetes juntos",
        "Jugar con números en la cocina",
        "Crear historias con números"
      ]
    };
  }, [sessionData, achievements, totalScore]);

  const generateTeacherReport = useCallback((): TeacherReport => {
    return {
      studentInfo: {
        name: "Estudiante",
        grade: "1° Básico",
        oa: "MA01OA01 - Conteo 0-100"
      },
      academicProgress: {
        oaMastery: sessionData.accuracy,
        skillDevelopment: achievements.filter(a => a.unlocked).length * 20,
        engagement: Math.min(100, sessionData.timeSpent / 10)
      },
      recommendations: [
        "Reforzar conteo de 2 en 2 y 5 en 5",
        "Practicar conteo hacia atrás",
        "Desarrollar reconocimiento de patrones"
      ]
    };
  }, [sessionData, achievements]);

  // Efectos
  useEffect(() => {
    if (!showWelcome) {
      speak("¡Bienvenido a la Granja Contador! Vamos a aprender a contar animales.");
    }
  }, [showWelcome, speak]);

  useEffect(() => {
    generateAnimals();
    const levelConfig = LEVEL_CONFIG[currentLevel];
    const currentActivityConfig = levelConfig.activities[currentActivity];
    setCurrentActivityType(currentActivityConfig.type);
    
    // Resetear estados de actividades interactivas
    setNumberLinePosition(0);
    setDragDropProgress(0);
    setBackwardCountProgress(0);
    setSkipCountProgress(0);
    setPatternCompletionAnswer(null);
  }, [currentLevel, currentActivity, generateAnimals]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionData(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Renderizado del overlay de bienvenida
  if (showWelcome) {
    return (
      <div className="welcome-overlay">
        <div className="welcome-card">
          <div className="welcome-header">
            <h1>{welcomeSteps[welcomeStep].title}</h1>
            <div className="welcome-icon">{welcomeSteps[welcomeStep].icon}</div>
          </div>
          <p className="welcome-message">{welcomeSteps[welcomeStep].message}</p>
          <div className="welcome-actions">
            <button onClick={handleWelcomeNext} className="welcome-btn primary">
              {welcomeSteps[welcomeStep].action === 'next' ? 'Siguiente' : '¡Comenzar!'}
            </button>
            <button onClick={handleWelcomeSkip} className="welcome-btn secondary">
              Saltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado del reporte
  if (showReport) {
    const childReport = generateChildReport();
    const parentReport = generateParentReport();
    const teacherReport = generateTeacherReport();

    return (
      <div className="report-overlay">
        <div className="report-container">
          <div className="report-header">
            <h1>🏆 ¡Experiencia Completada!</h1>
            <p>Puntuación Total: {totalScore} puntos</p>
          </div>
          
          <div className="report-tabs">
            <button 
              className={`report-tab ${activeReport === 'child' ? 'active' : ''}`}
              onClick={() => setActiveReport('child')}
            >
              👶 Para Niños
            </button>
            <button 
              className={`report-tab ${activeReport === 'parent' ? 'active' : ''}`}
              onClick={() => setActiveReport('parent')}
            >
              👨‍👩‍👧‍👦 Para Padres
            </button>
            <button 
              className={`report-tab ${activeReport === 'teacher' ? 'active' : ''}`}
              onClick={() => setActiveReport('teacher')}
            >
              👩‍🏫 Para Profesores
            </button>
          </div>
          
          <div className="report-content">
            {activeReport === 'child' && (
              <div className="child-report">
                <h2>🎉 ¡Felicidades!</h2>
                <div className="report-stats">
                  <div className="stat">
                    <span className="stat-label">Animales Contados:</span>
                    <span className="stat-value">{childReport.totalAnimals}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Niveles Completados:</span>
                    <span className="stat-value">{childReport.levelsCompleted}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Logros Desbloqueados:</span>
                    <span className="stat-value">{childReport.achievementsUnlocked}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Tiempo Jugado:</span>
                    <span className="stat-value">{Math.floor(childReport.timeSpent / 60)}m {childReport.timeSpent % 60}s</span>
                  </div>
                </div>
                <div className="next-challenge">
                  <h3>🎯 Próximo Desafío</h3>
                  <p>{childReport.nextChallenge}</p>
                </div>
              </div>
            )}
            
            {activeReport === 'parent' && (
              <div className="parent-report">
                <h2>📊 Progreso de tu Hijo</h2>
                <div className="skills-section">
                  <h3>Habilidades Desarrolladas</h3>
                  <div className="skill-bars">
                    <div className="skill-bar">
                      <span>Conteo</span>
                      <div className="bar">
                        <div className="fill" style={{width: `${parentReport.skills.counting}%`}}></div>
                      </div>
                      <span>{Math.round(parentReport.skills.counting)}%</span>
                    </div>
                    <div className="skill-bar">
                      <span>Reconocimiento de Números</span>
                      <div className="bar">
                        <div className="fill" style={{width: `${parentReport.skills.numberRecognition}%`}}></div>
                      </div>
                      <span>{Math.round(parentReport.skills.numberRecognition)}%</span>
                    </div>
                    <div className="skill-bar">
                      <span>Reconocimiento de Patrones</span>
                      <div className="bar">
                        <div className="fill" style={{width: `${parentReport.skills.patternRecognition}%`}}></div>
                      </div>
                      <span>{Math.round(parentReport.skills.patternRecognition)}%</span>
                    </div>
                    <div className="skill-bar">
                      <span>Resolución de Problemas</span>
                      <div className="bar">
                        <div className="fill" style={{width: `${parentReport.skills.problemSolving}%`}}></div>
                      </div>
                      <span>{Math.round(parentReport.skills.problemSolving)}%</span>
                    </div>
                  </div>
                </div>
                <div className="recommendations">
                  <h3>💡 Recomendaciones</h3>
                  <ul>
                    {parentReport.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
                <div className="activities">
                  <h3>🎮 Actividades Sugeridas</h3>
                  <ul>
                    {parentReport.activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeReport === 'teacher' && (
              <div className="teacher-report">
                <div className="student-info">
                  <h2>👤 Información del Estudiante</h2>
                  <p><strong>Nombre:</strong> {teacherReport.studentInfo.name}</p>
                  <p><strong>Nivel:</strong> {teacherReport.studentInfo.grade}</p>
                  <p><strong>OA:</strong> {teacherReport.studentInfo.oa}</p>
                </div>
                
                <div className="academic-progress">
                  <h3>📈 Progreso Académico</h3>
                  <div className="progress-metrics">
                    <div className="metric">
                      <span>Dominio del OA:</span>
                      <span>{Math.round(teacherReport.academicProgress.oaMastery)}%</span>
                    </div>
                    <div className="metric">
                      <span>Desarrollo de Habilidades:</span>
                      <span>{Math.round(teacherReport.academicProgress.skillDevelopment)}%</span>
                    </div>
                    <div className="metric">
                      <span>Engagement:</span>
                      <span>{Math.round(teacherReport.academicProgress.engagement)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="rec-section">
                  <h3>📋 Recomendaciones Pedagógicas</h3>
                  <ul>
                    {teacherReport.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <div className="report-actions">
            <button onClick={() => setShowReport(false)} className="report-btn">
              Volver al Juego
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado principal del juego
  return (
    <div className="farm-counter">
      <div className="farm-header">
        <h1>🐄 Granja Contador</h1>
        <div className="score-info">
          <span>Puntuación: {totalScore}</span>
          <span>Tiempo: {Math.floor(sessionData.timeSpent / 60)}:{String(sessionData.timeSpent % 60).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="farm-main">
        <div className="levels-panel">
          <h3>🌾 Niveles</h3>
          <div className="level-buttons">
            {Object.entries(LEVEL_CONFIG).map(([levelKey, levelConfig]) => (
              <button
                key={levelKey}
                className={`level-btn ${currentLevel === levelKey ? 'active' : ''}`}
                onClick={() => {
                  setCurrentLevel(levelKey as any);
                  setCurrentActivity(0);
                }}
              >
                {levelConfig.title}
              </button>
            ))}
          </div>
        </div>

        <div className="game-area">
          <div className="activity-info">
            <h2>{LEVEL_CONFIG[currentLevel].title}</h2>
            <p>{LEVEL_CONFIG[currentLevel].description}</p>
            <div className="current-activity">
              <h3>Actividad {currentActivity + 1}</h3>
              <p>{LEVEL_CONFIG[currentLevel].activities[currentActivity].instruction}</p>
            </div>
          </div>

          <div className="animals-container">
            {currentActivityType === 'counting' && animals.map((animal) => (
              <div
                key={animal.id}
                className={`animal ${animal.isCounted ? 'counted' : ''}`}
                style={{
                  left: `${animal.x}%`,
                  top: `${animal.y}%`
                }}
                onClick={() => handleAnimalClick(animal)}
              >
                <span className="animal-emoji">{animal.emoji}</span>
                {animal.isCounted && <span className="count-number">{animal.count}</span>}
              </div>
            ))}
            
            {currentActivityType === 'number_line' && (
              <div className="number-line-container">
                <div className="number-line">
                  {'scenario' in LEVEL_CONFIG[currentLevel].activities[currentActivity] && 
                   LEVEL_CONFIG[currentLevel].activities[currentActivity].scenario ? 
                   LEVEL_CONFIG[currentLevel].activities[currentActivity].scenario.map((num: any) => (
                    <div
                      key={num}
                      className={`number-box ${numberLinePosition === num ? 'active' : ''}`}
                      onClick={() => handleInteractiveActivity('number_line', num)}
                    >
                      {num}
                    </div>
                  )) : null}
                </div>
                <div className="farmer-character">🚶‍♂️</div>
              </div>
            )}
            
            {currentActivityType === 'drag_drop' && (
              <div className="drag-drop-container">
                <div className="animal-groups">
                  {'scenarios' in LEVEL_CONFIG[currentLevel].activities[currentActivity] && 
                   LEVEL_CONFIG[currentLevel].activities[currentActivity].scenarios ? 
                   LEVEL_CONFIG[currentLevel].activities[currentActivity].scenarios.map((scenario: any, index: number) => (
                    <div key={index} className="animal-group">
                      <div className="animals-display">
                        {scenario.animals.map((animal: string, i: number) => (
                          <span key={i} className="animal-emoji-small">{animal}</span>
                        ))}
                      </div>
                      <div className="number-drop-zone">
                        {dragDropProgress === index ? '✓' : '?'}
                      </div>
                    </div>
                  )) : null}
                </div>
                <div className="number-options">
                  {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <div
                      key={num}
                      className="number-option"
                      onClick={() => handleInteractiveActivity('drag_drop', num)}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {currentActivityType === 'backward_counting' && (
              <div className="backward-counting-container">
                <div className="counting-display">
                  {[6, 5, 4, 3, 2, 1].map((num, index) => (
                    <div
                      key={num}
                      className={`count-number-display ${backwardCountProgress >= index ? 'counted' : ''}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <button 
                  className="count-button"
                  onClick={() => handleInteractiveActivity('backward_counting', 6 - backwardCountProgress)}
                >
                  Contar
                </button>
              </div>
            )}
            
            {currentActivityType === 'skip_counting' && (
              <div className="skip-counting-container">
                <div className="sequence-display">
                  {'sequence' in LEVEL_CONFIG[currentLevel].activities[currentActivity] && 
                   LEVEL_CONFIG[currentLevel].activities[currentActivity].sequence ? 
                   LEVEL_CONFIG[currentLevel].activities[currentActivity].sequence.map((num: number, index: number) => (
                    <div
                      key={index}
                      className={`sequence-number ${skipCountProgress >= index ? 'active' : ''}`}
                    >
                      {num}
                    </div>
                  )) : null}
                </div>
                <button 
                  className="count-button"
                  onClick={() => {
                    if ('sequence' in LEVEL_CONFIG[currentLevel].activities[currentActivity] && 
                        LEVEL_CONFIG[currentLevel].activities[currentActivity].sequence) {
                      handleInteractiveActivity('skip_counting', LEVEL_CONFIG[currentLevel].activities[currentActivity].sequence[skipCountProgress]);
                    }
                  }}
                >
                  Siguiente
                </button>
              </div>
            )}
            
            {currentActivityType === 'pattern_completion' && (
              <div className="pattern-completion-container">
                <div className="pattern-display">
                  {'sequence' in LEVEL_CONFIG[currentLevel].activities[currentActivity] && 
                   LEVEL_CONFIG[currentLevel].activities[currentActivity].sequence ? 
                   LEVEL_CONFIG[currentLevel].activities[currentActivity].sequence.map((num: number, index: number) => (
                    <div key={index} className="pattern-number">
                      {index === ('missingPosition' in LEVEL_CONFIG[currentLevel].activities[currentActivity] ? 
                                 LEVEL_CONFIG[currentLevel].activities[currentActivity].missingPosition : -1) ? (
                        <input
                          type="number"
                          className="pattern-input"
                          value={patternCompletionAnswer || ''}
                          onChange={(e) => setPatternCompletionAnswer(Number(e.target.value))}
                          placeholder="?"
                        />
                      ) : (
                        num
                      )}
                    </div>
                  )) : null}
                </div>
                <button 
                  className="check-button"
                  onClick={() => handleInteractiveActivity('pattern_completion', patternCompletionAnswer)}
                >
                  Verificar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="tools-panel">
          <h3>🛠️ Herramientas</h3>
          <div className="tool-buttons">
            <button 
              className="tool-btn"
              onClick={() => setSpeechEnabled(!speechEnabled)}
            >
              {speechEnabled ? '🔊' : '🔇'} Voz
            </button>
            <button 
              className="tool-btn"
              onClick={() => setShowHints(!showHints)}
            >
              💡 Pistas
            </button>
            <button 
              className="tool-btn"
              onClick={() => setShowAchievements(!showAchievements)}
            >
              🏆 Logros
            </button>
          </div>

          {showHints && (
            <div className="hints-container">
              <h4>💡 Pista</h4>
              <div className="hint-content">
                {generateFarmHint()}
              </div>
            </div>
          )}

          {showAchievements && (
            <div className="achievements-container">
              <h4>🏆 Logros</h4>
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`achievement-item ${achievement.unlocked ? 'unlocked' : ''}`}>
                  <span className="achievement-icon">{achievement.title.split(' ')[0]}</span>
                  <div className="achievement-info">
                    <h5>{achievement.title}</h5>
                    <p>{achievement.description}</p>
                    {achievement.unlocked && <span className="reward">🎁 {achievement.reward}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmCounter;