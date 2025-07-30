'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  PlayIcon, 
  AcademicCapIcon,
  SparklesIcon,
  CalculatorIcon,
  BookOpenIcon,
  BeakerIcon,
  ClockIcon,
  UserGroupIcon,
  CogIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'

// Demos fundamentales y validados para cada engine
const VALIDATED_DEMOS = [
  // ENG01 - Counter/Number Line (Matemática)
  { 
    code: 'DEMO01', 
    title: 'Conteo Interactivo', 
    subject: 'MAT', 
    grade: '1B', 
    engine: 'ENG01', 
    engineName: 'Counter/Number Line',
    description: 'Aprende a contar del 1 al 20 con elementos visuales',
    icon: <CalculatorIcon className="w-6 h-6" />, 
    color: 'bg-blue-500',
    skinsAvailable: 2
  },
  
  // ENG02 - Drag-Drop Numbers (Matemática)
  { 
    code: 'DEMO02', 
    title: 'Operaciones Básicas', 
    subject: 'MAT', 
    grade: '1B', 
    engine: 'ENG02', 
    engineName: 'Drag-Drop Numbers',
    description: 'Suma y resta arrastrando números',
    icon: <CalculatorIcon className="w-6 h-6" />, 
    color: 'bg-blue-500',
    skinsAvailable: 1
  },
  
  // ENG05 - Text Recognition (Lenguaje)
  { 
    code: 'DEMO05', 
    title: 'Reconocimiento de Letras', 
    subject: 'LEN', 
    grade: '1B', 
    engine: 'ENG05', 
    engineName: 'Text Recognition',
    description: 'Identifica y reconoce letras del alfabeto',
    icon: <BookOpenIcon className="w-6 h-6" />, 
    color: 'bg-green-500',
    skinsAvailable: 1
  },
  
  // ENG06 - Letter-Sound Matching (Lenguaje)
  { 
    code: 'DEMO06', 
    title: 'Sonidos y Letras', 
    subject: 'LEN', 
    grade: '1B', 
    engine: 'ENG06', 
    engineName: 'Letter-Sound Matching',
    description: 'Conecta sonidos fonéticos con letras',
    icon: <BookOpenIcon className="w-6 h-6" />, 
    color: 'bg-green-500',
    skinsAvailable: 1
  },
  
  // ENG07 - Reading Fluency (Lenguaje)
  { 
    code: 'DEMO07', 
    title: 'Lectura Fluida', 
    subject: 'LEN', 
    grade: '2B', 
    engine: 'ENG07', 
    engineName: 'Reading Fluency',
    description: 'Practica lectura con ritmo y comprensión',
    icon: <BookOpenIcon className="w-6 h-6" />, 
    color: 'bg-green-500',
    skinsAvailable: 1
  },
  
  // ENG09 - Life Cycle Simulator (Ciencias Naturales)
  { 
    code: 'DEMO09', 
    title: 'Ciclos de Vida', 
    subject: 'CN', 
    grade: '2B', 
    engine: 'ENG09', 
    engineName: 'Life Cycle Simulator',
    description: 'Explora ciclos de vida de plantas y animales',
    icon: <BeakerIcon className="w-6 h-6" />, 
    color: 'bg-purple-500',
    skinsAvailable: 1
  }
];

const SUBJECTS: Record<string, { name: string; color: string; icon: React.ReactElement }> = {
  'MAT': { name: 'Matemática', color: 'bg-blue-500', icon: <CalculatorIcon className="w-5 h-5" /> },
  'LEN': { name: 'Lenguaje', color: 'bg-green-500', icon: <BookOpenIcon className="w-5 h-5" /> },
  'CN': { name: 'Ciencias', color: 'bg-purple-500', icon: <BeakerIcon className="w-5 h-5" /> }
};

const GRADES: Record<string, string> = {
  '1B': '1° Básico',
  '2B': '2° Básico'
};

export default function DemosPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const filteredGames = VALIDATED_DEMOS.filter(game => {
    if (selectedSubject !== 'ALL' && game.subject !== selectedSubject) return false;
    return true;
  });

  const joinGame = async (code: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/student/games/join?code=${code}`);
    } catch (error) {
      console.error('Error joining game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSkins = (engineId: string) => {
    router.push(`/teacher/skins?engine=${engineId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <SparklesIcon className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Demos Validados EDU21
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora los <strong>6 demos fundamentales</strong> del sistema EDU21. 
            Cada demo está validado y listo para usar con contenido educativo real.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              3-5 min por demo
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              Listo para usar
            </div>
            <div className="flex items-center">
              <AcademicCapIcon className="w-4 h-4 mr-1" />
              1° y 2° Básico
            </div>
          </div>
        </div>

        {/* Demo especial de Skins */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SwatchIcon className="w-12 h-12 mr-4" />
              <div>
                <h2 className="text-2xl font-bold mb-1">🧪 Demo Interactivo: Skins</h2>
                <p className="text-orange-100">
                  Descubre cómo los skins transforman la experiencia educativa. 
                  Ve la diferencia entre un juego básico y uno personalizado.
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/demos/test-skin')}
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-6 py-3"
            >
              🎯 Probar Demo
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Materia:</span>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ALL">Todas</option>
                <option value="MAT">Matemática</option>
                <option value="LEN">Lenguaje</option>
                <option value="CN">Ciencias</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredGames.length} demos validados
            </div>
          </div>
        </div>

        {/* Grid de Juegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div key={game.code} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className={`${SUBJECTS[game.subject].color} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white">
                    {game.icon}
                    <span className="font-bold text-lg">{game.code}</span>
                  </div>
                  <div className="text-white text-sm font-medium">
                    {GRADES[game.grade]}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {game.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">
                  {game.description}
                </p>
                
                {/* ENGINE INFO */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Engine:</span>
                    <button 
                      onClick={() => goToSkins(game.engine)}
                      className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <SwatchIcon className="w-3 h-3" />
                      Ver Skins
                    </button>
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {game.engine}: {game.engineName}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {game.skinsAvailable} skins disponibles
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${SUBJECTS[game.subject].color} text-white`}>
                    {SUBJECTS[game.subject].icon}
                    <span className="ml-1">{SUBJECTS[game.subject].name}</span>
                  </span>
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Validado
                  </span>
                </div>
                
                <Button
                  onClick={() => joinGame(game.code)}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>{isLoading ? 'Cargando...' : 'Probar Demo'}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer de información */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Demos Validados y Listos
            </h3>
            <p className="text-gray-600 mb-4">
              Estos 6 demos han sido validados y contienen contenido educativo real para 1° y 2° Básico. 
              Cada uno está vinculado a un engine específico con skins personalizables.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">6</span>
                </div>
                <p className="font-medium">Engines Cubiertos</p>
                <p className="text-gray-500">Todos los engines básicos</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">7</span>
                </div>
                <p className="font-medium">Skins Disponibles</p>
                <p className="text-gray-500">Listos para aplicar</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">✓</span>
                </div>
                <p className="font-medium">Contenido Real</p>
                <p className="text-gray-500">Objetivos de Aprendizaje 1B</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 