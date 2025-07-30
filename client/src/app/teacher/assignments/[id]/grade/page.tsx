'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  CheckIcon,
  DocumentTextIcon,
  UserIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function GradeAssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [grades, setGrades] = useState<{[key: number]: number}>({}) 
  const [feedback, setFeedback] = useState<{[key: number]: string}>({}) 

  // Mock submissions data
  const submissions = [
    {
      id: 1,
      studentName: 'María González',
      studentClass: '8° A',
      submittedAt: '2024-01-24T20:15:00Z',
      files: ['ensayo_maria.pdf'],
      currentGrade: null,
      isLate: false
    },
    {
      id: 2,
      studentName: 'Carlos Ruiz',
      studentClass: '8° A',
      submittedAt: '2024-01-25T10:30:00Z',
      files: ['independencia_chile.docx'],
      currentGrade: null,
      isLate: false
    },
    {
      id: 3,
      studentName: 'Diego Morales',
      studentClass: '8° A',
      submittedAt: '2024-01-26T08:00:00Z',
      files: ['ensayo_tardio.pdf'],
      currentGrade: null,
      isLate: true
    }
  ]

  const handleGradeChange = (studentId: number, grade: number) => {
    setGrades(prev => ({ ...prev, [studentId]: grade }))
  }

  const handleFeedbackChange = (studentId: number, feedbackText: string) => {
    setFeedback(prev => ({ ...prev, [studentId]: feedbackText }))
  }

  const handleSaveGrades = () => {
    toast.success('Calificaciones guardadas exitosamente')
    router.push(`/teacher/assignments/${params.id}`)
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 6.0) return 'text-green-600'
    if (grade >= 5.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calificar Entregas</h1>
            <p className="text-gray-600">Ensayo sobre la Independencia de Chile</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => router.push(`/teacher/assignments/${params.id}`)}>
              Volver
            </Button>
            <Button onClick={handleSaveGrades} leftIcon={<CheckIcon className="h-4 w-4" />}>
              Guardar Calificaciones
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Estudiantes ({submissions.length})</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedStudent(submission)}
                  className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedStudent?.id === submission.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{submission.studentName}</div>
                        <div className="text-sm text-gray-500">{submission.studentClass}</div>
                        <div className="text-xs text-gray-400">
                          Entregado: {new Date(submission.submittedAt).toLocaleString('es-ES')}
                        </div>
                        {submission.isLate && (
                          <div className="text-xs text-orange-600 font-medium">Entrega tardía</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {grades[submission.id] ? (
                        <div className={`text-lg font-bold ${getGradeColor(grades[submission.id])}`}>
                          {grades[submission.id]}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Sin calificar</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grading Panel */}
          <div className="space-y-6">
            {selectedStudent ? (
              <>
                {/* Student Info */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Calificar: {selectedStudent.studentName}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Archivos Entregados:</div>
                      <div className="mt-2 space-y-2">
                        {selectedStudent.files.map((file: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                            <span className="text-sm text-gray-900">{file}</span>
                            <Button size="sm" variant="outline">Ver</Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calificación (1.0 - 7.0)
                      </label>
                      <input
                        type="number"
                        min="1.0"
                        max="7.0"
                        step="0.1"
                        value={grades[selectedStudent.id] || ''}
                        onChange={(e) => handleGradeChange(selectedStudent.id, parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: 6.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retroalimentación
                      </label>
                      <textarea
                        value={feedback[selectedStudent.id] || ''}
                        onChange={(e) => handleFeedbackChange(selectedStudent.id, e.target.value)}
                        placeholder="Escribe comentarios para el estudiante..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Quick Feedback */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentarios rápidos
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Excelente trabajo, muy bien estructurado.',
                          'Buen análisis, pero falta profundidad en algunos puntos.',
                          'Necesita mejorar la argumentación y las fuentes.',
                          'Muy creativo, pero revisa la ortografía.'
                        ].map((comment: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => handleFeedbackChange(selectedStudent.id, comment)}
                            className="text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded border"
                          >
                            {comment}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-12">
                  <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona un estudiante
                  </h3>
                  <p className="text-gray-600">
                    Haz clic en un estudiante de la lista para comenzar a calificar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 