'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  PhoneIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

// ===============================================
// INTERFACES & TYPES
// ===============================================

interface Message {
  message_id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_type: 'guardian' | 'teacher' | 'admin' | 'bienestar'
  recipient_id: string
  recipient_name: string
  subject?: string
  content: string
  message_type: 'text' | 'voice' | 'attachment' | 'meeting_request' | 'meeting_response'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'sent' | 'delivered' | 'read' | 'replied'
  read_at?: string
  attachments: MessageAttachment[]
  reply_to?: string
  created_at: string
  updated_at: string
}

interface MessageAttachment {
  attachment_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  thumbnail_url?: string
}

interface Conversation {
  conversation_id: string
  participants: Participant[]
  subject: string
  last_message: Message
  unread_count: number
  conversation_type: 'direct' | 'group' | 'support_case' | 'meeting_thread'
  status: 'active' | 'closed' | 'archived'
  created_at: string
  updated_at: string
}

interface Participant {
  user_id: string
  name: string
  role: string
  email: string
  avatar_url?: string
  online_status: 'online' | 'offline' | 'away'
  last_seen?: string
}

interface MeetingRequest {
  meeting_id: string
  requester_id: string
  requester_name: string
  teacher_id: string
  teacher_name: string
  student_id: string
  student_name: string
  subject: string
  description: string
  meeting_type: 'parent_teacher' | 'academic_support' | 'behavioral_concern' | 'general'
  preferred_dates: string[]
  duration_minutes: number
  meeting_mode: 'in_person' | 'video_call' | 'phone_call'
  status: 'pending' | 'accepted' | 'declined' | 'scheduled' | 'completed' | 'cancelled'
  scheduled_date?: string
  scheduled_time?: string
  location?: string
  video_link?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface SupportCase {
  case_id: string
  guardian_id: string
  student_id: string
  case_type: 'academic' | 'behavioral' | 'health' | 'transportation' | 'bullying' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  assigned_to?: string
  assigned_name?: string
  resolution?: string
  messages: Message[]
  attachments: MessageAttachment[]
  created_at: string
  updated_at: string
  resolved_at?: string
}

interface CommunicationHubProps {
  guardianId: string
  studentId: string
  studentName: string
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function CommunicationHub({
  guardianId,
  studentId,
  studentName
}: CommunicationHubProps) {
  const [activeTab, setActiveTab] = useState<'messages' | 'meetings' | 'support'>('messages')
  const [loading, setLoading] = useState(true)
  
  // Messages State
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({})
  const [newMessage, setNewMessage] = useState('')
  const [showNewConversation, setShowNewConversation] = useState(false)
  
  // Meetings State
  const [meetings, setMeetings] = useState<MeetingRequest[]>([])
  const [showNewMeeting, setShowNewMeeting] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRequest | null>(null)
  
  // Support Cases State
  const [supportCases, setSupportCases] = useState<SupportCase[]>([])
  const [showNewCase, setShowNewCase] = useState(false)
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null)
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'urgent'>('all')
  
  // Form States
  const [meetingForm, setMeetingForm] = useState({
    teacher_id: '',
    subject: '',
    description: '',
    meeting_type: 'parent_teacher' as const,
    preferred_dates: [''],
    duration_minutes: 30,
    meeting_mode: 'in_person' as const
  })
  
  const [caseForm, setCaseForm] = useState({
    case_type: 'academic' as const,
    priority: 'medium' as const,
    subject: '',
    description: '',
    attachments: [] as File[]
  })

  // ===============================================
  // LIFECYCLE & DATA LOADING
  // ===============================================

  useEffect(() => {
    loadInitialData()
  }, [guardianId, studentId])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadConversations(),
        loadMeetings(),
        loadSupportCases()
      ])
    } catch (error) {
      console.error('Failed to load communication data:', error)
      toast.error('Error al cargar datos de comunicación')
    } finally {
      setLoading(false)
    }
  }

  const loadConversations = async () => {
    try {
      const response = await fetch(`/api/guardian/conversations?student_id=${studentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      if (data.success) {
        setConversations(data.data)
        // Load messages for each conversation
        data.data.forEach((conv: Conversation) => {
          loadConversationMessages(conv.conversation_id)
        })
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/guardian/conversations/${conversationId}/messages`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => ({
          ...prev,
          [conversationId]: data.data
        }))
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const loadMeetings = async () => {
    try {
      const response = await fetch(`/api/guardian/meetings?student_id=${studentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      if (data.success) {
        setMeetings(data.data)
      }
    } catch (error) {
      console.error('Failed to load meetings:', error)
    }
  }

  const loadSupportCases = async () => {
    try {
      const response = await fetch(`/api/guardian/support-cases?student_id=${studentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      if (data.success) {
        setSupportCases(data.data)
      }
    } catch (error) {
      console.error('Failed to load support cases:', error)
    }
  }

  // ===============================================
  // MESSAGE FUNCTIONS
  // ===============================================

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await fetch('/api/guardian/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          conversation_id: selectedConversation,
          content: newMessage,
          message_type: 'text',
          priority: 'normal'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add message to local state
        const newMsg = data.data
        setMessages(prev => ({
          ...prev,
          [selectedConversation]: [...(prev[selectedConversation] || []), newMsg]
        }))
        
        // Update conversation last message
        setConversations(prev => 
          prev.map(conv => 
            conv.conversation_id === selectedConversation
              ? { ...conv, last_message: newMsg }
              : conv
          )
        )
        
        setNewMessage('')
        toast.success('Mensaje enviado')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Error al enviar mensaje')
    }
  }

  const markAsRead = async (conversationId: string) => {
    try {
      await fetch(`/api/guardian/conversations/${conversationId}/mark-read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.conversation_id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  // ===============================================
  // MEETING FUNCTIONS
  // ===============================================

  const requestMeeting = async () => {
    try {
      const response = await fetch('/api/guardian/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...meetingForm,
          student_id: studentId,
          requester_id: guardianId
        })
      })

      const data = await response.json()

      if (data.success) {
        setMeetings(prev => [data.data, ...prev])
        setShowNewMeeting(false)
        setMeetingForm({
          teacher_id: '',
          subject: '',
          description: '',
          meeting_type: 'parent_teacher',
          preferred_dates: [''],
          duration_minutes: 30,
          meeting_mode: 'in_person'
        })
        toast.success('Solicitud de reunión enviada')
      }
    } catch (error) {
      console.error('Failed to request meeting:', error)
      toast.error('Error al solicitar reunión')
    }
  }

  const respondToMeeting = async (meetingId: string, response: 'accept' | 'decline', notes?: string) => {
    try {
      const result = await fetch(`/api/guardian/meetings/${meetingId}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ response, notes })
      })

      const data = await result.json()

      if (data.success) {
        setMeetings(prev => 
          prev.map(meeting => 
            meeting.meeting_id === meetingId
              ? { ...meeting, status: response === 'accept' ? 'accepted' : 'declined', notes }
              : meeting
          )
        )
        toast.success(`Reunión ${response === 'accept' ? 'aceptada' : 'rechazada'}`)
      }
    } catch (error) {
      console.error('Failed to respond to meeting:', error)
      toast.error('Error al responder reunión')
    }
  }

  // ===============================================
  // SUPPORT CASE FUNCTIONS
  // ===============================================

  const createSupportCase = async () => {
    try {
      const formData = new FormData()
      formData.append('guardian_id', guardianId)
      formData.append('student_id', studentId)
      formData.append('case_type', caseForm.case_type)
      formData.append('priority', caseForm.priority)
      formData.append('subject', caseForm.subject)
      formData.append('description', caseForm.description)
      
      caseForm.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })

      const response = await fetch('/api/guardian/support-cases', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setSupportCases(prev => [data.data, ...prev])
        setShowNewCase(false)
        setCaseForm({
          case_type: 'academic',
          priority: 'medium',
          subject: '',
          description: '',
          attachments: []
        })
        toast.success('Caso de soporte creado')
      }
    } catch (error) {
      console.error('Failed to create support case:', error)
      toast.error('Error al crear caso de soporte')
    }
  }

  // ===============================================
  // RENDER FUNCTIONS
  // ===============================================

  const renderMessagesTab = () => {
    const filteredConversations = conversations.filter(conv => {
      if (searchTerm && !conv.subject.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (filterStatus === 'unread' && conv.unread_count === 0) return false
      if (filterStatus === 'urgent' && conv.last_message.priority !== 'urgent') return false
      return true
    })

    return (
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Conversaciones</h3>
              <Button size="sm" onClick={() => setShowNewConversation(true)}>
                <PlusIcon className="h-4 w-4 mr-1" />
                Nueva
              </Button>
            </div>
            
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full rounded-md border-gray-300 text-sm"
            >
              <option value="all">Todas las conversaciones</option>
              <option value="unread">Sin leer</option>
              <option value="urgent">Urgentes</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.conversation_id}
                onClick={() => {
                  setSelectedConversation(conversation.conversation_id)
                  if (conversation.unread_count > 0) {
                    markAsRead(conversation.conversation_id)
                  }
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.conversation_id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {conversation.subject}
                  </h4>
                  {conversation.unread_count > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {conversation.last_message.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {conversation.last_message.sender_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(conversation.last_message.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Message View */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Message Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {conversations.find(c => c.conversation_id === selectedConversation)?.subject}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Participantes: {conversations.find(c => c.conversation_id === selectedConversation)?.participants.map(p => p.name).join(', ')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(messages[selectedConversation] || []).map((message) => (
                  <div
                    key={message.message_id}
                    className={`flex ${message.sender_id === guardianId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === guardianId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.sender_id === guardianId ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Escribe tu mensaje..."
                      className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una conversación</h3>
                <p className="text-gray-500">Elige una conversación para comenzar a chatear</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderMeetingsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Reuniones</h3>
        <Button onClick={() => setShowNewMeeting(true)}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Solicitar Reunión
        </Button>
      </div>
      
      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <div key={meeting.meeting_id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{meeting.subject}</h4>
                <p className="text-sm text-gray-600">Con {meeting.teacher_name}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                meeting.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                meeting.status === 'accepted' ? 'bg-green-100 text-green-800' :
                meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {meeting.status === 'pending' ? 'Pendiente' :
                 meeting.status === 'accepted' ? 'Aceptada' :
                 meeting.status === 'scheduled' ? 'Programada' :
                 meeting.status === 'completed' ? 'Completada' :
                 'Rechazada'}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 mt-2">{meeting.description}</p>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Tipo:</span>
                <span className="ml-2 text-gray-600">{meeting.meeting_type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Duración:</span>
                <span className="ml-2 text-gray-600">{meeting.duration_minutes} min</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Modalidad:</span>
                <span className="ml-2 text-gray-600">{meeting.meeting_mode}</span>
              </div>
            </div>
            
            {meeting.status === 'scheduled' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">
                    {new Date(meeting.scheduled_date!).toLocaleDateString()} a las {meeting.scheduled_time}
                  </span>
                </div>
                {meeting.location && (
                  <p className="text-sm text-blue-700 mt-1">📍 {meeting.location}</p>
                )}
                {meeting.video_link && (
                  <a 
                    href={meeting.video_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center"
                  >
                    <VideoCameraIcon className="h-4 w-4 mr-1" />
                    Unirse a videollamada
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderSupportTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Casos de Soporte</h3>
        <Button onClick={() => setShowNewCase(true)}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Nuevo Caso
        </Button>
      </div>
      
      <div className="grid gap-4">
        {supportCases.map((supportCase) => (
          <div key={supportCase.case_id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{supportCase.subject}</h4>
                <p className="text-sm text-gray-600">Caso #{supportCase.case_id.slice(-8)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  supportCase.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  supportCase.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  supportCase.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {supportCase.priority === 'urgent' ? 'Urgente' :
                   supportCase.priority === 'high' ? 'Alta' :
                   supportCase.priority === 'medium' ? 'Media' :
                   'Baja'}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  supportCase.status === 'open' ? 'bg-blue-100 text-blue-800' :
                  supportCase.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  supportCase.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {supportCase.status === 'open' ? 'Abierto' :
                   supportCase.status === 'in_progress' ? 'En Progreso' :
                   supportCase.status === 'resolved' ? 'Resuelto' :
                   'Cerrado'}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mt-2">{supportCase.description}</p>
            
            {supportCase.assigned_name && (
              <div className="mt-3 flex items-center text-sm">
                <UserCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Asignado a: {supportCase.assigned_name}</span>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>Creado: {new Date(supportCase.created_at).toLocaleDateString()}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCase(supportCase)}
              >
                Ver Detalles
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando centro de comunicaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Centro de Comunicaciones</h2>
        <p className="text-sm text-gray-600">Comunícate con profesores y solicita reuniones para {studentName}</p>
        
        {/* Tabs */}
        <div className="mt-4">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'messages', label: 'Mensajes', icon: ChatBubbleLeftRightIcon },
              { id: 'meetings', label: 'Reuniones', icon: CalendarIcon },
              { id: 'support', label: 'Soporte', icon: ExclamationTriangleIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'messages' && renderMessagesTab()}
            {activeTab === 'meetings' && (
              <div className="p-6 h-full overflow-y-auto">
                {renderMeetingsTab()}
              </div>
            )}
            {activeTab === 'support' && (
              <div className="p-6 h-full overflow-y-auto">
                {renderSupportTab()}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Modals and dialogs would be rendered here */}
    </div>
  )
} 