import React, { useState, useEffect, useCallback } from 'react';
import './MagicGarden.css';

interface Seed {
  id: string;
  name: string;
  icon: string;
  color: string;
  growthTime: number;
  petals: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockLevel: number;
}

interface Flower {
  id: string;
  seedId: string;
  plantedAt: Date;
  wateredAt?: Date;
  growthStage: "seed" | "sprout" | "bud" | "flower";
  petals: number;
  position: { x: number; y: number };
  isWatered: boolean;
  isCounted: boolean;
}

interface GardenAchievement {
  id: string;
  title: string;
  description: string;
  requirement: number;
  reward: string;
  unlocked: boolean;
  icon: string;
}

interface ChildGardenReport {
  totalFlowers: number;
  gardenLevel: number;
  achievementsUnlocked: number;
  timeSpent: number;
  accuracy: number;
  nextChallenge: string;
  gardenTheme: string;
}

interface ParentGardenReport {
  skills: {
    counting: number;
    patternRecognition: number;
    fineMotor: number;
    creativity: number;
  };
  recommendations: string[];
  activities: string[];
  gardenProgress: {
    flowersPlanted: number;
    patternsCreated: number;
    timeSpent: number;
  };
}

interface TeacherGardenReport {
  studentInfo: {
    name: string;
    grade: string;
    oa: string;
    gardenTheme: string;
  };
  academicProgress: {
    oaMastery: number;
    skillDevelopment: number;
    engagement: number;
    creativity: number;
  };
  recommendations: string[];
  gardenMetrics: {
    totalFlowers: number;
    patternsCreated: number;
    countingAccuracy: number;
    timeEngagement: number;
  };
}

// Configuración de semillas mejorada con variedad visual
const SEED_TYPES = {
  basic_rose: {
    id: "basic_rose",
    name: "Rosa Básica",
    icon: "🌹",
    color: "#F44336",
    growthTime: 3000,
    petals: 5,
    rarity: "common" as const,
    unlockLevel: 1
  },
  counting_daisy: {
    id: "counting_daisy",
    name: "Margarita Contadora",
    icon: "🌼",
    color: "#FFEB3B",
    growthTime: 4000,
    petals: 8,
    rarity: "common" as const,
    unlockLevel: 2
  },
  pattern_tulip: {
    id: "pattern_tulip",
    name: "Tulipán de Patrones",
    icon: "🌷",
    color: "#9C27B0",
    growthTime: 5000,
    petals: 6,
    rarity: "rare" as const,
    unlockLevel: 3
  },
  magic_sunflower: {
    id: "magic_sunflower",
    name: "Girasol Mágico",
    icon: "🌻",
    color: "#FF9800",
    growthTime: 6000,
    petals: 12,
    rarity: "epic" as const,
    unlockLevel: 4
  },
  counting_lily: {
    id: "counting_lily",
    name: "Lirio Contador",
    icon: "🌸",
    color: "#E91E63",
    growthTime: 3500,
    petals: 4,
    rarity: "common" as const,
    unlockLevel: 1
  },
  simple_daisy: {
    id: "simple_daisy",
    name: "Margarita Simple",
    icon: "🌼",
    color: "#FFFFFF",
    growthTime: 2500,
    petals: 3,
    rarity: "common" as const,
    unlockLevel: 1
  }
};

// Configuración de niveles mejorada
const GARDEN_LEVELS = {
  1: {
    name: "Nivel 1: Semillas Básicas",
    description: "Aprende a plantar y regar flores simples",
    unlockedSeeds: ["simple_daisy", "counting_lily"],
    maxFlowers: 5,
    waterRegeneration: 5000, // 5 segundos
    countingDifficulty: "easy"
  },
  2: {
    name: "Nivel 2: Flores Contadoras",
    description: "Cuenta pétalos de flores más grandes",
    unlockedSeeds: ["basic_rose", "counting_daisy"],
    maxFlowers: 8,
    waterRegeneration: 4000, // 4 segundos
    countingDifficulty: "medium"
  },
  3: {
    name: "Nivel 3: Patrones Mágicos",
    description: "Crea patrones con flores especiales",
    unlockedSeeds: ["pattern_tulip"],
    maxFlowers: 12,
    waterRegeneration: 3000, // 3 segundos
    countingDifficulty: "hard"
  },
  4: {
    name: "Nivel 4: Jardín Mágico",
    description: "Domina el jardín con flores legendarias",
    unlockedSeeds: ["magic_sunflower"],
    maxFlowers: 15,
    waterRegeneration: 2000, // 2 segundos
    countingDifficulty: "expert"
  }
};

// Configuración de actividades interactivas mejoradas
const GARDEN_ACTIVITIES = {
  planting: {
    name: "Plantar Semillas",
    description: "Toca el suelo para plantar flores",
    icon: "🌱",
    points: 10
  },
  watering: {
    name: "Regar Flores",
    description: "Riega las flores para que crezcan",
    icon: "💧",
    points: 15
  },
  counting: {
    name: "Contar Pétalos",
    description: "Cuenta los pétalos de las flores",
    icon: "🔢",
    points: 20
  },
  patterns: {
    name: "Crear Patrones",
    description: "Organiza flores en patrones numéricos",
    icon: "✨",
    points: 25
  },
  magic: {
    name: "Magia del Jardín",
    description: "Usa poderes mágicos especiales",
    icon: "🌟",
    points: 30
  }
};

// Configuración de patrones mágicos
const MAGIC_PATTERNS = {
  counting_sequence: {
    name: "Secuencia de Conteo",
    description: "Organiza flores del 1 al 5",
    pattern: [1, 2, 3, 4, 5],
    reward: 50
  },
  skip_counting: {
    name: "Conteo de 2 en 2",
    description: "Organiza flores de 2 en 2",
    pattern: [2, 4, 6, 8, 10],
    reward: 75
  },
  flower_math: {
    name: "Matemáticas de Flores",
    description: "Suma pétalos de flores",
    pattern: "sum",
    reward: 100
  }
};

// Configuración de poderes mágicos
const MAGIC_POWERS = {
  growth_boost: {
    name: "Acelerar Crecimiento",
    description: "Hace crecer flores más rápido",
    icon: "⚡",
    cost: 20
  },
  water_magic: {
    name: "Agua Mágica",
    description: "Riega todas las flores",
    icon: "💧",
    cost: 30
  },
  pattern_reveal: {
    name: "Revelar Patrones",
    description: "Muestra patrones ocultos",
    icon: "🔍",
    cost: 25
  }
};

// Configuración de logros
const GARDEN_ACHIEVEMENTS = [
  {
    id: 'primer_brote',
    title: '🌱 Primer Brote',
    description: 'Plantaste tu primera semilla',
    requirement: 1,
    reward: 'Semilla Dorada',
    unlocked: false,
    icon: '🌱'
  },
  {
    id: 'jardinero_novato',
    title: '🌿 Jardinero Novato',
    description: 'Cultivaste 5 flores diferentes',
    requirement: 5,
    reward: 'Regadera Mágica',
    unlocked: false,
    icon: '🌿'
  },
  {
    id: 'contador_floral',
    title: '🌸 Contador Floral',
    description: 'Contaste hasta 10 flores',
    requirement: 10,
    reward: 'Corona de Flores',
    unlocked: false,
    icon: '🌸'
  },
  {
    id: 'maestro_jardinero',
    title: '👑 Maestro Jardinero',
    description: 'Completaste tu jardín mágico',
    requirement: 20,
    reward: 'Varita Mágica',
    unlocked: false,
    icon: '👑'
  }
];

// Pasos de bienvenida
const WELCOME_STEPS = [
  {
    title: "🌱 ¡Bienvenido al Jardín Mágico!",
    message: "¡Hola pequeño jardinero! Soy la Hada de los Números. Te voy a ayudar a crear tu jardín mágico personal.",
    icon: "🌱",
    action: "next"
  },
  {
    title: "🎨 Personaliza tu Jardín",
    message: "Primero, vamos a elegir los colores y flores que más te gusten. ¡Tu jardín será único!",
    icon: "🎨",
    action: "next"
  },
  {
    title: "🔢 Aprenderemos a Contar",
    message: "Mientras cuidas tu jardín, aprenderás a contar de manera especial. ¡Será muy divertido!",
    icon: "🔢",
    action: "next"
  },
  {
    title: "🎯 Tu Misión",
    message: "Cada día tu jardín crecerá y aprenderás nuevos números. ¡Construye el jardín más hermoso!",
    icon: "🎯",
    action: "start"
  }
];

const MagicGarden: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [achievements, setAchievements] = useState<GardenAchievement[]>(GARDEN_ACHIEVEMENTS);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [sessionData, setSessionData] = useState({
    flowersPlanted: 0,
    flowersWatered: 0,
    patternsCreated: 0,
    uniquePatterns: 0,
    plantingAccuracy: 0,
    timeSpent: 0,
    countingAccuracy: 0,
    correctCounts: 0,
    totalCounts: 0,
    engagementTime: 0,
    skillDevelopment: 0,
    patternRecognition: 0,
    magicPowersUsed: 0,
    flowersInPatterns: 0
  });
  const [activeReport, setActiveReport] = useState<'child' | 'parent' | 'teacher'>('child');
  const [selectedTool, setSelectedTool] = useState<string>('seeds');
  const [waterLevel, setWaterLevel] = useState(10);
  const [gardenLevel, setGardenLevel] = useState(1);
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [currentActivity, setCurrentActivity] = useState<string>('planting');
  const [showActivityGuide, setShowActivityGuide] = useState(true);
  const [currentPattern, setCurrentPattern] = useState<any>(null);
  const [patternProgress, setPatternProgress] = useState(0);
  const [magicPoints, setMagicPoints] = useState(100);
  const [showPatternChallenge, setShowPatternChallenge] = useState(false);
  const [showCountingModal, setShowCountingModal] = useState(false);
  const [currentCountingFlower, setCurrentCountingFlower] = useState<Flower | null>(null);
  const [countingAnswer, setCountingAnswer] = useState('');
  const [countingError, setCountingError] = useState('');
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [patternAnswer, setPatternAnswer] = useState('');
  const [patternError, setPatternError] = useState('');

  // Función para hablar
  const speak = useCallback((text: string) => {
    if (speechEnabled && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      utterance.pitch = 1.1; // Voz más aguda para Hada
      window.speechSynthesis.speak(utterance);
    }
  }, [speechEnabled]);

  // Función para reproducir sonidos del jardín
  const playGardenSound = useCallback((soundType: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const sounds = {
      flower_plant: { frequency: 600, duration: 0.4 },
      water_drop: { frequency: 400, duration: 0.3 },
      magic_sparkle: { frequency: 800, duration: 0.5 },
      growth: { frequency: 300, duration: 0.8 },
      achievement: { frequency: 523, duration: 0.6 }
    };

    const sound = sounds[soundType as keyof typeof sounds] || sounds.flower_plant;
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
    if (welcomeStep < WELCOME_STEPS.length - 1) {
      setWelcomeStep(welcomeStep + 1);
      speak(WELCOME_STEPS[welcomeStep + 1].message);
    } else {
      setShowWelcome(false);
      speak("¡Perfecto! Ahora puedes comenzar a crear tu jardín mágico. ¡Buena suerte, pequeño jardinero!");
    }
  }, [welcomeStep, speak]);

  const handleWelcomeSkip = useCallback(() => {
    setShowWelcome(false);
    speak("¡Perfecto! Ahora puedes comenzar a crear tu jardín mágico. ¡Buena suerte, pequeño jardinero!");
  }, [speak]);

  // Función para calcular el estado de crecimiento
  const calculateGrowthStage = useCallback((plantedAt: Date, wateredAt?: Date): Flower['growthStage'] => {
    const now = new Date();
    const timeSincePlanting = now.getTime() - plantedAt.getTime();
    const timeSinceWatering = wateredAt ? now.getTime() - wateredAt.getTime() : 0;
    
    if (!wateredAt) return "seed";
    if (timeSinceWatering < 2000) return "sprout";
    if (timeSinceWatering < 5000) return "bud";
    return "flower";
  }, []);

  // Función para calcular pétalos
  const calculatePetals = useCallback((seed: Seed, growthStage: string): number => {
    if (growthStage === 'seed') return Math.max(1, Math.floor(seed.petals * 0.5));
    if (growthStage === 'sprout') return Math.max(1, Math.floor(seed.petals * 0.7));
    if (growthStage === 'bud') return Math.max(1, Math.floor(seed.petals * 0.9));
    return seed.petals;
  }, []);

  // Función para plantar semillas mejorada
  const handlePlantSeed = useCallback((position: { x: number; y: number }) => {
    const currentLevelConfig = GARDEN_LEVELS[gardenLevel as keyof typeof GARDEN_LEVELS];
    const availableSeeds = currentLevelConfig.unlockedSeeds;
    
    // Seleccionar semilla basada en el nivel y progreso
    let selectedSeedId = availableSeeds[0];
    if (flowers.length >= 3) {
      selectedSeedId = availableSeeds[Math.min(1, availableSeeds.length - 1)];
    }
    if (flowers.length >= 6) {
      selectedSeedId = availableSeeds[Math.min(2, availableSeeds.length - 1)];
    }
    
    const seed = SEED_TYPES[selectedSeedId as keyof typeof SEED_TYPES];
    
    const newFlower: Flower = {
      id: `flower-${Date.now()}`,
      seedId: seed.id,
      plantedAt: new Date(),
      growthStage: "seed",
      petals: calculatePetals(seed, "seed"),
      position,
      isWatered: false,
      isCounted: false
    };

    setFlowers(prev => [...prev, newFlower]);
    setSessionData(prev => ({
      ...prev,
      flowersPlanted: prev.flowersPlanted + 1,
      plantingAccuracy: Math.min(prev.plantingAccuracy + 10, 100),
      engagementTime: prev.engagementTime + 1
    }));

    playGardenSound('flower_plant');
    speak(`¡Plantaste una ${seed.name}! Ahora riégala para que crezca.`);
    
    setTotalScore(prev => prev + GARDEN_ACTIVITIES.planting.points);
    setExperiencePoints(prev => prev + 5);
    
    // Actualizar actividad actual
    setCurrentActivity('watering');
  }, [gardenLevel, flowers.length, calculatePetals, playGardenSound, speak]);

  // Función para regar flores mejorada
  const handleWaterFlower = useCallback((flowerId: string) => {
    if (waterLevel <= 0) {
      speak("¡No tienes agua! Espera a que se regenere.");
      return;
    }

    setFlowers(prev => prev.map(flower => 
      flower.id === flowerId 
        ? { ...flower, isWatered: true, wateredAt: new Date() }
        : flower
    ));

    setWaterLevel(prev => prev - 1);
    setSessionData(prev => ({
      ...prev,
      flowersWatered: prev.flowersWatered + 1,
      engagementTime: prev.engagementTime + 1
    }));

    playGardenSound('water_drop');
    speak("¡Perfecto! La flor está regada. Ahora crecerá más rápido.");
    
    setTotalScore(prev => prev + GARDEN_ACTIVITIES.watering.points);
    setExperiencePoints(prev => prev + 3);
    
    // Actualizar actividad actual
    setCurrentActivity('counting');
  }, [waterLevel, playGardenSound, speak]);

  // Función para contar flores mejorada con modal
  const handleCountFlowerModal = useCallback((flower: Flower) => {
    setCurrentCountingFlower(flower);
    setCountingAnswer('');
    setCountingError('');
    setShowCountingModal(true);
    speak(`Cuenta los pétalos de esta ${SEED_TYPES[flower.seedId as keyof typeof SEED_TYPES].name}. ¿Cuántos pétalos ves?`);
  }, [speak]);

  const handleCountingSubmit = useCallback(() => {
    if (!currentCountingFlower) return;
    
    const userCount = parseInt(countingAnswer);
    if (isNaN(userCount)) {
      setCountingError('Por favor ingresa un número válido');
      return;
    }

    const correctCount = currentCountingFlower.petals;
    const isCorrect = userCount === correctCount;
    
    setSessionData(prev => ({
      ...prev,
      totalCounts: prev.totalCounts + 1,
      correctCounts: prev.correctCounts + (isCorrect ? 1 : 0),
      countingAccuracy: Math.round(((prev.correctCounts + (isCorrect ? 1 : 0)) / (prev.totalCounts + 1)) * 100),
      engagementTime: prev.engagementTime + 2,
      skillDevelopment: Math.min(prev.skillDevelopment + (isCorrect ? 5 : 2), 100)
    }));

    setFlowers(prev => prev.map(f => 
      f.id === currentCountingFlower.id ? { ...f, isCounted: true } : f
    ));

    if (isCorrect) {
      speak(`¡Excelente! Contaste correctamente ${correctCount} pétalos. ¡Muy bien hecho!`);
      playCountFeedback(true);
      setTotalScore(prev => prev + GARDEN_ACTIVITIES.counting.points);
      setExperiencePoints(prev => prev + 10);
      setMagicPoints(prev => prev + 5);
      setShowCountingModal(false);
    } else {
      setCountingError(`¡Casi correcto! Esta flor tiene ${correctCount} pétalos. ¡Intenta de nuevo!`);
      speak(`Casi correcto. Esta flor tiene ${correctCount} pétalos. ¡Intenta de nuevo!`);
      playCountFeedback(false);
      setCountingAnswer('');
    }

    // Actualizar actividad actual
    setCurrentActivity('patterns');
  }, [currentCountingFlower, countingAnswer, playCountFeedback, speak]);

  // Función para manejar patrones mejorada
  const handlePatternChallenge = useCallback(() => {
    const patternKeys = Object.keys(MAGIC_PATTERNS);
    const randomPattern = MAGIC_PATTERNS[patternKeys[Math.floor(Math.random() * patternKeys.length)] as keyof typeof MAGIC_PATTERNS];
    
    setCurrentPattern(randomPattern);
    setPatternAnswer('');
    setPatternError('');
    setShowPatternModal(true);
    speak(`¡Nuevo desafío! ${randomPattern.description}. ¿Puedes completarlo?`);
  }, [speak]);

  const handlePatternSubmit = useCallback(() => {
    if (!currentPattern) return;
    
    const userPattern = patternAnswer.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    
    if (userPattern.length === 0) {
      setPatternError('Por favor ingresa números separados por comas (ejemplo: 1, 2, 3, 4, 5)');
      return;
    }

    let isCorrect = false;
    
    if (currentPattern.pattern === "sum") {
      // Para flower_math, validar que la suma sea correcta
      const expectedSum = 15; // Ejemplo: suma de 1+2+3+4+5
      const userSum = userPattern.reduce((sum, num) => sum + num, 0);
      isCorrect = userSum === expectedSum;
    } else if (Array.isArray(currentPattern.pattern)) {
      // Para patrones de array, validar secuencia
      isCorrect = JSON.stringify(userPattern) === JSON.stringify(currentPattern.pattern);
    }

    if (isCorrect) {
      setSessionData(prev => ({
        ...prev,
        patternsCreated: prev.patternsCreated + 1,
        uniquePatterns: prev.uniquePatterns + 1,
        patternRecognition: Math.min(prev.patternRecognition + 15, 100),
        flowersInPatterns: prev.flowersInPatterns + userPattern.length,
        engagementTime: prev.engagementTime + 5
      }));
      setTotalScore(prev => prev + currentPattern.reward);
      setMagicPoints(prev => prev + 20);
      speak("¡Patrón perfecto! Has creado una secuencia mágica.");
      setShowPatternModal(false);
    } else {
      setPatternError('¡Casi correcto! Revisa el patrón e intenta de nuevo.');
      speak('¡Casi correcto! Revisa el patrón e intenta de nuevo.');
      setPatternAnswer('');
    }
  }, [currentPattern, patternAnswer, speak]);

  // Función para validar patrones
  const validatePattern = useCallback((patternType: string, userPattern: any[]) => {
    const pattern = MAGIC_PATTERNS[patternType as keyof typeof MAGIC_PATTERNS];
    
    if (patternType === 'counting_sequence') {
      const isCorrect = JSON.stringify(userPattern) === JSON.stringify(pattern.pattern);
      if (isCorrect) {
        setSessionData(prev => ({
          ...prev,
          patternsCreated: prev.patternsCreated + 1,
          uniquePatterns: prev.uniquePatterns + 1,
          patternRecognition: Math.min(prev.patternRecognition + 15, 100),
          flowersInPatterns: prev.flowersInPatterns + userPattern.length,
          engagementTime: prev.engagementTime + 5
        }));
        setTotalScore(prev => prev + pattern.reward);
        setMagicPoints(prev => prev + 20);
        speak("¡Patrón perfecto! Has creado una secuencia mágica.");
      }
      return isCorrect;
    }
    
    return false;
  }, [speak]);

  // Función para usar poderes mágicos
  const useMagicPower = useCallback((powerType: string) => {
    const power = MAGIC_POWERS[powerType as keyof typeof MAGIC_POWERS];
    
    if (magicPoints < power.cost) {
      speak("¡No tienes suficientes puntos mágicos!");
      return;
    }

    setMagicPoints(prev => prev - power.cost);
    setSessionData(prev => ({
      ...prev,
      magicPowersUsed: prev.magicPowersUsed + 1,
      engagementTime: prev.engagementTime + 3
    }));

    switch (powerType) {
      case 'growth_boost':
        setFlowers(prev => prev.map(flower => ({
          ...flower,
          growthStage: flower.growthStage === 'seed' ? 'sprout' : 
                      flower.growthStage === 'sprout' ? 'bud' : 
                      flower.growthStage === 'bud' ? 'flower' : 'flower'
        })));
        speak("¡Crecimiento acelerado! Las flores crecen más rápido.");
        break;
      case 'water_magic':
        setFlowers(prev => prev.map(flower => ({
          ...flower,
          isWatered: true,
          wateredAt: new Date()
        })));
        speak("¡Agua mágica! Todas las flores están regadas.");
        break;
      case 'pattern_reveal':
        handlePatternChallenge();
        break;
    }

    playGardenSound('magic_sparkle');
    setTotalScore(prev => prev + GARDEN_ACTIVITIES.magic.points);
  }, [magicPoints, playGardenSound, speak, handlePatternChallenge]);

  // Función para verificar logros
  const checkAchievements = useCallback(() => {
    const newAchievements: GardenAchievement[] = [];
    
    const flowersPlanted = flowers.length;
    const flowersCounted = flowers.filter(f => f.isCounted).length;
    
    achievements.forEach(achievement => {
      if (!achievement.unlocked) {
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'primer_brote':
            shouldUnlock = flowersPlanted >= 1;
            break;
          case 'jardinero_novato':
            shouldUnlock = flowersPlanted >= 5;
            break;
          case 'contador_floral':
            shouldUnlock = flowersCounted >= 10;
            break;
          case 'maestro_jardinero':
            shouldUnlock = flowersPlanted >= 20;
            break;
        }
        
        if (shouldUnlock) {
          newAchievements.push({
            ...achievement,
            unlocked: true
          });
        }
      }
    });
    
    if (newAchievements.length > 0) {
      setAchievements(prev => prev.map(achievement => {
        const newAchievement = newAchievements.find(na => na.id === achievement.id);
        return newAchievement || achievement;
      }));
      
      speak(`¡Logro desbloqueado! ${newAchievements[0].title}`);
      playGardenSound('achievement');
    }
  }, [flowers, achievements, speak, playGardenSound]);

  // Función para generar pistas del jardín mejorada
  const generateGardenHint = useCallback(() => {
    const wateredFlowers = flowers.filter(f => f.isWatered).length;
    const countedFlowers = flowers.filter(f => f.isCounted).length;
    const totalFlowers = flowers.length;

    if (totalFlowers === 0) {
      return "🌱 ¡Empieza plantando tu primera semilla! Usa la pala para plantar.";
    }

    if (wateredFlowers === 0) {
      return "💧 ¡Riega tus flores! Usa la regadera para hacer crecer tus plantas.";
    }

    if (countedFlowers < wateredFlowers) {
      return `🔢 Cuenta los pétalos de tus flores. Ya tienes ${countedFlowers} flores contadas de ${wateredFlowers} regadas.`;
    }

    if (totalFlowers >= 5 && countedFlowers >= wateredFlowers) {
      return "✨ ¡Excelente! Ahora puedes crear patrones mágicos. ¡Prueba el botón de patrones!";
    }

    return "🌺 ¡Sigue cultivando tu jardín mágico! Planta más flores para desbloquear nuevos niveles.";
  }, [flowers]);

  // Función para generar reportes
  const generateChildGardenReport = useCallback((sessionData: any): ChildGardenReport => ({
    totalFlowers: sessionData.flowersPlanted,
    gardenLevel: Math.floor(sessionData.flowersPlanted / 5) + 1,
    achievementsUnlocked: achievements.filter(a => a.unlocked).length,
    timeSpent: sessionData.engagementTime,
    accuracy: sessionData.countingAccuracy,
    nextChallenge: "Planta 5 flores más para desbloquear nuevas semillas",
    gardenTheme: "Jardín Mágico"
  }), [achievements]);

  const generateParentGardenReport = useCallback((sessionData: any): ParentGardenReport => ({
    skills: {
      counting: Math.min((sessionData.correctCounts / Math.max(sessionData.totalCounts, 1)) * 100, 100),
      patternRecognition: sessionData.patternRecognition,
      fineMotor: sessionData.plantingAccuracy,
      creativity: Math.min((sessionData.uniquePatterns / 5) * 100, 100)
    },
    recommendations: [
      "Practica contando objetos en casa",
      "Crea patrones con juguetes",
      "Visita jardines para observar flores",
      "Juega con secuencias numéricas"
    ],
    activities: [
      "Contar escalones al subir",
      "Organizar juguetes por colores",
      "Plantar semillas reales",
      "Crear patrones con bloques"
    ],
    gardenProgress: {
      flowersPlanted: sessionData.flowersPlanted,
      patternsCreated: sessionData.patternsCreated,
      timeSpent: sessionData.engagementTime
    }
  }), []);

  const generateTeacherGardenReport = useCallback((sessionData: any): TeacherGardenReport => ({
    studentInfo: {
      name: "Estudiante",
      grade: "1° Básico",
      oa: "MA01OA01",
      gardenTheme: "Jardín Mágico"
    },
    academicProgress: {
      oaMastery: Math.min((sessionData.correctCounts / Math.max(sessionData.totalCounts, 1)) * 100, 100),
      skillDevelopment: sessionData.skillDevelopment,
      engagement: Math.min((sessionData.engagementTime / 60) * 100, 100),
      creativity: Math.min((sessionData.uniquePatterns / 5) * 100, 100)
    },
    recommendations: [
      "Reforzar conteo de objetos en grupos",
      "Practicar patrones numéricos",
      "Estimular creatividad en arreglos",
      "Desarrollar habilidades de secuenciación"
    ],
    gardenMetrics: {
      totalFlowers: sessionData.flowersPlanted,
      patternsCreated: sessionData.patternsCreated,
      countingAccuracy: sessionData.countingAccuracy,
      timeEngagement: sessionData.engagementTime
    }
  }), []);

  // Efectos mejorados
  useEffect(() => {
    if (!showWelcome) {
      speak("¡Bienvenido al Jardín Mágico! Planta semillas, riega flores y aprende a contar.");
    }
  }, [showWelcome, speak]);

  useEffect(() => {
    checkAchievements();
  }, [flowers, checkAchievements]);

  // Regeneración de agua mejorada (más rápida)
  useEffect(() => {
    const currentLevelConfig = GARDEN_LEVELS[gardenLevel as keyof typeof GARDEN_LEVELS];
    const interval = setInterval(() => {
      setWaterLevel(prev => Math.min(prev + 1, 10));
    }, currentLevelConfig.waterRegeneration);

    return () => clearInterval(interval);
  }, [gardenLevel]);

  // Actualizar crecimiento de flores
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowers(prev => prev.map(flower => {
        const newGrowthStage = calculateGrowthStage(flower.plantedAt, flower.wateredAt);
        const seed = SEED_TYPES[flower.seedId as keyof typeof SEED_TYPES];
        const newPetals = calculatePetals(seed, newGrowthStage);
        
        return {
          ...flower,
          growthStage: newGrowthStage,
          petals: newPetals
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateGrowthStage, calculatePetals]);

  // Verificar progreso del nivel
  useEffect(() => {
    const currentLevelConfig = GARDEN_LEVELS[gardenLevel as keyof typeof GARDEN_LEVELS];
    const flowersInLevel = flowers.length;
    
    if (flowersInLevel >= currentLevelConfig.maxFlowers && gardenLevel < 4) {
      setGardenLevel(prev => prev + 1);
      speak(`¡Nivel ${gardenLevel + 1} desbloqueado! Nuevas semillas disponibles.`);
    }
  }, [flowers.length, gardenLevel, speak]);

  // Actualizar tiempo de engagement automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionData(prev => ({
        ...prev,
        engagementTime: prev.engagementTime + 1
      }));
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, []);

  // Renderizar bienvenida
  if (showWelcome) {
    return (
      <div className="welcome-overlay">
        <div className="welcome-card">
          <div className="welcome-header">
            <div className="welcome-icon">{WELCOME_STEPS[welcomeStep].icon}</div>
            <h2>{WELCOME_STEPS[welcomeStep].title}</h2>
          </div>
          <div className="welcome-message">
            <p>{WELCOME_STEPS[welcomeStep].message}</p>
          </div>
          <div className="welcome-actions">
            <button className="welcome-btn skip" onClick={handleWelcomeSkip}>
              Saltar
            </button>
            <button className="welcome-btn next" onClick={handleWelcomeNext}>
              {welcomeStep === WELCOME_STEPS.length - 1 ? 'Comenzar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar reporte
  if (showReport) {
    const childReport = generateChildGardenReport(sessionData);
    const parentReport = generateParentGardenReport(sessionData);
    const teacherReport = generateTeacherGardenReport(sessionData);

    return (
      <div className="report-overlay">
        <div className="report-container">
          <div className="report-header">
            <h2>📊 Reporte del Jardín Mágico</h2>
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
                👩‍🏫 Para Docentes
              </button>
            </div>
          </div>
          
          <div className="report-content">
            {activeReport === 'child' && (
              <div className="child-report">
                <div className="report-stats">
                  <div className="stat">
                    <span className="stat-label">Flores Plantadas</span>
                    <span className="stat-value">{childReport.totalFlowers}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Nivel del Jardín</span>
                    <span className="stat-value">{childReport.gardenLevel}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Logros Desbloqueados</span>
                    <span className="stat-value">{childReport.achievementsUnlocked}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Precisión</span>
                    <span className="stat-value">{Math.round(childReport.accuracy)}%</span>
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
                <div className="skills-section">
                  <h3>Habilidades Desarrolladas</h3>
                  <div className="skill-bars">
                    <div className="skill-bar">
                      <span>Conteo</span>
                      <div className="bar">
                        <div className="fill" style={{ width: `${parentReport.skills.counting}%` }}></div>
                      </div>
                    </div>
                    <div className="skill-bar">
                      <span>Patrones</span>
                      <div className="bar">
                        <div className="fill" style={{ width: `${parentReport.skills.patternRecognition}%` }}></div>
                      </div>
                    </div>
                    <div className="skill-bar">
                      <span>Motricidad</span>
                      <div className="bar">
                        <div className="fill" style={{ width: `${parentReport.skills.fineMotor}%` }}></div>
                      </div>
                    </div>
                    <div className="skill-bar">
                      <span>Creatividad</span>
                      <div className="bar">
                        <div className="fill" style={{ width: `${parentReport.skills.creativity}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="recommendations">
                  <h3>Recomendaciones</h3>
                  <ul>
                    {parentReport.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeReport === 'teacher' && (
              <div className="teacher-report">
                <div className="student-info">
                  <h3>Información del Estudiante</h3>
                  <p><strong>Nombre:</strong> {teacherReport.studentInfo.name}</p>
                  <p><strong>Grado:</strong> {teacherReport.studentInfo.grade}</p>
                  <p><strong>OA:</strong> {teacherReport.studentInfo.oa}</p>
                </div>
                <div className="academic-progress">
                  <h3>Progreso Académico</h3>
                  <div className="progress-metrics">
                    <div className="metric">
                      <span>Dominio del OA</span>
                      <span>{Math.round(teacherReport.academicProgress.oaMastery)}%</span>
                    </div>
                    <div className="metric">
                      <span>Desarrollo de Habilidades</span>
                      <span>{Math.round(teacherReport.academicProgress.skillDevelopment)}%</span>
                    </div>
                    <div className="metric">
                      <span>Engagement</span>
                      <span>{Math.round(teacherReport.academicProgress.engagement)}%</span>
                    </div>
                  </div>
                </div>
                <div className="rec-section">
                  <h3>Recomendaciones Pedagógicas</h3>
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
            <button className="report-btn" onClick={() => setShowReport(false)}>
              Cerrar Reporte
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="garden-container">
      {/* Header */}
      <div className="garden-header">
        <h1>🌱 Jardín Mágico</h1>
        <div className="garden-info">
          <span>Nivel: {gardenLevel}</span>
          <span>Puntos: {experiencePoints}</span>
          <span>Puntuación: {totalScore}</span>
        </div>
      </div>

      {/* Main Garden Area */}
      <div className="garden-main">
        {/* Panel de herramientas */}
        <div className="garden-tools">
          <h3>🛠️ Herramientas</h3>
          
          {/* Información del nivel actual */}
          <div className="level-info">
            <h4>{GARDEN_LEVELS[gardenLevel as keyof typeof GARDEN_LEVELS].name}</h4>
            <p>{GARDEN_LEVELS[gardenLevel as keyof typeof GARDEN_LEVELS].description}</p>
            <div className="level-progress">
              <span>Progreso: {flowers.length}/{GARDEN_LEVELS[gardenLevel as keyof typeof GARDEN_LEVELS].maxFlowers} flores</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${(flowers.length / GARDEN_LEVELS[gardenLevel as keyof typeof GARDEN_LEVELS].maxFlowers) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Actividad actual */}
          <div className="current-activity">
            <h4>🎯 Actividad Actual</h4>
            <div className="activity-display">
              <span className="activity-icon">
                {GARDEN_ACTIVITIES[currentActivity as keyof typeof GARDEN_ACTIVITIES].icon}
              </span>
              <div className="activity-info">
                <span className="activity-name">
                  {GARDEN_ACTIVITIES[currentActivity as keyof typeof GARDEN_ACTIVITIES].name}
                </span>
                <span className="activity-description">
                  {GARDEN_ACTIVITIES[currentActivity as keyof typeof GARDEN_ACTIVITIES].description}
                </span>
              </div>
            </div>
          </div>
          
          <div className="tool-buttons">
            <button 
              className={`tool-btn ${selectedTool === 'seeds' ? 'active' : ''}`}
              onClick={() => setSelectedTool('seeds')}
            >
              🌱 Semillas
            </button>
            <button 
              className={`tool-btn ${selectedTool === 'water' ? 'active' : ''}`}
              onClick={() => setSelectedTool('water')}
            >
              💧 Regadera ({waterLevel})
            </button>
            <button 
              className={`tool-btn ${selectedTool === 'count' ? 'active' : ''}`}
              onClick={() => setSelectedTool('count')}
            >
              🔢 Contar
            </button>
            <button 
              className="tool-btn pattern-btn"
              onClick={handlePatternChallenge}
            >
              ✨ Patrones
            </button>
          </div>
          
          {/* Poderes mágicos */}
          <div className="magic-powers">
            <h4>🌟 Poderes Mágicos</h4>
            <div className="magic-points">
              <span>Puntos Mágicos: {magicPoints}</span>
            </div>
            <div className="power-buttons">
              <button 
                className="power-btn"
                onClick={() => useMagicPower('growth_boost')}
                disabled={magicPoints < MAGIC_POWERS.growth_boost.cost}
              >
                {MAGIC_POWERS.growth_boost.icon} {MAGIC_POWERS.growth_boost.name}
                <span className="power-cost">{MAGIC_POWERS.growth_boost.cost}</span>
              </button>
              <button 
                className="power-btn"
                onClick={() => useMagicPower('water_magic')}
                disabled={magicPoints < MAGIC_POWERS.water_magic.cost}
              >
                {MAGIC_POWERS.water_magic.icon} {MAGIC_POWERS.water_magic.name}
                <span className="power-cost">{MAGIC_POWERS.water_magic.cost}</span>
              </button>
              <button 
                className="power-btn"
                onClick={() => useMagicPower('pattern_reveal')}
                disabled={magicPoints < MAGIC_POWERS.pattern_reveal.cost}
              >
                {MAGIC_POWERS.pattern_reveal.icon} {MAGIC_POWERS.pattern_reveal.name}
                <span className="power-cost">{MAGIC_POWERS.pattern_reveal.cost}</span>
              </button>
            </div>
          </div>
          
          <div className="water-indicator">
            <span>Agua: {waterLevel}/10</span>
            <div className="water-bar">
              <div className="water-fill" style={{ width: `${(waterLevel / 10) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Área del jardín */}
        <div className="garden-area">
          <div className="garden-grid">
            {Array.from({ length: 25 }, (_, index) => {
              const x = Math.floor(index / 5);
              const y = index % 5;
              const flower = flowers.find(f => f.position.x === x && f.position.y === y);
              
              return (
                <div
                  key={index}
                  className={`garden-plot ${flower ? 'has-flower' : ''}`}
                  onClick={() => {
                    if (selectedTool === 'seeds' && !flower) {
                      handlePlantSeed({ x, y });
                    } else if (selectedTool === 'water' && flower && !flower.isWatered) {
                      handleWaterFlower(flower.id);
                    } else if (selectedTool === 'count' && flower && flower.growthStage === 'flower') {
                      handleCountFlowerModal(flower);
                    }
                  }}
                >
                  {flower && (
                    <div className={`flower ${flower.growthStage} ${flower.isWatered ? 'watered' : ''} ${flower.isCounted ? 'counted' : ''}`}>
                      <span className="flower-icon">{SEED_TYPES[flower.seedId as keyof typeof SEED_TYPES].icon}</span>
                      {flower.growthStage === 'flower' && (
                        <div className="petal-info">
                          <span className="petal-count">{flower.petals}</span>
                          <span className="petal-label">pétalos</span>
                        </div>
                      )}
                      {flower.growthStage === 'bud' && (
                        <div className="petal-info">
                          <span className="petal-count">{flower.petals}</span>
                          <span className="petal-label">visibles</span>
                        </div>
                      )}
                      {flower.isCounted && (
                        <span className="counted-check">✓</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel de información */}
        <div className="garden-info-panel">
          <h3>📊 Información</h3>
          <div className="info-stats">
            <div className="stat">
              <span>Flores Plantadas</span>
              <span>{sessionData.flowersPlanted}</span>
            </div>
            <div className="stat">
              <span>Flores Regadas</span>
              <span>{sessionData.flowersWatered}</span>
            </div>
            <div className="stat">
              <span>Precisión</span>
              <span>{Math.round(sessionData.countingAccuracy)}%</span>
            </div>
          </div>
          
          <div className="achievements-preview">
            <h4>🏆 Logros</h4>
            <div className="achievement-list">
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
        </div>
      </div>

      {/* Pistas */}
      {showHints && (
        <div className="garden-hints">
          <div className="hint-content">
            <span className="hint-icon">💡</span>
            <p>{generateGardenHint()}</p>
          </div>
        </div>
      )}

      {/* Logros */}
      {showAchievements && (
        <div className="achievements-overlay">
          <div className="achievements-container">
            <div className="achievements-header">
              <h2>🏆 Logros del Jardín</h2>
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

      {/* Botón de reporte final */}
      {sessionData.flowersPlanted >= 20 && (
        <div className="completion-overlay">
          <div className="completion-card">
            <h2>🎉 ¡Jardín Completado!</h2>
            <p>Has creado un hermoso jardín mágico. ¡Felicidades!</p>
            <button onClick={() => setShowReport(true)}>
              Ver Reporte Final
            </button>
          </div>
        </div>
      )}

      {/* Modal de conteo de pétalos */}
      {showCountingModal && currentCountingFlower && (
        <div className="counting-modal-overlay">
          <div className="counting-modal-card">
            <div className="modal-header">
              <h2>🔢 Contar Pétalos</h2>
              <button onClick={() => setShowCountingModal(false)}>✕</button>
            </div>
            <div className="modal-content">
              <div className="flower-display">
                <span className="flower-icon-large">
                  {SEED_TYPES[currentCountingFlower.seedId as keyof typeof SEED_TYPES].icon}
                </span>
                <h3>{SEED_TYPES[currentCountingFlower.seedId as keyof typeof SEED_TYPES].name}</h3>
                <div className="petal-display">
                  {SEED_TYPES[currentCountingFlower.seedId as keyof typeof SEED_TYPES].icon.repeat(currentCountingFlower.petals)}
                </div>
              </div>
              
              <div className="counting-input">
                <label>¿Cuántos pétalos tiene esta flor?</label>
                <input
                  type="number"
                  value={countingAnswer}
                  onChange={(e) => setCountingAnswer(e.target.value)}
                  placeholder="Escribe el número"
                  min="1"
                  max="20"
                />
                {countingError && <div className="error-message">{countingError}</div>}
              </div>
              
              <div className="modal-actions">
                <button 
                  className="submit-btn"
                  onClick={handleCountingSubmit}
                >
                  Comprobar
                </button>
                <button 
                  className="skip-btn"
                  onClick={() => setShowCountingModal(false)}
                >
                  Saltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de desafío de patrones mejorado */}
      {showPatternModal && currentPattern && (
        <div className="pattern-challenge-overlay">
          <div className="pattern-challenge-card">
            <div className="challenge-header">
              <h2>✨ Desafío de Patrones</h2>
              <button onClick={() => setShowPatternModal(false)}>✕</button>
            </div>
            <div className="challenge-content">
              <h3>{currentPattern.name}</h3>
              <p>{currentPattern.description}</p>
              
              {Array.isArray(currentPattern.pattern) && (
                <div className="pattern-example">
                  <h4>Ejemplo del patrón:</h4>
                  <div className="pattern-display">
                    {currentPattern.pattern.map((num: number, index: number) => (
                      <div key={index} className="pattern-number">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentPattern.pattern === "sum" && (
                <div className="pattern-example">
                  <h4>Ejemplo de suma:</h4>
                  <p>Suma los números: 1 + 2 + 3 + 4 + 5 = 15</p>
                </div>
              )}
              
              <div className="pattern-input">
                <label>
                  {Array.isArray(currentPattern.pattern) 
                    ? "Escribe los números separados por comas:" 
                    : "Escribe el resultado de la suma:"}
                </label>
                <input
                  type="text"
                  value={patternAnswer}
                  onChange={(e) => setPatternAnswer(e.target.value)}
                  placeholder={Array.isArray(currentPattern.pattern) ? "1, 2, 3, 4, 5" : "15"}
                />
                {patternError && <div className="error-message">{patternError}</div>}
              </div>
              
              <div className="pattern-actions">
                <button 
                  className="pattern-btn"
                  onClick={handlePatternSubmit}
                >
                  Comprobar Patrón
                </button>
                <button 
                  className="skip-btn"
                  onClick={() => setShowPatternModal(false)}
                >
                  Saltar Desafío
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicGarden; 