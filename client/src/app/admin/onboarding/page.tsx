'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { ResponsiveModal, FormModal } from '@/components/ui/ResponsiveModal'
import { Button } from '@/components/ui/button'
import { 
  PlusIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface OnboardingProcess {
  id: number
  schoolName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  stage: 'initial' | 'documentation' | 'setup' | 'training' | 'testing' | 'completed'
  progress: number
  createdAt: string
  estimatedCompletion: string
  consultant: string
  priority: 'low' | 'medium' | 'high'
  region: string
  studentCount: number
  notes: string
}

export default function OnboardingPage() {
  const [processes, setProcesses] = useState<OnboardingProcess[]>([
    {
      id: 1,
      schoolName: 'Colegio San Patricio',
      contactName: 'María González',
      contactEmail: 'maria.gonzalez@sanpatricio.cl',
      contactPhone: '+56 9 8765 4321',
      stage: 'setup',
      progress: 65,
      createdAt: '2024-01-15',
      estimatedCompletion: '2024-02-15',
      consultant: 'Ana Martínez',
      priority: 'high',
      region: 'Metropolitana',
      studentCount: 450,
      notes: 'Requiere integración con sistema existente'
    },
    {
      id: 2,
      schoolName: 'Instituto Los Andes',
      contactName: 'Carlos Rodríguez',
      contactEmail: 'carlos.rodriguez@losandes.cl',
      contactPhone: '+56 9 7654 3210',
      stage: 'training',
      progress: 80,
      createdAt: '2024-01-10',
      estimatedCompletion: '2024-02-01',
      consultant: 'Pedro Silva',
      priority: 'medium',
      region: 'Valparaíso',
      studentCount: 320,
      notes: 'Personal muy receptivo al cambio'
    },
    {
      id: 3,
      schoolName: 'Escuela Rural El Bosque',
      contactName: 'Laura Mendoza',
      contactEmail: 'laura.mendoza@elbosque.cl',
      contactPhone: '+56 9 6543 2109',
      stage: 'documentation',
      progress: 35,
      createdAt: '2024-01-20',
      estimatedCompletion: '2024-03-01',
      consultant: 'Ana Martínez',
      priority: 'medium',
      region: 'Biobío',
      studentCount: 180,
      notes: 'Conectividad limitada, requiere soluciones offline'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<OnboardingProcess | null>(null)
  const [newProcess, setNewProcess] = useState({
    schoolName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    region: '',
    studentCount: '',
    priority: 'medium',
    notes: ''
  })

  const getStageColor = (stage: OnboardingProcess['stage']) => {
    switch (stage) {
      case 'initial':
        return 'bg-gray-100 text-gray-800'
      case 'documentation':
        return 'bg-blue-100 text-blue-800'
      case 'setup':
        return 'bg-yellow-100 text-yellow-800'
      case 'training':
        return 'bg-purple-100 text-purple-800'
      case 'testing':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageLabel = (stage: OnboardingProcess['stage']) => {
    switch (stage) {
      case 'initial':
        return 'Inicial'
      case 'documentation':
        return 'Documentación'
      case 'setup':
        return 'Configuración'
      case 'training':
        return 'Capacitación'
      case 'testing':
        return 'Pruebas'
      case 'completed':
        return 'Completado'
      default:
        return 'Desconocido'
    }
  }

  const getPriorityColor = (priority: OnboardingProcess['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateProcess = () => {
    const newId = Math.max(...processes.map(p => p.id)) + 1
    const process: OnboardingProcess = {
      id: newId,
      schoolName: newProcess.schoolName,
      contactName: newProcess.contactName,
      contactEmail: newProcess.contactEmail,
      contactPhone: newProcess.contactPhone,
      stage: 'initial',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      consultant: 'Sin asignar',
      priority: newProcess.priority as OnboardingProcess['priority'],
      region: newProcess.region,
      studentCount: parseInt(newProcess.studentCount) || 0,
      notes: newProcess.notes
    }
    
    setProcesses([...processes, process])
    setNewProcess({
      schoolName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      region: '',
      studentCount: '',
      priority: 'medium',
      notes: ''
    })
    setIsModalOpen(false)
    toast.success('Proceso de onboarding creado exitosamente')
  }

  const handleContactAction = (process: OnboardingProcess, type: 'phone' | 'email') => {
    if (type === 'phone') {
      window.open(`tel:${process.contactPhone}`)
    } else {
      window.open(`mailto:${process.contactEmail}`)
    }
    toast.success(`Contactando a ${process.contactName}`)
  }

  const handleNextStage = (processId: number) => {
    setProcesses(processes.map(p => {
      if (p.id === processId) {
        const stages: OnboardingProcess['stage'][] = ['initial', 'documentation', 'setup', 'training', 'testing', 'completed']
        const currentIndex = stages.indexOf(p.stage)
        if (currentIndex < stages.length - 1) {
          return {
            ...p,
            stage: stages[currentIndex + 1],
            progress: Math.min(100, p.progress + 20)
          }
        }
      }
      return p
    }))
    toast.success('Etapa actualizada exitosamente')
  }

  const columns = [
    {
      key: 'schoolName',
      label: 'Colegio',
      render: (value: string, row: OnboardingProcess) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <BuildingOfficeIcon className="h-4 w-4 text-primary-600" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{value}</div>
            <div className="text-mobile-xs text-gray-500 truncate">{row.contactName}</div>
          </div>
        </div>
      )
    },
    {
      key: 'stage',
      label: 'Etapa',
      render: (value: OnboardingProcess['stage']) => (
        <span className={`inline-flex px-2 py-1 rounded-full text-mobile-xs font-medium ${getStageColor(value)}`}>
          {getStageLabel(value)}
        </span>
      )
    },
    {
      key: 'progress',
      label: 'Progreso',
      hiddenOnMobile: true,
      render: (value: number) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="h-2 rounded-full bg-primary-600"
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-mobile-xs text-gray-900">{value}%</span>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Prioridad',
      hiddenOnMobile: true,
      render: (value: OnboardingProcess['priority']) => (
        <span className={`inline-flex px-2 py-1 rounded-full text-mobile-xs font-medium ${getPriorityColor(value)}`}>
          {value === 'high' ? 'Alta' : value === 'medium' ? 'Media' : 'Baja'}
        </span>
      )
    },
    {
      key: 'consultant',
      label: 'Consultor',
      hiddenOnMobile: true,
      render: (value: string) => (
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-mobile-sm text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: OnboardingProcess) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedProcess(row)
              setIsDetailModalOpen(true)
            }}
            className="btn-responsive"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleContactAction(row, 'phone')}
            className="btn-responsive"
          >
            <PhoneIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="section-spacing">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">🚀 Onboarding de Colegios</h1>
            <p className="page-subtitle">
              Gestiona el proceso de incorporación de nuevos colegios a la plataforma EDU21
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="btn-responsive"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Proceso
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid mb-6">
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mobile-xs font-medium text-gray-500">Procesos Activos</p>
                <p className="text-mobile-lg font-bold text-gray-900">
                  {processes.filter(p => p.stage !== 'completed').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mobile-xs font-medium text-gray-500">Completados</p>
                <p className="text-mobile-lg font-bold text-gray-900">
                  {processes.filter(p => p.stage === 'completed').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mobile-xs font-medium text-gray-500">Alta Prioridad</p>
                <p className="text-mobile-lg font-bold text-gray-900">
                  {processes.filter(p => p.priority === 'high').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XMarkIcon className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mobile-xs font-medium text-gray-500">Promedio Progreso</p>
                <p className="text-mobile-lg font-bold text-gray-900">
                  {Math.round(processes.reduce((acc, p) => acc + p.progress, 0) / processes.length)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Processes Table */}
        <div className="card-responsive">
          <ResponsiveTable
            columns={columns}
            data={processes}
            keyExtractor={(row) => row.id.toString()}
            searchable
            searchPlaceholder="Buscar por colegio o contacto..."
            sortable
            emptyMessage="No hay procesos de onboarding registrados"
          />
        </div>

        {/* Create Process Modal */}
        <FormModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Crear Nuevo Proceso de Onboarding"
          onSubmit={handleCreateProcess}
          submitText="Crear Proceso"
          size="lg"
          submitDisabled={!newProcess.schoolName || !newProcess.contactName || !newProcess.contactEmail}
        >
          <div className="form-section space-y-mobile">
            <div className="grid-responsive-1 sm:grid-cols-2 gap-mobile">
              <div>
                <label className="form-label">
                  Nombre del Colegio *
                </label>
                <input
                  type="text"
                  value={newProcess.schoolName}
                  onChange={(e) => setNewProcess({...newProcess, schoolName: e.target.value})}
                  className="input-field-mobile"
                  placeholder="Ej: Colegio San Patricio"
                />
              </div>
              
              <div>
                <label className="form-label">
                  Región
                </label>
                <select
                  value={newProcess.region}
                  onChange={(e) => setNewProcess({...newProcess, region: e.target.value})}
                  className="input-field-mobile"
                >
                  <option value="">Seleccionar región</option>
                  <option value="Metropolitana">Metropolitana</option>
                  <option value="Valparaíso">Valparaíso</option>
                  <option value="Biobío">Biobío</option>
                  <option value="Araucanía">Araucanía</option>
                  <option value="Los Lagos">Los Lagos</option>
                  <option value="Otras">Otras</option>
                </select>
              </div>
            </div>

            <div className="grid-responsive-1 sm:grid-cols-2 gap-mobile">
              <div>
                <label className="form-label">
                  Contacto Principal *
                </label>
                <input
                  type="text"
                  value={newProcess.contactName}
                  onChange={(e) => setNewProcess({...newProcess, contactName: e.target.value})}
                  className="input-field-mobile"
                  placeholder="Nombre del contacto"
                />
              </div>
              
              <div>
                <label className="form-label">
                  Cantidad de Estudiantes
                </label>
                <input
                  type="number"
                  value={newProcess.studentCount}
                  onChange={(e) => setNewProcess({...newProcess, studentCount: e.target.value})}
                  className="input-field-mobile"
                  placeholder="Ej: 450"
                />
              </div>
            </div>

            <div className="grid-responsive-1 sm:grid-cols-2 gap-mobile">
              <div>
                <label className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  value={newProcess.contactEmail}
                  onChange={(e) => setNewProcess({...newProcess, contactEmail: e.target.value})}
                  className="input-field-mobile"
                  placeholder="contacto@colegio.cl"
                />
              </div>
              
              <div>
                <label className="form-label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={newProcess.contactPhone}
                  onChange={(e) => setNewProcess({...newProcess, contactPhone: e.target.value})}
                  className="input-field-mobile"
                  placeholder="+56 9 8765 4321"
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Prioridad
              </label>
              <select
                value={newProcess.priority}
                onChange={(e) => setNewProcess({...newProcess, priority: e.target.value})}
                className="input-field-mobile"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Notas
              </label>
              <textarea
                value={newProcess.notes}
                onChange={(e) => setNewProcess({...newProcess, notes: e.target.value})}
                className="input-field-mobile"
                rows={3}
                placeholder="Información adicional sobre el proceso..."
              />
            </div>
          </div>
        </FormModal>

        {/* Process Detail Modal */}
        {selectedProcess && (
          <ResponsiveModal
            open={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false)
              setSelectedProcess(null)
            }}
            title={`Proceso de Onboarding - ${selectedProcess.schoolName}`}
            size="xl"
          >
            <div className="space-y-6">
              {/* Progress Timeline */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cronograma de Implementación</h3>
                <div className="space-y-3">
                  {[
                    { stage: 'initial', label: 'Contacto Inicial' },
                    { stage: 'documentation', label: 'Recopilación de Documentos' },
                    { stage: 'setup', label: 'Configuración Técnica' },
                    { stage: 'training', label: 'Capacitación de Usuarios' },
                    { stage: 'testing', label: 'Período de Pruebas' },
                    { stage: 'completed', label: 'Implementación Completa' }
                  ].map((item, index) => {
                    const stages: OnboardingProcess['stage'][] = ['initial', 'documentation', 'setup', 'training', 'testing', 'completed']
                    const currentIndex = stages.indexOf(selectedProcess.stage)
                    const itemIndex = stages.indexOf(item.stage as OnboardingProcess['stage'])
                    const isCompleted = itemIndex < currentIndex
                    const isCurrent = itemIndex === currentIndex
                    
                    return (
                      <div key={item.stage} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-100 text-green-600' :
                          isCurrent ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircleIcon className="w-4 h-4" />
                          ) : isCurrent ? (
                            <ClockIcon className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        <span className={`${
                          isCompleted ? 'text-green-600 font-medium' :
                          isCurrent ? 'text-blue-600 font-medium' :
                          'text-gray-400'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información de Contacto</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Contacto:</span> {selectedProcess.contactName}</p>
                    <p><span className="font-medium">Email:</span> {selectedProcess.contactEmail}</p>
                    <p><span className="font-medium">Teléfono:</span> {selectedProcess.contactPhone}</p>
                    <p><span className="font-medium">Región:</span> {selectedProcess.region}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Detalles del Proyecto</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Consultor:</span> {selectedProcess.consultant}</p>
                    <p><span className="font-medium">Inicio:</span> {new Date(selectedProcess.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Finalización:</span> {new Date(selectedProcess.estimatedCompletion).toLocaleDateString()}</p>
                    <p><span className="font-medium">Estudiantes:</span> {selectedProcess.studentCount}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notas del Proceso</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedProcess.notes}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => handleContactAction(selectedProcess, 'phone')}
                  className="btn-responsive"
                >
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleContactAction(selectedProcess, 'email')}
                  className="btn-responsive"
                >
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button
                  onClick={() => handleNextStage(selectedProcess.id)}
                  className="btn-responsive"
                  disabled={selectedProcess.stage === 'completed'}
                >
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  Avanzar Etapa
                </Button>
              </div>
            </div>
          </ResponsiveModal>
        )}
      </div>
    </DashboardLayout>
  )
}
