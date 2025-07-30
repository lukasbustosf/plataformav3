'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { 
  BeakerIcon, 
  UserGroupIcon, 
  ClockIcon,
  DocumentTextIcon,
  CameraIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  PlayIcon,
  StopIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import toast from 'react-hot-toast'

export default function NewLabSessionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [sessionData, setSessionData] = useState({
    activity_id: '',
    activity_title: '',
    class_id: '',
    participant_names: [''],
    materials_checklist: [] as { item: string; checked: boolean }[],
    session_notes: '',
    estimated_duration: 45
  })
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const [evidences, setEvidences] = useState<{ id: number; type: string; description: string; timestamp: string }[]>([])

  // Mock data
  const availableActivities = [
    {
      id: '1',
      title: 'Conteo con Material Concreto',
      oa_code: 'OA-1-MAT-01',
      duration_minutes: 45,
      materials_needed: ['Bloques de madera', 'Fichas de colores', 'Tablero de conteo'],
      min_participants: 4,
      max_participants: 8,
      category: 'matematicas'
    },
    {
      id: '2',
      title: 'Clasificación de Formas Geométricas',
      oa_code: 'OA-1-MAT-08',
      duration_minutes: 30,
      materials_needed: ['Bloques geométricos', 'Tableros de clasificación', 'Tarjetas de formas'],
      min_participants: 2,
      max_participants: 6,
      category: 'matematicas'
    },
    {
      id: '3',
      title: 'Experimento de Flotación',
      oa_code: 'OA-1-CIE-03',
      duration_minutes: 60,
      materials_needed: ['Recipientes con agua', 'Objetos diversos', 'Tablas de registro'],
      min_participants: 3,
      max_participants: 6,
      category: 'ciencias'
    }
  ]

  const classes = [
    { id: '1', name: 'PK-A - Párvulos Menores', students_count: 15 },
    { id: '2', name: 'K-A - Kinder A', students_count: 18 },
    { id: '3', name: '1°A - Primero Básico A', students_count: 20 }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sessionStarted && timer >= 0) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [sessionStarted, timer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const selectedActivity = availableActivities.find(a => a.id === sessionData.activity_id)

  const handleActivitySelect = (activityId: string) => {
    const activity = availableActivities.find(a => a.id === activityId)
    if (!activity) return
    
    setSessionData({
      ...sessionData,
      activity_id: activityId,
      activity_title: activity.title,
      estimated_duration: activity.duration_minutes,
      materials_checklist: activity.materials_needed.map(material => ({
        item: material,
        checked: false
      }))
    })
  }

  const handleMaterialCheck = (index: number) => {
    const updatedChecklist = [...sessionData.materials_checklist]
    updatedChecklist[index].checked = !updatedChecklist[index].checked
    setSessionData({ ...sessionData, materials_checklist: updatedChecklist })
  }

  const addParticipant = () => {
    setSessionData({
      ...sessionData,
      participant_names: [...sessionData.participant_names, '']
    })
  }

  const updateParticipant = (index: number, name: string) => {
    const updatedNames = [...sessionData.participant_names]
    updatedNames[index] = name
    setSessionData({ ...sessionData, participant_names: updatedNames })
  }

  const removeParticipant = (index: number) => {
    const updatedNames = sessionData.participant_names.filter((_, i) => i !== index)
    setSessionData({ ...sessionData, participant_names: updatedNames })
  }

  const handleStartSession = () => {
    const newSessionId = Date.now().toString()
    setSessionId(newSessionId)
    setSessionStarted(true)
    setTimer(0)
    toast.success('Sesión iniciada correctamente')
  }

  const handleEndSession = () => {
    // TODO: Save session data to backend
    toast.success('Sesión finalizada y guardada')
    router.push('/teacher/labs')
  }

  const handleAddEvidence = () => {
    // Mock evidence addition
    const newEvidence = {
      id: Date.now(),
      type: 'photo',
      description: 'Evidencia de trabajo',
      timestamp: new Date().toLocaleTimeString()
    }
    setEvidences([...evidences, newEvidence])
    toast.success('Evidencia agregada')
  }

  const canProceedToStep2 = sessionData.activity_id && sessionData.class_id
  const canProceedToStep3 = canProceedToStep2 && 
    sessionData.participant_names.filter(name => name.trim()).length >= (selectedActivity?.min_participants || 1)
  const canStartSession = canProceedToStep3 && 
    sessionData.materials_checklist.every(item => item.checked)

  const steps = [
    { number: 1, title: 'Seleccionar Actividad', completed: canProceedToStep2 },
    { number: 2, title: 'Configurar Participantes', completed: canProceedToStep3 },
    { number: 3, title: 'Verificar Materiales', completed: canStartSession },
    { number: 4, title: 'Ejecutar Sesión', completed: false }
  ]

  if (sessionStarted) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Session Header */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <PlayIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-green-900">Sesión en Curso</h1>
                  <p className="text-green-700">{sessionData.activity_title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-green-900">
                  {formatTime(timer)}
                </div>
                <p className="text-sm text-green-700">Tiempo transcurrido</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Activity Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Actividad</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">OA:</span>
                    <span className="ml-2">{selectedActivity?.oa_code}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Duración estimada:</span>
                    <span className="ml-2">{selectedActivity?.duration_minutes} min</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Participantes:</span>
                    <span className="ml-2">{sessionData.participant_names.filter(n => n.trim()).length}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Categoría:</span>
                    <span className="ml-2 capitalize">{selectedActivity?.category}</span>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Participantes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {sessionData.participant_names.filter(name => name.trim()).map((name, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <UserGroupIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notas de la Sesión</h3>
                <textarea
                  value={sessionData.session_notes}
                  onChange={(e) => setSessionData({ ...sessionData, session_notes: e.target.value })}
                  placeholder="Registra observaciones, dificultades encontradas, logros destacados..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={handleAddEvidence}
                  >
                    <CameraIcon className="h-5 w-5 mr-2" />
                    Agregar Evidencia
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => {
                      const newNote = `[${new Date().toLocaleTimeString()}] Nueva observación\n`
                      setSessionData({ 
                        ...sessionData, 
                        session_notes: sessionData.session_notes + newNote 
                      })
                    }}
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Nota Rápida
                  </Button>
                </div>
              </div>

              {/* Evidence Counter */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Evidencias</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{evidences.length}</div>
                  <p className="text-sm text-gray-500">registradas</p>
                </div>
                <div className="mt-4 space-y-2">
                  {evidences.map((evidence) => (
                    <div key={evidence.id} className="flex items-center text-sm text-gray-600">
                      <CameraIcon className="h-4 w-4 mr-2" />
                      <span>{evidence.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* End Session */}
              <div className="bg-white rounded-lg shadow p-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleEndSession}
                >
                  <StopIcon className="h-5 w-5 mr-2" />
                  Finalizar Sesión
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Se guardará automáticamente todo el progreso
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/teacher/labs')}
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Sesión de Trabajo</h1>
              <p className="text-gray-600">Configura y ejecuta una actividad con material concreto</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.completed ? 'bg-green-500 border-green-500 text-white' :
                  currentStep === step.number ? 'border-blue-500 text-blue-500' :
                  'border-gray-300 text-gray-300'
                }`}>
                  {step.completed ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    step.completed ? 'text-green-600' :
                    currentStep === step.number ? 'text-blue-600' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Step 1: Select Activity */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Selecciona la Actividad</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableActivities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => handleActivitySelect(activity.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      sessionData.activity_id === activity.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <BeakerIcon className="h-6 w-6 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{activity.oa_code}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {activity.duration_minutes} min
                          </span>
                          <span className="flex items-center">
                            <UserGroupIcon className="h-3 w-3 mr-1" />
                            {activity.min_participants}-{activity.max_participants}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Selecciona la Clase</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => setSessionData({ ...sessionData, class_id: cls.id })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        sessionData.class_id === cls.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h5 className="font-medium text-gray-900">{cls.name}</h5>
                      <p className="text-sm text-gray-500">{cls.students_count} estudiantes</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configure Participants */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Configurar Participantes</h3>
                <div className="text-sm text-gray-500">
                  Mínimo: {selectedActivity?.min_participants} | Máximo: {selectedActivity?.max_participants}
                </div>
              </div>

              <div className="space-y-3">
                {sessionData.participant_names.map((name, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateParticipant(index, e.target.value)}
                      placeholder={`Participante ${index + 1}`}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {sessionData.participant_names.length > 1 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => removeParticipant(index)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="secondary"
                onClick={addParticipant}
                disabled={sessionData.participant_names.length >= (selectedActivity?.max_participants || 10)}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Agregar Participante
              </Button>
            </div>
          )}

          {/* Step 3: Materials Checklist */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Verificar Materiales</h3>
              <p className="text-gray-600">Marca todos los materiales que tienes disponibles antes de iniciar</p>

              <div className="space-y-3">
                {sessionData.materials_checklist.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleMaterialCheck(index)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      item.checked
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.checked
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {item.checked && (
                          <CheckCircleIcon className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className={`font-medium ${
                        item.checked ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {item.item}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>

            {currentStep < 3 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && !canProceedToStep2) ||
                  (currentStep === 2 && !canProceedToStep3)
                }
              >
                Siguiente
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleStartSession}
                disabled={!canStartSession}
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 