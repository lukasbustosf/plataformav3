'use client'

import { useState } from 'react'
import { useAuth } from '@/store'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CogIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function AdminaccesspoliciesPage() {
  const { user, isAdmin, isSuperAdmin } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Políticas de Acceso 🔐</h1>
              <p className="mt-2 opacity-90">
                Configuración de políticas de acceso y seguridad
              </p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <CogIcon className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>
        
        {/* Policy Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Políticas Activas</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500">configuradas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes Revisión</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-500">requieren atención</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Violaciones Hoy</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">sistema seguro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Access Policies Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Políticas de Acceso</h2>
                <p className="text-sm text-gray-500">Configuración de reglas de acceso por rol</p>
              </div>
              <Button
                onClick={() => toast.success('Creando nueva política...')}
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Nueva Política
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Política
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles Afectados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Modificación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Acceso MFA Obligatorio</div>
                        <div className="text-sm text-gray-500">Autenticación de dos factores requerida</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Seguridad
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Super Admin, Admin Escolar</div>
                    <div className="text-sm text-gray-500">2 roles</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Activa
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">22/06/2024</div>
                    <div className="text-sm text-gray-500">por Super Admin</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toast.success('Editando política MFA...')}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toast.success('Desactivando política...')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Restricción Horaria</div>
                        <div className="text-sm text-gray-500">Acceso limitado por horarios</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Temporal
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Estudiantes</div>
                    <div className="text-sm text-gray-500">1 rol</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Activa
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">20/06/2024</div>
                    <div className="text-sm text-gray-500">por Admin Escolar</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toast.success('Editando restricción horaria...')}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toast.success('Desactivando política...')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Bloqueo IP Sospechosa</div>
                        <div className="text-sm text-gray-500">Bloqueo automático de IPs maliciosas</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Seguridad
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Todos los roles</div>
                    <div className="text-sm text-gray-500">Global</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Activa
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">18/06/2024</div>
                    <div className="text-sm text-gray-500">por Super Admin</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toast.success('Editando bloqueo IP...')}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toast.success('Desactivando política...')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Límite Sesiones Concurrentes</div>
                        <div className="text-sm text-gray-500">Máximo 3 sesiones por usuario</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Control
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Profesores, Estudiantes</div>
                    <div className="text-sm text-gray-500">2 roles</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      Revisión
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">15/06/2024</div>
                    <div className="text-sm text-gray-500">por Admin Escolar</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toast.success('Revisando política...')}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      Revisar
                    </button>
                    <button
                      onClick={() => toast.success('Aprobando política...')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Aprobar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Policy Templates */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Plantillas de Políticas</h2>
            <p className="text-sm text-gray-500">Plantillas predefinidas para implementación rápida</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                <div className="flex items-center mb-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Seguridad Básica</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Configuración básica de seguridad con MFA y restricciones de IP
                </p>
                <Button
                  size="sm"
                  onClick={() => toast.success('Aplicando plantilla de seguridad básica...')}
                  className="w-full"
                >
                  Aplicar Plantilla
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 cursor-pointer">
                <div className="flex items-center mb-3">
                  <DocumentTextIcon className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Educación Primaria</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Políticas específicas para estudiantes de educación primaria
                </p>
                <Button
                  size="sm"
                  onClick={() => toast.success('Aplicando plantilla educación primaria...')}
                  className="w-full"
                >
                  Aplicar Plantilla
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 cursor-pointer">
                <div className="flex items-center mb-3">
                  <CogIcon className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Administración</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Políticas avanzadas para roles administrativos
                </p>
                <Button
                  size="sm"
                  onClick={() => toast.success('Aplicando plantilla administración...')}
                  className="w-full"
                >
                  Aplicar Plantilla
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
