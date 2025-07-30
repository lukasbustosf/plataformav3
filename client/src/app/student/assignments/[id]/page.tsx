'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  ClockIcon, 
  PaperClipIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EyeIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'

export default function StudentAssignmentDetailPage() {
  const { id } = useParams()
  const { user, fullName } = useAuth()
  const [activeTab, setActiveTab] = useState('details')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [submissionText, setSubmissionText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for the specific assignment
  const assignmentData = {
    id: id,
    title: 'Proyecto Final: Aplicaciones de Ecuaciones Lineales',
    subject: 'Matemáticas',
    teacher: 'Prof. María González',
    dueDate: '2024-12-25 23:59',
    assignedDate: '2024-12-15',
    status: 'pending',
    priority: 'high',
    points: 100,
    description: 'Desarrolla un proyecto que demuestre la aplicación práctica de las ecuaciones lineales en situaciones de la vida real.',
    attachments: [
      {
        id: 1,
        name: 'Rubrica_Evaluacion.pdf',
        size: '245 KB',
        type: 'PDF'
      },
      {
        id: 2,
        name: 'Ejemplos_Proyectos_Anteriores.zip',
        size: '2.3 MB',
        type: 'ZIP'
      }
    ],
    requirements: [
      'El informe debe estar en formato PDF',
      'Incluir portada con datos del estudiante',
      'Utilizar fuentes académicas confiables',
      'Máximo 10 páginas (sin contar anexos)'
    ]
  }

  const getStatusInfo = (status: string, dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const isOverdue = now > due

    switch (status) {
      case 'pending':
        return {
          color: isOverdue ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: isOverdue ? <ExclamationTriangleIcon className="h-4 w-4" /> : <ClockIcon className="h-4 w-4" />,
          text: isOverdue ? 'Atrasada' : 'Pendiente'
        }
      case 'submitted':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <InformationCircleIcon className="h-4 w-4" />,
          text: 'Entregada'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <InformationCircleIcon className="h-4 w-4" />,
          text: 'Desconocido'
        }
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `${Math.abs(diffDays)} días atrasada`
    if (diffDays === 0) return 'Vence hoy'
    if (diffDays === 1) return 'Vence mañana'
    return `${diffDays} días restantes`
  }

  const statusInfo = getStatusInfo(assignmentData.status, assignmentData.dueDate)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setSelectedFiles(Array.from(files))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Submitting assignment:', { text: submissionText, files: selectedFiles })
    setIsSubmitting(false)
  }

  const tabs = [
    { id: 'details', name: 'Detalles' },
    { id: 'submit', name: 'Entregar Trabajo' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{assignmentData.title}</h1>
              <p className="mt-2 opacity-90">{assignmentData.subject} • {assignmentData.teacher}</p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${statusInfo.color}`}>
              {statusInfo.icon}
              <span className="font-medium">{statusInfo.text}</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center opacity-90">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>Asignada: {new Date(assignmentData.assignedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center opacity-90">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>Vence: {new Date(assignmentData.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center opacity-90">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              <span>{getDaysUntilDue(assignmentData.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Puntos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{assignmentData.points}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <PaperClipIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Archivos Adjuntos</p>
                <p className="text-2xl font-bold text-gray-900">{assignmentData.attachments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  assignmentData.priority === 'high' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <ExclamationTriangleIcon className={`h-5 w-5 ${
                    assignmentData.priority === 'high' ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Prioridad</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{assignmentData.priority}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción de la Tarea</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-gray-700">{assignmentData.description}</div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Requisitos</h3>
                  <div className="space-y-2">
                    {assignmentData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                        <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Material de Apoyo</h3>
                  <div className="space-y-3">
                    {assignmentData.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">📄</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{attachment.name}</h4>
                            <p className="text-sm text-gray-600">{attachment.type} • {attachment.size}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" leftIcon={<EyeIcon className="h-4 w-4" />}>
                            Ver
                          </Button>
                          <Button size="sm" leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}>
                            Descargar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Tab */}
            {activeTab === 'submit' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <InformationCircleIcon className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Importante</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Una vez que entregues tu trabajo, no podrás modificarlo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Text Submission */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios Adicionales (Opcional)
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    rows={4}
                    placeholder="Puedes agregar comentarios sobre tu trabajo..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subir Archivos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-sm text-gray-600 mb-2">
                      Arrastra archivos aquí o haz clic para seleccionar
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      Seleccionar Archivos
                    </label>
                  </div>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos Seleccionados:</h4>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFiles([])
                      setSubmissionText('')
                    }}
                  >
                    Limpiar Todo
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || (selectedFiles.length === 0 && submissionText.trim() === '')}
                    leftIcon={isSubmitting ? <ClockIcon className="h-4 w-4 animate-spin" /> : <PencilSquareIcon className="h-4 w-4" />}
                    size="lg"
                  >
                    {isSubmitting ? 'Entregando...' : 'Entregar Trabajo'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 