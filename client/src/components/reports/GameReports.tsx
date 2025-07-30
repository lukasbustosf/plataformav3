'use client'

import React from 'react';
import { 
  PlayIcon, 
  AcademicCapIcon, 
  StarIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

interface GameReportData {
  // Uso de juegos por tiempo
  gameUsageByMonth: Array<{
    month: string;
    totalGames: number;
    uniquePlayers: number;
    averageScore: number;
  }>;
  
  // Juegos más populares
  topGames: Array<{
    name: string;
    usageCount: number;
    averageScore: number;
    completionRate: number;
    bloomLevel: string;
  }>;
  
  // Distribución por nivel de Bloom
  bloomDistribution: Array<{
    level: string;
    usage: number;
    averageScore: number;
    percentage: number;
  }>;
  
  // Progreso de estudiantes
  studentProgress: Array<{
    student: string;
    gamesPlayed: number;
    averageScore: number;
    achievements: number;
    timeSpent: number;
  }>;
  
  // Análisis de dificultad
  difficultyAnalysis: Array<{
    complexity: string;
    gamesCount: number;
    averageScore: number;
    completionRate: number;
  }>;
  
  // Resumen general
  summary: {
    totalGames: number;
    totalPlays: number;
    uniquePlayers: number;
    averageScore: number;
    totalAchievements: number;
    averageTimePerGame: number;
  };
}

interface GameReportsProps {
  data: GameReportData;
  userRole: 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN_FULL';
  schoolId?: string;
}

export default function GameReports({ data, userRole, schoolId }: GameReportsProps) {
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reporte de Evaluación Gamificada</h1>
            <p className="text-purple-100 mt-1">
              Análisis completo del uso y rendimiento de los juegos educativos
            </p>
          </div>
          <div className="text-right">
            <p className="text-purple-100 text-sm">Generado el {new Date().toLocaleDateString()}</p>
            <p className="text-purple-100 text-sm">
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
          title="Juegos Disponibles"
          value={data.summary.totalGames}
          icon={PlayIcon}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          title="Total de Partidas"
          value={data.summary.totalPlays}
          icon={ChartBarIcon}
          color="bg-gradient-to-r from-pink-500 to-pink-600"
          trend={18}
        />
        <StatCard
          title="Jugadores Únicos"
          value={data.summary.uniquePlayers}
          icon={UserGroupIcon}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={12}
        />
        <StatCard
          title="Puntuación Promedio"
          value={`${data.summary.averageScore}%`}
          icon={StarIcon}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Logros Desbloqueados"
          value={data.summary.totalAchievements}
          icon={TrophyIcon}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={25}
        />
        <StatCard
          title="Tiempo Promedio"
          value={`${data.summary.averageTimePerGame} min`}
          icon={ClockIcon}
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Juegos Más Populares */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
          Juegos Más Populares
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.topGames.map((game, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{game.name}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Usos: {game.usageCount}</p>
                <p>Puntuación: {game.averageScore}%</p>
                <p>Completación: {game.completionRate}%</p>
                <p>Nivel: {game.bloomLevel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución por Nivel de Bloom */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AcademicCapIcon className="h-5 w-5 mr-2 text-green-600" />
          Distribución por Nivel de Bloom
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.bloomDistribution.map((level, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{level.level}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Usos: {level.usage}</p>
                <p>Puntuación: {level.averageScore}%</p>
                <p>Porcentaje: {level.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso de Estudiantes (solo para Teacher y Admin) */}
      {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Progreso de Estudiantes
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Juegos Jugados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntuación Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logros
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.studentProgress.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.student}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.gamesPlayed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        {student.averageScore}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <TrophyIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        {student.achievements}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.timeSpent} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights y Recomendaciones */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-purple-600" />
          Insights y Recomendaciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🎮 Puntos Destacados</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• El juego más popular es "{data.topGames[0]?.name}" con {data.topGames[0]?.usageCount} usos</li>
              <li>• Nivel de Bloom más utilizado: "{data.bloomDistribution[0]?.level}" ({data.bloomDistribution[0]?.percentage}%)</li>
              <li>• Puntuación promedio general: {data.summary.averageScore}%</li>
              <li>• {data.summary.totalAchievements} logros desbloqueados este período</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">💡 Recomendaciones</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Crear más juegos del nivel "{data.bloomDistribution[0]?.level}"</li>
              <li>• Replicar elementos exitosos de "{data.topGames[0]?.name}"</li>
              <li>• Incentivar el uso de niveles de Bloom menos utilizados</li>
              <li>• Implementar más logros para aumentar engagement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 