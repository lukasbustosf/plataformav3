'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  TagIcon,
  FolderIcon
} from '@heroicons/react/24/outline'

export default function UploadMaterialsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [formData, setFormData] = useState({
    subject: '',
    folder: '',
    tags: '',
    description: '',
    visibility: 'students' // students, parents, both
  })

  const subjects = ['Matemáticas', 'Historia', 'Ciencias', 'Lenguaje', 'Inglés', 'Arte', 'Ed. Física']
  const folders = [
    'Material de Clase',
    'Evaluaciones',
    'Tareas',
    'Proyectos',
    'Referencias',
    'Actividades Extra'
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileId: any) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUpload = () => {
    if (uploadedFiles.length === 0) {
      toast.error('Por favor selecciona al menos un archivo')
      return
    }
    if (!formData.subject) {
      toast.error('Por favor selecciona una materia')
      return
    }

    toast.success('Materiales subidos exitosamente')
    router.push('/teacher/materials')
  }

  const handleCancel = () => {
    router.push('/teacher/materials')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subir Material</h1>
            <p className="text-gray-600">Comparte recursos educativos con tus estudiantes</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} leftIcon={<CloudArrowUpIcon className="h-4 w-4" />}>
              Subir Material
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Archivos</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-600">
                    Formatos soportados: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, PNG
                  </p>
                  <p className="text-xs text-gray-500">
                    Tamaño máximo por archivo: 50MB
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Archivos Seleccionados ({uploadedFiles.length})
                </h3>
                
                <div className="space-y-3">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{file.name}</div>
                          <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Configuration Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración del Material</h3>
            
            <div className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materia *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar materia</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Folder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carpeta
                </label>
                <select
                  value={formData.folder}
                  onChange={(e) => setFormData(prev => ({ ...prev, folder: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar carpeta</option>
                  {folders.map(folder => (
                    <option key={folder} value={folder}>{folder}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe brevemente el contenido del material..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Separadas por comas (ej: evaluación, trigonometría)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Las etiquetas ayudan a organizar y encontrar el material
                </p>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visible para
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'students', label: 'Solo estudiantes' },
                    { value: 'parents', label: 'Solo apoderados' },
                    { value: 'both', label: 'Estudiantes y apoderados' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={formData.visibility === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 