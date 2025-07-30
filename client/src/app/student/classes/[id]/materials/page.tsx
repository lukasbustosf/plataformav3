'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ArrowDownTrayIcon,
  EyeIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PresentationChartBarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

export default function StudentClassMaterialsPage() {
  const { id } = useParams()
  const { user, fullName } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Mock data for class materials
  const materials = [
    {
      id: 1,
      name: 'Guía de Ecuaciones Lineales',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: '2024-12-15',
      category: 'Guías',
      description: 'Material de apoyo para el estudio de ecuaciones lineales con ejemplos y ejercicios resueltos',
      downloadCount: 15,
      isNew: true
    },
    {
      id: 2,
      name: 'Video: Resolución de Problemas',
      type: 'MP4',
      size: '45.2 MB',
      uploadDate: '2024-12-12',
      category: 'Videos',
      description: 'Video explicativo sobre técnicas de resolución de problemas matemáticos',
      downloadCount: 8,
      isNew: false
    },
    {
      id: 3,
      name: 'Presentación: Fracciones',
      type: 'PPTX',
      size: '5.8 MB',
      uploadDate: '2024-12-10',
      category: 'Presentaciones',
      description: 'Presentación utilizada en clase sobre operaciones con fracciones',
      downloadCount: 12,
      isNew: false
    },
    {
      id: 4,
      name: 'Ejercicios Complementarios',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-12-08',
      category: 'Ejercicios',
      description: 'Ejercicios adicionales para practicar los conceptos vistos en clase',
      downloadCount: 20,
      isNew: false
    },
    {
      id: 5,
      name: 'Formulario de Geometría',
      type: 'PDF',
      size: '850 KB',
      uploadDate: '2024-12-05',
      category: 'Referencias',
      description: 'Formulario con las principales fórmulas de geometría básica',
      downloadCount: 25,
      isNew: false
    },
    {
      id: 6,
      name: 'Audio: Explicación de Teoremas',
      type: 'MP3',
      size: '12.4 MB',
      uploadDate: '2024-12-03',
      category: 'Audio',
      description: 'Explicación en audio de los principales teoremas matemáticos',
      downloadCount: 6,
      isNew: false
    },
    {
      id: 7,
      name: 'Imágenes: Gráficos Estadísticos',
      type: 'ZIP',
      size: '3.2 MB',
      uploadDate: '2024-12-01',
      category: 'Recursos',
      description: 'Colección de gráficos estadísticos para análisis de datos',
      downloadCount: 9,
      isNew: false
    }
  ]

  const categories = [
    { value: 'all', label: 'Todos los materiales', count: materials.length },
    { value: 'Guías', label: 'Guías de estudio', count: materials.filter(m => m.category === 'Guías').length },
    { value: 'Videos', label: 'Videos', count: materials.filter(m => m.category === 'Videos').length },
    { value: 'Presentaciones', label: 'Presentaciones', count: materials.filter(m => m.category === 'Presentaciones').length },
    { value: 'Ejercicios', label: 'Ejercicios', count: materials.filter(m => m.category === 'Ejercicios').length },
    { value: 'Referencias', label: 'Material de referencia', count: materials.filter(m => m.category === 'Referencias').length }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <DocumentTextIcon className="h-8 w-8 text-red-500" />
      case 'MP4': return <VideoCameraIcon className="h-8 w-8 text-blue-500" />
      case 'PPTX': return <PresentationChartBarIcon className="h-8 w-8 text-orange-500" />
      case 'MP3': return <PhotoIcon className="h-8 w-8 text-purple-500" />
      case 'ZIP': return <FolderIcon className="h-8 w-8 text-gray-500" />
      default: return <DocumentTextIcon className="h-8 w-8 text-gray-500" />
    }
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-50 border-red-200'
      case 'MP4': return 'bg-blue-50 border-blue-200'
      case 'PPTX': return 'bg-orange-50 border-orange-200'
      case 'MP3': return 'bg-purple-50 border-purple-200'
      case 'ZIP': return 'bg-gray-50 border-gray-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownload = (materialId: number, materialName: string) => {
    // Simulate download
    console.log(`Downloading material: ${materialName}`)
    // In a real app, you would trigger the actual download here
  }

  const handleView = (materialId: number, materialName: string) => {
    // Simulate view
    console.log(`Viewing material: ${materialName}`)
    // In a real app, you would open the file viewer here
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Material de Clase 📚</h1>
          <p className="mt-2 opacity-90">
            Matemáticas 8° Básico - Prof. María González
          </p>
          <p className="text-sm opacity-75 mt-1">
            Todos los materiales de apoyo para tu aprendizaje
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Materiales</p>
                <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowDownTrayIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Descargados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {materials.reduce((sum, m) => sum + m.downloadCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Nuevos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {materials.filter(m => m.isNew).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tamaño Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(materials.reduce((sum, m) => {
                    const size = parseFloat(m.size.split(' ')[0])
                    const unit = m.size.split(' ')[1]
                    return sum + (unit === 'MB' ? size : size / 1024)
                  }, 0))} MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar materiales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} rounded-l-lg`}
                >
                  Cuadrícula
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} rounded-r-lg border-l`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Materiales ({filteredMaterials.length})
            </h2>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <div key={material.id} className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow ${getFileColor(material.type)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(material.type)}
                      {material.isNew && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Nuevo
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{material.type}</span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2">{material.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                  
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <div>Tamaño: {material.size}</div>
                    <div>Subido: {new Date(material.uploadDate).toLocaleDateString()}</div>
                    <div>Descargas: {material.downloadCount}</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleView(material.id, material.name)}
                      leftIcon={<EyeIcon className="h-4 w-4" />}
                      className="flex-1"
                    >
                      Ver
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleDownload(material.id, material.name)}
                      leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                      className="flex-1"
                    >
                      Descargar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {getFileIcon(material.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{material.name}</h3>
                          {material.isNew && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Nuevo
                            </span>
                          )}
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{material.type}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{material.description}</p>
                        <div className="text-xs text-gray-500">
                          {material.size} • {new Date(material.uploadDate).toLocaleDateString()} • {material.downloadCount} descargas
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleView(material.id, material.name)}
                        leftIcon={<EyeIcon className="h-4 w-4" />}
                      >
                        Ver
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(material.id, material.name)}
                        leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                      >
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredMaterials.length === 0 && (
            <div className="p-8 text-center">
              <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron materiales</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'No hay materiales disponibles en esta categoría.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 