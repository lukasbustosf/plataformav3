'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UsersIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function SostenedorSchools() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Mock data for demonstration
  const schools = [
    {
      id: 1,
      name: 'Colegio San Patricio',
      rbd: '12345-6',
      address: 'Av. Las Condes 1234, Las Condes',
      region: 'Metropolitana',
      commune: 'Las Condes',
      phone: '+56 2 2345 6789',
      email: 'contacto@sanpatricio.edu.cl',
      director: 'María González Pérez',
      totalStudents: 850,
      totalTeachers: 45,
      status: 'active',
      createdAt: '2024-01-15T10:00:00',
      lastSync: '2024-12-19T08:30:00',
      performance: 'excellent',
      budget: 45000000
    },
    {
      id: 2,
      name: 'Instituto Los Andes',
      rbd: '67890-1',
      address: 'Calle Principal 567, Valparaíso',
      region: 'Valparaíso',
      commune: 'Valparaíso',
      phone: '+56 32 234 5678',
      email: 'info@losandes.edu.cl',
      director: 'Carlos Rodríguez Silva',
      totalStudents: 650,
      totalTeachers: 38,
      status: 'active',
      createdAt: '2024-02-01T09:00:00',
      lastSync: '2024-12-19T07:45:00',
      performance: 'good',
      budget: 38000000
    }
  ]

  const networkStats = {
    totalSchools: 4,
    totalStudents: 2847,
    totalTeachers: 189,
    averagePerformance: 8.4
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'average': return 'bg-yellow-100 text-yellow-800'
      case 'needs_improvement': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Colegios 🏫</h1>
            <p className="text-gray-600 mt-1">
              Administra y supervisa todos los colegios de la red educativa
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export functionality */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              onClick={() => {/* Create school */}}
              className="flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Agregar Colegio
            </Button>
          </div>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Colegios</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.totalSchools}</p>
                <p className="text-xs text-blue-600">Red educativa completa</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.totalStudents.toLocaleString()}</p>
                <p className="text-xs text-green-600">Matrícula total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Profesores</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.totalTeachers}</p>
                <p className="text-xs text-purple-600">Cuerpo docente</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rendimiento Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.averagePerformance}</p>
                <p className="text-xs text-yellow-600">Escala 1-10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar colegios
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nombre, RBD o director..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Región
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="input"
              >
                <option value="all">Todas las regiones</option>
                <option value="metropolitana">Metropolitana</option>
                <option value="valparaiso">Valparaíso</option>
                <option value="biobio">Biobío</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schools.map((school) => (
            <div key={school.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                      <p className="text-sm text-gray-500">RBD: {school.rbd}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(school.status)}`}>
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      <span className="capitalize">{school.status}</span>
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(school.performance)}`}>
                      <span className="capitalize">{school.performance}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {school.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {school.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {school.email}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{school.totalStudents}</p>
                    <p className="text-xs text-gray-500">Estudiantes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{school.totalTeachers}</p>
                    <p className="text-xs text-gray-500">Profesores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">{formatCurrency(school.budget)}</p>
                    <p className="text-xs text-gray-500">Presupuesto</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Director: {school.director}</p>
                      <p className="text-xs text-gray-500">
                        Última sincronización: {formatDate(school.lastSync)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* View school details */}}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Edit school */}}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* School settings */}}
                      >
                        <CogIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
} 