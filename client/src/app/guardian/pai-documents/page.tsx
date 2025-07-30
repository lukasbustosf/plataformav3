'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { 
  DocumentTextIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  FolderIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PAIDocument {
  id: string
  title: string
  type: 'assessment' | 'plan' | 'report' | 'agreement' | 'intervention' | 'evaluation'
  category: 'academic' | 'behavioral' | 'emotional' | 'social' | 'family'
  createdDate: string
  modifiedDate: string
  author: string
  authorRole: string
  status: 'draft' | 'pending_review' | 'approved' | 'signed' | 'archived'
  confidentiality: 'guardian_access' | 'restricted' | 'professional_only'
  fileSize: string
  pages: number
  signatures: {
    professional: boolean
    guardian: boolean
    student?: boolean
  }
  description: string
  paiCaseId: string
  downloadUrl?: string
}

interface DocumentFolder {
  id: string
  name: string
  type: 'case' | 'year' | 'category'
  documentCount: number
  lastModified: string
  isExpanded: boolean
}

export default function GuardianPAIDocumentsPage() {
  const { user, fullName } = useAuth()
  const [selectedDocument, setSelectedDocument] = useState<PAIDocument | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Mock data for child info
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    rut: '23.456.789-1'
  }

  const documentFolders: DocumentFolder[] = [
    {
      id: 'all',
      name: 'Todos los Documentos',
      type: 'case',
      documentCount: 12,
      lastModified: '2024-12-19',
      isExpanded: true
    },
    {
      id: 'pai-001',
      name: 'Plan Apoyo Socioemocional',
      type: 'case',
      documentCount: 8,
      lastModified: '2024-12-18',
      isExpanded: false
    },
    {
      id: 'pai-002', 
      name: 'Habilidades Sociales',
      type: 'case',
      documentCount: 6,
      lastModified: '2024-12-17',
      isExpanded: false
    },
    {
      id: 'year-2024',
      name: 'Documentos 2024',
      type: 'year',
      documentCount: 15,
      lastModified: '2024-12-19',
      isExpanded: false
    }
  ]

  const paiDocuments: PAIDocument[] = [
    {
      id: 'doc-001',
      title: 'Plan de Apoyo Individual - Socioemocional',
      type: 'plan',
      category: 'emotional',
      createdDate: '2024-10-15',
      modifiedDate: '2024-12-18',
      author: 'Psic. Ana López',
      authorRole: 'Psicóloga Escolar',
      status: 'signed',
      confidentiality: 'guardian_access',
      fileSize: '2.4 MB',
      pages: 12,
      signatures: {
        professional: true,
        guardian: true,
        student: false
      },
      description: 'Plan integral de apoyo socioemocional con objetivos, estrategias y cronograma de intervenciones.',
      paiCaseId: 'PAI-001',
      downloadUrl: '/api/documents/pai-001-plan.pdf'
    },
    {
      id: 'doc-002',
      title: 'Evaluación Inicial Psicológica',
      type: 'assessment',
      category: 'emotional',
      createdDate: '2024-10-10',
      modifiedDate: '2024-10-10',
      author: 'Psic. Ana López',
      authorRole: 'Psicóloga Escolar',
      status: 'approved',
      confidentiality: 'guardian_access',
      fileSize: '1.8 MB',
      pages: 8,
      signatures: {
        professional: true,
        guardian: false
      },
      description: 'Evaluación comprensiva del estado socioemocional y necesidades de apoyo identificadas.',
      paiCaseId: 'PAI-001',
      downloadUrl: '/api/documents/evaluation-inicial.pdf'
    },
    {
      id: 'doc-003',
      title: 'Reporte de Progreso - Noviembre 2024',
      type: 'report',
      category: 'emotional',
      createdDate: '2024-11-30',
      modifiedDate: '2024-12-01',
      author: 'Psic. Ana López',
      authorRole: 'Psicóloga Escolar',
      status: 'approved',
      confidentiality: 'guardian_access',
      fileSize: '1.2 MB',
      pages: 6,
      signatures: {
        professional: true,
        guardian: false
      },
      description: 'Reporte mensual de avances, logros alcanzados y ajustes al plan de intervención.',
      paiCaseId: 'PAI-001',
      downloadUrl: '/api/documents/reporte-nov-2024.pdf'
    },
    {
      id: 'doc-004',
      title: 'Acuerdo de Colaboración Familia-Escuela',
      type: 'agreement',
      category: 'family',
      createdDate: '2024-10-20',
      modifiedDate: '2024-10-22',
      author: 'Equipo Bienestar',
      authorRole: 'Coordinación',
      status: 'signed',
      confidentiality: 'guardian_access',
      fileSize: '0.8 MB',
      pages: 4,
      signatures: {
        professional: true,
        guardian: true
      },
      description: 'Acuerdo de colaboración que establece roles y responsabilidades de familia y escuela.',
      paiCaseId: 'PAI-001',
      downloadUrl: '/api/documents/acuerdo-colaboracion.pdf'
    },
    {
      id: 'doc-005',
      title: 'Informe de Intervención Grupal',
      type: 'intervention',
      category: 'social',
      createdDate: '2024-12-15',
      modifiedDate: '2024-12-15',
      author: 'T.S. María Torres',
      authorRole: 'Trabajadora Social',
      status: 'pending_review',
      confidentiality: 'guardian_access',
      fileSize: '1.5 MB',
      pages: 7,
      signatures: {
        professional: true,
        guardian: false
      },
      description: 'Informe de participación en sesiones grupales de habilidades sociales.',
      paiCaseId: 'PAI-002',
      downloadUrl: '/api/documents/intervencion-grupal.pdf'
    },
    {
      id: 'doc-006',
      title: 'Evaluación Semestral - Diciembre 2024',
      type: 'evaluation',
      category: 'emotional',
      createdDate: '2024-12-18',
      modifiedDate: '2024-12-18',
      author: 'Psic. Ana López',
      authorRole: 'Psicóloga Escolar',
      status: 'draft',
      confidentiality: 'guardian_access',
      fileSize: '2.1 MB',
      pages: 10,
      signatures: {
        professional: false,
        guardian: false
      },
      description: 'Evaluación integral de logros semestrales y planificación para el próximo período.',
      paiCaseId: 'PAI-001'
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const filteredDocuments = paiDocuments.filter(doc => {
    const matchesFolder = selectedFolder === 'all' || doc.paiCaseId === selectedFolder
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFolder && matchesSearch
  })

  const handleViewDocument = (document: PAIDocument) => {
    if (document.confidentiality === 'professional_only') {
      toast.error('Este documento tiene acceso restringido')
      return
    }
    setSelectedDocument(document)
    setShowDocumentModal(true)
  }

  const handleDownloadDocument = async (document: PAIDocument) => {
    if (!document.downloadUrl) {
      toast.error('Documento no disponible para descarga')
      return
    }

    try {
      toast.success(`Descargando ${document.title}...`)
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Documento descargado exitosamente')
    } catch (error) {
      toast.error('Error al descargar documento')
    }
  }

  const handleRequestSignature = (documentId: string) => {
    toast.success('Solicitud de firma enviada. Recibirás un email con instrucciones.')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'text-green-700 bg-green-100'
      case 'approved': return 'text-blue-700 bg-blue-100'
      case 'pending_review': return 'text-yellow-700 bg-yellow-100'
      case 'draft': return 'text-gray-700 bg-gray-100'
      case 'archived': return 'text-purple-700 bg-purple-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'plan': return <DocumentTextIcon className="h-5 w-5 text-blue-600" />
      case 'assessment': return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'report': return <DocumentTextIcon className="h-5 w-5 text-purple-600" />
      case 'agreement': return <DocumentTextIcon className="h-5 w-5 text-orange-600" />
      case 'intervention': return <UserGroupIcon className="h-5 w-5 text-teal-600" />
      case 'evaluation': return <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
      default: return <DocumentTextIcon className="h-5 w-5 text-gray-600" />
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
              <h1 className="text-2xl font-bold text-gray-900">Documentos PAI</h1>
              <p className="text-gray-600 mt-2">
                Documentos del Plan de Apoyo Individual para {childInfo.name}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <DocumentArrowDownIcon className="h-4 w-4" />
                Descargar Todo
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {documentFolders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name} ({folder.documentCount})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Document Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Documentos</p>
                <p className="text-2xl font-semibold text-gray-900">{paiDocuments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Firmados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {paiDocuments.filter(d => d.status === 'signed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {paiDocuments.filter(d => d.status === 'pending_review' || d.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <LockClosedIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Restringidos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {paiDocuments.filter(d => d.confidentiality === 'professional_only').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Documentos ({filteredDocuments.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(document.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{document.title}</h3>
                      <p className="text-gray-600 mt-1 text-sm">{document.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{document.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(document.createdDate).toLocaleDateString('es-CL')}</span>
                        </div>
                        <span>{document.fileSize} • {document.pages} páginas</span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                          {document.status === 'signed' ? 'Firmado' :
                           document.status === 'approved' ? 'Aprobado' :
                           document.status === 'pending_review' ? 'En Revisión' :
                           document.status === 'draft' ? 'Borrador' : 'Archivado'}
                        </span>
                        
                        {document.confidentiality === 'restricted' && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                            Acceso Limitado
                          </span>
                        )}
                        
                        {document.confidentiality === 'professional_only' && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                            <LockClosedIcon className="h-3 w-3" />
                            Solo Profesionales
                          </span>
                        )}
                      </div>

                      {/* Signature Status */}
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className={`flex items-center gap-1 ${document.signatures.professional ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Profesional</span>
                        </div>
                        <div className={`flex items-center gap-1 ${document.signatures.guardian ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Apoderado</span>
                        </div>
                        {document.signatures.student !== undefined && (
                          <div className={`flex items-center gap-1 ${document.signatures.student ? 'text-green-600' : 'text-gray-400'}`}>
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Estudiante</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 ml-4">
                    <Button
                      onClick={() => handleViewDocument(document)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      disabled={document.confidentiality === 'professional_only'}
                    >
                      <EyeIcon className="h-4 w-4" />
                      Ver
                    </Button>
                    <Button
                      onClick={() => handleDownloadDocument(document)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                      disabled={!document.downloadUrl || document.confidentiality === 'professional_only'}
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      Descargar
                    </Button>
                    {!document.signatures.guardian && document.status !== 'draft' && (
                      <Button
                        onClick={() => handleRequestSignature(document.id)}
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        Firmar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document View Modal */}
        <ResponsiveModal
          open={showDocumentModal}
          onClose={() => {
            setShowDocumentModal(false)
            setSelectedDocument(null)
          }}
          title={selectedDocument?.title || ''}
        >
          {selectedDocument && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Autor:</span>
                    <p className="text-gray-900">{selectedDocument.author}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Fecha:</span>
                    <p className="text-gray-900">{new Date(selectedDocument.createdDate).toLocaleDateString('es-CL')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tamaño:</span>
                    <p className="text-gray-900">{selectedDocument.fileSize}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Páginas:</span>
                    <p className="text-gray-900">{selectedDocument.pages}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700">{selectedDocument.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Estado de Firmas</h3>
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 ${selectedDocument.signatures.professional ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Firmado por profesional</span>
                  </div>
                  <div className={`flex items-center gap-2 ${selectedDocument.signatures.guardian ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Firmado por apoderado</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  disabled={!selectedDocument.downloadUrl}
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  Descargar
                </Button>
                <Button
                  onClick={() => setShowDocumentModal(false)}
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