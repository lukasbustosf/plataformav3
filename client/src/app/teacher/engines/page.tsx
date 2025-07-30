'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CpuChipIcon, PlayIcon, AdjustmentsHorizontalIcon, EyeIcon, FireIcon, SparklesIcon, CogIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// 🎮 Tipos para engines
interface Engine {
  id: string;
  name: string;
  description: string;
  category: string;
  mechanics: string;
  subjects: string[];
  grades: string[];
  demos: string[];
  skins_available: number;
  last_updated: string;
  status: 'active' | 'beta' | 'coming_soon';
}

const EnginesPage = () => {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 🎮 Información completa de engines
  const engineData: Engine[] = [
    {
      id: 'ENG01',
      name: 'Counter/Number Line',
      description: 'Sistema interactivo de conteo y líneas numéricas para aprendizaje de matemáticas básicas',
      category: 'mathematics',
      mechanics: 'Conteo visual, progresión numérica, manipulación directa',
      subjects: ['MAT'],
      grades: ['1B', '2B', '3B'],
      demos: ['game-demo-001', 'game-demo-002', 'game-demo-005', 'game-demo-007'],
      skins_available: 7,
      last_updated: '2024-12-09',
      status: 'active'
    },
    {
      id: 'ENG02', 
      name: 'Drag-Drop Numbers',
      description: 'Engine de arrastrar y soltar para operaciones matemáticas y clasificación',
      category: 'mathematics',
      mechanics: 'Drag & Drop, validación automática, retroalimentación inmediata',
      subjects: ['MAT'],
      grades: ['1B', '2B', '3B', '4B'],
      demos: ['game-demo-003', 'game-demo-004', 'game-demo-006', 'game-demo-008', 'game-demo-011', 'game-demo-015'],
      skins_available: 12,
      last_updated: '2024-12-09',
      status: 'active'
    },
    {
      id: 'ENG05',
      name: 'Text Recognition',
      description: 'Reconocimiento de patrones de texto y análisis de lectura',
      category: 'language',
      mechanics: 'OCR, análisis de patrones, detección de palabras',
      subjects: ['LEN'],
      grades: ['1B', '2B', '3B'],
      demos: ['game-demo-010', 'game-demo-012', 'game-demo-017', 'game-demo-020'],
      skins_available: 8,
      last_updated: '2024-12-09',
      status: 'active'
    },
    {
      id: 'ENG06',
      name: 'Letter-Sound Matching',
      description: 'Asociación de letras con sonidos para aprendizaje fonético',
      category: 'language',
      mechanics: 'Audio matching, reconocimiento fonético, feedback auditivo',
      subjects: ['LEN'],
      grades: ['1B', '2B'],
      demos: ['game-demo-009', 'game-demo-013', 'game-demo-018', 'game-demo-021'],
      skins_available: 6,
      last_updated: '2024-12-09',
      status: 'active'
    },
    {
      id: 'ENG07',
      name: 'Reading Fluency',
      description: 'Medición y mejora de fluidez lectora con tracking avanzado',
      category: 'language',
      mechanics: 'Speech recognition, WPM tracking, pronunciación',
      subjects: ['LEN'],
      grades: ['2B', '3B', '4B'],
      demos: ['game-demo-014', 'game-demo-016', 'game-demo-019', 'game-demo-022'],
      skins_available: 5,
      last_updated: '2024-12-09',
      status: 'active'
    },
    {
      id: 'ENG09',
      name: 'Life Cycle Simulator',
      description: 'Simulación interactiva de ciclos de vida y procesos naturales',
      category: 'science',
      mechanics: 'Simulación temporal, estados evolutivos, interacción científica',
      subjects: ['CN'],
      grades: ['1B', '2B', '3B', '4B'],
      demos: ['game-demo-023', 'game-demo-024'],
      skins_available: 4,
      last_updated: '2024-12-09',
      status: 'active'
    }
  ];

  // 🎨 Información de categorías
  const categoryInfo = {
    'mathematics': { name: 'Matemáticas', icon: '🧮', color: 'bg-blue-500', textColor: 'text-blue-600' },
    'language': { name: 'Lenguaje', icon: '📚', color: 'bg-purple-500', textColor: 'text-purple-600' },
    'science': { name: 'Ciencias', icon: '🧪', color: 'bg-green-500', textColor: 'text-green-600' }
  };

  useEffect(() => {
    // Simular carga de datos
    setEngines(engineData);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const filteredEngines = selectedCategory === 'all' 
    ? engines 
    : engines.filter(engine => engine.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Activo</span>;
      case 'beta':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Beta</span>;
      case 'coming_soon':
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Próximamente</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <CpuChipIcon className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-600">Cargando engines...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-lg">
              <CpuChipIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Engines de Juego</h1>
              <p className="text-gray-600">Motores de IA que impulsan los juegos educativos</p>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Engines Activos</p>
                  <p className="text-2xl font-bold text-blue-900">{engines.filter(e => e.status === 'active').length}</p>
                </div>
                <CpuChipIcon className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Demos Disponibles</p>
                  <p className="text-2xl font-bold text-green-900">{engines.reduce((acc, e) => acc + e.demos.length, 0)}</p>
                </div>
                <PlayIcon className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Skins Totales</p>
                  <p className="text-2xl font-bold text-purple-900">{engines.reduce((acc, e) => acc + e.skins_available, 0)}</p>
                </div>
                <SparklesIcon className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">Categorías</p>
                  <p className="text-2xl font-bold text-amber-900">{Object.keys(categoryInfo).length}</p>
                </div>
                <AdjustmentsHorizontalIcon className="w-8 h-8 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Categoría</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({engines.length})
            </button>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === key 
                    ? `${info.color} text-white` 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{info.icon}</span>
                {info.name} ({engines.filter(e => e.category === key).length})
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Engines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEngines.map((engine) => (
            <div key={engine.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header del engine */}
              <div className={`${categoryInfo[engine.category as keyof typeof categoryInfo]?.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryInfo[engine.category as keyof typeof categoryInfo]?.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold">{engine.name}</h3>
                      <p className="text-sm opacity-90">{engine.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(engine.status)}
                </div>
                <p className="text-sm opacity-90">{engine.description}</p>
              </div>

              {/* Contenido del engine */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Mecánicas:</p>
                    <p className="text-sm font-medium text-gray-900">{engine.mechanics}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Materias:</p>
                    <p className="text-sm font-medium text-gray-900">{engine.subjects.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Grados:</p>
                    <p className="text-sm font-medium text-gray-900">{engine.grades.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última actualización:</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(engine.last_updated).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <PlayIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{engine.demos.length} demos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">{engine.skins_available} skins</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Link 
                    href={`/teacher/skins?engine=${engine.id}`}
                    className="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    <SparklesIcon className="w-4 h-4" />
                    Ver Skins
                  </Link>
                  <Link 
                    href="/demos"
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <PlayIcon className="w-4 h-4" />
                    Probar Demos
                  </Link>
                  <button 
                    className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 transition-colors flex items-center gap-2"
                    title="Documentación técnica"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Documentación
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <CogIcon className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">¿Qué son los Engines?</h3>
              <p className="text-gray-700 text-sm mb-3">
                Los engines son motores de IA especializados que impulsan diferentes tipos de juegos educativos. 
                Cada engine está optimizado para mecánicas de juego específicas y objetivos de aprendizaje.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>ENG01-ENG02:</strong> Engines matemáticos para conteo y operaciones</li>
                <li>• <strong>ENG05-ENG07:</strong> Engines de lenguaje para lectura y escritura</li>
                <li>• <strong>ENG09:</strong> Engine de ciencias para simulaciones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnginesPage; 