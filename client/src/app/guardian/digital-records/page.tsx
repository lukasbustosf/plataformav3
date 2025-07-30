'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { 
  DocumentTextIcon,
  HeartIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  FolderIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface DigitalRecord {
  id: string
  title: string
  type: 'medical' | 'academic' | 'behavioral' | 'psychological' | 'administrative'
  category: string
  date: string
  provider: string
  providerType: string
  status: 'active' | 'completed' | 'pending' | 'archived'
  confidentiality: 'full_access' | 'summary_only' | 'restricted'
  fileSize: string
  description: string
  tags: string[]
  lastAccessed?: string
  downloadUrl?: string
}

interface RecordSummary {
  type: string
  count: number
  lastUpdate: string
  icon: JSX.Element
  color: string
}

export default function GuardianDigitalRecordsPage() {
  const { user, fullName } = useAuth()
  const [selectedRecord, setSelectedRecord] = useState<DigitalRecord | null>(null)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Mock data for child info
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    rut: '23.456.789-1',
    studentId: 'EST-2024-0123'
  }

  const digitalRecords: DigitalRecord[] = [
    {
      id: 'rec-001',
      title: 'Ficha Médica Escolar 2024',
      type: 'medical',
      category: 'Salud General',
      date: '2024-03-01',
      provider: 'Enf. Roberto Silva',
      providerType: 'Enfermería Escolar',
      status: 'active',
      confidentiality: 'full_access',
      fileSize: '1.2 MB',
      description: 'Ficha médica anual con información de salud, alergias, medicamentos y contactos de emergencia.',
      tags: ['salud', 'emergencia', 'alergias'],
      lastAccessed: '2024-12-15',
      downloadUrl: '/api/records/medical-2024.pdf'
    },
    {
      id: 'rec-002',
      title: 'Evaluación Psicológica Integral',
      type: 'psychological',
      category: 'Bienestar Emocional',
      date: '2024-10-15',
      provider: 'Psic. Ana López',
      providerType: 'Psicología Escolar',
      status: 'completed',
      confidentiality: 'summary_only',
      fileSize: '3.8 MB',
      description: 'Evaluación comprensiva del desarrollo socioemocional y recomendaciones de apoyo.',
      tags: ['psicología', 'evaluación', 'desarrollo'],
      lastAccessed: '2024-12-10',
      downloadUrl: '/api/records/psych-eval-2024.pdf'
    },
    {
      id: 'rec-003',
      title: 'Registro Académico Semestre 2',
      type: 'academic',
      category: 'Rendimiento Académico',
      date: '2024-12-18',
      provider: 'Sistema Académico',
      providerType: 'Plataforma Educativa',
      status: 'active',
      confidentiality: 'full_access',
      fileSize: '2.1 MB',
      description: 'Registro completo de calificaciones, asistencia y observaciones del segundo semestre.',
      tags: ['notas', 'asistencia', 'semestre'],
      lastAccessed: '2024-12-18',
      downloadUrl: '/api/records/academic-s2-2024.pdf'
    },
    {
      id: 'rec-004',
      title: 'Plan de Apoyo Individual (PAI)',
      type: 'behavioral',
      category: 'Intervención Especializada',
      date: '2024-10-20',
      provider: 'Equipo Bienestar',
      providerType: 'Equipo Multidisciplinario',
      status: 'active',
      confidentiality: 'full_access',
      fileSize: '4.5 MB',
      description: 'Plan detallado de apoyo socioemocional con objetivos, estrategias e indicadores de progreso.',
      tags: ['PAI', 'apoyo', 'bienestar'],
      lastAccessed: '2024-12-17',
      downloadUrl: '/api/records/pai-plan-2024.pdf'
    },
    {
      id: 'rec-005',
      title: 'Certificado de Matrícula 2024',
      type: 'administrative',
      category: 'Documentación Oficial',
      date: '2024-03-01',
      provider: 'Secretaría Académica',
      providerType: 'Administración',
      status: 'active',
      confidentiality: 'full_access',
      fileSize: '0.5 MB',
      description: 'Certificado oficial de matrícula para el año escolar 2024.',
      tags: ['matrícula', 'certificado', 'oficial'],
      downloadUrl: '/api/records/certificate-2024.pdf'
    },
    {
      id: 'rec-006',
      title: 'Evaluación Fonoaudiológica',
      type: 'medical',
      category: 'Evaluación Especializada',
      date: '2024-08-15',
      provider: 'Fga. Carmen Morales',
      providerType: 'Fonoaudiología Externa',
      status: 'completed',
      confidentiality: 'summary_only',
      fileSize: '2.8 MB',
      description: 'Evaluación del desarrollo del lenguaje y recomendaciones terapéuticas.',
      tags: ['fonoaudiología', 'lenguaje', 'terapia'],
      lastAccessed: '2024-11-20',
      downloadUrl: '/api/records/speech-eval-2024.pdf'
    },
    {
      id: 'rec-007',
      title: 'Informe de Incidente - Octubre 2024',
      type: 'behavioral',
      category: 'Registro Conductual',
      date: '2024-10-08',
      provider: 'Inspectoría General',
      providerType: 'Convivencia Escolar',
      status: 'completed',
      confidentiality: 'restricted',
      fileSize: '0.8 MB',
      description: 'Registro de incidente menor y medidas aplicadas.',
      tags: ['convivencia', 'incidente', 'conductual']
    }
  ]

  const recordSummaries: RecordSummary[] = [
    {
      type: 'medical',
      count: digitalRecords.filter(r => r.type === 'medical').length,
      lastUpdate: '2024-12-15',
      icon: <HeartIcon className="h-6 w-6 text-red-600" />,
      color: 'red'
    },
    {
      type: 'academic',
      count: digitalRecords.filter(r => r.type === 'academic').length,
      lastUpdate: '2024-12-18',
      icon: <AcademicCapIcon className="h-6 w-6 text-blue-600" />,
      color: 'blue'
    },
    {
      type: 'psychological',
      count: digitalRecords.filter(r => r.type === 'psychological').length,
      lastUpdate: '2024-12-10',
      icon: <HeartIcon className="h-6 w-6 text-purple-600" />,
      color: 'purple'
    },
    {
      type: 'behavioral',
      count: digitalRecords.filter(r => r.type === 'behavioral').length,
      lastUpdate: '2024-12-17',
      icon: <ClipboardDocumentListIcon className="h-6 w-6 text-green-600" />,
      color: 'green'
    },
    {
      type: 'administrative',
      count: digitalRecords.filter(r => r.type === 'administrative').length,
      lastUpdate: '2024-03-01',
      icon: <DocumentTextIcon className="h-6 w-6 text-gray-600" />,
      color: 'gray'
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const filteredRecords = digitalRecords.filter(record => {
    const matchesType = filterType === 'all' || record.type === filterType
    const matchesSearch = searchQuery === '' || 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesType && matchesSearch
  })

  const handleViewRecord = (record: DigitalRecord) => {
    if (record.confidentiality === 'restricted') {
      toast.error('Este registro tiene acceso restringido. Contacta al establecimiento para más información.')
      return
    }
    setSelectedRecord(record)
    setShowRecordModal(true)
  }

  const handleDownloadRecord = async (record: DigitalRecord) => {
    if (!record.downloadUrl) {
      toast.error('Registro no disponible para descarga')
      return
    }

    if (record.confidentiality === 'restricted') {
      toast.error('Acceso restringido. Contacta al establecimiento.')
      return
    }

    try {
      toast.success(`Descargando ${record.title}...`)
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Registro descargado exitosamente')
    } catch (error) {
      toast.error('Error al descargar registro')
    }
  }

  const handleRequestAccess = (recordId: string) => {
    toast.success('Solicitud de acceso enviada. Serás notificado cuando esté disponible.')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100'
      case 'completed': return 'text-blue-700 bg-blue-100'
      case 'pending': return 'text-yellow-700 bg-yellow-100'
      case 'archived': return 'text-gray-700 bg-gray-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getConfidentialityBadge = (confidentiality: string) => {
    switch (confidentiality) {
      case 'full_access':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Acceso Completo</span>
      case 'summary_only':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Solo Resumen</span>
      case 'restricted':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 flex items-center gap-1">
            <LockClosedIcon className="h-3 w-3" />
            Restringido
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registros Digitales</h1>
              <p className="text-gray-600 mt-2">
                Acceso a los registros digitales de {childInfo.name} - ID: {childInfo.studentId}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <DocumentArrowDownIcon className="h-4 w-4" />
                Exportar Portafolio
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar registros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los registros</option>
                <option value="medical">Médicos</option>
                <option value="academic">Académicos</option>
                <option value="psychological">Psicológicos</option>
                <option value="behavioral">Conductuales</option>
                <option value="administrative">Administrativos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Record Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recordSummaries.map((summary) => (
            <div key={summary.type} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {summary.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 capitalize">
                    {summary.type === 'medical' ? 'Médicos' :
                     summary.type === 'academic' ? 'Académicos' :
                     summary.type === 'psychological' ? 'Psicológicos' :
                     summary.type === 'behavioral' ? 'Conductuales' : 'Administrativos'}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">{summary.count}</p>
                  <p className="text-xs text-gray-500">
                    Último: {new Date(summary.lastUpdate).toLocaleDateString('es-CL')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Records List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Registros ({filteredRecords.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      <FolderIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{record.title}</h3>
                        <div className="flex flex-wrap gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                            {record.status === 'active' ? 'Activo' :
                             record.status === 'completed' ? 'Completado' :
                             record.status === 'pending' ? 'Pendiente' : 'Archivado'}
                          </span>
                          {getConfidentialityBadge(record.confidentiality)}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{record.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{record.provider}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(record.date).toLocaleDateString('es-CL')}</span>
                        </div>
                        <span>{record.fileSize}</span>
                        {record.lastAccessed && (
                          <span>Último acceso: {new Date(record.lastAccessed).toLocaleDateString('es-CL')}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {record.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 ml-4">
                    <Button
                      onClick={() => handleViewRecord(record)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Ver
                    </Button>
                    {record.downloadUrl && record.confidentiality !== 'restricted' ? (
                      <Button
                        onClick={() => handleDownloadRecord(record)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                        Descargar
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRequestAccess(record.id)}
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        Solicitar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Record View Modal */}
        <ResponsiveModal
          open={showRecordModal}
          onClose={() => {
            setShowRecordModal(false)
            setSelectedRecord(null)
          }}
          title={selectedRecord?.title || ''}
        >
          {selectedRecord && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Tipo:</span>
                    <p className="text-gray-900 capitalize">{selectedRecord.type}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Categoría:</span>
                    <p className="text-gray-900">{selectedRecord.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Fecha:</span>
                    <p className="text-gray-900">{new Date(selectedRecord.date).toLocaleDateString('es-CL')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Proveedor:</span>
                    <p className="text-gray-900">{selectedRecord.provider}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado:</span>
                    <p className="text-gray-900 capitalize">{selectedRecord.status}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tamaño:</span>
                    <p className="text-gray-900">{selectedRecord.fileSize}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700">{selectedRecord.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {selectedRecord.downloadUrl && (
                  <Button
                    onClick={() => handleDownloadRecord(selectedRecord)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    Descargar
                  </Button>
                )}
                <Button
                  onClick={() => setShowRecordModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </ResponsiveModal>
      </div>
    </DashboardLayout>
  )
} 