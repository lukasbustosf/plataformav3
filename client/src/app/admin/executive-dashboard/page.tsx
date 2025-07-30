'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  DocumentChartBarIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AcademicCapIcon,
  CpuChipIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface KPI {
  name: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease'
  period: string
  icon: any
  color: string
}

interface SchoolPerformance {
  school_name: string
  students: number
  active_users: number
  ai_usage: number
  satisfaction: number
  revenue: number
  growth: number
}

export default function AdminExecutiveDashboardPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('month')

  const executiveKPIs: KPI[] = [
    {
      name: 'Ingresos Totales',
      value: '$2.4M',
      change: 12.5,
      changeType: 'increase',
      period: 'vs mes anterior',
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    {
      name: 'Escuelas Activas',
      value: 15,
      change: 2,
      changeType: 'increase',
      period: 'nuevas este mes',
      icon: BuildingOfficeIcon,
      color: 'blue'
    },
    {
      name: 'Usuarios Totales',
      value: '8,247',
      change: 8.3,
      changeType: 'increase',
      period: 'vs mes anterior',
      icon: UsersIcon,
      color: 'purple'
    },
    {
      name: 'Uso de IA',
      value: '125K',
      change: 15.2,
      changeType: 'increase',
      period: 'consultas este mes',
      icon: CpuChipIcon,
      color: 'indigo'
    },
    {
      name: 'Satisfacción',
      value: '4.8/5',
      change: 0.2,
      changeType: 'increase',
      period: 'promedio escuelas',
      icon: AcademicCapIcon,
      color: 'yellow'
    },
    {
      name: 'Uptime',
      value: '99.9%',
      change: 0.1,
      changeType: 'increase',
      period: 'últimos 30 días',
      icon: CheckCircleIcon,
      color: 'green'
    }
  ]

  const schoolPerformance: SchoolPerformance[] = [
    {
      school_name: 'Colegio San Antonio',
      students: 487,
      active_users: 456,
      ai_usage: 89,
      satisfaction: 4.9,
      revenue: 450000,
      growth: 12.5
    },
    {
      school_name: 'Instituto Metropolitano',
      students: 723,
      active_users: 698,
      ai_usage: 94,
      satisfaction: 4.7,
      revenue: 720000,
      growth: 8.3
    },
    {
      school_name: 'Escuela Los Andes',
      students: 298,
      active_users: 287,
      ai_usage: 76,
      satisfaction: 4.6,
      revenue: 280000,
      growth: 15.2
    },
    {
      school_name: 'Colegio Bilingüe International',
      students: 445,
      active_users: 421,
      ai_usage: 91,
      satisfaction: 4.8,
      revenue: 580000,
      growth: 6.7
    },
    {
      school_name: 'Escuela Rural La Esperanza',
      students: 156,
      active_users: 142,
      ai_usage: 68,
      satisfaction: 4.5,
      revenue: 180000,
      growth: 22.1
    }
  ]

  const monthlyData = [
    { month: 'Ene', revenue: 1800000, users: 6200, schools: 12 },
    { month: 'Feb', revenue: 1950000, users: 6800, schools: 13 },
    { month: 'Mar', revenue: 2100000, users: 7200, schools: 14 },
    { month: 'Abr', revenue: 2250000, users: 7600, schools: 14 },
    { month: 'May', revenue: 2350000, users: 7900, schools: 15 },
    { month: 'Jun', revenue: 2400000, users: 8247, schools: 15 }
  ]

  const getKPIColor = (color: string) => {
    const colors = {
      green: 'bg-green-50 border-green-200',
      blue: 'bg-blue-50 border-blue-200',
      purple: 'bg-purple-50 border-purple-200',
      indigo: 'bg-indigo-50 border-indigo-200',
      yellow: 'bg-yellow-50 border-yellow-200'
    }
    return colors[color as keyof typeof colors] || 'bg-gray-50 border-gray-200'
  }

  const getIconColor = (color: string) => {
    const colors = {
      green: 'text-green-600 bg-green-100',
      blue: 'text-blue-600 bg-blue-100',
      purple: 'text-purple-600 bg-purple-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      yellow: 'text-yellow-600 bg-yellow-100'
    }
    return colors[color as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  }

  const handleExportReport = () => {
    toast.loading('Generando reporte ejecutivo...')
    setTimeout(() => {
      toast.dismiss()
      toast.success('Reporte ejecutivo descargado correctamente')
    }, 2500)
  }

  const handleScheduleReport = () => {
    toast.success('Configurando envío automático de reportes...')
  }

  const totalRevenue = schoolPerformance.reduce((sum, school) => sum + school.revenue, 0)
  const avgSatisfaction = schoolPerformance.reduce((sum, school) => sum + school.satisfaction, 0) / schoolPerformance.length
  const totalStudents = schoolPerformance.reduce((sum, school) => sum + school.students, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Ejecutivo 📊</h1>
              <p className="mt-2 opacity-90">
                Métricas clave y KPIs para la toma de decisiones estratégicas
              </p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último año</option>
              </select>
              <Button
                onClick={handleScheduleReport}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Programar
              </Button>
              <Button
                onClick={handleExportReport}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {executiveKPIs.map((kpi) => {
            const IconComponent = kpi.icon
            return (
              <div key={kpi.name} className={`bg-white rounded-lg shadow border-l-4 ${getKPIColor(kpi.color)} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(kpi.color)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">{kpi.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center ${kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.changeType === 'increase' ? (
                        <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                      )}
                      <span className="text-sm font-medium">
                        {kpi.changeType === 'increase' ? '+' : '-'}{Math.abs(kpi.change)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{kpi.period}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Revenue and Growth Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Evolución de Ingresos y Usuarios</h2>
            <p className="text-sm text-gray-500">Crecimiento mensual de la plataforma</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart Placeholder */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Ingresos Mensuales (CLP)</h3>
                <div className="h-64 bg-gradient-to-t from-blue-50 to-blue-100 rounded-lg flex items-end justify-center p-4">
                  <div className="flex items-end space-x-2 h-full w-full">
                    {monthlyData.map((data, index) => (
                      <div key={data.month} className="flex-1 flex flex-col items-center">
                        <div 
                          className="bg-blue-500 rounded-t w-full mb-2"
                          style={{ height: `${(data.revenue / 2500000) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-600">{data.month}</span>
                        <span className="text-xs font-medium">${(data.revenue / 1000000).toFixed(1)}M</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Users Chart Placeholder */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Usuarios Activos</h3>
                <div className="h-64 bg-gradient-to-t from-green-50 to-green-100 rounded-lg flex items-end justify-center p-4">
                  <div className="flex items-end space-x-2 h-full w-full">
                    {monthlyData.map((data, index) => (
                      <div key={data.month} className="flex-1 flex flex-col items-center">
                        <div 
                          className="bg-green-500 rounded-t w-full mb-2"
                          style={{ height: `${(data.users / 9000) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-600">{data.month}</span>
                        <span className="text-xs font-medium">{(data.users / 1000).toFixed(1)}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Performance Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Rendimiento por Escuela</h2>
                <p className="text-sm text-gray-500">Métricas clave de cada institución</p>
              </div>
              <Button
                onClick={() => toast.success('Abriendo análisis detallado...')}
                className="text-sm"
              >
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Análisis Detallado
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Escuela
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuarios Activos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso IA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satisfacción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crecimiento
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schoolPerformance.map((school, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{school.school_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{school.students.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{school.active_users}</div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${(school.active_users / school.students) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((school.active_users / school.students) * 100)}% adopción
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900 mr-2">{school.ai_usage}%</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              school.ai_usage >= 90 ? 'bg-green-500' :
                              school.ai_usage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${school.ai_usage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{school.satisfaction.toFixed(1)}/5</span>
                        <div className="ml-2 flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-3 h-3 ${star <= school.satisfaction ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${school.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">CLP/mes</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center ${school.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {school.growth > 0 ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">
                          {school.growth > 0 ? '+' : ''}{school.growth.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">CLP mensuales</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Estudiantes Totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
                <p className="text-xs text-gray-500">en {schoolPerformance.length} escuelas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Satisfacción Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{avgSatisfaction.toFixed(1)}/5</p>
                <p className="text-xs text-gray-500">todas las escuelas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
