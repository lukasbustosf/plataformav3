'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  BellIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PaperClipIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState('1')
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState('conversations')
  const [showNewMessage, setShowNewMessage] = useState(false)

  // Mock data for conversations
  const conversations = [
    {
      id: '1',
      participant: 'Prof. María González',
      role: 'Profesora Jefe',
      subject: 'Consulta sobre rendimiento',
      lastMessage: 'Gracias por su consulta. Sofía ha mostrado una mejora considerable en matemáticas.',
      timestamp: '2024-12-16 14:30',
      unread: 0,
      priority: 'normal',
      avatar: 'MG'
    },
    {
      id: '2',
      participant: 'Prof. Carlos Pérez',
      role: 'Profesor Matemáticas',
      subject: 'Tareas pendientes',
      lastMessage: 'Le recuerdo que Sofía tiene una tarea pendiente de álgebra para el viernes.',
      timestamp: '2024-12-15 16:45',
      unread: 1,
      priority: 'high',
      avatar: 'CP'
    },
    {
      id: '3',
      participant: 'Secretaría Académica',
      role: 'Administración',
      subject: 'Reunión de Apoderados',
      lastMessage: 'Se le confirma su asistencia a la reunión del 20 de diciembre a las 19:00.',
      timestamp: '2024-12-14 10:20',
      unread: 0,
      priority: 'normal',
      avatar: 'SA'
    },
    {
      id: '4',
      participant: 'Prof. Ana Rodríguez',
      role: 'Profesora Ciencias',
      subject: 'Proyecto de laboratorio',
      lastMessage: 'Excelente trabajo de Sofía en el proyecto de química. Felicitaciones.',
      timestamp: '2024-12-13 12:15',
      unread: 0,
      priority: 'normal',
      avatar: 'AR'
    }
  ]

  const messages: { [key: string]: any[] } = {
    '1': [
      {
        id: 1,
        sender: 'Prof. María González',
        content: 'Buenos días. He notado que Sofía ha estado muy participativa en clases. ¿Hay algo específico que la esté motivando?',
        timestamp: '2024-12-16 09:15',
        type: 'received'
      },
      {
        id: 2,
        sender: 'Usted',
        content: 'Buenos días, profesora. Sí, hemos estado trabajando en casa con material adicional de matemáticas y está muy entusiasmada.',
        timestamp: '2024-12-16 10:30',
        type: 'sent'
      },
      {
        id: 3,
        sender: 'Prof. María González',
        content: 'Gracias por su consulta. Sofía ha mostrado una mejora considerable en matemáticas.',
        timestamp: '2024-12-16 14:30',
        type: 'received'
      }
    ],
    '2': [
      {
        id: 1,
        sender: 'Prof. Carlos Pérez',
        content: 'Le recuerdo que Sofía tiene una tarea pendiente de álgebra para el viernes.',
        timestamp: '2024-12-15 16:45',
        type: 'received'
      }
    ]
  }

  const notifications = [
    {
      id: 1,
      type: 'academic',
      title: 'Nueva calificación registrada',
      message: 'Sofía obtuvo un 6.5 en el quiz de matemáticas',
      timestamp: '2024-12-16 11:30',
      read: false,
      sender: 'Sistema Académico'
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Registro de asistencia',
      message: 'Sofía llegó 10 minutos tarde hoy',
      timestamp: '2024-12-16 08:10',
      read: false,
      sender: 'Control Asistencia'
    },
    {
      id: 3,
      type: 'announcement',
      title: 'Suspensión de clases',
      message: 'Se suspenden las clases el viernes 22 por capacitación docente',
      timestamp: '2024-12-15 14:20',
      read: true,
      sender: 'Dirección'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Logro desbloqueado',
      message: 'Sofía completó el desafío "Matemático del Mes"',
      timestamp: '2024-12-14 16:45',
      read: true,
      sender: 'Plataforma Gamificada'
    }
  ]

  const teachers = [
    { id: 'mg', name: 'Prof. María González', subject: 'Profesora Jefe / Lenguaje' },
    { id: 'cp', name: 'Prof. Carlos Pérez', subject: 'Matemáticas' },
    { id: 'ar', name: 'Prof. Ana Rodríguez', subject: 'Ciencias' },
    { id: 'lf', name: 'Prof. Luis Fernández', subject: 'Historia' },
    { id: 'js', name: 'Prof. Jennifer Smith', subject: 'Inglés' }
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast.loading('Enviando mensaje...')
      
      setTimeout(() => {
        toast.dismiss()
        toast.success('Mensaje enviado exitosamente')
        
        // Add message to conversation
        const newMsg = {
          id: Date.now(),
          content: newMessage,
          type: 'sent',
          timestamp: new Date().toISOString()
        }
        
        // Update messages state (simulate)
        setNewMessage('')
        
        // Auto-response simulation
        setTimeout(() => {
          toast('El profesor responderá pronto a tu mensaje', {
            icon: '📩',
            duration: 3000
          })
        }, 1000)
      }, 1500)
    } else {
      toast.error('Por favor escribe un mensaje antes de enviar')
    }
  }

  const handleMarkAllRead = () => {
    toast.success('Todas las notificaciones marcadas como leídas')
    // Update notifications state (simulate)
    setTimeout(() => {
      toast('✅ Centro de notificaciones actualizado', {
        duration: 2000
      })
    }, 500)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      default: return 'border-l-gray-300'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'academic': return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
      case 'attendance': return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'announcement': return <InformationCircleIcon className="h-5 w-5 text-purple-500" />
      case 'achievement': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      default: return <BellIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    const colors: { [key: string]: string } = {
      academic: 'border-blue-200 bg-blue-50',
      attendance: 'border-yellow-200 bg-yellow-50',
      announcement: 'border-purple-200 bg-purple-50',
      achievement: 'border-green-200 bg-green-50'
    }
    return colors[type] || 'border-gray-200 bg-gray-50'
  }

  const selectedConversationData = conversations.find(c => c.id === selectedConversation)
  const conversationMessages = messages[selectedConversation] || []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Comunicaciones 💬</h1>
          <p className="mt-2 opacity-90">
            Mantente en contacto con los profesores y recibe notificaciones importantes
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('conversations')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'conversations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                Conversaciones
                {conversations.some(c => c.unread > 0) && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {conversations.reduce((acc, c) => acc + c.unread, 0)}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BellIcon className="h-5 w-5 inline mr-2" />
                Notificaciones
                {notifications.some(n => !n.read) && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'conversations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Conversaciones</h2>
                    <Button
                      size="sm"
                      onClick={() => setShowNewMessage(true)}
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Nuevo
                    </Button>
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar conversaciones..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                        selectedConversation === conversation.id ? 'bg-blue-50' : ''
                      } ${getPriorityColor(conversation.priority)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {conversation.avatar}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.participant}
                            </p>
                            {conversation.unread > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{conversation.role}</p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(conversation.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversation View */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg h-96 flex flex-col">
                {selectedConversationData ? (
                  <>
                    {/* Conversation Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {selectedConversationData.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {selectedConversationData.participant}
                          </h3>
                          <p className="text-sm text-gray-600">{selectedConversationData.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {conversationMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.type === 'sent'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Escribe tu mensaje..."
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage}>
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Selecciona una conversación para comenzar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Notificaciones</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllRead}
                >
                  Marcar todas como leídas
                </Button>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{notification.sender}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* New Message Modal */}
        {showNewMessage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Mensaje</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destinatario
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>Seleccionar profesor...</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.subject}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asunto
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Escribe el asunto..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Escribe tu mensaje..."
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewMessage(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={() => {
                    toast.loading('Enviando mensaje...')
                    setTimeout(() => {
                      toast.dismiss()
                      toast.success('Mensaje enviado exitosamente')
                      setShowNewMessage(false)
                    }, 1500)
                  }}>
                    Enviar Mensaje
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 
