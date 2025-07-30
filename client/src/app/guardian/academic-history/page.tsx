'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  TrophyIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface AcademicRecord {
  semester: string
  year: number
  subjects: SubjectRecord[]
  overallGPA: number
  behavior: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement'
  attendance: number
  recognitions: string[]
  observations: string[]
}

interface SubjectRecord {
  subject: string
  teacher: string
  finalGrade: number
  grades: GradeRecord[]
  attendance: number
  behavior: string
  observations: string[]
}

interface GradeRecord {
  id: string
  title: string
  type: 'quiz_ia' | 'exam' | 'task' | 'lab' | 'presentation' | 'game' | 'participation'
  date: string
  grade: number
  maxGrade: number
  weight: number
  bloomLevel: string
  feedback: string
}

interface Certificate {
  id: string
  title: string
  type: 'academic' | 'recognition' | 'participation' | 'achievement'
  date: string
  description: string
  issuer: string
  downloadUrl: string
}

export default function GuardianAcademicHistoryPage() {
  const { user, fullName } = useAuth()
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL')
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL')
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for academic history
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    rut: '23.456.789-1',
    startDate: '2019-03-01',
    currentGPA: 6.2,
    totalSemesters: 11
  }

  const academicHistory: AcademicRecord[] = [
    {
      semester: '2° Semestre',
      year: 2024,
      overallGPA: 6.2,
      behavior: 'good',
      attendance: 94,
      recognitions: ['Mejor Estudiante del Mes - Octubre', 'Participación Destacada en Feria Científica'],
      observations: ['Estudiante responsable y participativa', 'Liderazgo positivo en trabajos grupales'],
      subjects: [
        {
          subject: 'Matemáticas',
          teacher: 'Prof. Carlos Pérez',
          finalGrade: 6.5,
          attendance: 96,
          behavior: 'Excelente participación y compromiso',
          observations: ['Destacada en resolución de problemas', 'Ayuda a compañeros con dificultades'],
          grades: [
            {
              id: 'G-001',
              title: 'Quiz IA: Álgebra Básica',
              type: 'quiz_ia',
              date: '2024-12-15',
              grade: 6.5,
              maxGrade: 7.0,
              weight: 20,
              bloomLevel: 'Aplicar',
              feedback: 'Excelente comprensión de ecuaciones lineales.'
            },
            {
              id: 'G-002',
              title: 'Examen: Geometría',
              type: 'exam',
              date: '2024-11-20',
              grade: 6.8,
              maxGrade: 7.0,
              weight: 40,
              bloomLevel: 'Analizar',
              feedback: 'Dominio sólido de conceptos geométricos.'
            }
          ]
        },
        {
          subject: 'Lenguaje',
          teacher: 'Prof. María González',
          finalGrade: 5.9,
          attendance: 92,
          behavior: 'Participación activa en discusiones',
          observations: ['Mejora continua en escritura', 'Expresión oral fluida'],
          grades: [
            {
              id: 'G-003',
              title: 'Ensayo: Literatura Contemporánea',
              type: 'task',
              date: '2024-12-14',
              grade: 5.8,
              maxGrade: 7.0,
              weight: 30,
              bloomLevel: 'Crear',
              feedback: 'Buena estructura argumentativa.'
            }
          ]
        },
        {
          subject: 'Ciencias',
          teacher: 'Prof. Ana Rodríguez',
          finalGrade: 6.3,
          attendance: 98,
          behavior: 'Curiosidad científica destacada',
          observations: ['Excelente en trabajo experimental', 'Pregunta pertinentes y reflexivas'],
          grades: [
            {
              id: 'G-004',
              title: 'Laboratorio: Reacciones Químicas',
              type: 'lab',
              date: '2024-12-13',
              grade: 6.8,
              maxGrade: 7.0,
              weight: 25,
              bloomLevel: 'Analizar',
              feedback: 'Procedimiento correcto y conclusiones acertadas.'
            }
          ]
        }
      ]
    },
    {
      semester: '1° Semestre',
      year: 2024,
      overallGPA: 6.0,
      behavior: 'good',
      attendance: 91,
      recognitions: ['Estudiante Destacada en Ciencias'],
      observations: ['Adaptación exitosa al nuevo nivel', 'Desarrollo de habilidades de estudio'],
      subjects: [
        {
          subject: 'Matemáticas',
          teacher: 'Prof. Carlos Pérez',
          finalGrade: 5.8,
          attendance: 89,
          behavior: 'Esfuerzo consistente',
          observations: ['Progreso gradual en conceptos abstractos'],
          grades: []
        },
        {
          subject: 'Lenguaje',
          teacher: 'Prof. María González',
          finalGrade: 6.1,
          attendance: 94,
          behavior: 'Participación activa',
          observations: ['Buena comprensión lectora'],
          grades: []
        },
        {
          subject: 'Ciencias',
          teacher: 'Prof. Ana Rodríguez',
          finalGrade: 6.4,
          attendance: 92,
          behavior: 'Excelente',
          observations: ['Interés genuino por la experimentación'],
          grades: []
        }
      ]
    }
  ]

  const certificates: Certificate[] = [
    {
      id: 'CERT-001',
      title: 'Concentración de Notas 7° Básico - 2° Semestre 2024',
      type: 'academic',
      date: '2024-12-20',
      description: 'Certificado oficial de notas del segundo semestre 2024',
      issuer: 'Secretaría Académica',
      downloadUrl: '/certificates/notas-2024-s2.pdf'
    },
    {
      id: 'CERT-002',
      title: 'Reconocimiento: Mejor Estudiante del Mes',
      type: 'recognition',
      date: '2024-10-31',
      description: 'Reconocimiento por destacado desempeño académico y conductual durante octubre 2024',
      issuer: 'Dirección Académica',
      downloadUrl: '/certificates/estudiante-mes-oct-2024.pdf'
    },
    {
      id: 'CERT-003',
      title: 'Participación en Feria Científica 2024',
      type: 'participation',
      date: '2024-09-15',
      description: 'Certificado de participación en Feria Científica Escolar con proyecto "Energías Renovables"',
      issuer: 'Departamento de Ciencias',
      downloadUrl: '/certificates/feria-cientifica-2024.pdf'
    },
    {
      id: 'CERT-004',
      title: 'Logro: Excelencia en Asistencia',
      type: 'achievement',
      date: '2024-07-30',
      description: 'Reconocimiento por mantener 95% de asistencia durante primer semestre 2024',
      issuer: 'Inspectoría General',
      downloadUrl: '/certificates/excelencia-asistencia-2024-s1.pdf'
    }
  ]

  const availableYears = [2024, 2023, 2022, 2021, 2020, 2019]
  const availableSemesters = ['ALL', '1° Semestre', '2° Semestre']

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case 'excellent':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'satisfactory':
        return 'bg-yellow-100 text-yellow-800'
      case 'needs_improvement':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBehaviorText = (behavior: string) => {
    switch (behavior) {
      case 'excellent':
        return 'Excelente'
      case 'good':
        return 'Bueno'
      case 'satisfactory':
        return 'Satisfactorio'
      case 'needs_improvement':
        return 'Necesita Mejorar'
      default:
        return behavior
    }
  }

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />
      case 'recognition':
        return <TrophyIcon className="h-5 w-5 text-yellow-600" />
      case 'participation':
        return <StarIcon className="h-5 w-5 text-purple-600" />
      case 'achievement':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const handleExportHistory = async () => {
    toast.loading('Generando historial académico completo...')
    setTimeout(() => {
      toast.dismiss()
      toast.success('Historial académico descargado exitosamente')
    }, 2000)
  }

  const handleCertificateDownload = (certificate: Certificate) => {
    toast.success(`Descargando: ${certificate.title}`)
  }

  const filteredHistory = academicHistory.filter(record => {
    if (selectedYear && record.year !== selectedYear) return false
    if (selectedSemester !== 'ALL' && record.semester !== selectedSemester) return false
    return true
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-content">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid-responsive-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Historial Académico</h1>
            <p className="page-subtitle">
              Registro completo del rendimiento académico de {childInfo.name}
            </p>
          </div>
          <Button
            onClick={handleExportHistory}
            className="btn-secondary btn-responsive"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Exportar Historial
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid-responsive-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio Actual</p>
                <p className="text-2xl font-bold text-gray-900">{childInfo.currentGPA}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrophyIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Años de Estudio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date().getFullYear() - new Date(childInfo.startDate).getFullYear() + 1}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Semestres Cursados</p>
                <p className="text-2xl font-bold text-gray-900">{childInfo.totalSemesters}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificados</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input-field-mobile"
            >
              <option value="">Todos los años</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="input-field-mobile"
            >
              {availableSemesters.map(semester => (
                <option key={semester} value={semester}>
                  {semester === 'ALL' ? 'Todos los semestres' : semester}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Academic Records */}
        <div className="space-y-8 mb-8">
          {filteredHistory.map((record, index) => (
            <div key={`${record.year}-${record.semester}`} className="card">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {record.semester} {record.year}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Promedio: {record.overallGPA} | Asistencia: {record.attendance}%
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getBehaviorColor(record.behavior)}`}>
                      {getBehaviorText(record.behavior)}
                    </span>
                    <Button
                      onClick={() => setShowDetails(showDetails === `${record.year}-${record.semester}` ? null : `${record.year}-${record.semester}`)}
                      className="btn-secondary"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      {showDetails === `${record.year}-${record.semester}` ? 'Ocultar' : 'Ver'} Detalles
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Subjects Overview */}
                <div className="grid-responsive-3 gap-4 mb-6">
                  {record.subjects.map((subject) => (
                    <div key={subject.subject} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                        <span className={`text-lg font-bold ${getGradeColor(subject.finalGrade, 7)}`}>
                          {subject.finalGrade}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{subject.teacher}</p>
                      <p className="text-sm text-gray-500">Asistencia: {subject.attendance}%</p>
                    </div>
                  ))}
                </div>

                {/* Recognitions */}
                {record.recognitions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
                      Reconocimientos
                    </h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-1">
                        {record.recognitions.map((recognition, idx) => (
                          <li key={idx} className="text-sm text-yellow-800">{recognition}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Detailed View */}
                {showDetails === `${record.year}-${record.semester}` && (
                  <div className="space-y-6">
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Detalle por Asignatura</h4>
                      <div className="space-y-6">
                        {record.subjects.map((subject) => (
                          <div key={subject.subject} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h5 className="font-semibold text-gray-900">{subject.subject}</h5>
                                <p className="text-sm text-gray-600">{subject.teacher}</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-2xl font-bold ${getGradeColor(subject.finalGrade, 7)}`}>
                                  {subject.finalGrade}
                                </p>
                                <p className="text-sm text-gray-500">Nota Final</p>
                              </div>
                            </div>

                            {subject.grades.length > 0 && (
                              <div className="mb-4">
                                <h6 className="font-medium text-gray-700 mb-2">Evaluaciones:</h6>
                                <div className="space-y-2">
                                  {subject.grades.map((grade) => (
                                    <div key={grade.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{grade.title}</p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(grade.date).toLocaleDateString()} | {grade.bloomLevel}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className={`font-semibold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                                          {grade.grade}/{grade.maxGrade}
                                        </p>
                                        <p className="text-xs text-gray-500">{grade.weight}%</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="border-t border-gray-200 pt-3">
                              <p className="text-sm text-gray-600">
                                <strong>Comportamiento:</strong> {subject.behavior}
                              </p>
                              {subject.observations.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">Observaciones:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                    {subject.observations.map((obs, idx) => (
                                      <li key={idx}>{obs}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* General Observations */}
                    {record.observations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Observaciones Generales</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <ul className="list-disc list-inside space-y-1">
                            {record.observations.map((observation, idx) => (
                              <li key={idx} className="text-sm text-blue-800">{observation}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Certificates */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Certificados y Documentos</h3>
            <p className="text-sm text-gray-600 mt-1">
              Documentos oficiales y certificados de reconocimiento
            </p>
          </div>
          <div className="p-6">
            <div className="grid-responsive-2 gap-4">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getCertificateIcon(certificate.type)}
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{certificate.title}</h4>
                        <p className="text-xs text-gray-500">{certificate.issuer}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(certificate.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{certificate.description}</p>
                  
                  <Button
                    onClick={() => handleCertificateDownload(certificate)}
                    className="btn-secondary btn-responsive w-full"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}