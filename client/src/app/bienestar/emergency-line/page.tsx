'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  PhoneIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BienestarEmergencyLinePage() {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(true)
  const [currentCall, setCurrentCall] = useState<string | null>(null)

  const emergencyStats = {
    totalCalls: 23,
    activeCalls: 2,
    resolvedToday: 8,
    criticalCases: 3
  }

  const handleToggleService = () => {
    setIsActive(!isActive)
    toast.success(isActive ? 'Línea de emergencia desactivada' : 'Línea de emergencia activada')
  }

  const handleAnswerCall = (callId: string) => {
    toast.success(`Atendiendo llamada ${callId}...`)
    setCurrentCall(callId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Línea de Emergencia</h1>
            <p className="text-gray-600">Centro de atención de emergencias 24/7 para crisis estudiantiles</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-600' : 'bg-red-600'}`}></div>
              <span className="text-sm font-medium">
                {isActive ? 'Servicio Activo' : 'Servicio Inactivo'}
              </span>
            </div>
            <Button
              onClick={handleToggleService}
              className={isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {isActive ? <PauseIcon className="h-4 w-4 mr-2" /> : <PlayIcon className="h-4 w-4 mr-2" />}
              {isActive ? 'Desactivar' : 'Activar'}
            </Button>
          </div>
        </div>

        {/* Emergency Alert */}
        {isActive && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-900">🚨 Línea de Emergencia Activa</h3>
                <p className="text-red-700">
                  Atención inmediata disponible • Teléfono: <strong>+56 9 1234 5678</strong> • Email: emergencia@edu21.cl
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Llamadas</p>
                <p className="text-2xl font-bold text-blue-600">{emergencyStats.totalCalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Curso</p>
                <p className="text-2xl font-bold text-yellow-600">{emergencyStats.activeCalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resueltas Hoy</p>
                <p className="text-2xl font-bold text-green-600">{emergencyStats.resolvedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Casos Críticos</p>
                <p className="text-2xl font-bold text-red-600">{emergencyStats.criticalCases}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Calls */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Llamadas Activas</h2>
          </div>
          <div className="p-6">
            {isActive ? (
              <div className="space-y-4">
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <PhoneIcon className="h-5 w-5 text-red-600 animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-red-900">Llamada Entrante</h3>
                        <p className="text-sm text-red-700">
                          <strong>Prioridad ALTA</strong> • Estudiante: María González (7°A)
                        </p>
                        <p className="text-xs text-red-600">Apoderada reporta crisis emocional</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAnswerCall('CALL-001')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        Atender
                      </Button>
                      <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        Derivar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <ClockIcon className="h-5 w-5 text-yellow-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-yellow-900">En Seguimiento</h3>
                        <p className="text-sm text-yellow-700">
                          Carlos Mendoza (2°B) • Duración: 15 min
                        </p>
                        <p className="text-xs text-yellow-600">Atendida por: Psic. Ana López</p>
                      </div>
                    </div>
                    <Button variant="outline">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PhoneIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>Línea de emergencia desactivada</p>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Protocols */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Protocolos de Emergencia</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">🚨 Crisis Suicida</h3>
                <p className="text-sm text-gray-600 mb-3">
                  1. Mantener la calma y escucha activa<br/>
                  2. Evaluar riesgo inmediato<br/>
                  3. No dejar solo al estudiante<br/>
                  4. Contactar servicios de emergencia si es necesario
                </p>
                <Button size="sm" variant="outline" className="border-red-300 text-red-600">
                  Ver Protocolo Completo
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">🆘 Crisis de Pánico</h3>
                <p className="text-sm text-gray-600 mb-3">
                  1. Técnicas de respiración<br/>
                  2. Tranquilizar y contener<br/>
                  3. Espacio seguro y calmado<br/>
                  4. Seguimiento post-crisis
                </p>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-600">
                  Ver Protocolo Completo
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">⚠️ Violencia/Abuso</h3>
                <p className="text-sm text-gray-600 mb-3">
                  1. Asegurar la seguridad inmediata<br/>
                  2. Documentar sin re-victimizar<br/>
                  3. Activar red de protección<br/>
                  4. Denunciar según protocolo legal
                </p>
                <Button size="sm" variant="outline" className="border-purple-300 text-purple-600">
                  Ver Protocolo Completo
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">🏥 Emergencia Médica</h3>
                <p className="text-sm text-gray-600 mb-3">
                  1. Evaluar signos vitales<br/>
                  2. Llamar al SAMU (131)<br/>
                  3. Contactar apoderados<br/>
                  4. Acompañar hasta llegada de ayuda
                </p>
                <Button size="sm" variant="outline" className="border-green-300 text-green-600">
                  Ver Protocolo Completo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Información de Contacto</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <PhoneIcon className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Teléfono de Emergencia</h3>
                <p className="text-lg font-bold text-blue-600">+56 9 1234 5678</p>
                <p className="text-sm text-gray-600">Disponible 24/7</p>
              </div>
              <div className="text-center">
                <UserIcon className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900">Coordinador de Turno</h3>
                <p className="text-lg font-bold text-green-600">Psic. Ana López</p>
                <p className="text-sm text-gray-600">Disponible hasta 22:00</p>
              </div>
              <div className="text-center">
                <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-red-600 mb-2" />
                <h3 className="font-medium text-gray-900">SAMU</h3>
                <p className="text-lg font-bold text-red-600">131</p>
                <p className="text-sm text-gray-600">Emergencias médicas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 