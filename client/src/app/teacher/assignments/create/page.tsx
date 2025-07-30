'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  CalendarIcon,
  DocumentTextIcon,
  PaperClipIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function CreateAssignmentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    instructions: '',
    dueDate: '',
    dueTime: '',
    maxGrade: 7.0,
    submissionType: 'file', // file, text, both
    classes: [] as string[],
    rubric: '',
    allowLateSubmission: true,
    lateSubmissionPenalty: 10
  })

  const subjects = ['Matemáticas', 'Historia', 'Ciencias', 'Lenguaje', 'Inglés', 'Arte', 'Ed. Física']
  const classes = [
    { id: '8a', name: '8° A', students: 25 },
    { id: '8b', name: '8° B', students: 27 },
    { id: '7a', name: '7° A', students: 23 },
    { id: '7b', name: '7° B', students: 26 }
  ]

  const handleSubmit = () => {
    if (!formData.title || !formData.subject || !formData.description || !formData.dueDate) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (formData.classes.length === 0) {
      toast.error('Por favor selecciona al menos una clase')
      return
    }

    toast.success('Tarea creada exitosamente')
    router.push('/teacher/assignments')
  }

  const toggleClass = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(classId)
        ? prev.classes.filter(id => id !== classId)
        : [...prev.classes, classId]
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Crear Nueva Tarea</h1>
            <p className="text-gray-600">Define una nueva asignación para tus estudiantes</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => router.push('/teacher/assignments')}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} leftIcon={<PlusIcon className="h-4 w-4" />}>
              Crear Tarea
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Información Básica</h3>
              
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
                      placeholder="Ej: Ensayo sobre la Independencia"
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
                      <option value="">Seleccionar materia</option>
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
                    placeholder="Describe brevemente la tarea..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instrucciones Detalladas
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Proporciona instrucciones específicas para completar la tarea..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Due Date & Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración de Entrega</h3>
              
              <div className="space-y-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Entrega
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'file', label: 'Solo archivos' },
                      { value: 'text', label: 'Solo texto' },
                      { value: 'both', label: 'Archivos y texto' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="submissionType"
                          value={option.value}
                          checked={formData.submissionType === option.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, submissionType: e.target.value }))}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.allowLateSubmission}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowLateSubmission: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Permitir entregas tardías</span>
                  </label>
                  
                  {formData.allowLateSubmission && (
                    <div className="mt-3 ml-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Penalización por día de atraso (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.lateSubmissionPenalty}
                        onChange={(e) => setFormData(prev => ({ ...prev, lateSubmissionPenalty: parseInt(e.target.value) }))}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rubric */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Rúbrica de Evaluación</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Criterios de Evaluación (opcional)
                </label>
                <textarea
                  value={formData.rubric}
                  onChange={(e) => setFormData(prev => ({ ...prev, rubric: e.target.value }))}
                  placeholder="Define los criterios de evaluación y ponderaciones..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Classes */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asignar a Clases *</h3>
              
              <div className="space-y-3">
                {classes.map(classItem => (
                  <label key={classItem.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.classes.includes(classItem.id)}
                      onChange={() => toggleClass(classItem.id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{classItem.name}</div>
                      <div className="text-sm text-gray-500">{classItem.students} estudiantes</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Título:</span>
                  <div className="text-gray-600">{formData.title || 'Sin título'}</div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Materia:</span>
                  <div className="text-gray-600">{formData.subject || 'Sin seleccionar'}</div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Entrega:</span>
                  <div className="text-gray-600">
                    {formData.dueDate 
                      ? `${new Date(formData.dueDate).toLocaleDateString('es-ES')} ${formData.dueTime || ''}`
                      : 'Sin fecha'
                    }
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Clases:</span>
                  <div className="text-gray-600">
                    {formData.classes.length === 0 
                      ? 'Ninguna seleccionada'
                      : `${formData.classes.length} clase(s)`
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 