'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { 
  PlayIcon, 
  UsersIcon, 
  ClockIcon, 
  CogIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function CreateGamePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [gameFormat, setGameFormat] = useState('trivia_lightning')

  const { data: quizzesData, isLoading } = useQuery(
    ['teacher-quizzes-for-game'],
    () => api.getQuizzes({ limit: 20 }),
    { enabled: !!user?.user_id }
  )

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      quiz_id: '',
      format: 'trivia_lightning',
      max_players: 30,
      time_limit: 30,
      show_correct_answers: true,
      allow_hints: false,
      shuffle_questions: true,
      shuffle_options: true,
      accessibility_mode: true,
      tts_enabled: true
    }
  })

  const gameFormats = [
    // Basic Games (G-01 to G-09)
    {
      id: 'trivia_lightning',
      name: 'Trivia Lightning',
      description: 'Respuestas rápidas con tiempo límite y ranking en tiempo real',
      icon: '⚡',
      features: ['Tiempo límite', 'Ranking en vivo', 'Puntuación inmediata'],
      bestFor: 'Repaso rápido y competencia',
      difficulty: 'easy',
      cycles: ['PreK', '1°-4° Básico']
    },
    {
      id: 'color_match',
      name: 'Color Match',
      description: 'Asocia colores con respuestas correctas',
      icon: '🎨',
      features: ['Visualización colorida', 'Memoria visual', 'Interacción táctil'],
      bestFor: 'Estudiantes visuales y kinestésicos',
      difficulty: 'easy',
      cycles: ['PreK', '1° Básico']
    },
    {
      id: 'memory_flip',
      name: 'Memory Flip',
      description: 'Encuentra las parejas de preguntas y respuestas',
      icon: '🧠',
      features: ['Memoria a corto plazo', 'Concentración', 'Trabajo en equipo'],
      bestFor: 'Consolidación de conceptos',
      difficulty: 'medium',
      cycles: ['1°-3° Básico']
    },
    {
      id: 'picture_bingo',
      name: 'Picture Bingo',
      description: 'Bingo con imágenes y conceptos educativos',
      icon: '🎯',
      features: ['Reconocimiento visual', 'Participación grupal', 'Diversión'],
      bestFor: 'Vocabulario y conceptos básicos',
      difficulty: 'medium',
      cycles: ['1°-4° Básico']
    },
    {
      id: 'drag_drop_sorting',
      name: 'Drag & Drop Sorting',
      description: 'Arrastrar fichas al contenedor correcto',
      icon: '📦',
      features: ['Clasificación', 'Motricidad fina', 'Pensamiento lógico'],
      bestFor: 'Categorización y organización',
      difficulty: 'medium',
      cycles: ['2°-5° Básico']
    },
    {
      id: 'number_line_race',
      name: 'Número-Línea Race',
      description: 'Resolver operación y avanzar en línea numérica',
      icon: '🏃',
      features: ['Matemáticas', 'Progresión visual', 'Competencia'],
      bestFor: 'Operaciones matemáticas',
      difficulty: 'medium',
      cycles: ['2°-5° Básico']
    },
    {
      id: 'word_builder',
      name: 'Word Builder',
      description: 'Arrastrar letras para formar palabras',
      icon: '🔤',
      features: ['Vocabulario', 'Ortografía', 'Construcción'],
      bestFor: 'Formación de palabras',
      difficulty: 'medium',
      cycles: ['1°-3° Básico']
    },
    {
      id: 'word_search',
      name: 'Sopa de Letras',
      description: 'Encontrar palabras escondidas en grilla',
      icon: '🔍',
      features: ['Búsqueda visual', 'Concentración', 'Vocabulario'],
      bestFor: 'Reconocimiento de palabras',
      difficulty: 'medium',
      cycles: ['3°-6° Básico']
    },
    {
      id: 'hangman_visual',
      name: 'Hangman Visual',
      description: 'Adivinar palabra con pistas visuales',
      icon: '🎪',
      features: ['Deducción', 'Vocabulario', 'Estrategia'],
      bestFor: 'Construcción de vocabulario',
      difficulty: 'medium',
      cycles: ['2°-6° Básico']
    },
    // Advanced Games (G-10 to G-16)
    {
      id: 'escape_room_mini',
      name: 'Escape Room Mini',
      description: 'Resolver 3 acertijos secuenciales',
      icon: '🔓',
      features: ['Resolución problemas', 'Pensamiento crítico', 'Trabajo equipo'],
      bestFor: 'Pensamiento complejo',
      difficulty: 'hard',
      cycles: ['3°-6° Básico']
    },
    {
      id: 'story_path',
      name: 'Story Path',
      description: 'Elección múltiple en narrativa ramificada',
      icon: '📖',
      features: ['Narrativa', 'Decisiones', 'Comprensión lectora'],
      bestFor: 'Comprensión y análisis',
      difficulty: 'hard',
      cycles: ['3°-8° Básico']
    },
    {
      id: 'board_race',
      name: 'Board Race',
      description: 'Carrera en tablero respondiendo preguntas',
      icon: '🏁',
      features: ['Progresión visual', 'Competencia sana', 'Motivación'],
      bestFor: 'Motivar participación activa',
      difficulty: 'medium',
      cycles: ['2°-6° Básico']
    },
    {
      id: 'crossword',
      name: 'Crossword',
      description: 'Rellenar crucigrama con pistas',
      icon: '📝',
      features: ['Vocabulario', 'Definiciones', 'Paciencia'],
      bestFor: 'Vocabulario avanzado',
      difficulty: 'hard',
      cycles: ['4°-8° Básico']
    },
    {
      id: 'word_search_duel',
      name: 'Word Search Duel',
      description: 'Dos equipos encuentran palabras competitivamente',
      icon: '⚔️',
      features: ['Competencia', 'Velocidad', 'Trabajo equipo'],
      bestFor: 'Competencia grupal',
      difficulty: 'hard',
      cycles: ['4°-8° Básico']
    },
    {
      id: 'timed_equation_duel',
      name: 'Timed Equation Duel',
      description: 'Operación matemática vs reloj',
      icon: '⏱️',
      features: ['Matemáticas', 'Velocidad', 'Precisión'],
      bestFor: 'Cálculo mental',
      difficulty: 'hard',
      cycles: ['3°-6° Básico']
    },
    {
      id: 'mystery_box_reveal',
      name: 'Mystery Box Reveal',
      description: 'Responder bien para revelar pista imagen',
      icon: '📦',
      features: ['Misterio', 'Revelación progresiva', 'Motivación'],
      bestFor: 'Motivación y curiosidad',
      difficulty: 'medium',
      cycles: ['PreK-4° Básico']
    },
    // Advanced Critical Thinking (G-17 to G-24)
    {
      id: 'debate_cards',
      name: 'Debate Cards',
      description: 'Seleccionar postura y argumentar con cartas evidencias',
      icon: '💬',
      features: ['Argumentación', 'Pensamiento crítico', 'Comunicación'],
      bestFor: 'Desarrollo del pensamiento crítico',
      difficulty: 'expert',
      cycles: ['7° Básico - 4° Medio']
    },
    {
      id: 'case_study_sprint',
      name: 'Case Study Sprint',
      description: 'Caso real con preguntas de opción múltiple cronometradas',
      icon: '📊',
      features: ['Análisis de casos', 'Decisiones', 'Tiempo límite'],
      bestFor: 'Análisis y toma de decisiones',
      difficulty: 'expert',
      cycles: ['7° Básico - Universitario']
    },
    {
      id: 'simulation_tycoon',
      name: 'Simulation Tycoon',
      description: 'Tomar decisiones y ver impacto en KPI',
      icon: '🏭',
      features: ['Simulación', 'Gestión', 'Causa-efecto'],
      bestFor: 'Pensamiento sistémico',
      difficulty: 'expert',
      cycles: ['8° Básico - Universitario']
    },
    {
      id: 'coding_puzzle',
      name: 'Coding Puzzle',
      description: 'Completar bloques de código/arrastrar',
      icon: '💻',
      features: ['Programación', 'Lógica', 'Resolución problemas'],
      bestFor: 'Pensamiento computacional',
      difficulty: 'expert',
      cycles: ['1° Medio - Universitario']
    },
    {
      id: 'data_lab',
      name: 'Data Lab',
      description: 'Arrastrar columnas para crear gráfico y responder',
      icon: '📈',
      features: ['Análisis datos', 'Gráficos', 'Interpretación'],
      bestFor: 'Análisis estadístico',
      difficulty: 'expert',
      cycles: ['1° Medio - Universitario']
    },
    {
      id: 'timeline_builder',
      name: 'Timeline Builder',
      description: 'Ordenar eventos históricos en línea temporal',
      icon: '📅',
      features: ['Cronología', 'Historia', 'Secuencia'],
      bestFor: 'Comprensión temporal',
      difficulty: 'hard',
      cycles: ['6° Básico - 2° Medio']
    },
    {
      id: 'argument_map',
      name: 'Argument Map',
      description: 'Conectar burbujas causa/efecto',
      icon: '🗺️',
      features: ['Mapeo conceptual', 'Relaciones', 'Argumentación'],
      bestFor: 'Análisis de argumentos',
      difficulty: 'expert',
      cycles: ['2° Medio - Universitario']
    },
    {
      id: 'advanced_escape_room',
      name: 'Advanced Escape Room',
      description: '5 puzzles lógicos + código final',
      icon: '🏰',
      features: ['Complejidad alta', 'Múltiples puzzles', 'Colaboración'],
      bestFor: 'Desafío máximo',
      difficulty: 'expert',
      cycles: ['1° Medio - Universitario']
    }
  ]

  const quizzes = quizzesData?.quizzes || []

  const createGame = async (data: any) => {
    if (!data.quiz_id) {
      toast.error('Selecciona un quiz para convertir en juego')
      return
    }

    try {
      const gameSession = await api.createGameSession({
        quiz_id: data.quiz_id,
        format: data.format,
        settings: {
          max_players: parseInt(data.max_players),
          time_limit: parseInt(data.time_limit),
          show_correct_answers: data.show_correct_answers,
          allow_hints: data.allow_hints,
          shuffle_questions: data.shuffle_questions,
          shuffle_options: data.shuffle_options,
          accessibility_mode: data.accessibility_mode,
          tts_enabled: data.tts_enabled
        }
      })
      
      toast.success('Juego creado exitosamente')
      router.push(`/teacher/game/${gameSession.session_id}/lobby`)
    } catch (error) {
      toast.error('Error al crear el juego')
    }
  }

  const selectedFormat = gameFormats.find(f => f.id === gameFormat)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-orange-100 text-orange-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Crear Sesión de Juego 🎮</h1>
          <p className="mt-2 opacity-90">
            Convierte tus quizzes en experiencias interactivas y divertidas para tus estudiantes.
          </p>
        </div>

        <form onSubmit={handleSubmit(createGame)} className="space-y-6">
          {/* Quiz Selection */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Quiz</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando quizzes...</p>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-8">
                <PuzzlePieceIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay quizzes disponibles</h3>
                <p className="text-gray-600 mb-4">Necesitas crear al menos un quiz antes de poder iniciar un juego.</p>
                <Button
                  type="button"
                  onClick={() => router.push('/teacher/quiz/create')}
                  leftIcon={<SparklesIcon className="h-4 w-4" />}
                >
                  Crear Quiz
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.quiz_id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      watch('quiz_id') === quiz.quiz_id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setValue('quiz_id', quiz.quiz_id)}
                  >
                    <input
                      type="radio"
                      {...register('quiz_id')}
                      value={quiz.quiz_id}
                      className="hidden"
                    />
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        quiz.mode === 'ai' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{quiz.questions?.length || 0} preguntas</span>
                          <span className={`px-2 py-1 rounded-full ${
                            quiz.mode === 'ai' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {quiz.mode === 'ai' ? 'IA' : 'Manual'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Game Format Selection */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Formato de Juego</h2>
              <div className="text-sm text-gray-500">
                {gameFormats.length} formatos disponibles
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {gameFormats.map((format) => (
                <div
                  key={format.id}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                    gameFormat === format.id
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setGameFormat(format.id)
                    setValue('format', format.id)
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{format.icon}</div>
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">{format.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{format.description}</p>
                    
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(format.difficulty)}`}>
                        {format.difficulty}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">
                      <strong>Ciclos:</strong> {format.cycles.join(', ')}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">
                      <strong>Mejor para:</strong> {format.bestFor}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 justify-center">
                      {format.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {format.features.length > 3 && (
                        <span className="text-xs text-gray-400">+{format.features.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <PuzzlePieceIcon className="h-4 w-4" />
                <span>💡 <strong>Tip:</strong> Los formatos están organizados por dificultad y ciclo educativo. Elige el que mejor se adapte a tu curso.</span>
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configuración del Juego</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Jugadores
                </label>
                <select {...register('max_players')} className="input-field">
                  <option value="10">10 estudiantes</option>
                  <option value="20">20 estudiantes</option>
                  <option value="30">30 estudiantes</option>
                  <option value="40">40 estudiantes</option>
                  <option value="50">50 estudiantes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo por Pregunta (segundos)
                </label>
                <select {...register('time_limit')} className="input-field">
                  <option value="15">15 segundos</option>
                  <option value="30">30 segundos</option>
                  <option value="45">45 segundos</option>
                  <option value="60">60 segundos</option>
                  <option value="90">90 segundos</option>
                </select>
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Opciones del Juego
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('show_correct_answers')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mostrar respuestas correctas</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('shuffle_questions')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mezclar preguntas</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('shuffle_options')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mezclar opciones</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-4">Accesibilidad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('accessibility_mode')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Modo de accesibilidad (colores alto contraste, texto grande)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('tts_enabled')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Texto a voz (TTS) para preguntas
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          {selectedFormat && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Vista Previa del Formato</h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedFormat.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedFormat.name}</h3>
                    <p className="text-gray-600">{selectedFormat.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedFormat.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              leftIcon={<EyeIcon className="h-4 w-4" />}
              disabled={!watch('quiz_id')}
            >
              Vista Previa
            </Button>
            <Button
              type="submit"
              leftIcon={<PlayIcon className="h-4 w-4" />}
              disabled={!watch('quiz_id')}
            >
              Crear Juego
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
} 