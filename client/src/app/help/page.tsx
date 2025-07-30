'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  QuestionMarkCircleIcon, 
  BookOpenIcon, 
  VideoCameraIcon, 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

export default function HelpPage() {
  const { user, fullName } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('faq')

  // FAQ data agrupada por módulo
  const faqs = [
    // LABORATORIOS MÓVILES
    {
      id: 1,
      modulo: 'laboratorio',
      question: '¿Cómo registro la ejecución de una actividad de laboratorio?',
      answer: 'Desde el catálogo de actividades, selecciona la actividad y haz clic en “Registrar Ejecución”. Completa el formulario y guarda.',
      roles: ['TEACHER']
    },
    {
      id: 2,
      modulo: 'laboratorio',
      question: '¿Puedo adjuntar evidencias (fotos/documentos) al registrar una actividad?',
      answer: 'Sí, puedes adjuntar imágenes o PDFs como evidencia al registrar la ejecución de una actividad.',
      roles: ['TEACHER']
    },
    {
      id: 3,
      modulo: 'laboratorio',
      question: '¿Dónde veo el historial de ejecuciones realizadas?',
      answer: 'En el detalle de cada actividad, encontrarás la sección “Mis Ejecuciones Recientes” con el historial y evidencias asociadas.',
      roles: ['TEACHER']
    },
    {
      id: 4,
      modulo: 'laboratorio',
      question: '¿Cómo consulto las métricas de uso de una actividad?',
      answer: 'En el detalle de la actividad, verás tarjetas con métricas como veces ejecutada, rating promedio y duración promedio.',
      roles: ['TEACHER']
    },
    {
      id: 5,
      modulo: 'laboratorio',
      question: '¿Qué hago si no encuentro una actividad en el catálogo?',
      answer: 'Verifica los filtros aplicados o contacta a soporte si la actividad debería estar disponible.',
      roles: ['TEACHER']
    },
    // EVALUACIÓN GAMIFICADA
    {
      id: 6,
      modulo: 'evaluacion',
      question: '¿Cómo accedo a las evaluaciones gamificadas?',
      answer: 'Desde el menú principal, selecciona “Evaluación” y luego “Evaluación Gamificada”.',
      roles: ['TEACHER']
    },
    {
      id: 7,
      modulo: 'evaluacion',
      question: '¿Cómo asigno una evaluación gamificada a mis estudiantes?',
      answer: 'Selecciona la evaluación y usa la opción “Asignar a clase” para elegir los estudiantes o grupos.',
      roles: ['TEACHER']
    },
    {
      id: 8,
      modulo: 'evaluacion',
      question: '¿Puedo ver los resultados y el progreso de mis estudiantes en tiempo real?',
      answer: 'Sí, en la sección de resultados puedes ver el avance y puntaje de cada estudiante en tiempo real.',
      roles: ['TEACHER']
    },
    {
      id: 9,
      modulo: 'evaluacion',
      question: '¿Qué tipos de juegos están disponibles en la evaluación gamificada?',
      answer: 'Actualmente hay Trivia Lightning, Board Race, Color Match, Memory Flip, Word Storm y más.',
      roles: ['TEACHER']
    },
    {
      id: 10,
      modulo: 'evaluacion',
      question: '¿Cómo se calcula el puntaje en los juegos?',
      answer: 'El puntaje depende de la rapidez y precisión de las respuestas en cada juego.',
      roles: ['TEACHER']
    },
    // CONFIGURACIÓN
    {
      id: 11,
      modulo: 'configuracion',
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a Configuración > Perfil, haz clic en “Cambiar Contraseña” e ingresa tu contraseña actual y la nueva.',
      roles: ['ALL']
    },
    {
      id: 12,
      modulo: 'configuracion',
      question: '¿Puedo actualizar mi información personal?',
      answer: 'Sí, en Configuración puedes editar tus datos personales y preferencias.',
      roles: ['ALL']
    },
    {
      id: 13,
      modulo: 'configuracion',
      question: '¿Cómo configuro mis preferencias de notificación?',
      answer: 'En Configuración puedes activar o desactivar notificaciones por correo y en la plataforma.',
      roles: ['ALL']
    },
    // GENERAL
    {
      id: 14,
      modulo: 'general',
      question: '¿A quién contacto si tengo problemas técnicos?',
      answer: 'Puedes escribir a lbustos@edu21.cl, schacon@edu21.cl o mbustos@edu21.cl, o llamar al 232144445.',
      roles: ['ALL']
    },
    {
      id: 15,
      modulo: 'general',
      question: '¿La plataforma funciona en dispositivos móviles?',
      answer: 'Sí, EDU21 es compatible con computadores, tablets y smartphones.',
      roles: ['ALL']
    },
    {
      id: 16,
      modulo: 'general',
      question: '¿Qué hago si olvido mi contraseña?',
      answer: 'Usa la opción “¿Olvidaste tu contraseña?” en la pantalla de login para recuperarla.',
      roles: ['ALL']
    },
  ];

  // Filtro por módulo
  const [faqModule, setFaqModule] = useState('all');
  const filteredFaqs = faqs.filter(faq =>
    (faq.roles.includes('ALL') || faq.roles.includes(user?.role || '')) &&
    (faqModule === 'all' || faq.modulo === faqModule) &&
    (searchQuery === '' ||
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const faqModules = [
    { id: 'all', name: 'Todos los módulos' },
    { id: 'laboratorio', name: 'Laboratorios Móviles' },
    { id: 'evaluacion', name: 'Evaluación Gamificada' },
    { id: 'configuracion', name: 'Configuración' },
    { id: 'general', name: 'General' },
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Introducción a EDU21',
      description: 'Conoce las funciones principales de la plataforma',
      duration: '5 min',
      category: 'getting-started',
      roles: ['ALL']
    },
    {
      id: 2,
      title: 'Crear tu primer quiz con IA',
      description: 'Aprende a generar contenido educativo automáticamente',
      duration: '8 min',
      category: 'quizzes',
      roles: ['TEACHER']
    },
    {
      id: 3,
      title: 'Configurar un juego educativo',
      description: 'Convierte tus quizzes en experiencias interactivas',
      duration: '10 min',
      category: 'games',
      roles: ['TEACHER']
    },
    {
      id: 4,
      title: 'Interpretar analíticas de estudiantes',
      description: 'Entiende los reportes de progreso académico',
      duration: '12 min',
      category: 'analytics',
      roles: ['TEACHER', 'ADMIN_ESCOLAR']
    },
    {
      id: 5,
      title: 'Participar en juegos como estudiante',
      description: 'Guía completa para estudiantes',
      duration: '6 min',
      category: 'games',
      roles: ['STUDENT']
    }
  ]

  const contactOptions = [
    {
      id: 1,
      title: 'Soporte Técnico',
      description: 'Problemas técnicos, bugs o errores',
      contact: 'soporte@edu21.cl',
      phone: '+56 2 2345 6789',
      hours: 'Lun-Vie 9:00-18:00'
    },
    {
      id: 2,
      title: 'Soporte Pedagógico',
      description: 'Dudas sobre uso educativo y metodológico',
      contact: 'pedagogia@edu21.cl',
      phone: '+56 2 2345 6790',
      hours: 'Lun-Vie 8:00-17:00'
    },
    {
      id: 3,
      title: 'Administración',
      description: 'Cuentas, facturación y configuración escolar',
      contact: 'admin@edu21.cl',
      phone: '+56 2 2345 6791',
      hours: 'Lun-Vie 9:00-17:00'
    }
  ]

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.roles.includes('ALL') || tutorial.roles.includes(user?.role || '')
  )

  const tabs = [
    { id: 'faq', name: 'Preguntas Frecuentes', icon: QuestionMarkCircleIcon },
    { id: 'tutorials', name: 'Tutoriales (próximamente)', icon: VideoCameraIcon },
    { id: 'contact', name: 'Contacto', icon: ChatBubbleLeftRightIcon }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Centro de Ayuda 🆘</h1>
          <p className="mt-2 opacity-90">
            ¡Hola {fullName}! Encuentra respuestas, tutoriales y soporte para EDU21
          </p>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en la ayuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Preguntas Frecuentes
                </h2>
                {/* Filtro por módulo */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {faqModules.map((mod) => (
                    <Button
                      key={mod.id}
                      size="sm"
                      variant={faqModule === mod.id ? 'primary' : 'outline'}
                      onClick={() => setFaqModule(mod.id)}
                    >
                      {mod.name}
                    </Button>
                  ))}
                </div>
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8">
                    <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                    <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === faq.id ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-3 border-t border-gray-200 bg-gray-50">
                          <p className="text-gray-700 mt-2">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tutorials Tab */}
            {activeTab === 'tutorials' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Tutoriales y Guías
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTutorials.map((tutorial) => (
                    <div key={tutorial.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <PlayIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{tutorial.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {tutorial.duration}
                            </span>
                            <Button size="sm">
                              Ver Tutorial
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Centro de Ayuda EDU21
                </h2>
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-2">Contacto</h3>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Correo:</strong> lbustos@edu21.cl, schacon@edu21.cl, mbustos@edu21.cl
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Fono central centro de ayuda:</strong> 232144445
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Horario de atención:</strong> Lunes a viernes 8:30-17:30
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
              <BookOpenIcon className="h-5 w-5" />
              <span className="text-sm">Manual de Usuario</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
              <VideoCameraIcon className="h-5 w-5" />
              <span className="text-sm">Videos Tutoriales</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span className="text-sm">Foro Comunidad</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 