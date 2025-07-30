'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { 
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface EmergencyContact {
  id: string
  name: string
  role: string
  phone: string
  alternatePhone?: string
  email: string
  department: string
  availability: string
  urgencyLevel: 'immediate' | 'high' | 'medium' | 'low'
  description: string
}

interface CrisisProtocol {
  id: string
  title: string
  type: 'medical' | 'psychological' | 'behavioral' | 'security' | 'academic'
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  immediateActions: string[]
  contacts: string[]
  followUpSteps: string[]
  lastUpdated: string
}

interface EmergencyAlert {
  id: string
  type: 'active' | 'resolved' | 'monitoring'
  title: string
  description: string
  timestamp: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  studentName: string
  actionsTaken: string[]
  nextSteps: string[]
  responsibleProfessional: string
}

export default function GuardianEmergencyContactPage() {
  const { user, fullName } = useAuth()
  const [selectedProtocol, setSelectedProtocol] = useState<CrisisProtocol | null>(null)
  const [showProtocolModal, setShowProtocolModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [emergencyCallActive, setEmergencyCallActive] = useState(false)

  // Mock data for emergency contacts
  const emergencyContacts: EmergencyContact[] = [
    {
      id: 'EMRG-001',
      name: 'Dr. Patricia Silva',
      role: 'Director/a de Convivencia Escolar',
      phone: '+56 9 8765 4321',
      alternatePhone: '+56 2 2345 6789',
      email: 'p.silva@colegio.cl',
      department: 'Convivencia Escolar',
      availability: '24/7 - Emergencias',
      urgencyLevel: 'immediate',
      description: 'Contacto principal para situaciones de crisis y emergencias escolares.'
    },
    {
      id: 'EMRG-002',
      name: 'Psic. Ana López',
      role: 'Psicóloga Escolar',
      phone: '+56 9 7654 3210',
      email: 'a.lopez@colegio.cl',
      department: 'Equipo Bienestar',
      availability: 'L-V 8:00-18:00',
      urgencyLevel: 'high',
      description: 'Apoyo psicológico y crisis emocionales de estudiantes.'
    },
    {
      id: 'EMRG-003',
      name: 'Enf. Carmen Morales',
      role: 'Enfermera Escolar',
      phone: '+56 9 6543 2109',
      email: 'c.morales@colegio.cl',
      department: 'Enfermería',
      availability: 'L-V 7:30-17:30',
      urgencyLevel: 'immediate',
      description: 'Emergencias médicas y primeros auxilios en el establecimiento.'
    },
    {
      id: 'EMRG-004',
      name: 'Insp. General Roberto Paz',
      role: 'Inspector General',
      phone: '+56 9 5432 1098',
      email: 'r.paz@colegio.cl',
      department: 'Inspectoría',
      availability: 'L-V 7:00-19:00',
      urgencyLevel: 'high',
      description: 'Situaciones disciplinarias y seguridad escolar.'
    }
  ]

  const crisisProtocols: CrisisProtocol[] = [
    {
      id: 'PROT-001',
      title: 'Protocolo Crisis Psicológica/Emocional',
      type: 'psychological',
      severity: 'critical',
      description: 'Procedimiento para situaciones de crisis emocional, ideación suicida, autolesiones o episodios de pánico.',
      immediateActions: [
        'Contactar inmediatamente a psicólogo/a escolar',
        'No dejar solo/a al estudiante',
        'Mantener ambiente calmado y seguro',
        'Evitar interrogatorios o presión',
        'Documentar observaciones objetivas'
      ],
      contacts: ['Psic. Ana López', 'Dr. Patricia Silva'],
      followUpSteps: [
        'Evaluación profesional inmediata',
        'Comunicación con familia',
        'Derivación externa si es necesario',
        'Plan de seguimiento semanal',
        'Coordinación con equipo docente'
      ],
      lastUpdated: '2024-12-01'
    },
    {
      id: 'PROT-002',
      title: 'Protocolo Emergencia Médica',
      type: 'medical',
      severity: 'critical',
      description: 'Procedimiento para emergencias médicas, accidentes, alergias severas o crisis médicas.',
      immediateActions: [
        'Llamar inmediatamente a enfermería escolar',
        'Evaluar signos vitales básicos',
        'Aplicar primeros auxilios si está capacitado',
        'Llamar a servicios de emergencia si es necesario (131)',
        'Contactar a apoderados inmediatamente'
      ],
      contacts: ['Enf. Carmen Morales', 'Dr. Patricia Silva'],
      followUpSteps: [
        'Acompañar al estudiante al centro médico',
        'Completar reporte de accidente',
        'Seguimiento médico post-emergencia',
        'Comunicación con profesores',
        'Revisión de medidas preventivas'
      ],
      lastUpdated: '2024-12-01'
    },
    {
      id: 'PROT-003',
      title: 'Protocolo Conflicto Grave o Violencia',
      type: 'behavioral',
      severity: 'high',
      description: 'Procedimiento para situaciones de agresión física, bullying severo o comportamiento violento.',
      immediateActions: [
        'Separar a los involucrados inmediatamente',
        'Garantizar seguridad de todos los estudiantes',
        'Contactar a Inspectoría General',
        'Documentar hechos objetivamente',
        'Activar protocolo de convivencia escolar'
      ],
      contacts: ['Insp. General Roberto Paz', 'Dr. Patricia Silva'],
      followUpSteps: [
        'Investigación formal del incidente',
        'Entrevistas con todos los involucrados',
        'Aplicación de medidas disciplinarias',
        'Mediación si es apropiado',
        'Seguimiento y monitoreo'
      ],
      lastUpdated: '2024-12-01'
    }
  ]

  const activeAlerts: EmergencyAlert[] = [
    {
      id: 'ALERT-001',
      type: 'monitoring',
      title: 'Seguimiento Post-Intervención',
      description: 'Monitoreando evolución tras episodio emocional del 15 de diciembre.',
      timestamp: '2024-12-17T10:30:00Z',
      severity: 'medium',
      studentName: 'Sofía Martínez',
      actionsTaken: [
        'Sesión de contención emocional',
        'Comunicación con apoderados',
        'Plan de apoyo inmediato activado'
      ],
      nextSteps: [
        'Cita con psicólogo externo programada',
        'Reunión con profesores jefe',
        'Seguimiento semanal establecido'
      ],
      responsibleProfessional: 'Psic. Ana López'
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <HeartIcon className="h-5 w-5" />
      case 'psychological':
        return <UserIcon className="h-5 w-5" />
      case 'behavioral':
        return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'security':
        return <ShieldCheckIcon className="h-5 w-5" />
      case 'academic':
        return <DocumentTextIcon className="h-5 w-5" />
      default:
        return <InformationCircleIcon className="h-5 w-5" />
    }
  }

  const handleEmergencyCall = (contact: EmergencyContact) => {
    setEmergencyCallActive(true)
    toast.success(`Iniciando llamada de emergencia a ${contact.name}`)
    
    // Simulate call
    setTimeout(() => {
      setEmergencyCallActive(false)
      toast.success('Llamada registrada en el sistema')
    }, 3000)
  }

  const handleProtocolView = (protocol: CrisisProtocol) => {
    setSelectedProtocol(protocol)
    setShowProtocolModal(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-content">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid-responsive-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
              Contactos de Emergencia
            </h1>
            <p className="page-subtitle">
              Acceso inmediato a protocolos de crisis y contactos de emergencia escolar
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              className="btn-danger btn-responsive"
              disabled={emergencyCallActive}
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              {emergencyCallActive ? 'Llamando...' : 'Emergencia 131'}
            </Button>
          </div>
        </div>

        {/* Emergency Alert Banner */}
        {activeAlerts.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <BellAlertIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Alerta Activa:</strong> Hay {activeAlerts.length} situación(es) en monitoreo para su hijo/a.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Emergency Contacts */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
            <PhoneIcon className="h-5 w-5 mr-2" />
            Contactos de Emergencia Inmediata
          </h2>
          <div className="grid-responsive-2 gap-4">
            {emergencyContacts
              .filter(contact => contact.urgencyLevel === 'immediate')
              .map((contact) => (
                <div key={contact.id} className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(contact.urgencyLevel)}`}>
                      {contact.urgencyLevel === 'immediate' ? 'INMEDIATO' : contact.urgencyLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{contact.role}</p>
                  <p className="text-sm text-gray-600 mb-3">{contact.department}</p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEmergencyCall(contact)}
                      className="btn-danger btn-responsive flex-1"
                      disabled={emergencyCallActive}
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </Button>
                    <Button
                      className="btn-secondary"
                      onClick={() => window.open(`mailto:${contact.email}`)}
                    >
                      <EnvelopeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="card mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BellAlertIcon className="h-5 w-5 mr-2" />
                Alertas y Seguimientos Activos
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className={`border-2 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-sm mt-1">{alert.description}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="font-medium text-sm mb-2">Acciones Tomadas:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {alert.actionsTaken.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-2">Próximos Pasos:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {alert.nextSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-sm">
                        <strong>Profesional a cargo:</strong> {alert.responsibleProfessional}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Crisis Protocols */}
        <div className="card mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Protocolos de Crisis</h3>
            <p className="text-sm text-gray-600 mt-1">
              Procedimientos detallados para diferentes tipos de emergencias escolares
            </p>
          </div>
          <div className="p-6">
            <div className="grid-responsive-3 gap-4">
              {crisisProtocols.map((protocol) => (
                <div key={protocol.id} className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getSeverityColor(protocol.severity)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(protocol.type)}
                      <h4 className="font-semibold text-sm">{protocol.title}</h4>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(protocol.severity)}`}>
                      {protocol.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-4">{protocol.description}</p>
                  
                  <Button
                    onClick={() => handleProtocolView(protocol)}
                    className="btn-secondary btn-responsive w-full"
                  >
                    Ver Protocolo Completo
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Emergency Contacts */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Todos los Contactos de Emergencia</h3>
          </div>
          <div className="p-6">
            <div className="grid-responsive-2 gap-6">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                      <p className="text-sm text-gray-600">{contact.role}</p>
                      <p className="text-sm text-gray-500">{contact.department}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(contact.urgencyLevel)}`}>
                      {contact.urgencyLevel === 'immediate' ? 'INMEDIATO' : 
                       contact.urgencyLevel === 'high' ? 'ALTO' :
                       contact.urgencyLevel === 'medium' ? 'MEDIO' : 'BAJO'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{contact.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </div>
                    {contact.alternatePhone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        {contact.alternatePhone} (alternativo)
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      {contact.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {contact.availability}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEmergencyCall(contact)}
                      className={`btn-responsive flex-1 ${
                        contact.urgencyLevel === 'immediate' ? 'btn-danger' : 'btn-primary'
                      }`}
                      disabled={emergencyCallActive}
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Llamar
                    </Button>
                    <Button
                      className="btn-secondary"
                      onClick={() => window.open(`mailto:${contact.email}`)}
                    >
                      <EnvelopeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Protocol Detail Modal */}
        <ResponsiveModal
          open={showProtocolModal}
          onClose={() => setShowProtocolModal(false)}
          title={selectedProtocol?.title || ''}
          size="lg"
        >
          {selectedProtocol && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                {getTypeIcon(selectedProtocol.type)}
                <div>
                  <h3 className="text-lg font-semibold">{selectedProtocol.title}</h3>
                  <p className="text-sm text-gray-600">{selectedProtocol.description}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-red-700 mb-3">🚨 Acciones Inmediatas</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedProtocol.immediateActions.map((action, index) => (
                    <li key={index} className="text-sm">{action}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-blue-700 mb-3">📞 Contactos a Llamar</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedProtocol.contacts.map((contact, index) => (
                    <li key={index} className="text-sm">{contact}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-green-700 mb-3">📋 Pasos de Seguimiento</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedProtocol.followUpSteps.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Última actualización: {new Date(selectedProtocol.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </ResponsiveModal>
      </div>
    </DashboardLayout>
  )
}