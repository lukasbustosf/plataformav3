# DOCUMENTACIÓN EXPERIENCIA 4 - EL JARDÍN MÁGICO PERSONALIZADO
## PARTE 2: DINÁMICAS ESPECÍFICAS NO REUTILIZABLES

---

## 🎯 **CONCEPTO CENTRAL DEL JARDÍN MÁGICO**

### **Filosofía del Aprendizaje Adaptativo**
El Jardín Mágico implementa un sistema de **aprendizaje adaptativo** donde:
- **Personalización:** Cada niño crea su jardín único
- **Progresión Individual:** El ritmo se adapta al niño
- **Feedback Inmediato:** Respuesta instantánea a cada acción
- **Motivación Intrínseca:** El cuidado del jardín motiva el aprendizaje

### **Mecánicas Principales**
1. **Plantación de Semillas** → Conteo básico
2. **Riego de Flores** → Secuencias numéricas
3. **Conteo de Pétalos** → Números específicos
4. **Creación de Patrones** → Patrones numéricos
5. **Crecimiento del Jardín** → Progresión visual

---

## 🌱 **1. SISTEMA DE PLANTACIÓN Y CRECIMIENTO**

### **Configuración de Semillas y Flores**
```typescript
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

const SEED_TYPES = {
  basic: {
    id: "basic_rose",
    name: "Rosa Básica",
    icon: "🌹",
    color: "#F44336",
    growthTime: 3000,
    petals: 5,
    rarity: "common",
    unlockLevel: 1
  },
  counting: {
    id: "counting_daisy",
    name: "Margarita Contadora",
    icon: "🌼",
    color: "#FFEB3B",
    growthTime: 5000,
    petals: 8,
    rarity: "common",
    unlockLevel: 2
  },
  pattern: {
    id: "pattern_tulip",
    name: "Tulipán Patrón",
    icon: "🌷",
    color: "#9C27B0",
    growthTime: 7000,
    petals: 6,
    rarity: "rare",
    unlockLevel: 3
  },
  magic: {
    id: "magic_orchid",
    name: "Orquídea Mágica",
    icon: "🌸",
    color: "#E91E63",
    growthTime: 10000,
    petals: 10,
    rarity: "epic",
    unlockLevel: 5
  }
};
```

### **Lógica de Crecimiento**
```typescript
const calculateGrowthStage = (plantedAt: Date, wateredAt?: Date): Flower['growthStage'] => {
  const now = new Date();
  const timeSincePlanting = now.getTime() - plantedAt.getTime();
  const timeSinceWatering = wateredAt ? now.getTime() - wateredAt.getTime() : 0;
  
  if (!wateredAt) return "seed";
  if (timeSinceWatering < 2000) return "sprout";
  if (timeSinceWatering < 5000) return "bud";
  return "flower";
};

const calculatePetals = (seed: Seed, growthStage: Flower['growthStage']): number => {
  if (growthStage === "flower") {
    return seed.petals;
  }
  return Math.floor(seed.petals * 0.3);
};
```

---

## 💧 **2. SISTEMA DE RIEGO Y CUIDADO**

### **Mecánica de Riego**
```typescript
interface WateringSystem {
  waterLevel: number;
  maxWaterLevel: number;
  refillRate: number;
  lastRefill: Date;
}

const WATERING_CONFIG = {
  maxWaterLevel: 10,
  refillRate: 1, // por minuto
  waterPerFlower: 1,
  growthAcceleration: 2.0 // 2x más rápido
};

const handleWatering = (flower: Flower, wateringSystem: WateringSystem) => {
  if (wateringSystem.waterLevel < WATERING_CONFIG.waterPerFlower) {
    return { success: false, message: "No hay suficiente agua" };
  }
  
  wateringSystem.waterLevel -= WATERING_CONFIG.waterPerFlower;
  flower.isWatered = true;
  flower.wateredAt = new Date();
  
  return { success: true, message: "¡Flor regada!" };
};
```

### **Efectos del Riego**
```typescript
const getWateringEffects = (flower: Flower) => {
  const effects = [];
  
  if (flower.growthStage === "seed") {
    effects.push("🌱 La semilla comienza a brotar");
  } else if (flower.growthStage === "sprout") {
    effects.push("🌿 El brote crece más alto");
  } else if (flower.growthStage === "bud") {
    effects.push("🌸 El capullo se abre");
  } else {
    effects.push("✨ La flor brilla con magia");
  }
  
  return effects;
};
```

---

## 🔢 **3. SISTEMA DE CONTEO ADAPTATIVO**

### **Dificultad Adaptativa**
```typescript
interface AdaptiveCounting {
  currentLevel: number;
  maxNumber: number;
  patternComplexity: number;
  timeLimit: number;
  successRate: number;
}

const calculateAdaptiveDifficulty = (userPerformance: AdaptiveCounting) => {
  const { successRate, currentLevel } = userPerformance;
  
  if (successRate > 0.8) {
    // Aumentar dificultad
    return {
      maxNumber: Math.min(currentLevel * 2, 100),
      patternComplexity: Math.min(currentLevel / 2, 5),
      timeLimit: Math.max(30 - currentLevel, 10)
    };
  } else if (successRate < 0.6) {
    // Reducir dificultad
    return {
      maxNumber: Math.max(currentLevel, 5),
      patternComplexity: Math.max(currentLevel / 4, 1),
      timeLimit: Math.min(60 + currentLevel, 120)
    };
  }
  
  // Mantener dificultad actual
  return {
    maxNumber: currentLevel * 1.5,
    patternComplexity: currentLevel / 3,
    timeLimit: 45
  };
};
```

### **Tipos de Conteo**
```typescript
enum CountingType {
  SEQUENTIAL = "sequential",      // 1, 2, 3, 4, 5
  SKIP_COUNTING = "skip_counting", // 2, 4, 6, 8, 10
  BACKWARD = "backward",         // 5, 4, 3, 2, 1
  PATTERN = "pattern",           // Patrones específicos
  GROUPING = "grouping"          // Agrupar por números
}

const COUNTING_ACTIVITIES = {
  sequential: {
    instruction: "Cuenta las flores en orden",
    pattern: [1, 2, 3, 4, 5],
    difficulty: 1
  },
  skip_counting: {
    instruction: "Cuenta de dos en dos",
    pattern: [2, 4, 6, 8, 10],
    difficulty: 2
  },
  backward: {
    instruction: "Cuenta hacia atrás",
    pattern: [5, 4, 3, 2, 1],
    difficulty: 2
  },
  pattern: {
    instruction: "Sigue el patrón mágico",
    pattern: [1, 3, 5, 7, 9],
    difficulty: 3
  },
  grouping: {
    instruction: "Agrupa las flores por colores",
    pattern: [3, 3, 4, 4, 5],
    difficulty: 3
  }
};
```

---

## 🎨 **4. SISTEMA DE PATRONES MÁGICOS**

### **Creación de Patrones**
```typescript
interface MagicPattern {
  id: string;
  name: string;
  description: string;
  flowerArrangement: FlowerPosition[];
  numberSequence: number[];
  difficulty: number;
  reward: string;
}

interface FlowerPosition {
  x: number;
  y: number;
  flowerType: string;
  number: number;
}

const MAGIC_PATTERNS = {
  spiral: {
    id: "spiral_pattern",
    name: "Patrón Espiral",
    description: "Organiza las flores en espiral",
    flowerArrangement: [
      { x: 2, y: 2, flowerType: "rose", number: 1 },
      { x: 3, y: 2, flowerType: "daisy", number: 2 },
      { x: 3, y: 3, flowerType: "tulip", number: 3 },
      { x: 2, y: 3, flowerType: "orchid", number: 4 },
      { x: 1, y: 3, flowerType: "rose", number: 5 }
    ],
    numberSequence: [1, 2, 3, 4, 5],
    difficulty: 1,
    reward: "Semilla Dorada"
  },
  rainbow: {
    id: "rainbow_pattern",
    name: "Patrón Arcoíris",
    description: "Crea un arcoíris de flores",
    flowerArrangement: [
      { x: 1, y: 1, flowerType: "red", number: 2 },
      { x: 2, y: 1, flowerType: "orange", number: 4 },
      { x: 3, y: 1, flowerType: "yellow", number: 6 },
      { x: 4, y: 1, flowerType: "green", number: 8 },
      { x: 5, y: 1, flowerType: "blue", number: 10 }
    ],
    numberSequence: [2, 4, 6, 8, 10],
    difficulty: 2,
    reward: "Regadera Mágica"
  },
  star: {
    id: "star_pattern",
    name: "Patrón Estrella",
    description: "Forma una estrella con flores",
    flowerArrangement: [
      { x: 3, y: 1, flowerType: "magic", number: 1 },
      { x: 2, y: 2, flowerType: "magic", number: 3 },
      { x: 4, y: 2, flowerType: "magic", number: 5 },
      { x: 1, y: 3, flowerType: "magic", number: 7 },
      { x: 5, y: 3, flowerType: "magic", number: 9 }
    ],
    numberSequence: [1, 3, 5, 7, 9],
    difficulty: 3,
    reward: "Varita Mágica"
  }
};
```

### **Validación de Patrones**
```typescript
const validatePattern = (placedFlowers: Flower[], targetPattern: MagicPattern) => {
  const placedPositions = placedFlowers.map(f => ({ x: f.position.x, y: f.position.y }));
  const targetPositions = targetPattern.flowerArrangement.map(f => ({ x: f.x, y: f.y }));
  
  // Verificar posiciones
  const positionMatch = targetPositions.every(target => 
    placedPositions.some(placed => placed.x === target.x && placed.y === target.y)
  );
  
  // Verificar secuencia numérica
  const placedNumbers = placedFlowers.map(f => f.petals).sort((a, b) => a - b);
  const targetNumbers = targetPattern.numberSequence.sort((a, b) => a - b);
  const numberMatch = JSON.stringify(placedNumbers) === JSON.stringify(targetNumbers);
  
  return positionMatch && numberMatch;
};
```

---

## ✨ **5. SISTEMA DE MAGIA Y PODERES**

### **Poderes Mágicos**
```typescript
interface MagicPower {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  effect: string;
  unlockLevel: number;
}

const MAGIC_POWERS = {
  instant_growth: {
    id: "instant_growth",
    name: "Crecimiento Instantáneo",
    description: "Hace crecer las flores inmediatamente",
    icon: "⚡",
    cost: 50,
    effect: "growth_acceleration",
    unlockLevel: 3
  },
  water_multiply: {
    id: "water_multiply",
    name: "Multiplicador de Agua",
    description: "Riega todas las flores de una vez",
    icon: "💧",
    cost: 30,
    effect: "mass_watering",
    unlockLevel: 2
  },
  pattern_reveal: {
    id: "pattern_reveal",
    name: "Revelar Patrón",
    description: "Muestra el patrón correcto",
    icon: "🔍",
    cost: 40,
    effect: "pattern_hint",
    unlockLevel: 4
  },
  magic_fertilizer: {
    id: "magic_fertilizer",
    name: "Fertilizante Mágico",
    description: "Mejora la calidad de las flores",
    icon: "🌿",
    cost: 60,
    effect: "quality_boost",
    unlockLevel: 5
  }
};
```

### **Efectos Mágicos**
```typescript
const applyMagicEffect = (power: MagicPower, garden: GardenState) => {
  switch (power.effect) {
    case "growth_acceleration":
      garden.flowers.forEach(flower => {
        if (flower.growthStage !== "flower") {
          flower.growthStage = "flower";
          flower.petals = SEED_TYPES[flower.seedId].petals;
        }
      });
      break;
      
    case "mass_watering":
      garden.flowers.forEach(flower => {
        flower.isWatered = true;
        flower.wateredAt = new Date();
      });
      break;
      
    case "pattern_hint":
      return {
        type: "hint",
        message: "Mira el patrón en el cielo",
        pattern: getCurrentPatternHint()
      };
      
    case "quality_boost":
      garden.flowers.forEach(flower => {
        flower.petals = Math.min(flower.petals * 1.5, 20);
      });
      break;
  }
};
```

---

## 🌟 **6. SISTEMA DE LOGROS ESPECÍFICOS DEL JARDÍN**

### **Logros de Crecimiento**
```typescript
const GARDEN_SPECIFIC_ACHIEVEMENTS = [
  {
    id: 'first_sprout',
    title: '🌱 Primer Brote',
    description: 'Viste crecer tu primera semilla',
    requirement: 1,
    reward: 'Semilla Dorada',
    type: 'growth'
  },
  {
    id: 'flower_collector',
    title: '🌸 Coleccionista de Flores',
    description: 'Tienes 5 tipos diferentes de flores',
    requirement: 5,
    reward: 'Jardín Mágico',
    type: 'variety'
  },
  {
    id: 'pattern_master',
    title: '🎨 Maestro de Patrones',
    description: 'Completaste 3 patrones mágicos',
    requirement: 3,
    reward: 'Varita Mágica',
    type: 'pattern'
  },
  {
    id: 'water_conservation',
    title: '💧 Conservador de Agua',
    description: 'Regaste 10 flores sin desperdiciar',
    requirement: 10,
    reward: 'Regadera Infinita',
    type: 'efficiency'
  },
  {
    id: 'magic_garden',
    title: '✨ Jardín Mágico',
    description: 'Tienes un jardín completamente florecido',
    requirement: 20,
    reward: 'Corona de Jardinero',
    type: 'completion'
  }
];
```

### **Logros de Conteo**
```typescript
const COUNTING_ACHIEVEMENTS = [
  {
    id: 'petal_counter',
    title: '🔢 Contador de Pétalos',
    description: 'Contaste correctamente 10 pétalos',
    requirement: 10,
    reward: 'Lupa Mágica',
    type: 'counting'
  },
  {
    id: 'pattern_counter',
    title: '📊 Contador de Patrones',
    description: 'Identificaste 5 patrones numéricos',
    requirement: 5,
    reward: 'Cristal de Patrones',
    type: 'patterns'
  },
  {
    id: 'speed_counter',
    title: '⚡ Contador Veloz',
    description: 'Contaste 20 flores en menos de 30 segundos',
    requirement: 20,
    reward: 'Reloj Mágico',
    type: 'speed'
  }
];
```

---

## 🎯 **7. SISTEMA DE PROGRESIÓN ADAPTATIVA**

### **Niveles del Jardín**
```typescript
interface GardenLevel {
  level: number;
  name: string;
  description: string;
  requirements: {
    flowersPlanted: number;
    patternsCompleted: number;
    countingAccuracy: number;
  };
  rewards: {
    newSeeds: string[];
    newTools: string[];
    newPowers: string[];
  };
  difficulty: {
    maxNumber: number;
    patternComplexity: number;
    timeLimit: number;
  };
}

const GARDEN_LEVELS = [
  {
    level: 1,
    name: "Jardinero Novato",
    description: "Aprende los básicos del jardín",
    requirements: {
      flowersPlanted: 3,
      patternsCompleted: 0,
      countingAccuracy: 70
    },
    rewards: {
      newSeeds: ["basic_rose"],
      newTools: ["watering_can"],
      newPowers: []
    },
    difficulty: {
      maxNumber: 5,
      patternComplexity: 1,
      timeLimit: 60
    }
  },
  {
    level: 2,
    name: "Cultivador",
    description: "Domina el arte de plantar",
    requirements: {
      flowersPlanted: 8,
      patternsCompleted: 1,
      countingAccuracy: 80
    },
    rewards: {
      newSeeds: ["counting_daisy"],
      newTools: ["magic_watering_can"],
      newPowers: ["water_multiply"]
    },
    difficulty: {
      maxNumber: 10,
      patternComplexity: 2,
      timeLimit: 45
    }
  },
  {
    level: 3,
    name: "Patrón Mágico",
    description: "Crea patrones hermosos",
    requirements: {
      flowersPlanted: 15,
      patternsCompleted: 3,
      countingAccuracy: 85
    },
    rewards: {
      newSeeds: ["pattern_tulip"],
      newTools: ["magic_wand"],
      newPowers: ["pattern_reveal"]
    },
    difficulty: {
      maxNumber: 15,
      patternComplexity: 3,
      timeLimit: 30
    }
  }
];
```

### **Adaptación de Dificultad**
```typescript
const adaptDifficulty = (userPerformance: UserPerformance, currentLevel: GardenLevel) => {
  const { successRate, averageTime, patternAccuracy } = userPerformance;
  
  let newDifficulty = { ...currentLevel.difficulty };
  
  // Ajustar basado en tasa de éxito
  if (successRate > 0.9) {
    newDifficulty.maxNumber = Math.min(newDifficulty.maxNumber + 2, 100);
    newDifficulty.patternComplexity = Math.min(newDifficulty.patternComplexity + 1, 5);
  } else if (successRate < 0.7) {
    newDifficulty.maxNumber = Math.max(newDifficulty.maxNumber - 1, 3);
    newDifficulty.patternComplexity = Math.max(newDifficulty.patternComplexity - 1, 1);
  }
  
  // Ajustar basado en tiempo
  if (averageTime < currentLevel.difficulty.timeLimit * 0.7) {
    newDifficulty.timeLimit = Math.max(newDifficulty.timeLimit - 5, 15);
  } else if (averageTime > currentLevel.difficulty.timeLimit * 1.3) {
    newDifficulty.timeLimit = Math.min(newDifficulty.timeLimit + 5, 90);
  }
  
  return newDifficulty;
};
```

---

## 📊 **8. MÉTRICAS ESPECÍFICAS DEL JARDÍN**

### **Métricas de Crecimiento**
```typescript
interface GardenMetrics {
  flowersPlanted: number;
  flowersWatered: number;
  patternsCompleted: number;
  countingAccuracy: number;
  averageGrowthTime: number;
  waterEfficiency: number;
  patternComplexity: number;
  magicPowersUsed: number;
}

const calculateGardenMetrics = (gardenState: GardenState): GardenMetrics => ({
  flowersPlanted: gardenState.flowers.length,
  flowersWatered: gardenState.flowers.filter(f => f.isWatered).length,
  patternsCompleted: gardenState.completedPatterns.length,
  countingAccuracy: gardenState.correctCounts / gardenState.totalCounts * 100,
  averageGrowthTime: calculateAverageGrowthTime(gardenState.flowers),
  waterEfficiency: calculateWaterEfficiency(gardenState),
  patternComplexity: calculatePatternComplexity(gardenState.completedPatterns),
  magicPowersUsed: gardenState.magicPowersUsed
});
```

### **Métricas de Aprendizaje**
```typescript
interface LearningMetrics {
  numberRecognition: number;
  patternRecognition: number;
  sequentialCounting: number;
  skipCounting: number;
  backwardCounting: number;
  groupingSkills: number;
}

const calculateLearningMetrics = (userActivity: UserActivity): LearningMetrics => ({
  numberRecognition: calculateNumberRecognition(userActivity),
  patternRecognition: calculatePatternRecognition(userActivity),
  sequentialCounting: calculateSequentialCounting(userActivity),
  skipCounting: calculateSkipCounting(userActivity),
  backwardCounting: calculateBackwardCounting(userActivity),
  groupingSkills: calculateGroupingSkills(userActivity)
});
```

---

## 🎨 **9. ELEMENTOS VISUALES ESPECÍFICOS**

### **Animaciones de Flores**
```typescript
const FLOWER_ANIMATIONS = {
  planting: {
    duration: 1000,
    keyframes: [
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1.2)', opacity: 0.8 },
      { transform: 'scale(1)', opacity: 1 }
    ]
  },
  watering: {
    duration: 500,
    keyframes: [
      { transform: 'translateY(-10px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ]
  },
  growing: {
    duration: 2000,
    keyframes: [
      { transform: 'scale(0.5)', opacity: 0.5 },
      { transform: 'scale(1)', opacity: 1 }
    ]
  },
  blooming: {
    duration: 1500,
    keyframes: [
      { transform: 'rotate(0deg)', opacity: 0.3 },
      { transform: 'rotate(360deg)', opacity: 1 }
    ]
  }
};
```

### **Efectos Mágicos**
```typescript
const MAGIC_EFFECTS = {
  sparkle: {
    duration: 2000,
    keyframes: [
      { transform: 'scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'scale(1.5) rotate(180deg)', opacity: 0.8 },
      { transform: 'scale(1) rotate(360deg)', opacity: 1 }
    ]
  },
  glow: {
    duration: 1000,
    keyframes: [
      { boxShadow: '0 0 5px rgba(255,255,255,0.5)' },
      { boxShadow: '0 0 20px rgba(255,255,255,1)' },
      { boxShadow: '0 0 5px rgba(255,255,255,0.5)' }
    ]
  },
  float: {
    duration: 3000,
    keyframes: [
      { transform: 'translateY(0px)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0px)' }
    ]
  }
};
```

---

## 🎵 **10. SONIDOS ESPECÍFICOS DEL JARDÍN**

### **Sonidos de Naturaleza**
```typescript
const GARDEN_SOUNDS = {
  seed_planting: {
    frequency: 400,
    duration: 0.3,
    description: "Sonido de semilla plantándose"
  },
  water_dropping: {
    frequency: 600,
    duration: 0.2,
    description: "Sonido de gota de agua"
  },
  flower_growing: {
    frequency: 300,
    duration: 1.0,
    description: "Sonido de crecimiento"
  },
  magic_sparkle: {
    frequency: 800,
    duration: 0.5,
    description: "Sonido mágico"
  },
  achievement_unlock: {
    frequency: 523,
    duration: 0.6,
    description: "Sonido de logro"
  },
  pattern_complete: {
    frequency: 659,
    duration: 0.8,
    description: "Sonido de patrón completado"
  }
};
```

---

## 📋 **RESUMEN DE DINÁMICAS ESPECÍFICAS**

### ✅ **Elementos Únicos del Jardín:**
1. **Sistema de Plantación y Crecimiento** - Lógica específica de semillas y flores
2. **Sistema de Riego** - Mecánica de agua y efectos de crecimiento
3. **Conteo Adaptativo** - Dificultad que se ajusta al rendimiento
4. **Patrones Mágicos** - Creación y validación de patrones florales
5. **Poderes Mágicos** - Efectos especiales y habilidades
6. **Logros del Jardín** - Logros específicos de crecimiento y conteo
7. **Progresión Adaptativa** - Niveles que se ajustan al niño
8. **Métricas del Jardín** - Medición específica de crecimiento y aprendizaje
9. **Animaciones de Flores** - Efectos visuales únicos del jardín
10. **Sonidos de Naturaleza** - Audio específico del entorno natural

### 🎯 **Características Específicas:**
- **Temática Natural:** Flores, jardín, crecimiento
- **Adaptación Individual:** Ritmo personalizado
- **Crecimiento Visual:** Progresión tangible
- **Magia y Fantasía:** Elementos mágicos motivadores
- **Cuidado Responsable:** Concepto de responsabilidad

---

*Esta documentación define las dinámicas específicas del Jardín Mágico que no son reutilizables en otras experiencias, manteniendo la coherencia con la temática y objetivos educativos específicos.* 