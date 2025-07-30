'use client'

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import LabReports from '@/components/reports/LabReports';
import GameReports from '@/components/reports/GameReports';
import { 
  BeakerIcon, 
  PlayIcon, 
  DocumentArrowDownIcon,
  CalendarIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<'lab' | 'games'>('lab');

  // Datos simulados para Laboratorios (vista SuperAdmin)
  const labData = {
    executionsByMonth: [
      { month: 'Ene', executions: 45, students: 156, rating: 4.3 },
      { month: 'Feb', executions: 67, students: 234, rating: 4.5 },
      { month: 'Mar', executions: 52, students: 189, rating: 4.2 },
      { month: 'Abr', executions: 78, students: 267, rating: 4.6 },
      { month: 'May', executions: 65, students: 223, rating: 4.4 },
      { month: 'Jun', executions: 89, students: 312, rating: 4.7 },
    ],
    topActivities: [
      { name: 'El hábitat de los animales', executions: 25, rating: 4.8, students: 89 },
      { name: 'Conteo con material concreto', executions: 18, rating: 4.5, students: 67 },
      { name: 'Exploración de texturas', executions: 15, rating: 4.7, students: 52 },
      { name: 'Clasificación de objetos', executions: 12, rating: 4.3, students: 45 },
      { name: 'Experimentos con agua', executions: 10, rating: 4.6, students: 38 },
    ],
    materialUsage: [
      { material: 'PUZZLE ANIMALES', usage: 25, percentage: 31 },
      { material: 'BLOQUES MATEMÁTICOS', usage: 18, percentage: 22 },
      { material: 'KIT TEXTURAS', usage: 15, percentage: 19 },
      { material: 'MATERIALES DE LABORATORIO', usage: 12, percentage: 15 },
      { material: 'OTROS MATERIALES', usage: 10, percentage: 13 },
    ],
    teacherMetrics: [
      { teacher: 'María González', activities: 8, executions: 25, students: 89, rating: 4.6 },
      { teacher: 'Carlos Rodríguez', activities: 6, executions: 18, students: 67, rating: 4.4 },
      { teacher: 'Ana Silva', activities: 5, executions: 15, students: 52, rating: 4.7 },
      { teacher: 'Luis Pérez', activities: 4, executions: 12, students: 45, rating: 4.3 },
    ],
    weeklyProgress: [
      { week: 'Sem 1', executions: 12, newStudents: 45, avgRating: 4.3 },
      { week: 'Sem 2', executions: 18, newStudents: 67, avgRating: 4.5 },
      { week: 'Sem 3', executions: 15, newStudents: 52, avgRating: 4.2 },
      { week: 'Sem 4', executions: 22, newStudents: 78, avgRating: 4.6 },
    ],
    summary: {
      totalActivities: 25,
      totalExecutions: 156,
      totalStudents: 567,
      averageRating: 4.5,
      totalEvidence: 89,
      activeTeachers: 8,
    },
  };

  // Datos simulados para Juegos (vista SuperAdmin)
  const gameData = {
    gameUsageByMonth: [
      { month: 'Ene', totalGames: 45, uniquePlayers: 23, averageScore: 76 },
      { month: 'Feb', totalGames: 67, uniquePlayers: 34, averageScore: 79 },
      { month: 'Mar', totalGames: 52, uniquePlayers: 28, averageScore: 77 },
      { month: 'Abr', totalGames: 78, uniquePlayers: 42, averageScore: 82 },
      { month: 'May', totalGames: 65, uniquePlayers: 35, averageScore: 80 },
      { month: 'Jun', totalGames: 89, uniquePlayers: 48, averageScore: 84 },
    ],
    topGames: [
      { name: 'Recordar: Conteo Básico', usageCount: 35, averageScore: 85, completionRate: 92, bloomLevel: 'Recordar' },
      { name: 'Comprender: Agrupación', usageCount: 28, averageScore: 78, completionRate: 88, bloomLevel: 'Comprender' },
      { name: 'Aplicar: La Feria', usageCount: 22, averageScore: 82, completionRate: 85, bloomLevel: 'Aplicar' },
      { name: 'Analizar: Patrones', usageCount: 18, averageScore: 75, completionRate: 80, bloomLevel: 'Analizar' },
      { name: 'Evaluar: Comparaciones', usageCount: 15, averageScore: 79, completionRate: 83, bloomLevel: 'Evaluar' },
    ],
    bloomDistribution: [
      { level: 'Recordar', usage: 35, averageScore: 85, percentage: 29 },
      { level: 'Comprender', usage: 28, averageScore: 78, percentage: 23 },
      { level: 'Aplicar', usage: 22, averageScore: 82, percentage: 18 },
      { level: 'Analizar', usage: 18, averageScore: 75, percentage: 15 },
      { level: 'Evaluar', usage: 15, averageScore: 79, percentage: 12 },
      { level: 'Crear', usage: 5, averageScore: 72, percentage: 3 },
    ],
    studentProgress: [
      { student: 'María González', gamesPlayed: 15, averageScore: 82, achievements: 8, timeSpent: 120 },
      { student: 'Carlos Rodríguez', gamesPlayed: 12, averageScore: 78, achievements: 6, timeSpent: 95 },
      { student: 'Ana Silva', gamesPlayed: 18, averageScore: 85, achievements: 10, timeSpent: 145 },
      { student: 'Luis Pérez', gamesPlayed: 10, averageScore: 75, achievements: 4, timeSpent: 80 },
    ],
    difficultyAnalysis: [
      { complexity: 'Básico', gamesCount: 2, averageScore: 85, completionRate: 92 },
      { complexity: 'Intermedio', gamesCount: 2, averageScore: 78, completionRate: 85 },
      { complexity: 'Avanzado', gamesCount: 2, averageScore: 72, completionRate: 78 },
    ],
    summary: {
      totalGames: 6,
      totalPlays: 118,
      uniquePlayers: 48,
      averageScore: 82,
      totalAchievements: 28,
      averageTimePerGame: 8,
    },
  };

  const handleExportReport = () => {
    // Función para exportar reporte
    const reportData = activeTab === 'lab' ? labData : gameData;
    const reportName = activeTab === 'lab' ? 'Reporte_Laboratorios_Admin' : 'Reporte_Juegos_Admin';
    
    // Simular descarga
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reportes Administrativos 📊
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Análisis completo del uso y rendimiento de la plataforma EDU21
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Button variant="outline">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Seleccionar Período
            </Button>
            <Button variant="outline" onClick={handleExportReport}>
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Exportar Reporte
            </Button>
          </div>
        </div>

        {/* Resumen Ejecutivo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Actividades</p>
                <p className="text-2xl font-bold">{labData.summary.totalActivities}</p>
              </div>
              <BeakerIcon className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Juegos</p>
                <p className="text-2xl font-bold">{gameData.summary.totalGames}</p>
              </div>
              <PlayIcon className="h-8 w-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Estudiantes Impactados</p>
                <p className="text-2xl font-bold">{labData.summary.totalStudents}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Rating Promedio</p>
                <p className="text-2xl font-bold">{labData.summary.averageRating.toFixed(1)}/5</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-yellow-200" />
            </div>
          </div>
        </div>

        {/* Tabs de Navegación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('lab')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'lab'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BeakerIcon className="h-5 w-5 mr-2" />
              Laboratorios Móviles
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'games'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Evaluación Gamificada
            </button>
          </div>
        </div>

        {/* Contenido del Reporte */}
        <div className="bg-gray-50 rounded-xl p-6">
          {activeTab === 'lab' ? (
            <LabReports 
              data={labData} 
              userRole="SUPER_ADMIN_FULL" 
            />
          ) : (
            <GameReports 
              data={gameData} 
              userRole="SUPER_ADMIN_FULL" 
            />
          )}
        </div>

        {/* Información Adicional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-600" />
            Información del Reporte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📊 Alcance del Reporte</h4>
              <p className="text-sm text-gray-600">
                Este reporte incluye datos de todos los colegios y profesores 
                de la plataforma EDU21, proporcionando una visión completa del impacto.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📈 Métricas Clave</h4>
              <p className="text-sm text-gray-600">
                Los gráficos y métricas te ayudan a identificar tendencias, 
                áreas de mejora y oportunidades de crecimiento a nivel institucional.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🎯 Toma de Decisiones</h4>
              <p className="text-sm text-gray-600">
                Utiliza estos datos para optimizar recursos, planificar capacitaciones 
                y mejorar la experiencia educativa en toda la red.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 