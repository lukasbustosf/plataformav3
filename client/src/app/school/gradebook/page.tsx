'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  DocumentTextIcon,
  PlusIcon,
  CalculatorIcon,
  DocumentArrowDownIcon,
  PencilIcon,
  EyeIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Student {
  id: string
  name: string
  rut: string
  grade: string
  class: string
  evaluations: {
    [subject: string]: {
      quiz1: number | null
      quiz2: number | null
      test1: number | null
      test2: number | null
      final: number | null
      average: number
    }
  }
}

interface Evaluation {
  id: string
  name: string
  subject: string
  type: 'quiz' | 'test' | 'homework' | 'final'
  date: string
  grade: string
  maxScore: number
  weight: number
}

export default function GradebookPage() {
  const { user } = useAuth()
  const [selectedGrade, setSelectedGrade] = useState('8° Básico')
  const [selectedSubject, setSelectedSubject] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateEvaluation, setShowCreateEvaluation] = useState(false)
  const [showEditGrade, setShowEditGrade] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{studentId: string, subject: string, evaluation: string} | null>(null)

  // Mock student data
  const students: Student[] = [
    {
      id: 'stud-001',
      name: 'Ana María González',
      rut: '12.345.678-9',
      grade: '8° Básico',
      class: '8°A',
      evaluations: {
        'Matemáticas': { quiz1: 6.5, quiz2: 5.8, test1: 6.2, test2: null, final: null, average: 6.17 },
        'Lenguaje': { quiz1: 7.0, quiz2: 6.5, test1: 6.8, test2: null, final: null, average: 6.77 },
        'Ciencias': { quiz1: 5.9, quiz2: 6.1, test1: 5.7, test2: null, final: null, average: 5.90 },
        'Historia': { quiz1: 6.8, quiz2: 6.3, test1: 6.5, test2: null, final: null, average: 6.53 }
      }
    },
    {
      id: 'stud-002',
      name: 'Carlos Eduardo Ruiz',
      rut: '11.234.567-8',
      grade: '8° Básico',
      class: '8°A',
      evaluations: {
        'Matemáticas': { quiz1: 5.2, quiz2: 5.8, test1: 5.5, test2: null, final: null, average: 5.50 },
        'Lenguaje': { quiz1: 6.2, quiz2: 6.0, test1: 6.1, test2: null, final: null, average: 6.10 },
        'Ciencias': { quiz1: 6.7, quiz2: 6.3, test1: 6.5, test2: null, final: null, average: 6.50 },
        'Historia': { quiz1: 5.8, quiz2: 6.1, test1: 5.9, test2: null, final: null, average: 5.93 }
      }
    },
    {
      id: 'stud-003',
      name: 'María José López',
      rut: '13.456.789-0',
      grade: '8° Básico',
      class: '8°A',
      evaluations: {
        'Matemáticas': { quiz1: 7.0, quiz2: 6.8, test1: 6.9, test2: null, final: null, average: 6.90 },
        'Lenguaje': { quiz1: 6.5, quiz2: 6.7, test1: 6.6, test2: null, final: null, average: 6.60 },
        'Ciencias': { quiz1: 6.2, quiz2: 6.4, test1: 6.3, test2: null, final: null, average: 6.30 },
        'Historia': { quiz1: 7.0, quiz2: 6.8, test1: 6.9, test2: null, final: null, average: 6.90 }
      }
    }
  ]

  // Mock evaluations data
  const evaluations: Evaluation[] = [
    {
      id: 'eval-001',
      name: 'Quiz Álgebra Básica',
      subject: 'Matemáticas',
      type: 'quiz',
      date: '2024-11-15',
      grade: '8° Básico',
      maxScore: 7.0,
      weight: 20
    },
    {
      id: 'eval-002',
      name: 'Prueba Comprensión Lectora',
      subject: 'Lenguaje',
      type: 'test',
      date: '2024-11-18',
      grade: '8° Básico',
      maxScore: 7.0,
      weight: 35
    },
    {
      id: 'eval-003',
      name: 'Quiz Ecosistemas',
      subject: 'Ciencias',
      type: 'quiz',
      date: '2024-11-20',
      grade: '8° Básico',
      maxScore: 7.0,
      weight: 25
    }
  ]

  const grades = ['5° Básico', '6° Básico', '7° Básico', '8° Básico', '1° Medio', '2° Medio', '3° Medio', '4° Medio']
  const subjects = ['ALL', 'Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés', 'Educación Física']

  const filteredStudents = students.filter(student => {
    const matchesGrade = student.grade === selectedGrade
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rut.includes(searchTerm)
    return matchesGrade && matchesSearch
  })

  const handleEditGrade = (studentId: string, subject: string, evaluation: string) => {
    setSelectedCell({ studentId, subject, evaluation })
    setShowEditGrade(true)
  }

  const handleSaveGrade = (newGrade: number) => {
    if (selectedCell) {
      toast.success(`Nota actualizada: ${newGrade}`)
      setShowEditGrade(false)
      setSelectedCell(null)
    }
  }

  const handleExportGradebook = (format: 'pdf' | 'csv' | 'excel') => {
    toast.success(`Exportando libro de notas en formato ${format.toUpperCase()}...`)
  }

  const handleCalculateAverages = () => {
    toast.success('Recalculando promedios automáticamente...')
  }

  const handleDigitalSignature = () => {
    toast.success('Aplicando firma digital al libro de notas...')
  }

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-gray-400'
    if (grade >= 6.0) return 'text-green-600'
    if (grade >= 5.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeStatus = (grade: number | null) => {
    if (grade === null) return 'Sin evaluar'
    if (grade >= 6.0) return 'Aprobado'
    if (grade >= 4.0) return 'Suficiente'
    return 'Insuficiente'
  }

  const handleCreateEvaluation = () => {
    setShowCreateEvaluation(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Libro de Notas Digital 📖</h1>
                <p className="text-gray-600 mt-1">
                  Gestión de calificaciones y evaluaciones estudiantiles
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleExportGradebook('csv')}
                  variant="outline"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Exportar CSV
                </Button>
                <Button
                  onClick={handleCreateEvaluation}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Nueva Evaluación
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignatura
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'ALL' ? 'Todas las asignaturas' : subject}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar estudiante
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o RUT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">6.2</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Evaluaciones Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">% Aprobación</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradebook Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Libro de Clases - {selectedGrade}
              </h3>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleExportGradebook('pdf')}
                  variant="outline"
                  size="sm"
                >
                  PDF
                </Button>
                <Button
                  onClick={() => handleExportGradebook('excel')}
                  variant="outline"
                  size="sm"
                >
                  Excel
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RUT
                  </th>
                  {selectedSubject === 'ALL' ? (
                    <>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matemáticas
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lenguaje
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ciencias
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Historia
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz 1
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz 2
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prueba 1
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prueba 2
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promedio
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.class}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.rut}
                    </td>
                    {selectedSubject === 'ALL' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-sm font-medium ${getGradeColor(student.evaluations['Matemáticas']?.average)}`}>
                            {student.evaluations['Matemáticas']?.average?.toFixed(1) || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-sm font-medium ${getGradeColor(student.evaluations['Lenguaje']?.average)}`}>
                            {student.evaluations['Lenguaje']?.average?.toFixed(1) || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-sm font-medium ${getGradeColor(student.evaluations['Ciencias']?.average)}`}>
                            {student.evaluations['Ciencias']?.average?.toFixed(1) || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-sm font-medium ${getGradeColor(student.evaluations['Historia']?.average)}`}>
                            {student.evaluations['Historia']?.average?.toFixed(1) || 'N/A'}
                          </span>
                        </td>
                      </>
                    ) : (
                      selectedSubject !== 'ALL' && student.evaluations[selectedSubject] && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleEditGrade(student.id, selectedSubject, 'quiz1')}
                              className={`text-sm font-medium ${getGradeColor(student.evaluations[selectedSubject].quiz1)} hover:underline`}
                            >
                              {student.evaluations[selectedSubject].quiz1?.toFixed(1) || 'N/A'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleEditGrade(student.id, selectedSubject, 'quiz2')}
                              className={`text-sm font-medium ${getGradeColor(student.evaluations[selectedSubject].quiz2)} hover:underline`}
                            >
                              {student.evaluations[selectedSubject].quiz2?.toFixed(1) || 'N/A'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleEditGrade(student.id, selectedSubject, 'test1')}
                              className={`text-sm font-medium ${getGradeColor(student.evaluations[selectedSubject].test1)} hover:underline`}
                            >
                              {student.evaluations[selectedSubject].test1?.toFixed(1) || 'N/A'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleEditGrade(student.id, selectedSubject, 'test2')}
                              className={`text-sm font-medium ${getGradeColor(student.evaluations[selectedSubject].test2)} hover:underline`}
                            >
                              {student.evaluations[selectedSubject].test2?.toFixed(1) || 'N/A'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`text-sm font-bold ${getGradeColor(student.evaluations[selectedSubject].average)}`}>
                              {student.evaluations[selectedSubject].average?.toFixed(1) || 'N/A'}
                            </span>
                          </td>
                        </>
                      )
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Evaluations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Evaluaciones Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evaluación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asignatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ponderación
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{evaluation.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {evaluation.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        evaluation.type === 'quiz' ? 'bg-blue-100 text-blue-800' :
                        evaluation.type === 'test' ? 'bg-green-100 text-green-800' :
                        evaluation.type === 'homework' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {evaluation.type === 'quiz' ? 'Quiz' :
                         evaluation.type === 'test' ? 'Prueba' :
                         evaluation.type === 'homework' ? 'Tarea' : 'Final'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(evaluation.date).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {evaluation.weight}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}