'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  PencilIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock assignment data
  const assignment = {
    id: params.id,
    title: 'Ensayo sobre la Independencia de Chile',
    subject: 'Historia',
    description: 'Escribir un ensayo de 500 palabras sobre los principales eventos de la Independencia de Chile.',
    instructions: 'El ensayo debe incluir introducción, desarrollo y conclusión. Citar al menos 3 fuentes bibliográficas.',
    dueDate: '2024-01-25T23:59:00Z',
    createdDate: '2024-01-15T09:00:00Z',
    maxGrade: 7.0,
    submissionType: 'file',
    allowLateSubmission: true,
    lateSubmissionPenalty: 10,
    status: 'active',
    classes: ['8° A', '8° B'],
    totalStudents: 52,
    submittedCount: 35,
    pendingCount: 17,
    lateCount: 3,
    averageGrade: 5.8
  }

  const submissions = [
    {
      id: 1,
      studentName: 'María González',
      studentClass: '8° A',
      submittedAt: '2024-01-24T20:15:00Z',
      status: 'submitted',
      grade: 6.5,
      isLate: false,
      hasFiles: true,
      fileCount: 2
    },
    {
      id: 2,
      studentName: 'Carlos Ruiz',
      studentClass: '8° A',
      submittedAt: '2024-01-25T10:30:00Z',
      status: 'submitted',
      grade: null,
      isLate: false,
      hasFiles: true,
      fileCount: 1
    },
    {
      id: 3,
      studentName: 'Ana Silva',
      studentClass: '8° B',
      submittedAt: null,
      status: 'pending',
      grade: null,
      isLate: false,
      hasFiles: false,
      fileCount: 0
    },
    {
      id: 4,
      studentName: 'Diego Morales',
      studentClass: '8° A',
      submittedAt: '2024-01-26T08:00:00Z',
      status: 'submitted',
      grade: 5.2,
      isLate: true,
      hasFiles: true,
      fileCount: 1
    }
  ]

  const getStatusInfo = (status: string, isLate: boolean) => {
    if (status === 'submitted' && isLate) {
      return { text: 'Entregado Tarde', color: 'text-orange-600 bg-orange-100', icon: <ExclamationTriangleIcon className="h-4 w-4" /> }
    }
    if (status === 'submitted') {
      return { text: 'Entregado', color: 'text-green-600 bg-green-100', icon: <CheckCircleIcon className="h-4 w-4" /> }
    }
    return { text: 'Pendiente', color: 'text-yellow-600 bg-yellow-100', icon: <ClockIcon className="h-4 w-4" /> }
  }

  const handleEdit = () => {
    router.push(`/teacher/assignments/${params.id}/edit`)
  }

  const handleGrade = () => {
    router.push(`/teacher/assignments/${params.id}/grade`)
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <UserGroupIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{assignment.totalStudents}</div>
          <div className="text-sm text-blue-600">Total Estudiantes</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{assignment.submittedCount}</div>
          <div className="text-sm text-green-600">Entregadas</div>
          <div className="text-xs text-green-500 mt-1">
            {Math.round((assignment.submittedCount / assignment.totalStudents) * 100)}%
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6 text-center">
          <ClockIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-900">{assignment.pendingCount}</div>
          <div className="text-sm text-yellow-600">Pendientes</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{assignment.averageGrade}</div>
          <div className="text-sm text-purple-600">Promedio</div>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles de la Tarea</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Descripción</div>
              <div className="text-gray-900 mt-1">{assignment.description}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Instrucciones</div>
              <div className="text-gray-900 mt-1">{assignment.instructions}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Fecha de Entrega</div>
              <div className="text-gray-900 mt-1">
                {new Date(assignment.dueDate).toLocaleString('es-ES')}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Nota Máxima</div>
              <div className="text-gray-900 mt-1">{assignment.maxGrade}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Clases Asignadas</div>
              <div className="text-gray-900 mt-1">{assignment.classes.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSubmissionsTab = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Entregas de Estudiantes</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entregado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nota
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => {
              const statusInfo = getStatusInfo(submission.status, submission.isLate)
              
              return (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{submission.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {submission.studentClass}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.text}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {submission.submittedAt 
                      ? new Date(submission.submittedAt).toLocaleString('es-ES')
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.grade ? (
                      <span className="text-sm font-medium text-gray-900">{submission.grade}</span>
                    ) : (
                      <span className="text-sm text-gray-500">Sin calificar</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {submission.status === 'submitted' && (
                      <Button size="sm" variant="outline" leftIcon={<EyeIcon className="h-4 w-4" />}>
                        Ver
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
            <p className="text-gray-600">{assignment.subject} • Creada el {new Date(assignment.createdDate).toLocaleDateString('es-ES')}</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleEdit} leftIcon={<PencilIcon className="h-4 w-4" />}>
              Editar
            </Button>
            <Button onClick={handleGrade} leftIcon={<DocumentTextIcon className="h-4 w-4" />}>
              Calificar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Resumen' },
              { id: 'submissions', name: 'Entregas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'submissions' && renderSubmissionsTab()}
      </div>
    </DashboardLayout>
  )
} 