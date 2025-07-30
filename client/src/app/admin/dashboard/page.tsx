'use client'

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ChartBarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon,
  CalendarIcon,
  AcademicCapIcon,
  TrophyIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  BeakerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CogIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  PlayIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
  PresentationChartBarIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/store/auth';

interface AdminStats {
  totalActivities: number;
  totalExecutions: number;
  totalTeachers: number;
  totalSchools: number;
  averageRating: number;
  thisWeekExecutions: number;
  pendingActivities: number;
  activeGames: number;
  totalEvidence: number;
}

interface ActivityOverview {
  id: string;
  title: string;
  creator: string;
  school: string;
  status: 'active' | 'draft' | 'archived';
  executions: number;
  rating: number;
  lastExecution: string;
  material: string;
}

interface SchoolActivity {
  schoolName: string;
  teacherCount: number;
  activityCount: number;
  totalExecutions: number;
  averageRating: number;
  lastActivity: string;
}

interface GameOverview {
  id: string;
  name: string;
  bloomLevel: string;
  complexity: string;
  usageCount: number;
  averageScore: number;
  status: 'active' | 'beta' | 'maintenance';
}

interface RecentActivity {
  id: string;
  title: string;
  teacher: string;
  school: string;
  executionDate: string;
  studentCount: number;
  rating: number;
  duration: number;
  evidenceCount: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalActivities: 0,
    totalExecutions: 0,
    totalTeachers: 0,
    totalSchools: 0,
    averageRating: 0,
    thisWeekExecutions: 0,
    pendingActivities: 0,
    activeGames: 6,
    totalEvidence: 0
  });
  const [activities, setActivities] = useState<ActivityOverview[]>([]);
  const [schools, setSchools] = useState<SchoolActivity[]>([]);
  const [games, setGames] = useState<GameOverview[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos - en producción esto vendría de la API
    setTimeout(() => {
      setStats({
        totalActivities: 25,
        totalExecutions: 156,
        totalTeachers: 8,
        totalSchools: 3,
        averageRating: 4.6,
        thisWeekExecutions: 23,
        pendingActivities: 5,
        activeGames: 6,
        totalEvidence: 89
      });

      setActivities([
        {
          id: '1',
          title: 'El hábitat de los animales',
          creator: 'María González',
          school: 'Colegio Demo EDU21',
          status: 'active',
          executions: 12,
          rating: 4.8,
          lastExecution: '2025-07-25',
          material: 'PUZZLE ANIMALES'
        },
        {
          id: '2',
          title: 'Conteo con material concreto',
          creator: 'Carlos Rodríguez',
          school: 'Escuela San José',
          status: 'active',
          executions: 8,
          rating: 4.5,
          lastExecution: '2025-07-24',
          material: 'BLOQUES MATEMÁTICOS'
        },
        {
          id: '3',
          title: 'Exploración de texturas',
          creator: 'Ana Silva',
          school: 'Colegio Demo EDU21',
          status: 'draft',
          executions: 0,
          rating: 0,
          lastExecution: '-',
          material: 'KIT TEXTURAS'
        }
      ]);

      setSchools([
        {
          schoolName: 'Colegio Demo EDU21',
          teacherCount: 4,
          activityCount: 15,
          totalExecutions: 89,
          averageRating: 4.7,
          lastActivity: '2025-07-25'
        },
        {
          schoolName: 'Escuela San José',
          teacherCount: 2,
          activityCount: 8,
          totalExecutions: 45,
          averageRating: 4.4,
          lastActivity: '2025-07-24'
        },
        {
          schoolName: 'Liceo Santa María',
          teacherCount: 2,
          activityCount: 2,
          totalExecutions: 22,
          averageRating: 4.2,
          lastActivity: '2025-07-23'
        }
      ]);

      setGames([
        {
          id: 'oa1-mat-recordar',
          name: 'Recordar: Conteo Básico',
          bloomLevel: 'Recordar',
          complexity: 'Básico',
          usageCount: 45,
          averageScore: 87,
          status: 'active'
        },
        {
          id: 'oa1-mat-comprender',
          name: 'Comprender: Agrupación',
          bloomLevel: 'Comprender',
          complexity: 'Básico',
          usageCount: 32,
          averageScore: 78,
          status: 'active'
        },
        {
          id: 'oa1-mat-aplicar',
          name: 'Aplicar: La Feria',
          bloomLevel: 'Aplicar',
          complexity: 'Intermedio',
          usageCount: 28,
          averageScore: 82,
          status: 'active'
        }
      ]);

      setRecentActivities([
        {
          id: '1',
          title: 'El hábitat de los animales',
          teacher: 'María González',
          school: 'Colegio Demo EDU21',
          executionDate: '2025-07-25',
          studentCount: 25,
          rating: 5,
          duration: 45,
          evidenceCount: 1
        },
        {
          id: '2',
          title: 'Conteo con material concreto',
          teacher: 'Carlos Rodríguez',
          school: 'Escuela San José',
          executionDate: '2025-07-24',
          studentCount: 30,
          rating: 4,
          duration: 30,
          evidenceCount: 0
        },
        {
          id: '3',
          title: 'Exploración de texturas',
          teacher: 'Ana Silva',
          school: 'Colegio Demo EDU21',
          executionDate: '2025-07-23',
          studentCount: 22,
          rating: 5,
          duration: 40,
          evidenceCount: 2
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% vs semana anterior
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityCard = ({ activity }: { activity: ActivityOverview }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${
              activity.status === 'active' ? 'bg-green-100 text-green-800' :
              activity.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {activity.status === 'active' ? 'Activa' : 
               activity.status === 'draft' ? 'Borrador' : 'Archivada'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Por {activity.creator} • {activity.school}
          </p>
          <p className="text-xs text-gray-600 mb-2">
            Material: {activity.material}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <BeakerIcon className="h-3 w-3" />
              {activity.executions} ejecuciones
            </span>
            {activity.rating > 0 && (
              <span className="flex items-center gap-1">
                <StarIcon className="h-3 w-3 text-yellow-500" />
                {activity.rating.toFixed(1)}/5
              </span>
            )}
            <span className="text-gray-500">
              Última: {activity.lastExecution}
            </span>
          </div>
        </div>
        <div className="ml-4 flex gap-1">
          <Button variant="outline" size="sm">
            <EyeIcon className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm">
            <PencilIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  const SchoolCard = ({ school }: { school: SchoolActivity }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">{school.schoolName}</h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">Profesores:</span> {school.teacherCount}
            </div>
            <div>
              <span className="font-medium">Actividades:</span> {school.activityCount}
            </div>
            <div>
              <span className="font-medium">Ejecuciones:</span> {school.totalExecutions}
            </div>
            <div>
              <span className="font-medium">Rating:</span> {school.averageRating.toFixed(1)}/5
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Última actividad: {school.lastActivity}
          </p>
        </div>
        <div className="ml-4">
          <Button variant="outline" size="sm">
            <EyeIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  const GameCard = ({ game }: { game: GameOverview }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">{game.name}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${
              game.status === 'active' ? 'bg-green-100 text-green-800' :
              game.status === 'beta' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {game.status === 'active' ? 'Activo' : 
               game.status === 'beta' ? 'Beta' : 'Mantenimiento'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-2">
            <div>
              <span className="font-medium">Bloom:</span> {game.bloomLevel}
            </div>
            <div>
              <span className="font-medium">Complejidad:</span> {game.complexity}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <PlayIcon className="h-3 w-3" />
              {game.usageCount} usos
            </span>
            <span className="flex items-center gap-1">
              <StarIcon className="h-3 w-3 text-yellow-500" />
              {game.averageScore}% promedio
            </span>
          </div>
        </div>
        <div className="ml-4 flex gap-1">
          <Button variant="outline" size="sm">
            <EyeIcon className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm">
            <CogIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard V1 - SuperAdmin 🚀
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestión y análisis del módulo de Laboratorios Móviles y Evaluación Gamificada
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Link href="/admin/lab-management">
              <Button variant="outline">
                <BeakerIcon className="h-5 w-5 mr-2" />
                Gestión Lab
              </Button>
            </Link>
            <Link href="/admin/oa1-games">
              <Button variant="primary">
                <PlayIcon className="h-5 w-5 mr-2" />
                Gestión Juegos
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Actividades Totales"
            value={stats.totalActivities}
            icon={BookOpenIcon}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend={15}
          />
          <StatCard
            title="Ejecuciones Esta Semana"
            value={stats.thisWeekExecutions}
            icon={BeakerIcon}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend={8}
          />
          <StatCard
            title="Profesores Activos"
            value={stats.totalTeachers}
            icon={UsersIcon}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            subtitle={`${stats.totalSchools} colegios`}
          />
          <StatCard
            title="Rating Promedio"
            value={stats.averageRating.toFixed(1)}
            icon={StarIcon}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividades y Juegos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Actividades de Laboratorio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BeakerIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Actividades de Laboratorio
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FunnelIcon className="h-4 w-4 mr-1" />
                    Filtrar
                  </Button>
                  <Link href="/admin/lab-management">
                    <Button variant="outline" size="sm">
                      Ver Todas
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            {/* Juegos de Evaluación Gamificada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <PlayIcon className="h-5 w-5 mr-2 text-green-600" />
                  Juegos de Evaluación Gamificada
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FunnelIcon className="h-4 w-4 mr-1" />
                    Filtrar
                  </Button>
                  <Link href="/admin/oa1-games">
                    <Button variant="outline" size="sm">
                      Ver Todos
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actividad por Colegios */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Actividad por Colegios
                </h2>
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </div>
              <div className="space-y-3">
                {schools.map((school, index) => (
                  <SchoolCard key={index} school={school} />
                ))}
              </div>
            </div>

            {/* Ejecuciones Recientes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-orange-600" />
                  Ejecuciones Recientes
                </h2>
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                        <p className="text-xs text-gray-500">
                          {activity.teacher} • {activity.school}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                          <span>{activity.studentCount} alumnos</span>
                          <span>{activity.duration} min</span>
                          {activity.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <StarIcon className="h-3 w-3 text-yellow-500" />
                              {activity.rating}/5
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{activity.executionDate}</p>
                        {activity.evidenceCount > 0 && (
                          <p className="text-xs text-blue-600">
                            {activity.evidenceCount} evidencia
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <LightBulbIcon className="h-5 w-5 mr-2 text-indigo-600" />
                Acciones Rápidas
              </h2>
              <div className="space-y-3">
                <Link href="/admin/lab-management/activities/create">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Crear Actividad
                  </Button>
                </Link>
                <Link href="/admin/lab-management/materials">
                  <Button variant="outline" className="w-full justify-start">
                    <BeakerIcon className="h-4 w-4 mr-2" />
                    Gestionar Materiales
                  </Button>
                </Link>
                <Link href="/admin/oa1-games">
                  <Button variant="outline" className="w-full justify-start">
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Gestionar Juegos
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button variant="outline" className="w-full justify-start">
                    <PresentationChartBarIcon className="h-4 w-4 mr-2" />
                    Generar Reportes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 