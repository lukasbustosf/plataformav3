'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  IdentificationIcon,
  FolderIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BienestarDigitalRecordsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const recordStats = {
    totalRecords: 348,
    activeFiles: 156,
    archivedFiles: 192,
    confidentialFiles: 23
  }

  const handleViewRecord = (recordId: string) => {
    toast.success(`Abriendo expediente ${recordId}...`)
  }

  const handleDownloadRecord = (recordId: string) => {
    toast.success(`Descargando expediente ${recordId}...`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expedientes Digitales</h1>
            <p className="text-gray-600">Gestión segura de expedientes estudiantiles de bienestar</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FolderIcon className="h-4 w-4 mr-2" />
              Nuevo Expediente
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-blue-900">🔒 Información Confidencial</h3>
              <p className="text-blue-700">
                Todos los expedientes están protegidos por la Ley de Protección de Datos Personales. 
                Acceso restringido solo al personal autorizado.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IdentificationIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Expedientes</p>
                <p className="text-2xl font-bold text-blue-600">{recordStats.totalRecords}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FolderIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Archivos Activos</p>
                <p className="text-2xl font-bold text-green-600">{recordStats.activeFiles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Archivados</p>
                <p className="text-2xl font-bold text-gray-600">{recordStats.archivedFiles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <LockClosedIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confidenciales</p>
                <p className="text-2xl font-bold text-red-600">{recordStats.confidentialFiles}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, RUT o expediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Records Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Sistema de Expedientes Digitales</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <IdentificationIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Expedientes Digitales Seguros</h3>
              <p className="text-gray-600 mb-6">
                Sistema completo de gestión de expedientes estudiantiles con máxima seguridad y privacidad.
                <br />
                Todos los documentos están encriptados y protegidos según normativas de protección de datos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleViewRecord('demo')} 
                  variant="outline" 
                  className="h-12 justify-start"
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  Ver Expedientes
                </Button>
                <Button 
                  onClick={() => handleDownloadRecord('demo')} 
                  variant="outline" 
                  className="h-12 justify-start"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Exportar Datos
                </Button>
                <Button variant="outline" className="h-12 justify-start">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Configurar Seguridad
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 