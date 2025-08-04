# DOCUMENTACIÓN EXPERIENCIA 4 - EL JARDÍN MÁGICO PERSONALIZADO
## PARTE 1: ELEMENTOS UX/UI ESTÁNDARIZABLES

---

## 🎯 **CONTEXTO DE LA EXPERIENCIA**

**Nombre:** El Jardín Mágico Personalizado  
**Tipo:** Adaptive Learning  
**OA:** MA01OA01 - Contar números del 0 al 100  
**Enfoque:** Aprendizaje adaptativo con personalización individual  
**Público:** Niños de 6-7 años  

---

## 🎨 **1. SISTEMA DE BIENVENIDA MULTI-ETAPA**

### **Configuración de Pasos de Bienvenida**
```typescript
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
```

### **Características del Sistema de Bienvenida**
- **Duración:** 4 pasos progresivos
- **Interactividad:** Botones de "Siguiente" y "Saltar"
- **Personalización:** Selección de colores y flores preferidas
- **Voz:** Narración por Hada de los Números
- **Animaciones:** Transiciones suaves entre pasos

---

## 🔊 **2. SISTEMA DE VOZ Y AUDIO**

### **Función de Habla Principal**
```typescript
const speak = useCallback((text: string) => {
  if (speechEnabled && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    utterance.pitch = 1.1; // Voz más aguda para Hada
    window.speechSynthesis.speak(utterance);
  }
}, [speechEnabled]);
```

### **Sonidos Específicos del Jardín**
```typescript
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
```

### **Feedback de Conteo**
```typescript
const playCountFeedback = useCallback((isCorrect: boolean) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (isCorrect) {
    // Melodía ascendente para correcto
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
  } else {
    // Tono bajo para incorrecto
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  }

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}, []);
```

---

## 🎨 **3. PALETA DE COLORES Y TEMA VISUAL**

### **Variables CSS del Jardín**
```css
:root {
  /* Colores principales del jardín */
  --garden-primary: #4CAF50;
  --garden-secondary: #8BC34A;
  --garden-accent: #FF9800;
  --garden-light: #C8E6C9;
  --garden-dark: #2E7D32;
  
  /* Colores de flores */
  --flower-red: #F44336;
  --flower-blue: #2196F3;
  --flower-yellow: #FFEB3B;
  --flower-purple: #9C27B0;
  --flower-pink: #E91E63;
  
  /* Gradientes del jardín */
  --garden-gradient: linear-gradient(135deg, #4CAF50, #8BC34A);
  --flower-gradient: linear-gradient(135deg, #FF9800, #FFEB3B);
  --magic-gradient: linear-gradient(135deg, #9C27B0, #E91E63);
  
  /* Sombras y efectos */
  --garden-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
  --flower-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
  --magic-shadow: 0 0 20px rgba(156, 39, 176, 0.6);
}
```

### **Tema de Componentes**
```css
/* Contenedor principal del jardín */
.garden-container {
  background: var(--garden-gradient);
  border-radius: 20px;
  box-shadow: var(--garden-shadow);
  padding: 2rem;
  min-height: 100vh;
}

/* Elementos de flores */
.flower-element {
  background: var(--flower-gradient);
  border-radius: 50%;
  box-shadow: var(--flower-shadow);
  transition: all 0.3s ease;
}

/* Efectos mágicos */
.magic-effect {
  background: var(--magic-gradient);
  box-shadow: var(--magic-shadow);
  animation: sparkle 2s infinite;
}
```

---

## 📋 **4. SISTEMA DE LOGROS Y CHECKLIST**

### **Configuración de Logros del Jardín**
```typescript
interface GardenAchievement {
  id: string;
  title: string;
  description: string;
  requirement: number;
  reward: string;
  unlocked: boolean;
  icon: string;
}

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
```

### **Sistema de Checklist Visual**
```typescript
const GARDEN_CHECKLIST = [
  {
    id: 'plant_seeds',
    title: 'Plantar Semillas',
    description: 'Coloca semillas en tu jardín',
    completed: false,
    icon: '🌱'
  },
  {
    id: 'water_flowers',
    title: 'Regar Flores',
    description: 'Cuida tus flores con agua',
    completed: false,
    icon: '💧'
  },
  {
    id: 'count_petals',
    title: 'Contar Pétalos',
    description: 'Cuenta los pétalos de cada flor',
    completed: false,
    icon: '🌸'
  },
  {
    id: 'arrange_patterns',
    title: 'Crear Patrones',
    description: 'Organiza flores en patrones',
    completed: false,
    icon: '🎨'
  }
];
```

---

## 💡 **5. SISTEMA DE PISTAS DINÁMICAS**

### **Generación de Pistas Contextuales**
```typescript
const generateGardenHint = useCallback(() => {
  if (!gardenState) return "¡Empieza plantando tu primera semilla!";
  
  const plantedFlowers = gardenState.flowers.length;
  const wateredFlowers = gardenState.flowers.filter(f => f.watered).length;
  
  if (plantedFlowers === 0) {
    return "🌱 ¡Planta tu primera semilla! Toca el suelo para comenzar tu jardín.";
  }
  
  if (wateredFlowers < plantedFlowers) {
    return `💧 Riega tus flores para que crezcan. Tienes ${plantedFlowers} flores plantadas y ${wateredFlowers} regadas.`;
  }
  
  if (plantedFlowers < 5) {
    return `🌸 ¡Excelente! Ya tienes ${plantedFlowers} flores. Planta más para crear un jardín hermoso.`;
  }
  
  return "✨ ¡Tu jardín está floreciendo! Ahora cuenta los pétalos de cada flor.";
}, [gardenState]);
```

### **Pistas Específicas por Actividad**
```typescript
const ACTIVITY_HINTS = {
  planting: "Toca el suelo para plantar una semilla",
  watering: "Toca las flores para regarlas",
  counting: "Cuenta los pétalos de cada flor",
  patterns: "Organiza las flores en grupos de números",
  magic: "Usa la varita mágica para crear patrones"
};
```

---

## 📊 **6. SISTEMA DE REPORTES DETALLADOS**

### **Reporte para Niños**
```typescript
interface ChildGardenReport {
  totalFlowers: number;
  gardenLevel: number;
  achievementsUnlocked: number;
  timeSpent: number;
  accuracy: number;
  nextChallenge: string;
  gardenTheme: string;
}

const generateChildGardenReport = (sessionData: any): ChildGardenReport => ({
  totalFlowers: sessionData.flowersPlanted,
  gardenLevel: Math.floor(sessionData.flowersPlanted / 5) + 1,
  achievementsUnlocked: sessionData.achievements.length,
  timeSpent: sessionData.timeSpent,
  accuracy: sessionData.countingAccuracy,
  nextChallenge: "Planta 5 flores más para desbloquear nuevas semillas",
  gardenTheme: sessionData.selectedTheme
});
```

### **Reporte para Padres**
```typescript
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

const generateParentGardenReport = (sessionData: any): ParentGardenReport => ({
  skills: {
    counting: Math.min((sessionData.flowersPlanted / 20) * 100, 100),
    patternRecognition: Math.min((sessionData.patternsCreated / 10) * 100, 100),
    fineMotor: Math.min((sessionData.plantingAccuracy / 100) * 100, 100),
    creativity: Math.min((sessionData.uniquePatterns / 5) * 100, 100)
  },
  recommendations: [
    "Practica contando objetos en casa",
    "Crea patrones con juguetes",
    "Visita jardines para observar flores"
  ],
  activities: [
    "Contar escalones al subir",
    "Organizar juguetes por colores",
    "Plantar semillas reales"
  ],
  gardenProgress: {
    flowersPlanted: sessionData.flowersPlanted,
    patternsCreated: sessionData.patternsCreated,
    timeSpent: sessionData.timeSpent
  }
});
```

### **Reporte para Docentes**
```typescript
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

const generateTeacherGardenReport = (sessionData: any): TeacherGardenReport => ({
  studentInfo: {
    name: sessionData.studentName,
    grade: "1° Básico",
    oa: "MA01OA01",
    gardenTheme: sessionData.selectedTheme
  },
  academicProgress: {
    oaMastery: Math.min((sessionData.flowersPlanted / 20) * 100, 100),
    skillDevelopment: Math.min((sessionData.patternsCreated / 10) * 100, 100),
    engagement: Math.min((sessionData.timeSpent / 30) * 100, 100),
    creativity: Math.min((sessionData.uniquePatterns / 5) * 100, 100)
  },
  recommendations: [
    "Reforzar conteo de objetos en grupos",
    "Practicar patrones numéricos",
    "Estimular creatividad en arreglos"
  ],
  gardenMetrics: {
    totalFlowers: sessionData.flowersPlanted,
    patternsCreated: sessionData.patternsCreated,
    countingAccuracy: sessionData.countingAccuracy,
    timeEngagement: sessionData.timeSpent
  }
});
```

---

## 🎮 **7. CONTROLES LATERALES Y HERRAMIENTAS**

### **Panel de Herramientas del Jardín**
```typescript
const GARDEN_TOOLS = [
  {
    id: 'seeds',
    name: 'Semillas',
    icon: '🌱',
    description: 'Planta nuevas flores',
    unlocked: true
  },
  {
    id: 'water',
    name: 'Regadera',
    icon: '💧',
    description: 'Riega tus flores',
    unlocked: true
  },
  {
    id: 'magic_wand',
    name: 'Varita Mágica',
    icon: '✨',
    description: 'Crea patrones mágicos',
    unlocked: false
  },
  {
    id: 'fertilizer',
    name: 'Fertilizante',
    icon: '🌿',
    description: 'Acelera el crecimiento',
    unlocked: false
  }
];
```

### **Panel de Información del Jardín**
```typescript
const GARDEN_INFO = {
  flowersPlanted: 0,
  flowersWatered: 0,
  patternsCreated: 0,
  gardenLevel: 1,
  experiencePoints: 0,
  nextLevel: 50
};
```

---

## 📱 **8. DISEÑO RESPONSIVO**

### **Breakpoints Específicos**
```css
/* Tablets y pantallas medianas */
@media (max-width: 768px) {
  .garden-container {
    padding: 1rem;
    grid-template-columns: 1fr;
  }
  
  .flower-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .garden-tools {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Móviles */
@media (max-width: 480px) {
  .garden-container {
    padding: 0.5rem;
  }
  
  .flower-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25rem;
  }
  
  .welcome-card {
    padding: 1rem;
    margin: 0.5rem;
  }
}
```

---

## ✨ **9. ANIMACIONES Y TRANSICIONES**

### **Animaciones de Flores**
```css
@keyframes flowerGrow {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes waterDrop {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes magicSparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 0.8;
  }
}

.flower-growing {
  animation: flowerGrow 1s ease-out;
}

.water-dropping {
  animation: waterDrop 0.5s ease-in;
}

.magic-sparkling {
  animation: magicSparkle 2s infinite;
}
```

---

## 🎯 **10. ESTADOS DE INTERFAZ**

### **Estados Principales**
```typescript
enum GardenUIState {
  WELCOME = 'welcome',
  PLANTING = 'planting',
  WATERING = 'watering',
  COUNTING = 'counting',
  PATTERN_CREATION = 'pattern_creation',
  ACHIEVEMENT = 'achievement',
  REPORT = 'report'
}
```

### **Estados de Interacción**
```typescript
interface GardenInteractionState {
  isPlanting: boolean;
  isWatering: boolean;
  isCounting: boolean;
  isCreatingPattern: boolean;
  selectedTool: string | null;
  hoveredFlower: string | null;
  activePattern: number[];
}
```

---

## 📋 **RESUMEN DE ELEMENTOS ESTÁNDARIZABLES**

### ✅ **Elementos Reutilizables:**
1. **Sistema de Bienvenida Multi-etapa** - Adaptable a cualquier tema
2. **Sistema de Voz y Audio** - Configurable para diferentes personajes
3. **Paleta de Colores** - Variables CSS reutilizables
4. **Sistema de Logros** - Estructura genérica aplicable
5. **Checklist Visual** - Componente reutilizable
6. **Pistas Dinámicas** - Lógica adaptable
7. **Reportes Multi-nivel** - Estructura estándar
8. **Controles Laterales** - Panel de herramientas genérico
9. **Diseño Responsivo** - Breakpoints estándar
10. **Animaciones** - Biblioteca de transiciones

### 🎯 **Elementos Específicos del Jardín:**
- Temática de flores y jardín
- Herramientas específicas (regadera, varita mágica)
- Sonidos de naturaleza
- Animaciones de crecimiento
- Colores verdes y florales

---

*Esta documentación establece los elementos UX/UI estándarizables para la Experience 4, manteniendo consistencia con las experiencias anteriores mientras adapta la temática específica del jardín mágico.* 