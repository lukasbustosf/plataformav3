# 📋 DOCUMENTACIÓN EXPERIENCIA 5 - PARTE 1: ELEMENTOS UX/UI ESTANDARIZABLES

## 🎯 **CONTEXTO**

**Experiencia:** El Enigma Numérico (Inquiry-Based Learning)
**OA:** MA01OA01 - Conteo y numeración hasta 100
**Público:** Niños de 6-7 años (1° básico)

**Propósito:** Documentar todos los elementos de UX/UI que se pueden estandarizar y replicar en futuras experiencias gamificadas, manteniendo las dinámicas específicas de cada juego y OA.

---

## 🎨 **1. SISTEMA DE BIENVENIDA GUIADA**

### **🏗️ Estructura de Bienvenida Multi-paso**

```typescript
// Configuración estándar de bienvenida para investigación
const WELCOME_CONFIG = {
  showWelcome: true,
  welcomeStep: 0,
  welcomeSteps: [
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
  ]
};
```

### **🎨 CSS de Bienvenida Overlay**

```css
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(147, 51, 234, 0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.5s ease;
}

.welcome-content {
  background: white;
  border-radius: 25px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideInUp 0.6s ease;
}

.welcome-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.welcome-avatar {
  font-size: 48px;
  background: linear-gradient(135deg, #3B82F6 0%, #9333EA 100%);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.welcome-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.welcome-message {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 30px;
}

.welcome-progress {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e2e8f0;
  transition: all 0.3s ease;
}

.progress-dot.active {
  background: #3B82F6;
  transform: scale(1.2);
}

.progress-dot.completed {
  background: #10B981;
}

.welcome-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.welcome-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.welcome-btn.welcome-skip {
  background: #e2e8f0;
  color: #64748b;
}

.welcome-btn.welcome-next {
  background: linear-gradient(135deg, #3B82F6 0%, #9333EA 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.welcome-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🔊 **2. SISTEMA DE VOZ Y AUDIO**

### **🎤 Función de Voz Estandarizada**

```typescript
// Función de voz que se puede replicar en todas las experiencias
const speak = useCallback((text: string) => {
  if (speechEnabled && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}, [speechEnabled]);

// Función para generar sonidos específicos para investigación
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
      case 'investigation':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
        break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
}, []);
```

### **🎵 Configuración de Audio**

```typescript
// Estados de audio estandarizados
const AUDIO_STATES = {
  speechEnabled: true,
  soundEnabled: true,
  volume: 0.8,
  voiceRate: 0.8,
  voiceLanguage: 'es-ES'
};
```

---

## 🎨 **3. PALETA DE COLORES ESTANDARIZADA**

### **🌈 Paleta Principal (Investigación y Misterio)**

```css
:root {
  /* Colores principales - Paleta de investigación */
  --primary-investigation: #3B82F6;      /* Azul investigador */
  --primary-light: #EFF6FF;               /* Azul claro */
  --secondary-investigation: #9333EA;     /* Púrpura misterio */
  --success-bright: #10B981;              /* Verde éxito */
  --background-investigation: #F8FAFC;    /* Fondo investigador */
  --text-dark: #1e293b;                   /* Texto oscuro para contraste */
  
  /* Colores de estado */
  --error-color: #EF4444;
  --warning-color: #F59E0B;
  --info-color: #3B82F6;
  
  /* Gradientes estándar */
  --gradient-primary: linear-gradient(135deg, #3B82F6 0%, #9333EA 100%);
  --gradient-success: linear-gradient(135deg, #10B981 0%, #059669 100%);
  --gradient-background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
}
```

---

## 📋 **4. SISTEMA DE CHECKLIST DE LOGROS**

### **🏆 Estructura de Logros**

```typescript
// Estructura estándar de logros para investigación
const ACHIEVEMENTS_STRUCTURE = {
  achievements: [
    { 
      id: 'primer_enigma', 
      title: '🔍 Primer Investigador', 
      completed: false, 
      attempts: 0, 
      accuracy: 0,
      icon: '🔍',
      description: 'Resolviste tu primer enigma'
    },
    { 
      id: 'detective_novato', 
      title: '🕵️ Detective Novato', 
      completed: false, 
      attempts: 0, 
      accuracy: 0,
      icon: '🕵️',
      description: 'Resolviste 3 enigmas diferentes'
    },
    { 
      id: 'maestro_enigma', 
      title: '🧩 Maestro de Enigmas', 
      completed: false, 
      attempts: 0, 
      accuracy: 0,
      icon: '🧩',
      description: 'Resolviste todos los enigmas disponibles'
    },
    { 
      id: 'colaborador_experto', 
      title: '🤝 Colaborador Experto', 
      completed: false, 
      attempts: 0, 
      accuracy: 0,
      icon: '🤝',
      description: 'Completaste 5 investigaciones colaborativas'
    }
  ],
  
  // Función para completar logros
  completeAchievement: (id: string) => {
    setAchievements(prev => prev.map(a => 
      a.id === id ? { ...a, completed: true } : a
    ));
    playSound('achievement');
    speak(`¡Felicitaciones! Has completado ${title}`);
  }
};
```

### **🎨 CSS de Checklist**

```css
.achievements-checklist {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 15px;
  padding: 20px;
  margin: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 2px solid #e2e8f0;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  margin: 8px 0;
  border-radius: 10px;
  background: white;
  transition: all 0.3s ease;
}

.achievement-item.completed {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  transform: scale(1.02);
}

.achievement-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
}

.achievement-title {
  font-weight: 600;
  font-size: 1rem;
}

.achievement-progress {
  margin-left: auto;
  font-size: 0.9rem;
  opacity: 0.8;
}
```

---

## 💡 **5. SISTEMA DE PISTAS DINÁMICAS**

### **🔍 Estructura de Pistas**

```typescript
// Sistema de pistas dinámicas estandarizado para investigación
const HINT_SYSTEM = {
  currentHint: '',
  hintMinimized: false,
  hintPosition: { x: 20, y: 20 },
  
  // Función para generar pistas dinámicas de investigación
  generateInvestigationHint: () => {
    // Lógica específica de investigación
    return "Pista dinámica basada en el progreso de investigación";
  },
  
  // Función para leer pista con voz
  readHint: () => {
    speak(currentHint);
    playSound('clue');
  }
};
```

### **🎨 CSS de Barra de Pistas**

```css
.hint-bar {
  position: fixed;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #3B82F6 0%, #9333EA 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 1000;
  max-width: 300px;
  cursor: move;
  transition: all 0.3s ease;
}

.hint-bar.minimized {
  transform: translateX(-280px);
}

.hint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.hint-title {
  font-weight: 600;
  font-size: 1rem;
}

.hint-controls {
  display: flex;
  gap: 8px;
}

.hint-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hint-btn:hover {
  background: rgba(255,255,255,0.3);
}

.hint-content {
  font-size: 0.9rem;
  line-height: 1.4;
}
```

---

## 📊 **6. SISTEMA DE REPORTES DETALLADOS**

### **👶 Reporte para Niños (6-7 años)**

```typescript
// Estructura de reporte para niños investigadores
const CHILD_REPORT_STRUCTURE = {
  // Métricas principales con emojis
  metrics: {
    totalEnigmas: {
      value: 0,
      icon: '🧩',
      label: 'Enigmas Totales',
      achievement: '🏆 ¡Excelente!'
    },
    solvedEnigmas: {
      value: 0,
      icon: '🔍',
      label: 'Enigmas Resueltos',
      achievement: '🌟 ¡Genio!'
    },
    investigationPoints: {
      value: 0,
      icon: '📊',
      label: 'Puntos de Investigación',
      achievement: '📈 ¡Muy dedicado!'
    },
    cluesDiscovered: {
      value: 0,
      icon: '💡',
      label: 'Pistas Descubiertas',
      achievement: '🔍 ¡Detective!'
    }
  },
  
  // Progreso visual por secciones
  progress: {
    section1: { completed: false, icon: '🔍', name: 'Investigación Básica' },
    section2: { completed: false, icon: '🧠', name: 'Análisis Lógico' },
    section3: { completed: false, icon: '🤝', name: 'Colaboración' }
  },
  
  // Logros especiales
  specialAchievements: [
    { id: 'first-enigma', earned: false, icon: '🔍', title: 'Primer Enigma' },
    { id: 'master-detective', earned: false, icon: '🕵️', title: 'Maestro Detective' },
    { id: 'collaboration-expert', earned: false, icon: '🤝', title: 'Experto Colaborador' }
  ]
};
```

### **👨‍👩‍👧‍👦 Reporte para Padres**

```typescript
// Estructura de reporte para padres
const PARENT_REPORT_STRUCTURE = {
  // Resumen ejecutivo
  summary: {
    sessionDate: new Date().toLocaleDateString('es-ES'),
    totalTime: '0:00',
    overallProgress: 0,
    engagementLevel: 'Alto'
  },
  
  // Métricas académicas específicas
  academicMetrics: {
    criticalThinking: {
      value: 0,
      label: 'Pensamiento Crítico',
      description: 'Habilidad para analizar y resolver problemas'
    },
    problemSolving: {
      value: 0,
      label: 'Resolución de Problemas',
      description: 'Capacidad para encontrar soluciones'
    },
    investigation: {
      value: 0,
      label: 'Habilidades de Investigación',
      description: 'Capacidad para buscar y analizar información'
    },
    collaboration: {
      value: 0,
      label: 'Colaboración',
      description: 'Trabajo en equipo y cooperación'
    }
  },
  
  // Actividades sugeridas para casa
  homeActivities: [
    {
      title: 'Juegos de Adivinanzas',
      description: 'Practica resolución de problemas con acertijos',
      difficulty: 'Fácil',
      duration: '10-15 minutos',
      materials: 'Papel y lápiz'
    },
    {
      title: 'Búsqueda de Patrones',
      description: 'Busca patrones en objetos cotidianos',
      difficulty: 'Medio',
      duration: '15-20 minutos',
      materials: 'Objetos del hogar'
    },
    {
      title: 'Investigación Familiar',
      description: 'Resuelve enigmas en familia',
      difficulty: 'Difícil',
      duration: '20-30 minutos',
      materials: 'Juegos de mesa'
    }
  ],
  
  // Observaciones del comportamiento
  behavioralObservations: {
    attentionSpan: 'Alto',
    persistence: 'Excelente',
    problemSolving: 'Muy bueno',
    creativity: 'Excelente'
  },
  
  // Próximos pasos recomendados
  nextSteps: {
    immediate: 'Practicar más enigmas de lógica',
    shortTerm: 'Desarrollar habilidades de investigación',
    longTerm: 'Fomentar el pensamiento crítico'
  }
};
```

### **👨‍🏫 Reporte para Profesores**

```typescript
// Estructura de reporte para profesores
const TEACHER_REPORT_STRUCTURE = {
  // Identificación del estudiante
  studentInfo: {
    name: 'Nombre del estudiante',
    grade: '1° Básico',
    sessionDate: new Date().toLocaleDateString('es-ES'),
    sessionDuration: '0:00'
  },
  
  // Evaluación por estándar curricular
  curricularStandards: {
    OA_CODE: {
      standard: 'Descripción del estándar',
      mastery: 0,
      evidence: [
        'Evidencia 1',
        'Evidencia 2',
        'Evidencia 3'
      ],
      areasForImprovement: ['Área 1', 'Área 2'],
      recommendations: ['Recomendación 1', 'Recomendación 2']
    }
  },
  
  // Análisis de errores comunes
  errorAnalysis: {
    mostCommonErrors: [
      { error: 'Error común 1', frequency: 0, percentage: 0 },
      { error: 'Error común 2', frequency: 0, percentage: 0 }
    ],
    errorPatterns: 'Patrones de error identificados',
    interventionStrategies: ['Estrategia 1', 'Estrategia 2']
  },
  
  // Comparación con estándares de clase
  classComparison: {
    studentPercentile: 0,
    classAverage: 0,
    peerComparison: 'Comparación con pares',
    growthRate: 0
  },
  
  // Plan de intervención
  interventionPlan: {
    immediateActions: ['Acción 1', 'Acción 2'],
    shortTermGoals: ['Meta 1', 'Meta 2'],
    longTermObjectives: ['Objetivo 1', 'Objetivo 2']
  }
};
```

### **🎨 CSS de Reportes**

```css
.report-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.child-report {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--background-investigation) 100%);
  border-radius: 20px;
  padding: 30px;
  margin: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.parent-report {
  background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
  border-radius: 15px;
  padding: 25px;
  margin: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.teacher-report {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
  border-radius: 15px;
  padding: 25px;
  margin: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.metric-card {
  background: linear-gradient(135deg, var(--success-bright) 0%, var(--primary-investigation) 100%);
  border-radius: 15px;
  padding: 20px;
  margin: 10px;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.achievement-badge {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 10px auto;
  animation: pulse 2s infinite;
}

.progress-bar {
  background: #E2E8F0;
  border-radius: 10px;
  height: 20px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  background: linear-gradient(90deg, var(--success-bright) 0%, var(--primary-investigation) 100%);
  height: 100%;
  transition: width 0.5s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

---

## 🎮 **7. SISTEMA DE CONTROLES INTERACTIVOS**

### **🎛️ Barra de Controles Laterales**

```typescript
// Estructura de controles laterales para investigación
const SIDEBAR_CONTROLS = {
  // Controles de investigación (izquierda)
  leftSidebar: {
    investigationControls: {
      title: '🔍 Herramientas de Investigación',
      buttons: [
        { tool: 'magnifying_glass', label: '🔍 Lupa', icon: '🔍' },
        { tool: 'pattern_scanner', label: '📊 Escáner', icon: '📊' },
        { tool: 'logic_analyzer', label: '🧠 Analizador', icon: '🧠' },
        { tool: 'collaboration_network', label: '🤝 Colaboración', icon: '🤝' }
      ]
    }
  },
  
  // Panel de enigmas (derecha)
  rightSidebar: {
    enigmaPanel: {
      title: '🧩 Enigmas Disponibles',
      categories: [
        { name: 'Conteo', icon: '🔢' },
        { name: 'Patrones', icon: '📊' },
        { name: 'Lógica', icon: '🧠' },
        { name: 'Investigación', icon: '🔍' }
      ]
    }
  }
};
```

### **🎨 CSS de Controles**

```css
.sidebar-controls {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 25px;
  border: 1px solid #cbd5e1;
}

.control-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-btn:hover {
  background: linear-gradient(135deg, #ffffff 0%, #dbeafe 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-color: #3B82F6;
}

.control-btn.active {
  background: linear-gradient(135deg, var(--primary-investigation) 0%, var(--secondary-investigation) 100%);
  color: white;
  border-color: var(--primary-investigation);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}
```

---

## 📱 **8. SISTEMA RESPONSIVE**

### **📐 Breakpoints Estándar**

```css
/* Responsive design para niños de 6-7 años */
@media (max-width: 768px) {
  .welcome-content {
    padding: 20px;
    max-width: 95%;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .welcome-message {
    font-size: 1rem;
  }
  
  .control-buttons {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .control-btn {
    flex: 1;
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .welcome-avatar {
    width: 60px;
    height: 60px;
    font-size: 36px;
  }
  
  .welcome-title {
    font-size: 1.3rem;
  }
  
  .welcome-actions {
    flex-direction: column;
  }
  
  .welcome-btn {
    width: 100%;
  }
}
```

---

## 🎯 **9. ELEMENTOS ESTANDARIZABLES POR EXPERIENCIA**

### **✅ Elementos que SI se pueden replicar:**

1. **Sistema de Bienvenida Multi-paso** - Estructura, CSS, lógica
2. **Sistema de Voz** - Funciones speak() y playSound()
3. **Paleta de Colores** - Variables CSS y gradientes
4. **Checklist de Logros** - Estructura de datos y CSS
5. **Sistema de Pistas** - Lógica de generación y CSS
6. **Reportes Detallados** - Estructuras de datos y CSS
7. **Controles Laterales** - Layout y CSS
8. **Sistema Responsive** - Breakpoints y adaptaciones
9. **Animaciones** - Keyframes y transiciones
10. **Estados de UI** - Loading, error, success

### **❌ Elementos que NO se pueden replicar:**

1. **Dinámicas específicas de investigación** - Lógica única de cada experiencia
2. **Contenido específico de enigmas** - Textos, imágenes, conceptos
3. **Mecánicas de validación de enigmas** - Reglas específicas de cada OA
4. **Secuencias de progresión de investigación** - Orden específico de cada experiencia
5. **Objetivos de aprendizaje específicos** - Contenido curricular específico

---

## 📋 **10. CHECKLIST DE IMPLEMENTACIÓN**

### **✅ Para cada nueva experiencia, verificar:**

- [ ] Sistema de bienvenida implementado
- [ ] Función de voz configurada
- [ ] Paleta de colores aplicada
- [ ] Checklist de logros estructurado
- [ ] Sistema de pistas implementado
- [ ] Reportes detallados configurados
- [ ] Controles laterales adaptados
- [ ] Sistema responsive probado
- [ ] Animaciones y transiciones aplicadas
- [ ] Estados de UI implementados

---

## 🎯 **CONCLUSIÓN**

Esta documentación establece los elementos UX/UI estandarizables que se pueden replicar en todas las experiencias gamificadas, manteniendo la coherencia visual y de interacción mientras se preservan las dinámicas específicas de cada juego y OA.

**Próximo paso:** Documentar la Parte 2 con las dinámicas específicas de la experiencia 5 que NO se pueden replicar en otras experiencias. 