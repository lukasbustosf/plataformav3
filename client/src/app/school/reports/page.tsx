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
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function SchoolReportsPage() {
  const [activeTab, setActiveTab] = useState<'lab' | 'games' | 'academic'>('lab');

  // Datos simulados para Laboratorios (vista Admin Escolar)
  const labData = {
    executionsByMonth: [
      { month: 'Ene', executions: 23, students: 89, rating: 4.4 },
      { month: 'Feb', executions: 34, students: 123, rating: 4.6 },
      { month: 'Mar', executions: 28, students: 98, rating: 4.3 },
      { month: 'Abr', executions: 41, students: 145, rating: 4.7 },
      { month: 'May', executions: 35, students: 128, rating: 4.5 },
      { month: 'Jun', executions: 48, students: 167, rating: 4.8 },
    ],
    topActivities: [
      { name: 'El hábitat de los animales', executions: 15, rating: 4.8, students: 52 },
      { name: 'Conteo con material concreto', executions: 12, rating: 4.5, students: 45 },
      { name: 'Exploración de texturas', executions: 10, rating: 4.7, students: 38 },
      { name: 'Clasificación de objetos', executions: 8, rating: 4.3, students: 32 },
      { name: 'Experimentos con agua', executions: 7, rating: 4.6, students: 28 },
    ],
    materialUsage: [
      { material: 'PUZZLE ANIMALES', usage: 15, percentage: 28 },
      { material: 'BLOQUES MATEMÁTICOS', usage: 12, percentage: 22 },
      { material: 'KIT TEXTURAS', usage: 10, percentage: 19 },
      { material: 'MATERIALES DE LABORATORIO', usage: 8, percentage: 15 },
      { material: 'OTROS MATERIALES', usage: 8, percentage: 16 },
    ],
    teacherMetrics: [
      { teacher: 'María González', activities: 6, executions: 18, students: 67, rating: 4.6 },
      { teacher: 'Carlos Rodríguez', activities: 4, executions: 12, students: 45, rating: 4.4 },
      { teacher: 'Ana Silva', activities: 5, executions: 15, students: 52, rating: 4.7 },
      { teacher: 'Luis Pérez', activities: 3, executions: 9, students: 34, rating: 4.3 },
    ],
    weeklyProgress: [
      { week: 'Sem 1', executions: 8, newStudents: 32, avgRating: 4.4 },
      { week: 'Sem 2', executions: 12, newStudents: 45, avgRating: 4.6 },
      { week: 'Sem 3', executions: 10, newStudents: 38, avgRating: 4.3 },
      { week: 'Sem 4', executions: 15, newStudents: 52, avgRating: 4.7 },
    ],
    summary: {
      totalActivities: 18,
      totalExecutions: 52,
      totalStudents: 209,
      averageRating: 4.6,
      totalEvidence: 35,
      activeTeachers: 4,
    },
  };

  // Datos simulados para Juegos (vista Admin Escolar)
  const gameData = {
    gameUsageByMonth: [
      { month: 'Ene', totalGames: 23, uniquePlayers: 15, averageScore: 77 },
      { month: 'Feb', totalGames: 34, uniquePlayers: 22, averageScore: 80 },
      { month: 'Mar', totalGames: 28, uniquePlayers: 18, averageScore: 78 },
      { month: 'Abr', totalGames: 41, uniquePlayers: 26, averageScore: 83 },
      { month: 'May', totalGames: 35, uniquePlayers: 23, averageScore: 81 },
      { month: 'Jun', totalGames: 48, uniquePlayers: 31, averageScore: 85 },
    ],
    topGames: [
      { name: 'Recordar: Conteo Básico', usageCount: 18, averageScore: 85, completionRate: 92, bloomLevel: 'Recordar' },
      { name: 'Comprender: Agrupación', usageCount: 15, averageScore: 78, completionRate: 88, bloomLevel: 'Comprender' },
      { name: 'Aplicar: La Feria', usageCount: 12, averageScore: 82, completionRate: 85, bloomLevel: 'Aplicar' },
      { name: 'Analizar: Patrones', usageCount: 10, averageScore: 75, completionRate: 80, bloomLevel: 'Analizar' },
      { name: 'Evaluar: Comparaciones', usageCount: 8, averageScore: 79, completionRate: 83, bloomLevel: 'Evaluar' },
    ],
    bloomDistribution: [
      { level: 'Recordar', usage: 18, averageScore: 85, percentage: 29 },
      { level: 'Comprender', usage: 15, averageScore: 78, percentage: 24 },
      { level: 'Aplicar', usage: 12, averageScore: 82, percentage: 19 },
      { level: 'Analizar', usage: 10, averageScore: 75, percentage: 16 },
      { level: 'Evaluar', usage: 8, averageScore: 79, percentage: 12 },
    ],
    studentProgress: [
      { student: 'María González', gamesPlayed: 12, averageScore: 82, achievements: 6, timeSpent: 85 },
      { student: 'Carlos Rodríguez', gamesPlayed: 10, averageScore: 78, achievements: 5, timeSpent: 72 },
      { student: 'Ana Silva', gamesPlayed: 15, averageScore: 85, achievements: 8, timeSpent: 95 },
      { student: 'Luis Pérez', gamesPlayed: 8, averageScore: 75, achievements: 3, timeSpent: 60 },
    ],
    difficultyAnalysis: [
      { complexity: 'Básico', gamesCount: 2, averageScore: 85, completionRate: 92 },
      { complexity: 'Intermedio', gamesCount: 2, averageScore: 78, completionRate: 85 },
      { complexity: 'Avanzado', gamesCount: 2, averageScore: 72, completionRate: 78 },
    ],
    summary: {
      totalGames: 6,
      totalPlays: 63,
      uniquePlayers: 31,
      averageScore: 82,
      totalAchievements: 22,
      averageTimePerGame: 8,
    },
  };

  // Datos simulados para Reportes Académicos
  const academicData = {
    summary: {
      totalStudents: 450,
      totalTeachers: 25,
      totalClasses: 18,
      averageGrade: 6.2,
      attendanceRate: 94.5,
      completionRate: 87.3,
    },
    classPerformance: [
      { class: '1° Básico A', students: 25, averageGrade: 6.5, attendance: 96.2, teacher: 'María González' },
      { class: '1° Básico B', students: 24, averageGrade: 6.3, attendance: 95.8, teacher: 'Carlos Rodríguez' },
      { class: '2° Básico A', students: 26, averageGrade: 6.1, attendance: 94.5, teacher: 'Ana Silva' },
      { class: '2° Básico B', students: 25, averageGrade: 6.4, attendance: 95.1, teacher: 'Luis Pérez' },
      { class: '3° Básico A', students: 27, averageGrade: 6.0, attendance: 93.8, teacher: 'Patricia López' },
    ],
    subjectPerformance: [
      { subject: 'Matemáticas', averageGrade: 6.3, completionRate: 89.2, students: 450 },
      { subject: 'Lenguaje', averageGrade: 6.5, completionRate: 91.5, students: 450 },
      { subject: 'Ciencias', averageGrade: 6.1, completionRate: 85.7, students: 450 },
      { subject: 'Historia', averageGrade: 6.4, completionRate: 88.9, students: 450 },
      { subject: 'Arte', averageGrade: 6.7, completionRate: 92.1, students: 450 },
    ],
    teacherPerformance: [
      { teacher: 'María González', classes: 2, students: 49, averageGrade: 6.5, attendance: 96.0 },
      { teacher: 'Carlos Rodríguez', classes: 2, students: 48, averageGrade: 6.3, attendance: 95.5 },
      { teacher: 'Ana Silva', classes: 2, students: 51, averageGrade: 6.1, attendance: 94.2 },
      { teacher: 'Luis Pérez', classes: 2, students: 50, averageGrade: 6.4, attendance: 95.0 },
    ],
  };

  const handleExportReport = () => {
    const reportData = activeTab === 'lab' ? labData : activeTab === 'games' ? gameData : academicData;
    const reportName = activeTab === 'lab' ? 'Reporte_Laboratorios_Escolar' : 
                      activeTab === 'games' ? 'Reporte_Juegos_Escolar' : 'Reporte_Academico_Escolar';
    
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
              Reportes Administrativos Escolares 📊
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Análisis completo del rendimiento académico y uso de recursos educativos
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
                <p className="text-blue-100 text-sm">Total Estudiantes</p>
                <p className="text-2xl font-bold">{academicData.summary.totalStudents}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Profesores Activos</p>
                <p className="text-2xl font-bold">{academicData.summary.totalTeachers}</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Promedio General</p>
                <p className="text-2xl font-bold">{academicData.summary.averageGrade}</p>
              </div>
              <TrophyIcon className="h-8 w-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Asistencia</p>
                <p className="text-2xl font-bold">{academicData.summary.attendanceRate}%</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-200" />
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
              onClick={() => setActiveTab('academic')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'academic'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Reportes Académicos
            </button>
          </div>
        </div>

        {/* Contenido del Reporte */}
        <div className="bg-gray-50 rounded-xl p-6">
          {activeTab === 'lab' ? (
            <LabReports 
              data={labData} 
              userRole="ADMIN" 
            />
          ) : activeTab === 'games' ? (
            <GameReports 
              data={gameData} 
              userRole="ADMIN" 
            />
          ) : (
            <div className="space-y-8">
              {/* Header del Reporte Académico */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Reporte Académico Escolar</h1>
                    <p className="text-green-100 mt-1">
                      Análisis completo del rendimiento académico del establecimiento
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-100 text-sm">Generado el {new Date().toLocaleDateString()}</p>
                    <p className="text-green-100 text-sm">Vista Administrador Escolar</p>
                  </div>
                </div>
              </div>

              {/* Métricas Académicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Clases</p>
                      <p className="text-2xl font-bold text-gray-900">{academicData.summary.totalClasses}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                      <AcademicCapIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Promedio General</p>
                      <p className="text-2xl font-bold text-gray-900">{academicData.summary.averageGrade}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                      <TrophyIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tasa de Asistencia</p>
                      <p className="text-2xl font-bold text-gray-900">{academicData.summary.attendanceRate}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                      <ClockIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rendimiento por Clase */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Rendimiento por Clase
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clase
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estudiantes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Promedio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asistencia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profesor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {academicData.classPerformance.map((classData, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {classData.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {classData.students}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {classData.averageGrade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {classData.attendance}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {classData.teacher}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rendimiento por Asignatura */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrophyIcon className="h-5 w-5 mr-2 text-green-600" />
                  Rendimiento por Asignatura
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {academicData.subjectPerformance.map((subject, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{subject.subject}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Promedio: {subject.averageGrade}</p>
                        <p>Completación: {subject.completionRate}%</p>
                        <p>Estudiantes: {subject.students}</p>
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