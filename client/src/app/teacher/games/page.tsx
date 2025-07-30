'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'

import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  PlayIcon,
  StopIcon,
  UsersIcon,
  ClockIcon,
  EyeIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  PauseIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  PuzzlePieceIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { formatDate, getGameFormatDisplayName } from '@/lib/utils'
import type { GameSession } from '@/types'

interface GameSessionData {
  session_id: string
  quiz_id: string
  quiz_title: string
  format: string
  status: 'waiting' | 'active' | 'finished' | 'paused' | 'cancelled'
  host_id: string
  host_name: string
  participant_count: number
  max_players: number
  created_at: string
  started_at?: string
  finished_at?: string
  settings: {
    time_limit: number
    max_players: number
    show_correct_answers: boolean
    accessibility_mode: boolean
    tts_enabled: boolean
    difficulty_adaptive: boolean
    allow_late_join: boolean
  }
  results?: {
    avg_score: number
    completion_rate: number
    total_participants: number
    top_score: number
    engagement_metrics: {
      avg_response_time: number
      questions_answered: number
      total_questions: number
    }
  }
  subject: string
  grade_level: string
  oa_codes: string[]
  bloom_levels: string[]
  duration_minutes?: number
  current_question?: number
  total_questions: number
}

const GAME_FORMATS = [
  // Basic Games (G-01 to G-09)
  { id: 'trivia_lightning', name: 'Trivia Lightning', icon: '⚡', description: 'Preguntas rápidas MCQ', difficulty: 'easy', cycles: ['PreK', '1°-4° Básico'] },
  { id: 'color_match', name: 'Color Match', icon: '🎨', description: 'Seleccionar color/figura', difficulty: 'easy', cycles: ['PreK', '1° Básico'] },
  { id: 'memory_flip', name: 'Memory Flip', icon: '🔄', description: 'Parear cartas pregunta-respuesta', difficulty: 'medium', cycles: ['1°-3° Básico'] },
  { id: 'picture_bingo', name: 'Picture Bingo', icon: '🎯', description: 'Cartón 3x3 con imágenes', difficulty: 'medium', cycles: ['1°-4° Básico'] },
  { id: 'drag_drop_sorting', name: 'Drag & Drop Sorting', icon: '📦', description: 'Arrastrar al contenedor correcto', difficulty: 'medium', cycles: ['2°-5° Básico'] },
  { id: 'number_line_race', name: 'Número-Línea Race', icon: '🏃', description: 'Resolver y avanzar en línea', difficulty: 'medium', cycles: ['2°-5° Básico'] },
  { id: 'word_builder', name: 'Word Builder', icon: '🔤', description: 'Arrastrar letras formar palabra', difficulty: 'medium', cycles: ['1°-3° Básico'] },
  { id: 'word_search', name: 'Sopa de Letras', icon: '🔍', description: 'Encontrar palabras escondidas', difficulty: 'medium', cycles: ['3°-6° Básico'] },
  { id: 'hangman_visual', name: 'Hangman Visual', icon: '🎪', description: 'Adivinar palabra con pistas', difficulty: 'medium', cycles: ['2°-6° Básico'] },
  // Advanced Games (G-10 to G-16)
  { id: 'escape_room_mini', name: 'Escape Room Mini', icon: '🔓', description: '3 acertijos secuenciales', difficulty: 'hard', cycles: ['3°-6° Básico'] },
  { id: 'story_path', name: 'Story Path', icon: '📖', description: 'Narrativa ramificada con decisiones', difficulty: 'hard', cycles: ['3°-8° Básico'] },
  { id: 'board_race', name: 'Board Race', icon: '🏁', description: 'Carrera en tablero con preguntas', difficulty: 'medium', cycles: ['2°-6° Básico'] },
  { id: 'crossword', name: 'Crossword', icon: '📝', description: 'Rellenar crucigrama con pistas', difficulty: 'hard', cycles: ['4°-8° Básico'] },
  { id: 'word_search_duel', name: 'Word Search Duel', icon: '⚔️', description: 'Competencia de búsqueda de palabras', difficulty: 'hard', cycles: ['4°-8° Básico'] },
  { id: 'timed_equation_duel', name: 'Timed Equation Duel', icon: '⏱️', description: 'Duelo matemático cronometrado', difficulty: 'hard', cycles: ['3°-6° Básico'] },
  { id: 'mystery_box_reveal', name: 'Mystery Box Reveal', icon: '📦', description: 'Revelar imagen progresivamente', difficulty: 'medium', cycles: ['PreK-4° Básico'] },
  // Advanced Critical Thinking (G-17 to G-24)
  { id: 'debate_cards', name: 'Debate Cards', icon: '💬', description: 'Seleccionar postura y argumentar', difficulty: 'expert', cycles: ['7° Básico - 4° Medio'] },
  { id: 'case_study_sprint', name: 'Case Study Sprint', icon: '📊', description: 'Caso real con preguntas cronometradas', difficulty: 'expert', cycles: ['7° Básico - Univ.'] },
  { id: 'simulation_tycoon', name: 'Simulation Tycoon', icon: '🏭', description: 'Decisiones e impacto en KPI', difficulty: 'expert', cycles: ['8° Básico - Univ.'] },
  { id: 'coding_puzzle', name: 'Coding Puzzle', icon: '💻', description: 'Programación con bloques visuales', difficulty: 'expert', cycles: ['1° Medio - Univ.'] },
  { id: 'data_lab', name: 'Data Lab', icon: '📈', description: 'Análisis de datos con gráficos', difficulty: 'expert', cycles: ['1° Medio - Univ.'] },
  { id: 'timeline_builder', name: 'Timeline Builder', icon: '📅', description: 'Construcción de líneas temporales', difficulty: 'hard', cycles: ['6° Básico - 2° Medio'] },
  { id: 'argument_map', name: 'Argument Map', icon: '🗺️', description: 'Mapeo visual de argumentos', difficulty: 'expert', cycles: ['2° Medio - Univ.'] },
  { id: 'advanced_escape_room', name: 'Advanced Escape Room', icon: '🏰', description: 'Escape room complejo multi-sala', difficulty: 'expert', cycles: ['1° Medio - Univ.'] }
]

export default function TeacherGamesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formatFilter, setFormatFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock comprehensive game session data for demonstration
  const mockGameSessions: GameSessionData[] = [
    {
      session_id: '1',
      quiz_id: 'quiz-1',
      quiz_title: 'Fracciones Equivalentes',
      format: 'trivia_lightning',
      status: 'active',
      host_id: 'teacher-1',
      host_name: 'Prof. María González',
      participant_count: 24,
      max_players: 30,
      created_at: '2025-06-23T10:30:00Z',
      started_at: '2025-06-23T10:35:00Z',
      current_question: 8,
      total_questions: 15,
      settings: {
        time_limit: 30,
        max_players: 30,
        show_correct_answers: true,
        accessibility_mode: true,
        tts_enabled: true,
        difficulty_adaptive: false,
        allow_late_join: true
      },
      subject: 'Matemáticas',
      grade_level: '5º Básico',
      oa_codes: ['MAT-05-OA-04', 'MAT-05-OA-05'],
      bloom_levels: ['Recordar', 'Comprender', 'Aplicar']
    },
    {
      session_id: '2',
      quiz_id: 'quiz-2',
      quiz_title: 'Comprensión Lectora - Cuentos',
      format: 'debate_cards',
      status: 'finished',
      host_id: 'teacher-2',
      host_name: 'Prof. Carlos Mendoza',
      participant_count: 18,
      max_players: 20,
      created_at: '2025-06-22T14:15:00Z',
      started_at: '2025-06-22T14:20:00Z',
      finished_at: '2025-06-22T15:05:00Z',
      duration_minutes: 45,
      total_questions: 12,
      settings: {
        time_limit: 60,
        max_players: 20,
        show_correct_answers: true,
        accessibility_mode: true,
        tts_enabled: true,
        difficulty_adaptive: true,
        allow_late_join: false
      },
      results: {
        avg_score: 7.2,
        completion_rate: 94.4,
        total_participants: 18,
        top_score: 9.1,
        engagement_metrics: {
          avg_response_time: 45.2,
          questions_answered: 204,
          total_questions: 216
        }
      },
      subject: 'Lenguaje',
      grade_level: '8º Básico',
      oa_codes: ['LEN-08-OA-03', 'LEN-08-OA-04'],
      bloom_levels: ['Comprender', 'Analizar', 'Evaluar']
    },
    {
      session_id: '3',
      quiz_id: 'quiz-3',
      quiz_title: 'Ecosistemas Chilenos',
      format: 'escape_room',
      status: 'waiting',
      host_id: 'teacher-3',
      host_name: 'Prof. Ana Ramírez',
      participant_count: 3,
      max_players: 25,
      created_at: '2025-06-23T15:00:00Z',
      total_questions: 5,
      settings: {
        time_limit: 45,
        max_players: 25,
        show_correct_answers: false,
        accessibility_mode: true,
        tts_enabled: true,
        difficulty_adaptive: false,
        allow_late_join: true
      },
      subject: 'Ciencias Naturales',
      grade_level: '7º Básico',
      oa_codes: ['CN-07-OA-05', 'CN-07-OA-06'],
      bloom_levels: ['Aplicar', 'Analizar']
    },
    {
      session_id: '4',
      quiz_id: 'quiz-4',
      quiz_title: 'Geometría - Áreas y Perímetros',
      format: 'drag_drop_sorting',
      status: 'paused',
      host_id: 'teacher-4',
      host_name: 'Prof. Sandra Torres',
      participant_count: 15,
      max_players: 20,
      created_at: '2025-06-23T09:45:00Z',
      started_at: '2025-06-23T09:50:00Z',
      current_question: 5,
      total_questions: 10,
      settings: {
        time_limit: 25,
        max_players: 20,
        show_correct_answers: true,
        accessibility_mode: true,
        tts_enabled: false,
        difficulty_adaptive: true,
        allow_late_join: true
      },
      subject: 'Matemáticas',
      grade_level: '6º Básico',
      oa_codes: ['MAT-06-OA-09', 'MAT-06-OA-10'],
      bloom_levels: ['Recordar', 'Aplicar']
    },
    {
      session_id: '5',
      quiz_id: 'quiz-5',
      quiz_title: 'Revolución Industrial',
      format: 'case_study_sprint',
      status: 'finished',
      host_id: 'teacher-5',
      host_name: 'Prof. Diego Silva',
      participant_count: 22,
      max_players: 25,
      created_at: '2025-06-21T11:30:00Z',
      started_at: '2025-06-21T11:35:00Z',
      finished_at: '2025-06-21T12:20:00Z',
      duration_minutes: 45,
      total_questions: 8,
      settings: {
        time_limit: 90,
        max_players: 25,
        show_correct_answers: true,
        accessibility_mode: false,
        tts_enabled: false,
        difficulty_adaptive: true,
        allow_late_join: false
      },
      results: {
        avg_score: 6.8,
        completion_rate: 90.9,
        total_participants: 22,
        top_score: 8.7,
        engagement_metrics: {
          avg_response_time: 72.5,
          questions_answered: 160,
          total_questions: 176
        }
      },
      subject: 'Historia',
      grade_level: '1º Medio',
      oa_codes: ['HIS-MED-OA02'],
      bloom_levels: ['Comprender', 'Analizar', 'Evaluar']
    }
  ]

  // Use mock data for demonstration - replace with actual API when backend is ready
  const gamesData = mockGameSessions
  const gamesLoading = false
  const refetch = () => {}

  const games = mockGameSessions // Use mock data for demonstration

  const subjects = ['Matemáticas', 'Lenguaje', 'Ciencias Naturales', 'Historia', 'Inglés', 'Artes']

  const handleJoinGame = (gameId: string) => {
    router.push(`/teacher/game/${gameId}/lobby`)
  }

  const handleControlGame = (gameId: string) => {
    router.push(`/teacher/game/${gameId}/control`)
  }

  const handleViewResults = (gameId: string) => {
    router.push(`/teacher/game/${gameId}/results`)
  }

  const handleGameSettings = (gameId: string) => {
    router.push(`/teacher/game/${gameId}/settings`)
  }

  const handlePauseGame = async (gameId: string) => {
    try {
      // Mock API call - replace with actual API when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Juego pausado')
      // refetch() - would refresh data from API
    } catch (error) {
      toast.error('Error al pausar juego')
    }
  }

  const handleResumeGame = async (gameId: string) => {
    try {
      // Mock API call - replace with actual API when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Juego reanudado')
      // refetch() - would refresh data from API
    } catch (error) {
      toast.error('Error al reanudar juego')
    }
  }

  const handleStopGame = async (gameId: string) => {
    if (!confirm('¿Estás seguro de que quieres finalizar este juego?')) return
    
    try {
      // Mock API call - replace with actual API when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Juego finalizado')
      // refetch() - would refresh data from API
    } catch (error) {
      toast.error('Error al finalizar juego')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-yellow-600 bg-yellow-100'
      case 'active': return 'text-green-600 bg-green-100'
      case 'finished': return 'text-gray-600 bg-gray-100'
      case 'paused': return 'text-orange-600 bg-orange-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting': return 'Esperando'
      case 'active': return 'Activo'
      case 'finished': return 'Completado'
      case 'paused': return 'Pausado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getFormatIcon = (format: string) => {
    const gameFormat = GAME_FORMATS.find(f => f.id === format)
    return gameFormat?.icon || '🎮'
  }

  const getFormatName = (format: string) => {
    const gameFormat = GAME_FORMATS.find(f => f.id === format)
    return gameFormat?.name || format
  }

  const getDifficultyColor = (format: string) => {
    const gameFormat = GAME_FORMATS.find(f => f.id === format)
    switch (gameFormat?.difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      case 'expert': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getGameStats = () => {
    const total = games.length
    const active = games.filter(g => g.status === 'active').length
    const waiting = games.filter(g => g.status === 'waiting').length
    const completed = games.filter(g => g.status === 'finished').length
    const paused = games.filter(g => g.status === 'paused').length
    const totalParticipants = games.reduce((sum, g) => sum + g.participant_count, 0)
    const avgScore = games.filter(g => g.results).reduce((sum, g) => sum + (g.results?.avg_score || 0), 0) / games.filter(g => g.results).length || 0

    return { total, active, waiting, completed, paused, totalParticipants, avgScore }
  }

  const stats = getGameStats()

  const filteredGames = games.filter(game => {
    const matchesSearch = game.quiz_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.oa_codes.some(oa => oa.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         getFormatName(game.format).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || game.status === statusFilter
    const matchesFormat = formatFilter === 'all' || game.format === formatFilter
    const matchesSubject = subjectFilter === 'all' || game.subject === subjectFilter

    return matchesSearch && matchesStatus && matchesFormat && matchesSubject
  })

  const getActionButtons = (game: GameSessionData) => {
    switch (game.status) {
      case 'waiting':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<PlayIcon className="h-3 w-3" />}
                              onClick={() => handleJoinGame(game.session_id)}
            >
              Iniciar
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Cog6ToothIcon className="h-3 w-3" />}
                              onClick={() => handleGameSettings(game.session_id)}
            >
              Configurar
            </Button>
          </div>
        )
      case 'active':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<EyeIcon className="h-3 w-3" />}
                              onClick={() => handleControlGame(game.session_id)}
            >
              Controlar
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<PauseIcon className="h-3 w-3" />}
                              onClick={() => handlePauseGame(game.session_id)}
            >
              Pausar
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<StopIcon className="h-3 w-3" />}
              onClick={() => handleStopGame(game.session_id)}
            >
              Finalizar
            </Button>
          </div>
        )
      case 'paused':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<PlayIcon className="h-3 w-3" />}
              onClick={() => handleResumeGame(game.session_id)}
            >
              Reanudar
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<StopIcon className="h-3 w-3" />}
              onClick={() => handleStopGame(game.session_id)}
            >
              Finalizar
            </Button>
          </div>
        )
      case 'finished':
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<ChartBarIcon className="h-3 w-3" />}
              onClick={() => handleViewResults(game.session_id)}
            >
              Ver Resultados
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<DocumentArrowDownIcon className="h-3 w-3" />}
            >
              Exportar
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Juegos</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona todas tus sesiones de juego interactivas y monitorea el engagement en tiempo real
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="secondary"
              leftIcon={<SparklesIcon className="h-4 w-4" />}
              onClick={() => router.push('/teacher/game/create?mode=ai')}
            >
              Crear con IA
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={() => router.push('/teacher/game/create')}
            >
              Nuevo Juego
            </Button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlayIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Juegos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">{stats.completed} completados</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Activos Ahora</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-xs text-gray-500">{stats.waiting} esperando • {stats.paused} pausados</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
                <p className="text-xs text-gray-500">Total en sesiones activas</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrophyIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgScore > 0 ? stats.avgScore.toFixed(1) : '--'}</p>
                <p className="text-xs text-gray-500">Nota promedio completados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Formats Preview */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Formatos de Juego Disponibles</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/teacher/game/formats')}
            >
              Ver Todos
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {GAME_FORMATS.slice(0, 12).map((format) => (
              <div key={format.id} className="text-center p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => router.push(`/teacher/game/create?format=${format.id}`)}>
                <div className="text-2xl mb-2">{format.icon}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">{format.name}</div>
                <div className="text-xs text-gray-500">{format.description}</div>
                <div className={`text-xs font-medium px-2 py-1 rounded mt-2 inline-block ${getDifficultyColor(format.id)}`}>
                  {format.difficulty}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filtros y Búsqueda</h3>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Lista
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar juegos, formatos, OA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todos los estados</option>
              <option value="waiting">Esperando</option>
              <option value="active">Activos</option>
              <option value="paused">Pausados</option>
              <option value="finished">Completados</option>
              <option value="cancelled">Cancelados</option>
            </select>

            {/* Format Filter */}
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todos los formatos</option>
              {GAME_FORMATS.map(format => (
                <option key={format.id} value={format.id}>{format.name}</option>
              ))}
            </select>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todas las asignaturas</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="input"
            >
              <option value="created_at-desc">Más reciente</option>
              <option value="started_at-desc">Últimos iniciados</option>
              <option value="participant_count-desc">Más participantes</option>
              <option value="quiz_title-asc">Título A-Z</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Mostrando {filteredGames.length} de {games.length} sesiones de juego
          </div>
        </div>

        {/* Games List/Grid */}
        <div className="card p-6">
          {gamesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredGames.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <div key={game.session_id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    {/* Game Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{getFormatIcon(game.format)}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(game.status)}`}>
                            {getStatusLabel(game.status)}
                          </span>
                          {game.status === 'active' && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100 animate-pulse">
                              En Vivo
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{game.quiz_title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{getFormatName(game.format)}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>{game.subject} • {game.grade_level}</div>
                          <div>Por: {game.host_name}</div>
                          <div>{new Date(game.created_at).toLocaleDateString('es-CL')} {new Date(game.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar for Active Games */}
                    {game.status === 'active' && game.current_question && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Pregunta {game.current_question} de {game.total_questions}</span>
                          <span>{Math.round((game.current_question / game.total_questions) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(game.current_question / game.total_questions) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* OA Codes */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {game.oa_codes.map((oa) => (
                        <span key={oa} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {oa}
                        </span>
                      ))}
                    </div>

                    {/* Participants and Settings */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{game.participant_count}/{game.max_players}</div>
                        <div className="text-xs text-gray-500">Participantes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{game.settings.time_limit}s</div>
                        <div className="text-xs text-gray-500">Tiempo/Pregunta</div>
                      </div>
                    </div>

                    {/* Accessibility Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {game.settings.accessibility_mode && (
                        <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          ♿ Accesible
                        </span>
                      )}
                      {game.settings.tts_enabled && (
                        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          🔊 TTS
                        </span>
                      )}
                      {game.settings.difficulty_adaptive && (
                        <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          🧠 Adaptivo
                        </span>
                      )}
                    </div>

                    {/* Results for Finished Games */}
                    {game.results && (
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Promedio:</span>
                            <span className="font-semibold text-gray-900 ml-1">{game.results.avg_score.toFixed(1)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Completado:</span>
                            <span className="font-semibold text-gray-900 ml-1">{game.results.completion_rate.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Top Score:</span>
                            <span className="font-semibold text-gray-900 ml-1">{game.results.top_score.toFixed(1)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Tiempo resp.:</span>
                            <span className="font-semibold text-gray-900 ml-1">{game.results.engagement_metrics.avg_response_time.toFixed(1)}s</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {getActionButtons(game)}
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {filteredGames.map((game) => (
                  <div key={game.session_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{getFormatIcon(game.format)}</span>
                          <h3 className="font-semibold text-gray-900">{game.quiz_title}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(game.status)}`}>
                            {getStatusLabel(game.status)}
                          </span>
                          {game.status === 'active' && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100 animate-pulse">
                              En Vivo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{getFormatName(game.format)}</span>
                          <span>{game.subject} • {game.grade_level}</span>
                          <span>{game.participant_count}/{game.max_players} participantes</span>
                          {game.status === 'active' && game.current_question && (
                            <span>Pregunta {game.current_question}/{game.total_questions}</span>
                          )}
                          {game.results && (
                            <span>Promedio: {game.results.avg_score.toFixed(1)}</span>
                          )}
                          <span>{new Date(game.created_at).toLocaleDateString('es-CL')} {new Date(game.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {getActionButtons(game)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <PuzzlePieceIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay juegos que coincidan</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || formatFilter !== 'all' ? 
                  'Intenta ajustar los filtros de búsqueda.' : 
                  'Comienza creando tu primera sesión de juego.'
                }
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => router.push('/teacher/game/create?mode=ai')}
                  leftIcon={<SparklesIcon className="h-4 w-4" />}
                >
                  Crear con IA
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/teacher/game/create')}
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                >
                  Nuevo Juego
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 