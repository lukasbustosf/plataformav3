'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  ExclamationTriangleIcon, 
  ShieldExclamationIcon,
  UsersIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export default function BienestarRiskStudentsPage() {
  const { user, fullName } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedRiskType, setSelectedRiskType] = useState('all')

  // Mock data for risk students - in real app this would come from API
  const riskStudents = [
    {
      id: 1,
      name: 'María Fernanda González',
      grade: '7° Básico A',
      riskLevel: 'high',
      riskTypes: ['academic', 'attendance'],
      lastIncident: '2024-12-18',
      daysAtRisk: 15,
      guardian: 'Carmen González',
      guardianPhone: '+56 9 8765 4321',
      guardianEmail: 'carmen.gonzalez@email.com',
      teacher: 'Prof. Ana López',
      avgGrade: 4.2,
      attendanceRate: 75.5,
      behaviorScore: 6.8,
      interventions: 2,
      lastIntervention: '2024-12-15',
      notes: 'Problemas familiares recientes. Separación de padres.',
      alerts: [
        'Ausente 3 días consecutivos',
        'Rendimiento bajó 15% últimas semanas',
        'Reportes de tristeza de compañeros'
      ]
    },
    {
      id: 2,
      name: 'Carlos Eduardo Mendoza',
      grade: '2° Medio B',
      riskLevel: 'high',
      riskTypes: ['behavior', 'social'],
      lastIncident: '2024-12-19',
      daysAtRisk: 8,
      guardian: 'Roberto Mendoza',
      guardianPhone: '+56 9 7654 3210',
      guardianEmail: 'r.mendoza@email.com',
      teacher: 'Prof. Carlos Ruiz',
      avgGrade: 5.8,
      attendanceRate: 88.2,
      behaviorScore: 4.1,
      interventions: 3,
      lastIntervention: '2024-12-17',
      notes: 'Agresividad en recreos. Posible bullying hacia otros.',
      alerts: [
        'Incidente físico con compañero',
        'Múltiples reportes de agresividad',
        'Familia solicita reunión urgente'
      ]
    },
    {
      id: 3,
      name: 'Ana Sofía Herrera',
      grade: '5° Básico',
      riskLevel: 'medium',
      riskTypes: ['academic', 'social'],
      lastIncident: '2024-12-16',
      daysAtRisk: 22,
      guardian: 'Laura Herrera',
      guardianPhone: '+56 9 6543 2109',
      guardianEmail: 'laura.herrera@email.com',
      teacher: 'Prof. María Torres',
      avgGrade: 4.8,
      attendanceRate: 92.1,
      behaviorScore: 6.2,
      interventions: 1,
      lastIntervention: '2024-12-10',
      notes: 'Dificultades de aprendizaje. Requiere apoyo adicional.',
      alerts: [
        'Bajo rendimiento en matemáticas',
        'Aislamiento social en recreos',
        'Autoestima baja reportada por profesora'
      ]
    },
    {
      id: 4,
      name: 'Diego Alejandro Silva',
      grade: '8° Básico A',
      riskLevel: 'medium',
      riskTypes: ['attendance', 'behavior'],
      lastIncident: '2024-12-17',
      daysAtRisk: 12,
      guardian: 'Patricia Silva',
      guardianPhone: '+56 9 5432 1098',
      guardianEmail: 'patricia.silva@email.com',
      teacher: 'Prof. Luis Morales',
      avgGrade: 5.2,
      attendanceRate: 82.3,
      behaviorScore: 5.5,
      interventions: 1,
      lastIntervention: '2024-12-12',
      notes: 'Faltas recurrentes los lunes. Posible trabajo infantil.',
      alerts: [
        'Patrón de ausencias los lunes',
        'Llega cansado y con sueño',
        'Menciona trabajo en feria'
      ]
    },
    {
      id: 5,
      name: 'Valentina Paz Rodríguez',
      grade: '1° Medio A',
      riskLevel: 'low',
      riskTypes: ['social'],
      lastIncident: '2024-12-14',
      daysAtRisk: 5,
      guardian: 'Carmen Rodríguez',
      guardianPhone: '+56 9 4321 0987',
      guardianEmail: 'carmen.rodriguez@email.com',
      teacher: 'Prof. Andrea Vega',
      avgGrade: 6.1,
      attendanceRate: 94.8,
      behaviorScore: 7.2,
      interventions: 0,
      lastIntervention: null,
      notes: 'Ansiedad social. Dificultad para hacer amigos.',
      alerts: [
        'Almuerza sola frecuentemente',
        'Evita participar en grupos',
        'Expresó sentirse sola'
      ]
    }
  ]

  const riskStats = {
    total: riskStudents.length,
    high: riskStudents.filter(s => s.riskLevel === 'high').length,
    medium: riskStudents.filter(s => s.riskLevel === 'medium').length,
    low: riskStudents.filter(s => s.riskLevel === 'low').length,
    newThisWeek: 2,
    activeInterventions: riskStudents.filter(s => s.interventions > 0).length,
    resolved: 3
  }

  const riskCategories = {
    academic: riskStudents.filter(s => s.riskTypes.includes('academic')).length,
    attendance: riskStudents.filter(s => s.riskTypes.includes('attendance')).length,
    behavior: riskStudents.filter(s => s.riskTypes.includes('behavior')).length,
    social: riskStudents.filter(s => s.riskTypes.includes('social')).length,
    family: riskStudents.filter(s => s.riskTypes.includes('family')).length
  }

  const grades = Array.from(new Set(riskStudents.map(s => s.grade))).sort()

  const filteredStudents = riskStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.guardian.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRiskLevel = selectedRiskLevel === 'all' || student.riskLevel === selectedRiskLevel
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade
    const matchesRiskType = selectedRiskType === 'all' || student.riskTypes.includes(selectedRiskType)
    
    return matchesSearch && matchesRiskLevel && matchesGrade && matchesRiskType
  })

  const getRiskLevelDisplay = (level: string) => {
    switch(level) {
      case 'high': return { text: 'Alto', class: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon }
      case 'medium': return { text: 'Medio', class: 'bg-yellow-100 text-yellow-800', icon: ShieldExclamationIcon }
      case 'low': return { text: 'Bajo', class: 'bg-blue-100 text-blue-800', icon: HeartIcon }
      default: return { text: level, class: 'bg-gray-100 text-gray-800', icon: HeartIcon }
    }
  }

  const getRiskTypeDisplay = (type: string) => {
    switch(type) {
      case 'academic': return 'Académico'
      case 'attendance': return 'Asistencia'
      case 'behavior': return 'Conductual'
      case 'social': return 'Social'
      case 'family': return 'Familiar'
      default: return type
    }
  }

  const handleViewStudent = (studentId: number) => {
    console.log('Viewing student:', studentId)
  }

  const handleCreateIntervention = (studentId: number) => {
    console.log('Creating intervention for student:', studentId)
  }

  const handleContactGuardian = (studentId: number) => {
    console.log('Contacting guardian for student:', studentId)
  }

  const handleExportReport = () => {
    console.log('Exporting risk students report...')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Estudiantes en Riesgo ⚠️</h1>
          <p className="mt-2 opacity-90">
            Monitoreo y seguimiento de estudiantes que requieren atención especial.
          </p>
        </div>

        {/* Risk Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Riesgo Alto</p>
                <p className="text-2xl font-bold text-gray-900">{riskStats.high}</p>
                <p className="text-xs text-red-600">Requiere atención inmediata</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ShieldExclamationIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Riesgo Medio</p>
                <p className="text-2xl font-bold text-gray-900">{riskStats.medium}</p>
                <p className="text-xs text-yellow-600">Seguimiento activo</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <HeartIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Intervenciones</p>
                <p className="text-2xl font-bold text-gray-900">{riskStats.activeInterventions}</p>
                <p className="text-xs text-green-600">Activas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{riskStats.total}</p>
                <p className="text-xs text-blue-600">En seguimiento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Categories */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Categorías de Riesgo</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(riskCategories).map(([category, count]) => (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-sm text-gray-600">{getRiskTypeDisplay(category)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar estudiantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Risk Level Filter */}
              <select
                value={selectedRiskLevel}
                onChange={(e) => setSelectedRiskLevel(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="all">Todos los niveles</option>
                <option value="high">Riesgo Alto</option>
                <option value="medium">Riesgo Medio</option>
                <option value="low">Riesgo Bajo</option>
              </select>

              {/* Grade Filter */}
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="all">Todos los cursos</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>

              {/* Risk Type Filter */}
              <select
                value={selectedRiskType}
                onChange={(e) => setSelectedRiskType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="all">Todos los tipos</option>
                <option value="academic">Académico</option>
                <option value="attendance">Asistencia</option>
                <option value="behavior">Conductual</option>
                <option value="social">Social</option>
                <option value="family">Familiar</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReport}
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Estudiantes en Seguimiento ({filteredStudents.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => {
              const riskInfo = getRiskLevelDisplay(student.riskLevel)
              const RiskIcon = riskInfo.icon
              return (
                <div key={student.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <RiskIcon className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.grade} • Prof. {student.teacher}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskInfo.class}`}>
                          {riskInfo.text}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900">Datos Académicos</h4>
                          <div className="text-sm text-gray-600">
                            <div>Promedio: {student.avgGrade}</div>
                            <div>Asistencia: {student.attendanceRate}%</div>
                            <div>Comportamiento: {student.behaviorScore}/10</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900">Información Familiar</h4>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center">
                              <UserGroupIcon className="h-4 w-4 mr-1" />
                              {student.guardian}
                            </div>
                            <div className="flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              {student.guardianPhone}
                            </div>
                            <div className="flex items-center truncate">
                              <EnvelopeIcon className="h-4 w-4 mr-1" />
                              {student.guardianEmail}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900">Estado del Caso</h4>
                          <div className="text-sm text-gray-600">
                            <div>En riesgo: {student.daysAtRisk} días</div>
                            <div>Intervenciones: {student.interventions}</div>
                            <div>Último incidente: {student.lastIncident}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Tipos de Riesgo</h4>
                        <div className="flex flex-wrap gap-2">
                          {student.riskTypes.map((type) => (
                            <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {getRiskTypeDisplay(type)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Alertas Actuales</h4>
                        <div className="space-y-1">
                          {student.alerts.map((alert, index) => (
                            <div key={index} className="flex items-center text-sm text-red-600">
                              <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                              {alert}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Notas</h4>
                        <p className="text-sm text-gray-600">{student.notes}</p>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewStudent(student.id)}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Ver Detalle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateIntervention(student.id)}
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Nueva Intervención
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactGuardian(student.id)}
                        >
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          Contactar Apoderado
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <DocumentTextIcon className="h-6 w-6" />
                <span>Reporte Semanal</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <ChartBarIcon className="h-6 w-6" />
                <span>Estadísticas</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <UsersIcon className="h-6 w-6" />
                <span>Reunión Equipo</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <PlusIcon className="h-6 w-6" />
                <span>Nuevo Caso</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 