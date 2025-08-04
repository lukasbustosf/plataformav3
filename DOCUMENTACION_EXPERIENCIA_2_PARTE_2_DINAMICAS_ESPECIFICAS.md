# 🎮 DOCUMENTACIÓN EXPERIENCIA 2 - PARTE 2: DINÁMICAS ESPECÍFICAS

## 🎯 **CONTEXTO**

**Experiencia:** Diseña tu Ciudad Numérica (Project-Based Learning)
**OA:** MA01OA01 - Conteo y numeración hasta 100
**Público:** Niños de 6-7 años (1° básico)

**Propósito:** Documentar las dinámicas específicas de esta experiencia que NO se pueden replicar en otras experiencias, ya que son únicas para este OA y metodología.

---

## 🏗️ **1. DINÁMICA PRINCIPAL: CONSTRUCCIÓN DE CIUDAD NUMÉRICA**

### **🎯 Concepto Central**

La experiencia se basa en la construcción de una ciudad donde cada edificio, carretera y parque tiene un valor numérico específico que debe colocarse en secuencias correctas para completar distritos.

### **🏘️ Estructura de Distritos**

```typescript
// Configuración específica de distritos para OA1
const DISTRICTS_CONFIG = {
  residential: {
    name: 'Distrito Residencial',
    type: 'residential',
    required_buildings: 20,
    required_roads: 5,
    sequence_pattern: 'consecutive',
    number_range: [1, 20],
    challenge: 'Construye casas en orden del 1 al 20'
  },
  commercial: {
    name: 'Distrito Comercial',
    type: 'commercial',
    required_buildings: 10,
    required_roads: 8,
    sequence_pattern: 'skip_counting',
    number_range: [10, 50],
    step: 10,
    challenge: 'Construye tiendas contando de 10 en 10'
  },
  park: {
    name: 'Parque Central',
    type: 'park',
    required_roads: 3,
    required_parks: 5,
    sequence_pattern: 'mixed',
    number_range: [1, 100],
    challenge: 'Organiza el parque con números del 1 al 100'
  }
};
```

### **🏠 Tipos de Componentes Específicos**

```typescript
// Tipos de edificios - ESPECÍFICOS PARA CIUDAD NUMÉRICA
const BUILDING_TYPES = [
  // DISTRITO RESIDENCIAL: Casas del 1 al 20
  { type: 'residential', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], icon: '🏠', color: '#FF6B35', label: 'Casa Residencial' },
  
  // DISTRITO COMERCIAL: Tiendas de 10 en 10
  { type: 'commercial', numbers: [10, 20, 30, 40, 50], icon: '🏪', color: '#FFB347', label: 'Tienda Comercial' }
];

// Tipos de carreteras - ESPECÍFICOS PARA CIUDAD NUMÉRICA
const ROAD_TYPES = [
  // DISTRITO RESIDENCIAL: Carreteras para conectar casas
  { type: 'residential', icon: '⬆️', color: '#6C757D', label: 'Carretera Residencial' },
  
  // DISTRITO COMERCIAL: Carreteras para conectar tiendas
  { type: 'commercial', icon: '⬇️', color: '#6C757D', label: 'Carretera Comercial' },
  
  // PARQUE CENTRAL: Carreteras para el parque
  { type: 'park', icon: '➕', color: '#6C757D', label: 'Carretera del Parque' }
];

// Tipos de parques - SOLO PARA PARQUE CENTRAL
const PARK_TYPES = [
  { type: 'park', icon: '🎠', color: '#48BB78', label: 'Parque Infantil' },
  { type: 'park', icon: '🌳', color: '#48BB78', label: 'Jardín' },
  { type: 'park', icon: '⛲', color: '#48BB78', label: 'Fuente' }
];
```

---

## 🔢 **2. LÓGICA DE VALIDACIÓN DE SECUENCIAS NUMÉRICAS**

### **✅ Validación de Secuencias Consecutivas (Residencial)**

```typescript
// Función específica para validar secuencia del 1 al 20
const validateResidentialSequence = (buildings: any[]) => {
  const numbers = buildings.map(b => b.number).sort((a, b) => a - b);
  const expectedSequence = Array.from({length: 20}, (_, i) => i + 1);
  const correctNumbers = numbers.filter(n => expectedSequence.includes(n));
  
  return {
    correct: correctNumbers.length,
    total: Math.min(buildings.length, 20),
    accuracy: (correctNumbers.length / Math.min(buildings.length, 20)) * 100
  };
};
```

### **✅ Validación de Secuencias de 10 en 10 (Comercial)**

```typescript
// Función específica para validar secuencia de 10 en 10
const validateCommercialSequence = (buildings: any[]) => {
  const numbers = buildings.map(b => b.number);
  const expectedSequence = [10, 20, 30, 40, 50];
  const correctNumbers = numbers.filter(n => expectedSequence.includes(n));
  
  return {
    correct: correctNumbers.length,
    total: Math.min(buildings.length, 5),
    accuracy: (correctNumbers.length / Math.min(buildings.length, 5)) * 100
  };
};
```

### **✅ Validación de Secuencias Mixtas (Parque)**

```typescript
// Función específica para validar secuencias mixtas en parque
const validateParkSequence = (components: any[]) => {
  // Lógica específica para parque central
  const roads = components.filter(c => c.type === 'road');
  const parks = components.filter(c => c.type === 'park');
  
  return {
    roadsRequired: roads.length >= 3,
    parksRequired: parks.length >= 5,
    totalComponents: components.length,
    isComplete: roads.length >= 3 && parks.length >= 5
  };
};
```

---

## 🎯 **3. SISTEMA DE PROGRESIÓN POR DISTRITOS**

### **🔓 Lógica de Desbloqueo**

```typescript
// Sistema de progresión específico para ciudad numérica
const DISTRICT_PROGRESSION = {
  residential: {
    status: 'available', // Siempre disponible
    requirements: {
      buildings: 20,
      roads: 5,
      accuracy: 85
    },
    unlockNext: 'commercial'
  },
  
  commercial: {
    status: 'locked', // Requiere completar residencial
    requirements: {
      buildings: 10,
      roads: 8,
      accuracy: 85
    },
    unlockNext: 'park'
  },
  
  park: {
    status: 'locked', // Requiere completar comercial
    requirements: {
      roads: 3,
      parks: 5
    },
    unlockNext: null // Experiencia completa
  }
};

// Función para verificar desbloqueo
const checkDistrictUnlock = (completedDistrict: string) => {
  switch(completedDistrict) {
    case 'residential':
      return { unlock: 'commercial', message: '¡Distrito Comercial desbloqueado!' };
    case 'commercial':
      return { unlock: 'park', message: '¡Parque Central desbloqueado!' };
    case 'park':
      return { unlock: null, message: '¡Ciudad completa!' };
    default:
      return { unlock: null, message: '' };
  }
};
```

---

## 🏆 **4. LOGROS ESPECÍFICOS DE CIUDAD NUMÉRICA**

### **🎉 Logros Únicos de esta Experiencia**

```typescript
// Logros específicos que no se pueden replicar en otras experiencias
const CITY_SPECIFIC_ACHIEVEMENTS = [
  {
    id: 'primer-edificio',
    title: 'Primera Casa',
    description: 'Construye tu primer edificio en la ciudad',
    icon: '🏠',
    trigger: 'first_building_placed',
    reward: 'Desbloquea más tipos de edificios'
  },
  
  {
    id: 'distrito-residencial',
    title: 'Distrito Residencial',
    description: 'Completa el distrito residencial con 20 casas en orden',
    icon: '🏘️',
    trigger: 'residential_district_complete',
    reward: 'Desbloquea el distrito comercial'
  },
  
  {
    id: 'distrito-comercial',
    title: 'Distrito Comercial',
    description: 'Completa el distrito comercial con tiendas de 10 en 10',
    icon: '🏪',
    trigger: 'commercial_district_complete',
    reward: 'Desbloquea el parque central'
  },
  
  {
    id: 'parque-central',
    title: 'Parque Central',
    description: 'Completa el parque central con carreteras y parques',
    icon: '🌳',
    trigger: 'park_district_complete',
    reward: '¡Ciudad completa!'
  },
  
  {
    id: 'maestro-constructor',
    title: 'Maestro Constructor',
    description: 'Completa toda la ciudad con precisión perfecta',
    icon: '👑',
    trigger: 'all_districts_complete',
    reward: '¡Eres el alcalde de la ciudad!'
  }
];
```

---

## 💡 **5. PISTAS DINÁMICAS ESPECÍFICAS**

### **🔍 Pistas por Distrito y Modo**

```typescript
// Pistas específicas para ciudad numérica
const CITY_SPECIFIC_HINTS = {
  residential: {
    building: {
      empty: "🏠 DISTRITO RESIDENCIAL: ¡Construye casas del 1 al 20! Empieza con la casa número 1.",
      inProgress: (count: number, accuracy: number) => 
        `🏠 DISTRITO RESIDENCIAL: Tienes ${count}/20 casas. Construye las casas en orden: 1, 2, 3, 4, 5... hasta 20. Precisión: ${Math.round(accuracy)}% (necesitas 85%).`,
      complete: (accuracy: number) => 
        `🏠 ¡Excelente! Distrito residencial completo. Precisión: ${Math.round(accuracy)}%.`
    },
    road: {
      empty: "🛣️ DISTRITO RESIDENCIAL: Construye 5 carreteras para conectar las casas.",
      inProgress: (count: number) => 
        `🛣️ DISTRITO RESIDENCIAL: Tienes ${count}/5 carreteras. ¡Conecta más casas!`,
      complete: "🛣️ ¡Perfecto! Carreteras residenciales completas."
    }
  },
  
  commercial: {
    building: {
      empty: "🏪 DISTRITO COMERCIAL: Construye tiendas contando de 10 en 10: 10, 20, 30, 40, 50.",
      inProgress: (count: number, accuracy: number) => 
        `🏪 DISTRITO COMERCIAL: Tienes ${count}/5 tiendas. Construye tiendas: 10, 20, 30, 40, 50. Precisión: ${Math.round(accuracy)}% (necesitas 85%).`,
      complete: (accuracy: number) => 
        `🏪 ¡Excelente! Distrito comercial completo. Precisión: ${Math.round(accuracy)}%.`
    },
    road: {
      empty: "🛣️ DISTRITO COMERCIAL: Construye 8 carreteras para conectar las tiendas.",
      inProgress: (count: number) => 
        `🛣️ DISTRITO COMERCIAL: Tienes ${count}/8 carreteras. ¡Conecta más tiendas!`,
      complete: "🛣️ ¡Perfecto! Carreteras comerciales completas."
    }
  },
  
  park: {
    building: {
      empty: "🌳 PARQUE CENTRAL: No se construyen edificios aquí.",
      inProgress: () => "🌳 PARQUE CENTRAL: Este distrito es para parques y carreteras.",
      complete: () => "🌳 PARQUE CENTRAL: ¡Perfecto!"
    },
    road: {
      empty: "🛣️ PARQUE CENTRAL: Construye 3 carreteras para el parque.",
      inProgress: (count: number) => 
        `🛣️ PARQUE CENTRAL: Tienes ${count}/3 carreteras. ¡Conecta el parque!`,
      complete: "🛣️ ¡Perfecto! Carreteras del parque completas."
    },
    park: {
      empty: "🌳 PARQUE CENTRAL: Construye 5 parques para completar el parque central.",
      inProgress: (count: number) => 
        `🌳 PARQUE CENTRAL: Tienes ${count}/5 parques. ¡Haz el parque más bonito!`,
      complete: "🌳 ¡Excelente! Parque central completo."
    }
  }
};
```

---

## 🎨 **6. ELEMENTOS VISUALES ESPECÍFICOS**

### **🏗️ Iconos y Representaciones Únicas**

```typescript
// Iconos específicos para ciudad numérica
const CITY_SPECIFIC_ICONS = {
  buildings: {
    residential: '🏠', // Casa residencial
    commercial: '🏪'   // Tienda comercial
  },
  roads: {
    residential: '⬆️', // Carretera residencial
    commercial: '⬇️',  // Carretera comercial
    park: '➕'         // Carretera del parque
  },
  parks: {
    playground: '🎠',  // Parque infantil
    garden: '🌳',      // Jardín
    fountain: '⛲'     // Fuente
  },
  districts: {
    residential: '🏘️',
    commercial: '🏪',
    park: '🌳'
  }
};
```

### **🎨 Colores Específicos por Distrito**

```css
/* Colores específicos para distritos de ciudad numérica */
.building-placed[data-type="residential"] {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
  border: 2px solid #FF6B35;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.building-placed[data-type="commercial"] {
  background: linear-gradient(135deg, #FFB347 0%, #FFC75F 100%);
  border: 2px solid #FFB347;
  box-shadow: 0 4px 15px rgba(255, 179, 71, 0.3);
}

.road-placed[data-type="residential"] {
  background: linear-gradient(135deg, #6C757D 0%, #8E9CAF 100%);
  border: 2px solid #6C757D;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.road-placed[data-type="commercial"] {
  background: linear-gradient(135deg, #6C757D 0%, #8E9CAF 100%);
  border: 2px solid #6C757D;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.park-placed[data-type="park"] {
  background: linear-gradient(135deg, #48BB78 0%, #68D391 100%);
  border: 2px solid #48BB78;
  box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
}
```

---

## 📊 **7. MÉTRICAS ESPECÍFICAS DE CIUDAD NUMÉRICA**

### **🏗️ Métricas de Construcción**

```typescript
// Métricas específicas para ciudad numérica
const CITY_SPECIFIC_METRICS = {
  construction: {
    totalBuildings: 0,
    totalRoads: 0,
    totalParks: 0,
    districtsCompleted: 0,
    perfectSequences: 0
  },
  
  accuracy: {
    residentialAccuracy: 0,
    commercialAccuracy: 0,
    overallAccuracy: 0
  },
  
  time: {
    timePerDistrict: {
      residential: 0,
      commercial: 0,
      park: 0
    },
    totalConstructionTime: 0
  },
  
  progression: {
    currentDistrict: 'residential',
    unlockedDistricts: ['residential'],
    completedDistricts: []
  }
};
```

### **📈 Cálculos Específicos**

```typescript
// Cálculos específicos para ciudad numérica
const CITY_SPECIFIC_CALCULATIONS = {
  // Calcular precisión de secuencia residencial
  calculateResidentialAccuracy: (buildings: any[]) => {
    const validation = validateResidentialSequence(buildings);
    return validation.accuracy;
  },
  
  // Calcular precisión de secuencia comercial
  calculateCommercialAccuracy: (buildings: any[]) => {
    const validation = validateCommercialSequence(buildings);
    return validation.accuracy;
  },
  
  // Calcular progreso general de la ciudad
  calculateCityProgress: (districts: any[]) => {
    const completed = districts.filter(d => d.completed).length;
    return (completed / districts.length) * 100;
  },
  
  // Verificar si la ciudad está completa
  isCityComplete: (districts: any[]) => {
    return districts.every(d => d.completed);
  }
};
```

---

## 🎮 **8. MECÁNICAS DE JUEGO ESPECÍFICAS**

### **🖱️ Interacción de Colocación**

```typescript
// Mecánicas específicas de colocación para ciudad numérica
const CITY_PLACEMENT_MECHANICS = {
  // Validar si se puede colocar un componente
  canPlaceComponent: (x: number, y: number, component: any, existingComponents: any[]) => {
    // Verificar que la celda no esté ocupada
    const cellOccupied = existingComponents.some(c => c.x === x && c.y === y);
    if (cellOccupied) return false;
    
    // Verificar límites del tablero
    if (x < 0 || x >= 20 || y < 0 || y >= 20) return false;
    
    return true;
  },
  
  // Colocar componente y actualizar progreso
  placeComponent: (x: number, y: number, component: any, currentDistrict: string) => {
    const newComponent = {
      id: Date.now(),
      x, y,
      type: currentDistrict,
      componentType: component.type,
      icon: component.icon,
      number: component.number || null
    };
    
    // Actualizar progreso del distrito
    updateDistrictProgress(currentDistrict, newComponent);
    
    // Verificar si se completa el distrito
    checkDistrictCompletion(currentDistrict);
    
    return newComponent;
  },
  
  // Actualizar progreso del distrito
  updateDistrictProgress: (district: string, component: any) => {
    // Lógica específica para actualizar progreso
    const districtComponents = getDistrictComponents(district);
    
    switch(district) {
      case 'residential':
        if (component.componentType === 'building') {
          districtComponents.buildings.push(component);
        } else if (component.componentType === 'road') {
          districtComponents.roads.push(component);
        }
        break;
      case 'commercial':
        if (component.componentType === 'building') {
          districtComponents.buildings.push(component);
        } else if (component.componentType === 'road') {
          districtComponents.roads.push(component);
        }
        break;
      case 'park':
        if (component.componentType === 'road') {
          districtComponents.roads.push(component);
        } else if (component.componentType === 'park') {
          districtComponents.parks.push(component);
        }
        break;
    }
  }
};
```

### **✅ Validación de Completación**

```typescript
// Validación específica de completación de distritos
const DISTRICT_COMPLETION_VALIDATION = {
  residential: (components: any[]) => {
    const buildings = components.filter(c => c.componentType === 'building');
    const roads = components.filter(c => c.componentType === 'road');
    
    const buildingValidation = validateResidentialSequence(buildings);
    const roadsComplete = roads.length >= 5;
    
    return {
      complete: buildingValidation.accuracy >= 85 && roadsComplete,
      buildingsComplete: buildingValidation.accuracy >= 85,
      roadsComplete: roadsComplete,
      accuracy: buildingValidation.accuracy
    };
  },
  
  commercial: (components: any[]) => {
    const buildings = components.filter(c => c.componentType === 'building');
    const roads = components.filter(c => c.componentType === 'road');
    
    const buildingValidation = validateCommercialSequence(buildings);
    const roadsComplete = roads.length >= 8;
    
    return {
      complete: buildingValidation.accuracy >= 85 && roadsComplete,
      buildingsComplete: buildingValidation.accuracy >= 85,
      roadsComplete: roadsComplete,
      accuracy: buildingValidation.accuracy
    };
  },
  
  park: (components: any[]) => {
    const roads = components.filter(c => c.componentType === 'road');
    const parks = components.filter(c => c.componentType === 'park');
    
    const roadsComplete = roads.length >= 3;
    const parksComplete = parks.length >= 5;
    
    return {
      complete: roadsComplete && parksComplete,
      roadsComplete: roadsComplete,
      parksComplete: parksComplete
    };
  }
};
```

---

## 🎯 **9. CONTENIDO ESPECÍFICO DE BIENVENIDA**

### **👷‍♂️ Mensajes Específicos del Profesor Carlos**

```typescript
// Contenido específico de bienvenida para ciudad numérica
const CITY_WELCOME_CONTENT = {
  steps: [
    {
      title: "¡Hola Arquitecto! 👷‍♂️",
      message: "Soy el Profesor Carlos y te voy a enseñar a construir una ciudad numérica. ¿Estás listo para esta aventura?",
      icon: "👷‍♂️",
      action: "¡Sí, estoy listo!"
    },
    {
      title: "🏗️ Tu Misión",
      message: "Vas a construir una ciudad completa con casas, tiendas y parques. Pero hay un secreto: cada edificio tiene un número especial que debes colocar en orden.",
      icon: "🏗️",
      action: "Entiendo"
    },
    {
      title: "🏠 Distrito Residencial",
      message: "Empezamos con las casas. Debes colocar 20 casas en orden: 1, 2, 3, 4, 5... hasta llegar al 20. ¡Como contar los escalones de una escalera!",
      icon: "🏠",
      action: "¡Genial!"
    },
    {
      title: "🏪 Distrito Comercial", 
      message: "Luego construiremos tiendas. Aquí contamos de 10 en 10: 10, 20, 30, 40, 50. ¡Como contar monedas de 10!",
      icon: "🏪",
      action: "¡Perfecto!"
    },
    {
      title: "🌳 Parque Central",
      message: "Finalmente, construiremos parques y carreteras para conectar todo. ¡Haremos la ciudad más bonita!",
      icon: "🌳",
      action: "¡Me encanta!"
    },
    {
      title: "🎮 Cómo Jugar",
      message: "1. Selecciona el modo de construcción (🏠 Construir, 🛣️ Carreteras, 🌳 Parques)\n2. Elige el tipo de edificio en la paleta\n3. Haz clic en el tablero para colocarlo\n4. ¡Completa cada distrito para desbloquear el siguiente!",
      icon: "🎮",
      action: "¡Empezar a construir!"
    }
  ]
};
```

---

## 📋 **10. ELEMENTOS ÚNICOS QUE NO SE PUEDEN REPLICAR**

### **❌ Elementos Específicos de Ciudad Numérica:**

1. **Concepto de Construcción de Ciudad** - No aplicable a otras experiencias
2. **Sistema de Distritos** - Específico para esta experiencia
3. **Secuencias Numéricas Específicas** - 1-20, 10-50, etc.
4. **Tipos de Componentes** - Edificios, carreteras, parques
5. **Validación de Secuencias** - Lógica específica para cada distrito
6. **Progresión por Distritos** - Desbloqueo específico
7. **Logros de Ciudad** - Primer edificio, distritos, etc.
8. **Pistas Específicas** - Basadas en construcción de ciudad
9. **Métricas de Construcción** - Edificios, carreteras, parques
10. **Contenido del Profesor Carlos** - Específico para ciudad numérica

### **✅ Elementos que SÍ se pueden replicar:**

1. **Estructura de bienvenida** - Multi-paso con overlay
2. **Sistema de voz** - Funciones speak() y playSound()
3. **Paleta de colores** - Variables CSS y gradientes
4. **Checklist de logros** - Estructura de datos
5. **Sistema de pistas** - Lógica de generación
6. **Reportes detallados** - Estructuras de datos
7. **Controles laterales** - Layout y CSS
8. **Sistema responsive** - Breakpoints
9. **Animaciones** - Keyframes y transiciones
10. **Estados de UI** - Loading, error, success

---

## 🎯 **CONCLUSIÓN**

Esta documentación establece claramente la diferencia entre:

- **Elementos estandarizables** (Parte 1): UX/UI que se puede replicar en todas las experiencias
- **Dinámicas específicas** (Parte 2): Lógica única de cada experiencia que NO se puede replicar

**Importante:** Al crear nuevas experiencias, usar los elementos de la Parte 1 como base y desarrollar las dinámicas específicas de la Parte 2 según el OA y metodología correspondiente. 