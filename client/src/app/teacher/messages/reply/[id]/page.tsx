'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  PaperAirplaneIcon,
  ArrowUturnLeftIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'

export default function ReplyMessagePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [replyText, setReplyText] = useState('')

  // Mock original message data
  const originalMessage = {
    id: params.id,
    from: 'Carmen Silva',
    fromRole: 'Apoderado de María González',
    subject: 'Consulta sobre tareas de matemáticas',
    content: 'Estimada profesora, me gustaría consultar sobre las tareas de matemáticas que ha estado enviando. María está teniendo algunas dificultades con las fracciones y me gustaría saber si hay material adicional que pueda revisar en casa.',
    timestamp: '2024-01-19T10:30:00Z',
    urgent: false
  }

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast.error('Por favor escribe una respuesta')
      return
    }

    toast.success('Respuesta enviada exitosamente')
    router.push('/teacher/messages')
  }

  const handleCancel = () => {
    router.push('/teacher/messages')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Responder Mensaje</h1>
            <p className="text-gray-600">Responde a: {originalMessage.from}</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSendReply} leftIcon={<PaperAirplaneIcon className="h-4 w-4" />}>
              Enviar Respuesta
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Message */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Mensaje Original</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">De:</div>
                  <div className="text-gray-900">{originalMessage.from}</div>
                  <div className="text-sm text-gray-500">{originalMessage.fromRole}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">Asunto:</div>
                  <div className="text-gray-900">{originalMessage.subject}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">Fecha:</div>
                  <div className="text-gray-900">
                    {new Date(originalMessage.timestamp).toLocaleString('es-ES')}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Mensaje:</div>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-900">
                    {originalMessage.content}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
                Tu Respuesta
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Reply Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Respuesta *
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivos adjuntos (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <PaperClipIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Arrastra archivos aquí o{' '}
                    <button className="text-blue-600 hover:underline">selecciona archivos</button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, JPG, PNG hasta 10MB
                  </p>
                </div>
              </div>

              {/* Quick Responses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Respuestas rápidas
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Gracias por tu consulta. Te responderé pronto.',
                    'He recibido tu mensaje y lo revisaré.',
                    'Coordinaremos una reunión para conversar sobre esto.',
                    'Te enviaré material adicional por correo.'
                  ].map((quickReply, index) => (
                    <button
                      key={index}
                      onClick={() => setReplyText(quickReply)}
                      className="text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded border"
                    >
                      {quickReply}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 