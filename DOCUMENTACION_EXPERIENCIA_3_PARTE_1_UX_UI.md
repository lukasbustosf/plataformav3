# 🐄 DOCUMENTACIÓN EXPERIENCIA 3: "GRANJA CONTADOR" - PARTE 1: UX/UI ESTÁNDAR

## 📚 **CONTEXTO DE LA EXPERIENCIA**

**Experiencia:** "Granja Contador" - Juego progresivo de conteo con temática de granja
**Objetivo de Aprendizaje:** MAT.1B.OA.01 - Contar números del 0 al 20
**Público objetivo:** Niños de 6-7 años (1° básico)
**Progresión:** 4 niveles temáticos (Pollitos → Gallinas → Vacas → Granjero Experto)

---

## 🎨 **1. SISTEMA DE BIENVENIDA MULTI-PASO**

### **Estructura de Bienvenida:**
```typescript
interface WelcomeStep {
  title: string;
  message: string;
  icon: string;
  action?: string;
  visualElement?: string;
}

const welcomeSteps: WelcomeStep[] = [
  {
    title: "¡Hola Granjero! 👨‍🌾",
    message: "Soy el Granjero Pedro y necesito tu ayuda para contar los animales de mi granja. ¿Estás listo para esta aventura?",
    icon: "👨‍🌾",
    visualElement: "granjero_animado"
  },
  {
    title: "🐣 Empezamos con los Pollitos",
    message: "Los pollitos son pequeños y fáciles de contar. Vamos del 1 al 5 primero.",
    icon: "🐣",
    visualElement: "pollitos_contando"
  },
  {
    title: "🐔 Luego las Gallinas",
    message: "Las gallinas son un poco más grandes. Contaremos del 1 al 10.",
    icon: "🐔",
    visualElement: "gallinas_contando"
  },
  {
    title: "🐄 Después las Vacas",
    message: "Las vacas son grandes. Contaremos del 1 al 20.",
    icon: "🐄",
    visualElement: "vacas_contando"
  },
  {
    title: "🚜 Finalmente el Granjero Experto",
    message: "Aprenderás patrones especiales: contar de 2 en 2, de 5 en 5.",
    icon: "🚜",
    visualElement: "patrones_especiales"
  }
];
```

### **CSS para Bienvenida:**
```css
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #87CEEB 0%, #98FB98 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease-in;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.6s ease-out;
}

.welcome-title {
  font-size: 2rem;
  color: #2E8B57;
  margin-bottom: 15px;
  font-weight: bold;
}

.welcome-message {
  font-size: 1.2rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 25px;
}

.welcome-visual {
  width: 120px;
  height: 120px;
  margin: 20px auto;
  border-radius: 50%;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  animation: bounce 2s infinite;
}

.welcome-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
}

.welcome-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.welcome-btn-primary {
  background: linear-gradient(45deg, #32CD32, #228B22);
  color: white;
}

.welcome-btn-secondary {
  background: linear-gradient(45deg, #FF6B6B, #FF4500);
  color: white;
}
```

### **Lógica de Bienvenida:**
```typescript
const [showWelcome, setShowWelcome] = useState(true);
const [welcomeStep, setWelcomeStep] = useState(0);

const handleWelcomeNext = useCallback(() => {
  if (welcomeStep < welcomeSteps.length - 1) {
    setWelcomeStep(welcomeStep + 1);
    speak(welcomeSteps[welcomeStep + 1].message);
  } else {
    setShowWelcome(false);
    speak("¡Perfecto! Ahora puedes empezar a contar animales. ¡Buena suerte, granjero!");
  }
}, [welcomeStep, welcomeSteps, speak]);

const handleWelcomeSkip = useCallback(() => {
  setShowWelcome(false);
  speak("¡Perfecto! Ahora puedes empezar a contar animales. ¡Buena suerte, granjero!");
}, [speak]);
```

---

## 🔊 **2. SISTEMA DE VOZ**

### **Funciones de Voz:**
```typescript
// Función principal de voz
const speak = useCallback((text: string) => {
  if (speechEnabled && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}, [speechEnabled]);

// Función para sonidos de animales
const playAnimalSound = useCallback((animalType: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  const sounds = {
    pollito: { frequency: 800, duration: 0.3, pattern: 'pío pío' },
    gallina: { frequency: 600, duration: 0.4, pattern: 'cacareo' },
    vaca: { frequency: 200, duration: 0.6, pattern: 'muuu' },
    granjero: { frequency: 400, duration: 0.5, pattern: '¡hola!' }
  };
  
  const sound = sounds[animalType as keyof typeof sounds];
  if (sound) {
    oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + sound.duration);
    speak(sound.pattern);
  }
}, [speak]);

// Función para feedback de conteo
const playCountFeedback = useCallback((isCorrect: boolean, count: number) => {
  if (isCorrect) {
    speak(`¡Excelente! Has contado ${count} animales correctamente.`);
    playAnimalSound('granjero');
  } else {
    speak(`Intenta contar de nuevo. Toca cada animal mientras cuentas: 1, 2, 3...`);
  }
}, [speak, playAnimalSound]);
```

---

## 🎨 **3. PALETA DE COLORES**

### **Variables CSS:**
```css
:root {
  /* Colores principales de granja */
  --farm-green-primary: #2E8B57;
  --farm-green-secondary: #32CD32;
  --farm-yellow-primary: #FFD700;
  --farm-orange-primary: #FFA500;
  --farm-brown-primary: #8B4513;
  --farm-blue-sky: #87CEEB;
  --farm-grass-green: #98FB98;
  
  /* Gradientes temáticos */
  --gradient-pollitos: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  --gradient-gallinas: linear-gradient(135deg, #FF6B6B 0%, #FF4500 100%);
  --gradient-vacas: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  --gradient-granjero: linear-gradient(135deg, #2E8B57 0%, #32CD32 100%);
  
  /* Colores de estado */
  --success-green: #32CD32;
  --error-red: #FF4500;
  --warning-yellow: #FFD700;
  --info-blue: #87CEEB;
  
  /* Colores de fondo */
  --background-sky: linear-gradient(135deg, #87CEEB 0%, #98FB98 100%);
  --background-farm: linear-gradient(135deg, #98FB98 0%, #90EE90 100%);
  --background-barn: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}
```

### **Aplicación por Nivel:**
```css
/* Nivel 1: Pollitos */
.pollitos-level {
  background: var(--gradient-pollitos);
  color: var(--farm-brown-primary);
}

/* Nivel 2: Gallinas */
.gallinas-level {
  background: var(--gradient-gallinas);
  color: white;
}

/* Nivel 3: Vacas */
.vacas-level {
  background: var(--gradient-vacas);
  color: white;
}

/* Nivel 4: Granjero Experto */
.granjero-level {
  background: var(--gradient-granjero);
  color: white;
}
```

---

## ✅ **4. CHECKLIST DE LOGROS**

### **Estructura de Logros:**
```typescript
interface FarmAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 'pollitos' | 'gallinas' | 'vacas' | 'granjero';
  requirement: number;
  current: number;
  completed: boolean;
  reward: string;
}

const farmAchievements: FarmAchievement[] = [
  {
    id: 'primer_pollito',
    title: '🐣 Primer Pollito',
    description: 'Contaste tu primer pollito',
    icon: '🐣',
    level: 'pollitos',
    requirement: 1,
    current: 0,
    completed: false,
    reward: 'Medalla de Pollito'
  },
  {
    id: 'contador_pollitos',
    title: '🐣 Contador de Pollitos',
    description: 'Contaste 5 pollitos correctamente',
    icon: '🐣',
    level: 'pollitos',
    requirement: 5,
    current: 0,
    completed: false,
    reward: 'Cinta de Pollito Experto'
  },
  {
    id: 'primer_gallina',
    title: '🐔 Primera Gallina',
    description: 'Contaste tu primera gallina',
    icon: '🐔',
    level: 'gallinas',
    requirement: 1,
    current: 0,
    completed: false,
    reward: 'Medalla de Gallina'
  },
  {
    id: 'contador_gallinas',
    title: '🐔 Contador de Gallinas',
    description: 'Contaste 10 gallinas correctamente',
    icon: '🐔',
    level: 'gallinas',
    requirement: 10,
    current: 0,
    completed: false,
    reward: 'Cinta de Gallina Experta'
  },
  {
    id: 'primer_vaca',
    title: '🐄 Primera Vaca',
    description: 'Contaste tu primera vaca',
    icon: '🐄',
    level: 'vacas',
    requirement: 1,
    current: 0,
    completed: false,
    reward: 'Medalla de Vaca'
  },
  {
    id: 'contador_vacas',
    title: '🐄 Contador de Vacas',
    description: 'Contaste 20 vacas correctamente',
    icon: '🐄',
    level: 'vacas',
    requirement: 20,
    current: 0,
    completed: false,
    reward: 'Cinta de Vaca Experta'
  },
  {
    id: 'granjero_experto',
    title: '🚜 Granjero Experto',
    description: 'Completaste todos los niveles',
    icon: '🚜',
    level: 'granjero',
    requirement: 1,
    current: 0,
    completed: false,
    reward: 'Diploma de Granjero Experto'
  }
];
```

### **CSS para Checklist:**
```css
.achievements-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  margin: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 8px 0;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
}

.achievement-item.completed {
  background: linear-gradient(45deg, #d4edda, #c3e6cb);
  border-left: 4px solid var(--success-green);
}

.achievement-icon {
  font-size: 2rem;
  margin-right: 15px;
  animation: bounce 2s infinite;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-weight: bold;
  color: var(--farm-green-primary);
  margin-bottom: 5px;
}

.achievement-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(45deg, var(--farm-green-secondary), var(--farm-green-primary));
  transition: width 0.5s ease;
}

.achievement-reward {
  font-size: 0.8rem;
  color: var(--farm-orange-primary);
  font-weight: bold;
}
```

---

## 💡 **5. SISTEMA DE PISTAS**

### **Lógica de Pistas Dinámicas:**
```typescript
const generateFarmHint = useCallback(() => {
  if (!currentLevel) return "¡Empieza contando los pollitos!";
  
  const hints = {
    pollitos: {
      start: "¡Mira los pollitos! Toca cada uno mientras cuentas: 1, 2, 3...",
      counting: `Ya has contado ${currentCount} pollitos. ¡Sigue contando!`,
      almost: `¡Casi terminamos! Solo faltan ${5 - currentCount} pollitos.`,
      complete: "¡Excelente! Has contado todos los pollitos. ¡Pasemos a las gallinas!"
    },
    gallinas: {
      start: "¡Las gallinas son más grandes! Cuenta del 1 al 10.",
      counting: `Ya has contado ${currentCount} gallinas. ¡Continúa!`,
      almost: `¡Casi terminamos! Solo faltan ${10 - currentCount} gallinas.`,
      complete: "¡Perfecto! Has contado todas las gallinas. ¡Ahora las vacas!"
    },
    vacas: {
      start: "¡Las vacas son muy grandes! Cuenta del 1 al 20.",
      counting: `Ya has contado ${currentCount} vacas. ¡Sigue así!`,
      almost: `¡Casi terminamos! Solo faltan ${20 - currentCount} vacas.`,
      complete: "¡Increíble! Has contado todas las vacas. ¡Eres un granjero experto!"
    },
    granjero: {
      start: "¡Ahora aprenderás patrones especiales! Cuenta de 2 en 2.",
      counting: `Ya has contado ${currentCount} elementos. ¡Continúa el patrón!`,
      almost: "¡Casi dominas el patrón! ¡Un último esfuerzo!",
      complete: "¡Eres un granjero experto! ¡Dominas todos los patrones!"
    }
  };
  
  const levelHints = hints[currentLevel as keyof typeof hints];
  if (currentCount === 0) return levelHints.start;
  if (currentCount >= getLevelRequirement(currentLevel)) return levelHints.complete;
  if (currentCount >= getLevelRequirement(currentLevel) - 2) return levelHints.almost;
  return levelHints.counting;
}, [currentLevel, currentCount]);

const getLevelRequirement = (level: string): number => {
  const requirements = {
    pollitos: 5,
    gallinas: 10,
    vacas: 20,
    granjero: 10
  };
  return requirements[level as keyof typeof requirements] || 5;
};
```

### **CSS para Pistas:**
```css
.hints-container {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 15px;
  padding: 15px;
  margin: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite;
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hint-icon {
  font-size: 1.5rem;
  animation: bounce 1s infinite;
}

.hint-text {
  flex: 1;
  font-size: 1rem;
  color: #333;
  line-height: 1.4;
}

.hint-audio-btn {
  background: var(--farm-green-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hint-audio-btn:hover {
  transform: scale(1.1);
  background: var(--farm-green-secondary);
}
```

---

## 📊 **6. REPORTES DETALLADOS**

### **Estructura de Reportes:**

#### **Reporte para Niños:**
```typescript
interface ChildReport {
  title: string;
  subtitle: string;
  achievements: Achievement[];
  totalAnimals: number;
  favoriteAnimal: string;
  bestLevel: string;
  nextChallenge: string;
  visualElements: string[];
}

const generateChildReport = (sessionData: any): ChildReport => ({
  title: "🐄 ¡Tu Reporte de Granjero!",
  subtitle: "Has contado muchos animales en la granja",
  achievements: sessionData.achievements,
  totalAnimals: sessionData.totalCounted,
  favoriteAnimal: sessionData.mostCountedAnimal,
  bestLevel: sessionData.bestPerformingLevel,
  nextChallenge: getNextChallenge(sessionData),
  visualElements: ['🐣', '🐔', '🐄', '🚜']
});
```

#### **Reporte para Padres:**
```typescript
interface ParentReport {
  title: string;
  summary: string;
  progress: {
    level: string;
    animalsCounted: number;
    accuracy: number;
    timeSpent: number;
  }[];
  skills: {
    counting: number;
    patterns: number;
    concentration: number;
  };
  recommendations: string[];
  nextSteps: string[];
}

const generateParentReport = (sessionData: any): ParentReport => ({
  title: "📊 Reporte de Progreso - Granja Contador",
  summary: `Su hijo/a ha completado ${sessionData.totalSessions} sesiones de conteo en la granja.`,
  progress: sessionData.levelProgress,
  skills: {
    counting: calculateCountingSkill(sessionData),
    patterns: calculatePatternSkill(sessionData),
    concentration: calculateConcentrationSkill(sessionData)
  },
  recommendations: [
    "Practicar conteo en casa con objetos cotidianos",
    "Jugar juegos de conteo durante las comidas",
    "Contar pasos mientras caminan juntos"
  ],
  nextSteps: [
    "Continuar con el siguiente nivel de dificultad",
    "Practicar conteo hacia atrás",
    "Introducir patrones de conteo más complejos"
  ]
});
```

#### **Reporte para Profesores:**
```typescript
interface TeacherReport {
  title: string;
  studentInfo: {
    name: string;
    grade: string;
    sessionCount: number;
  };
  academicProgress: {
    oaMastery: number;
    skillDevelopment: {
      counting: number;
      patterns: number;
      problemSolving: number;
    };
    levelProgression: {
      pollitos: number;
      gallinas: number;
      vacas: number;
      granjero: number;
    };
  };
  engagementMetrics: {
    sessionDuration: number;
    returnFrequency: number;
    toolUsage: number;
  };
  recommendations: {
    strengths: string[];
    areas: string[];
    nextSteps: string[];
  };
}
```

### **CSS para Reportes:**
```css
.report-container {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.report-header {
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid var(--farm-green-primary);
}

.report-title {
  font-size: 2rem;
  color: var(--farm-green-primary);
  margin-bottom: 10px;
}

.report-subtitle {
  font-size: 1.2rem;
  color: #666;
}

.report-section {
  margin: 20px 0;
  padding: 15px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 10px;
}

.report-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #dee2e6;
}

.report-metric:last-child {
  border-bottom: none;
}

.metric-label {
  font-weight: bold;
  color: var(--farm-green-primary);
}

.metric-value {
  font-size: 1.1rem;
  color: #333;
}
```

---

## 🎮 **7. CONTROLES LATERALES**

### **Layout de Controles:**
```typescript
const FarmControls = () => {
  return (
    <div className="farm-controls">
      {/* Panel Izquierdo - Niveles */}
      <div className="levels-panel">
        <h3>🌾 Niveles de la Granja</h3>
        <div className="level-buttons">
          <button className={`level-btn ${currentLevel === 'pollitos' ? 'active' : ''}`}>
            🐣 Pollitos (1-5)
          </button>
          <button className={`level-btn ${currentLevel === 'gallinas' ? 'active' : ''}`}>
            🐔 Gallinas (1-10)
          </button>
          <button className={`level-btn ${currentLevel === 'vacas' ? 'active' : ''}`}>
            🐄 Vacas (1-20)
          </button>
          <button className={`level-btn ${currentLevel === 'granjero' ? 'active' : ''}`}>
            🚜 Granjero Experto
          </button>
        </div>
      </div>
      
      {/* Panel Derecho - Herramientas */}
      <div className="tools-panel">
        <h3>🛠️ Herramientas del Granjero</h3>
        <div className="tool-buttons">
          <button className="tool-btn">
            🔊 Sonidos de Animales
          </button>
          <button className="tool-btn">
            📊 Contador Visual
          </button>
          <button className="tool-btn">
            🎯 Modo Práctica
          </button>
          <button className="tool-btn">
            📝 Reporte de Progreso
          </button>
        </div>
      </div>
    </div>
  );
};
```

### **CSS para Controles:**
```css
.farm-controls {
  display: flex;
  gap: 20px;
  margin: 20px;
}

.levels-panel,
.tools-panel {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.levels-panel h3,
.tools-panel h3 {
  color: var(--farm-green-primary);
  margin-bottom: 15px;
  text-align: center;
  font-size: 1.3rem;
}

.level-buttons,
.tool-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.level-btn,
.tool-btn {
  padding: 12px 15px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  color: #333;
}

.level-btn:hover,
.tool-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.level-btn.active {
  background: linear-gradient(45deg, var(--farm-green-secondary), var(--farm-green-primary));
  color: white;
}
```

---

## 📱 **8. SISTEMA RESPONSIVE**

### **Breakpoints y Adaptaciones:**
```css
/* Mobile First Approach */
.farm-game-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--background-sky);
}

/* Tablet (768px y superior) */
@media (min-width: 768px) {
  .farm-game-container {
    flex-direction: row;
  }
  
  .farm-controls {
    flex-direction: row;
  }
  
  .levels-panel,
  .tools-panel {
    flex: 1;
  }
}

/* Desktop (1024px y superior) */
@media (min-width: 1024px) {
  .farm-game-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .farm-controls {
    position: sticky;
    top: 20px;
  }
}

/* Large Desktop (1440px y superior) */
@media (min-width: 1440px) {
  .farm-game-container {
    max-width: 1400px;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .level-btn,
  .tool-btn {
    min-height: 44px;
    font-size: 1.1rem;
  }
  
  .welcome-btn {
    min-height: 50px;
    font-size: 1.2rem;
  }
}
```

---

## 🎬 **9. ANIMACIONES**

### **Keyframes y Transiciones:**
```css
/* Animaciones de entrada */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes animalCount {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Animaciones específicas de animales */
.animal-counting {
  animation: animalCount 0.5s ease-in-out;
}

.achievement-unlocked {
  animation: bounce 1s ease-in-out;
}

.hint-pulse {
  animation: pulse 2s infinite;
}
```

---

## 🎯 **10. ESTADOS DE UI**

### **Estados de Carga:**
```css
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--background-sky);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--farm-green-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20px;
  font-size: 1.2rem;
  color: var(--farm-green-primary);
}
```

### **Estados de Error:**
```css
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #FF6B6B, #FF4500);
  color: white;
  border-radius: 15px;
  margin: 20px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.error-message {
  font-size: 1rem;
  margin-bottom: 20px;
}

.error-retry-btn {
  padding: 12px 25px;
  background: white;
  color: var(--farm-orange-primary);
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}
```

### **Estados de Éxito:**
```css
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, var(--farm-green-secondary), var(--farm-green-primary));
  color: white;
  border-radius: 15px;
  margin: 20px;
  animation: slideUp 0.6s ease-out;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

.success-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.success-message {
  font-size: 1rem;
  margin-bottom: 20px;
}

.success-continue-btn {
  padding: 12px 25px;
  background: white;
  color: var(--farm-green-primary);
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}
```

---

## 📋 **RESUMEN DE ELEMENTOS ESTÁNDAR**

### **✅ Elementos Reutilizables Documentados:**

1. **Sistema de Bienvenida Multi-paso** - Estructura, CSS, lógica
2. **Sistema de Voz** - Funciones speak() y playAnimalSound()
3. **Paleta de Colores** - Variables CSS y gradientes temáticos
4. **Checklist de Logros** - Estructura de datos y CSS
5. **Sistema de Pistas** - Lógica de generación y CSS
6. **Reportes Detallados** - Estructuras para niños, padres y profesores
7. **Controles Laterales** - Layout y CSS
8. **Sistema Responsive** - Breakpoints y adaptaciones
9. **Animaciones** - Keyframes y transiciones
10. **Estados de UI** - Loading, error, success

### **🎯 Características Específicas de Granja Contador:**

- **Temática de Granja** - Animales, colores y sonidos específicos
- **Progresión por Niveles** - Pollitos → Gallinas → Vacas → Granjero Experto
- **Conteo Interactivo** - Tocar animales para contar
- **Sonidos de Animales** - Feedback auditivo específico
- **Patrones de Conteo** - 1 en 1, 2 en 2, 5 en 5, 10 en 10

### **📚 Aplicabilidad para Otras Experiencias:**

Esta documentación proporciona una base sólida para implementar experiencias gamificadas similares con diferentes temáticas, manteniendo la misma estructura de UX/UI pero adaptando el contenido específico del juego. 