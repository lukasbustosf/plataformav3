'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BienestarCrisisProtocolsPage() {
  const { user } = useAuth()
  const [activeAlert, setActiveAlert] = useState(false)

  const handleActivateProtocol = (type: string) => {
    toast.success(`Activando protocolo de ${type}...`)
    setActiveAlert(true)
  }

  const emergencyContacts = [
    { name: 'SAMU', phone: '131', type: 'Emergencia Médica' },
    { name: 'Carabineros', phone: '133', type: 'Emergencia Policial' },
    { name: 'Bomberos', phone: '132', type: 'Emergencia Incendio' },
    { name: 'Fono Drogas', phone: '1412', type: 'Drogas y Alcohol' },
    { name: 'Línea Ayuda', phone: '1515', type: 'Crisis Psicológica' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Protocolos de Crisis</h1>
            <p className="text-gray-600">Gestión de situaciones de emergencia y crisis estudiantil</p>
          </div>
          {activeAlert && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              🚨 Protocolo de Crisis Activo
            </div>
          )}
        </div>

        {/* Emergency Protocols */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-red-900">Crisis Suicida</h3>
            </div>
            <p className="text-sm text-red-700 mb-4">Protocolo para estudiantes con ideación o intento suicida</p>
            <Button 
              onClick={() => handleActivateProtocol('crisis suicida')}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Activar Protocolo
            </Button>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600 mr-3" />
              <h3 className="text-lg font-medium text-orange-900">Violencia Escolar</h3>
            </div>
            <p className="text-sm text-orange-700 mb-4">Protocolo para situaciones de agresión física o psicológica</p>
            <Button 
              onClick={() => handleActivateProtocol('violencia escolar')}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Activar Protocolo
            </Button>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-medium text-purple-900">Abuso Sexual</h3>
            </div>
            <p className="text-sm text-purple-700 mb-4">Protocolo para casos de abuso o agresión sexual</p>
            <Button 
              onClick={() => handleActivateProtocol('abuso sexual')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Activar Protocolo
            </Button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-lg font-medium text-yellow-900">Consumo de Drogas</h3>
            </div>
            <p className="text-sm text-yellow-700 mb-4">Protocolo para estudiantes con consumo problemático</p>
            <Button 
              onClick={() => handleActivateProtocol('consumo de drogas')}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              Activar Protocolo
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <UserIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-blue-900">Crisis Familiar</h3>
            </div>
            <p className="text-sm text-blue-700 mb-4">Protocolo para crisis en el entorno familiar del estudiante</p>
            <Button 
              onClick={() => handleActivateProtocol('crisis familiar')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Activar Protocolo
            </Button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-medium text-green-900">Emergencia Médica</h3>
            </div>
            <p className="text-sm text-green-700 mb-4">Protocolo para emergencias médicas o de salud mental</p>
            <Button 
              onClick={() => handleActivateProtocol('emergencia médica')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Activar Protocolo
            </Button>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Contactos de Emergencia</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.type}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => toast.success(`Llamando a ${contact.name}: ${contact.phone}`)}
                    >
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {contact.phone}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Protocol Documentation */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Documentación de Protocolos</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Manual de Protocolos de Crisis</h3>
                    <p className="text-sm text-gray-600">Guía completa de procedimientos de emergencia</p>
                  </div>
                </div>
                <Button variant="outline">
                  Ver Documento
                </Button>
              </div>

              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Formularios de Activación</h3>
                    <p className="text-sm text-gray-600">Formularios estándar para documentar activaciones</p>
                  </div>
                </div>
                <Button variant="outline">
                  Ver Formularios
                </Button>
              </div>

              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Historial de Activaciones</h3>
                    <p className="text-sm text-gray-600">Registro de protocolos activados previamente</p>
                  </div>
                </div>
                <Button variant="outline">
                  Ver Historial
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 