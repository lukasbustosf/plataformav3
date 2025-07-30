'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  BookOpenIcon,
  PlayIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  FolderIcon,
  LinkIcon,
  AcademicCapIcon,
  PresentationChartBarIcon,
  MusicalNoteIcon,
  PhotoIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Material {
  id: string
  title: string
  description: string
  subject: string
  grade: string
  type: 'video' | 'pdf' | 'presentation' | 'audio' | 'interactive' | 'link' | 'image' | 'game'
  duration?: number
  size?: string
  url: string
  thumbnail?: string
  downloadable: boolean
  uploadedAt: string
  uploadedBy: string
  downloads: number
  views: number
  rating: number
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isFavorite: boolean
  lastAccessed?: string
}

const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Introducción a las Fracciones',
    description: 'Video explicativo sobre conceptos básicos de fracciones con ejemplos visuales y ejercicios prácticos.',
    subject: 'Matemáticas',
    grade: '5°',
    type: 'video',
    duration: 15,
    url: '/videos/fracciones-intro.mp4',
    thumbnail: '/thumbnails/fracciones.jpg',
    downloadable: true,
    uploadedAt: '2024-01-15T10:00:00Z',
    uploadedBy: 'Prof. Ana Martínez',
    downloads: 127,
    views: 245,
    rating: 4.8,
    tags: ['fracciones', 'matemáticas básica', 'conceptos'],
    difficulty: 'beginner',
    isFavorite: true,
    lastAccessed: '2024-01-19T14:30:00Z'
  },
  {
    id: '2',
    title: 'Ecosistemas de Chile - Guía Completa',
    description: 'Documento PDF con información detallada sobre los diferentes ecosistemas presentes en Chile.',
    subject: 'Ciencias Naturales',
    grade: '5°',
    type: 'pdf',
    size: '5.2 MB',
    url: '/pdfs/ecosistemas-chile.pdf',
    downloadable: true,
    uploadedAt: '2024-01-12T08:30:00Z',
    uploadedBy: 'Prof. Carlos Ruiz',
    downloads: 89,
    views: 156,
    rating: 4.6,
    tags: ['ecosistemas', 'chile', 'biodiversidad', 'medio ambiente'],
    difficulty: 'intermediate',
    isFavorite: false
  },
  {
    id: '3',
    title: 'La Independencia de Chile - Presentación',
    description: 'Presentación interactiva sobre los eventos principales de la Independencia de Chile con imágenes y mapas.',
    subject: 'Historia',
    grade: '5°',
    type: 'presentation',
    url: '/presentations/independencia-chile.pptx',
    downloadable: true,
    uploadedAt: '2024-01-10T16:45:00Z',
    uploadedBy: 'Prof. María González',
    downloads: 203,
    views: 318,
    rating: 4.9,
    tags: ['independencia', 'historia de chile', 'siglo XIX'],
    difficulty: 'intermediate',
    isFavorite: true,
    lastAccessed: '2024-01-18T11:20:00Z'
  },
  {
    id: '4',
    title: 'Juego: Tabla de Multiplicar',
    description: 'Juego interactivo para practicar las tablas de multiplicar de forma divertida y efectiva.',
    subject: 'Matemáticas',
    grade: '5°',
    type: 'game',
    url: '/games/tabla-multiplicar',
    downloadable: false,
    uploadedAt: '2024-01-08T12:00:00Z',
    uploadedBy: 'Prof. Ana Martínez',
    downloads: 0,
    views: 421,
    rating: 4.7,
    tags: ['multiplicación', 'juego', 'práctica'],
    difficulty: 'beginner',
    isFavorite: false
  },
  {
    id: '5',
    title: 'Lectura: "El Principito" - Audio Libro',
    description: 'Versión narrada del clásico "El Principito" para mejorar la comprensión auditiva y el análisis literario.',
    subject: 'Lenguaje',
    grade: '5°',
    type: 'audio',
    duration: 95,
    url: '/audio/principito-audiolibro.mp3',
    downloadable: true,
    uploadedAt: '2024-01-05T14:20:00Z',
    uploadedBy: 'Prof. Isabel Torres',
    downloads: 156,
    views: 267,
    rating: 4.5,
    tags: ['literatura', 'audio', 'comprensión', 'principito'],
    difficulty: 'intermediate',
    isFavorite: false
  },
  {
    id: '6',
    title: 'Simulador de Experimentos Químicos',
    description: 'Laboratorio virtual para realizar experimentos químicos seguros desde casa.',
    subject: 'Ciencias Naturales',
    grade: '5°',
    type: 'interactive',
    url: '/simulators/laboratorio-quimica',
    downloadable: false,
    uploadedAt: '2024-01-03T09:15:00Z',
    uploadedBy: 'Prof. Carlos Ruiz',
    downloads: 0,
    views: 312,
    rating: 4.8,
    tags: ['química', 'experimentos', 'laboratorio virtual'],
    difficulty: 'advanced',
    isFavorite: true,
    lastAccessed: '2024-01-17T13:45:00Z'
  }
]

export default function StudentMaterialsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('recent')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject
    const matchesType = selectedType === 'all' || material.type === selectedType
    const matchesDifficulty = selectedDifficulty === 'all' || material.difficulty === selectedDifficulty
    const matchesFavorites = !showFavoritesOnly || material.isFavorite
    
    return matchesSearch && matchesSubject && matchesType && matchesDifficulty && matchesFavorites
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case 'popular':
        return b.views - a.views
      case 'rating':
        return b.rating - a.rating
      case 'alphabetical':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCameraIcon className="h-5 w-5" />
      case 'pdf': return <DocumentTextIcon className="h-5 w-5" />
      case 'presentation': return <PresentationChartBarIcon className="h-5 w-5" />
      case 'audio': return <MusicalNoteIcon className="h-5 w-5" />
      case 'interactive': return <AcademicCapIcon className="h-5 w-5" />
      case 'link': return <LinkIcon className="h-5 w-5" />
      case 'image': return <PhotoIcon className="h-5 w-5" />
      case 'game': return <PlayIcon className="h-5 w-5" />
      default: return <FolderIcon className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800'
      case 'pdf': return 'bg-blue-100 text-blue-800'
      case 'presentation': return 'bg-orange-100 text-orange-800'
      case 'audio': return 'bg-purple-100 text-purple-800'
      case 'interactive': return 'bg-green-100 text-green-800'
      case 'link': return 'bg-indigo-100 text-indigo-800'
      case 'image': return 'bg-pink-100 text-pink-800'
      case 'game': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante'
      case 'intermediate': return 'Intermedio'
      case 'advanced': return 'Avanzado'
      default: return difficulty
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  const handleMaterialClick = (material: Material) => {
    if (material.type === 'game' || material.type === 'interactive') {
      window.open(material.url, '_blank')
    } else {
      toast.success(`Abriendo ${material.title}...`)
      // Logic to track view
    }
  }

  const handleDownload = (material: Material) => {
    if (material.downloadable) {
      toast.success(`Descargando ${material.title}...`)
      // Logic to download file
    } else {
      toast.error('Este material no está disponible para descarga')
    }
  }

  const handleToggleFavorite = (materialId: string) => {
    toast.success('Favorito actualizado')
    // Logic to toggle favorite
  }

  const subjects = ['Matemáticas', 'Ciencias Naturales', 'Historia', 'Lenguaje', 'Inglés', 'Arte']
  const types = ['video', 'pdf', 'presentation', 'audio', 'interactive', 'link', 'image', 'game']

  const stats = {
    total: mockMaterials.length,
    videos: mockMaterials.filter(m => m.type === 'video').length,
    documents: mockMaterials.filter(m => m.type === 'pdf' || m.type === 'presentation').length,
    interactive: mockMaterials.filter(m => m.type === 'interactive' || m.type === 'game').length,
    favorites: mockMaterials.filter(m => m.isFavorite).length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📚 Materiales de Estudio</h1>
            <p className="mt-1 text-sm text-gray-600">
              Accede a todos tus recursos educativos en un solo lugar
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant={showFavoritesOnly ? 'primary' : 'outline'}
              leftIcon={showFavoritesOnly ? <HeartSolidIcon className="h-4 w-4" /> : <HeartIcon className="h-4 w-4" />}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              Favoritos
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FolderIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <VideoCameraIcon className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.videos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Documentos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <PlayIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Interactivos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interactive}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-pink-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar materiales..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                leftIcon={<FunnelIcon className="h-4 w-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros
              </Button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recent">Más recientes</option>
                <option value="popular">Más populares</option>
                <option value="rating">Mejor valorados</option>
                <option value="alphabetical">A-Z</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignatura</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todas las asignaturas</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="video">Videos</option>
                  <option value="pdf">PDFs</option>
                  <option value="presentation">Presentaciones</option>
                  <option value="audio">Audio</option>
                  <option value="interactive">Interactivos</option>
                  <option value="game">Juegos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todas las dificultades</option>
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Materials Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                        {getTypeIcon(material.type)}
                        <span className="ml-1 capitalize">{material.type}</span>
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(material.difficulty)}`}>
                        {getDifficultyText(material.difficulty)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(material.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {material.isFavorite ? 
                        <HeartSolidIcon className="h-5 w-5 text-red-500" /> : 
                        <HeartIcon className="h-5 w-5" />
                      }
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {material.subject}
                    </span>
                    {material.duration && (
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{formatDuration(material.duration)}</span>
                      </div>
                    )}
                    {material.size && (
                      <span>{material.size}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        <span>{material.views}</span>
                      </div>
                      {material.downloadable && (
                        <div className="flex items-center">
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                          <span>{material.downloads}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{material.rating}</span>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<EyeIcon className="h-3 w-3" />}
                      onClick={() => handleMaterialClick(material)}
                      className="flex-1"
                    >
                      {material.type === 'game' || material.type === 'interactive' ? 'Abrir' : 'Ver'}
                    </Button>
                    {material.downloadable && (
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ArrowDownTrayIcon className="h-3 w-3" />}
                        onClick={() => handleDownload(material)}
                      >
                        Descargar
                      </Button>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    <p>Por {material.uploadedBy}</p>
                    <p>{new Date(material.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duración/Tamaño
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valoración
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            {material.isFavorite && <HeartSolidIcon className="h-4 w-4 text-red-500" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{material.title}</div>
                            <div className="text-sm text-gray-500">{material.uploadedBy}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                          {getTypeIcon(material.type)}
                          <span className="ml-1 capitalize">{material.type}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {material.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {material.duration ? formatDuration(material.duration) : material.size || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">{material.rating}</span>
                          <span className="ml-2 text-xs text-gray-500">({material.views} vistas)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<EyeIcon className="h-3 w-3" />}
                          onClick={() => handleMaterialClick(material)}
                        >
                          {material.type === 'game' || material.type === 'interactive' ? 'Abrir' : 'Ver'}
                        </Button>
                        {material.downloadable && (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<ArrowDownTrayIcon className="h-3 w-3" />}
                            onClick={() => handleDownload(material)}
                          >
                            Descargar
                          </Button>
                        )}
                        <button
                          onClick={() => handleToggleFavorite(material.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          {material.isFavorite ? 
                            <HeartSolidIcon className="h-4 w-4 text-red-500" /> : 
                            <HeartIcon className="h-4 w-4" />
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron materiales</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 