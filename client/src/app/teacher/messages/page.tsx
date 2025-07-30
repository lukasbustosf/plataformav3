'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  BellIcon,
  UsersIcon,
  EyeIcon,
  ArrowUturnLeftIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'

export default function TeacherMessagesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('inbox')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  // Mock messages data
  const messages = [
    {
      id: 1,
      type: 'parent',
      from: 'Carmen Silva',
      fromRole: 'Apoderado de María González',
      subject: 'Consulta sobre tareas de matemáticas',
      preview: 'Estimada profesora, me gustaría consultar sobre las tareas...',
      content: 'Estimada profesora, me gustaría consultar sobre las tareas de matemáticas que ha estado enviando. María está teniendo algunas dificultades con las fracciones y me gustaría saber si hay material adicional que pueda revisar en casa.',
      timestamp: '2024-01-19T10:30:00Z',
      read: false,
      urgent: false,
      attachments: []
    },
    {
      id: 2,
      type: 'student',
      from: 'Carlos Ruiz',
      fromRole: 'Estudiante 7° B',
      subject: 'Duda sobre experimento de ciencias',
      preview: 'Profesora, tengo una duda sobre el experimento...',
      content: 'Profesora, tengo una duda sobre el experimento de densidad que vamos a hacer mañana. ¿Puedo usar aceite de cocina en lugar de aceite mineral? Es que no encontré aceite mineral en la farmacia.',
      timestamp: '2024-01-19T08:15:00Z',
      read: true,
      urgent: false,
      attachments: []
    },
    {
      id: 3,
      type: 'announcement',
      from: 'Sistema EDU21',
      fromRole: 'Notificación automática',
      subject: 'Recordatorio: Reunión de apoderados',
      preview: 'Se le recuerda que mañana viernes 20 de enero...',
      content: 'Se le recuerda que mañana viernes 20 de enero a las 19:00 hrs se realizará la reunión de apoderados del 8° A. Los temas a tratar incluyen el calendario de evaluaciones del segundo semestre y la planificación de actividades extracurriculares.',
      timestamp: '2024-01-18T16:45:00Z',
      read: true,
      urgent: true,
      attachments: ['agenda_reunion.pdf']
    }
  ]

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (selectedTab) {
      case 'inbox':
        return matchesSearch
      case 'unread':
        return matchesSearch && !message.read
      case 'urgent':
        return matchesSearch && message.urgent
      case 'parents':
        return matchesSearch && message.type === 'parent'
      case 'students':
        return matchesSearch && message.type === 'student'
      default:
        return matchesSearch
    }
  })

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'parent':
        return <UsersIcon className="h-5 w-5 text-blue-500" />
      case 'student':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />
      case 'announcement':
        return <BellIcon className="h-5 w-5 text-purple-500" />
      default:
        return <EnvelopeIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const handleNewMessage = () => {
    router.push('/teacher/messages/compose')
  }

  const handleMarkAsRead = (messageId: number) => {
    toast.success('Mensaje marcado como leído')
  }

  const handleReply = (messageId: number) => {
    router.push(`/teacher/messages/reply/${messageId}`)
  }

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.read).length,
    urgent: messages.filter(m => m.urgent).length,
    fromParents: messages.filter(m => m.type === 'parent').length
  }

  const tabs = [
    { id: 'inbox', name: 'Bandeja de Entrada', count: stats.total },
    { id: 'unread', name: 'No Leídos', count: stats.unread },
    { id: 'urgent', name: 'Urgentes', count: stats.urgent },
    { id: 'parents', name: 'Apoderados', count: stats.fromParents },
    { id: 'students', name: 'Estudiantes', count: messages.filter(m => m.type === 'student').length }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
            <p className="text-gray-600">Comunícate con estudiantes y apoderados</p>
          </div>
          <Button
            onClick={handleNewMessage}
            leftIcon={<PlusIcon className="h-4 w-4" />}
          >
            Nuevo Mensaje
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Mensajes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">No Leídos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BellIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Urgentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">De Apoderados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fromParents}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        selectedTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                      {tab.count > 0 && (
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                          selectedTab === tab.id 
                            ? 'bg-primary-100 text-primary-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar mensajes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Messages */}
              <div className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getMessageIcon(message.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <p className={`text-sm font-medium ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {message.from}
                            </p>
                            {message.urgent && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Urgente
                              </span>
                            )}
                            {!message.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{message.fromRole}</p>
                        <p className={`text-sm ${!message.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {message.subject}
                        </p>
                        <p className="text-sm text-gray-600 truncate mt-1">{message.preview}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMessages.length === 0 && (
                <div className="text-center py-12">
                  <EnvelopeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'No se encontraron mensajes que coincidan con tu búsqueda.' : 'Tu bandeja de entrada está vacía.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Detalle del Mensaje</h3>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {getMessageIcon(selectedMessage.type)}
                      <div>
                        <p className="font-medium text-gray-900">{selectedMessage.from}</p>
                        <p className="text-sm text-gray-600">{selectedMessage.fromRole}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{selectedMessage.subject}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(selectedMessage.timestamp).toLocaleString()}
                      </p>
                      {selectedMessage.urgent && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                          🚨 Mensaje Urgente
                        </span>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-700 whitespace-pre-line">{selectedMessage.content}</p>
                    </div>

                    {selectedMessage.attachments.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <h5 className="font-medium text-gray-900 mb-2">Archivos adjuntos:</h5>
                        <div className="space-y-2">
                          {selectedMessage.attachments.map((attachment: any, index: number) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-blue-600">
                              <span>📎</span>
                              <span>{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      {!selectedMessage.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(selectedMessage.id)}
                          leftIcon={<EyeIcon className="h-4 w-4" />}
                          className="w-full"
                        >
                          Marcar como Leído
                        </Button>
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReply(selectedMessage.id)}
                        leftIcon={<ArrowUturnLeftIcon className="h-4 w-4" />}
                        className="w-full"
                      >
                        Responder
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center">
                  <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un mensaje</h3>
                  <p className="text-gray-600">Haz clic en un mensaje de la lista para ver su contenido completo.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 