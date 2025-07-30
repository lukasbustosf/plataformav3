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
  UsersIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon,
  BanknotesIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function SostenedorReportsPage() {
  const [activeTab, setActiveTab] = useState<'lab' | 'games' | 'network'>('lab');

  // Datos simulados para Laboratorios (vista Sostenedor - toda la red)
  const labData = {
    executionsByMonth: [
      { month: 'Ene', executions: 156, students: 567, rating: 4.3 },
      { month: 'Feb', executions: 234, students: 789, rating: 4.5 },
      { month: 'Mar', executions: 189, students: 634, rating: 4.2 },
      { month: 'Abr', executions: 267, students: 912, rating: 4.6 },
      { month: 'May', executions: 223, students: 756, rating: 4.4 },
      { month: 'Jun', executions: 312, students: 1089, rating: 4.7 },
    ],
    topActivities: [
      { name: 'El hábitat de los animales', executions: 89, rating: 4.8, students: 312 },
      { name: 'Conteo con material concreto', executions: 67, rating: 4.5, students: 245 },
      { name: 'Exploración de texturas', executions: 52, rating: 4.7, students: 189 },
      { name: 'Clasificación de objetos', executions: 45, rating: 4.3, students: 167 },
      { name: 'Experimentos con agua', executions: 38, rating: 4.6, students: 145 },
    ],
    materialUsage: [
      { material: 'PUZZLE ANIMALES', usage: 89, percentage: 31 },
      { material: 'BLOQUES MATEMÁTICOS', usage: 67, percentage: 23 },
      { material: 'KIT TEXTURAS', usage: 52, percentage: 18 },
      { material: 'MATERIALES DE LABORATORIO', usage: 45, percentage: 16 },
      { material: 'OTROS MATERIALES', usage: 38, percentage: 12 },
    ],
    teacherMetrics: [
      { teacher: 'Colegio A - María González', activities: 8, executions: 25, students: 89, rating: 4.6 },
      { teacher: 'Colegio B - Carlos Rodríguez', activities: 6, executions: 18, students: 67, rating: 4.4 },
      { teacher: 'Colegio C - Ana Silva', activities: 5, executions: 15, students: 52, rating: 4.7 },
      { teacher: 'Colegio D - Luis Pérez', activities: 4, executions: 12, students: 45, rating: 4.3 },
    ],
    weeklyProgress: [
      { week: 'Sem 1', executions: 45, newStudents: 156, avgRating: 4.3 },
      { week: 'Sem 2', executions: 67, newStudents: 234, avgRating: 4.5 },
      { week: 'Sem 3', executions: 52, newStudents: 189, avgRating: 4.2 },
      { week: 'Sem 4', executions: 78, newStudents: 267, avgRating: 4.6 },
    ],
    summary: {
      totalActivities: 89,
      totalExecutions: 291,
      totalStudents: 1089,
      averageRating: 4.5,
      totalEvidence: 156,
      activeTeachers: 24,
    },
  };

  // Datos simulados para Juegos (vista Sostenedor - toda la red)
  const gameData = {
    gameUsageByMonth: [
      { month: 'Ene', totalGames: 156, uniquePlayers: 89, averageScore: 76 },
      { month: 'Feb', totalGames: 234, uniquePlayers: 134, averageScore: 79 },
      { month: 'Mar', totalGames: 189, uniquePlayers: 108, averageScore: 77 },
      { month: 'Abr', totalGames: 267, uniquePlayers: 152, averageScore: 82 },
      { month: 'May', totalGames: 223, uniquePlayers: 128, averageScore: 80 },
      { month: 'Jun', totalGames: 312, uniquePlayers: 178, averageScore: 84 },
    ],
    topGames: [
      { name: 'Recordar: Conteo Básico', usageCount: 89, averageScore: 85, completionRate: 92, bloomLevel: 'Recordar' },
      { name: 'Comprender: Agrupación', usageCount: 67, averageScore: 78, completionRate: 88, bloomLevel: 'Comprender' },
      { name: 'Aplicar: La Feria', usageCount: 52, averageScore: 82, completionRate: 85, bloomLevel: 'Aplicar' },
      { name: 'Analizar: Patrones', usageCount: 45, averageScore: 75, completionRate: 80, bloomLevel: 'Analizar' },
      { name: 'Evaluar: Comparaciones', usageCount: 38, averageScore: 79, completionRate: 83, bloomLevel: 'Evaluar' },
    ],
    bloomDistribution: [
      { level: 'Recordar', usage: 89, averageScore: 85, percentage: 29 },
      { level: 'Comprender', usage: 67, averageScore: 78, percentage: 22 },
      { level: 'Aplicar', usage: 52, averageScore: 82, percentage: 17 },
      { level: 'Analizar', usage: 45, averageScore: 75, percentage: 15 },
      { level: 'Evaluar', usage: 38, averageScore: 79, percentage: 12 },
      { level: 'Crear', usage: 15, averageScore: 72, percentage: 5 },
    ],
    studentProgress: [
      { student: 'Colegio A - María González', gamesPlayed: 15, averageScore: 82, achievements: 8, timeSpent: 120 },
      { student: 'Colegio B - Carlos Rodríguez', gamesPlayed: 12, averageScore: 78, achievements: 6, timeSpent: 95 },
      { student: 'Colegio C - Ana Silva', gamesPlayed: 18, averageScore: 85, achievements: 10, timeSpent: 145 },
      { student: 'Colegio D - Luis Pérez', gamesPlayed: 10, averageScore: 75, achievements: 4, timeSpent: 80 },
    ],
    difficultyAnalysis: [
      { complexity: 'Básico', gamesCount: 2, averageScore: 85, completionRate: 92 },
      { complexity: 'Intermedio', gamesCount: 2, averageScore: 78, completionRate: 85 },
      { complexity: 'Avanzado', gamesCount: 2, averageScore: 72, completionRate: 78 },
    ],
    summary: {
      totalGames: 6,
      totalPlays: 312,
      uniquePlayers: 178,
      averageScore: 82,
      totalAchievements: 89,
      averageTimePerGame: 8,
    },
  };

  // Datos simulados para Reportes de Red
  const networkData = {
    summary: {
      totalSchools: 8,
      totalStudents: 3200,
      totalTeachers: 180,
      totalClasses: 144,
      averageGrade: 6.3,
      attendanceRate: 93.8,
      completionRate: 88.5,
      totalBudget: 125000000,
      budgetUtilization: 87.2,
    },
    schoolPerformance: [
      { school: 'Colegio A', students: 450, teachers: 25, averageGrade: 6.5, attendance: 96.2, budget: 18000000 },
      { school: 'Colegio B', students: 380, teachers: 22, averageGrade: 6.3, attendance: 95.8, budget: 15000000 },
      { school: 'Colegio C', students: 420, teachers: 24, averageGrade: 6.1, attendance: 94.5, budget: 17000000 },
      { school: 'Colegio D', students: 350, teachers: 20, averageGrade: 6.4, attendance: 95.1, budget: 14000000 },
      { school: 'Colegio E', students: 400, teachers: 23, averageGrade: 6.2, attendance: 93.8, budget: 16000000 },
      { school: 'Colegio F', students: 320, teachers: 18, averageGrade: 6.0, attendance: 92.5, budget: 13000000 },
      { school: 'Colegio G', students: 360, teachers: 21, averageGrade: 6.6, attendance: 96.8, budget: 14500000 },
      { school: 'Colegio H', students: 320, teachers: 19, averageGrade: 6.3, attendance: 94.2, budget: 12500000 },
    ],
    regionalPerformance: [
      { region: 'Región Metropolitana', schools: 4, students: 1650, averageGrade: 6.4, attendance: 95.2 },
      { region: 'Valparaíso', schools: 2, students: 750, averageGrade: 6.2, attendance: 94.1 },
      { region: 'Biobío', schools: 1, students: 420, averageGrade: 6.1, attendance: 93.5 },
      { region: 'Araucanía', schools: 1, students: 380, averageGrade: 6.5, attendance: 96.0 },
    ],
    budgetAnalysis: [
      { category: 'Personal Docente', amount: 85000000, percentage: 68.0 },
      { category: 'Infraestructura', amount: 25000000, percentage: 20.0 },
      { category: 'Tecnología', amount: 10000000, percentage: 8.0 },
      { category: 'Materiales', amount: 5000000, percentage: 4.0 },
    ],
  };

  const handleExportReport = () => {
    const reportData = activeTab === 'lab' ? labData : activeTab === 'games' ? gameData : networkData;
    const reportName = activeTab === 'lab' ? 'Reporte_Laboratorios_Red' : 
                      activeTab === 'games' ? 'Reporte_Juegos_Red' : 'Reporte_Red_Ejecutivo';
    
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
              Reportes Ejecutivos de Red 📊
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Análisis completo del rendimiento de toda la red educativa
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
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Total Colegios</p>
                <p className="text-2xl font-bold">{networkData.summary.totalSchools}</p>
              </div>
              <BuildingOfficeIcon className="h-8 w-8 text-indigo-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Estudiantes</p>
                <p className="text-2xl font-bold">{networkData.summary.totalStudents.toLocaleString()}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Presupuesto Total</p>
                <p className="text-2xl font-bold">${(networkData.summary.totalBudget / 1000000).toFixed(0)}M</p>
              </div>
              <BanknotesIcon className="h-8 w-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Promedio General</p>
                <p className="text-2xl font-bold">{networkData.summary.averageGrade}</p>
              </div>
              <TrophyIcon className="h-8 w-8 text-purple-200" />
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
            <button
              onClick={() => setActiveTab('network')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'network'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              Reporte de Red
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
          ) : activeTab === 'games' ? (
            <GameReports 
              data={gameData} 
              userRole="SUPER_ADMIN_FULL" 
            />
          ) : (
            <div className="space-y-8">
              {/* Header del Reporte de Red */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Reporte Ejecutivo de Red</h1>
                    <p className="text-indigo-100 mt-1">
                      Análisis completo del rendimiento de toda la red educativa
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-100 text-sm">Generado el {new Date().toLocaleDateString()}</p>
                    <p className="text-indigo-100 text-sm">Vista Sostenedor</p>
                  </div>
                </div>
              </div>

              {/* Métricas de Red */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Profesores</p>
                      <p className="text-2xl font-bold text-gray-900">{networkData.summary.totalTeachers}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                      <AcademicCapIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tasa de Asistencia</p>
                      <p className="text-2xl font-bold text-gray-900">{networkData.summary.attendanceRate}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                      <ClockIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Utilización Presupuesto</p>
                      <p className="text-2xl font-bold text-gray-900">{networkData.summary.budgetUtilization}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                      <BanknotesIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rendimiento por Colegio */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Rendimiento por Colegio
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Colegio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estudiantes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profesores
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Promedio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asistencia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Presupuesto
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {networkData.schoolPerformance.map((school, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {school.school}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {school.students.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {school.teachers}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {school.averageGrade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {school.attendance}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${(school.budget / 1000000).toFixed(1)}M
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Análisis Presupuestario */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BanknotesIcon className="h-5 w-5 mr-2 text-green-600" />
                  Análisis Presupuestario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {networkData.budgetAnalysis.map((category, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Monto: ${(category.amount / 1000000).toFixed(1)}M</p>
                        <p>Porcentaje: {category.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rendimiento Regional */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Rendimiento Regional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {networkData.regionalPerformance.map((region, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{region.region}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Colegios: {region.schools}</p>
                        <p>Estudiantes: {region.students.toLocaleString()}</p>
                        <p>Promedio: {region.averageGrade}</p>
                        <p>Asistencia: {region.attendance}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 