'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  EnvelopeIcon,
  InboxIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  AcademicCapIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'

export default function StudentMessages() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('inbox')
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyText, setReplyText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const messages = [
    {
      id: 1,
      subject: 'Recordatorio: Evaluación de Matemáticas',
      sender: 'Prof. García',
      senderType: 'teacher',
      content: 'Recordatorio que mañana tenemos la evaluación de ecuaciones lineales. Recuerden traer calculadora y lápiz de mina.',
      timestamp: '2024-01-20T10:30:00Z',
      read: false,
      urgent: true,
      attachments: [
        { name: 'Temario evaluación.pdf', size: '125 KB' }
      ]
    },
    {
      id: 2,
      subject: 'Felicitaciones por tu progreso',
      sender: 'Prof. Silva',
      senderType: 'teacher',
      content: 'Hola! Quería felicitarte por tu excelente desempeño en el último ensayo. Tu análisis literario fue muy profundo.',
      timestamp: '2024-01-19T15:45:00Z',
      read: true,
      urgent: false
    },
    {
      id: 3,
      subject: 'Información reunión de apoderados',
      sender: 'Dirección Académica',
      senderType: 'admin',
      content: 'Estimados estudiantes, por favor informen a sus apoderados sobre la reunión del próximo viernes 26 de enero a las 19:00 hrs.',
      timestamp: '2024-01-18T09:00:00Z',
      read: true,
      urgent: false
    },
    {
      id: 4,
      subject: 'Proyecto de Ciencias - Prórroga',
      sender: 'Prof. Martínez',
      senderType: 'teacher',
      content: 'Debido a las dificultades con los materiales, extendemos la fecha de entrega del proyecto una semana más.',
      timestamp: '2024-01-17T14:20:00Z',
      read: false,
      urgent: false
    },
    {
      id: 5,
      subject: 'Invitación: Taller de Inglés Conversacional',
      sender: 'Prof. Brown',
      senderType: 'teacher',
      content: 'Te invito al taller extracurricular de conversación en inglés. Será los miércoles de 15:30 a 16:30.',
      timestamp: '2024-01-16T11:10:00Z',
      read: true,
      urgent: false
    }
  ]

  const conversations = [
    {
      id: 1,
      participant: 'Prof. García',
      participantType: 'teacher',
      lastMessage: 'Perfecto, nos vemos en la próxima clase',
      timestamp: '2024-01-20T16:45:00Z',
      unread: 0
    },
    {
      id: 2,
      participant: 'Prof. Silva',
      participantType: 'teacher',
      lastMessage: 'Gracias por la aclaración sobre el ensayo',
      timestamp: '2024-01-19T12:30:00Z',
      unread: 1
    }
  ]

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case 'teacher':
        return <AcademicCapIcon className="h-5 w-5 text-blue-600" />
      case 'admin':
        return <UserGroupIcon className="h-5 w-5 text-purple-600" />
      default:
        return <EnvelopeIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getSenderBadgeColor = (senderType: string) => {
    switch (senderType) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800'
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTab = activeTab === 'inbox' ||
                      (activeTab === 'unread' && !message.read) ||
                      (activeTab === 'urgent' && message.urgent) ||
                      (activeTab === 'teachers' && message.senderType === 'teacher')
    
    return matchesSearch && matchesTab
  })

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.read).length,
    urgent: messages.filter(m => m.urgent).length,
    fromTeachers: messages.filter(m => m.senderType === 'teacher').length
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Hace unos minutos'
    if (diffHours < 24) return `Hace ${diffHours} horas`
    if (diffHours < 48) return 'Ayer'
    return date.toLocaleDateString()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">💬 Mensajes</h1>
              <p className="mt-1 text-sm text-gray-600">
                Comunicación con profesores y anuncios importantes
              </p>
            </div>
            <Button
              leftIcon={<PaperAirplaneIcon className="h-4 w-4" />}
            >
              Nuevo Mensaje
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <InboxIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">No Leídos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Urgentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">De Profesores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fromTeachers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar mensajes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="p-4">
                <nav className="space-y-1">
                  {[
                    { key: 'inbox', label: 'Bandeja de Entrada', count: stats.total },
                    { key: 'unread', label: 'No Leídos', count: stats.unread },
                    { key: 'urgent', label: 'Urgentes', count: stats.urgent },
                    { key: 'teachers', label: 'De Profesores', count: stats.fromTeachers }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.key
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeTab === tab.key
                          ? 'bg-primary-200 text-primary-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {activeTab === 'inbox' && 'Bandeja de Entrada'}
                  {activeTab === 'unread' && 'Mensajes No Leídos'}
                  {activeTab === 'urgent' && 'Mensajes Urgentes'}
                  {activeTab === 'teachers' && 'Mensajes de Profesores'}
                  {' '}({filteredMessages.length})
                </h2>
              </div>

              {filteredMessages.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                      className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !message.read ? 'bg-blue-50' : ''
                      } ${selectedMessage?.id === message.id ? 'bg-primary-50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex-shrink-0">
                            {getSenderIcon(message.senderType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className={`text-sm font-medium truncate ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {message.sender}
                              </p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSenderBadgeColor(message.senderType)}`}>
                                {message.senderType === 'teacher' ? 'Profesor' : 'Administración'}
                              </span>
                              {message.urgent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Urgente
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mb-2 ${!message.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                              {message.subject}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {message.content}
                            </p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span>📎 {message.attachments.length} archivo(s) adjunto(s)</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(message.timestamp)}
                          </span>
                          {!message.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Message Content */}
                      {selectedMessage?.id === message.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="prose prose-sm max-w-none">
                            <p>{message.content}</p>
                          </div>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Archivos adjuntos:</h4>
                              <div className="space-y-2">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center space-x-2 text-sm">
                                    <span>📄</span>
                                    <span className="text-blue-600 hover:underline cursor-pointer">
                                      {attachment.name}
                                    </span>
                                    <span className="text-gray-500">({attachment.size})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Reply Section */}
                          <div className="mt-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-1">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Escribe tu respuesta..."
                                  rows={3}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                              </div>
                              <Button
                                size="sm"
                                leftIcon={<PaperAirplaneIcon className="h-4 w-4" />}
                                disabled={!replyText.trim()}
                              >
                                Responder
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes</h3>
                  <p className="text-gray-600">
                    {activeTab === 'inbox' 
                      ? 'No tienes mensajes en tu bandeja de entrada.'
                      : `No hay mensajes en la categoría "${activeTab}".`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 