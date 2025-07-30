'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { 
  BeakerIcon, 
  PlusIcon, 
  PlayIcon, 
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  DocumentTextIcon,
  HeartIcon,
  FolderIcon,
  CameraIcon,
  SparklesIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsGrid } from '@/components/ui/statsGrid'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { formatDate } from '@/lib/utils'

export default function TeacherLabsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [activeTab, setActiveTab] = useState('dashboard')

  // Mock data for development - will be replaced with real API calls
  const activitiesData = {
    total: 40,
    activities: [
      {
        id: '1',
        title: 'Conteo con Material Concreto',
        oa_code: 'OA-1-MAT-01',
        category: 'matematicas',
        duration_minutes: 45,
        difficulty_level: 'basico'
      },
      {
        id: '2', 
        title: 'Clasificación de Formas',
        oa_code: 'OA-1-MAT-02',
        category: 'matematicas',
        duration_minutes: 30,
        difficulty_level: 'basico'
      }
    ]
  }

  const sessionsData = {
    sessions: [
      {
        id: '1',
        activity_title: 'Conteo con Material Concreto',
        created_at: new Date().toISOString(),
        participants_count: 8,
        evidence_count: 12,
        status: 'completed'
      }
    ]
  }

  const analyticsData = {
    sessions_completed: 15,
    sessions_this_week: 3,
    evidence_count: 45,
    evidence_this_week: 8,
    oas_covered: 12,
    oa_coverage: [
      { oa_code: 'OA-1-MAT-01', coverage_percentage: 85 },
      { oa_code: 'OA-1-MAT-02', coverage_percentage: 65 }
    ]
  }

  const activitiesLoading = false
  const sessionsLoading = false
  const analyticsLoading = false

  const labStats = [
    {
      id: 'activities',
      label: 'Actividades Disponibles',
      value: activitiesData?.total || 0,
      change: { value: 3, type: 'increase' as const, period: 'esta semana' },
      icon: <BeakerIcon className="h-5 w-5" />,
      color: 'blue' as const
    },
    {
      id: 'sessions',
      label: 'Sesiones Realizadas',
      value: analyticsData?.sessions_completed || 0,
      change: { value: analyticsData?.sessions_this_week || 0, type: 'increase' as const, period: 'esta semana' },
      icon: <ClockIcon className="h-5 w-5" />,
      color: 'green' as const
    },
    {
      id: 'evidence',
      label: 'Evidencias Registradas',
      value: analyticsData?.evidence_count || 0,
      change: { value: analyticsData?.evidence_this_week || 0, type: 'increase' as const, period: 'nuevas' },
      icon: <CameraIcon className="h-5 w-5" />,
      color: 'purple' as const
    },
    {
      id: 'oas',
      label: 'OAs Trabajados',
      value: analyticsData?.oas_covered || 0,
      change: { value: 75, type: 'neutral' as const, period: 'cobertura curricular' },
      icon: <AcademicCapIcon className="h-5 w-5" />,
      color: 'yellow' as const
    }
  ]

  const recentActivities = activitiesData?.activities?.slice(0, 5) || []
  const recentSessions = sessionsData?.sessions?.slice(0, 5) || []

  const handleStartActivity = (activityId: string) => {
    router.push(`/teacher/labs/activities/${activityId}/start`)
  }

  const handleViewActivity = (activityId: string) => {
    router.push(`/teacher/labs/activities/${activityId}`)
  }

  const activityColumns = [
    {
      key: 'title',
      label: 'Actividad',
      render: (item: any) => (
        <div className="flex items-center space-x-3">
          <BeakerIcon className="h-5 w-5 text-blue-600" />
          <div>
            <div className="font-medium text-gray-900">{item.title}</div>
            <div className="text-sm text-gray-500">{item.oa_code}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.category === 'matematicas' ? 'bg-blue-100 text-blue-800' :
          item.category === 'lenguaje' ? 'bg-green-100 text-green-800' :
          item.category === 'ciencias' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.category}
        </span>
      )
    },
    {
      key: 'duration_minutes',
      label: 'Duración',
      render: (item: any) => `${item.duration_minutes} min`
    },
    {
      key: 'difficulty_level',
      label: 'Nivel',
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.difficulty_level === 'basico' ? 'bg-green-100 text-green-800' :
          item.difficulty_level === 'intermedio' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.difficulty_level}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewActivity(item.id)}
          >
            <DocumentTextIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleStartActivity(item.id)}
          >
            <PlayIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const sessionColumns = [
    {
      key: 'activity_title',
      label: 'Actividad',
      render: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">{item.activity_title}</div>
          <div className="text-sm text-gray-500">{formatDate(item.created_at)}</div>
        </div>
      )
    },
    {
      key: 'participants_count',
      label: 'Participantes',
      render: (item: any) => (
        <div className="flex items-center">
          <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
          {item.participants_count}
        </div>
      )
    },
    {
      key: 'evidence_count',
      label: 'Evidencias',
      render: (item: any) => (
        <div className="flex items-center">
          <CameraIcon className="h-4 w-4 text-gray-400 mr-1" />
          {item.evidence_count}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'completed' ? 'bg-green-100 text-green-800' :
          item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.status === 'completed' ? 'Completada' : 
           item.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
        </span>
      )
    }
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laboratorios Móviles</h1>
            <p className="text-gray-600">Gestiona actividades con material concreto y metodologías ABP</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => router.push('/teacher/labs/activities')}
            >
              <BeakerIcon className="h-5 w-5 mr-2" />
              Ver Catálogo
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push('/teacher/labs/sessions/new')}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Sesión
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
              { id: 'activities', label: 'Actividades Recientes', icon: BeakerIcon },
              { id: 'sessions', label: 'Sesiones', icon: ClockIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Grid */}
        {activeTab === 'dashboard' && (
          <>
            <StatsGrid stats={labStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => router.push('/teacher/labs/activities')}
                  >
                    <BeakerIcon className="h-5 w-5 mr-3" />
                    Explorar Actividades por OA
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => router.push('/teacher/labs/sessions/new')}
                  >
                    <PlayIcon className="h-5 w-5 mr-3" />
                    Iniciar Sesión de Trabajo
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => router.push('/teacher/labs/favorites')}
                  >
                    <HeartIcon className="h-5 w-5 mr-3" />
                    Mis Actividades Favoritas
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => router.push('/teacher/labs/collections')}
                  >
                    <FolderIcon className="h-5 w-5 mr-3" />
                    Mis Colecciones
                  </Button>
                </div>
              </div>

              {/* Coverage Progress */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cobertura Curricular</h3>
                <div className="space-y-4">
                  {analyticsData?.oa_coverage?.map((oa: any) => (
                    <div key={oa.oa_code} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{oa.oa_code}</span>
                          <span className="text-gray-500">{oa.coverage_percentage}%</span>
                        </div>
                        <div className="mt-1 relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${oa.coverage_percentage}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No hay datos de cobertura disponibles</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Actividades Disponibles</h3>
              <p className="text-sm text-gray-500">Actividades ordenadas por relevancia para tus OAs</p>
            </div>
            <ResponsiveTable
              data={recentActivities}
              columns={activityColumns}
              loading={activitiesLoading}
              emptyMessage="No hay actividades disponibles"
            />
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Sesiones Recientes</h3>
              <p className="text-sm text-gray-500">Historial de sesiones de trabajo realizadas</p>
            </div>
            <ResponsiveTable
              data={recentSessions}
              columns={sessionColumns}
              loading={sessionsLoading}
              emptyMessage="No hay sesiones registradas"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 