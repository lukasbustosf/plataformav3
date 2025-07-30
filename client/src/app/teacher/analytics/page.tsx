'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChartBarIcon,
  EyeIcon,
  UserIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  PlayIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BoltIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as TimeIcon,
  DocumentTextIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  BeakerIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

// Enhanced mock data with trends and detailed metrics
const mockStats = {
  totalStudents: 128,
  totalClasses: 6,
  activeQuizzes: 15,
  averageScore: 84.2,
  completedActivities: 342,
  studentsOnline: 89,
  monthlyTrend: {
    students: { current: 128, previous: 124, change: 3.2 },
    averageScore: { current: 84.2, previous: 81.7, change: 3.1 },
    activities: { current: 342, previous: 298, change: 14.8 },
    engagement: { current: 89.4, previous: 86.1, change: 3.8 }
  },
  bloomStats: {
    remembering: { percentage: 92.5, trend: 2.1, activities: 45 },
    understanding: { percentage: 87.3, trend: 1.8, activities: 38 },
    applying: { percentage: 82.7, trend: 3.2, activities: 31 },
    analyzing: { percentage: 76.4, trend: 4.1, activities: 24 },
    evaluating: { percentage: 69.8, trend: 2.9, activities: 18 },
    creating: { percentage: 63.2, trend: 1.5, activities: 12 }
  },
  weeklyActivity: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    data: [45, 52, 48, 61, 55, 23, 12],
    scores: [82, 85, 83, 87, 84, 81, 79]
  },
  topPerformers: [
    { id: 1, name: 'María González', score: 96.8, improvement: 4.2, activities: 28 },
    { id: 2, name: 'Juan Pérez', score: 94.5, improvement: 2.8, activities: 26 },
    { id: 3, name: 'Ana Silva', score: 93.2, improvement: 5.1, activities: 25 }
  ],
  needsAttention: [
    { id: 4, name: 'Carlos López', score: 67.3, improvement: -1.2, activities: 12 },
    { id: 5, name: 'Elena Rojas', score: 69.8, improvement: 0.5, activities: 14 },
    { id: 6, name: 'Pedro Martinez', score: 71.2, improvement: -0.8, activities: 13 }
  ]
}

const bloomLevels = [
  { key: 'remembering', label: 'Recordar', icon: BookOpenIcon, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
  { key: 'understanding', label: 'Comprender', icon: LightBulbIcon, color: 'green', gradient: 'from-green-500 to-green-600' },
  { key: 'applying', label: 'Aplicar', icon: PuzzlePieceIcon, color: 'yellow', gradient: 'from-yellow-500 to-yellow-600' },
  { key: 'analyzing', label: 'Analizar', icon: BeakerIcon, color: 'purple', gradient: 'from-purple-500 to-purple-600' },
  { key: 'evaluating', label: 'Evaluar', icon: EyeIcon, color: 'orange', gradient: 'from-orange-500 to-orange-600' },
  { key: 'creating', label: 'Crear', icon: SparklesIcon, color: 'red', gradient: 'from-red-500 to-red-600' }
]

export default function TeacherAnalyticsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedClass, setSelectedClass] = useState('all')
  const [animateCharts, setAnimateCharts] = useState(false)
  const [selectedView, setSelectedView] = useState<'overview' | 'bloom' | 'students'>('overview')

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCharts(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const StatCard = ({ title, value, change, icon: Icon, trend, subtitle }: {
    title: string
    value: string | number
    change: number
    icon: any
    trend?: 'up' | 'down' | 'stable'
    subtitle?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
          </div>
        <div className="flex items-center space-x-1">
          {change > 0 ? (
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
          ) : change < 0 ? (
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
          ) : null}
          <span className={`text-sm font-medium ${
            change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
            </div>

            <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
            </div>
    </motion.div>
  )

  const BloomChart = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Taxonomía de Bloom</h2>
        <Button variant="outline" size="sm">
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          Detalles
        </Button>
        </div>

      <div className="space-y-4">
        {bloomLevels.map((level, index) => {
          const stats = mockStats.bloomStats[level.key as keyof typeof mockStats.bloomStats]
          const IconComponent = level.icon
          
          return (
            <motion.div
              key={level.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${level.gradient} flex items-center justify-center`}>
                <IconComponent className="h-5 w-5 text-white" />
        </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{level.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{stats.percentage}%</span>
                    <span className={`text-xs ${stats.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.trend > 0 ? '+' : ''}{stats.trend}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${level.gradient}`}
                      initial={{ width: 0 }}
                      animate={{ width: animateCharts ? `${stats.percentage}%` : '0%' }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{stats.activities} act.</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )

  const WeeklyActivityChart = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Actividad Semanal</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Actividades</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Promedio</span>
          </div>
            </div>
          </div>

      <div className="relative">
        <div className="flex items-end justify-between h-64 space-x-2">
          {mockStats.weeklyActivity.labels.map((day, index) => {
            const activity = mockStats.weeklyActivity.data[index]
            const score = mockStats.weeklyActivity.scores[index]
            const maxActivity = Math.max(...mockStats.weeklyActivity.data)
            const maxScore = Math.max(...mockStats.weeklyActivity.scores)
                
                return (
              <div key={day} className="flex-1 flex flex-col items-center space-y-2">
                <div className="w-full flex flex-col items-center space-y-1">
                  {/* Activity bar */}
                  <motion.div
                    className="w-6 bg-blue-500 rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: animateCharts ? `${(activity / maxActivity) * 120}px` : '0px' }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                  
                  {/* Score bar */}
                  <motion.div
                    className="w-4 bg-green-500 rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: animateCharts ? `${(score / maxScore) * 80}px` : '0px' }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  />
                      </div>
                
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-900">{activity}</div>
                  <div className="text-xs text-gray-500">{day}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
    </motion.div>
  )

  const StudentPerformanceTable = ({ title, students, type }: {
    title: string
    students: any[]
    type: 'top' | 'attention'
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Button variant="outline" size="sm">
          <EyeIcon className="h-4 w-4 mr-2" />
          Ver todos
        </Button>
          </div>

      <ResponsiveTable
        columns={[
          {
            key: 'name',
            label: 'Estudiante',
            render: (name: string, row: any) => (
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  type === 'top' ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {name.charAt(0)}
                </div>
                <span className="font-medium text-gray-900">{name}</span>
              </div>
            )
          },
          {
            key: 'score',
            label: 'Promedio',
            render: (score: number) => (
              <span className={`font-semibold ${
                score >= 85 ? 'text-green-600' : score >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score.toFixed(1)}%
              </span>
            )
          },
          {
            key: 'improvement',
            label: 'Tendencia',
            render: (improvement: number) => (
              <div className="flex items-center space-x-1">
                {improvement > 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  improvement > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                </span>
            </div>
            )
          },
          {
            key: 'activities',
            label: 'Actividades',
            hiddenOnMobile: true,
            render: (activities: number) => (
              <span className="text-gray-600">{activities}</span>
            )
          }
        ]}
        data={students}
      />
    </motion.div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Analíticas del Aula 📊
            </h1>
            <p className="text-gray-600 mt-1">
              Seguimiento detallado del progreso y rendimiento de tus estudiantes
            </p>
        </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="quarter">Este trimestre</option>
            </select>
            
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las clases</option>
              <option value="5a">5°A - Matemáticas</option>
              <option value="5b">5°B - Matemáticas</option>
              <option value="6a">6°A - Ciencias</option>
            </select>
          </div>
        </motion.div>

        {/* View Mode Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow border border-gray-200 p-1"
        >
          <div className="flex space-x-1">
            {[
              { key: 'overview', label: 'Resumen', icon: ChartBarIcon },
              { key: 'bloom', label: 'Bloom', icon: LightBulbIcon },
              { key: 'students', label: 'Estudiantes', icon: UserIcon }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedView(tab.key as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedView === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Stats */}
        {selectedView === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatCard
              title="Total Estudiantes"
              value={mockStats.totalStudents}
              change={mockStats.monthlyTrend.students.change}
              icon={UserIcon}
              subtitle="activos este mes"
            />
            <StatCard
              title="Promedio General"
              value={`${mockStats.averageScore}%`}
              change={mockStats.monthlyTrend.averageScore.change}
              icon={AcademicCapIcon}
              subtitle="en todas las actividades"
            />
            <StatCard
              title="Actividades Completadas"
              value={mockStats.completedActivities}
              change={mockStats.monthlyTrend.activities.change}
              icon={CheckCircleIcon}
              subtitle="este mes"
            />
            <StatCard
              title="Engagement"
              value={`${mockStats.monthlyTrend.engagement.current}%`}
              change={mockStats.monthlyTrend.engagement.change}
              icon={BoltIcon}
              subtitle="participación activa"
            />
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(selectedView === 'overview' || selectedView === 'bloom') && <BloomChart />}
          {(selectedView === 'overview' || selectedView === 'students') && <WeeklyActivityChart />}
        </div>

        {/* Student Performance Tables */}
        {(selectedView === 'overview' || selectedView === 'students') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudentPerformanceTable
              title="Mejores Desempeños 🏆"
              students={mockStats.topPerformers}
              type="top"
            />
            <StudentPerformanceTable
              title="Necesitan Atención ⚠️"
              students={mockStats.needsAttention}
              type="attention"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 