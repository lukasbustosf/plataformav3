# 📚 DOCUMENTACIÓN PROYECTO EDU21 - Plataforma Educativa Gamificada

## 🎯 VISIÓN GENERAL DEL PROYECTO

**EDU21** es una plataforma educativa innovadora que desarrolla **6 experiencias de evaluación gamificada por Objetivo de Aprendizaje (OA)** del currículum chileno de 1° a 6° básico. El proyecto se enfoca en crear experiencias de **parientaje** (parenting) a través de evaluaciones interactivas que evalúan, motivan y enseñan simultáneamente.

### 🎮 Enfoque Principal: Evaluaciones Gamificadas por OA

El corazón de EDU21 son las **6 experiencias gamificadas por OA** que permiten:
- ✅ **Evaluar** objetivos de aprendizaje específicos del currículum MINEDUC
- ✅ **Motivar** a estudiantes a través de gamificación coherente
- ✅ **Generar experiencias de parientaje** (parenting) para familias
- ✅ **Implementar taxonomía de Bloom** en cada experiencia
- ✅ **Enseñar** contenido de manera didáctica y activa

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### 📊 Estructura de Base de Datos

```sql
-- Core System Tables
schools (colegios)
├── school_id (UUID)
├── school_name (nombre del colegio)
├── school_code (código único)
└── active (estado activo)

users (usuarios)
├── user_id (UUID)
├── school_id (referencia al colegio)
├── email, first_name, last_name
├── role (TEACHER, STUDENT, ADMIN_ESCOLAR, etc.)
├── phone, rut
└── active (estado activo)

-- Sistema de OAs y Evaluaciones Gamificadas
learning_objectives (objetivos de aprendizaje)
├── oa_id (UUID)
├── oa_code (código MINEDUC)
├── subject (MAT, LEN, CN, etc.)
├── grade_level (1B, 2B, 3B, 4B, 5B, 6B)
├── description (descripción del OA)
├── bloom_taxonomy_level
└── active (estado activo)

gamified_evaluations (evaluaciones gamificadas)
├── evaluation_id (UUID)
├── oa_id (referencia al OA)
├── evaluation_type (REMEMBER, UNDERSTAND, APPLY, ANALYZE, EVALUATE, CREATE)
├── title, description
├── interactive_format (formato interactivo)
├── settings (configuración JSON)
└── status (active, completed, etc.)
```

### 🔐 Sistema de Roles y Permisos

```typescript
enum UserRole {
  SUPER_ADMIN_FULL = 'SUPER_ADMIN_FULL',
  ADMIN_ESCOLAR = 'ADMIN_ESCOLAR',
  BIENESTAR_ESCOLAR = 'BIENESTAR_ESCOLAR',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  GUARDIAN = 'GUARDIAN',
  SOSTENEDOR = 'SOSTENEDOR'
}
```

---

## 📚 SISTEMA CURRICULAR Y OBJETIVOS DE APRENDIZAJE

### 🎯 Investigación de OAs MINEDUC (1° a 6° Básico)

EDU21 ha investigado exhaustivamente los **Objetivos de Aprendizaje del currículum chileno** para desarrollar evaluaciones gamificadas coherentes:

#### 📊 **Asignaturas del Currículum Chileno - Estado de Investigación:**

**🎯 PRIORIDAD ALTA (Fundamentales):**
- ✅ **Matemáticas (MAT)**: OAs de 1° a 6° básico investigados
- ✅ **Lenguaje y Comunicación (LEN)**: OAs de 1° a 6° básico investigados
- 🔄 **Ciencias Naturales (CN)**: En investigación activa
- 🔄 **Historia, Geografía y Ciencias Sociales (HIST)**: En investigación activa

**🎯 PRIORIDAD MEDIA (Complementarias):**
- 🔄 **Inglés (ING)**: En investigación activa
- 🔄 **Lengua Mapuche**: En investigación activa
- 🔄 **Artes Visuales (ART)**: Pendiente de investigación
- 🔄 **Música (MUS)**: Pendiente de investigación
- 🔄 **Tecnología (TEC)**: Pendiente de investigación

**🎯 PRIORIDAD BAJA (Especializadas):**
- 🔄 **Educación Física (EF)**: Pendiente de investigación
- 🔄 **Religión (REL)**: Pendiente de investigación
- 🔄 **Orientación (ORI)**: Pendiente de investigación

#### 🎯 **Proceso de Investigación por OA:**
```javascript
const OA_RESEARCH_PROCESS = {
  phase1_analysis: {
    oa_identification: "Identificación del OA específico",
    content_analysis: "Análisis del contenido a enseñar",
    difficulty_assessment: "Evaluación del nivel de dificultad",
    grade_appropriateness: "Adecuación al nivel escolar"
  },
  phase2_design: {
    learning_objectives: "Definición de objetivos de aprendizaje",
    assessment_criteria: "Criterios de evaluación",
    gamification_elements: "Elementos de gamificación",
    interactive_features: "Características interactivas"
  },
  phase3_development: {
    six_experiences: "Desarrollo de 6 experiencias por OA",
    bloom_taxonomy: "Implementación de taxonomía de Bloom",
    coherence_check: "Verificación de coherencia",
    user_experience: "Optimización de experiencia de usuario"
  }
};
```

### 🌸 Taxonomía de Bloom Implementada

```javascript
const BLOOM_LEVELS = {
  REMEMBER: {
    description: "Recordar información básica del OA",
    evaluation_type: "Identificación y reconocimiento",
    interactive_features: ["Selección múltiple", "Emparejamiento", "Memoria"]
  },
  UNDERSTAND: {
    description: "Comprender conceptos del OA",
    evaluation_type: "Comprensión y explicación",
    interactive_features: ["Clasificación", "Organización", "Comparación"]
  },
  APPLY: {
    description: "Aplicar conocimiento del OA en contextos reales",
    evaluation_type: "Aplicación práctica",
    interactive_features: ["Simulaciones", "Problemas", "Casos prácticos"]
  },
  ANALYZE: {
    description: "Analizar información relacionada con el OA",
    evaluation_type: "Análisis y descomposición",
    interactive_features: ["Análisis de datos", "Identificación de patrones", "Clasificación avanzada"]
  },
  EVALUATE: {
    description: "Evaluar y juzgar basado en el OA",
    evaluation_type: "Evaluación y crítica",
    interactive_features: ["Debates", "Evaluación de argumentos", "Toma de decisiones"]
  },
  CREATE: {
    description: "Crear nuevo contenido basado en el OA",
    evaluation_type: "Creación y síntesis",
    interactive_features: ["Diseño", "Composición", "Construcción"]
  }
};
```

---

## 🎮 EXPERIENCIAS GAMIFICADAS POR OA

### 📋 Ejemplo: OA1 de Matemáticas 1° Básico

Basado en [https://plataformav3.vercel.app/teacher/oa1-games](https://plataformav3.vercel.app/teacher/oa1-games), EDU21 desarrolla **6 experiencias gamificadas** para el OA1: "Contar números del 0 al 100":

#### 🎯 **Las 6 Experiencias del OA1:**

1. **Recordar: Conteo Básico**
   - Descripción: Juego de identificación de números y secuencias simples
   - Taxonomía: REMEMBER
   - Interactividad: Selección múltiple, reconocimiento visual

2. **Comprender: Agrupación**
   - Descripción: Juego para agrupar objetos en decenas y unidades
   - Taxonomía: UNDERSTAND
   - Interactividad: Arrastrar y soltar, clasificación

3. **Aplicar: La Feria**
   - Descripción: Simulación de compras para aplicar el conteo en contexto real
   - Taxonomía: APPLY
   - Interactividad: Simulación, casos prácticos

4. **Analizar: Patrones Numéricos**
   - Descripción: Juego para identificar y completar patrones y secuencias
   - Taxonomía: ANALYZE
   - Interactividad: Análisis de patrones, identificación de secuencias

5. **Evaluar: ¿Cuál es el Mayor?**
   - Descripción: Juego de comparación de cantidades para tomar decisiones
   - Taxonomía: EVALUATE
   - Interactividad: Comparación, toma de decisiones

6. **Crear: Diseña tu Secuencia**
   - Descripción: Juego para que los estudiantes creen sus propias secuencias numéricas
   - Taxonomía: CREATE
   - Interactividad: Diseño, construcción, creación

### 🎮 Características de las Experiencias

```javascript
const GAMIFIED_EXPERIENCE_FEATURES = {
  coherence: {
    oa_alignment: "Alineación directa con el OA específico",
    content_relevance: "Contenido relevante al OA",
    difficulty_appropriateness: "Dificultad apropiada al nivel"
  },
  interactivity: {
    device_compatibility: "Compatible con tablet, PC, pantallas interactivas",
    touch_optimized: "Optimizado para interacción táctil",
    responsive_design: "Diseño responsivo para múltiples dispositivos"
  },
  gamification: {
    immediate_feedback: "Feedback inmediato y constructivo",
    progress_tracking: "Seguimiento de progreso",
    achievement_system: "Sistema de logros y recompensas",
    motivation_elements: "Elementos motivacionales"
  },
  learning_effectiveness: {
    active_participation: "Participación activa del estudiante",
    knowledge_demonstration: "Demostración clara de aprendizaje",
    skill_development: "Desarrollo de habilidades específicas"
  }
};
```

---

## 👨‍👩‍👧‍👦 EXPERIENCIA DE PARIENTAJE (PARENTING)

### 🎯 Objetivo: Involucrar a las Familias

EDU21 busca crear **experiencias de parientaje** donde las familias puedan:

#### 📊 **Dashboard para Padres/Apoderados**
```javascript
const PARENTING_FEATURES = {
  progress_tracking: {
    oa_progress: "Progreso por OA específico",
    subject_performance: "Rendimiento por asignatura",
    skill_development: "Desarrollo de habilidades específicas"
  },
  communication: {
    teacher_messages: "Mensajes de profesores sobre OAs",
    achievement_sharing: "Compartir logros en OAs",
    homework_help: "Ayuda con tareas relacionadas a OAs"
  },
  gamification: {
    family_challenges: "Desafíos familiares por OA",
    reward_system: "Sistema de recompensas familiar",
    learning_journey: "Viaje de aprendizaje familiar"
  }
};
```

#### 🎮 **Experiencias Familiares por OA**
- **Family OA Challenge**: Padres e hijos trabajan juntos en OAs específicos
- **Homework Helper**: Juegos que refuerzan OAs vistos en clase
- **Achievement Sharing**: Compartir logros en OAs específicos
- **Learning Journey**: Seguimiento del progreso familiar por OA

---

## 🔬 INVESTIGACIÓN Y DESARROLLO DE NUEVAS EXPERIENCIAS

### 🎯 Áreas de Investigación Actual

#### 1. **Metodologías Activas de Enseñanza**
```javascript
const ACTIVE_LEARNING_RESEARCH = {
  student_engagement: {
    interactive_methods: "Métodos interactivos de enseñanza",
    hands_on_activities: "Actividades prácticas",
    collaborative_learning: "Aprendizaje colaborativo"
  },
  technology_integration: {
    interactive_displays: "Uso de pantallas interactivas",
    tablet_optimization: "Optimización para tablets",
    digital_whiteboards: "Pizarras digitales interactivas"
  },
  subject_specific_methods: {
    mathematics: "Métodos efectivos para enseñar matemáticas",
    language: "Métodos para lenguaje y comunicación",
    sciences: "Métodos para ciencias naturales"
  }
};
```

#### 2. **Experiencias de Aprendizaje (no solo evaluación)**
```javascript
const LEARNING_EXPERIENCES = {
  discovery_learning: {
    description: "Aprendizaje por descubrimiento",
    implementation: "Experiencias que permiten explorar conceptos",
    benefits: "Comprensión profunda y retención"
  },
  project_based_learning: {
    description: "Aprendizaje basado en proyectos",
    implementation: "Proyectos que integran múltiples OAs",
    benefits: "Aplicación práctica y contextualizada"
  },
  inquiry_based_learning: {
    description: "Aprendizaje basado en indagación",
    implementation: "Preguntas que guían el aprendizaje",
    benefits: "Desarrollo de pensamiento crítico"
  }
};
```

#### 3. **Interactividad Avanzada**
```javascript
const ADVANCED_INTERACTIVITY = {
  multi_device_support: {
    tablets: "Optimización para tablets educativas",
    interactive_displays: "Pantallas interactivas en aula",
    digital_whiteboards: "Pizarras digitales interactivas"
  },
  touch_optimization: {
    gesture_recognition: "Reconocimiento de gestos",
    multi_touch: "Soporte multi-touch",
    haptic_feedback: "Feedback háptico"
  },
  accessibility: {
    universal_design: "Diseño universal para el aprendizaje",
    assistive_technology: "Tecnología asistiva",
    inclusive_features: "Características inclusivas"
  }
};
```

---

## 📈 EXPANSIÓN A NUEVAS ASIGNATURAS

### 🎯 Visión de Crecimiento

#### 📚 **Asignaturas del Currículum Chileno - Priorización por Importancia**

**🎯 PRIORIDAD ALTA (Asignaturas Fundamentales):**
- ✅ **Matemáticas (MAT)**: OAs de 1° a 6° básico investigados
- ✅ **Lenguaje y Comunicación (LEN)**: OAs de 1° a 6° básico investigados
- 🔄 **Ciencias Naturales (CN)**: En investigación activa
- 🔄 **Historia, Geografía y Ciencias Sociales (HIST)**: En investigación activa

**🎯 PRIORIDAD MEDIA (Asignaturas Complementarias):**
- 🔄 **Inglés (ING)**: En investigación activa
- 🔄 **Lengua Mapuche**: En investigación activa
- 🔄 **Artes Visuales (ART)**: Pendiente de investigación
- 🔄 **Música (MUS)**: Pendiente de investigación
- 🔄 **Tecnología (TEC)**: Pendiente de investigación

**🎯 PRIORIDAD BAJA (Asignaturas Especializadas):**
- 🔄 **Educación Física (EF)**: Pendiente de investigación
- 🔄 **Religión (REL)**: Pendiente de investigación
- 🔄 **Orientación (ORI)**: Pendiente de investigación

#### 🚀 **Metodologías por Asignatura - Currículum Completo**

**🎯 PRIORIDAD ALTA - Asignaturas Fundamentales:**
```javascript
const HIGH_PRIORITY_SUBJECTS = {
  MATEMATICAS: {
    focus: "Pensamiento matemático y resolución de problemas",
    methods: ["Manipulativos virtuales", "Simulaciones matemáticas", "Problemas contextualizados"],
    interactive_features: ["Calculadoras virtuales", "Geometría dinámica", "Gráficos interactivos"]
  },
  LENGUAJE_COMUNICACION: {
    focus: "Comunicación efectiva y pensamiento crítico",
    methods: ["Lectura interactiva", "Escritura colaborativa", "Análisis de textos"],
    interactive_features: ["Textos interactivos", "Herramientas de escritura", "Debates virtuales"]
  },
  CIENCIAS_NATURALES: {
    focus: "Investigación científica y pensamiento crítico",
    methods: ["Experimentos virtuales", "Observación científica", "Análisis de datos"],
    interactive_features: ["Laboratorios virtuales", "Simulaciones científicas", "Análisis de datos"]
  },
  HISTORIA_GEOGRAFIA: {
    focus: "Análisis histórico y pensamiento crítico",
    methods: ["Análisis de fuentes", "Construcción de narrativas", "Debates históricos"],
    interactive_features: ["Líneas de tiempo interactivas", "Fuentes históricas digitales", "Debates virtuales"]
  }
};
```

**🎯 PRIORIDAD MEDIA - Asignaturas Complementarias:**
```javascript
const MEDIUM_PRIORITY_SUBJECTS = {
  INGLES: {
    focus: "Comunicación en inglés y competencia intercultural",
    methods: ["Inmersión lingüística", "Práctica conversacional", "Aprendizaje contextual"],
    interactive_features: ["Conversaciones virtuales", "Pronunciación interactiva", "Juegos de vocabulario"]
  },
  LENGUA_MAPUCHE: {
    focus: "Preservación cultural y competencia lingüística",
    methods: ["Inmersión cultural", "Aprendizaje contextual", "Transmisión oral"],
    interactive_features: ["Narrativas interactivas", "Pronunciación guiada", "Contextos culturales"]
  },
  ARTES_VISUALES: {
    focus: "Expresión artística y creatividad visual",
    methods: ["Creación digital", "Análisis de obras", "Proyectos artísticos"],
    interactive_features: ["Herramientas de dibujo digital", "Galerías virtuales", "Tutoriales interactivos"]
  },
  MUSICA: {
    focus: "Expresión musical y apreciación artística",
    methods: ["Composición digital", "Análisis musical", "Práctica instrumental virtual"],
    interactive_features: ["Instrumentos virtuales", "Composición digital", "Análisis de partituras"]
  },
  TECNOLOGIA: {
    focus: "Pensamiento computacional y competencias digitales",
    methods: ["Programación básica", "Diseño digital", "Proyectos tecnológicos"],
    interactive_features: ["Entornos de programación", "Herramientas de diseño", "Simulaciones tecnológicas"]
  }
};
```

**🎯 PRIORIDAD BAJA - Asignaturas Especializadas:**
```javascript
const LOW_PRIORITY_SUBJECTS = {
  EDUCACION_FISICA: {
    focus: "Desarrollo físico y hábitos saludables",
    methods: ["Actividades físicas virtuales", "Educación para la salud", "Deportes digitales"],
    interactive_features: ["Simulaciones deportivas", "Rutinas de ejercicio", "Monitoreo de actividad"]
  },
  RELIGION: {
    focus: "Formación valórica y espiritual",
    methods: ["Reflexión ética", "Análisis de valores", "Diálogo interreligioso"],
    interactive_features: ["Narrativas interactivas", "Debates valóricos", "Recursos multimedia"]
  },
  ORIENTACION: {
    focus: "Desarrollo personal y social",
    methods: ["Autoconocimiento", "Habilidades sociales", "Proyecto de vida"],
    interactive_features: ["Tests interactivos", "Simulaciones sociales", "Herramientas de reflexión"]
  }
};
```

---

## 🎮 SISTEMA DE GAMIFICACIÓN AVANZADO

### 🏆 Sistema de Recompensas por OA

```javascript
const OA_GAMIFICATION_SYSTEM = {
  points: {
    oa_mastery: 50,           // Dominio completo del OA
    bloom_level_completion: 25, // Completar nivel de Bloom
    family_participation: 15,   // Participación familiar
    continuous_improvement: 10  // Mejora continua
  },
  achievements: {
    oa_expert: "🎓 Experto en OA",
    bloom_master: "🌸 Maestro de Bloom",
    family_champion: "👨‍👩‍👧‍👦 Campeón Familiar",
    subject_specialist: "📚 Especialista en Asignatura"
  },
  levels: {
    oa_beginner: "🌱 Iniciando OA",
    oa_learner: "📚 Aprendiendo OA",
    oa_practitioner: "🎯 Practicando OA",
    oa_master: "👑 Maestro del OA"
  }
};
```

### 🎨 Sistema de Personalización por OA

```javascript
const OA_PERSONALIZATION = {
  learning_paths: {
    oa_based_progression: "Progresión basada en OAs",
    skill_focused_tracking: "Seguimiento de habilidades específicas",
    adaptive_difficulty: "Dificultad adaptativa por OA"
  },
  family_integration: {
    oa_family_goals: "Metas familiares por OA",
    collaborative_achievements: "Logros colaborativos por OA",
    progress_celebration: "Celebración de progreso por OA"
  }
};
```

---

## 🔬 METODOLOGÍA DE INVESTIGACIÓN

### 📊 Proceso de Investigación de OAs

```javascript
const OA_RESEARCH_METHODOLOGY = {
  phase1_oa_analysis: {
    mineduc_research: "Investigación exhaustiva de OAs MINEDUC",
    content_mapping: "Mapeo de contenido por OA",
    difficulty_assessment: "Evaluación de dificultad por nivel"
  },
  phase2_experience_design: {
    six_experiences: "Diseño de 6 experiencias por OA",
    bloom_integration: "Integración de taxonomía de Bloom",
    coherence_verification: "Verificación de coherencia"
  },
  phase3_development: {
    interactive_implementation: "Implementación interactiva",
    user_testing: "Pruebas con usuarios",
    iteration: "Iteración basada en feedback"
  },
  phase4_evaluation: {
    learning_outcomes: "Evaluación de resultados de aprendizaje",
    engagement_metrics: "Métricas de engagement",
    family_involvement: "Medición de involucramiento familiar"
  }
};
```

### 🧪 Métricas de Éxito por OA

```javascript
const OA_SUCCESS_METRICS = {
  academic_performance: {
    oa_mastery_rate: "Tasa de dominio del OA",
    skill_development: "Desarrollo de habilidades específicas",
    knowledge_retention: "Retención de conocimiento del OA"
  },
  engagement: {
    oa_completion_rate: "Tasa de finalización del OA",
    time_on_oa: "Tiempo dedicado al OA",
    return_frequency: "Frecuencia de retorno al OA"
  },
  family_involvement: {
    family_oa_participation: "Participación familiar en OA",
    oa_family_communication: "Comunicación familiar sobre OA",
    oa_family_satisfaction: "Satisfacción familiar con OA"
  }
};
```

---

## 🚀 ROADMAP FUTURO

### 🎯 Objetivos a Corto Plazo (6 meses)

1. **Completar Investigación de OAs**
   - Finalizar investigación de OAs de Ciencias Naturales
   - Iniciar investigación de OAs de Historia
   - Comenzar investigación de OAs de Inglés

2. **Desarrollar Experiencias de Aprendizaje**
   - Crear experiencias que enseñen, no solo evalúen
   - Implementar metodologías activas por asignatura
   - Desarrollar interactividad avanzada

3. **Optimizar Interactividad**
   - Optimizar para tablets educativas
   - Implementar soporte para pantallas interactivas
   - Desarrollar características para pizarras digitales

### 🎯 Objetivos a Mediano Plazo (1 año)

1. **Expansión de Asignaturas**
   - Implementar todas las asignaturas del currículum
   - Desarrollar OAs para 1° a 6° básico completo
   - Crear experiencias para asignaturas especializadas

2. **Metodologías Avanzadas**
   - Implementar aprendizaje basado en proyectos
   - Desarrollar experiencias de descubrimiento
   - Crear simulaciones educativas avanzadas

3. **Tecnologías Emergentes**
   - Integración de IA para personalización
   - Análisis predictivo de rendimiento por OA
   - Experiencias adaptativas avanzadas

### 🎯 Objetivos a Largo Plazo (3 años)

1. **Plataforma Integral**
   - Todas las asignaturas del currículum chileno
   - OAs completos de 1° a 6° básico
   - Experiencias de aprendizaje y evaluación

2. **Innovación Educativa**
   - Metodologías activas avanzadas
   - Tecnologías interactivas emergentes
   - Experiencias inmersivas educativas

3. **Impacto Nacional**
   - Presencia en colegios de todo Chile
   - Reconocimiento del MINEDUC
   - Transformación de la educación chilena

---

## 📝 CONCLUSIÓN

EDU21 representa una **revolución en la educación gamificada** que combina:

- 🎮 **6 experiencias gamificadas por OA** que evalúan y enseñan
- 👨‍👩‍👧‍👦 **Experiencias de parientaje** que involucran a las familias
- 📚 **Investigación exhaustiva de OAs MINEDUC** de 1° a 6° básico
- 🔬 **Metodologías activas** que fomentan el aprendizaje del siglo 21
- 🌍 **Interactividad avanzada** para múltiples dispositivos

El proyecto está diseñado para ser **coherente, investigable y escalable**, permitiendo la incorporación de nuevas asignaturas y OAs mientras mantiene su enfoque en la **experiencia de aprendizaje integral** que incluye a estudiantes, profesores y familias.

---

*Documentación actualizada: Julio 2025*
*Versión del proyecto: EDU21 v3.0*
*Enfoque: 6 Experiencias Gamificadas por OA - Educación del Siglo 21* 