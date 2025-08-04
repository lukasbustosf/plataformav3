# 📋 DOCUMENTACIÓN EXPERIENCIA 5 - PARTE 2: DINÁMICAS ESPECÍFICAS

## 🎯 **CONTEXTO**

**Experiencia:** El Enigma Numérico (Inquiry-Based Learning)
**OA:** MA01OA01 - Conteo y numeración hasta 100
**Público:** Niños de 6-7 años (1° básico)

**Propósito:** Documentar las dinámicas específicas de esta experiencia que NO se pueden replicar en otras experiencias gamificadas.

---

## 🧩 **1. SISTEMA DE ENIGMAS ÚNICO**

### **🔍 Estructura de Enigmas**

```typescript
// Interfaces específicas para enigmas
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
```

### **🎯 Enigmas Específicos del OA1**

```typescript
// Enigmas específicos para conteo 0-100
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
```

---

## 🔍 **2. HERRAMIENTAS DE INVESTIGACIÓN ÚNICAS**

### **🛠️ Sistema de Herramientas**

```typescript
// Herramientas específicas para investigación
const INVESTIGATION_TOOLS: InvestigationTool[] = [
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
];
```

### **🎯 Funcionalidades Específicas**

```typescript
// Funciones específicas para investigación
const INVESTIGATION_FUNCTIONS = {
  // Descubrir pista
  discoverClue: (clue: string) => {
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
  },

  // Formular hipótesis
  formulateHypothesis: (hypothesis: string) => {
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
  },

  // Resolver enigma
  solveEnigma: (solution: string) => {
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
      
      checkAchievements();
    } else {
      setCurrentSession(prev => prev ? {
        ...prev,
        attempts: prev.attempts + 1
      } : null);
      
      playSound('error');
      speak('Casi correcto. Revisa tu solución e intenta de nuevo.');
    }
  }
};
```

---

## 🤝 **3. SISTEMA DE COLABORACIÓN ÚNICO**

### **👥 Funcionalidades de Colaboración**

```typescript
// Sistema de colaboración específico
const COLLABORATION_SYSTEM = {
  // Iniciar colaboración
  startCollaboration: () => {
    setShowCollaboration(true);
    speak("¡Modo colaboración activado! Trabaja con otros investigadores.");
  },

  // Completar colaboración
  completeCollaboration: () => {
    setSessionData(prev => ({
      ...prev,
      collaborationTime: prev.collaborationTime + 5,
      investigationPoints: prev.investigationPoints + 25
    }));
    
    setShowCollaboration(false);
    speak("¡Colaboración completada! Ganaste puntos de investigación.");
  },

  // Modal de colaboración
  CollaborationModal: () => (
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
  )
};
```

---

## 📊 **4. MÉTRICAS ESPECÍFICAS DE INVESTIGACIÓN**

### **🔍 Métricas Únicas**

```typescript
// Métricas específicas para investigación
const INVESTIGATION_METRICS = {
  sessionData: {
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
  },

  // Cálculo de precisión de investigación
  calculateResearchAccuracy: () => {
    const accuracy = sessionData.totalEnigmas > 0 
      ? Math.round((sessionData.solvedEnigmas / sessionData.totalEnigmas) * 100) 
      : 0;
    return accuracy;
  },

  // Cálculo de puntos de investigación
  calculateInvestigationPoints: () => {
    return sessionData.cluesDiscovered * 10 + 
           sessionData.hypothesesFormulated * 15 + 
           sessionData.collaborationTime * 5;
  }
};
```

---

## 🏆 **5. LOGROS ESPECÍFICOS DE INVESTIGACIÓN**

### **🎯 Logros Únicos**

```typescript
// Logros específicos para investigación
const INVESTIGATION_ACHIEVEMENTS = [
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
];
```

---

## 📝 **6. REPORTES ESPECÍFICOS DE INVESTIGACIÓN**

### **👶 Reporte para Niños Investigadores**

```typescript
// Reporte específico para niños investigadores
const generateChildEnigmaReport = () => {
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
};
```

### **👨‍👩‍👧‍👦 Reporte para Padres**

```typescript
// Reporte específico para padres
const generateParentEnigmaReport = () => {
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
};
```

### **👨‍🏫 Reporte para Profesores**

```typescript
// Reporte específico para profesores
const generateTeacherEnigmaReport = () => {
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
};
```

---

## 🎨 **7. CSS ESPECÍFICO DE INVESTIGACIÓN**

### **🔍 Estilos Únicos**

```css
/* Estilos específicos para investigación */
.enigma-container {
  background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
  min-height: 100vh;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.enigma-main {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.enigma-sidebar {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 2px solid #e2e8f0;
}

.enigma-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 15px;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
}

.enigma-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  border-color: #3B82F6;
}

.enigma-card.active {
  background: linear-gradient(135deg, #3B82F6 0%, #9333EA 100%);
  color: white;
  border-color: #3B82F6;
}

.enigma-workspace {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 2px solid #e2e8f0;
}

.investigation-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.clues-section,
.hypothesis-section,
.solution-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #cbd5e1;
}

.clue-item,
.hypothesis-item {
  background: white;
  border-radius: 8px;
  padding: 10px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.discover-clue-btn {
  background: linear-gradient(135deg, #3B82F6 0%, #9333EA 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
}

.discover-clue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.hypothesis-input,
.solution-input {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.hypothesis-input input,
.solution-input input {
  flex: 1;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.hypothesis-input button,
.solution-input button {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hypothesis-input button:hover,
.solution-input button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.collaboration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.collaboration-modal {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  border: 3px solid #3B82F6;
}

.collaboration-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.collaboration-actions button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.collaboration-actions button:first-child {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
}

.collaboration-actions button:last-child {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  color: white;
}
```

---

## 🎯 **8. DINÁMICAS ESPECÍFICAS NO REPLICABLES**

### **❌ Elementos Únicos de esta Experiencia:**

1. **Sistema de Enigmas** - Lógica específica de resolución de enigmas
2. **Herramientas de Investigación** - Funcionalidades únicas de cada herramienta
3. **Sistema de Pistas** - Mecánica específica de descubrimiento de pistas
4. **Formulación de Hipótesis** - Proceso único de investigación
5. **Colaboración entre Investigadores** - Sistema específico de trabajo en equipo
6. **Validación de Soluciones** - Lógica específica de verificación de enigmas
7. **Progresión de Dificultad** - Secuencia específica de enigmas
8. **Métricas de Investigación** - Indicadores específicos de investigación
9. **Reportes de Investigación** - Estructuras específicas para investigación
10. **Tema de Investigación** - Contenido específico de enigmas numéricos

### **✅ Elementos que SÍ se pueden replicar:**

1. **Sistema de Bienvenida** - Estructura general
2. **Sistema de Voz** - Funciones básicas
3. **Paleta de Colores** - Variables CSS
4. **Checklist de Logros** - Estructura general
5. **Sistema de Pistas** - Lógica básica
6. **Reportes Generales** - Estructura básica
7. **Controles Laterales** - Layout general
8. **Sistema Responsive** - Breakpoints generales
9. **Animaciones** - Keyframes generales
10. **Estados de UI** - Estados básicos

---

## 📋 **9. CHECKLIST DE IMPLEMENTACIÓN ESPECÍFICA**

### **✅ Para implementar esta experiencia específica:**

- [ ] Sistema de enigmas implementado
- [ ] Herramientas de investigación configuradas
- [ ] Sistema de pistas específico implementado
- [ ] Formulación de hipótesis funcional
- [ ] Validación de soluciones configurada
- [ ] Sistema de colaboración implementado
- [ ] Métricas de investigación configuradas
- [ ] Reportes específicos implementados
- [ ] CSS específico aplicado
- [ ] Contenido de enigmas creado

---

## 🎯 **CONCLUSIÓN**

Esta documentación establece las dinámicas específicas de la Experiencia 5 "El Enigma Numérico" que son únicas y no se pueden replicar en otras experiencias, manteniendo la coherencia con los elementos estandarizables documentados en la Parte 1.

**Próximo paso:** Implementar la experiencia completa siguiendo ambas documentaciones. 