'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function EditAssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  
  // Mock data - in real app would fetch from API
  const [formData, setFormData] = useState({
    title: 'Ensayo sobre la Independencia de Chile',
    subject: 'Historia',
    description: 'Escribir un ensayo de 500 palabras sobre los principales eventos de la Independencia de Chile.',
    instructions: 'El ensayo debe incluir introducción, desarrollo y conclusión. Citar al menos 3 fuentes bibliográficas.',
    dueDate: '2024-01-25',
    dueTime: '23:59',
    maxGrade: 7.0,
    submissionType: 'file',
    allowLateSubmission: true,
    lateSubmissionPenalty: 10
  })

  const subjects = ['Matemáticas', 'Historia', 'Ciencias', 'Lenguaje', 'Inglés', 'Arte', 'Ed. Física']

  const handleSave = () => {
    if (!formData.title || !formData.subject || !formData.description || !formData.dueDate) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    toast.success('Tarea actualizada exitosamente')
    router.push(`/teacher/assignments/${params.id}`)
  }

  const handleCancel = () => {
    router.push(`/teacher/assignments/${params.id}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Tarea</h1>
            <p className="text-gray-600">Modifica los detalles de la tarea</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel} leftIcon={<XMarkIcon className="h-4 w-4" />}>
              Cancelar
            </Button>
            <Button onClick={handleSave} leftIcon={<CheckIcon className="h-4 w-4" />}>
              Guardar Cambios
            </Button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Tarea *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materia *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrucciones
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Entrega *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Entrega
                </label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota Máxima
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  step="0.1"
                  value={formData.maxGrade}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxGrade: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 