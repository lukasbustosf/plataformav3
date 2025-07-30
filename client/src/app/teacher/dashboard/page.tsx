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
  PlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/store/auth';

interface DashboardStats {
  totalActivities: number;
  totalExecutions: number;
  totalStudents: number;
  averageRating: number;
  thisWeekExecutions: number;
  pendingActivities: number;
}

interface RecentActivity {
  id: string;
  title: string;
  executionDate: string;
  studentCount: number;
  rating: number;
  duration: number;
  status: 'completed' | 'pending' | 'in-progress';
}

interface StudentProgress {
  name: string;
  avatar: string;
  progress: number;
  lastActivity: string;
  achievements: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalActivities: 0,
    totalExecutions: 0,
    totalStudents: 0,
    averageRating: 0,
    thisWeekExecutions: 0,
    pendingActivities: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos - en producción esto vendría de la API
    setTimeout(() => {
      setStats({
        totalActivities: 12,
        totalExecutions: 47,
        totalStudents: 156,
        averageRating: 4.8,
        thisWeekExecutions: 8,
        pendingActivities: 3
      });

      setRecentActivities([
        {
          id: '1',
          title: 'El hábitat de los animales',
          executionDate: '2025-07-25',
          studentCount: 25,
          rating: 5,
          duration: 45,
          status: 'completed'
        },
        {
          id: '2',
          title: 'Conteo con material concreto',
          executionDate: '2025-07-24',
          studentCount: 30,
          rating: 4,
          duration: 30,
          status: 'completed'
        },
        {
          id: '3',
          title: 'Exploración de texturas',
          executionDate: '2025-07-26',
          studentCount: 22,
          rating: 0,
          duration: 0,
          status: 'pending'
        }
      ]);

      setStudentProgress([
        {
          name: 'María González',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
          progress: 85,
          lastActivity: 'Hace 2 horas',
          achievements: 12
        },
        {
          name: 'Carlos Rodríguez',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          progress: 92,
          lastActivity: 'Hace 1 día',
          achievements: 15
        },
        {
          name: 'Ana Silva',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
          progress: 78,
          lastActivity: 'Hace 3 días',
          achievements: 10
        }
      ]);

      setAchievements([
        {
          id: '1',
          title: 'Primer Paso',
          description: 'Completa tu primera actividad',
          icon: '🎯',
          unlocked: true,
          progress: 1,
          maxProgress: 1
        },
        {
          id: '2',
          title: 'Explorador',
          description: 'Ejecuta 10 actividades diferentes',
          icon: '🔍',
          unlocked: false,
          progress: 7,
          maxProgress: 10
        },
        {
          id: '3',
          title: 'Maestro del Laboratorio',
          description: 'Alcanza un rating promedio de 4.5+',
          icon: '🏆',
          unlocked: true,
          progress: 4.8,
          maxProgress: 4.5
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
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

  const ActivityCard = ({ activity }: { activity: RecentActivity }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
          <p className="text-xs text-gray-500 mt-1">{activity.executionDate}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <UserGroupIcon className="h-3 w-3" />
              {activity.studentCount} alumnos
            </span>
            {activity.rating > 0 && (
              <span className="flex items-center gap-1">
                <StarIcon className="h-3 w-3 text-yellow-500" />
                {activity.rating}/5
              </span>
            )}
            {activity.duration > 0 && (
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {activity.duration} min
              </span>
            )}
          </div>
        </div>
        <div className="ml-4">
          {activity.status === 'completed' && (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          )}
          {activity.status === 'pending' && (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
          )}
          {activity.status === 'in-progress' && (
            <ClockIcon className="h-5 w-5 text-blue-500" />
          )}
        </div>
      </div>
    </div>
  );

  const StudentCard = ({ student }: { student: StudentProgress }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start space-x-3">
        <img 
          src={student.avatar} 
          alt={student.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{student.name}</h4>
          <p className="text-xs text-gray-500 mb-2">{student.lastActivity}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progreso</span>
              <span>{student.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${student.progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <TrophyIcon className="h-3 w-3 text-yellow-500" />
            {student.achievements}
          </div>
        </div>
      </div>
    </div>
  );

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-300 ${
      achievement.unlocked ? 'hover:shadow-md' : 'opacity-60'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {achievement.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
          {!achievement.unlocked && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full"
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {achievement.unlocked && (
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
        )}
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
              ¡Bienvenido, {user?.first_name || 'Profesor'}! 👋
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Aquí tienes un resumen de tu actividad en el laboratorio móvil
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/teacher/labs/activities/create">
              <Button variant="primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                Nueva Actividad
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Actividades Totales"
            value={stats.totalActivities}
            icon={BookOpenIcon}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend={12}
          />
          <StatCard
            title="Ejecuciones Esta Semana"
            value={stats.thisWeekExecutions}
            icon={BeakerIcon}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend={8}
          />
          <StatCard
            title="Rating Promedio"
            value={stats.averageRating.toFixed(1)}
            icon={StarIcon}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
          <StatCard
            title="Total Estudiantes"
            value={stats.totalStudents}
            icon={UserGroupIcon}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            trend={5}
          />
          <StatCard
            title="Ejecuciones Pendientes"
            value={stats.pendingActivities}
            icon={ClockIcon}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
          <StatCard
            title="Total Ejecuciones"
            value={stats.totalExecutions}
            icon={ChartBarIcon}
            color="bg-gradient-to-r from-indigo-500 to-indigo-600"
            trend={15}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividades Recientes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Actividades Recientes
                </h2>
                <Link href="/teacher/labs/activities">
                  <Button variant="outline" size="sm">
                    Ver Todas
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            {/* Progreso de Estudiantes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-green-600" />
                  Progreso de Estudiantes
                </h2>
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </div>
              <div className="space-y-3">
                {studentProgress.map((student, index) => (
                  <StudentCard key={index} student={student} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Logros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
                  Logros
                </h2>
                <span className="text-sm text-gray-500">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </span>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <LightBulbIcon className="h-5 w-5 mr-2 text-purple-600" />
                Acciones Rápidas
              </h2>
              <div className="space-y-3">
                <Link href="/teacher/labs/activities/create">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Crear Actividad
                  </Button>
                </Link>
                <Link href="/teacher/labs/activities">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    Explorar Catálogo
                  </Button>
                </Link>
                <Link href="/teacher/oa1-games">
                  <Button variant="outline" className="w-full justify-start">
                    <BeakerIcon className="h-4 w-4 mr-2" />
                    Evaluación Gamificada
                  </Button>
                </Link>
                <Link href="/help">
                  <Button variant="outline" className="w-full justify-start">
                    <LightBulbIcon className="h-4 w-4 mr-2" />
                    Centro de Ayuda
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