'use client';

import React, { useState, useEffect, useCallback } from 'react';
import './CityBuilder.css';

interface CityProject {
  project_id: string;
  session_id: string;
  city_name: string;
  current_district: string;
  total_buildings: number;
  total_roads: number;
  total_parks: number;
  progress_percentage: number;
  is_completed: boolean;
  city_layout: {
    buildings: Array<{
      id: number;
      x: number;
      y: number;
      number: number;
      type: string;
      buildingType?: string;
      icon?: string;
    }>;
    roads: Array<{
      id: number;
      x: number;
      y: number;
      type: string;
      roadType?: string;
      icon?: string;
    }>;
    parks: Array<{
      id: number;
      x: number;
      y: number;
      type: string;
      parkType?: string;
      icon?: string;
    }>;
  };
}

interface District {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'locked' | 'completed';
  required_buildings: number;
  required_roads: number;
  required_parks: number;
}

interface BuildingType {
  type: string;
  numbers: number[];
  icon: string;
  color: string;
  label: string;
}

interface RoadType {
  type: string;
  icon: string;
  color: string;
  label: string;
}

interface ParkType {
  type: string;
  icon: string;
  color: string;
  label: string;
}

const CityBuilder: React.FC = () => {
  // Estados principales
  const [project, setProject] = useState<CityProject | null>(null);
  const [currentDistrict, setCurrentDistrict] = useState('residential');
  const [selectedComponent, setSelectedComponent] = useState<BuildingType | RoadType | ParkType | null>(null);
  const [buildMode, setBuildMode] = useState<'building' | 'road' | 'park'>('building');
  const [grid, setGrid] = useState<Array<Array<any>>>(Array(20).fill(null).map(() => Array(20).fill(null)));
  
  // Estados de gamificación
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [attempts, setAttempts] = useState(3);
  const [learningProgress, setLearningProgress] = useState({
    correctSequences: 0,
    totalAttempts: 0,
    accuracy: 0
  });
  const [challenges, setChallenges] = useState([
    { id: 'primer-edificio', title: 'Primera Casa', completed: false, attempts: 0, accuracy: 0 },
    { id: 'distrito-residencial', title: 'Distrito Residencial', completed: false, attempts: 0, accuracy: 0 },
    { id: 'distrito-comercial', title: 'Distrito Comercial', completed: false, attempts: 0, accuracy: 0 },
    { id: 'parque-central', title: 'Parque Central', completed: false, attempts: 0, accuracy: 0 },
    { id: 'maestro-constructor', title: 'Maestro Constructor', completed: false, attempts: 0, accuracy: 0 }
  ]);
  
  // Estados de UX
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showTeacher, setShowTeacher] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [hintMinimized, setHintMinimized] = useState(false);
  const [checklistMinimized, setChecklistMinimized] = useState(false);
  const [showActivityReport, setShowActivityReport] = useState(false);
  const [reportType, setReportType] = useState<'basic' | 'child' | 'parent' | 'teacher'>('basic');
  
  // Estados de bienvenida guiada
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [welcomeSteps] = useState([
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
  ]);
  
  // Estados de familia
  const [familyMode, setFamilyMode] = useState(false);
  const [familyActivities, setFamilyActivities] = useState<any[]>([]);
  
  // Funciones de voz (declaradas antes de las funciones que las usan)
  const speak = useCallback((text: string) => {
    if (speechEnabled && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [speechEnabled]);
  
  // Funciones para la bienvenida guiada
  const handleWelcomeNext = useCallback(() => {
    if (welcomeStep < welcomeSteps.length - 1) {
      setWelcomeStep(welcomeStep + 1);
      speak(welcomeSteps[welcomeStep + 1].message);
    } else {
      setShowWelcome(false);
      speak("¡Perfecto! Ahora puedes empezar a construir tu ciudad. ¡Buena suerte, arquitecto!");
    }
  }, [welcomeStep, welcomeSteps, speak]);

  const handleWelcomeSkip = useCallback(() => {
    setShowWelcome(false);
    speak("¡Perfecto! Puedes empezar a construir tu ciudad. ¡Buena suerte!");
  }, [speak]);

  // Función para calcular el estado de los distritos
  const getDistrictStatus = useCallback((districtType: string): 'available' | 'locked' | 'completed' => {
    const residentialCompleted = challenges.find(c => c.id === 'distrito-residencial')?.completed || false;
    const commercialCompleted = challenges.find(c => c.id === 'distrito-comercial')?.completed || false;
    
    switch (districtType) {
      case 'residential':
        return 'available';
      case 'commercial':
        return residentialCompleted ? 'available' : 'locked';
      case 'park':
        return commercialCompleted ? 'available' : 'locked';
      default:
        return 'locked';
    }
  }, [challenges]);

  // Configuración de distritos (dinámica) - REQUISITOS ORIGINALES DESAFIANTES
  const districts: District[] = [
    {
      id: 'residential',
      name: 'Distrito Residencial',
      type: 'residential',
      status: getDistrictStatus('residential'),
      required_buildings: 20,
      required_roads: 5,
      required_parks: 0
    },
    {
      id: 'commercial',
      name: 'Distrito Comercial',
      type: 'commercial',
      status: getDistrictStatus('commercial'),
      required_buildings: 10,
      required_roads: 8,
      required_parks: 0
    },
    {
      id: 'park',
      name: 'Parque Central',
      type: 'park',
      status: getDistrictStatus('park'),
      required_buildings: 0,
      required_roads: 3,
      required_parks: 5
    }
  ].map(district => ({
    ...district,
    status: getDistrictStatus(district.type)
  }));
  
  // Tipos de edificios por distrito - ICONOS DISTINTOS Y CLAROS
  const buildingTypes: BuildingType[] = [
    // DISTRITO RESIDENCIAL: Casas del 1 al 20
    { type: 'residential', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], icon: '🏠', color: '#FF6B35', label: 'Casa Residencial' },
    // DISTRITO COMERCIAL: Tiendas de 10 en 10
    { type: 'commercial', numbers: [10, 20, 30, 40, 50], icon: '🏪', color: '#FFB347', label: 'Tienda Comercial' },
    // PARQUE CENTRAL: No tiene edificios
    { type: 'park', numbers: [], icon: '🌳', color: '#48BB78', label: 'Sin Edificios' }
  ];

  // Tipos de carreteras por distrito - CLARO Y ESPECÍFICO
  const roadTypes: RoadType[] = [
    // DISTRITO RESIDENCIAL: Carreteras para conectar casas
    { type: 'residential', icon: '➡️', color: '#6C757D', label: 'Carretera Residencial' },
    // DISTRITO COMERCIAL: Carreteras para conectar tiendas
    { type: 'commercial', icon: '⬇️', color: '#6C757D', label: 'Carretera Comercial' },
    // PARQUE CENTRAL: Carreteras para el parque
    { type: 'park', icon: '➕', color: '#6C757D', label: 'Carretera del Parque' }
  ];

  // Tipos de parques - SOLO PARA PARQUE CENTRAL
  const parkTypes: ParkType[] = [
    { type: 'park', icon: '🎠', color: '#48BB78', label: 'Parque Infantil' },
    { type: 'park', icon: '🌳', color: '#48BB78', label: 'Jardín' },
    { type: 'park', icon: '⛲', color: '#48BB78', label: 'Fuente' }
  ];
  
  // Función para generar sonidos
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
      }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }, []);
  
  // Función para validar secuencia numérica
  const validateSequence = useCallback((buildings: any[], districtType: string) => {
    if (districtType === 'residential') {
      // Validar secuencia del 1 al 20
      const numbers = buildings.map(b => b.number).sort((a, b) => a - b);
      const expectedSequence = Array.from({length: 20}, (_, i) => i + 1);
      const correctNumbers = numbers.filter(n => expectedSequence.includes(n));
      return {
        correct: correctNumbers.length,
        total: Math.min(buildings.length, 20),
        accuracy: (correctNumbers.length / Math.min(buildings.length, 20)) * 100
      };
    } else if (districtType === 'commercial') {
      // Validar secuencia de 10 en 10
      const numbers = buildings.map(b => b.number);
      const expectedSequence = [10, 20, 30, 40, 50];
      const correctNumbers = numbers.filter(n => expectedSequence.includes(n));
      return {
        correct: correctNumbers.length,
        total: Math.min(buildings.length, 5),
        accuracy: (correctNumbers.length / Math.min(buildings.length, 5)) * 100
      };
    }
    return { correct: 0, total: 0, accuracy: 0 };
  }, []);

  // Función para generar pistas dinámicas - CLARAS Y ESPECÍFICAS
  const generateHint = useCallback(() => {
    if (!project) return "¡Empieza construyendo tu primera casa!";
    
    const buildingsInDistrict = project.city_layout.buildings.filter(b => b.type === currentDistrict);
    const roadsInDistrict = project.city_layout.roads.filter(r => r.type === currentDistrict);
    const parksInDistrict = project.city_layout.parks.filter(p => p.type === currentDistrict);
    
    // PISTAS ESPECÍFICAS POR DISTRITO
    if (currentDistrict === 'residential') {
      if (buildMode === 'building') {
        if (buildingsInDistrict.length === 0) {
          return "🏠 DISTRITO RESIDENCIAL: ¡Construye casas del 1 al 20! Empieza con la casa número 1.";
        } else if (buildingsInDistrict.length < 20) {
          const validation = validateSequence(buildingsInDistrict, 'residential');
          return `🏠 DISTRITO RESIDENCIAL: Tienes ${buildingsInDistrict.length}/20 casas. Construye las casas en orden: 1, 2, 3, 4, 5... hasta 20. Precisión: ${Math.round(validation.accuracy)}% (necesitas 85%).`;
        } else {
          const validation = validateSequence(buildingsInDistrict, 'residential');
          return `🏠 DISTRITO RESIDENCIAL: ¡Perfecto! Tienes las 20 casas. Precisión: ${Math.round(validation.accuracy)}%.`;
        }
      } else if (buildMode === 'road') {
        if (roadsInDistrict.length === 0) {
          return "🛣️ DISTRITO RESIDENCIAL: ¡Construye carreteras para conectar las casas! Necesitas 5 carreteras.";
        } else {
          return `🛣️ DISTRITO RESIDENCIAL: Tienes ${roadsInDistrict.length}/5 carreteras. ¡Conecta más casas!`;
        }
      }
    }
    
    if (currentDistrict === 'commercial') {
      if (buildMode === 'building') {
        if (buildingsInDistrict.length === 0) {
          return "🏪 DISTRITO COMERCIAL: ¡Construye tiendas contando de 10 en 10! Empieza con la tienda número 10.";
        } else if (buildingsInDistrict.length < 10) {
          const validation = validateSequence(buildingsInDistrict, 'commercial');
          return `🏪 DISTRITO COMERCIAL: Tienes ${buildingsInDistrict.length}/10 tiendas. Construye tiendas: 10, 20, 30, 40, 50. Precisión: ${Math.round(validation.accuracy)}% (necesitas 85%).`;
        } else {
          const validation = validateSequence(buildingsInDistrict, 'commercial');
          return `🏪 DISTRITO COMERCIAL: ¡Perfecto! Tienes las 10 tiendas. Precisión: ${Math.round(validation.accuracy)}%.`;
        }
      } else if (buildMode === 'road') {
        if (roadsInDistrict.length === 0) {
          return "🛣️ DISTRITO COMERCIAL: ¡Construye carreteras para conectar las tiendas! Necesitas 8 carreteras.";
        } else {
          return `🛣️ DISTRITO COMERCIAL: Tienes ${roadsInDistrict.length}/8 carreteras. ¡Conecta más tiendas!`;
        }
      }
    }
    
    if (currentDistrict === 'park') {
      if (buildMode === 'road') {
        if (roadsInDistrict.length === 0) {
          return "🛣️ PARQUE CENTRAL: ¡Construye carreteras para el parque! Necesitas 3 carreteras.";
        } else {
          return `🛣️ PARQUE CENTRAL: Tienes ${roadsInDistrict.length}/3 carreteras. ¡Conecta el parque!`;
        }
      } else if (buildMode === 'park') {
        if (parksInDistrict.length === 0) {
          return "🌳 PARQUE CENTRAL: ¡Construye parques! Necesitas 5 parques: infantiles, jardines, fuentes.";
        } else {
          return `🌳 PARQUE CENTRAL: Tienes ${parksInDistrict.length}/5 parques. ¡Construye más parques!`;
        }
      }
    }
    
    return "¡Excelente trabajo! Continúa construyendo tu ciudad.";
  }, [project, currentDistrict, buildMode, validateSequence]);

  // Función para leer pista
  const readHint = useCallback(() => {
    const hint = generateHint();
    speak(hint);
    playSound('hint');
  }, [generateHint, speak, playSound]);

  // Función para obtener instrucciones claras por distrito
  const getDistrictInstructions = useCallback(() => {
    switch (currentDistrict) {
      case 'residential':
        return {
          title: "🏠 DISTRITO RESIDENCIAL",
          description: "Construye 20 casas en orden del 1 al 20, más 5 carreteras",
          steps: [
            { icon: "🏗️", text: "Selecciona 'Construir' y elige 'Casa Residencial'" },
            { icon: "🏠", text: "Coloca las casas en orden: 1, 2, 3, 4, 5... hasta 20" },
            { icon: "🛣️", text: "Cambia a 'Carreteras' y construye 5 carreteras" },
            { icon: "🎯", text: "¡Completa el distrito para desbloquear el siguiente!" }
          ]
        };
      case 'commercial':
        return {
          title: "🏪 DISTRITO COMERCIAL", 
          description: "Construye 10 tiendas contando de 10 en 10, más 8 carreteras",
          steps: [
            { icon: "🏗️", text: "Selecciona 'Construir' y elige 'Tienda Comercial'" },
            { icon: "🏪", text: "Coloca tiendas: 10, 20, 30, 40, 50" },
            { icon: "🛣️", text: "Cambia a 'Carreteras' y construye 8 carreteras" },
            { icon: "🎯", text: "¡Completa el distrito para desbloquear el parque!" }
          ]
        };
      case 'park':
        return {
          title: "🌳 PARQUE CENTRAL",
          description: "Construye 3 carreteras y 5 parques",
          steps: [
            { icon: "🛣️", text: "Selecciona 'Carreteras' y construye 3 carreteras" },
            { icon: "🌳", text: "Cambia a 'Parques' y construye 5 parques" },
            { icon: "🎠", text: "Puedes elegir: Parque Infantil, Jardín, Fuente" },
            { icon: "🏆", text: "¡Completa el parque para ser Maestro Constructor!" }
          ]
        };
      default:
        return {
          title: "Selecciona un distrito",
          description: "Elige un distrito para comenzar a construir",
          steps: []
        };
    }
  }, [currentDistrict]);

  // Función para completar desafío con validación
  const completeChallenge = useCallback((id: string) => {
    console.log(`🔍 Intentando completar challenge: ${id}`);
    const challenge = challenges.find(c => c.id === id);
    if (!challenge || challenge.completed) {
      console.log(`❌ Challenge ${id} already completed or not found`);
      return;
    }

    let shouldComplete = false;
    let accuracy = 0;

    // Validación específica por tipo de desafío
    if (id === 'primer-edificio') {
      shouldComplete = true;
      accuracy = 100;
      console.log('Completing primer-edificio challenge');
    } else if (id === 'distrito-residencial') {
      const buildingsInDistrict = project?.city_layout.buildings.filter(b => b.type === 'residential') || [];
      const validation = validateSequence(buildingsInDistrict, 'residential');
      // REQUISITOS ORIGINALES: 20 edificios y 85% de precisión
      shouldComplete = validation.accuracy >= 85 && buildingsInDistrict.length >= 20;
      accuracy = validation.accuracy;
      console.log(`Residential district: ${buildingsInDistrict.length}/20 buildings, ${accuracy}% accuracy (need 85%)`);
    } else if (id === 'distrito-comercial') {
      const buildingsInDistrict = project?.city_layout.buildings.filter(b => b.type === 'commercial') || [];
      const roadsInDistrict = project?.city_layout.roads.filter(r => r.type === 'commercial') || [];
      const validation = validateSequence(buildingsInDistrict, 'commercial');
      // REQUISITOS ORIGINALES: 10 edificios, 8 carreteras y 85% de precisión
      shouldComplete = validation.accuracy >= 85 && buildingsInDistrict.length >= 10 && roadsInDistrict.length >= 8;
      accuracy = validation.accuracy;
      console.log(`Commercial district: ${buildingsInDistrict.length}/10 buildings, ${roadsInDistrict.length}/8 roads, ${accuracy}% accuracy (need 85%)`);
    } else if (id === 'parque-central') {
      const roadsInDistrict = project?.city_layout.roads.filter(r => r.type === 'park') || [];
      const parksInDistrict = project?.city_layout.parks.filter(p => p.type === 'park') || [];
      // REQUISITOS ORIGINALES: 3 carreteras y 5 parques
      shouldComplete = roadsInDistrict.length >= 3 && parksInDistrict.length >= 5;
      accuracy = shouldComplete ? 100 : 0;
      console.log(`Park district: ${roadsInDistrict.length}/3 roads, ${parksInDistrict.length}/5 parks`);
    } else if (id === 'maestro-constructor') {
      const residentialCompleted = challenges.find(c => c.id === 'distrito-residencial')?.completed || false;
      const commercialCompleted = challenges.find(c => c.id === 'distrito-comercial')?.completed || false;
      const parkCompleted = challenges.find(c => c.id === 'parque-central')?.completed || false;
      shouldComplete = residentialCompleted && commercialCompleted && parkCompleted;
      accuracy = shouldComplete ? 100 : 0;
      console.log(`Master constructor: residential=${residentialCompleted}, commercial=${commercialCompleted}, park=${parkCompleted}`);
    }
    
    if (shouldComplete) {
      console.log(`Completing challenge ${id} with ${accuracy}% accuracy`);
      setChallenges(prev => prev.map(c => 
        c.id === id ? { ...c, completed: true, accuracy } : c
      ));
      playSound('achievement');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      speak(`¡Excelente! Has completado el desafío ${challenge.title} con ${Math.round(accuracy)}% de precisión.`);
    } else {
      // Incrementar intentos solo si no se cumple la precisión
      const currentAttempts = challenge.attempts + 1;
      setChallenges(prev => prev.map(c => 
        c.id === id ? { ...c, attempts: currentAttempts, accuracy } : c
      ));
      
      if (currentAttempts >= 3) {
        speak("Necesitas reiniciar este distrito. Has alcanzado el límite de intentos.");
        // Reiniciar distrito
        setProject(prev => prev ? {
          ...prev,
          city_layout: {
            ...prev.city_layout,
            buildings: prev.city_layout.buildings.filter(b => b.type !== currentDistrict),
            roads: prev.city_layout.roads.filter(r => r.type !== currentDistrict),
            parks: prev.city_layout.parks.filter(p => p.type !== currentDistrict)
          }
        } : null);
        // Resetear intentos
        setChallenges(prev => prev.map(c => 
          c.id === id ? { ...c, attempts: 0 } : c
        ));
      } else {
        speak(`Intenta de nuevo. Tu precisión actual es ${Math.round(accuracy)}%. Necesitas al menos 85%.`);
      }
    }
  }, [challenges, project, currentDistrict, validateSequence, playSound, speak]);
  
  // Función para colocar componente
  const handlePlaceComponent = useCallback((x: number, y: number) => {
    if (!selectedComponent || !project) return;
    
    // Verificar si la celda ya está ocupada
    const cellOccupied = project.city_layout.buildings?.some(b => b.x === x && b.y === y) ||
                         project.city_layout.roads?.some(r => r.x === x && r.y === y) ||
                         project.city_layout.parks?.some(p => p.x === x && p.y === y);
    
    if (cellOccupied) {
      speak("Esta celda ya está ocupada. Elige otra ubicación.");
      playSound('error');
      return;
    }
    
    let updatedProject = { ...project };
    
    if (buildMode === 'building' && 'numbers' in selectedComponent) {
      const newBuilding = {
        id: Date.now(),
        x,
        y,
        number: selectedComponent.numbers[0],
        type: currentDistrict, // Para lógica de distrito
        buildingType: selectedComponent.type, // Para icono específico
        icon: selectedComponent.icon // Guardar el icono específico
      };
      
      updatedProject = {
        ...project,
        city_layout: {
          ...project.city_layout,
          buildings: [...(project.city_layout.buildings || []), newBuilding]
        },
        total_buildings: project.total_buildings + 1
      };
      
      setScore(prev => prev + 10);
      speak(`¡Excelente! Construiste una ${selectedComponent.label} con el número ${newBuilding.number}.`);
    }
    
    if (buildMode === 'road' && 'type' in selectedComponent) {
      const newRoad = {
        id: Date.now(),
        x,
        y,
        type: currentDistrict, // Para lógica de distrito
        roadType: selectedComponent.type, // Para tipo específico de carretera
        icon: selectedComponent.icon // Guardar el icono específico
      };
      
      updatedProject = {
        ...project,
        city_layout: {
          ...project.city_layout,
          roads: [...(project.city_layout.roads || []), newRoad]
        },
        total_roads: project.total_roads + 1
      };
      
      setScore(prev => prev + 5);
      speak(`¡Perfecto! Construiste una ${selectedComponent.label}.`);
    }
    
    if (buildMode === 'park' && 'type' in selectedComponent) {
      const newPark = {
        id: Date.now(),
        x,
        y,
        type: currentDistrict, // Para lógica de distrito
        parkType: selectedComponent.type, // Para tipo específico de parque
        icon: selectedComponent.icon // Guardar el icono específico
      };
      
      updatedProject = {
        ...project,
        city_layout: {
          ...project.city_layout,
          parks: [...(project.city_layout.parks || []), newPark]
        },
        total_parks: project.total_parks + 1
      };
      
      setScore(prev => prev + 8);
      speak(`¡Hermoso! Construiste un ${selectedComponent.label}.`);
    }
    
    // Verificar primera construcción (cualquier tipo)
    const totalBefore = project.total_buildings + project.total_roads + project.total_parks;
    const totalAfter = updatedProject.total_buildings + updatedProject.total_roads + updatedProject.total_parks;
    console.log(`🔍 Debug primera construcción: totalBefore=${totalBefore}, totalAfter=${totalAfter}`);
    if (totalBefore === 0 && totalAfter === 1) {
      console.log('🎉 ¡Primera construcción detectada! Completando logro...');
      // Completar logro "Primera Casa" usando la función completa
      completeChallenge('primer-edificio');
    }
    
    setProject(updatedProject);
    playSound('success');
    
    // Verificar desafíos después de cada construcción
    const buildingsInResidential = updatedProject.city_layout.buildings.filter(b => b.type === 'residential');
    const buildingsInCommercial = updatedProject.city_layout.buildings.filter(b => b.type === 'commercial');
    const roadsInCommercial = updatedProject.city_layout.roads.filter(r => r.type === 'commercial');
    const roadsInPark = updatedProject.city_layout.roads.filter(r => r.type === 'park');
    const parksInPark = updatedProject.city_layout.parks.filter(p => p.type === 'park');
    
    // Verificar distrito residencial (REQUISITOS ORIGINALES)
    if (buildingsInResidential.length >= 20) {
      completeChallenge('distrito-residencial');
    }
    
    // Verificar distrito comercial (REQUISITOS ORIGINALES)
    if (buildingsInCommercial.length >= 10 && roadsInCommercial.length >= 8) {
      completeChallenge('distrito-comercial');
    }
    
    // Verificar parque central (REQUISITOS ORIGINALES)
    if (roadsInPark.length >= 3 && parksInPark.length >= 5) {
      completeChallenge('parque-central');
    }
    
    // Verificar maestro constructor
    const residentialCompleted = challenges.find(c => c.id === 'distrito-residencial')?.completed || false;
    const commercialCompleted = challenges.find(c => c.id === 'distrito-comercial')?.completed || false;
    const parkCompleted = challenges.find(c => c.id === 'parque-central')?.completed || false;
    
    if (residentialCompleted && commercialCompleted && parkCompleted) {
      completeChallenge('maestro-constructor');
    }
    
    // Limpiar selección
    setSelectedComponent(null);
  }, [selectedComponent, project, buildMode, speak, playSound, completeChallenge, currentDistrict]);
  
  // Función para seleccionar componente
  const handleSelectComponent = useCallback((component: BuildingType | RoadType | ParkType) => {
    setSelectedComponent(component);
    speak(`Seleccionaste ${component.label}. Ahora puedes colocarlo en la ciudad.`);
  }, [speak]);
  
  // Función para cambiar modo de construcción
  const handleBuildModeChange = useCallback((mode: 'building' | 'road' | 'park') => {
    setBuildMode(mode);
    setSelectedComponent(null);
    
    switch (mode) {
      case 'building':
        speak("Modo construcción de casas activado.");
        break;
      case 'road':
        speak("Modo construcción de carreteras activado.");
        break;
      case 'park':
        speak("Modo construcción de parques activado.");
        break;
    }
  }, [speak]);
  
  // Función para cambiar distrito
  const handleDistrictChange = useCallback((district: District) => {
    const currentStatus = getDistrictStatus(district.type);
    
    if (currentStatus === 'locked') {
      speak("Este distrito aún está bloqueado. Completa el distrito anterior primero.");
      return;
    }
    
    setCurrentDistrict(district.type);
    speak(`Cambiaste al ${district.name}.`);
  }, [speak, getDistrictStatus]);
  
  // Función para activar modo familia
  const handleFamilyMode = useCallback(() => {
    setFamilyMode(!familyMode);
    speak(familyMode ? "Modo familia desactivado." : "Modo familia activado. ¡Invita a tu familia a construir contigo!");
  }, [familyMode, speak]);
  
  // Función para generar reporte básico
  const generateReport = useCallback(() => {
    if (!project) return null;
    
    return {
      buildingsConstructed: project.total_buildings,
      districtsCompleted: challenges.filter(c => c.completed).length,
      sequencesPerfect: Math.floor(score / 100),
      timeSpent: Math.floor(Date.now() / 1000 / 60),
      familyParticipation: familyActivities.length
    };
  }, [project, challenges, score, familyActivities]);

  // Función para generar reporte para niños (6-7 años)
  const generateChildReport = useCallback(() => {
    if (!project) return null;
    
    return {
      // Métricas principales con emojis
      totalBuildings: {
        value: project.total_buildings,
        icon: '🏠',
        label: 'Edificios Construidos',
        achievement: project.total_buildings >= 20 ? '🏆 ¡Excelente!' : '💪 ¡Sigue así!'
      },
      perfectSequences: {
        value: Math.floor(score / 100),
        icon: '✨',
        label: 'Secuencias Perfectas',
        achievement: Math.floor(score / 100) >= 3 ? '🌟 ¡Genio!' : '🎯 ¡Casi!'
      },
      timeSpent: {
        value: Math.floor(Date.now() / 1000 / 60),
        icon: '⏰',
        label: 'Tiempo de Construcción',
        achievement: Math.floor(Date.now() / 1000 / 60) >= 15 ? '⏱️ ¡Muy dedicado!' : '📚 ¡Buen trabajo!'
      },
      // Progreso por distrito
      districtProgress: {
        residential: { 
          completed: challenges.find(c => c.id === 'distrito-residencial')?.completed || false, 
          icon: '🏘️', 
          name: 'Residencial' 
        },
        commercial: { 
          completed: false, // Se desbloquea después del residencial
          icon: '🏪', 
          name: 'Comercial' 
        },
        park: { 
          completed: false, // Se desbloquea después del comercial
          icon: '🌳', 
          name: 'Parque' 
        }
      },
      // Logros especiales
      specialAchievements: [
        { 
          id: 'first-building', 
          earned: project.total_buildings >= 1, 
          icon: '🎉', 
          title: 'Primer Constructor' 
        },
        { 
          id: 'sequence-master', 
          earned: Math.floor(score / 100) >= 5, 
          icon: '🏆', 
          title: 'Maestro de Secuencias' 
        },
        { 
          id: 'city-mayor', 
          earned: challenges.filter(c => c.completed).length >= 3, 
          icon: '👑', 
          title: 'Alcalde de la Ciudad' 
        }
      ]
    };
  }, [project, challenges, score]);

  // Función para generar reporte para padres
  const generateParentReport = useCallback(() => {
    if (!project) return null;
    
    return {
      // Resumen ejecutivo
      summary: {
        sessionDate: new Date().toLocaleDateString('es-ES'),
        totalTime: Math.floor(Date.now() / 1000 / 60),
        overallProgress: Math.round((project.total_buildings / 30) * 100),
        engagementLevel: score > 100 ? 'Alto' : score > 50 ? 'Medio' : 'Bajo'
      },
      
      // Métricas académicas específicas
      academicMetrics: {
        countingAccuracy: {
          value: Math.round((challenges.filter(c => c.completed).length / 3) * 100),
          label: 'Precisión en Conteo',
          description: 'Porcentaje de secuencias numéricas correctas'
        },
        numberRecognition: {
          value: Math.round((project.total_buildings / 20) * 100),
          label: 'Reconocimiento de Números',
          description: 'Capacidad de identificar números del 1 al 100'
        },
        sequenceUnderstanding: {
          value: Math.round((Math.floor(score / 100) / 5) * 100),
          label: 'Comprensión de Secuencias',
          description: 'Entendimiento de patrones numéricos'
        }
      },
      
      // Progreso por objetivo de aprendizaje
      learningObjectives: {
        MA01OA01_1: {
          objective: 'Contar números del 1 al 20',
          progress: Math.round((project.total_buildings / 20) * 100),
          status: project.total_buildings >= 16 ? 'Dominado' : 'En Progreso',
          suggestions: project.total_buildings < 16 ? [
            'Practicar conteo en casa con objetos cotidianos',
            'Jugar a contar escalones o pasos',
            'Usar bloques para representar números'
          ] : ['¡Excelente dominio! Puede practicar secuencias más complejas']
        },
        MA01OA01_2: {
          objective: 'Contar de 10 en 10 hasta 100',
          progress: currentDistrict === 'commercial' ? 50 : 0,
          status: currentDistrict === 'commercial' ? 'En Progreso' : 'Pendiente',
          suggestions: currentDistrict !== 'commercial' ? [
            'Practicar conteo de 10 en 10 con monedas',
            'Contar grupos de 10 objetos',
            'Jugar con números de dos dígitos'
          ] : ['¡Dominio avanzado! Listo para nuevos desafíos']
        }
      },
      
      // Actividades sugeridas para casa
      homeActivities: [
        {
          title: 'Contador de Objetos',
          description: 'Contar objetos en casa (cubiertos, libros, juguetes)',
          difficulty: 'Fácil',
          duration: '5-10 minutos',
          materials: 'Objetos cotidianos'
        },
        {
          title: 'Secuencia de Pasos',
          description: 'Contar pasos mientras camina, de 1 en 1 o de 2 en 2',
          difficulty: 'Medio',
          duration: 'Durante paseos',
          materials: 'Ninguno'
        },
        {
          title: 'Juego de Tienda',
          description: 'Simular una tienda con precios de 10 en 10',
          difficulty: 'Avanzado',
          duration: '15-20 minutos',
          materials: 'Monedas de juguete, productos'
        }
      ],
      
      // Observaciones del comportamiento
      behavioralObservations: {
        attentionSpan: score > 100 ? 'Excelente' : score > 50 ? 'Bueno' : 'Necesita mejorar',
        persistence: project.total_buildings > 10 ? 'Alto' : project.total_buildings > 5 ? 'Medio' : 'Bajo',
        problemSolving: challenges.filter(c => c.completed).length > 1 ? 'Desarrollado' : 'En desarrollo',
        creativity: 'Se observa creatividad en el diseño de la ciudad'
      },
      
      // Próximos pasos recomendados
      nextSteps: {
        immediate: 'Practicar conteo de 5 en 5',
        shortTerm: 'Introducir conceptos de suma simple',
        longTerm: 'Preparar para comparación de números (MA01OA02)'
      }
    };
  }, [project, challenges, score, currentDistrict]);

  // Función para generar reporte para profesores
  const generateTeacherReport = useCallback(() => {
    if (!project) return null;
    
    return {
      // Identificación del estudiante
      studentInfo: {
        name: 'Usuario Demo',
        grade: '1° Básico',
        sessionDate: new Date().toLocaleDateString('es-ES'),
        sessionDuration: Math.floor(Date.now() / 1000 / 60)
      },
      
      // Evaluación por estándar curricular
      curricularStandards: {
        MA01OA01: {
          standard: 'Contar números del 0 al 100 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10',
          mastery: Math.round((challenges.filter(c => c.completed).length / 3) * 100),
          evidence: [
            'Completó secuencias consecutivas del 1 al 20',
            'Identificó patrones de conteo de 10 en 10',
            'Aplicó numeración en contexto de construcción'
          ],
          areasForImprovement: project.total_buildings < 10 ? ['Reforzar conteo básico'] : ['Avanzar a secuencias complejas'],
          recommendations: project.total_buildings < 10 ? [
            'Reforzar conteo de 1 en 1',
            'Practicar reconocimiento de números',
            'Trabajar en secuencias simples'
          ] : [
            'Introducir conteo de 5 en 5',
            'Trabajar en secuencias mixtas',
            'Desarrollar fluidez numérica'
          ]
        }
      },
      
      // Análisis de errores comunes
      errorAnalysis: {
        mostCommonErrors: [
          { error: 'Saltar números en secuencia', frequency: 15, percentage: 25 },
          { error: 'Confundir números de dos dígitos', frequency: 8, percentage: 13 },
          { error: 'No seguir patrones establecidos', frequency: 12, percentage: 20 }
        ],
        errorPatterns: 'Se observa dificultad con secuencias de 10 en 10',
        interventionStrategies: [
          'Reforzar conteo de 10 en 10',
          'Practicar con números de dos dígitos',
          'Trabajar en patrones numéricos'
        ]
      },
      
      // Comparación con estándares de clase
      classComparison: {
        studentPercentile: 75,
        classAverage: 60,
        peerComparison: 'Por encima del promedio',
        growthRate: 'Excelente progreso'
      },
      
      // Plan de intervención
      interventionPlan: {
        immediateActions: [
          'Reforzar conteo de 5 en 5',
          'Practicar reconocimiento de números 11-20',
          'Trabajar en secuencias mixtas'
        ],
        shortTermGoals: [
          'Dominar conteo hasta 50',
          'Mejorar precisión en secuencias',
          'Desarrollar fluidez numérica'
        ],
        longTermObjectives: [
          'Preparar para MA01OA02 (comparación)',
          'Desarrollar pensamiento matemático',
          'Fomentar confianza numérica'
        ]
      }
    };
  }, [project, challenges, score]);
  
  // Efecto inicial
  useEffect(() => {
    // Cargar proyecto existente o crear uno nuevo
    const loadProject = async () => {
      try {
        const response = await fetch('/api/city-numeric/mock-session', {
          headers: {
            'Content-Type': 'application/json',
            'user-id': 'test-user-id'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProject(data.project);
        } else {
          // Crear nuevo proyecto
          const createResponse = await fetch('/api/city-numeric/mock-session/create-project', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'user-id': 'test-user-id'
            },
            body: JSON.stringify({
              city_name: 'Mi Ciudad Numérica'
            })
          });
          
          if (createResponse.ok) {
            const createData = await createResponse.json();
            // Cargar el proyecto creado
            const loadResponse = await fetch('/api/city-numeric/mock-session', {
              headers: {
                'Content-Type': 'application/json',
                'user-id': 'test-user-id'
              }
            });
            
            if (loadResponse.ok) {
              const loadData = await loadResponse.json();
              setProject(loadData.project);
            }
          }
        }
      } catch (error) {
        console.error('Error cargando proyecto:', error);
      }
    };
    
    loadProject();
  }, []);
  
  // Efecto para bienvenida vocal (solo una vez)
  useEffect(() => {
    if (speechEnabled && project && !showWelcome) {
      const hasSpoken = sessionStorage.getItem('cityBuilderWelcome');
      if (!hasSpoken) {
        setTimeout(() => {
          speak("¡Hola! Soy el Arquitecto Carlos 👷‍♂️. Te voy a enseñar a construir una ciudad con números.");
          sessionStorage.setItem('cityBuilderWelcome', 'true');
        }, 500);
      }
    }
  }, [speechEnabled, project, speak, showWelcome]);

  // Efecto para reproducir el primer mensaje de bienvenida
  useEffect(() => {
    if (speechEnabled && project && showWelcome && welcomeStep === 0) {
      setTimeout(() => {
        speak(welcomeSteps[0].message);
      }, 500);
    }
  }, [speechEnabled, project, showWelcome, welcomeStep, welcomeSteps, speak]);
  
  // Efecto para actualizar pistas
  useEffect(() => {
    const hint = generateHint();
    setCurrentHint(hint);
  }, [generateHint]);
  
  if (!project) {
    return (
      <div className="city-builder-loading">
        <div className="loading-spinner">🏗️</div>
        <p>Cargando tu ciudad...</p>
      </div>
    );
  }
  
  return (
    <div className="city-builder">
      {/* Overlay de Bienvenida Guiada */}
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <div className="welcome-header">
              <div className="welcome-avatar">{welcomeSteps[welcomeStep].icon}</div>
              <h2 className="welcome-title">{welcomeSteps[welcomeStep].title}</h2>
            </div>
            
            <div className="welcome-message">
              <p>{welcomeSteps[welcomeStep].message}</p>
            </div>
            
            <div className="welcome-progress">
              {welcomeSteps.map((_, index) => (
                <div 
                  key={index} 
                  className={`progress-dot ${index === welcomeStep ? 'active' : ''} ${index < welcomeStep ? 'completed' : ''}`}
                />
              ))}
            </div>
            
            <div className="welcome-actions">
              <button 
                className="welcome-btn welcome-skip"
                onClick={handleWelcomeSkip}
              >
                Saltar Tutorial
              </button>
              <button 
                className="welcome-btn welcome-next"
                onClick={handleWelcomeNext}
              >
                {welcomeSteps[welcomeStep].action}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="city-header">
        <h1 className="city-title">🏗️ Diseña tu Ciudad Numérica</h1>
        <div className="city-stats">
          <span>🏠 {project.total_buildings} Edificios</span>
          <span>🛣️ {project.total_roads} Carreteras</span>
          <span>🌳 {project.total_parks} Parques</span>
          <span>⭐ {score} Puntos</span>
        </div>
      </div>
      
      {/* Tutorial */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-content">
            <h2>🎯 ¡Bienvenido Constructor!</h2>
            <p>Construye una ciudad usando números del 1 al 100.</p>
            <p>• Distrito Residencial: Casas del 1 al 20</p>
            <p>• Distrito Comercial: Tiendas de 10 en 10</p>
            <p>• Parque Central: Organiza del 1 al 100</p>
            <button onClick={() => setShowTutorial(false)}>¡Empezar!</button>
          </div>
        </div>
      )}
      
      {/* Mensaje del profesor */}
      {showTeacher && (
        <div className="teacher-message">
          <div className="teacher-avatar">👷‍♂️</div>
          <div className="teacher-text">
            <p>¡Excelente trabajo! Has construido {project.total_buildings} edificios.</p>
            <button onClick={() => setShowTeacher(false)}>Entendido</button>
          </div>
        </div>
      )}
      
      {/* Celebración */}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <h2>🎉 ¡Logro Desbloqueado!</h2>
            <p>¡Has completado un desafío!</p>
          </div>
        </div>
      )}
      
      {/* Contenido principal */}
      <div className="city-main">
        {/* Panel izquierdo - Distritos */}
        <div className="city-sidebar">
          <h3>🗺️ Distritos</h3>
          <div className="district-list">
            {districts.map(district => {
              const currentStatus = getDistrictStatus(district.type);
              return (
                <div
                  key={district.id}
                  className={`district-card ${currentStatus} ${currentDistrict === district.type ? 'active' : ''}`}
                  onClick={() => handleDistrictChange(district)}
                >
                  <div className="district-icon">
                    {district.type === 'residential' ? '🏘️' : district.type === 'commercial' ? '🏪' : '🌳'}
                  </div>
                                     <div className="district-info">
                     <h4>{district.name}</h4>
                     <p>Edificios: {district.required_buildings}</p>
                     <p>Carreteras: {district.required_roads}</p>
                     <p>Parques: {district.required_parks}</p>
                     {currentStatus === 'locked' && <span className="locked-badge">🔒</span>}
                     {currentStatus === 'completed' && <span className="completed-badge">✅</span>}
                   </div>
                </div>
              );
            })}
          </div>
          
          {/* Checklist de logros */}
          <div className={`achievements-checklist ${checklistMinimized ? 'minimized' : ''}`}>
            <div className="checklist-header">
              <h3>🏆 Logros</h3>
              <button 
                onClick={() => setChecklistMinimized(!checklistMinimized)}
                className="minimize-btn"
              >
                {checklistMinimized ? '🔽' : '🔼'}
              </button>
            </div>
            {!checklistMinimized && (
              <div className="checklist-items">
                {challenges.map(challenge => (
                  <div key={challenge.id} className={`challenge-item ${challenge.completed ? 'completed' : ''}`}>
                    <span className="challenge-icon">
                      {challenge.completed ? '✅' : '⭕'}
                    </span>
                    <span className="challenge-title">{challenge.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Área central - Canvas de construcción */}
        <div className="city-canvas-area">
          <div className="canvas-header">
            <h3>🏗️ {currentDistrict === 'residential' ? 'Distrito Residencial' : currentDistrict === 'commercial' ? 'Distrito Comercial' : 'Parque Central'}</h3>
            
            {/* INSTRUCCIONES CLARAS POR DISTRITO */}
            <div className="district-instructions">
              <div className="instructions-card">
                <h4>{getDistrictInstructions().title}</h4>
                <p className="instructions-description">{getDistrictInstructions().description}</p>
                <div className="instructions-steps">
                  {getDistrictInstructions().steps.map((step, index) => (
                    <div key={index} className="instruction-step">
                      <span className="step-number">{index + 1}</span>
                      <div className="step-content">
                        <span className="step-icon">{step.icon}</span>
                        <span className="step-text">{step.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="city-canvas">
            <div className="grid-container">
              {grid.map((row, y) => (
                <div key={y} className="grid-row">
                  {row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`grid-cell ${selectedComponent ? 'highlighted' : ''}`}
                      onClick={() => handlePlaceComponent(x, y)}
                    >
                      {/* Renderizar edificios existentes */}
                      {project.city_layout.buildings?.map(building => {
                        if (building.x === x && building.y === y) {
                          // Obtener icono correcto según el tipo de edificio
                          const getBuildingIcon = (building: any) => {
                            // Si el edificio tiene un icono guardado, usarlo
                            if (building.icon) {
                              return building.icon;
                            }
                            // Fallback por tipo de distrito
                            switch (building.type) {
                              case 'residential':
                                return '🏠'; // Casa para distrito residencial
                              case 'commercial':
                                return '🏪'; // Tienda para distrito comercial
                              case 'park':
                                return '🌳'; // Árbol para parque
                              default:
                                return '🏠';
                            }
                          };
                          
                                                      return (
                              <div key={building.id} className="building-placed" data-type={building.type}>
                                <span className="building-icon">{getBuildingIcon(building)}</span>
                                <span className="building-number">{building.number}</span>
                              </div>
                            );
                        }
                        return null;
                      })}
                      
                      {/* Renderizar carreteras */}
                      {project.city_layout.roads?.map(road => {
                        if (road.x === x && road.y === y) {
                          // Obtener icono correcto según el tipo de carretera
                          const getRoadIcon = (road: any) => {
                            // Si la carretera tiene un icono guardado, usarlo
                            if (road.icon) {
                              return road.icon;
                            }
                            // Fallback por tipo de distrito
                            switch (road.type) {
                              case 'residential':
                                return '➡️'; // Horizontal para distrito residencial
                              case 'commercial':
                                return '⬇️'; // Vertical para distrito comercial
                              case 'park':
                                return '➕'; // Cruce para parque
                              default:
                                return '🛣️';
                            }
                          };
                          
                          return (
                            <div key={road.id} className="road-placed" data-type={road.type}>
                              <span className="road-icon">{getRoadIcon(road)}</span>
                            </div>
                          );
                        }
                        return null;
                      })}

                      {/* Renderizar parques */}
                      {project.city_layout.parks?.map(park => {
                        if (park.x === x && park.y === y) {
                          // Obtener icono correcto según el tipo de parque
                          const getParkIcon = (park: any) => {
                            // Si el parque tiene un icono guardado, usarlo
                            if (park.icon) {
                              return park.icon;
                            }
                            // Fallback por tipo de distrito
                            switch (park.type) {
                              case 'park':
                                return '🎠'; // Parque infantil por defecto
                              default:
                                return '🌳';
                            }
                          };
                          
                          return (
                            <div key={park.id} className="park-placed" data-type={park.type}>
                              <span className="park-icon">{getParkIcon(park)}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Panel derecho - Paleta de construcción */}
        <div className="city-sidebar">
          <h3>🏗️ Paleta de Construcción</h3>
          
          {/* Controles de modo de construcción */}
          <div className="build-mode-controls">
            <h4>🎮 Modo de Construcción</h4>
            <div className="build-mode-buttons">
              <button 
                className={`build-mode-btn ${buildMode === 'building' ? 'active' : ''}`}
                onClick={() => handleBuildModeChange('building')}
              >
                🏠 Construir
              </button>
              <button 
                className={`build-mode-btn ${buildMode === 'road' ? 'active' : ''}`}
                onClick={() => handleBuildModeChange('road')}
              >
                🛣️ Carreteras
              </button>
              <button 
                className={`build-mode-btn ${buildMode === 'park' ? 'active' : ''}`}
                onClick={() => handleBuildModeChange('park')}
              >
                🌳 Parques
              </button>
            </div>
          </div>
          
          {/* Tipos de edificios */}
          <div className="building-palette">
            <h4>🏠 Edificios</h4>
            {buildingTypes.map(building => (
              <div
                key={building.type}
                className={`building-type ${selectedComponent?.type === building.type ? 'selected' : ''}`}
                onClick={() => handleSelectComponent(building)}
              >
                <span className="building-icon">{building.icon}</span>
                <span className="building-name">{building.label}</span>
                <span className="building-numbers">{building.numbers.join(', ')}</span>
              </div>
            ))}
          </div>

          {/* Tipos de carreteras */}
          <div className="road-palette">
            <h4>🛣️ Carreteras</h4>
            {roadTypes.map(road => (
              <div
                key={road.type}
                className={`road-type ${selectedComponent?.type === road.type ? 'selected' : ''}`}
                onClick={() => handleSelectComponent(road)}
              >
                <span className="road-icon">{road.icon}</span>
                <span className="road-name">{road.label}</span>
              </div>
            ))}
          </div>

          {/* Tipos de parques */}
          <div className="park-palette">
            <h4>🌳 Parques</h4>
            {parkTypes.map(park => (
              <div
                key={park.type}
                className={`park-type ${selectedComponent?.type === park.type ? 'selected' : ''}`}
                onClick={() => handleSelectComponent(park)}
              >
                <span className="park-icon">{park.icon}</span>
                <span className="park-name">{park.label}</span>
              </div>
            ))}
          </div>
          
          {/* Pistas dinámicas */}
          <div className={`hint-panel ${hintMinimized ? 'minimized' : ''}`}>
            <div className="hint-header">
              <h4>💡 Pistas</h4>
              <div className="hint-controls">
                <button onClick={readHint} className="hint-audio-btn">
                  🔊
                </button>
                <button 
                  onClick={() => setHintMinimized(!hintMinimized)}
                  className="minimize-btn"
                >
                  {hintMinimized ? '🔽' : '🔼'}
                </button>
              </div>
            </div>
            {!hintMinimized && (
              <div className="hint-content">
                <p>{currentHint}</p>
              </div>
            )}
          </div>
          
          {/* Modo familia */}
          <div className="family-mode">
            <button 
              onClick={handleFamilyMode}
              className={`family-btn ${familyMode ? 'active' : ''}`}
            >
              👨‍👩‍👧‍👦 Modo Familia
            </button>
            {familyMode && (
              <div className="family-suggestions">
                <h4>💡 Actividades Familiares</h4>
                <ul>
                  <li>Contar objetos en casa</li>
                  <li>Jugar a la tienda</li>
                  <li>Contar pasos juntos</li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Reporte de actividad */}
          <div className="activity-report">
            <button 
              onClick={() => setShowActivityReport(!showActivityReport)}
              className="report-btn"
            >
              📊 Ver Reporte
            </button>
            {showActivityReport && (
              <div className="report-content">
                <div className="report-tabs">
                  <button 
                    onClick={() => setReportType('basic')}
                    className={`report-tab ${reportType === 'basic' ? 'active' : ''}`}
                  >
                    📈 Básico
                  </button>
                  <button 
                    onClick={() => setReportType('child')}
                    className={`report-tab ${reportType === 'child' ? 'active' : ''}`}
                  >
                    🎉 Niño
                  </button>
                  <button 
                    onClick={() => setReportType('parent')}
                    className={`report-tab ${reportType === 'parent' ? 'active' : ''}`}
                  >
                    👨‍👩‍👧‍👦 Padre
                  </button>
                  <button 
                    onClick={() => setReportType('teacher')}
                    className={`report-tab ${reportType === 'teacher' ? 'active' : ''}`}
                  >
                    👨‍🏫 Profesor
                  </button>
                </div>
                
                <div className="report-details">
                  {reportType === 'basic' && (
                    <div>
                      <h4>📈 Tu Progreso</h4>
                      <div className="report-stats">
                        <p>🏠 Edificios: {project.total_buildings}</p>
                        <p>⭐ Puntos: {score}</p>
                        <p>🏆 Logros: {challenges.filter(c => c.completed).length}/3</p>
                        <p>👨‍👩‍👧‍👦 Familia: {familyActivities.length} actividades</p>
                      </div>
                    </div>
                  )}
                  
                  {reportType === 'child' && generateChildReport() && (
                    <div className="child-report">
                      <h4>🎉 ¡Tu Ciudad Está Increíble!</h4>
                      <div className="metrics-grid">
                        <div className="metric-card">
                          <div className="metric-icon">{generateChildReport()?.totalBuildings.icon}</div>
                          <div className="metric-value">{generateChildReport()?.totalBuildings.value}</div>
                          <div className="metric-label">{generateChildReport()?.totalBuildings.label}</div>
                          <div className="metric-achievement">{generateChildReport()?.totalBuildings.achievement}</div>
                        </div>
                        <div className="metric-card">
                          <div className="metric-icon">{generateChildReport()?.perfectSequences.icon}</div>
                          <div className="metric-value">{generateChildReport()?.perfectSequences.value}</div>
                          <div className="metric-label">{generateChildReport()?.perfectSequences.label}</div>
                          <div className="metric-achievement">{generateChildReport()?.perfectSequences.achievement}</div>
                        </div>
                      </div>
                      <div className="achievement-gallery">
                        <h5>🏆 Logros Especiales</h5>
                        <div className="achievements-grid">
                          {generateChildReport()?.specialAchievements.map(achievement => (
                            <div key={achievement.id} className={`achievement-badge ${achievement.earned ? 'earned' : 'locked'}`}>
                              <span className="achievement-icon">{achievement.icon}</span>
                              <span className="achievement-title">{achievement.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {reportType === 'parent' && generateParentReport() && (
                    <div className="parent-report">
                      <h4>📊 Reporte para Padres</h4>
                      <div className="summary-section">
                        <h5>📈 Resumen</h5>
                        <p>Fecha: {generateParentReport()?.summary.sessionDate}</p>
                        <p>Tiempo: {generateParentReport()?.summary.totalTime} minutos</p>
                        <p>Progreso: {generateParentReport()?.summary.overallProgress}%</p>
                        <p>Engagement: {generateParentReport()?.summary.engagementLevel}</p>
                      </div>
                      <div className="academic-section">
                        <h5>📚 Métricas Académicas</h5>
                        <div className="metrics-list">
                          <p>Precisión en Conteo: {generateParentReport()?.academicMetrics.countingAccuracy.value}%</p>
                          <p>Reconocimiento de Números: {generateParentReport()?.academicMetrics.numberRecognition.value}%</p>
                          <p>Comprensión de Secuencias: {generateParentReport()?.academicMetrics.sequenceUnderstanding.value}%</p>
                        </div>
                      </div>
                      <div className="activities-section">
                        <h5>🏠 Actividades Sugeridas</h5>
                        <ul>
                          {generateParentReport()?.homeActivities.map((activity, index) => (
                            <li key={index}>
                              <strong>{activity.title}</strong>: {activity.description}
                              <br />
                              <small>Dificultad: {activity.difficulty} • Duración: {activity.duration}</small>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {reportType === 'teacher' && generateTeacherReport() && (
                    <div className="teacher-report">
                      <h4>📈 Evaluación Pedagógica</h4>
                      <div className="student-info">
                        <h5>👤 Información del Estudiante</h5>
                        <p>Nombre: {generateTeacherReport()?.studentInfo.name}</p>
                        <p>Grado: {generateTeacherReport()?.studentInfo.grade}</p>
                        <p>Fecha: {generateTeacherReport()?.studentInfo.sessionDate}</p>
                        <p>Duración: {generateTeacherReport()?.studentInfo.sessionDuration} minutos</p>
                      </div>
                      <div className="curricular-section">
                        <h5>📋 Estándar Curricular MA01OA01</h5>
                        <p>Dominio: {generateTeacherReport()?.curricularStandards.MA01OA01.mastery}%</p>
                        <div className="evidence-list">
                          <h6>Evidencia:</h6>
                          <ul>
                            {generateTeacherReport()?.curricularStandards.MA01OA01.evidence.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="recommendations">
                          <h6>Recomendaciones:</h6>
                          <ul>
                            {generateTeacherReport()?.curricularStandards.MA01OA01.recommendations.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityBuilder; 