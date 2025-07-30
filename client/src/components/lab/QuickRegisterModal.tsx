'use client'

import React, { useState } from 'react'
import { X, Upload, Camera, Mic, MicOff, Clock, Users } from 'lucide-react'

interface QuickRegisterModalProps {
  activity: {
    id: string
    title: string
    cover_image_url: string
    duration_minutes: number
    group_size: number
  } | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: RegisterExecutionData) => Promise<void>
  userCourses: Array<{
    id: string
    name: string
    level: string
  }>
}

interface RegisterExecutionData {
  activity_id: string
  course_id: string
  student_count: number
  notes?: string
  success_rating: number
  engagement_rating?: number
  difficulty_perceived?: number
  would_repeat?: boolean
  location?: string
  adaptations_made?: string
  evidence_files?: File[]
}

export function QuickRegisterModal({
  activity,
  isOpen,
  onClose,
  onSubmit,
  userCourses
}: QuickRegisterModalProps) {
  const [formData, setFormData] = useState<Partial<RegisterExecutionData>>({
    student_count: activity?.group_size || 20,
    success_rating: 4,
    engagement_rating: 4,
    difficulty_perceived: 3,
    would_repeat: true,
    location: 'classroom'
  })
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordedText, setRecordedText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when activity changes
  React.useEffect(() => {
    if (activity) {
      setFormData({
        student_count: activity.group_size || 20,
        success_rating: 4,
        engagement_rating: 4,
        difficulty_perceived: 3,
        would_repeat: true,
        location: 'classroom'
      })
      setEvidenceFiles([])
      setRecordedText('')
    }
  }, [activity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activity || !formData.course_id) return

    setIsSubmitting(true)
    try {
      const submitData: RegisterExecutionData = {
        activity_id: activity.id,
        course_id: formData.course_id,
        student_count: formData.student_count || 20,
        notes: formData.notes || recordedText,
        success_rating: formData.success_rating || 4,
        engagement_rating: formData.engagement_rating,
        difficulty_perceived: formData.difficulty_perceived,
        would_repeat: formData.would_repeat,
        location: formData.location,
        adaptations_made: formData.adaptations_made,
        evidence_files: evidenceFiles
      }

      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Error submitting execution:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })
    
    setEvidenceFiles(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
  }

  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index))
  }

  const startVoiceRecording = async () => {
    try {
      // Simulación de grabación de voz (requiere implementación real con Web Speech API)
      setIsRecording(true)
      // Aquí iría la implementación real de grabación de voz
      setTimeout(() => {
        setIsRecording(false)
        setRecordedText('Excelente participación de los niños. Les gustó mucho trabajar con los bloques lógicos.')
      }, 3000)
    } catch (error) {
      console.error('Error starting voice recording:', error)
      setIsRecording(false)
    }
  }

  const getRatingEmoji = (rating: number) => {
    const emojis = ['😞', '😕', '😐', '😊', '🤩']
    return emojis[rating - 1] || '😐'
  }

  if (!isOpen || !activity) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {activity.cover_image_url ? (
                <img 
                  src={activity.cover_image_url} 
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">🧪</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Registrar Ejecución
              </h2>
              <p className="text-sm text-gray-600">{activity.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Curso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso *
              </label>
              <select
                required
                value={formData.course_id || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, course_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar curso</option>
                {userCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} - {course.level}
                  </option>
                ))}
              </select>
            </div>

            {/* Número de estudiantes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Estudiantes participantes *
              </label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={formData.student_count || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, student_count: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Calificaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">¿Cómo resultó?</h3>
            
            {/* Éxito general */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Éxito general *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, success_rating: rating }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.success_rating === rating
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{getRatingEmoji(rating)}</span>
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.success_rating ? getRatingEmoji(formData.success_rating) : ''}
                </span>
              </div>
            </div>

            {/* Engagement de estudiantes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de engagement estudiantes
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={formData.engagement_rating || 4}
                onChange={(e) => setFormData(prev => ({ ...prev, engagement_rating: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Bajo</span>
                <span>Medio</span>
                <span>Alto</span>
              </div>
            </div>

            {/* Dificultad percibida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificultad percibida
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={formData.difficulty_perceived || 3}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty_perceived: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Muy fácil</span>
                <span>Adecuada</span>
                <span>Muy difícil</span>
              </div>
            </div>
          </div>

          {/* Notas y observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas y observaciones
            </label>
            <div className="relative">
              <textarea
                value={formData.notes || recordedText}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Describe cómo fue la actividad, qué funcionó bien, qué mejorarías..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={startVoiceRecording}
                disabled={isRecording}
                className={`absolute bottom-2 right-2 p-2 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
            {isRecording && (
              <p className="text-sm text-red-600 mt-1">
                🎤 Grabando... (funcionalidad de demostración)
              </p>
            )}
          </div>

          {/* Evidencias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidencias (fotos/videos)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="evidence-upload"
              />
              <label
                htmlFor="evidence-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Arrastra archivos aquí o haz clic para seleccionar
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Máximo 5 archivos, 10MB cada uno
                </span>
              </label>
            </div>

            {/* Preview de archivos */}
            {evidenceFiles.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                {evidenceFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pregunta de repetición */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.would_repeat || false}
                onChange={(e) => setFormData(prev => ({ ...prev, would_repeat: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-gray-700">
                ¿Volverías a realizar esta actividad?
              </span>
            </label>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.course_id}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Registrando...' : '✅ Registrar Ejecución'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 