# 🐄 DOCUMENTACIÓN EXPERIENCIA 3: "GRANJA CONTADOR" - PARTE 2: DINÁMICAS ESPECÍFICAS

## 📚 **CONTEXTO DE LAS DINÁMICAS ESPECÍFICAS**

**Propósito:** Documentar las mecánicas únicas del juego "Granja Contador" que NO son reutilizables para otras experiencias.

**Enfoque:** Conteo progresivo con temática de granja, desde conceptos básicos hasta patrones complejos.

---

## 🎮 **1. CONCEPTO CENTRAL DEL JUEGO**

### **Narrativa Principal:**
```
"Eres un granjero aprendiz que debe ayudar al Granjero Pedro a contar todos los animales de la granja. 
Cada nivel te presenta diferentes animales con diferentes cantidades y patrones de conteo."
```

### **Progresión Educativa:**
```typescript
const FARM_PROGRESSION = {
  nivel1: {
    title: "🐣 Pollitos Pequeños",
    range: "1-5",
    skill: "Conteo básico",
    bloom: "Recordar",
    animals: ["🐣", "🐤"],
    pattern: "secuencial_1_a_5"
  },
  nivel2: {
    title: "🐔 Gallinas Medianas", 
    range: "1-10",
    skill: "Conteo y correspondencia",
    bloom: "Comprender",
    animals: ["🐔", "🐓", "🥚"],
    pattern: "secuencial_1_a_10"
  },
  nivel3: {
    title: "🐄 Vacas Grandes",
    range: "1-20", 
    skill: "Conteo avanzado",
    bloom: "Aplicar",
    animals: ["🐄", "🐮", "🥛"],
    pattern: "secuencial_1_a_20"
  },
  nivel4: {
    title: "🚜 Granjero Experto",
    range: "Patrones",
    skill: "Conteo por patrones",
    bloom: "Analizar",
    animals: ["🚜", "🌾", "🏠"],
    pattern: "skip_counting_patterns"
  }
};
```

---

## 🐣 **2. NIVEL 1: POLLITOS PEQUEÑOS (1-5)**

### **Configuración del Nivel:**
```typescript
const POLLITOS_CONFIG = {
  title: "🐣 Pollitos Pequeños",
  description: "Cuenta los pollitos del 1 al 5",
  maxCount: 5,
  animals: [
    { type: "pollito", emoji: "🐣", sound: "pío" },
    { type: "pollito", emoji: "🐤", sound: "pío" }
  ],
  activities: [
    {
      id: "count_pollitos_1",
      instruction: "¡Cuenta cuántos pollitos hay!",
      scenario: ["🐣", "🐣", "🐣"],
      correctAnswer: 3,
      options: [2, 3, 4],
      feedback: "¡Correcto! Hay 3 pollitos. ¡Pío pío pío!"
    },
    {
      id: "count_pollitos_2", 
      instruction: "¿Cuántos pollitos ves ahora?",
      scenario: ["🐣", "🐣", "🐣", "🐣", "🐣"],
      correctAnswer: 5,
      options: [4, 5, 6],
      feedback: "¡Excelente! Has contado 5 pollitos correctamente."
    }
  ],
  achievements: [
    {
      id: "primer_pollito",
      title: "🐣 Primer Pollito",
      requirement: 1,
      reward: "Medalla de Pollito"
    },
    {
      id: "contador_pollitos",
      title: "🐣 Contador de Pollitos", 
      requirement: 5,
      reward: "Cinta de Pollito Experto"
    }
  ]
};
```

### **Lógica de Validación:**
```typescript
const validatePollitosCount = (userCount: number, correctCount: number): boolean => {
  return userCount === correctCount;
};

const generatePollitosHint = (currentCount: number, targetCount: number): string => {
  if (currentCount === 0) {
    return "¡Mira los pollitos! Toca cada uno mientras cuentas: 1, 2, 3...";
  } else if (currentCount < targetCount) {
    return `Ya has contado ${currentCount} pollitos. ¡Sigue contando!`;
  } else if (currentCount === targetCount) {
    return "¡Excelente! Has contado todos los pollitos. ¡Pasemos a las gallinas!";
  } else {
    return "Intenta contar de nuevo. Toca cada pollito: 1, 2, 3...";
  }
};
```

### **Datos Mock para Pollitos:**
```typescript
const POLLITOS_MOCK_DATA = {
  sessionId: "pollitos_session_001",
  level: "pollitos",
  currentActivity: 0,
  activities: [
    {
      id: "pollitos_1",
      animals: ["🐣", "🐣", "🐣"],
      correctAnswer: 3,
      userAnswer: null,
      completed: false
    },
    {
      id: "pollitos_2", 
      animals: ["🐣", "🐣", "🐣", "🐣", "🐣"],
      correctAnswer: 5,
      userAnswer: null,
      completed: false
    }
  ],
  achievements: [
    { id: "primer_pollito", completed: false, progress: 0 },
    { id: "contador_pollitos", completed: false, progress: 0 }
  ],
  totalCounted: 0,
  accuracy: 0
};
```

---

## 🐔 **3. NIVEL 2: GALLINAS MEDIANAS (1-10)**

### **Configuración del Nivel:**
```typescript
const GALLINAS_CONFIG = {
  title: "🐔 Gallinas Medianas",
  description: "Cuenta las gallinas del 1 al 10",
  maxCount: 10,
  animals: [
    { type: "gallina", emoji: "🐔", sound: "cacareo" },
    { type: "gallina", emoji: "🐓", sound: "cacareo" },
    { type: "huevo", emoji: "🥚", sound: "crack" }
  ],
  activities: [
    {
      id: "count_gallinas_1",
      instruction: "¿Cuántas gallinas están en el corral?",
      scenario: ["🐔", "🐔", "🐔", "🐔", "🐔", "🐔"],
      correctAnswer: 6,
      options: [5, 6, 7],
      feedback: "¡Correcto! Hay 6 gallinas en el corral."
    },
    {
      id: "count_gallinas_2",
      instruction: "Cuenta todas las gallinas y huevos",
      scenario: ["🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐔"],
      correctAnswer: 10,
      options: [9, 10, 11],
      feedback: "¡Perfecto! Has contado 10 gallinas correctamente."
    }
  ],
  achievements: [
    {
      id: "primer_gallina",
      title: "🐔 Primera Gallina",
      requirement: 1,
      reward: "Medalla de Gallina"
    },
    {
      id: "contador_gallinas",
      title: "🐔 Contador de Gallinas",
      requirement: 10,
      reward: "Cinta de Gallina Experta"
    }
  ]
};
```

### **Lógica de Validación:**
```typescript
const validateGallinasCount = (userCount: number, correctCount: number): boolean => {
  return userCount === correctCount;
};

const generateGallinasHint = (currentCount: number, targetCount: number): string => {
  if (currentCount === 0) {
    return "¡Las gallinas son más grandes! Cuenta del 1 al 10.";
  } else if (currentCount < targetCount) {
    return `Ya has contado ${currentCount} gallinas. ¡Continúa!`;
  } else if (currentCount === targetCount) {
    return "¡Perfecto! Has contado todas las gallinas. ¡Ahora las vacas!";
  } else {
    return "Intenta contar de nuevo. Las gallinas son más grandes que los pollitos.";
  }
};
```

### **Datos Mock para Gallinas:**
```typescript
const GALLINAS_MOCK_DATA = {
  sessionId: "gallinas_session_001",
  level: "gallinas",
  currentActivity: 0,
  activities: [
    {
      id: "gallinas_1",
      animals: ["🐔", "🐔", "🐔", "🐔", "🐔", "🐔"],
      correctAnswer: 6,
      userAnswer: null,
      completed: false
    },
    {
      id: "gallinas_2",
      animals: ["🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐔"],
      correctAnswer: 10,
      userAnswer: null,
      completed: false
    }
  ],
  achievements: [
    { id: "primer_gallina", completed: false, progress: 0 },
    { id: "contador_gallinas", completed: false, progress: 0 }
  ],
  totalCounted: 0,
  accuracy: 0
};
```

---

## 🐄 **4. NIVEL 3: VACAS GRANDES (1-20)**

### **Configuración del Nivel:**
```typescript
const VACAS_CONFIG = {
  title: "🐄 Vacas Grandes",
  description: "Cuenta las vacas del 1 al 20",
  maxCount: 20,
  animals: [
    { type: "vaca", emoji: "🐄", sound: "muuu" },
    { type: "vaca", emoji: "🐮", sound: "muuu" },
    { type: "leche", emoji: "🥛", sound: "splash" }
  ],
  activities: [
    {
      id: "count_vacas_1",
      instruction: "¿Cuántas vacas están en el establo?",
      scenario: ["🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄"],
      correctAnswer: 15,
      options: [14, 15, 16],
      feedback: "¡Correcto! Hay 15 vacas en el establo."
    },
    {
      id: "count_vacas_2",
      instruction: "Cuenta todas las vacas de la granja",
      scenario: ["🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄"],
      correctAnswer: 20,
      options: [19, 20, 21],
      feedback: "¡Increíble! Has contado 20 vacas correctamente."
    }
  ],
  achievements: [
    {
      id: "primer_vaca",
      title: "🐄 Primera Vaca",
      requirement: 1,
      reward: "Medalla de Vaca"
    },
    {
      id: "contador_vacas",
      title: "🐄 Contador de Vacas",
      requirement: 20,
      reward: "Cinta de Vaca Experta"
    }
  ]
};
```

### **Lógica de Validación:**
```typescript
const validateVacasCount = (userCount: number, correctCount: number): boolean => {
  return userCount === correctCount;
};

const generateVacasHint = (currentCount: number, targetCount: number): string => {
  if (currentCount === 0) {
    return "¡Las vacas son muy grandes! Cuenta del 1 al 20.";
  } else if (currentCount < targetCount) {
    return `Ya has contado ${currentCount} vacas. ¡Sigue así!`;
  } else if (currentCount === targetCount) {
    return "¡Increíble! Has contado todas las vacas. ¡Eres un granjero experto!";
  } else {
    return "Intenta contar de nuevo. Las vacas son las más grandes de la granja.";
  }
};
```

### **Datos Mock para Vacas:**
```typescript
const VACAS_MOCK_DATA = {
  sessionId: "vacas_session_001",
  level: "vacas",
  currentActivity: 0,
  activities: [
    {
      id: "vacas_1",
      animals: ["🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄"],
      correctAnswer: 15,
      userAnswer: null,
      completed: false
    },
    {
      id: "vacas_2",
      animals: ["🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄", "🐄"],
      correctAnswer: 20,
      userAnswer: null,
      completed: false
    }
  ],
  achievements: [
    { id: "primer_vaca", completed: false, progress: 0 },
    { id: "contador_vacas", completed: false, progress: 0 }
  ],
  totalCounted: 0,
  accuracy: 0
};
```

---

## 🚜 **5. NIVEL 4: GRANJERO EXPERTO (PATRONES)**

### **Configuración del Nivel:**
```typescript
const GRANJERO_CONFIG = {
  title: "🚜 Granjero Experto",
  description: "Aprende patrones especiales de conteo",
  patterns: [
    { name: "de_2_en_2", sequence: [2, 4, 6, 8, 10] },
    { name: "de_5_en_5", sequence: [5, 10, 15, 20] },
    { name: "de_10_en_10", sequence: [10, 20, 30, 40, 50] }
  ],
  activities: [
    {
      id: "pattern_2_en_2",
      instruction: "Cuenta de 2 en 2: 2, 4, 6, 8, 10",
      scenario: ["🚜", "🚜", "🚜", "🚜", "🚜"],
      correctSequence: [2, 4, 6, 8, 10],
      userSequence: [],
      feedback: "¡Excelente! Has dominado el patrón de 2 en 2."
    },
    {
      id: "pattern_5_en_5",
      instruction: "Cuenta de 5 en 5: 5, 10, 15, 20",
      scenario: ["🌾", "🌾", "🌾", "🌾"],
      correctSequence: [5, 10, 15, 20],
      userSequence: [],
      feedback: "¡Perfecto! Has dominado el patrón de 5 en 5."
    }
  ],
  achievements: [
    {
      id: "patron_2_en_2",
      title: "🚜 Patrón de 2 en 2",
      requirement: 1,
      reward: "Medalla de Patrón"
    },
    {
      id: "patron_5_en_5",
      title: "🚜 Patrón de 5 en 5",
      requirement: 1,
      reward: "Medalla de Patrón Avanzado"
    },
    {
      id: "granjero_experto",
      title: "🚜 Granjero Experto",
      requirement: 1,
      reward: "Diploma de Granjero Experto"
    }
  ]
};
```

### **Lógica de Validación de Patrones:**
```typescript
const validatePattern = (userSequence: number[], correctSequence: number[]): boolean => {
  if (userSequence.length !== correctSequence.length) return false;
  return userSequence.every((num, index) => num === correctSequence[index]);
};

const generatePatternHint = (pattern: string, currentStep: number): string => {
  const hints = {
    "de_2_en_2": {
      start: "¡Aprenderás patrones especiales! Cuenta de 2 en 2.",
      counting: `Ya has contado ${currentStep} elementos. ¡Continúa el patrón!`,
      almost: "¡Casi dominas el patrón! ¡Un último esfuerzo!",
      complete: "¡Eres un granjero experto! ¡Dominas el patrón de 2 en 2!"
    },
    "de_5_en_5": {
      start: "¡Ahora contarás de 5 en 5! Es más rápido.",
      counting: `Ya has contado ${currentStep} elementos. ¡Continúa el patrón!`,
      almost: "¡Casi dominas el patrón de 5 en 5!",
      complete: "¡Increíble! Has dominado el patrón de 5 en 5."
    }
  };
  
  const patternHints = hints[pattern as keyof typeof hints];
  if (currentStep === 0) return patternHints.start;
  if (currentStep >= 4) return patternHints.complete;
  if (currentStep >= 3) return patternHints.almost;
  return patternHints.counting;
};
```

### **Datos Mock para Granjero Experto:**
```typescript
const GRANJERO_MOCK_DATA = {
  sessionId: "granjero_session_001",
  level: "granjero",
  currentActivity: 0,
  activities: [
    {
      id: "pattern_2_en_2",
      pattern: "de_2_en_2",
      correctSequence: [2, 4, 6, 8, 10],
      userSequence: [],
      completed: false
    },
    {
      id: "pattern_5_en_5",
      pattern: "de_5_en_5", 
      correctSequence: [5, 10, 15, 20],
      userSequence: [],
      completed: false
    }
  ],
  achievements: [
    { id: "patron_2_en_2", completed: false, progress: 0 },
    { id: "patron_5_en_5", completed: false, progress: 0 },
    { id: "granjero_experto", completed: false, progress: 0 }
  ],
  patternsMastered: [],
  totalPatterns: 0
};
```

---

## 🎯 **6. SISTEMA DE PROGRESIÓN Y DESBLOQUEO**

### **Lógica de Desbloqueo:**
```typescript
const FARM_PROGRESSION_LOGIC = {
  pollitos: {
    requirement: "Ninguno - Nivel inicial",
    unlockCondition: () => true,
    nextLevel: "gallinas"
  },
  gallinas: {
    requirement: "Completar nivel Pollitos (5/5 pollitos)",
    unlockCondition: (pollitosProgress: number) => pollitosProgress >= 5,
    nextLevel: "vacas"
  },
  vacas: {
    requirement: "Completar nivel Gallinas (10/10 gallinas)",
    unlockCondition: (gallinasProgress: number) => gallinasProgress >= 10,
    nextLevel: "granjero"
  },
  granjero: {
    requirement: "Completar nivel Vacas (20/20 vacas)",
    unlockCondition: (vacasProgress: number) => vacasProgress >= 20,
    nextLevel: "completado"
  }
};

const checkLevelUnlock = (currentLevel: string, progress: any): boolean => {
  const levelConfig = FARM_PROGRESSION_LOGIC[currentLevel as keyof typeof FARM_PROGRESSION_LOGIC];
  return levelConfig.unlockCondition(progress[currentLevel] || 0);
};
```

### **Sistema de Recompensas por Nivel:**
```typescript
const FARM_REWARDS = {
  pollitos: {
    achievements: [
      { id: "primer_pollito", reward: "Medalla de Pollito", icon: "🐣" },
      { id: "contador_pollitos", reward: "Cinta de Pollito Experto", icon: "🐣" }
    ],
    unlockReward: "Acceso al Corral de Gallinas"
  },
  gallinas: {
    achievements: [
      { id: "primer_gallina", reward: "Medalla de Gallina", icon: "🐔" },
      { id: "contador_gallinas", reward: "Cinta de Gallina Experta", icon: "🐔" }
    ],
    unlockReward: "Acceso al Establo de Vacas"
  },
  vacas: {
    achievements: [
      { id: "primer_vaca", reward: "Medalla de Vaca", icon: "🐄" },
      { id: "contador_vacas", reward: "Cinta de Vaca Experta", icon: "🐄" }
    ],
    unlockReward: "Acceso al Modo Granjero Experto"
  },
  granjero: {
    achievements: [
      { id: "patron_2_en_2", reward: "Medalla de Patrón", icon: "🚜" },
      { id: "patron_5_en_5", reward: "Medalla de Patrón Avanzado", icon: "🚜" },
      { id: "granjero_experto", reward: "Diploma de Granjero Experto", icon: "🚜" }
    ],
    unlockReward: "¡Eres un Granjero Experto!"
  }
};
```

---

## 🎮 **7. MECÁNICAS ESPECÍFICAS DE JUEGO**

### **Sistema de Conteo Interactivo:**
```typescript
interface Animal {
  id: string;
  type: string;
  emoji: string;
  sound: string;
  position: { x: number; y: number };
  counted: boolean;
}

const handleAnimalClick = (animal: Animal, currentCount: number): void => {
  if (!animal.counted) {
    animal.counted = true;
    currentCount++;
    playAnimalSound(animal.type);
    speak(`${currentCount}`);
    
    if (currentCount === targetCount) {
      completeLevel();
    }
  }
};

const resetAnimalCount = (animals: Animal[]): void => {
  animals.forEach(animal => {
    animal.counted = false;
  });
};
```

### **Sistema de Patrones de Conteo:**
```typescript
interface Pattern {
  name: string;
  sequence: number[];
  description: string;
  visualElements: string[];
}

const PATTERNS = {
  "de_2_en_2": {
    name: "Conteo de 2 en 2",
    sequence: [2, 4, 6, 8, 10],
    description: "Cuenta saltando de 2 en 2",
    visualElements: ["🚜", "🚜", "🚜", "🚜", "🚜"]
  },
  "de_5_en_5": {
    name: "Conteo de 5 en 5", 
    sequence: [5, 10, 15, 20],
    description: "Cuenta saltando de 5 en 5",
    visualElements: ["🌾", "🌾", "🌾", "🌾"]
  },
  "de_10_en_10": {
    name: "Conteo de 10 en 10",
    sequence: [10, 20, 30, 40, 50],
    description: "Cuenta saltando de 10 en 10",
    visualElements: ["🏠", "🏠", "🏠", "🏠", "🏠"]
  }
};

const validatePatternSequence = (userInput: number[], correctPattern: number[]): boolean => {
  return userInput.every((num, index) => num === correctPattern[index]);
};
```

### **Sistema de Feedback Específico:**
```typescript
const generateFarmFeedback = (level: string, isCorrect: boolean, count: number): string => {
  const feedbackMessages = {
    pollitos: {
      correct: `¡Excelente! Has contado ${count} pollitos correctamente. ¡Pío pío pío!`,
      incorrect: "Intenta contar de nuevo. Toca cada pollito mientras cuentas: 1, 2, 3..."
    },
    gallinas: {
      correct: `¡Perfecto! Has contado ${count} gallinas correctamente. ¡Cacareo!`,
      incorrect: "Intenta contar de nuevo. Las gallinas son más grandes que los pollitos."
    },
    vacas: {
      correct: `¡Increíble! Has contado ${count} vacas correctamente. ¡Muuu!`,
      incorrect: "Intenta contar de nuevo. Las vacas son las más grandes de la granja."
    },
    granjero: {
      correct: `¡Eres un granjero experto! Has dominado el patrón correctamente.`,
      incorrect: "Intenta seguir el patrón. Recuerda: 2, 4, 6, 8, 10..."
    }
  };
  
  const levelFeedback = feedbackMessages[level as keyof typeof feedbackMessages];
  return isCorrect ? levelFeedback.correct : levelFeedback.incorrect;
};
```

---

## 📊 **8. MÉTRICAS ESPECÍFICAS DE GRANJA**

### **Métricas de Conteo:**
```typescript
interface FarmMetrics {
  totalAnimalsCounted: number;
  accuracyByLevel: {
    pollitos: number;
    gallinas: number;
    vacas: number;
    granjero: number;
  };
  timeSpentByLevel: {
    pollitos: number;
    gallinas: number;
    vacas: number;
    granjero: number;
  };
  patternsMastered: string[];
  favoriteAnimal: string;
  mostCountedAnimal: string;
}

const calculateFarmMetrics = (sessionData: any): FarmMetrics => ({
  totalAnimalsCounted: sessionData.totalCounted || 0,
  accuracyByLevel: {
    pollitos: calculateAccuracy(sessionData.pollitosProgress),
    gallinas: calculateAccuracy(sessionData.gallinasProgress),
    vacas: calculateAccuracy(sessionData.vacasProgress),
    granjero: calculateAccuracy(sessionData.granjeroProgress)
  },
  timeSpentByLevel: {
    pollitos: sessionData.timeSpent?.pollitos || 0,
    gallinas: sessionData.timeSpent?.gallinas || 0,
    vacas: sessionData.timeSpent?.vacas || 0,
    granjero: sessionData.timeSpent?.granjero || 0
  },
  patternsMastered: sessionData.patternsMastered || [],
  favoriteAnimal: determineFavoriteAnimal(sessionData),
  mostCountedAnimal: determineMostCountedAnimal(sessionData)
});
```

### **Métricas de Patrones:**
```typescript
interface PatternMetrics {
  patternAccuracy: {
    "de_2_en_2": number;
    "de_5_en_5": number;
    "de_10_en_10": number;
  };
  patternSpeed: {
    "de_2_en_2": number;
    "de_5_en_5": number;
    "de_10_en_10": number;
  };
  patternsCompleted: string[];
  totalPatterns: number;
}

const calculatePatternMetrics = (sessionData: any): PatternMetrics => ({
  patternAccuracy: {
    "de_2_en_2": calculatePatternAccuracy(sessionData, "de_2_en_2"),
    "de_5_en_5": calculatePatternAccuracy(sessionData, "de_5_en_5"),
    "de_10_en_10": calculatePatternAccuracy(sessionData, "de_10_en_10")
  },
  patternSpeed: {
    "de_2_en_2": calculatePatternSpeed(sessionData, "de_2_en_2"),
    "de_5_en_5": calculatePatternSpeed(sessionData, "de_5_en_5"),
    "de_10_en_10": calculatePatternSpeed(sessionData, "de_10_en_10")
  },
  patternsCompleted: sessionData.patternsCompleted || [],
  totalPatterns: sessionData.patternsCompleted?.length || 0
});
```

---

## 🎨 **9. ELEMENTOS VISUALES ESPECÍFICOS**

### **Iconografía de Animales:**
```typescript
const FARM_ICONS = {
  pollitos: {
    primary: "🐣",
    secondary: "🐤",
    background: "linear-gradient(135deg, #FFD700, #FFA500)",
    sound: "pío pío"
  },
  gallinas: {
    primary: "🐔",
    secondary: "🐓",
    background: "linear-gradient(135deg, #FF6B6B, #FF4500)",
    sound: "cacareo"
  },
  vacas: {
    primary: "🐄",
    secondary: "🐮",
    background: "linear-gradient(135deg, #8B4513, #A0522D)",
    sound: "muuu"
  },
  granjero: {
    primary: "🚜",
    secondary: "🌾",
    background: "linear-gradient(135deg, #2E8B57, #32CD32)",
    sound: "¡hola!"
  }
};
```

### **Animaciones Específicas:**
```css
/* Animación de conteo de pollitos */
.pollito-counting {
  animation: pollitoBounce 0.5s ease-in-out;
}

@keyframes pollitoBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* Animación de conteo de gallinas */
.gallina-counting {
  animation: gallinaWaddle 0.5s ease-in-out;
}

@keyframes gallinaWaddle {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}

/* Animación de conteo de vacas */
.vaca-counting {
  animation: vacaMoo 0.5s ease-in-out;
}

@keyframes vacaMoo {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

---

## 🎵 **10. SISTEMA DE SONIDOS ESPECÍFICOS**

### **Sonidos de Animales:**
```typescript
const ANIMAL_SOUNDS = {
  pollito: {
    frequency: 800,
    duration: 0.3,
    pattern: "pío pío",
    volume: 0.7
  },
  gallina: {
    frequency: 600,
    duration: 0.4,
    pattern: "cacareo",
    volume: 0.8
  },
  vaca: {
    frequency: 200,
    duration: 0.6,
    pattern: "muuu",
    volume: 0.9
  },
  granjero: {
    frequency: 400,
    duration: 0.5,
    pattern: "¡hola!",
    volume: 0.8
  }
};

const playAnimalSound = (animalType: string): void => {
  const sound = ANIMAL_SOUNDS[animalType as keyof typeof ANIMAL_SOUNDS];
  if (sound) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(sound.volume, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + sound.duration);
    
    speak(sound.pattern);
  }
};
```

---

## 📋 **RESUMEN DE DINÁMICAS ESPECÍFICAS**

### **✅ Elementos Únicos de Granja Contador:**

1. **Progresión por Animales** - Pollitos → Gallinas → Vacas → Granjero Experto
2. **Conteo Interactivo** - Tocar animales para contar con feedback inmediato
3. **Sonidos de Animales** - Feedback auditivo específico por tipo de animal
4. **Patrones de Conteo** - 2 en 2, 5 en 5, 10 en 10
5. **Temática de Granja** - Colores, iconos y narrativa específicos
6. **Sistema de Desbloqueo** - Progresión basada en completar niveles anteriores
7. **Métricas de Animales** - Conteo específico por tipo de animal
8. **Animaciones de Animales** - Movimientos únicos por tipo
9. **Feedback Temático** - Mensajes específicos por animal
10. **Recompensas de Granja** - Medallas y cintas temáticas

### **🎯 Características NO Reutilizables:**

- **Temática de Granja** - Específica para este juego
- **Progresión por Animales** - Única para conteo con animales
- **Sonidos de Animales** - Específicos de la granja
- **Patrones de Conteo** - Específicos para OA1 matemáticas
- **Iconografía de Animales** - Única para este contexto
- **Narrativa del Granjero** - Específica de la granja
- **Métricas de Animales** - Específicas del conteo con animales
- **Animaciones de Animales** - Únicas por tipo de animal
- **Feedback de Animales** - Específico por tipo de animal
- **Recompensas de Granja** - Temáticas específicas

### **📚 Aplicabilidad Limitada:**

Estas dinámicas son específicas para el juego "Granja Contador" y no se pueden reutilizar directamente en otras experiencias, ya que están diseñadas específicamente para:

- **Conteo progresivo** con temática de granja
- **Patrones numéricos** del OA1 de matemáticas
- **Feedback auditivo** específico de animales
- **Progresión educativa** basada en animales de granja

La documentación de estas dinámicas sirve como referencia para entender cómo implementar mecánicas específicas únicas para cada experiencia gamificada. 