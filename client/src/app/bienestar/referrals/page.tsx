'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  UserGroupIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BienestarReferralsPage() {
  const { user } = useAuth()

  const referralStats = {
    totalReferrals: 32,
    activeReferrals: 18,
    completedThisMonth: 8,
    pendingResponse: 6
  }

  const handleCreateReferral = () => {
    toast.success('Creando nueva derivación...')
  }

  const handleViewReferral = (id: string) => {
    toast.success(`Abriendo derivación ${id}...`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Derivaciones</h1>
            <p className="text-gray-600">Gestión de derivaciones a profesionales externos y especialistas</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleCreateReferral} className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Derivación
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Derivaciones</p>
                <p className="text-2xl font-bold text-blue-600">{referralStats.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowRightIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activas</p>
                <p className="text-2xl font-bold text-green-600">{referralStats.activeReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <p className="text-2xl font-bold text-purple-600">{referralStats.completedThisMonth}</p>
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
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{referralStats.pendingResponse}</p>
              </div>
            </div>
          </div>
        </div>

        {/* External Providers */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Red de Profesionales</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Centro de Psicología Infantil</h3>
                    <p className="text-sm text-gray-600">Dr. Manuel Rodríguez</p>
                    <p className="text-xs text-gray-500">Especialista en terapia familiar</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    Contactar
                  </Button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Clínica Neuropsiquiátrica</h3>
                    <p className="text-sm text-gray-600">Dra. Carmen Silva</p>
                    <p className="text-xs text-gray-500">Trastornos del aprendizaje</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    Contactar
                  </Button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Centro Comunitario</h3>
                    <p className="text-sm text-gray-600">Trabajadora Social</p>
                    <p className="text-xs text-gray-500">Apoyo sociofamiliar</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    Contactar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Derivaciones Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional/Centro
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Derivación
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { id: 'DER-001', student: 'María González', grade: '7°A', specialty: 'Psicología Clínica', provider: 'Dr. Manuel Rodríguez', status: 'active', date: '2024-12-15' },
                  { id: 'DER-002', student: 'Carlos Mendoza', grade: '2°B', specialty: 'Neuropsiquiatría', provider: 'Dra. Carmen Silva', status: 'pending', date: '2024-12-18' },
                  { id: 'DER-003', student: 'Ana Herrera', grade: '5°A', specialty: 'Terapia Familiar', provider: 'Centro Comunitario', status: 'completed', date: '2024-11-20' }
                ].map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{referral.student}</div>
                      <div className="text-sm text-gray-600">{referral.grade}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{referral.specialty}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{referral.provider}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        referral.status === 'completed' ? 'bg-green-100 text-green-800' :
                        referral.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referral.status === 'completed' ? 'Completada' :
                         referral.status === 'active' ? 'Activa' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(referral.date).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewReferral(referral.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver Derivación"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 