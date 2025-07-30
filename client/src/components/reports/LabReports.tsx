'use client'

import React from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon,
  BeakerIcon,
  AcademicCapIcon,
  TrophyIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface LabReportData {
  // Datos de ejecuciones por tiempo
  executionsByMonth: Array<{
    month: string;
    executions: number;
    students: number;
    rating: number;
  }>;
  
  // Actividades más populares
  topActivities: Array<{
    name: string;
    executions: number;
    rating: number;
    students: number;
  }>;
  
  // Distribución por material
  materialUsage: Array<{
    material: string;
    usage: number;
    percentage: number;
  }>;
  
  // Métricas por profesor
  teacherMetrics: Array<{
    teacher: string;
    activities: number;
    executions: number;
    students: number;
    rating: number;
  }>;
  
  // Progreso semanal
  weeklyProgress: Array<{
    week: string;
    executions: number;
    newStudents: number;
    avgRating: number;
  }>;
  
  // Resumen general
  summary: {
    totalActivities: number;
    totalExecutions: number;
    totalStudents: number;
    averageRating: number;
    totalEvidence: number;
    activeTeachers: number;
  };
}

interface LabReportsProps {
  data: LabReportData;
  userRole: 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN_FULL';
  schoolId?: string;
}

export default function LabReports({ data, userRole, schoolId }: LabReportsProps) {
  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% vs mes anterior
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header del Reporte */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reporte de Laboratorios Móviles</h1>
            <p className="text-blue-100 mt-1">
              Análisis completo del uso y rendimiento del módulo
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Generado el {new Date().toLocaleDateString()}</p>
            <p className="text-blue-100 text-sm">
              {userRole === 'TEACHER' ? 'Vista Profesor' : 
               userRole === 'ADMIN' ? 'Vista Administrador Escolar' : 
               'Vista Super Administrador'}
            </p>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Actividades Totales"
          value={data.summary.totalActivities}
          icon={BeakerIcon}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={12}
        />
        <StatCard
          title="Ejecuciones Totales"
          value={data.summary.totalExecutions}
          icon={ChartBarIcon}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={8}
        />
        <StatCard
          title="Estudiantes Impactados"
          value={data.summary.totalStudents}
          icon={UserGroupIcon}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={15}
        />
        <StatCard
          title="Rating Promedio"
          value={data.summary.averageRating.toFixed(1)}
          icon={StarIcon}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Evidencias Recopiladas"
          value={data.summary.totalEvidence}
          icon={DocumentChartBarIcon}
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          trend={20}
        />
        <StatCard
          title="Profesores Activos"
          value={data.summary.activeTeachers}
          icon={AcademicCapIcon}
          color="bg-gradient-to-r from-pink-500 to-pink-600"
        />
      </div>

      {/* Actividades Más Populares */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
          Actividades Más Populares
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.topActivities.map((activity, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{activity.name}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Ejecuciones: {activity.executions}</p>
                <p>Estudiantes: {activity.students}</p>
                <p>Rating: {activity.rating}/5</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución por Material */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BeakerIcon className="h-5 w-5 mr-2 text-green-600" />
          Distribución por Material
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.materialUsage.map((material, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{material.material}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Usos: {material.usage}</p>
                <p>Porcentaje: {material.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de Métricas por Profesor (solo para Admin y SuperAdmin) */}
      {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN_FULL') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Métricas por Profesor
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actividades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ejecuciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.teacherMetrics.map((teacher, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {teacher.teacher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.activities}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.executions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        {teacher.rating.toFixed(1)}/5
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights y Recomendaciones */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-green-600" />
          Insights y Recomendaciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🎯 Puntos Destacados</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• La actividad más popular es "{data.topActivities[0]?.name}" con {data.topActivities[0]?.executions} ejecuciones</li>
              <li>• El material más utilizado es "{data.materialUsage[0]?.material}" ({data.materialUsage[0]?.percentage}%)</li>
              <li>• Rating promedio general: {data.summary.averageRating.toFixed(1)}/5</li>
              <li>• {data.summary.totalEvidence} evidencias recopiladas este período</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">💡 Recomendaciones</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Considerar crear más actividades con "{data.materialUsage[0]?.material}"</li>
              <li>• Replicar el éxito de "{data.topActivities[0]?.name}" en otros contextos</li>
              <li>• Incentivar la recopilación de evidencias entre profesores</li>
              <li>• Programar capacitaciones sobre materiales menos utilizados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 