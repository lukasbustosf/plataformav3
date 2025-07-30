'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  EyeIcon,
  ShareIcon,
  TrashIcon,
  FolderOpenIcon,
  ArrowDownTrayIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

export default function TeacherMaterialsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [currentFolder, setCurrentFolder] = useState('root')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const subjects = ['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés']
  
  const fileTypes = [
    { value: 'all', label: 'Todos los archivos' },
    { value: 'document', label: 'Documentos' },
    { value: 'image', label: 'Imágenes' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'presentation', label: 'Presentaciones' },
    { value: 'link', label: 'Enlaces' }
  ]

  // Mock materials data
  const materials = [
    {
      id: 1,
      name: 'Guía de Fracciones',
      type: 'document',
      subject: 'Matemáticas',
      size: '2.4 MB',
      extension: 'pdf',
      uploadDate: '2024-01-15T10:00:00Z',
      downloads: 23,
      shares: 5,
      folder: 'matematicas/5to-basico',
      description: 'Guía completa con ejercicios de fracciones para 5° básico',
      tags: ['fracciones', 'ejercicios', 'guía'],
      isShared: true,
      thumbnail: null
    },
    {
      id: 2,
      name: 'Video Sistema Solar',
      type: 'video',
      subject: 'Ciencias',
      size: '156.7 MB',
      extension: 'mp4',
      uploadDate: '2024-01-10T14:30:00Z',
      downloads: 18,
      shares: 12,
      folder: 'ciencias/4to-basico',
      description: 'Documental educativo sobre los planetas del sistema solar',
      tags: ['sistema solar', 'planetas', 'documental'],
      isShared: true,
      thumbnail: '/thumbnails/sistema-solar.jpg'
    },
    {
      id: 3,
      name: 'Presentación Independencia',
      type: 'presentation',
      subject: 'Historia',
      size: '15.2 MB',
      extension: 'pptx',
      uploadDate: '2024-01-08T09:15:00Z',
      downloads: 31,
      shares: 8,
      folder: 'historia/8vo-basico',
      description: 'Presentación sobre la Independencia de Chile',
      tags: ['independencia', 'chile', 'historia'],
      isShared: false,
      thumbnail: null
    },
    {
      id: 4,
      name: 'Khan Academy - Álgebra',
      type: 'link',
      subject: 'Matemáticas',
      url: 'https://www.khanacademy.org/math/algebra',
      uploadDate: '2024-01-12T16:20:00Z',
      clicks: 67,
      shares: 15,
      folder: 'matematicas/enlaces',
      description: 'Curso completo de álgebra en Khan Academy',
      tags: ['álgebra', 'khan academy', 'curso online'],
      isShared: true,
      thumbnail: null
    },
    {
      id: 5,
      name: 'Mapa de Chile',
      type: 'image',
      subject: 'Historia',
      size: '8.9 MB',
      extension: 'png',
      uploadDate: '2024-01-05T11:45:00Z',
      downloads: 42,
      shares: 20,
      folder: 'historia/mapas',
      description: 'Mapa político de Chile en alta resolución',
      tags: ['mapa', 'chile', 'geografía'],
      isShared: true,
      thumbnail: '/thumbnails/mapa-chile.png'
    }
  ]

  const folders = [
    { name: 'Matemáticas', path: 'matematicas', itemCount: 45, subject: 'Matemáticas' },
    { name: 'Ciencias', path: 'ciencias', itemCount: 32, subject: 'Ciencias' },
    { name: 'Historia', path: 'historia', itemCount: 28, subject: 'Historia' },
    { name: 'Lenguaje', path: 'lenguaje', itemCount: 38, subject: 'Lenguaje' },
    { name: 'Inglés', path: 'ingles', itemCount: 22, subject: 'Inglés' },
    { name: 'Recursos Compartidos', path: 'shared', itemCount: 15, subject: null }
  ]

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || material.type === selectedType
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject
    
    return matchesSearch && matchesType && matchesSubject
  })

  const getFileIcon = (type: string, extension?: string) => {
    switch (type) {
      case 'document':
        return <DocumentTextIcon className="h-8 w-8 text-red-500" />
      case 'image':
        return <PhotoIcon className="h-8 w-8 text-green-500" />
      case 'video':
        return <FilmIcon className="h-8 w-8 text-blue-500" />
      case 'audio':
        return <MusicalNoteIcon className="h-8 w-8 text-purple-500" />
      case 'presentation':
        return <DocumentIcon className="h-8 w-8 text-orange-500" />
      case 'link':
        return <LinkIcon className="h-8 w-8 text-blue-600" />
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />
    }
  }

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'document': return 'Documento'
      case 'image': return 'Imagen'
      case 'video': return 'Video'
      case 'audio': return 'Audio'
      case 'presentation': return 'Presentación'
      case 'link': return 'Enlace'
      default: return type
    }
  }

  const formatFileSize = (bytes: string) => {
    if (!bytes) return '-'
    const size = parseFloat(bytes.split(' ')[0])
    const unit = bytes.split(' ')[1]
    if (size < 1) return `${(size * 1024).toFixed(0)} KB`
    return bytes
  }

  const handleUpload = () => {
    router.push('/teacher/materials/upload')
  }

  const handleCreateFolder = () => {
    const folderName = prompt('Nombre de la nueva carpeta:')
    if (folderName) {
      toast.success(`Carpeta "${folderName}" creada exitosamente`)
    }
  }

  const handleDownload = (materialId: number) => {
    toast.success('Descarga iniciada')
  }

  const handleShare = (materialId: number) => {
    toast.success('Enlace copiado al portapapeles')
  }

  const handleDelete = (materialId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      toast.success('Archivo eliminado exitosamente')
    }
  }

  const stats = {
    totalFiles: materials.length,
    totalSize: '245.6 MB',
    sharedFiles: materials.filter(m => m.isShared).length,
    totalDownloads: materials.reduce((acc, m) => acc + (m.downloads || m.clicks || 0), 0)
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {currentFolder === 'root' && folders.map((folder) => (
        <div
          key={folder.path}
          className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
          onClick={() => setCurrentFolder(folder.path)}
        >
          <FolderIcon className="h-12 w-12 text-blue-500 mx-auto mb-3" />
          <div className="text-center">
            <h3 className="font-medium text-gray-900">{folder.name}</h3>
            <p className="text-sm text-gray-500">{folder.itemCount} archivos</p>
          </div>
        </div>
      ))}
      
      {filteredMaterials.map((material) => (
        <div key={material.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100">
            {material.thumbnail ? (
              <img src={material.thumbnail} alt={material.name} className="object-cover" />
            ) : (
              <div className="flex items-center justify-center">
                {getFileIcon(material.type, material.extension)}
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-gray-900 truncate">{material.name}</h3>
              {material.isShared && (
                <ShareIcon className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{material.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{getFileTypeLabel(material.type)}</span>
              <span>{material.type === 'link' ? `${material.clicks} clics` : formatFileSize(material.size || '')}</span>
            </div>
            <div className="flex space-x-1 mb-3">
              {material.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
              {material.tags.length > 2 && (
                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
                  +{material.tags.length - 2}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {new Date(material.uploadDate).toLocaleDateString()}
              </span>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(material.id)}
                  leftIcon={<ArrowDownTrayIcon className="h-3 w-3" />}
                >
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(material.id)}
                  leftIcon={<ShareIcon className="h-3 w-3" />}
                >
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Archivo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tamaño
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asignatura
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
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
                    {getFileIcon(material.type, material.extension)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{material.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{material.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getFileTypeLabel(material.type)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {material.type === 'link' ? '-' : formatFileSize(material.size || '')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {material.subject}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(material.uploadDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(material.id)}
                  leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                >
                  Descargar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(material.id)}
                  leftIcon={<ShareIcon className="h-4 w-4" />}
                >
                  Compartir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Materiales y Recursos</h1>
            <p className="text-gray-600">Organiza y comparte tus recursos educativos</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCreateFolder}
              leftIcon={<FolderIcon className="h-4 w-4" />}
            >
              Nueva Carpeta
            </Button>
            <Button
              onClick={handleUpload}
              leftIcon={<CloudArrowUpIcon className="h-4 w-4" />}
            >
              Subir Archivo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Archivos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderOpenIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Espacio Usado</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSize}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShareIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Archivos Compartidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sharedFiles}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownTrayIcon className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Descargas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        {currentFolder !== 'root' && (
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => setCurrentFolder('root')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Inicio
                </button>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{currentFolder}</span>
              </li>
            </ol>
          </nav>
        )}

        {/* Filters and Search */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar archivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input"
            >
              {fileTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

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

            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'grid' 
                    ? 'bg-primary-50 border-primary-200 text-primary-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cuadrícula
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-r-md border-l-0 border ${
                  viewMode === 'list' 
                    ? 'bg-primary-50 border-primary-200 text-primary-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? renderGridView() : renderListView()}

        {filteredMaterials.length === 0 && currentFolder !== 'root' && (
          <div className="text-center py-12">
            <FolderOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No se encontraron archivos</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedType !== 'all' || selectedSubject !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'Esta carpeta está vacía. Sube tu primer archivo.'}
            </p>
            <Button
              onClick={handleUpload}
              leftIcon={<CloudArrowUpIcon className="h-4 w-4" />}
            >
              Subir Archivo
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 