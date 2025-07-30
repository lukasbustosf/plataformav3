'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  PaperAirplaneIcon,
  PaperClipIcon,
  XMarkIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

export default function ComposeMessagePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    recipients: [] as string[],
    subject: '',
    message: '',
    urgent: false
  })
  const [attachments, setAttachments] = useState([])

  const recipientGroups = [
    { id: 'all_students', name: 'Todos los estudiantes', count: 150 },
    { id: 'class_8a', name: '8° A', count: 25 },
    { id: 'class_8b', name: '8° B', count: 27 },
    { id: 'parents_8a', name: 'Apoderados 8° A', count: 25 },
    { id: 'parents_8b', name: 'Apoderados 8° B', count: 27 }
  ]

  const handleSend = () => {
    if (!formData.subject || !formData.message || formData.recipients.length === 0) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    toast.success('Mensaje enviado exitosamente')
    router.push('/teacher/messages')
  }

  const handleCancel = () => {
    router.push('/teacher/messages')
  }

  const toggleRecipient = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.includes(groupId)
        ? prev.recipients.filter(id => id !== groupId)
        : [...prev.recipients, groupId]
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Redactar Mensaje</h1>
            <p className="text-gray-600">Envía un mensaje a estudiantes o apoderados</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSend} leftIcon={<PaperAirplaneIcon className="h-4 w-4" />}>
              Enviar Mensaje
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compose Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Destinatarios *
                </label>
                <div className="space-y-2">
                  {recipientGroups.map(group => (
                    <label key={group.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.recipients.includes(group.id)}
                        onChange={() => toggleRecipient(group.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <UsersIcon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{group.name}</div>
                        <div className="text-sm text-gray-500">{group.count} destinatarios</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Escribe el asunto del mensaje..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivos adjuntos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <PaperClipIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Arrastra archivos aquí o{' '}
                    <button className="text-blue-600 hover:underline">selecciona archivos</button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, JPG, PNG hasta 10MB
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="border-t pt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.urgent}
                    onChange={(e) => setFormData(prev => ({ ...prev, urgent: e.target.checked }))}
                    className="h-4 w-4 text-red-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Marcar como urgente</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Los mensajes urgentes aparecerán destacados y enviarán notificación inmediata
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vista Previa</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">Para:</div>
                  <div className="text-sm text-gray-600">
                    {formData.recipients.length === 0 
                      ? 'Sin destinatarios seleccionados'
                      : `${formData.recipients.length} grupo(s) seleccionado(s)`
                    }
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Asunto:</div>
                  <div className="text-sm text-gray-600">
                    {formData.subject || 'Sin asunto'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Mensaje:</div>
                  <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                    {formData.message || 'Sin mensaje'}
                  </div>
                </div>

                {formData.urgent && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-red-800">Mensaje Urgente</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 