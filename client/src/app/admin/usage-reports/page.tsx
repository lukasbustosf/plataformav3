'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { StatsGrid } from '@/components/ui/statsGrid'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { 
  ChartBarIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  EyeIcon,
  CalendarIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  PlayIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Types
interface RoleData {
  role: string
  activeUsers: number
  totalSessions: number
  avgSessionTime: number
  lastActivity: string
  userCount: number
  count: number
  activeToday: number
  percentage: number
}

interface DeviceData {
  device: string
  percentage: number
  users: number
  sessions: number
  avgSessionTime: number
}

interface FeatureData {
  feature: string
  usage: number
  percentage: number
  users: number
  totalInteractions: number
  category: string
  avgTime: string
  bounceRate: number
}

interface PeriodData {
  period: string
  activeUsers: number
  sessions: number
  avgDuration: number
  bounceRate: number
}

interface SchoolData {
  name: string
  totalUsers: number
  activeUsers: number
  avgSession: number
  topFeature: string
  lastAccess: string
}

// Mock data for usage reports
const mockUsageData = {
  overview: {
    totalUsers: 2845,
    activeUsers: 2234,
    avgSessionTime: 28.5,
    totalSessions: 15672
  },
  usersByRole: [
    { role: 'Estudiantes', count: 2156, percentage: 75.8, activeToday: 1987 },
    { role: 'Profesores', count: 284, percentage: 10.0, activeToday: 251 },
    { role: 'Directivos', count: 58, percentage: 2.0, activeToday: 48 },
    { role: 'Apoderados', count: 347, percentage: 12.2, activeToday: 289 }
  ],
  deviceStats: [
    { device: 'Móvil', count: 1876, percentage: 65.9 },
    { device: 'Desktop', count: 634, percentage: 22.3 },
    { device: 'Tablet', count: 335, percentage: 11.8 }
  ],
  activityByHour: [
    { hour: '08:00', users: 456, sessions: 523 },
    { hour: '09:00', users: 1234, sessions: 1456 },
    { hour: '10:00', users: 1456, sessions: 1687 },
    { hour: '11:00', users: 1387, sessions: 1598 },
    { hour: '12:00', users: 987, sessions: 1123 },
    { hour: '13:00', users: 1134, sessions: 1287 },
    { hour: '14:00', users: 1298, sessions: 1445 },
    { hour: '15:00', users: 1398, sessions: 1556 },
    { hour: '16:00', users: 1156, sessions: 1334 },
    { hour: '17:00', users: 876, sessions: 987 }
  ],
  topFeatures: [
    { 
      feature: 'Dashboard Estudiante', 
      usage: 8967, 
      avgTime: '12:34', 
      bounceRate: 15.2,
      category: 'Core'
    },
    { 
      feature: 'Juegos Gamificados', 
      usage: 6543, 
      avgTime: '18:45', 
      bounceRate: 8.7,
      category: 'Evaluación'
    },
    { 
      feature: 'Libro de Clases', 
      usage: 4321, 
      avgTime: '25:12', 
      bounceRate: 12.4,
      category: 'Académico'
    },
    { 
      feature: 'Generador IA', 
      usage: 3456, 
      avgTime: '8:23', 
      bounceRate: 6.9,
      category: 'IA'
    },
    { 
      feature: 'Reportes OA', 
      usage: 2987, 
      avgTime: '15:34', 
      bounceRate: 18.3,
      category: 'Reportes'
    }
  ],
  schoolActivity: [
    {
      id: 1,
      name: 'Colegio San Patricio',
      totalUsers: 876,
      activeUsers: 734,
      avgSession: 32.5,
      lastAccess: '2025-01-21T11:30:00Z',
      topFeature: 'Juegos'
    },
    {
      id: 2,
      name: 'Instituto María Montessori',
      totalUsers: 1234,
      activeUsers: 1056,
      avgSession: 28.7,
      lastAccess: '2025-01-21T11:45:00Z',
      topFeature: 'Dashboard'
    },
    {
      id: 3,
      name: 'Liceo Técnico Industrial',
      totalUsers: 735,
      activeUsers: 444,
      avgSession: 22.1,
      lastAccess: '2025-01-21T10:15:00Z',
      topFeature: 'Evaluaciones'
    }
  ]
}

export default function AdminUsageReportsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num)
  }

  const statsData: Array<{
    id: string
    label: string
    value: string
    change: {
      value: number
      type: 'increase' | 'decrease' | 'neutral'
      period: string
    }
    icon: JSX.Element
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'gray'
  }> = [
    {
      id: 'total-users',
      label: 'Usuarios Totales',
      value: formatNumber(mockUsageData.overview.totalUsers),
      change: {
        value: 8.2,
        type: 'increase',
        period: 'semana anterior'
      },
      icon: <UserGroupIcon className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'active-users',
      label: 'Usuarios Activos',
      value: formatNumber(mockUsageData.overview.activeUsers),
      change: {
        value: 12.4,
        type: 'increase',
        period: 'últimas 24h'
      },
      icon: <GlobeAltIcon className="h-5 w-5" />,
      color: 'green'
    },
    {
      id: 'avg-session-time',
      label: 'Tiempo Promedio',
      value: formatTime(mockUsageData.overview.avgSessionTime),
      change: {
        value: 3.2,
        type: 'decrease',
        period: 'por sesión'
      },
      icon: <ClockIcon className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 'total-sessions',
      label: 'Total Sesiones',
      value: formatNumber(mockUsageData.overview.totalSessions),
      change: {
        value: 15.7,
        type: 'increase',
        period: 'esta semana'
      },
      icon: <ChartBarIcon className="h-5 w-5" />,
      color: 'indigo'
    }
  ]

  const roleColumns = [
    {
      key: 'role',
      label: 'Rol',
      mobileLabel: 'Rol',
      render: (row: RoleData) => {
        if (!row) return <div>-</div>
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <UserGroupIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.role}</div>
              <div className="text-sm text-gray-500">{row.percentage}% del total</div>
            </div>
          </div>
        )
      }
    },
    {
      key: 'count',
      label: 'Total',
      mobileLabel: 'Total',
      render: (row: RoleData) => {
        if (!row) return <div>-</div>
        return (
          <span className="font-medium text-gray-900">
            {formatNumber(row.count)}
          </span>
        )
      }
    },
    {
      key: 'active',
      label: 'Activos Hoy',
      mobileLabel: 'Activos',
      render: (row: RoleData) => {
        if (!row) return <div>-</div>
        return (
          <div>
            <span className="font-medium text-green-600">
              {formatNumber(row.activeToday)}
            </span>
            <div className="text-xs text-gray-500">
              {Math.round((row.activeToday / row.count) * 100)}% actividad
            </div>
          </div>
        )
      }
    },
    {
      key: 'progress',
      label: 'Actividad',
      mobileLabel: 'Act.',
      hiddenOnMobile: true,
      render: (row: RoleData) => {
        if (!row) return <div>-</div>
        return (
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(row.activeToday / row.count) * 100}%` }}
              />
            </div>
          </div>
        )
      }
    }
  ]

  const featureColumns = [
    {
      key: 'feature',
      label: 'Funcionalidad',
      mobileLabel: 'Feature',
      render: (row: FeatureData) => {
        if (!row) return <div>-</div>
        return (
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              row.category === 'Core' ? 'bg-blue-100' :
              row.category === 'Evaluación' ? 'bg-green-100' :
              row.category === 'IA' ? 'bg-purple-100' :
              row.category === 'Académico' ? 'bg-yellow-100' : 'bg-gray-100'
            }`}>
              {row.category === 'Evaluación' ? <PlayIcon className="w-4 h-4 text-green-600" /> :
               row.category === 'IA' ? <ComputerDesktopIcon className="w-4 h-4 text-purple-600" /> :
               row.category === 'Académico' ? <BookOpenIcon className="w-4 h-4 text-yellow-600" /> :
               <ChartBarIcon className="w-4 h-4 text-blue-600" />}
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.feature}</div>
              <div className="text-sm text-gray-500">{row.category}</div>
            </div>
          </div>
        )
      }
    },
    {
      key: 'usage',
      label: 'Uso',
      mobileLabel: 'Uso',
      render: (row: FeatureData) => {
        if (!row) return <div>-</div>
        return (
          <span className="font-medium text-gray-900">
            {formatNumber(row.usage)}
          </span>
        )
      }
    },
    {
      key: 'avgTime',
      label: 'Tiempo Prom.',
      mobileLabel: 'Tiempo',
      hiddenOnMobile: true,
      render: (row: FeatureData) => {
        if (!row) return <div>-</div>
        return (
          <span className="text-gray-700">{row.avgTime}</span>
        )
      }
    },
    {
      key: 'bounceRate',
      label: 'Rebote',
      mobileLabel: 'Rebote',
      hiddenOnMobile: true,
      render: (row: FeatureData) => {
        if (!row) return <div>-</div>
        return (
          <span className={`font-medium ${
            row.bounceRate > 15 ? 'text-red-600' : 
            row.bounceRate > 10 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {row.bounceRate}%
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: '',
      mobileLabel: 'Ver',
      render: (row: FeatureData) => {
        if (!row) return <div>-</div>
        return (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedFeature(row)
              setShowDetailsModal(true)
            }}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
        )
      }
    }
  ]

  const schoolColumns = [
    {
      key: 'school',
      label: 'Escuela',
      mobileLabel: 'Escuela',
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">
              {formatNumber(row.totalUsers)} usuarios
            </div>
          </div>
        )
      }
    },
    {
      key: 'activity',
      label: 'Actividad',
      mobileLabel: 'Actividad',
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(row.activeUsers / row.totalUsers) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {Math.round((row.activeUsers / row.totalUsers) * 100)}%
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatNumber(row.activeUsers)} / {formatNumber(row.totalUsers)} activos
            </div>
          </div>
        )
      }
    },
    {
      key: 'avgSession',
      label: 'Sesión Prom.',
      mobileLabel: 'Sesión',
      hiddenOnMobile: true,
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <span className="text-gray-700">{formatTime(row.avgSession)}</span>
        )
      }
    },
    {
      key: 'topFeature',
      label: 'Top Feature',
      mobileLabel: 'Top',
      hiddenOnMobile: true,
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {row.topFeature}
          </span>
        )
      }
    },
    {
      key: 'lastAccess',
      label: 'Último Acceso',
      mobileLabel: 'Acceso',
      hiddenOnMobile: true,
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <span className="text-sm text-gray-600">
            {new Date(row.lastAccess).toLocaleString('es-CL')}
          </span>
        )
      }
    }
  ]

  const handleExportReport = () => {
    toast.success('📊 Reporte de uso exportado correctamente')
  }

  const filteredFeatures = selectedCategory === 'all' 
    ? mockUsageData.topFeatures 
    : mockUsageData.topFeatures.filter(f => f.category === selectedCategory)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Reportes de Uso 📊</h1>
              <p className="mt-2 opacity-90 text-sm sm:text-base">
                Análisis detallado de actividad y uso del sistema
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button 
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
                onClick={handleExportReport}
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        <StatsGrid stats={statsData} />

        {/* Filters */}
        {showFilters && (
          <div className="card-responsive">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Análisis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Período</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="input-field-mobile"
                >
                  <option value="today">Hoy</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mes</option>
                  <option value="quarter">Trimestre</option>
                </select>
              </div>
              <div>
                <label className="form-label">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field-mobile"
                >
                  <option value="all">Todas</option>
                  <option value="Core">Core</option>
                  <option value="Evaluación">Evaluación</option>
                  <option value="IA">IA</option>
                  <option value="Académico">Académico</option>
                  <option value="Reportes">Reportes</option>
                </select>
              </div>
              <div>
                <label className="form-label">Vista</label>
                <select className="input-field-mobile">
                  <option value="detailed">Detallada</option>
                  <option value="summary">Resumen</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Device Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-responsive">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Uso por Dispositivo</h2>
            <div className="space-y-4">
              {mockUsageData.deviceStats.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {device.device === 'Móvil' ? <DevicePhoneMobileIcon className="w-4 h-4 text-blue-600" /> :
                       device.device === 'Desktop' ? <ComputerDesktopIcon className="w-4 h-4 text-blue-600" /> :
                       <DevicePhoneMobileIcon className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{device.device}</div>
                      <div className="text-sm text-gray-500">{formatNumber(device.count)} usuarios</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{device.percentage}%</div>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-responsive">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Actividad por Hora</h2>
            <div className="space-y-2">
              {mockUsageData.activityByHour.map((hour, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 w-12">{hour.hour}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(hour.users / 1500) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-medium text-gray-900 w-16 text-right">
                    {formatNumber(hour.users)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Users by Role */}
        <div className="card-responsive">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Usuarios por Rol</h2>
              <p className="text-sm text-gray-600">Distribución y actividad por tipo de usuario</p>
            </div>
          </div>

          <ResponsiveTable
            data={mockUsageData.usersByRole}
            columns={roleColumns}
            searchable={false}
          />
        </div>

        {/* Top Features */}
        <div className="card-responsive">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Funcionalidades Más Usadas</h2>
              <p className="text-sm text-gray-600">Ranking de features por uso y engagement</p>
            </div>
            <div className="text-sm text-gray-500">
              Mostrando {filteredFeatures.length} de {mockUsageData.topFeatures.length} funcionalidades
            </div>
          </div>

          <ResponsiveTable
            data={filteredFeatures}
            columns={featureColumns}
            searchable={true}
            emptyMessage="No hay funcionalidades para esta categoría"
          />
        </div>

        {/* School Activity */}
        <div className="card-responsive">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Actividad por Escuela</h2>
              <p className="text-sm text-gray-600">Métricas de uso individual por institución</p>
            </div>
          </div>

          <ResponsiveTable
            data={mockUsageData.schoolActivity}
            columns={schoolColumns}
            searchable={true}
            emptyMessage="No hay datos de escuelas"
          />
        </div>
      </div>

      {/* Feature Details Modal */}
      <ResponsiveModal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Análisis Detallado - ${selectedFeature?.feature}`}
        size="lg"
      >
        {selectedFeature && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="stats-card">
                <div className="text-sm text-gray-600">Uso Total</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(selectedFeature.usage)}
                </div>
                <div className="text-xs text-gray-500 mt-1">interacciones</div>
              </div>
              <div className="stats-card">
                <div className="text-sm text-gray-600">Tiempo Promedio</div>
                <div className="text-2xl font-bold text-green-600">
                  {selectedFeature.avgTime}
                </div>
                <div className="text-xs text-gray-500 mt-1">por sesión</div>
              </div>
              <div className="stats-card">
                <div className="text-sm text-gray-600">Tasa de Rebote</div>
                <div className={`text-2xl font-bold ${
                  selectedFeature.bounceRate > 15 ? 'text-red-600' : 
                  selectedFeature.bounceRate > 10 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {selectedFeature.bounceRate}%
                </div>
                <div className="text-xs text-gray-500 mt-1">abandono rápido</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Información Adicional</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium">{selectedFeature.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Popularidad:</span>
                  <span className="font-medium">
                    {mockUsageData.topFeatures.findIndex(f => f.feature === selectedFeature.feature) + 1}° lugar
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-medium ${
                    selectedFeature.bounceRate > 15 ? 'text-red-600' : 
                    selectedFeature.bounceRate > 10 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedFeature.bounceRate > 15 ? 'Requiere atención' : 
                     selectedFeature.bounceRate > 10 ? 'Puede mejorar' : 'Excelente'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Recomendaciones</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                {selectedFeature.bounceRate > 15 ? (
                  <>
                    <li>• Revisar la experiencia de usuario de esta funcionalidad</li>
                    <li>• Considerar tutoriales o ayuda contextual</li>
                    <li>• Analizar las rutas de abandono más comunes</li>
                  </>
                ) : selectedFeature.bounceRate > 10 ? (
                  <>
                    <li>• Optimizar el tiempo de carga si es necesario</li>
                    <li>• Mejorar la navegación interna</li>
                    <li>• Añadir elementos de engagement adicionales</li>
                  </>
                ) : (
                  <>
                    <li>• Mantener la calidad actual de la funcionalidad</li>
                    <li>• Considerar expandir features similares</li>
                    <li>• Usar como referencia para otras funcionalidades</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </ResponsiveModal>
    </DashboardLayout>
  )
}
