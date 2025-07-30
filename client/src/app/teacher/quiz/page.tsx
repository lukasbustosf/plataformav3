'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'

import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  SparklesIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  CogIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { QuizCard } from '@/components/quiz/QuizCard'
import { formatDate } from '@/lib/utils'
import type { Quiz } from '@/types'

interface QuizData {
  quiz_id: string
  title: string
  description: string
  mode: 'manual' | 'ai'
  subject: string
  grade_level: string
  difficulty: 'easy' | 'medium' | 'hard'
  question_count: number
  estimated_time: number
  bloom_levels: string[]
  oa_codes: string[]
  created_at: string
  updated_at: string
  author_name: string
  usage_count: number
  avg_score: number
  status: 'draft' | 'published' | 'archived'
  accessibility_features: string[]
  has_tts: boolean
  can_convert_to_game: boolean
}

export default function TeacherQuizListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedMode, setSelectedMode] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedBloom, setSelectedBloom] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(false)

  // Mock comprehensive quiz data for demonstration
  const mockQuizzes: QuizData[] = [
    {
      quiz_id: '1',
      title: 'Fracciones Equivalentes - 5º Básico',
      description: 'Quiz interactivo sobre fracciones equivalentes con ejercicios prácticos y visualizaciones',
      mode: 'ai',
      subject: 'Matemáticas',
      grade_level: '5º Básico',
      difficulty: 'medium',
      question_count: 15,
      estimated_time: 20,
      bloom_levels: ['Recordar', 'Comprender', 'Aplicar'],
      oa_codes: ['MAT-05-OA-04', 'MAT-05-OA-05'],
      created_at: '2025-06-23T10:30:00Z',
      updated_at: '2025-06-23T14:20:00Z',
      author_name: 'Prof. María González',
      usage_count: 3,
      avg_score: 7.2,
      status: 'published',
      accessibility_features: ['TTS', 'High Contrast', 'Keyboard Navigation'],
      has_tts: true,
      can_convert_to_game: true
    },
    {
      quiz_id: '2',
      title: 'Comprensión Lectora - Cuentos Fantásticos',
      description: 'Evaluación de comprensión lectora basada en cuentos fantásticos chilenos',
      mode: 'manual',
      subject: 'Lenguaje',
      grade_level: '6º Básico',
      difficulty: 'medium',
      question_count: 12,
      estimated_time: 25,
      bloom_levels: ['Comprender', 'Analizar', 'Evaluar'],
      oa_codes: ['LEN-06-OA-03', 'LEN-06-OA-04'],
      created_at: '2025-06-22T09:15:00Z',
      updated_at: '2025-06-22T16:45:00Z',
      author_name: 'Prof. Carlos Mendoza',
      usage_count: 5,
      avg_score: 6.8,
      status: 'published',
      accessibility_features: ['TTS', 'Extended Time'],
      has_tts: true,
      can_convert_to_game: true
    },
    {
      quiz_id: '3',
      title: 'Ecosistemas y Biodiversidad',
      description: 'Quiz sobre ecosistemas chilenos y conservación de la biodiversidad',
      mode: 'ai',
      subject: 'Ciencias Naturales',
      grade_level: '7º Básico',
      difficulty: 'hard',
      question_count: 20,
      estimated_time: 30,
      bloom_levels: ['Comprender', 'Aplicar', 'Analizar', 'Evaluar'],
      oa_codes: ['CN-07-OA-05', 'CN-07-OA-06'],
      created_at: '2025-06-21T11:20:00Z',
      updated_at: '2025-06-23T08:30:00Z',
      author_name: 'Prof. Ana Ramírez',
      usage_count: 2,
      avg_score: 6.3,
      status: 'published',
      accessibility_features: ['TTS', 'Visual Aids', 'Simplified Language'],
      has_tts: true,
      can_convert_to_game: true
    },
    {
      quiz_id: '4',
      title: 'Independencia de Chile - Borrador',
      description: 'Quiz en desarrollo sobre los procesos de independencia nacional',
      mode: 'manual',
      subject: 'Historia',
      grade_level: '8º Básico',
      difficulty: 'medium',
      question_count: 8,
      estimated_time: 15,
      bloom_levels: ['Recordar', 'Comprender'],
      oa_codes: ['HIS-08-OA-02'],
      created_at: '2025-06-23T15:45:00Z',
      updated_at: '2025-06-23T16:30:00Z',
      author_name: 'Prof. Diego Silva',
      usage_count: 0,
      avg_score: 0,
      status: 'draft',
      accessibility_features: ['Keyboard Navigation'],
      has_tts: false,
      can_convert_to_game: false
    },
    {
      quiz_id: '5',
      title: 'Geometría - Áreas y Perímetros',
      description: 'Aplicación práctica de cálculo de áreas y perímetros en figuras geométricas',
      mode: 'ai',
      subject: 'Matemáticas',
      grade_level: '6º Básico',
      difficulty: 'easy',
      question_count: 10,
      estimated_time: 18,
      bloom_levels: ['Recordar', 'Aplicar'],
      oa_codes: ['MAT-06-OA-09', 'MAT-06-OA-10'],
      created_at: '2025-06-20T14:10:00Z',
      updated_at: '2025-06-22T10:15:00Z',
      author_name: 'Prof. Sandra Torres',
      usage_count: 7,
      avg_score: 7.5,
      status: 'published',
      accessibility_features: ['TTS', 'High Contrast', 'Visual Aids'],
      has_tts: true,
      can_convert_to_game: true
    }
  ]

  // Use mock data for demonstration - replace with actual API when backend is ready
  const quizzesData = mockQuizzes
  const quizzesLoading = false
  const refetch = () => {}

  const quizzes = mockQuizzes // Use mock data for demonstration

  const subjects = [
    'Matemáticas', 'Lenguaje', 'Ciencias Naturales', 'Historia', 'Inglés',
    'Educación Física', 'Artes', 'Música', 'Tecnología'
  ]

  const grades = [
    '1º Básico', '2º Básico', '3º Básico', '4º Básico', '5º Básico', '6º Básico',
    '7º Básico', '8º Básico', '1º Medio', '2º Medio', '3º Medio', '4º Medio'
  ]

  const bloomLevels = ['Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear']

  const handleStartGame = async (quizId: string) => {
    try {
      // Mock API call - replace with actual API when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockGameSessionId = `game-${Date.now()}`
      
      toast.success('Juego creado exitosamente')
      router.push(`/teacher/game/${mockGameSessionId}/lobby`)
    } catch (error) {
      toast.error('Error al crear el juego')
    }
  }

  const handleCloneQuiz = async (quizId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/quiz/${quizId}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          clone_type: 'full_clone', // P2-T-03: Full clone with editing capability
          preserve_settings: true,
          auto_rename: true
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('🎮 Quiz clonado exitosamente - P2-T-03')
        // Navigate to edit page for immediate editing (< 5 min target)
        router.push(`/teacher/quiz/${data.data.cloned_quiz_id}/edit?mode=clone`)
      } else {
        throw new Error(data.error || 'Error cloning quiz')
      }
    } catch (error) {
      toast.error('Error al clonar quiz')
      console.error('Clone error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloneAndConvertToGame = async (quizId: string) => {
    setLoading(true)
    try {
      // P2-T-03: Clone and immediately convert to game format
      const cloneResponse = await fetch(`/api/quiz/${quizId}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          clone_type: 'game_ready',
          preserve_settings: true,
          auto_rename: true,
          convert_to_game: true
        })
      })

      const cloneData = await cloneResponse.json()
      
      if (cloneData.success) {
        // Create game session immediately
        const gameResponse = await fetch('/api/game/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            quiz_id: cloneData.data.cloned_quiz_id,
            format: 'trivia_lightning', // Default format
            settings: {
              max_players: 30,
              time_limit: 30,
              show_correct_answers: true,
              accessibility_mode: true,
              tts_enabled: true
            }
          })
        })

        const gameData = await gameResponse.json()
        
        if (gameData.success) {
          toast.success('🎮 Quiz clonado y juego creado - P2-T-03')
          router.push(`/teacher/game/${gameData.data.session_id}/lobby`)
        }
      }
    } catch (error) {
      toast.error('Error al clonar y crear juego')
      console.error('Clone to game error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este quiz?')) return

    try {
      // Mock API call - replace with actual API when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Quiz eliminado exitosamente')
      // refetch() - would refresh data from API
    } catch (error) {
      toast.error('Error al eliminar quiz')
    }
  }

  const handleExportQuiz = async (quizId: string) => {
    try {
      // Mock API call - replace with actual API when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      const exportData = { quiz_id: quizId, title: 'Mock Quiz Export', exported_at: new Date().toISOString() }
      
      // Trigger download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quiz-${quizId}-export.json`
      a.click()
      toast.success('Quiz exportado exitosamente')
    } catch (error) {
      toast.error('Error al exportar quiz')
    }
  }

  const getQuizStats = () => {
    const total = quizzes.length
    const manual = quizzes.filter(q => q.mode === 'manual').length
    const ai = quizzes.filter(q => q.mode === 'ai').length
    const published = quizzes.filter(q => q.status === 'published').length
    const draft = quizzes.filter(q => q.status === 'draft').length
    const totalUsage = quizzes.reduce((sum, q) => sum + q.usage_count, 0)
    const avgScore = quizzes.filter(q => q.avg_score > 0).reduce((sum, q) => sum + q.avg_score, 0) / quizzes.filter(q => q.avg_score > 0).length || 0

    return { total, manual, ai, published, draft, totalUsage, avgScore }
  }

  const stats = getQuizStats()

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.oa_codes.some(oa => oa.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = selectedSubject === 'all' || quiz.subject === selectedSubject
    const matchesGrade = selectedGrade === 'all' || quiz.grade_level === selectedGrade
    const matchesMode = selectedMode === 'all' || quiz.mode === selectedMode
    const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty
    const matchesBloom = selectedBloom === 'all' || quiz.bloom_levels.includes(selectedBloom)

    return matchesSearch && matchesSubject && matchesGrade && matchesMode && matchesDifficulty && matchesBloom
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      case 'archived': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getModeIcon = (mode: string) => {
    return mode === 'ai' ? <SparklesIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Quizzes</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona todos tus cuestionarios y convierte a juegos interactivos
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="secondary"
              leftIcon={<SparklesIcon className="h-4 w-4" />}
              onClick={() => router.push('/teacher/quiz/create?mode=ai')}
            >
              Generar con IA
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={() => router.push('/teacher/quiz/create')}
            >
              Crear Quiz Manual
            </Button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">{stats.published} publicados, {stats.draft} borradores</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex space-x-1">
                  <PencilIcon className="h-4 w-4 text-green-500" />
                  <SparklesIcon className="h-4 w-4 text-purple-500" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Manual / IA</p>
                <p className="text-2xl font-bold text-gray-900">{stats.manual} / {stats.ai}</p>
                <p className="text-xs text-gray-500">{Math.round((stats.ai / stats.total) * 100)}% generados con IA</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlayIcon className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Usos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p>
                <p className="text-xs text-gray-500">Promedio: {Math.round(stats.totalUsage / stats.total)} por quiz</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgScore.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Nota promedio de estudiantes</p>
              </div>
            </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar quizzes, OA, descripciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input"
            >
              <option value="all">Todas las asignaturas</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="input"
            >
              <option value="all">Todos los niveles</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>

            {/* Mode Filter */}
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="input"
            >
              <option value="all">Manual + IA</option>
              <option value="manual">Solo Manual</option>
              <option value="ai">Solo IA</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input"
            >
              <option value="all">Todas las dificultades</option>
              <option value="easy">Fácil</option>
              <option value="medium">Medio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <select
              value={selectedBloom}
              onChange={(e) => setSelectedBloom(e.target.value)}
              className="input"
            >
              <option value="all">Todos los niveles Bloom</option>
              {bloomLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="created_at">Fecha de creación</option>
              <option value="updated_at">Última modificación</option>
              <option value="usage_count">Más utilizados</option>
              <option value="avg_score">Mejor promedio</option>
              <option value="title">Nombre A-Z</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="input"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>

            <div className="text-sm text-gray-500 flex items-center">
              Mostrando {filteredQuizzes.length} de {quizzes.length} quizzes
            </div>
          </div>
        </div>

        {/* Quizzes List/Grid */}
        <div className="card p-6">
          {quizzesLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredQuizzes.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <div key={quiz.quiz_id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    {/* Quiz Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getModeIcon(quiz.mode)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quiz.status)}`}>
                            {quiz.status === 'published' ? 'Publicado' : quiz.status === 'draft' ? 'Borrador' : 'Archivado'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                            {quiz.difficulty === 'easy' ? 'Fácil' : quiz.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{quiz.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>{quiz.subject} • {quiz.grade_level}</div>
                          <div>{quiz.question_count} preguntas • {quiz.estimated_time} min</div>
                          <div>Por: {quiz.author_name}</div>
                        </div>
                      </div>
                    </div>

                    {/* OA Codes */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {quiz.oa_codes.map((oa) => (
                        <span key={oa} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {oa}
                        </span>
                      ))}
                    </div>

                    {/* Bloom Levels */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {quiz.bloom_levels.map((level) => (
                        <span key={level} className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                          {level}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{quiz.usage_count}</div>
                        <div className="text-xs text-gray-500">Usos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{quiz.avg_score > 0 ? quiz.avg_score.toFixed(1) : '--'}</div>
                        <div className="text-xs text-gray-500">Promedio</div>
                      </div>
                    </div>

                    {/* Accessibility Features */}
                    {quiz.accessibility_features.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Accesibilidad:</div>
                        <div className="flex flex-wrap gap-1">
                          {quiz.accessibility_features.map((feature) => (
                            <span key={feature} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced action buttons for P2-T-03 */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCloneQuiz(quiz.quiz_id)}
                        className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                        disabled={loading}
                      >
                        <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                        Clonar
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCloneAndConvertToGame(quiz.quiz_id)}
                        className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                        disabled={loading}
                      >
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Clonar + Juego
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartGame(quiz.quiz_id)}
                        className="text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-300"
                        disabled={loading}
                      >
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Iniciar Juego
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/teacher/quiz/${quiz.quiz_id}/edit`)}
                        className="text-gray-600 hover:text-gray-700"
                        disabled={loading}
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuiz(quiz.quiz_id)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        disabled={loading}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {filteredQuizzes.map((quiz) => (
                  <div key={quiz.quiz_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-1">
                            {getModeIcon(quiz.mode)}
                            <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quiz.status)}`}>
                            {quiz.status === 'published' ? 'Publicado' : quiz.status === 'draft' ? 'Borrador' : 'Archivado'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                            {quiz.difficulty === 'easy' ? 'Fácil' : quiz.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{quiz.subject} • {quiz.grade_level}</span>
                          <span>{quiz.question_count} preguntas • {quiz.estimated_time} min</span>
                          <span>{quiz.usage_count} usos</span>
                          <span>Promedio: {quiz.avg_score > 0 ? quiz.avg_score.toFixed(1) : '--'}</span>
                          <span>Por: {quiz.author_name}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="primary"
                          leftIcon={<PlayIcon className="h-3 w-3" />}
                          onClick={() => handleStartGame(quiz.quiz_id)}
                          disabled={!quiz.can_convert_to_game}
                        >
                          Jugar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<EyeIcon className="h-3 w-3" />}
                          onClick={() => router.push(`/teacher/quiz/${quiz.quiz_id}`)}
                        >
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<PencilIcon className="h-3 w-3" />}
                          onClick={() => router.push(`/teacher/quiz/${quiz.quiz_id}/edit`)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<CogIcon className="h-3 w-3" />}
                        >
                          •••
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay quizzes que coincidan</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedSubject !== 'all' || selectedGrade !== 'all' || selectedMode !== 'all' ? 
                  'Intenta ajustar los filtros de búsqueda.' : 
                  'Comienza creando tu primer quiz.'
                }
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => router.push('/teacher/quiz/create?mode=ai')}
                  leftIcon={<SparklesIcon className="h-4 w-4" />}
                >
                  Generar con IA
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/teacher/quiz/create')}
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                >
                  Crear Manual
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 