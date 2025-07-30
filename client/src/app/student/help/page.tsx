'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  QuestionMarkCircleIcon,
  BookOpenIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export default function StudentHelp() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todas las categorías', count: 15 },
    { id: 'account', name: 'Cuenta y Perfil', count: 4 },
    { id: 'grades', name: 'Calificaciones', count: 3 },
    { id: 'assignments', name: 'Tareas', count: 3 },
    { id: 'games', name: 'Juegos Educativos', count: 2 },
    { id: 'technical', name: 'Problemas Técnicos', count: 3 }
  ]

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a tu perfil, selecciona la pestaña "Seguridad" y sigue las instrucciones para cambiar tu contraseña. Necesitarás tu contraseña actual y confirmar la nueva dos veces.'
    },
    {
      id: 2,
      category: 'account',
      question: '¿Puedo cambiar mi foto de perfil?',
      answer: 'Sí, ve a tu perfil y haz clic en el ícono de cámara sobre tu foto actual. Puedes subir una nueva imagen desde tu dispositivo.'
    },
    {
      id: 3,
      category: 'grades',
      question: '¿Cuándo se actualizan las calificaciones?',
      answer: 'Las calificaciones se actualizan automáticamente cuando tu profesor las ingresa al sistema. Recibirás una notificación cuando haya nuevas calificaciones disponibles.'
    },
    {
      id: 4,
      category: 'grades',
      question: '¿Cómo puedo ver el detalle de mis evaluaciones?',
      answer: 'En la sección "Mis Calificaciones", haz clic en cualquier materia para ver el detalle de todas las evaluaciones, incluyendo fechas, ponderaciones y retroalimentación.'
    },
    {
      id: 5,
      category: 'assignments',
      question: '¿Cómo entrego una tarea?',
      answer: 'Ve a "Mis Tareas", busca la tarea que quieres entregar y haz clic en "Entregar". Puedes subir archivos o escribir texto según lo requiera la tarea.'
    },
    {
      id: 6,
      category: 'assignments',
      question: '¿Puedo editar una tarea después de entregarla?',
      answer: 'Depende de la configuración de tu profesor. Si está permitido, verás un botón "Editar entrega" en la tarea. Si no, deberás contactar a tu profesor.'
    },
    {
      id: 7,
      category: 'games',
      question: '¿Cómo me uno a un juego educativo?',
      answer: 'En tu dashboard o en la sección "Juegos", verás los juegos activos. Haz clic en "Unirse al Juego" para participar. Asegúrate de tener una conexión estable a internet.'
    },
    {
      id: 8,
      category: 'games',
      question: '¿Qué pasa si se desconecta mi internet durante un juego?',
      answer: 'El sistema intentará reconectarte automáticamente. Si no es posible, tu progreso se guardará hasta el último punto y podrás continuar desde ahí.'
    },
    {
      id: 9,
      category: 'technical',
      question: 'La plataforma va muy lenta, ¿qué puedo hacer?',
      answer: 'Prueba cerrar otras pestañas del navegador, verificar tu conexión a internet, o usar un navegador diferente. Si el problema persiste, contacta soporte técnico.'
    },
    {
      id: 10,
      category: 'technical',
      question: '¿Qué navegadores son compatibles?',
      answer: 'Recomendamos usar las versiones más recientes de Chrome, Firefox, Safari o Edge. Asegúrate de tener JavaScript habilitado.'
    }
  ]

  const tutorials = [
    {
      id: 1,
      title: 'Cómo usar el Dashboard',
      description: 'Aprende a navegar por tu panel principal y acceder a todas las funciones',
      duration: '3 min',
      thumbnail: '🏠'
    },
    {
      id: 2,
      title: 'Entregando Tareas',
      description: 'Guía paso a paso para entregar tus tareas correctamente',
      duration: '5 min',
      thumbnail: '📝'
    },
    {
      id: 3,
      title: 'Participando en Juegos',
      description: 'Todo lo que necesitas saber sobre los juegos educativos',
      duration: '4 min',
      thumbnail: '🎮'
    },
    {
      id: 4,
      title: 'Revisando Calificaciones',
      description: 'Cómo interpretar tus calificaciones y seguir tu progreso',
      duration: '3 min',
      thumbnail: '📊'
    }
  ]

  const contactOptions = [
    {
      type: 'chat',
      title: 'Chat en Vivo',
      description: 'Habla con nuestro equipo de soporte inmediatamente',
      availability: 'Lun - Vie: 8:00 - 18:00',
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
      action: 'Iniciar Chat'
    },
    {
      type: 'email',
      title: 'Correo Electrónico',
      description: 'Envíanos un email y te responderemos pronto',
      availability: 'Respuesta en 24 horas',
      icon: <EnvelopeIcon className="h-6 w-6" />,
      action: 'Enviar Email'
    },
    {
      type: 'phone',
      title: 'Teléfono',
      description: 'Llámanos para soporte inmediato',
      availability: '+56 2 2345 6789',
      icon: <PhoneIcon className="h-6 w-6" />,
      action: 'Llamar Ahora'
    }
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFaq = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🆘 Centro de Ayuda</h1>
              <p className="mt-2 opacity-90">
                Encuentra respuestas, tutoriales y obtén soporte cuando lo necesites
              </p>
            </div>
            <div className="text-right">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
                leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
              >
                Contactar Soporte
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((option) => (
            <div key={option.type} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {option.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                  <p className="text-xs text-gray-500 mb-3">{option.availability}</p>
                  <Button size="sm" variant="outline">
                    {option.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Tutorials */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">📹 Tutoriales en Video</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer">
                <div className="text-center mb-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center text-2xl mb-2 relative">
                    {tutorial.thumbnail}
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                      <PlayIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {tutorial.duration}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 text-center">{tutorial.title}</h3>
                <p className="text-sm text-gray-600 text-center">{tutorial.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">❓ Preguntas Frecuentes</h2>
          </div>
          
          <div className="p-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en preguntas frecuentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-3 text-sm text-gray-600 border-t border-gray-200 bg-gray-50">
                        <p className="pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron preguntas</h3>
                  <p className="text-gray-600">
                    Intenta con otros términos de búsqueda o selecciona una categoría diferente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">📚 Recursos Adicionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <BookOpenIcon className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Guía del Estudiante</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Manual completo con todas las funciones de la plataforma
                </p>
                <Button size="sm" variant="outline">Descargar PDF</Button>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Foro de Estudiantes</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Conecta con otros estudiantes y comparte experiencias
                </p>
                <Button size="sm" variant="outline">Ir al Foro</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 