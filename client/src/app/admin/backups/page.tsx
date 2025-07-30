'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CogIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  ServerIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  PlayIcon,
  StopIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Backup {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  status: 'completed' | 'running' | 'failed' | 'scheduled'
  size: string
  duration: string
  createdAt: string
  expiresAt: string
  location: 'local' | 'cloud' | 'external'
  checksum: string
}

interface BackupSchedule {
  id: string
  name: string
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  type: 'full' | 'incremental'
  enabled: boolean
  lastRun: string
  nextRun: string
}

export default function AdminBackupsPage() {
  const { user } = useAuth()
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [activeTab, setActiveTab] = useState('backups')

  const [backups] = useState<Backup[]>([
    {
      id: 'BKP-001',
      name: 'Backup Completo - Enero 2024',
      type: 'full',
      status: 'completed',
      size: '2.4 GB',
      duration: '45 min',
      createdAt: '2024-01-19T02:00:00Z',
      expiresAt: '2024-07-19T02:00:00Z',
      location: 'cloud',
      checksum: 'sha256:abc123...'
    },
    {
      id: 'BKP-002',
      name: 'Backup Incremental - Datos del Día',
      type: 'incremental',
      status: 'completed',
      size: '145 MB',
      duration: '8 min',
      createdAt: '2024-01-19T06:00:00Z',
      expiresAt: '2024-02-19T06:00:00Z',
      location: 'local',
      checksum: 'sha256:def456...'
    },
    {
      id: 'BKP-003',
      name: 'Backup Semanal - Base de Datos',
      type: 'differential',
      status: 'running',
      size: '---',
      duration: '15 min (estimado)',
      createdAt: '2024-01-19T10:30:00Z',
      expiresAt: '2024-04-19T10:30:00Z',
      location: 'cloud',
      checksum: '---'
    },
    {
      id: 'BKP-004',
      name: 'Backup de Emergencia',
      type: 'full',
      status: 'failed',
      size: '---',
      duration: '--- (falló)',
      createdAt: '2024-01-18T22:00:00Z',
      expiresAt: '---',
      location: 'external',
      checksum: '---'
    },
    {
      id: 'BKP-005',
      name: 'Backup Programado - Noche',
      type: 'incremental',
      status: 'scheduled',
      size: '--- (pendiente)',
      duration: '--- (estimado: 12 min)',
      createdAt: '2024-01-20T02:00:00Z',
      expiresAt: '2024-03-20T02:00:00Z',
      location: 'cloud',
      checksum: '---'
    }
  ])

  const [schedules] = useState<BackupSchedule[]>([
    {
      id: 'SCH-001',
      name: 'Backup Diario Incremental',
      frequency: 'daily',
      time: '02:00',
      type: 'incremental',
      enabled: true,
      lastRun: '2024-01-19T02:00:00Z',
      nextRun: '2024-01-20T02:00:00Z'
    },
    {
      id: 'SCH-002',
      name: 'Backup Semanal Completo',
      frequency: 'weekly',
      time: '01:00',
      type: 'full',
      enabled: true,
      lastRun: '2024-01-14T01:00:00Z',
      nextRun: '2024-01-21T01:00:00Z'
    },
    {
      id: 'SCH-003',
      name: 'Backup Mensual de Archivo',
      frequency: 'monthly',
      time: '00:00',
      type: 'full',
      enabled: false,
      lastRun: '2024-01-01T00:00:00Z',
      nextRun: '2024-02-01T00:00:00Z'
    }
  ])

  const getTypeInfo = (type: string) => {
    const types = {
      full: { label: 'Completo', color: 'bg-blue-100 text-blue-800', icon: ArchiveBoxIcon },
      incremental: { label: 'Incremental', color: 'bg-green-100 text-green-800', icon: DocumentDuplicateIcon },
      differential: { label: 'Diferencial', color: 'bg-purple-100 text-purple-800', icon: FolderIcon }
    }
    return types[type as keyof typeof types] || types.full
  }

  const getStatusInfo = (status: string) => {
    const statuses = {
      completed: { label: 'Completado', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      running: { label: 'Ejecutándose', color: 'bg-blue-100 text-blue-800', icon: ArrowPathIcon },
      failed: { label: 'Falló', color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
      scheduled: { label: 'Programado', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon }
    }
    return statuses[status as keyof typeof statuses] || statuses.scheduled
  }

  const getLocationInfo = (location: string) => {
    const locations = {
      local: { label: 'Local', color: 'bg-gray-100 text-gray-800', icon: ServerIcon },
      cloud: { label: 'Nube', color: 'bg-blue-100 text-blue-800', icon: CloudArrowUpIcon },
      external: { label: 'Externo', color: 'bg-purple-100 text-purple-800', icon: CloudArrowDownIcon }
    }
    return locations[location as keyof typeof locations] || locations.local
  }

  const handleCreateBackup = () => {
    toast.success('Iniciando backup manual...')
  }

  const handleRestoreBackup = (backupId: string) => {
    toast.success(`Iniciando restauración desde backup ${backupId}`)
  }

  const handleDeleteBackup = (backupId: string) => {
    toast.success(`Backup ${backupId} eliminado`)
  }

  const handleToggleSchedule = (scheduleId: string, enabled: boolean) => {
    toast.success(`Programación ${scheduleId} ${enabled ? 'habilitada' : 'deshabilitada'}`)
  }

  const stats = {
    totalBackups: backups.length,
    totalSize: '2.8 GB',
    lastBackup: '2 horas',
    successRate: 92
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión de Backups</h1>
              <p className="mt-2 opacity-90">
                Sistema de copias de seguridad y recuperación de datos
              </p>
            </div>
            <Button 
              onClick={handleCreateBackup}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <PlayIcon className="w-4 h-4 mr-2" />
              Backup Manual
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArchiveBoxIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Backups</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBackups}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tamaño Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalSize}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Último Backup</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.lastBackup}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('backups')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'backups'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ArchiveBoxIcon className="h-5 w-5 inline mr-2" />
                Backups Existentes
              </button>
              <button
                onClick={() => setActiveTab('schedules')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedules'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CalendarDaysIcon className="h-5 w-5 inline mr-2" />
                Programaciones
              </button>
            </nav>
          </div>

          {/* Backups Tab */}
          {activeTab === 'backups' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Backups Disponibles</h2>
                <div className="flex space-x-3">
                  <Button size="sm" variant="outline">
                    <CloudArrowDownIcon className="w-4 h-4 mr-2" />
                    Descargar Todos
                  </Button>
                  <Button size="sm">
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Nuevo Backup
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {backups.map((backup) => {
                  const typeInfo = getTypeInfo(backup.type)
                  const statusInfo = getStatusInfo(backup.status)
                  const locationInfo = getLocationInfo(backup.location)
                  const TypeIcon = typeInfo.icon
                  const StatusIcon = statusInfo.icon
                  const LocationIcon = locationInfo.icon
                  
                  return (
                    <div key={backup.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">{backup.name}</h3>
                              <span className="text-sm font-mono text-gray-500">#{backup.id}</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                                {typeInfo.label}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${locationInfo.color}`}>
                                <LocationIcon className="w-3 h-3 mr-1" />
                                {locationInfo.label}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Tamaño</p>
                                <p className="font-medium">{backup.size}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Duración</p>
                                <p className="font-medium">{backup.duration}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Creado</p>
                                <p className="font-medium">{new Date(backup.createdAt).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Expira</p>
                                <p className="font-medium">
                                  {backup.expiresAt !== '---' ? new Date(backup.expiresAt).toLocaleDateString() : '---'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedBackup(backup)}
                          >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          {backup.status === 'completed' && (
                            <Button 
                              size="sm"
                              onClick={() => handleRestoreBackup(backup.id)}
                            >
                              <ArrowPathIcon className="w-4 h-4 mr-1" />
                              Restaurar
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteBackup(backup.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Schedules Tab */}
          {activeTab === 'schedules' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Programaciones de Backup</h2>
                <Button 
                  size="sm"
                  onClick={() => setShowScheduleModal(true)}
                >
                  <CalendarDaysIcon className="w-4 h-4 mr-2" />
                  Nueva Programación
                </Button>
              </div>
              
              <div className="space-y-4">
                {schedules.map((schedule) => {
                  const typeInfo = getTypeInfo(schedule.type)
                  const TypeIcon = typeInfo.icon
                  
                  return (
                    <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">{schedule.name}</h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                schedule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {schedule.enabled ? 'Activo' : 'Inactivo'}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                                {typeInfo.label}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Frecuencia</p>
                                <p className="font-medium capitalize">{schedule.frequency}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Hora</p>
                                <p className="font-medium">{schedule.time}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Última Ejecución</p>
                                <p className="font-medium">{new Date(schedule.lastRun).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Próxima Ejecución</p>
                                <p className="font-medium">{new Date(schedule.nextRun).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleSchedule(schedule.id, !schedule.enabled)}
                          >
                            {schedule.enabled ? (
                              <>
                                <StopIcon className="w-4 h-4 mr-1" />
                                Pausar
                              </>
                            ) : (
                              <>
                                <PlayIcon className="w-4 h-4 mr-1" />
                                Activar
                              </>
                            )}
                          </Button>
                          <Button size="sm">
                            <CogIcon className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Backup Details Modal */}
        {selectedBackup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles del Backup - {selectedBackup.name}
                </h3>
                <button
                  onClick={() => setSelectedBackup(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Información General</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">ID:</span> {selectedBackup.id}</p>
                      <p><span className="font-medium">Tipo:</span> {getTypeInfo(selectedBackup.type).label}</p>
                      <p><span className="font-medium">Estado:</span> {getStatusInfo(selectedBackup.status).label}</p>
                      <p><span className="font-medium">Tamaño:</span> {selectedBackup.size}</p>
                      <p><span className="font-medium">Ubicación:</span> {getLocationInfo(selectedBackup.location).label}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Fechas</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Creado:</span> {new Date(selectedBackup.createdAt).toLocaleString()}</p>
                      <p><span className="font-medium">Duración:</span> {selectedBackup.duration}</p>
                      <p><span className="font-medium">Expira:</span> {selectedBackup.expiresAt !== '---' ? new Date(selectedBackup.expiresAt).toLocaleString() : 'No expira'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Integridad</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Checksum:</span> {selectedBackup.checksum}
                    </p>
                    {selectedBackup.status === 'completed' && (
                      <div className="mt-2 flex items-center text-green-600">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm">Verificación de integridad exitosa</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setSelectedBackup(null)}>
                  Cerrar
                </Button>
                {selectedBackup.status === 'completed' && (
                  <Button onClick={() => {
                    handleRestoreBackup(selectedBackup.id)
                    setSelectedBackup(null)
                  }}>
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Restaurar
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full m-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Nueva Programación de Backup</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" className="input w-full" placeholder="Ej: Backup Diario de Producción" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo</label>
                      <select className="input w-full">
                        <option value="incremental">Incremental</option>
                        <option value="full">Completo</option>
                        <option value="differential">Diferencial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
                      <select className="input w-full">
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hora de Ejecución</label>
                    <input type="time" className="input w-full" defaultValue="02:00" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ubicación de Destino</label>
                    <select className="input w-full">
                      <option value="cloud">Almacenamiento en la Nube</option>
                      <option value="local">Almacenamiento Local</option>
                      <option value="external">Almacenamiento Externo</option>
                    </select>
                  </div>
                </form>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  toast.success('Programación de backup creada exitosamente')
                  setShowScheduleModal(false)
                }}>
                  Crear Programación
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
