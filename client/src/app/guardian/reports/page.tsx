'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  DocumentArrowDownIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  PrinterIcon,
  ShareIcon,
  EyeIcon,
  FolderOpenIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('semester')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock data for available reports
  const reports = [
    {
      id: 1,
      title: 'Informe de Notas Semestral',
      type: 'academic',
      period: 'Segundo Semestre 2024',
      date: '2024-12-15',
      size: '2.3 MB',
      format: 'PDF',
      description: 'Consolidado de calificaciones por asignatura con análisis de rendimiento',
      signed: true,
      pages: 12,
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'Reporte de Asistencia',
      type: 'attendance',
      period: 'Diciembre 2024',
      date: '2024-12-16',
      size: '856 KB',
      format: 'PDF',
      description: 'Detalle mensual de asistencia, atrasos y justificaciones',
      signed: true,
      pages: 3,
      downloadUrl: '#'
    },
    {
      id: 3,
      title: 'Evaluación Psicopedagógica',
      type: 'psychological',
      period: 'Noviembre 2024',
      date: '2024-11-30',
      size: '4.1 MB',
      format: 'PDF',
      description: 'Evaluación completa del desarrollo cognitivo y estrategias de apoyo',
      signed: true,
      pages: 18,
      downloadUrl: '#',
      confidential: true
    },
    {
      id: 4,
      title: 'Informe de Progreso OA',
      type: 'curriculum',
      period: 'Primer Semestre 2024',
      date: '2024-07-15',
      size: '1.8 MB',
      format: 'PDF',
      description: 'Cobertura de Objetivos de Aprendizaje MINEDUC por asignatura',
      signed: true,
      pages: 8,
      downloadUrl: '#'
    },
    {
      id: 5,
      title: 'Reporte de Bienestar Socioemocional',
      type: 'wellbeing',
      period: 'Segundo Semestre 2024',
      date: '2024-12-10',
      size: '1.2 MB',
      format: 'PDF',
      description: 'Evaluación del desarrollo socioemocional y recomendaciones',
      signed: true,
      pages: 6,
      downloadUrl: '#'
    },
    {
      id: 6,
      title: 'Certificado de Promoción',
      type: 'certificate',
      period: '7° Básico 2024',
      date: '2024-12-20',
      size: '345 KB',
      format: 'PDF',
      description: 'Certificado oficial de promoción al curso siguiente',
      signed: true,
      pages: 1,
      downloadUrl: '#'
    }
  ]

  const reportStats = {
    totalReports: reports.length,
    totalSize: reports.reduce((acc, report) => {
      const size = parseFloat(report.size.split(' ')[0])
      const unit = report.size.split(' ')[1]
      return acc + (unit === 'MB' ? size : size / 1000)
    }, 0).toFixed(1),
    lastGenerated: '2024-12-16',
    signedReports: reports.filter(r => r.signed).length
  }

  const recentActivity = [
    {
      action: 'Descargado',
      report: 'Informe de Notas Semestral',
      date: '2024-12-16 14:30',
      user: 'Apoderado'
    },
    {
      action: 'Generado',
      report: 'Reporte de Asistencia',
      date: '2024-12-16 09:00',
      user: 'Sistema'
    },
    {
      action: 'Firmado',
      report: 'Evaluación Psicopedagógica',
      date: '2024-11-30 16:45',
      user: 'Prof. Ana Rodríguez'
    },
    {
      action: 'Compartido',
      report: 'Informe de Progreso OA',
      date: '2024-12-15 11:20',
      user: 'Secretaría'
    }
  ]

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'academic': return <AcademicCapIcon className="h-6 w-6 text-blue-500" />
      case 'attendance': return <ClockIcon className="h-6 w-6 text-green-500" />
      case 'psychological': return <DocumentTextIcon className="h-6 w-6 text-purple-500" />
      case 'curriculum': return <ChartBarIcon className="h-6 w-6 text-orange-500" />
      case 'wellbeing': return <DocumentTextIcon className="h-6 w-6 text-pink-500" />
      case 'certificate': return <DocumentTextIcon className="h-6 w-6 text-gray-700" />
      default: return <DocumentTextIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      academic: 'Académico',
      attendance: 'Asistencia',
      psychological: 'Psicopedagógico',
      curriculum: 'Curricular',
      wellbeing: 'Bienestar',
      certificate: 'Certificado'
    }
    return labels[type] || type
  }

  const getTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      academic: 'bg-blue-100 text-blue-800',
      attendance: 'bg-green-100 text-green-800',
      psychological: 'bg-purple-100 text-purple-800',
      curriculum: 'bg-orange-100 text-orange-800',
      wellbeing: 'bg-pink-100 text-pink-800',
      certificate: 'bg-gray-100 text-gray-800'
    }
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`
  }

  const filteredReports = selectedCategory === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedCategory)

  const handleDownload = (report: any) => {
    toast.loading(`Descargando: ${report.title}...`)
    
    setTimeout(() => {
      toast.dismiss()
      toast.success(`${report.title} descargado exitosamente`)
      
      // Simulate file download
      const element = document.createElement('a')
      element.href = 'data:application/pdf;base64,JVBERi0xLjM...'
      element.download = `${report.title.replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 2000)
  }

  const handlePreview = (report: any) => {
    toast.success(`Abriendo vista previa: ${report.title}`)
    
    // Create preview modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Vista Previa: ${report.title}</h3>
        <div class="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p class="text-sm text-gray-600">Vista previa del documento...</p>
          <p class="text-xs text-gray-500 mt-2">Tipo: ${report.type} | Fecha: ${report.date}</p>
        </div>
        <div class="flex justify-end space-x-2">
          <button onclick="this.closest('.fixed').remove()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
            Cerrar
          </button>
          <button onclick="this.closest('.fixed').remove()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Descargar
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal)
      }
    }, 15000)
  }

  const handleShare = (report: any) => {
    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: `Compartiendo reporte: ${report.title}`,
        url: window.location.href
      }).then(() => {
        toast.success(`${report.title} compartido exitosamente`)
      }).catch(() => {
        toast.error('Error al compartir')
      })
    } else {
      navigator.clipboard.writeText(`${report.title} - ${window.location.href}`).then(() => {
        toast.success('Enlace del reporte copiado al portapapeles')
      }).catch(() => {
        toast.error('Error al copiar enlace')
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Reportes y Certificados 📄</h1>
          <p className="mt-2 opacity-90">
            Accede a todos los reportes académicos, de asistencia y certificados oficiales
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Resumen de Documentos</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <FolderOpenIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{reportStats.totalReports}</div>
                <div className="text-sm text-gray-600">Total Reportes</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <DocumentArrowDownIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{reportStats.totalSize} MB</div>
                <div className="text-sm text-gray-600">Tamaño Total</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{reportStats.signedReports}</div>
                <div className="text-sm text-gray-600">Firmados</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <CalendarIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Date(reportStats.lastGenerated).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Último Generado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">Todos los Períodos</option>
                  <option value="semester">Semestre Actual</option>
                  <option value="year">Año 2024</option>
                  <option value="month">Último Mes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">Todas las Categorías</option>
                  <option value="academic">Académicos</option>
                  <option value="attendance">Asistencia</option>
                  <option value="psychological">Psicopedagógicos</option>
                  <option value="curriculum">Curriculares</option>
                  <option value="wellbeing">Bienestar</option>
                  <option value="certificate">Certificados</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success('Abriendo formulario de solicitud de reporte')
                  setTimeout(() => {
                    toast('📋 Formulario de solicitud disponible en secretaría', {
                      duration: 3000
                    })
                  }, 500)
                }}
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Solicitar Reporte
              </Button>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {getReportIcon(report.type)}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    </div>
                  </div>
                  {report.confidential && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Confidencial
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Período:</span>
                    <span className="ml-2 text-gray-900">{report.period}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Fecha:</span>
                    <span className="ml-2 text-gray-900">{new Date(report.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tamaño:</span>
                    <span className="ml-2 text-gray-900">{report.size}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Páginas:</span>
                    <span className="ml-2 text-gray-900">{report.pages}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={getTypeBadge(report.type)}>
                    {getTypeLabel(report.type)}
                  </span>
                  <div className="flex items-center space-x-2">
                    {report.signed && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Firmado
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {report.format}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between space-x-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handlePreview(report)}
                      variant="outline"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Vista Previa
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleShare(report)}
                      variant="outline"
                    >
                      <ShareIcon className="h-4 w-4 mr-1" />
                      Compartir
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(report)}
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {activity.action}: {activity.report}
                      </span>
                      <span className="text-xs text-gray-500">{activity.user}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{activity.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Request New Report */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-900">¿Necesitas un reporte específico?</h3>
              <p className="text-blue-700 mt-1">
                Puedes solicitar reportes adicionales o certificados especiales a través de secretaría académica.
                Los reportes solicitados estarán disponibles en un plazo de 2-3 días hábiles.
              </p>
              <div className="mt-3 flex space-x-3">
                <Button
                  size="sm"
                  onClick={() => {
                    toast.loading('Abriendo formulario de solicitud...')
                    setTimeout(() => {
                      toast.dismiss()
                      toast.success('Formulario de solicitud abierto')
                    }, 1500)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Solicitar Reporte Personalizado
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:secretaria@colegio.cl'}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Contactar Secretaría
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 