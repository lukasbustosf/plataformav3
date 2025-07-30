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
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function TeacherReportsPage() {
  const [activeTab, setActiveTab] = useState<'lab' | 'games'>('lab');

  // Datos simulados para Laboratorios
  const labData = {
    executionsByMonth: [
      { month: 'Ene', executions: 12, students: 45, rating: 4.5 },
      { month: 'Feb', executions: 18, students: 67, rating: 4.7 },
      { month: 'Mar', executions: 15, students: 52, rating: 4.3 },
      { month: 'Abr', executions: 22, students: 78, rating: 4.8 },
      { month: 'May', executions: 19, students: 65, rating: 4.6 },
      { month: 'Jun', executions: 25, students: 89, rating: 4.9 },
    ],
    topActivities: [
      { name: 'El hábitat de los animales', executions: 8, rating: 4.8, students: 25 },
      { name: 'Conteo con material concreto', executions: 6, rating: 4.5, students: 30 },
      { name: 'Exploración de texturas', executions: 5, rating: 4.7, students: 22 },
      { name: 'Clasificación de objetos', executions: 4, rating: 4.3, students: 18 },
    ],
    materialUsage: [
      { material: 'PUZZLE ANIMALES', usage: 8, percentage: 35 },
      { material: 'BLOQUES MATEMÁTICOS', usage: 6, percentage: 26 },
      { material: 'KIT TEXTURAS', usage: 5, percentage: 22 },
      { material: 'OTROS MATERIALES', usage: 4, percentage: 17 },
    ],
    teacherMetrics: [
      { teacher: 'María González', activities: 4, executions: 12, students: 45, rating: 4.6 },
    ],
    weeklyProgress: [
      { week: 'Sem 1', executions: 3, newStudents: 12, avgRating: 4.5 },
      { week: 'Sem 2', executions: 5, newStudents: 18, avgRating: 4.7 },
      { week: 'Sem 3', executions: 4, newStudents: 15, avgRating: 4.3 },
      { week: 'Sem 4', executions: 6, newStudents: 22, avgRating: 4.8 },
    ],
    summary: {
      totalActivities: 4,
      totalExecutions: 18,
      totalStudents: 67,
      averageRating: 4.6,
      totalEvidence: 12,
      activeTeachers: 1,
    },
  };

  // Datos simulados para Juegos
  const gameData = {
    gameUsageByMonth: [
      { month: 'Ene', totalGames: 15, uniquePlayers: 8, averageScore: 78 },
      { month: 'Feb', totalGames: 22, uniquePlayers: 12, averageScore: 82 },
      { month: 'Mar', totalGames: 18, uniquePlayers: 10, averageScore: 79 },
      { month: 'Abr', totalGames: 25, uniquePlayers: 15, averageScore: 85 },
      { month: 'May', totalGames: 20, uniquePlayers: 13, averageScore: 81 },
      { month: 'Jun', totalGames: 28, uniquePlayers: 18, averageScore: 87 },
    ],
    topGames: [
      { name: 'Recordar: Conteo Básico', usageCount: 12, averageScore: 85, completionRate: 92, bloomLevel: 'Recordar' },
      { name: 'Comprender: Agrupación', usageCount: 10, averageScore: 78, completionRate: 88, bloomLevel: 'Comprender' },
      { name: 'Aplicar: La Feria', usageCount: 8, averageScore: 82, completionRate: 85, bloomLevel: 'Aplicar' },
      { name: 'Analizar: Patrones', usageCount: 6, averageScore: 75, completionRate: 80, bloomLevel: 'Analizar' },
    ],
    bloomDistribution: [
      { level: 'Recordar', usage: 12, averageScore: 85, percentage: 33 },
      { level: 'Comprender', usage: 10, averageScore: 78, percentage: 28 },
      { level: 'Aplicar', usage: 8, averageScore: 82, percentage: 22 },
      { level: 'Analizar', usage: 6, averageScore: 75, percentage: 17 },
    ],
    studentProgress: [
      { student: 'María González', gamesPlayed: 8, averageScore: 82, achievements: 5, timeSpent: 45 },
      { student: 'Carlos Rodríguez', gamesPlayed: 6, averageScore: 78, achievements: 3, timeSpent: 35 },
      { student: 'Ana Silva', gamesPlayed: 10, averageScore: 85, achievements: 7, timeSpent: 55 },
    ],
    difficultyAnalysis: [
      { complexity: 'Básico', gamesCount: 2, averageScore: 85, completionRate: 92 },
      { complexity: 'Intermedio', gamesCount: 2, averageScore: 78, completionRate: 85 },
      { complexity: 'Avanzado', gamesCount: 2, averageScore: 72, completionRate: 78 },
    ],
    summary: {
      totalGames: 6,
      totalPlays: 36,
      uniquePlayers: 18,
      averageScore: 82,
      totalAchievements: 15,
      averageTimePerGame: 8,
    },
  };

  const handleExportReport = () => {
    // Función para exportar reporte
    const reportData = activeTab === 'lab' ? labData : gameData;
    const reportName = activeTab === 'lab' ? 'Reporte_Laboratorios' : 'Reporte_Juegos';
    
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
              Reportes y Análisis 📊
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Visualiza el progreso y rendimiento de tus actividades educativas
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Button variant="outline" onClick={handleExportReport}>
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Exportar Reporte
            </Button>
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
              userRole="TEACHER" 
            />
          ) : (
            <GameReports 
              data={gameData} 
              userRole="TEACHER" 
            />
          )}
        </div>

        {/* Información Adicional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Información del Reporte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📅 Período de Análisis</h4>
              <p className="text-sm text-gray-600">
                Este reporte incluye datos desde enero hasta junio de 2025, 
                mostrando el progreso y rendimiento de tus actividades educativas.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🎯 Métricas Clave</h4>
              <p className="text-sm text-gray-600">
                Los gráficos y métricas te ayudan a identificar patrones, 
                áreas de mejora y oportunidades para optimizar el aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 