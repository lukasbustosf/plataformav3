'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  PlayIcon, 
  EyeIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  AcademicCapIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

const GAME_FORMATS = [
  // Basic Games (G-01 to G-09)
  { id: 'trivia_lightning', name: 'Trivia Lightning', icon: '⚡', category: 'basic' },
  { id: 'color_match', name: 'Color Match', icon: '🎨', category: 'basic' },
  { id: 'memory_flip', name: 'Memory Flip', icon: '🧠', category: 'basic' },
  { id: 'picture_bingo', name: 'Picture Bingo', icon: '🎯', category: 'basic' },
  { id: 'drag_drop_sorting', name: 'Drag & Drop Sorting', icon: '📦', category: 'basic' },
  { id: 'number_line_race', name: 'Número-Línea Race', icon: '🏃', category: 'basic' },
  { id: 'word_builder', name: 'Word Builder', icon: '🔤', category: 'basic' },
  { id: 'word_search', name: 'Sopa de Letras', icon: '🔍', category: 'basic' },
  { id: 'hangman_visual', name: 'Hangman Visual', icon: '🎪', category: 'basic' },
  
  // Advanced Games (G-10 to G-16)
  { id: 'escape_room_mini', name: 'Escape Room Mini', icon: '🔓', category: 'advanced' },
  { id: 'story_path', name: 'Story Path', icon: '📖', category: 'advanced' },
  { id: 'board_race', name: 'Board Race', icon: '🏁', category: 'advanced' },
  { id: 'crossword', name: 'Crossword', icon: '📝', category: 'advanced' },
  { id: 'word_search_duel', name: 'Word Search Duel', icon: '⚔️', category: 'advanced' },
  { id: 'timed_equation_duel', name: 'Timed Equation Duel', icon: '⏱️', category: 'advanced' },
  { id: 'mystery_box_reveal', name: 'Mystery Box Reveal', icon: '📦', category: 'advanced' },
  
  // Critical Thinking (G-17 to G-24)
  { id: 'debate_cards', name: 'Debate Cards', icon: '💬', category: 'expert' },
  { id: 'case_study_sprint', name: 'Case Study Sprint', icon: '📊', category: 'expert' },
  { id: 'simulation_tycoon', name: 'Simulation Tycoon', icon: '🏭', category: 'expert' },
  { id: 'coding_puzzle', name: 'Coding Puzzle', icon: '💻', category: 'expert' },
  { id: 'data_lab', name: 'Data Lab', icon: '📈', category: 'expert' },
  { id: 'timeline_builder', name: 'Timeline Builder', icon: '📅', category: 'expert' },
  { id: 'argument_map', name: 'Argument Map', icon: '🗺️', category: 'expert' },
  { id: 'advanced_escape_room', name: 'Advanced Escape Room', icon: '🏰', category: 'expert' }
];

export default function DemoGamesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [demoGames, setDemoGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const fetchDemoGames = async () => {
    try {
      console.log('📡 Fetching demo games from API...')
      const response = await fetch('http://localhost:5000/api/game', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo_token'}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('🎮 Raw API response:', data)
        console.log(`🎮 Total sessions returned: ${data.sessions?.length || 0}`)
        
        if (data.sessions && data.sessions.length > 0) {
          console.log('🎮 All game sessions:')
          data.sessions.forEach((game: any, i: number) => {
            console.log(`  ${i}: "${game.title}" (format: "${game.format}", id: "${game.session_id}", status: "${game.status}")`)
          })
        }
        
        // Look for demo games by title containing 'Demo' or 'demo' or by checking settings
        const demoOnly = data.sessions?.filter((game: any) => 
          game.title?.toLowerCase().includes('demo') ||
          game.settings_json?.demo === true ||
          game.quiz_id?.includes('mock-quiz-') ||
          game.session_id?.includes('demo') ||
          game.session_id?.includes('game-session-')
        ) || []
        
        console.log(`🎮 Demo games after filtering: ${demoOnly.length}`)
        if (demoOnly.length > 0) {
          console.log('🎮 Demo games found:')
          demoOnly.forEach((game: any, i: number) => {
            console.log(`  ${i}: "${game.title}" (format: "${game.format}", id: "${game.session_id}")`)
          })
          
          setDemoGames(demoOnly)
          
        } else {
          console.log('❌ No demo games found after filtering!')
          console.log('Available session IDs:', data.sessions?.map((g: any) => g.session_id).join(', '))
          console.log('Sample session:', data.sessions?.[0])
          setDemoGames([]) // Explicitly set empty array
        }
        
      } else {
        console.error('Failed to fetch games:', response.status, response.statusText)
        setDemoGames([]) // Set empty on error
      }
    } catch (error) {
      console.error('Error fetching demo games:', error)
      setDemoGames([]) // Set empty on error
    } finally {
      setLoading(false)
    }
  }

  // Load demo games on component mount and when forceRefresh changes
  useEffect(() => {
    console.log('🔄 Demo games page mounted or refreshed, fetching games...')
    fetchDemoGames()
  }, []) // Only run on mount, manual refresh via button
  
  // Simple state tracking
  useEffect(() => {
    console.log(`🎮 Demo games loaded: ${demoGames.length} games available`)
  }, [demoGames])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-orange-100 text-orange-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const findDemoGame = (formatId: string) => {
    if (demoGames.length === 0) {
      console.log(`❌ No games available for format "${formatId}" - try refreshing`)
      return null
    }
    
    // More comprehensive search logic
    const found = demoGames.find(game => {
      // Direct format match
      if (game.format === formatId) return true
      
      // Quiz ID contains format (mock-quiz-trivia_lightning)
      if (game.quiz_id?.includes(formatId)) return true
      
      // Title contains format words (case insensitive)
      const formatWords = formatId.replace(/_/g, ' ').toLowerCase()
      if (game.title?.toLowerCase().includes(formatWords)) return true
      
      // Check if title contains the readable format name
      const readableNames = {
        'trivia_lightning': 'trivia lightning',
        'color_match': 'color match',
        'memory_flip': 'memory flip',
        'picture_bingo': 'picture bingo',
        'drag_drop_sorting': 'drag drop sorting',
        'number_line_race': 'número-línea race',
        'word_builder': 'word builder',
        'word_search': 'sopa de letras',
        'hangman_visual': 'hangman visual',
        'escape_room_mini': 'escape room mini',
        'story_path': 'story path',
        'board_race': 'board race',
        'crossword': 'crossword',
        'word_search_duel': 'word search duel',
        'timed_equation_duel': 'timed equation duel',
        'mystery_box_reveal': 'mystery box reveal',
        'debate_cards': 'debate cards',
        'case_study_sprint': 'case study sprint',
        'simulation_tycoon': 'simulation tycoon',
        'coding_puzzle': 'coding puzzle',
        'data_lab': 'data lab',
        'timeline_builder': 'timeline builder',
        'argument_map': 'argument map',
        'advanced_escape_room': 'advanced escape room'
      }
      
      const readableName = readableNames[formatId as keyof typeof readableNames]
      if (readableName && game.title?.toLowerCase().includes(readableName)) return true
      
      return false
    })
    
    if (found) {
      console.log(`✅ Found game for "${formatId}": "${found.title}" (format: "${found.format}", quiz_id: "${found.quiz_id}")`)
    } else {
      console.log(`❌ No match for "${formatId}" in ${demoGames.length} games`)
      console.log('Available games:', demoGames.map(g => `"${g.title}" (format: "${g.format}")`).join(', '))
    }
    
    return found
  }

  const handlePlayDemo = (formatId: string) => {
    const game = findDemoGame(formatId)
    if (game) {
      // For demo games, just go directly to play
      router.push(`/student/games/${game.session_id}/play`)
    }
  }

  const handlePreviewDemo = (formatId: string) => {
    const game = findDemoGame(formatId)
    if (game) {
      router.push(`/teacher/game/${game.session_id}/preview`)
    }
  }

  const handleStartDemo = async (formatId: string) => {
    const game = findDemoGame(formatId)
    if (!game) {
      console.error(`❌ No game found for format ${formatId}`)
      alert(`❌ No se encontró juego para el formato ${formatId}`)
      return
    }

    try {
      console.log(`🚀 Starting game ${game.session_id} for format ${formatId}...`)
      console.log('Game object:', game)
      
      const response = await fetch(`http://localhost:5000/api/game/${game.session_id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo_token'}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Empty body but required for POST
      })

      console.log(`📡 Start game response status: ${response.status}`)
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Game started successfully:', result)
        
        const joinCode = game.join_code || game.settings_json?.session_code || 'N/A'
        alert(`✅ ¡Juego iniciado!\n\nCódigo de unión: ${joinCode}\n\nLos estudiantes ya pueden unirse.`)
        
        // Refresh the list to show updated status
        await fetchDemoGames()
      } else {
        const errorText = await response.text()
        console.error('❌ Failed to start game:', response.status, errorText)
        alert(`❌ Error al iniciar juego: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('❌ Error starting game:', error)
      alert('❌ Error de conexión al iniciar juego')
    }
  }

  const createAllDemoGames = async () => {
    setLoading(true)
    try {
      console.log('📦 Creating all demo games...')
      const response = await fetch('http://localhost:5000/api/demo/create-games', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo_token'}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Demo games created:', result)
        
        // Wait for server to process, then refresh once
        setTimeout(async () => {
          console.log('🔄 Fetching games after creation...')
          await fetchDemoGames()
        }, 2000)
        
        alert('✅ All 24 demo games created successfully!')
      } else {
        const errorText = await response.text()
        console.error('❌ Failed to create demo games:', response.status, errorText)
        alert(`❌ Error creating demo games: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Error creating demo games:', error)
      alert('❌ Error creating demo games. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  // Category definitions with metadata
  const categories = [
    {
      id: 'basic',
      name: 'Juegos Básicos',
      description: 'Formatos simples para PreK-6° Básico. Enfoque en reconocimiento y comprensión.',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
      formats: GAME_FORMATS.filter(f => f.category === 'basic').map(format => ({
        ...format,
        difficulty: format.id.includes('trivia') || format.id.includes('color') ? 'easy' : 'medium',
        description: getFormatDescription(format.id)
      }))
    },
    {
      id: 'advanced',
      name: 'Juegos Avanzados',
      description: 'Formatos complejos para 3°-8° Básico. Pensamiento aplicado y análisis.',
      icon: '🚀',
      color: 'from-purple-500 to-purple-600',
      formats: GAME_FORMATS.filter(f => f.category === 'advanced').map(format => ({
        ...format,
        difficulty: 'medium',
        description: getFormatDescription(format.id)
      }))
    },
    {
      id: 'expert',
      name: 'Pensamiento Crítico',
      description: 'Formatos expertos para 7° Básico-Universidad. Evaluar, crear y sintetizar.',
      icon: '🧠',
      color: 'from-red-500 to-red-600',
      formats: GAME_FORMATS.filter(f => f.category === 'expert').map(format => ({
        ...format,
        difficulty: format.id.includes('advanced') ? 'expert' : 'hard',
        description: getFormatDescription(format.id)
      }))
    }
  ]

  const filteredCategories = selectedCategory 
    ? categories.filter(c => c.id === selectedCategory)
    : categories

  function getFormatDescription(formatId: string): string {
    const descriptions: Record<string, string> = {
      'trivia_lightning': 'Preguntas rápidas con puntuación por velocidad',
      'color_match': 'Seleccionar colores y formas correctas',
      'memory_flip': 'Encontrar pares de cartas relacionadas',
      'picture_bingo': 'Cartón con imágenes, llamadas por audio',
      'drag_drop_sorting': 'Clasificar elementos arrastrando',
      'number_line_race': 'Resolver operaciones para avanzar',
      'word_builder': 'Formar palabras con letras',
      'word_search': 'Encontrar palabras ocultas',
      'hangman_visual': 'Adivinar palabras con pistas visuales',
      'escape_room_mini': '3 acertijos secuenciales para escapar',
      'story_path': 'Historia interactiva con elecciones',
      'board_race': 'Tablero + dados + preguntas para avanzar',
      'crossword': 'Crucigrama con pistas de audio',
      'word_search_duel': 'Duelo de equipos encontrando palabras',
      'timed_equation_duel': 'Resolver ecuaciones contra el tiempo',
      'mystery_box_reveal': 'Responder para revelar imagen misteriosa',
      'debate_cards': 'Cartas de argumento y posiciones de debate',
      'case_study_sprint': 'Casos reales con preguntas cronometradas',
      'simulation_tycoon': 'Tomar decisiones y ver impacto en KPIs',
      'coding_puzzle': 'Completar bloques de código',
      'data_lab': 'Crear gráficos y responder sobre datos',
      'timeline_builder': 'Ordenar eventos históricos en línea temporal',
      'argument_map': 'Conectar argumentos causa-efecto',
      'advanced_escape_room': '5 puzzles lógicos complejos'
    }
    return descriptions[formatId] || 'Formato de juego único'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎮 Demo Games - 24 Formatos</h1>
            <p className="text-gray-600 mt-1">
              Prueba todos los formatos de juego diferentes. Cada uno tiene mecánicas únicas optimizadas para diferentes tipos de aprendizaje.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={createAllDemoGames}
              disabled={loading}
              leftIcon={<SparklesIcon className="h-4 w-4" />}
              variant="outline"
            >
              {loading ? 'Creando...' : 'Crear Todos los Demos'}
            </Button>
            <Button
              onClick={() => {
                console.log('🔄 Manual refresh triggered')
                fetchDemoGames()
              }}
              disabled={loading}
              variant="outline"
              title="Refrescar lista de juegos"
            >
              🔄 Refrescar
            </Button>
            <Button
              onClick={() => router.push('/teacher/games')}
              leftIcon={<AcademicCapIcon className="h-4 w-4" />}
            >
              Volver a Juegos
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PuzzlePieceIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Formatos</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-gray-500">Todos implementados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BeakerIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Demos Creados</p>
                <p className="text-2xl font-bold text-gray-900">{demoGames.length}</p>
                <p className="text-xs text-gray-500">Listos para probar</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SparklesIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Básicos</p>
                <p className="text-2xl font-bold text-gray-900">9</p>
                <p className="text-xs text-gray-500">G-01 a G-09</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avanzados</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-xs text-gray-500">G-10 a G-24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todas las Categorías
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>

        {/* Game Categories */}
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white shadow rounded-lg overflow-hidden">
            {/* Category Header */}
            <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{category.icon}</div>
                <div>
                  <h2 className="text-xl font-bold">{category.name}</h2>
                  <p className="opacity-90">{category.description}</p>
                </div>
              </div>
            </div>

            {/* Games Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.formats.map((format) => {
                  const demoGame = findDemoGame(format.id)
                  const isAvailable = !!demoGame

                  return (
                    <div
                      key={format.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isAvailable 
                          ? 'border-gray-200 hover:shadow-md bg-white' 
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{format.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-medium ${isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                              {format.name}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(format.difficulty)}`}>
                              {format.difficulty}
                            </span>
                          </div>
                          <p className={`text-sm mb-3 ${isAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
                            {format.description}
                          </p>
                          
                          {isAvailable ? (
                            <div className="space-y-2">
                              {/* Game Status */}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Estado:</span>
                                <span className={`px-2 py-1 rounded-full font-medium ${
                                  demoGame?.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : demoGame?.status === 'waiting'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {demoGame?.status === 'active' ? 'Activo' : 
                                   demoGame?.status === 'waiting' ? 'Esperando' : 
                                   demoGame?.status || 'Desconocido'}
                                </span>
                              </div>
                              
                              {/* Join Code */}
                              {demoGame?.join_code && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">Código:</span>
                                  <span className="font-mono font-bold text-blue-600">{demoGame.join_code}</span>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex space-x-1">
                                {demoGame?.status === 'waiting' && (
                                  <Button
                                    size="sm"
                                    leftIcon={<PlayIcon className="h-3 w-3" />}
                                    onClick={() => handleStartDemo(format.id)}
                                    className="flex-1"
                                  >
                                    Iniciar
                                  </Button>
                                )}
                                {demoGame?.status === 'active' && (
                                  <Button
                                    size="sm"
                                    leftIcon={<PlayIcon className="h-3 w-3" />}
                                    onClick={() => handlePlayDemo(format.id)}
                                    className="flex-1"
                                  >
                                    Unirse
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  leftIcon={<EyeIcon className="h-3 w-3" />}
                                  onClick={() => handlePreviewDemo(format.id)}
                                >
                                  Ver
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <span className="text-xs text-gray-400">Demo no disponible</span>
                              <p className="text-xs text-gray-400 mt-1">Crear demos primero</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Debug Info - Only show if we have games */}
        {demoGames.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-900 mb-2">🔧 Debug: Juegos Encontrados</h3>
            <div className="space-y-1 text-xs text-green-800">
              {demoGames.slice(0, 5).map((game) => (
                <div key={game.session_id} className="font-mono">
                  • {game.title || 'Sin título'} (Format: {game.format || 'N/A'}, ID: {game.session_id})
                </div>
              ))}
              {demoGames.length > 5 && (
                <div className="text-green-600">... y {demoGames.length - 5} más</div>
              )}
            </div>
          </div>
        )}

        {/* Quick Join */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-purple-900 mb-2">🎮 Prueba Rápida</h3>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Ingresa código (ej: DM01)"
              className="px-3 py-2 border border-purple-300 rounded-md text-sm"
              id="quickJoinCode"
            />
            <Button
              size="sm"
              onClick={() => {
                const code = (document.getElementById('quickJoinCode') as HTMLInputElement)?.value;
                if (code) {
                  router.push(`/student/games/join?code=${code.toUpperCase()}`);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Unirse como Estudiante
            </Button>
          </div>
          <p className="text-xs text-purple-600 mt-2">Usa los códigos que aparecen en las tarjetas de arriba</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">📋 Instrucciones de Prueba</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>1. Crear Demos:</strong> Haz clic en "Crear Todos los Demos" para generar los 24 juegos de prueba.</p>
            <p><strong>2. Iniciar Juego:</strong> Haz clic en "Iniciar" en cualquier formato para activarlo.</p>
            <p><strong>3. Unirse como Estudiante:</strong> Usa el código que aparece para unirte desde otra pestaña.</p>
            <p><strong>4. Probar Diferentes Formatos:</strong> Cada formato tiene mecánicas únicas - ¡no son todos quiz tradicionales!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 