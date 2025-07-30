# 🛠️ GUÍA DE EXTENSIÓN - NUEVOS MÓDULOS EDU21
### *Manual técnico para desarrolladores externos*

**Versión:** 1.0  
**Fecha:** Diciembre 2024  
**Audiencia:** Desarrolladores externos, equipos de desarrollo, integradores  

---

## 🎯 **OBJETIVOS DE ESTA GUÍA**

Esta guía te permitirá:
- ✅ **Entender la arquitectura modular** de EDU21
- ✅ **Agregar nuevos engines educativos** específicos
- ✅ **Crear nuevos roles y permisos** para usuarios especializados
- ✅ **Integrar nuevas materias** o áreas de conocimiento
- ✅ **Desarrollar módulos personalizados** para necesidades específicas
- ✅ **Mantener compatibilidad** con el sistema existente

---

## 🏗️ **ARQUITECTURA MODULAR**

### **Principios de Diseño**

#### **1. Separación de Responsabilidades**
```
Frontend (UI/UX) ← API REST → Backend (Lógica) ← Database (Datos)
```

#### **2. Modularidad por Capas**
```
Presentation Layer    → React Components (client/src/components/)
API Layer            → Express Routes (server/routes/)
Business Logic Layer → Services (server/services/)  
Data Layer           → Supabase Models (server/database/)
```

#### **3. Inyección de Dependencias**
```javascript
// Ejemplo: Nuevo engine se registra automáticamente
const EDUCATIONAL_ENGINES = [
  'ENG01', 'ENG02', 'ENG05', 'ENG06', 'ENG07', 'ENG09',
  // Tu nuevo engine aquí:
  'ENG11' // Geography Explorer
];
```

---

## 🎮 **CASO 1: AGREGAR NUEVO ENGINE EDUCATIVO**

### **Paso 1: Definir Especificaciones**

Crear archivo: `/server/scripts/engine_ENG11_geography.json`

```json
{
  "engine_id": "ENG11",
  "code": "GEOGRAPHY_EXPLORER",
  "name": "Geography Explorer",
  "version": "1.0",
  "description": "Exploración interactiva de geografía de Chile",
  "subject_affinity": ["HIS", "GEO"],
  "recommended_grades": ["3B", "4B", "5B", "6B"],
  "bloom_levels": ["Recordar", "Comprender", "Aplicar", "Analizar"],
  "cognitive_skills": ["memoria_espacial", "orientacion_geografica", "razonamiento_territorial"],
  "game_mechanics": {
    "core_actions": ["map_explore", "location_identify", "route_plan", "landmark_connect"],
    "visual_elements": ["interactive_map", "zoom_controls", "location_markers", "path_lines"],
    "interaction_types": ["click_location", "drag_route", "zoom_navigate", "marker_drop"],
    "feedback_system": "geographical_context_rich"
  },
  "technical_config": {
    "map_type": "chile_political_physical",
    "zoom_levels": ["country", "region", "province", "city"],
    "data_sources": ["ine_chile", "territorial_boundaries"],
    "offline_mode": true,
    "accessibility": {
      "screen_reader_maps": true,
      "high_contrast_geography": true,
      "audio_location_names": true,
      "simplified_navigation": true
    }
  },
  "learning_objectives": [
    "HI03OA09", "HI04OA10", "GE05OA01", "GE05OA02", "GE06OA03"
  ],
  "difficulty_scaling": {
    "easy": {
      "locations": "major_cities",
      "regions": 3,
      "details": "basic_names"
    },
    "medium": {
      "locations": "provinces_rivers",
      "regions": 8,
      "details": "geographical_features"
    },
    "hard": {
      "locations": "all_territories",
      "regions": 15,
      "details": "complex_relationships"
    }
  },
  "special_features": {
    "chile_focus": true,
    "regional_data": true,
    "historical_overlay": true,
    "climate_integration": true
  }
}
```

### **Paso 2: Registrar en Base de Datos**

Crear archivo: `/server/database/migrations/add_engine_geography.sql`

```sql
-- Insertar nuevo engine en tabla game_engine
INSERT INTO game_engine (
    engine_id, code, name, version, description,
    subject_affinity, recommended_grades, bloom_levels, cognitive_skills,
    game_mechanics, technical_config, learning_objectives, difficulty_scaling,
    status
) VALUES (
    'ENG11',
    'GEOGRAPHY_EXPLORER',
    'Geography Explorer',
    '1.0',
    'Exploración interactiva de geografía de Chile',
    ARRAY['HIS', 'GEO'],
    ARRAY['3B', '4B', '5B', '6B'],
    ARRAY['Recordar', 'Comprender', 'Aplicar', 'Analizar'],
    ARRAY['memoria_espacial', 'orientacion_geografica', 'razonamiento_territorial'],
    '{
      "core_actions": ["map_explore", "location_identify", "route_plan", "landmark_connect"],
      "visual_elements": ["interactive_map", "zoom_controls", "location_markers", "path_lines"],
      "interaction_types": ["click_location", "drag_route", "zoom_navigate", "marker_drop"],
      "feedback_system": "geographical_context_rich"
    }'::jsonb,
    '{
      "map_type": "chile_political_physical",
      "zoom_levels": ["country", "region", "province", "city"],
      "data_sources": ["ine_chile", "territorial_boundaries"],
      "offline_mode": true,
      "accessibility": {
        "screen_reader_maps": true,
        "high_contrast_geography": true,
        "audio_location_names": true,
        "simplified_navigation": true
      }
    }'::jsonb,
    ARRAY['HI03OA09', 'HI04OA10', 'GE05OA01', 'GE05OA02', 'GE06OA03'],
    '{
      "easy": {"locations": "major_cities", "regions": 3, "details": "basic_names"},
      "medium": {"locations": "provinces_rivers", "regions": 8, "details": "geographical_features"},
      "hard": {"locations": "all_territories", "regions": 15, "details": "complex_relationships"}
    }'::jsonb,
    'ready_for_development'
);

-- Crear índices específicos para búsquedas geográficas
CREATE INDEX IF NOT EXISTS idx_game_engine_geography 
ON game_engine(engine_id) WHERE engine_id = 'ENG11';
```

### **Paso 3: Implementar Lógica Backend**

Modificar archivo: `/server/routes/game.js`

```javascript
// Agregar ENG11 a la lista de engines disponibles
const EDUCATIONAL_ENGINES = [
  'ENG01', 'ENG02', 'ENG05', 'ENG06', 'ENG07', 'ENG09',
  'ENG11' // Geography Explorer - NUEVO
];

// Agregar configuración específica del engine
const engineConfigs = {
  // ... engines existentes ...
  'ENG11': {
    map_region: 'chile',
    initial_zoom: 'country_level',
    location_database: 'ine_chile_2024',
    difficulty_auto_adjust: true,
    territorial_context: true,
    historical_layers: ['independence', 'administrative_changes'],
    climate_overlay: true,
    interaction_modes: ['explore', 'quiz', 'challenge', 'story']
  }
};

// Agregar función helper específica
function getEngineDescription(engineId) {
  const descriptions = {
    // ... engines existentes ...
    'ENG11': 'Interactive Chilean geography exploration with territorial context and historical layers'
  };
  return descriptions[engineId] || 'Educational game engine';
}

function getEngineSubjects(engineId) {
  const subjects = {
    // ... engines existentes ...
    'ENG11': ['HIS', 'GEO']
  };
  return subjects[engineId] || ['GEN'];
}

function getEngineGrades(engineId) {
  const grades = {
    // ... engines existentes ...
    'ENG11': ['3B', '4B', '5B', '6B']
  };
  return grades[engineId] || ['1B', '2B', '3B'];
}
```

### **Paso 4: Crear Servicio Específico**

Crear archivo: `/server/services/geographyEngineService.js`

```javascript
const { supabase } = require('../database/supabase');
const logger = require('../utils/logger');

class GeographyEngineService {
  constructor() {
    this.chileRegions = [
      { id: 'XV', name: 'Arica y Parinacota', capital: 'Arica' },
      { id: 'I', name: 'Tarapacá', capital: 'Iquique' },
      { id: 'II', name: 'Antofagasta', capital: 'Antofagasta' },
      // ... todas las regiones
      { id: 'XII', name: 'Magallanes', capital: 'Punta Arenas' }
    ];
    
    this.difficultyLevels = {
      easy: { regions: 5, details: 'capitals_only', time_limit: 120 },
      medium: { regions: 10, details: 'capitals_provinces', time_limit: 90 },
      hard: { regions: 15, details: 'full_geography', time_limit: 60 }
    };
  }

  // Generar preguntas específicas de geografía
  generateGeographyQuestions(config) {
    const { difficulty = 'medium', num_questions = 10, focus_area = 'all' } = config;
    const diffConfig = this.difficultyLevels[difficulty];
    
    const questions = [];
    const selectedRegions = this.chileRegions.slice(0, diffConfig.regions);
    
    for (let i = 0; i < num_questions; i++) {
      const region = selectedRegions[i % selectedRegions.length];
      
      const questionTypes = [
        'identify_capital',
        'locate_region',
        'match_region_capital',
        'identify_neighbors'
      ];
      
      const questionType = questionTypes[i % questionTypes.length];
      questions.push(this.generateQuestion(questionType, region, difficulty));
    }
    
    return questions;
  }

  generateQuestion(type, region, difficulty) {
    switch (type) {
      case 'identify_capital':
        return {
          id: `geo_${region.id}_capital`,
          type: 'multiple_choice',
          stem_md: `¿Cuál es la capital de la región ${region.name}?`,
          stem_text: `¿Cuál es la capital de la región ${region.name}?`,
          options: this.generateCapitalOptions(region),
          correct_answer: region.capital,
          feedback_correct: `¡Correcto! ${region.capital} es la capital de ${region.name}.`,
          feedback_incorrect: `La capital de ${region.name} es ${region.capital}.`,
          bloom_level: 'Recordar',
          difficulty_level: difficulty,
          estimated_time: 15,
          subject: 'GEO',
          oa_codes: ['GE05OA01'],
          engine_specific: {
            map_focus: region.id,
            highlight_capital: true,
            zoom_level: 'region'
          }
        };
        
      case 'locate_region':
        return {
          id: `geo_${region.id}_locate`,
          type: 'map_click',
          stem_md: `Haz clic en la región ${region.name} en el mapa de Chile.`,
          stem_text: `Ubica la región ${region.name} en el mapa.`,
          correct_region: region.id,
          feedback_correct: `¡Excelente! Has ubicado correctamente ${region.name}.`,
          feedback_incorrect: `${region.name} se encuentra en esta área del mapa.`,
          bloom_level: 'Comprender',
          difficulty_level: difficulty,
          estimated_time: 20,
          subject: 'GEO',
          oa_codes: ['GE05OA02'],
          engine_specific: {
            interaction_type: 'map_click',
            correct_coordinates: this.getRegionCoordinates(region.id),
            tolerance_radius: 50,
            map_style: 'political'
          }
        };
        
      // ... más tipos de preguntas
      default:
        return this.generateQuestion('identify_capital', region, difficulty);
    }
  }

  getRegionCoordinates(regionId) {
    // Coordenadas aproximadas del centro de cada región
    const coordinates = {
      'XV': { lat: -18.4783, lng: -70.3126 },
      'I': { lat: -20.2140, lng: -70.1522 },
      'II': { lat: -23.6509, lng: -70.3975 },
      // ... todas las regiones
    };
    return coordinates[regionId] || { lat: -33.4489, lng: -70.6693 }; // Santiago por defecto
  }

  // Generar opciones incorrectas plausibles para capitales
  generateCapitalOptions(correctRegion) {
    const allCapitals = this.chileRegions.map(r => r.capital);
    const incorrectOptions = allCapitals
      .filter(capital => capital !== correctRegion.capital)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const options = [correctRegion.capital, ...incorrectOptions]
      .sort(() => 0.5 - Math.random());
      
    return options;
  }

  // Validar respuesta específica de geografía
  validateGeographyAnswer(question, userAnswer) {
    switch (question.type) {
      case 'multiple_choice':
        return {
          correct: userAnswer === question.correct_answer,
          feedback: userAnswer === question.correct_answer 
            ? question.feedback_correct 
            : question.feedback_incorrect
        };
        
      case 'map_click':
        const distance = this.calculateDistance(
          userAnswer.coordinates,
          question.engine_specific.correct_coordinates
        );
        const isCorrect = distance <= question.engine_specific.tolerance_radius;
        
        return {
          correct: isCorrect,
          distance: distance,
          feedback: isCorrect 
            ? question.feedback_correct 
            : `${question.feedback_incorrect} Distancia: ${Math.round(distance)}km del centro.`
        };
        
      default:
        return { correct: false, feedback: 'Tipo de pregunta no soportado.' };
    }
  }

  calculateDistance(coord1, coord2) {
    // Fórmula de Haversine para calcular distancia entre coordenadas
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.deg2rad(coord2.lat - coord1.lat);
    const dLng = this.deg2rad(coord2.lng - coord1.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.deg2rad(coord1.lat)) * Math.cos(this.deg2rad(coord2.lat)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }
}

module.exports = { GeographyEngineService };
```

### **Paso 5: Crear Componente Frontend**

Crear archivo: `/client/src/components/game/GeographyExplorer.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface GeographyExplorerProps {
  question: GeographyQuestion;
  onAnswer: (answer: any) => void;
  settings: GameSettings;
}

interface GeographyQuestion {
  id: string;
  type: 'multiple_choice' | 'map_click';
  stem_md: string;
  options?: string[];
  correct_answer?: string;
  correct_region?: string;
  engine_specific: {
    map_focus?: string;
    interaction_type?: string;
    correct_coordinates?: { lat: number; lng: number };
    tolerance_radius?: number;
    map_style?: string;
  };
}

const GeographyExplorer: React.FC<GeographyExplorerProps> = ({
  question,
  onAnswer,
  settings
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [mapClickPosition, setMapClickPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Configuración del mapa centrado en Chile
  const chileCenter = { lat: -35.0000, lng: -71.0000 };
  const chileZoom = 4;

  const handleMultipleChoiceAnswer = (option: string) => {
    setSelectedAnswer(option);
    setShowFeedback(true);
    
    setTimeout(() => {
      onAnswer({
        type: 'multiple_choice',
        answer: option,
        correct: option === question.correct_answer
      });
    }, 2000);
  };

  const handleMapClick = (event: any) => {
    const { lat, lng } = event.latlng;
    setMapClickPosition({ lat, lng });
    
    // Calcular si el clic está dentro del área correcta
    const correctCoords = question.engine_specific.correct_coordinates;
    const tolerance = question.engine_specific.tolerance_radius || 50;
    
    if (correctCoords) {
      const distance = calculateDistance({ lat, lng }, correctCoords);
      const isCorrect = distance <= tolerance;
      
      setShowFeedback(true);
      
      setTimeout(() => {
        onAnswer({
          type: 'map_click',
          coordinates: { lat, lng },
          correct: isCorrect,
          distance: distance
        });
      }, 2000);
    }
  };

  const calculateDistance = (coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}) => {
    // Implementación de Haversine (misma que en el backend)
    const R = 6371;
    const dLat = deg2rad(coord2.lat - coord1.lat);
    const dLng = deg2rad(coord2.lng - coord1.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  if (question.type === 'multiple_choice') {
    return (
      <div className="geography-explorer-container">
        <div className="question-section">
          <h3 className="text-xl font-bold mb-4">{question.stem_md}</h3>
          
          <div className="options-grid grid grid-cols-2 gap-4">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleMultipleChoiceAnswer(option)}
                disabled={showFeedback}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${selectedAnswer === option 
                    ? selectedAnswer === question.correct_answer
                      ? 'border-green-500 bg-green-100'
                      : 'border-red-500 bg-red-100'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }
                  ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        {/* Mapa de referencia */}
        <div className="map-section mt-6">
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <MapContainer
              center={chileCenter}
              zoom={chileZoom}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Marcadores de regiones si es necesario */}
            </MapContainer>
          </div>
        </div>
      </div>
    );
  }

  if (question.type === 'map_click') {
    return (
      <div className="geography-explorer-container">
        <div className="question-section mb-4">
          <h3 className="text-xl font-bold">{question.stem_md}</h3>
          <p className="text-gray-600 mt-2">Haz clic en el mapa para responder</p>
        </div>
        
        <div className="map-section">
          <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-gray-300">
            <MapContainer
              center={chileCenter}
              zoom={chileZoom}
              style={{ height: '100%', width: '100%' }}
              onClick={handleMapClick}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Mostrar la respuesta del usuario */}
              {mapClickPosition && (
                <Marker position={[mapClickPosition.lat, mapClickPosition.lng]}>
                  <Popup>
                    Tu respuesta: {mapClickPosition.lat.toFixed(4)}, {mapClickPosition.lng.toFixed(4)}
                  </Popup>
                </Marker>
              )}
              
              {/* Mostrar la respuesta correcta después del feedback */}
              {showFeedback && question.engine_specific.correct_coordinates && (
                <Marker 
                  position={[
                    question.engine_specific.correct_coordinates.lat, 
                    question.engine_specific.correct_coordinates.lng
                  ]}
                >
                  <Popup>
                    Respuesta correcta
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
        
        {showFeedback && (
          <div className="feedback-section mt-4 p-4 rounded-lg bg-blue-100">
            <p>¡Respuesta registrada! La respuesta correcta se muestra en el mapa.</p>
          </div>
        )}
      </div>
    );
  }

  return <div>Tipo de pregunta no soportado: {question.type}</div>;
};

export default GeographyExplorer;
```

### **Paso 6: Crear Configuraciones de Evaluación por Bloom**

Crear archivo: `/server/services/geographyBloomConfig.js`

```javascript
const GEOGRAPHY_BLOOM_CONFIG_ENG11 = [
  {
    bloom_level: 'recordar',
    oa_code: '2B-CIE-OA3',
    engine_id: 'ENG11',
    evaluation_type: 'interactive_map',
    umbral_dominio: 80,
    intentos_max: 3,
    configuracion: {
      preguntas: [
        {
          enunciado: "Identifica las regiones de Chile en el mapa",
          elementos_mapa: ['region_1', 'region_2', 'region_metropolitana'],
          respuesta_correcta: ['norte', 'centro', 'sur'],
          feedback: "¡Excelente! Reconoces la división administrativa de Chile"
        }
      ],
      ui_elements: {
        map_style: 'political_administrative',
        interaction_type: 'click_regions',
        progress_indicator: 'bloom_level_indicator',
        hint_system: 'regional_clues'
      }
    }
  },
  
  {
    bloom_level: 'comprender',
    oa_code: '2B-CIE-OA3',
    engine_id: 'ENG11',
    evaluation_type: 'classification_map',
    umbral_dominio: 80,
    intentos_max: 4,
    configuracion: {
      preguntas: [
        {
          enunciado: "Clasifica las zonas climáticas de Chile",
          elementos_clasificar: ['desierto', 'mediterraneo', 'templado', 'polar'],
          criterios: ['temperatura', 'precipitaciones', 'vegetacion'],
          respuesta_correcta: {
            desierto: 'norte',
            mediterraneo: 'centro',
            templado: 'sur',
            polar: 'extremo_sur'
          },
          feedback: "¡Muy bien! Comprendes las diferencias climáticas"
        }
      ],
      ui_elements: {
        map_style: 'climate_zones',
        interaction_type: 'drag_and_classify',
        progress_indicator: 'comprehension_meter',
        hint_system: 'climate_hints'
      }
    }
  }
];

module.exports = { GEOGRAPHY_BLOOM_CONFIG_ENG11 };
```

---

## 👥 **CASO 2: AGREGAR NUEVO ROL DE USUARIO**

### **Ejemplo: COORDINADOR_PEDAGOGICO**

#### **Paso 1: Definir Especificaciones del Rol**

```typescript
// Nuevo tipo de rol
type UserRole = 
  | 'SUPER_ADMIN_FULL'
  | 'ADMIN_ESCOLAR'
  | 'BIENESTAR_ESCOLAR'
  | 'TEACHER'
  | 'STUDENT'
  | 'GUARDIAN'
  | 'SOSTENEDOR'
  | 'COORDINADOR_PEDAGOGICO'; // NUEVO ROL

interface CoordinadorPedagogicoCapabilities {
  // Planificación Curricular
  canDesignCurriculum: true;
  canApproveLessonPlans: true;
  canCreateLearningSequences: true;
  
  // Supervisión Docente
  canSuperviseTeachers: true;
  canViewTeacherPerformance: true;
  canProvidePedagogicalFeedback: true;
  
  // Analytics Educativos
  canViewSchoolAnalytics: true;
  canGenerateEducationalReports: true;
  canAnalyzeLearningTrends: true;
  
  // Gestión de Engines
  canConfigureEngines: true;
  canAssignEnginestoClasses: true;
  canMonitorEngineUsage: true;
}
```

#### **Paso 2: Actualizar Base de Datos**

```sql
-- Agregar el nuevo rol al CHECK constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN (
    'SUPER_ADMIN_FULL',
    'ADMIN_ESCOLAR', 
    'BIENESTAR_ESCOLAR',
    'TEACHER',
    'STUDENT',
    'GUARDIAN',
    'SOSTENEDOR',
    'COORDINADOR_PEDAGOGICO'
  ));

-- Crear permisos específicos para el coordinador pedagógico
INSERT INTO permissions (permission_code, permission_name, permission_description, resource_type, action_type, is_school_scoped) VALUES
('curriculum.design', 'Diseñar Currículum', 'Crear y modificar planificaciones curriculares', 'curriculum', 'create', true),
('curriculum.approve', 'Aprobar Currículum', 'Aprobar planificaciones curriculares', 'curriculum', 'approve', true),
('teacher.supervise', 'Supervisar Docentes', 'Supervisar desempeño docente', 'teacher', 'supervise', true),
('lesson_plan.approve', 'Aprobar Planificaciones', 'Aprobar planificaciones de clase', 'lesson_plan', 'approve', true),
('oa_analytics.view', 'Ver Analytics OA', 'Ver analíticas de objetivos de aprendizaje', 'analytics', 'view', true),
('engine.configure', 'Configurar Engines', 'Configurar engines educativos', 'engine', 'configure', true),
('pedagogical_reports.generate', 'Generar Reportes Pedagógicos', 'Crear reportes educativos avanzados', 'reports', 'generate', true);

-- Asignar permisos al rol coordinador pedagógico
INSERT INTO role_permissions (role, permission_id) 
SELECT 'COORDINADOR_PEDAGOGICO', permission_id 
FROM permissions 
WHERE permission_code IN (
  'curriculum.design', 'curriculum.approve', 'teacher.supervise', 
  'lesson_plan.approve', 'oa_analytics.view', 'engine.configure',
  'pedagogical_reports.generate', 'quiz.read', 'class.read', 'game.view'
);
```

#### **Paso 3: Actualizar Middleware RBAC**

Modificar archivo: `/server/middleware/rbac.js`

```javascript
const ROLE_PERMISSIONS = {
  // ... roles existentes ...
  COORDINADOR_PEDAGOGICO: [
    'curriculum.design', 'curriculum.approve', 'teacher.supervise',
    'lesson_plan.approve', 'oa_analytics.view', 'engine.configure',
    'pedagogical_reports.generate', 'quiz.read', 'class.read', 'game.view',
    'evaluation.view', 'gradebook.view', 'ai_service.view'
  ]
};

const RESOURCE_PERMISSIONS = {
  // ... recursos existentes ...
  curriculum: {
    design: ['COORDINADOR_PEDAGOGICO'],
    approve: ['COORDINADOR_PEDAGOGICO', 'ADMIN_ESCOLAR'],
    view: ['COORDINADOR_PEDAGOGICO', 'ADMIN_ESCOLAR', 'TEACHER']
  },
  teacher_supervision: {
    supervise: ['COORDINADOR_PEDAGOGICO', 'ADMIN_ESCOLAR'],
    feedback: ['COORDINADOR_PEDAGOGICO'],
    performance_view: ['COORDINADOR_PEDAGOGICO', 'ADMIN_ESCOLAR']
  },
  engine_management: {
    configure: ['COORDINADOR_PEDAGOGICO', 'ADMIN_ESCOLAR'],
    assign: ['COORDINADOR_PEDAGOGICO', 'TEACHER'],
    monitor: ['COORDINADOR_PEDAGOGICO', 'ADMIN_ESCOLAR']
  }
};
```

#### **Paso 4: Crear Dashboard Específico**

Crear archivo: `/client/src/app/coordinador/dashboard/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/store/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface PedagogicalMetrics {
  totalTeachers: number;
  activeLessonPlans: number;
  curriculumCoverage: number;
  averageEngineUsage: number;
  studentEngagement: number;
  learningObjectivesMet: number;
}

export default function CoordinadorDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PedagogicalMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPedagogicalMetrics();
  }, []);

  const loadPedagogicalMetrics = async () => {
    try {
      const response = await fetch('/api/coordinador/metrics');
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error loading pedagogical metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Planificaciones Activas',
      value: metrics?.activeLessonPlans || 0,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      href: '/coordinador/lesson-plans'
    },
    {
      title: 'Cobertura Curricular',
      value: `${metrics?.curriculumCoverage || 0}%`,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      href: '/coordinador/curriculum'
    },
    {
      title: 'Docentes Supervisados', 
      value: metrics?.totalTeachers || 0,
      icon: UsersIcon,
      color: 'bg-purple-500',
      href: '/coordinador/teachers'
    },
    {
      title: 'Uso de Engines',
      value: `${metrics?.averageEngineUsage || 0}%`,
      icon: BeakerIcon,
      color: 'bg-orange-500',
      href: '/coordinador/engines'
    },
    {
      title: 'Engagement Estudiantil',
      value: `${metrics?.studentEngagement || 0}%`,
      icon: ChartBarIcon,
      color: 'bg-cyan-500',
      href: '/coordinador/analytics'
    },
    {
      title: 'OA Cumplidos',
      value: `${metrics?.learningObjectivesMet || 0}%`,
      icon: CogIcon,
      color: 'bg-red-500',
      href: '/coordinador/objectives'
    }
  ];

  return (
    <DashboardLayout title="Dashboard Coordinador Pedagógico" role="COORDINADOR_PEDAGOGICO">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-gray-600 mt-2">
            Coordinador Pedagógico - Panel de gestión curricular y supervisión docente
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => window.location.href = card.href}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de acciones rápidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <DocumentTextIcon className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-medium text-gray-900">Aprobar Planificaciones</h3>
              <p className="text-sm text-gray-600">Revisar planificaciones pendientes</p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <BeakerIcon className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-medium text-gray-900">Configurar Engines</h3>
              <p className="text-sm text-gray-600">Gestionar engines educativos</p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <ChartBarIcon className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="font-medium text-gray-900">Ver Analytics</h3>
              <p className="text-sm text-gray-600">Analizar rendimiento pedagógico</p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <UsersIcon className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="font-medium text-gray-900">Supervisar Docentes</h3>
              <p className="text-sm text-gray-600">Monitorear desempeño docente</p>
            </button>
          </div>
        </div>

        {/* Resumen de actividad reciente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Planificación de Matemáticas 4°B aprobada</span>
              <span className="text-gray-400">hace 2 horas</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Engine ENG01 configurado para 2°A</span>
              <span className="text-gray-400">hace 4 horas</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Reporte pedagógico semanal generado</span>
              <span className="text-gray-400">hace 1 día</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

---

## 📚 **CASO 3: AGREGAR NUEVA MATERIA**

### **Ejemplo: EDUCACIÓN FÍSICA (EDF)**

#### **Paso 1: Definir Estructura de la Materia**

```javascript
// Configuración completa para Educación Física
const EducacionFisicaConfig = {
  subject_code: "EDF",
  subject_name: "Educación Física y Salud",
  grades: ["1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B"],
  
  // Engines específicos para Educación Física
  engines: [
    {
      engine_id: "ENG20",
      code: "MOVEMENT_TRACKER",
      name: "Movement Tracker",
      description: "Seguimiento de movimientos y ejercicios corporales",
      mechanics: ["motion_detection", "posture_analysis", "movement_sequence"],
      special_requirements: {
        camera_access: true,
        motion_sensors: true,
        pose_detection: true
      }
    },
    {
      engine_id: "ENG21", 
      code: "SPORTS_SIMULATOR",
      name: "Sports Simulator",
      description: "Simulador de deportes y actividades físicas",
      mechanics: ["game_rules", "team_coordination", "strategy_planning"],
      special_requirements: {
        multiplayer_support: true,
        real_time_coordination: true,
        score_tracking: true
      }
    },
    {
      engine_id: "ENG22",
      code: "HEALTH_MONITOR", 
      name: "Health Monitor",
      description: "Monitor de salud y bienestar físico",
      mechanics: ["health_tracking", "nutrition_planning", "wellness_goals"],
      special_requirements: {
        data_privacy_high: true,
        parental_consent: true,
        health_data_protection: true
      }
    }
  ],
  
  // Configuraciones de evaluación por Bloom para Educación Física
bloom_configurations: [
    {
      category: "deportivo",
      themes: ["futbol", "basquetbol", "voleibol", "atletismo", "natacion"]
    },
    {
      category: "olimpico", 
      themes: ["juegos_olimpicos", "competencia", "medallas", "records"]
    },
    {
      category: "naturaleza",
      themes: ["outdoor", "aventura", "montaña", "playa", "bosque"]
    },
    {
      category: "bienestar",
      themes: ["yoga", "meditacion", "relajacion", "salud_mental"]
    }
  ],
  
  // Objetivos de Aprendizaje específicos
  learning_objectives: [
    {
      grade: "1B",
      oa_codes: ["EF01OA01", "EF01OA02", "EF01OA03"],
      oa_descriptions: [
        "Demostrar habilidades motrices básicas de locomoción",
        "Practicar habilidades motrices básicas de manipulación", 
        "Ejecutar acciones motrices que presenten una solución a un problema"
      ]
    },
    {
      grade: "2B",
      oa_codes: ["EF02OA01", "EF02OA02", "EF02OA03"],
      oa_descriptions: [
        "Demostrar habilidades motrices básicas de locomoción, manipulación y estabilidad",
        "Ejecutar acciones motrices de manipulación",
        "Practicar una amplia gama de habilidades motrices básicas"
      ]
    }
    // ... más grados
  ],
  
  // Características especiales de la materia
  special_features: {
    motion_tracking: {
      enabled: true,
      privacy_level: "high",
      data_retention: "session_only",
      parental_approval_required: true
    },
    health_metrics: {
      enabled: true,
      metrics: ["heart_rate_estimation", "activity_duration", "movement_quality"],
      data_sharing: "anonymized_only"
    },
    team_activities: {
      enabled: true,
      max_participants: 30,
      real_time_coordination: true,
      voice_chat_support: false // Por privacidad de menores
    },
    accessibility: {
      motor_impairment_support: true,
      adaptive_exercises: true,
      alternative_assessments: true,
      inclusive_design: true
    }
  }
};
```

#### **Paso 2: Implementar Engine de Movimiento**

Crear archivo: `/server/services/movementTrackerEngine.js`

```javascript
const { supabase } = require('../database/supabase');
const logger = require('../utils/logger');

class MovementTrackerEngine {
  constructor() {
    this.supportedMovements = [
      'jumping_jacks', 'squats', 'arm_circles', 'marching_in_place',
      'toe_touches', 'balance_on_one_foot', 'running_in_place'
    ];
    
    this.difficultyLevels = {
      easy: { duration: 30, movements: 3, complexity: 'basic' },
      medium: { duration: 60, movements: 5, complexity: 'intermediate' },
      hard: { duration: 90, movements: 7, complexity: 'advanced' }
    };
    
    this.ageAppropriateMovements = {
      '1B': ['jumping_jacks', 'arm_circles', 'marching_in_place'],
      '2B': ['jumping_jacks', 'squats', 'arm_circles', 'marching_in_place'],
      '3B': ['jumping_jacks', 'squats', 'arm_circles', 'toe_touches', 'balance_on_one_foot'],
      '4B': this.supportedMovements, // Todos los movimientos
      '5B': this.supportedMovements,
      '6B': this.supportedMovements
    };
  }

  generateMovementSequence(config) {
    const { grade = '3B', difficulty = 'medium', focus_area = 'general' } = config;
    const diffConfig = this.difficultyLevels[difficulty];
    const availableMovements = this.ageAppropriateMovements[grade] || this.supportedMovements;
    
    const sequence = [];
    const selectedMovements = this.selectMovements(availableMovements, diffConfig.movements, focus_area);
    
    selectedMovements.forEach((movement, index) => {
      sequence.push({
        id: `movement_${index + 1}`,
        type: 'motion_exercise',
        movement_name: movement,
        display_name: this.getMovementDisplayName(movement),
        instructions: this.getMovementInstructions(movement, grade),
        duration_seconds: diffConfig.duration / selectedMovements.length,
        demonstration_video: `/videos/movements/${movement}_demo.mp4`,
        target_reps: this.getTargetReps(movement, difficulty, grade),
        validation_method: 'pose_detection',
        accessibility_alternatives: this.getAccessibilityAlternatives(movement),
        engine_specific: {
          pose_keypoints: this.getPoseKeypoints(movement),
          validation_threshold: 0.75,
          feedback_type: 'real_time_visual',
          encouragement_messages: this.getEncouragementMessages(movement),
          completion_celebration: 'movement_success_animation'
        }
      });
    });
    
    return sequence;
  }

  selectMovements(available, count, focusArea) {
    let filtered = available;
    
    // Filtrar por área de enfoque si se especifica
    if (focusArea !== 'general') {
      const focusMovements = {
        'upper_body': ['arm_circles', 'toe_touches'],
        'lower_body': ['squats', 'jumping_jacks', 'marching_in_place'],
        'balance': ['balance_on_one_foot', 'marching_in_place'],
        'cardio': ['jumping_jacks', 'running_in_place', 'squats']
      };
      filtered = available.filter(m => focusMovements[focusArea]?.includes(m)) || available;
    }
    
    // Seleccionar movimientos variados
    const selected = [];
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      selected.push(shuffled[i]);
    }
    
    return selected;
  }

  getMovementDisplayName(movement) {
    const displayNames = {
      'jumping_jacks': 'Saltos de Tijera',
      'squats': 'Sentadillas',
      'arm_circles': 'Círculos con los Brazos',
      'marching_in_place': 'Marcha en el Lugar',
      'toe_touches': 'Tocar los Dedos de los Pies',
      'balance_on_one_foot': 'Equilibrio en Un Pie',
      'running_in_place': 'Correr en el Lugar'
    };
    return displayNames[movement] || movement;
  }

  getMovementInstructions(movement, grade) {
    const instructions = {
      'jumping_jacks': {
        '1B': 'Salta abriendo y cerrando las piernas, mientras mueves los brazos arriba y abajo. ¡Como una estrella!',
        '2B': 'Salta separando las piernas y levantando los brazos. Luego junta las piernas y baja los brazos.',
        'default': 'Realiza saltos de tijera coordinando brazos y piernas. Mantén un ritmo constante.'
      },
      'squats': {
        '1B': 'Dobla las rodillas como si te fueras a sentar en una silla invisible. ¡Luego levántate!',
        '2B': 'Baja doblando las rodillas hasta que tus piernas formen un ángulo de 90 grados. Mantén la espalda recta.',
        'default': 'Realiza sentadillas manteniendo la postura correcta. Baja controladamente y sube con fuerza.'
      }
      // ... más movimientos
    };
    
    return instructions[movement]?.[grade] || instructions[movement]?.default || 'Sigue las instrucciones del video.';
  }

  getTargetReps(movement, difficulty, grade) {
    const baseReps = {
      'jumping_jacks': { easy: 10, medium: 15, hard: 20 },
      'squats': { easy: 8, medium: 12, hard: 16 },
      'arm_circles': { easy: 10, medium: 15, hard: 20 },
      'marching_in_place': { easy: 20, medium: 30, hard: 40 },
      'toe_touches': { easy: 8, medium: 12, hard: 16 },
      'balance_on_one_foot': { easy: 15, medium: 30, hard: 45 }, // segundos
      'running_in_place': { easy: 15, medium: 25, hard: 35 }
    };
    
    const gradeMultiplier = {
      '1B': 0.7, '2B': 0.8, '3B': 0.9, 
      '4B': 1.0, '5B': 1.1, '6B': 1.2
    };
    
    const base = baseReps[movement]?.[difficulty] || 10;
    const multiplier = gradeMultiplier[grade] || 1.0;
    
    return Math.round(base * multiplier);
  }

  getPoseKeypoints(movement) {
    // Puntos clave para detección de pose según el movimiento
    const keypoints = {
      'jumping_jacks': ['shoulders', 'elbows', 'wrists', 'hips', 'knees', 'ankles'],
      'squats': ['hips', 'knees', 'ankles', 'spine_alignment'],
      'arm_circles': ['shoulders', 'elbows', 'wrists'],
      'marching_in_place': ['hips', 'knees', 'ankles'],
      'toe_touches': ['spine', 'hips', 'knees', 'wrists'],
      'balance_on_one_foot': ['hips', 'knees', 'ankles', 'center_of_mass'],
      'running_in_place': ['knees', 'ankles', 'arm_swing']
    };
    
    return keypoints[movement] || ['full_body'];
  }

  getAccessibilityAlternatives(movement) {
    const alternatives = {
      'jumping_jacks': {
        'motor_impairment': 'Sentado: Mueve brazos arriba y abajo mientras separas y juntas las piernas',
        'limited_mobility': 'Solo movimiento de brazos con el mismo patrón',
        'balance_issues': 'Realiza el ejercicio apoyándote en una silla'
      },
      'squats': {
        'motor_impairment': 'Sentado: Levántate y siéntate de la silla con ayuda',
        'limited_mobility': 'Flexión de rodillas parcial según capacidad',
        'balance_issues': 'Usa una silla como apoyo para mantener equilibrio'
      }
      // ... más movimientos
    };
    
    return alternatives[movement] || {
      'default': 'Adapta el movimiento según tus capacidades. Lo importante es participar.'
    };
  }

  getEncouragementMessages(movement) {
    return [
      '¡Excelente trabajo!', '¡Sigue así!', '¡Muy bien!', '¡Perfecto!',
      '¡Eres increíble!', '¡Gran esfuerzo!', '¡Fantástico!', '¡Bravo!'
    ];
  }

  // Validar movimiento usando datos de pose detection
  validateMovement(movementData, expectedMovement) {
    const { pose_keypoints, confidence, duration } = movementData;
    const required_keypoints = this.getPoseKeypoints(expectedMovement);
    
    // Verificar que se detectaron los puntos clave necesarios
    const detectedKeypoints = Object.keys(pose_keypoints);
    const requiredDetected = required_keypoints.filter(kp => 
      detectedKeypoints.includes(kp) && pose_keypoints[kp].confidence > 0.6
    );
    
    const accuracy = requiredDetected.length / required_keypoints.length;
    const isValid = accuracy >= 0.75 && confidence >= 0.7;
    
    return {
      valid: isValid,
      accuracy: Math.round(accuracy * 100),
      confidence: Math.round(confidence * 100),
      detected_keypoints: requiredDetected,
      feedback: this.generateMovementFeedback(accuracy, confidence, expectedMovement),
      celebration_level: this.getCelebrationLevel(accuracy)
    };
  }

  generateMovementFeedback(accuracy, confidence, movement) {
    if (accuracy >= 0.9) {
      return `¡Perfecto! Tu ${this.getMovementDisplayName(movement)} fue excelente.`;
    } else if (accuracy >= 0.75) {
      return `¡Muy bien! Tu ${this.getMovementDisplayName(movement)} estuvo genial.`;
    } else if (accuracy >= 0.5) {
      return `Bien hecho. Intenta mejorar la forma de tu ${this.getMovementDisplayName(movement)}.`;
    } else {
      return `Sigue intentando. Observa el video ejemplo para mejorar tu ${this.getMovementDisplayName(movement)}.`;
    }
  }

  getCelebrationLevel(accuracy) {
    if (accuracy >= 0.9) return 'excellent';
    if (accuracy >= 0.75) return 'good';
    if (accuracy >= 0.5) return 'okay';
    return 'encourage';
  }
}

module.exports = { MovementTrackerEngine };
```

#### **Paso 3: Crear API Routes para Educación Física**

Crear archivo: `/server/routes/educacionFisica.js`

```javascript
const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { MovementTrackerEngine } = require('../services/movementTrackerEngine');
const logger = require('../utils/logger');

const router = express.Router();
const movementEngine = new MovementTrackerEngine();

// GET /api/educacion-fisica/movements - Obtener movimientos disponibles
router.get('/movements', authenticateToken, async (req, res) => {
  try {
    const { grade = '3B' } = req.query;
    
    const availableMovements = movementEngine.ageAppropriateMovements[grade] || 
                              movementEngine.supportedMovements;
    
    const movements = availableMovements.map(movement => ({
      id: movement,
      name: movementEngine.getMovementDisplayName(movement),
      instructions: movementEngine.getMovementInstructions(movement, grade),
      demo_video: `/videos/movements/${movement}_demo.mp4`,
      difficulty_levels: ['easy', 'medium', 'hard'],
      focus_areas: movementEngine.getMovementFocusAreas(movement),
      accessibility_support: true
    }));
    
    res.json({
      success: true,
      data: {
        grade: grade,
        total_movements: movements.length,
        movements: movements
      }
    });
    
  } catch (error) {
    logger.error('Get movements error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve movements',
        code: 'MOVEMENTS_ERROR'
      }
    });
  }
});

// POST /api/educacion-fisica/sequence/generate - Generar secuencia de ejercicios
router.post('/sequence/generate', authenticateToken, requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const {
      grade = '3B',
      difficulty = 'medium',
      focus_area = 'general',
      duration_minutes = 10,
      accessibility_mode = false
    } = req.body;
    
    console.log(`🏃 Generating movement sequence for grade ${grade}, difficulty ${difficulty}`);
    
    const config = {
      grade,
      difficulty,
      focus_area,
      duration_minutes,
      accessibility_mode
    };
    
    const sequence = movementEngine.generateMovementSequence(config);
    
    const sessionData = {
      session_id: `edf_${Date.now()}`,
      grade: grade,
      difficulty: difficulty,
      focus_area: focus_area,
      total_duration: duration_minutes * 60,
      movement_count: sequence.length,
      accessibility_enabled: accessibility_mode,
      sequence: sequence,
      created_at: new Date().toISOString(),
      created_by: req.user.user_id
    };
    
    res.json({
      success: true,
      data: sessionData,
      message: `Secuencia de ${sequence.length} ejercicios generada para ${grade}`
    });
    
  } catch (error) {
    logger.error('Generate sequence error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to generate movement sequence',
        code: 'SEQUENCE_GENERATION_ERROR'
      }
    });
  }
});

// POST /api/educacion-fisica/movement/validate - Validar ejecución de movimiento
router.post('/movement/validate', authenticateToken, async (req, res) => {
  try {
    const {
      movement_id,
      expected_movement,
      pose_data,
      student_id,
      session_id
    } = req.body;
    
    console.log(`🔍 Validating movement ${expected_movement} for student ${student_id}`);
    
    // Validar el movimiento usando el engine
    const validation = movementEngine.validateMovement(pose_data, expected_movement);
    
    // Registrar el intento en la base de datos (opcional)
    const attempt = {
      student_id,
      session_id,
      movement_id,
      movement_name: expected_movement,
      accuracy: validation.accuracy,
      confidence: validation.confidence,
      is_valid: validation.valid,
      feedback: validation.feedback,
      celebration_level: validation.celebration_level,
      detected_keypoints: validation.detected_keypoints,
      attempted_at: new Date().toISOString()
    };
    
    // Aquí podrías guardar en base de datos si quieres tracking
    // await saveMovementAttempt(attempt);
    
    res.json({
      success: true,
      validation: validation,
      attempt: attempt,
      message: validation.valid ? 'Movimiento validado exitosamente' : 'Sigue practicando'
    });
    
  } catch (error) {
    logger.error('Movement validation error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to validate movement',
        code: 'MOVEMENT_VALIDATION_ERROR'
      }
    });
  }
});

// GET /api/educacion-fisica/student/:id/progress - Progreso del estudiante
router.get('/student/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id: studentId } = req.params;
    const { timeframe = 'week' } = req.query;
    
    // Simular datos de progreso (en implementación real vendría de base de datos)
    const progressData = {
      student_id: studentId,
      timeframe: timeframe,
      total_sessions: 8,
      total_movements_attempted: 45,
      total_movements_completed: 38,
      average_accuracy: 84,
      favorite_movements: ['jumping_jacks', 'arm_circles'],
      improvement_areas: ['squats', 'balance_on_one_foot'],
      achievements: [
        { id: 'first_perfect_session', name: 'Sesión Perfecta', unlocked: true },
        { id: 'movement_master', name: 'Maestro del Movimiento', unlocked: false }
      ],
      weekly_activity: [
        { date: '2024-12-01', movements: 6, accuracy: 82 },
        { date: '2024-12-02', movements: 5, accuracy: 88 },
        { date: '2024-12-03', movements: 7, accuracy: 85 },
        // ... más días
      ]
    };
    
    res.json({
      success: true,
      data: progressData
    });
    
  } catch (error) {
    logger.error('Get student progress error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve student progress',
        code: 'PROGRESS_ERROR'
      }
    });
  }
});

module.exports = router;
```

#### **Paso 4: Integrar con el Sistema Principal**

Modificar archivo: `/server/index.js`

```javascript
// Agregar la nueva ruta
const educacionFisicaRoutes = require('./routes/educacionFisica');

// ... resto del código ...

// Registrar las rutas
app.use('/api/educacion-fisica', educacionFisicaRoutes);
```

---

## 🔧 **PATRONES Y MEJORES PRÁCTICAS**

### **1. Patrón de Extensión de Engines**

```javascript
// Template base para cualquier nuevo engine
class BaseEducationalEngine {
  constructor(config) {
    this.engineId = config.engine_id;
    this.subjects = config.subjects;
    this.grades = config.grades;
    this.difficultyLevels = config.difficulty_levels;
  }

  // Métodos obligatorios que todo engine debe implementar
  generateContent(config) {
    throw new Error('generateContent must be implemented');
  }

  validateAnswer(question, userAnswer) {
    throw new Error('validateAnswer must be implemented');
  }

  getProgressMetrics(studentData) {
    throw new Error('getProgressMetrics must be implemented');
  }

  // Métodos opcionales con implementación por defecto
  getHints(question) {
    return ['Revisa la pregunta cuidadosamente', 'Piensa paso a paso'];
  }

  getFeedback(isCorrect, question) {
    return isCorrect ? '¡Correcto!' : 'Intenta nuevamente';
  }

  getAdaptiveDifficulty(studentPerformance) {
    if (studentPerformance.accuracy > 0.8) return 'increase';
    if (studentPerformance.accuracy < 0.5) return 'decrease';
    return 'maintain';
  }
}

// Ejemplo de implementación específica
class YourCustomEngine extends BaseEducationalEngine {
  generateContent(config) {
    // Tu lógica específica aquí
    return {
      questions: [], // Preguntas generadas
      metadata: {}, // Metadatos del contenido
      engine_config: {} // Configuración específica
    };
  }

  validateAnswer(question, userAnswer) {
    // Tu lógica de validación aquí
    return {
      correct: boolean,
      feedback: string,
      score: number,
      hints: string[]
    };
  }

  getProgressMetrics(studentData) {
    // Tu lógica de progreso aquí
    return {
      mastery_level: number,
      areas_to_improve: string[],
      achievements: object[]
    };
  }
}
```

### **2. Patrón de Extensión de Roles**

```typescript
// Interface base para cualquier nuevo rol
interface BaseRoleCapabilities {
  // Permisos básicos
  canViewOwnData: boolean;
  canUpdateOwnProfile: boolean;
  
  // Permisos educativos
  canViewEducationalContent?: boolean;
  canParticipateInActivities?: boolean;
  
  // Permisos administrativos
  canManageUsers?: boolean;
  canViewAnalytics?: boolean;
  canConfigureSystem?: boolean;
}

// Implementación específica para tu nuevo rol
interface YourCustomRoleCapabilities extends BaseRoleCapabilities {
  // Permisos específicos de tu rol
  canDoSpecificAction: boolean;
  canAccessSpecialFeature: boolean;
  canManageSpecificResource: boolean;
}

// Configuración completa del rol
const YourCustomRoleConfig = {
  role_name: 'YOUR_CUSTOM_ROLE',
  display_name: 'Tu Rol Personalizado',
  description: 'Descripción de las responsabilidades del rol',
  permissions: [
    'permission.one', 'permission.two', 'permission.three'
  ],
  dashboard_route: '/your-custom-role/dashboard',
  default_landing_page: '/your-custom-role/home',
  menu_items: [
    { title: 'Inicio', route: '/your-custom-role/dashboard', icon: 'home' },
    { title: 'Función 1', route: '/your-custom-role/function1', icon: 'feature1' },
    { title: 'Función 2', route: '/your-custom-role/function2', icon: 'feature2' }
  ],
  capabilities: YourCustomRoleCapabilities
};
```

### **3. Patrón de Extensión de Materias**

```javascript
// Template base para cualquier nueva materia
const SubjectTemplate = {
  subject_code: "XXX", // Código de 3 letras
  subject_name: "Nombre de la Materia",
  category: "obligatoria|electiva|especializada",
  grades: ["1B", "2B", "3B", "4B", "5B", "6B"],
  
  // Engines específicos de la materia
  engines: [
    {
      engine_id: "ENGXX",
      priority: "high|medium|low",
      integration_level: "full|partial|experimental"
    }
  ],
  
  // Configuración de evaluación
  evaluation_config: {
    supports_formative: true,
    supports_summative: true,
    requires_special_tools: false,
    assessment_types: ["quiz", "project", "performance", "portfolio"]
  },
  
  // Configuración de accesibilidad
  accessibility_config: {
    visual_support_required: false,
    audio_support_required: false,
    motor_adaptations_available: true,
    alternative_formats: ["text", "audio", "visual", "interactive"]
  },
  
  // Objetivos de aprendizaje por grado
  learning_objectives_by_grade: {
    "1B": [
      { oa_code: "XX01OA01", description: "...", bloom_level: "Recordar" }
    ]
  },
  
  // Configuración específica de la materia
  subject_specific_config: {
    // Configuraciones únicas para tu materia
    special_requirements: {},
    tools_needed: [],
    safety_considerations: [],
    parental_permissions_required: false
  }
};
```

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **Para Nuevo Engine:**
- [ ] ✅ Definir especificaciones JSON
- [ ] ✅ Crear migración de base de datos
- [ ] ✅ Implementar servicio backend
- [ ] ✅ Agregar rutas API específicas
- [ ] ✅ Crear componente React frontend
- [ ] ✅ Diseñar configuraciones de evaluación por Bloom
- [ ] ✅ Implementar validación de respuestas
- [ ] ✅ Crear tests unitarios
- [ ] ✅ Documentar APIs
- [ ] ✅ Agregar a lista de engines disponibles

### **Para Nuevo Rol:**
- [ ] ✅ Definir permisos específicos
- [ ] ✅ Actualizar CHECK constraints en DB
- [ ] ✅ Insertar permisos en tabla permissions
- [ ] ✅ Actualizar middleware RBAC
- [ ] ✅ Crear dashboard específico
- [ ] ✅ Implementar rutas de navegación
- [ ] ✅ Actualizar sistema de autenticación
- [ ] ✅ Crear componentes UI específicos
- [ ] ✅ Definir flujos de trabajo
- [ ] ✅ Documentar responsabilidades

### **Para Nueva Materia:**
- [ ] ✅ Definir estructura curricular
- [ ] ✅ Crear objetivos de aprendizaje
- [ ] ✅ Diseñar engines específicos
- [ ] ✅ Implementar evaluaciones adaptadas
- [ ] ✅ Crear configuraciones de evaluación por Bloom
- [ ] ✅ Configurar accesibilidad
- [ ] ✅ Integrar con sistema principal
- [ ] ✅ Validar con expertos educativos
- [ ] ✅ Crear contenido demo
- [ ] ✅ Documentar implementación

---

## 🚀 **TESTING Y VALIDACIÓN**

### **Testing de Nuevos Engines**

```javascript
// Ejemplo de test para nuevo engine
describe('Geography Engine (ENG11)', () => {
  let geographyEngine;

  beforeEach(() => {
    geographyEngine = new GeographyEngineService();
  });

  test('should generate appropriate questions for grade level', () => {
    const config = { grade: '4B', difficulty: 'medium', num_questions: 5 };
    const questions = geographyEngine.generateGeographyQuestions(config);
    
    expect(questions).toHaveLength(5);
    expect(questions[0]).toHaveProperty('id');
    expect(questions[0]).toHaveProperty('stem_md');
    expect(questions[0]).toHaveProperty('engine_specific');
    expect(questions[0].subject).toBe('GEO');
  });

  test('should validate map click answers correctly', () => {
    const question = {
      type: 'map_click',
      engine_specific: {
        correct_coordinates: { lat: -33.4489, lng: -70.6693 }, // Santiago
        tolerance_radius: 50
      }
    };
    
    const userAnswer = { coordinates: { lat: -33.45, lng: -70.67 } };
    const validation = geographyEngine.validateGeographyAnswer(question, userAnswer);
    
    expect(validation.correct).toBe(true);
    expect(validation.distance).toBeLessThan(50);
  });
});
```

### **Testing de Nuevos Roles**

```javascript
describe('Coordinador Pedagógico Role', () => {
  test('should have correct permissions', () => {
    const permissions = ROLE_PERMISSIONS.COORDINADOR_PEDAGOGICO;
    
    expect(permissions).toContain('curriculum.design');
    expect(permissions).toContain('teacher.supervise');
    expect(permissions).toContain('engine.configure');
    expect(permissions).not.toContain('system.admin');
  });

  test('should access appropriate dashboard', async () => {
    const response = await request(app)
      .get('/coordinador/dashboard')
      .set('Authorization', 'Bearer coordinador-token')
      .expect(200);
      
    expect(response.body).toHaveProperty('metrics');
    expect(response.body.metrics).toHaveProperty('activeLessonPlans');
  });
});
```

---

## 📞 **SOPORTE Y RECURSOS**

### **Documentación de Referencia**
- `DOCUMENTACION_PROYECTO_EDU21_COMPLETA.md` - Documentación principal
- `/server/database/init.sql` - Esquema de base de datos
- `/client/src/types/index.ts` - Tipos TypeScript
- `/server/middleware/rbac.js` - Sistema de permisos

### **APIs de Desarrollo**
- **Engines**: `GET /api/engines/` - Lista engines disponibles
- **Evaluaciones**: `GET /api/evaluations/` - Lista configuraciones de evaluación disponibles  
- **Permisos**: `GET /api/auth/permissions` - Lista permisos
- **Roles**: `GET /api/auth/roles` - Lista roles

### **Herramientas de Desarrollo**
- **Testing**: Jest + Supertest para APIs
- **Linting**: ESLint con reglas EDU21
- **Type Checking**: TypeScript en frontend
- **Database**: Supabase Dashboard para SQL

---

*"La arquitectura modular de EDU21 está diseñada para facilitar la extensión y personalización según las necesidades específicas de cada implementación."*

**Última actualización:** Diciembre 2024  
**Versión guía:** 1.0  
**Próxima revisión:** Enero 2025 