'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  ClockIcon,
  AcademicCapIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function CreateLessonPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    date: '',
    startTime: '',
    endTime: '',
    objectives: [''],
    materials: [''],
    activities: [{ name: '', duration: '', description: '' }],
    assessment: '',
    homework: '',
    notes: ''
  })

  const subjects = ['Matemáticas', 'Historia', 'Ciencias', 'Lenguaje', 'Inglés', 'Arte', 'Ed. Física']
  const classes = ['8° A', '8° B', '7° A', '7° B']

  const handleAddObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }))
  }

  const handleRemoveObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const handleObjectiveChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }))
  }

  const handleAddMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, '']
    }))
  }

  const handleRemoveMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }))
  }

  const handleMaterialChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map((mat, i) => i === index ? value : mat)
    }))
  }

  const handleAddActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, { name: '', duration: '', description: '' }]
    }))
  }

  const handleRemoveActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }))
  }

  const handleActivityChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((act, i) => 
        i === index ? { ...act, [field]: value } : act
      )
    }))
  }

  const handleSave = () => {
    if (!formData.title || !formData.subject || !formData.class || !formData.date) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    toast.success('Lección creada exitosamente')
    router.push('/teacher/lesson')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Crear Nueva Lección</h1>
            <p className="text-gray-600">Planifica una clase detallada para tus estudiantes</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => router.push('/teacher/lesson')}>
              Cancelar
            </Button>
            <Button onClick={handleSave} leftIcon={<PlusIcon className="h-4 w-4" />}>
              Crear Lección
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Información Básica</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Lección *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Introducción a las ecuaciones lineales"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Materia *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clase *
                    </label>
                    <select
                      value={formData.class}
                      onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar</option>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Inicio
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Fin
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Objetivos de Aprendizaje</h3>
                <Button size="sm" onClick={handleAddObjective} leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Agregar
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                        placeholder="Describe un objetivo de aprendizaje..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {formData.objectives.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveObjective(index)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Materiales Necesarios</h3>
                <Button size="sm" onClick={handleAddMaterial} leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Agregar
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => handleMaterialChange(index, e.target.value)}
                        placeholder="Ej: Pizarra, calculadoras, hojas de trabajo..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {formData.materials.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveMaterial(index)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Actividades</h3>
                <Button size="sm" onClick={handleAddActivity} leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Agregar Actividad
                </Button>
              </div>
              
              <div className="space-y-6">
                {formData.activities.map((activity, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Actividad {index + 1}</h4>
                      {formData.activities.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveActivity(index)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de la Actividad
                        </label>
                        <input
                          type="text"
                          value={activity.name}
                          onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                          placeholder="Ej: Ejercicios prácticos"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duración (minutos)
                        </label>
                        <input
                          type="number"
                          value={activity.duration}
                          onChange={(e) => handleActivityChange(index, 'duration', e.target.value)}
                          placeholder="30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={activity.description}
                        onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                        placeholder="Describe la actividad en detalle..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assessment */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluación</h3>
              <textarea
                value={formData.assessment}
                onChange={(e) => setFormData(prev => ({ ...prev, assessment: e.target.value }))}
                placeholder="¿Cómo evaluarás el aprendizaje en esta lección?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Homework */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tarea para Casa</h3>
              <textarea
                value={formData.homework}
                onChange={(e) => setFormData(prev => ({ ...prev, homework: e.target.value }))}
                placeholder="Define la tarea que asignarás..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notas Adicionales</h3>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Observaciones, recordatorios, etc..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 