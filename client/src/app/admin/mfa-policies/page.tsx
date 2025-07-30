'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ShieldCheckIcon,
  KeyIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function MFAPoliciesPage() {
  const [loading, setLoading] = useState(true)
  const [savingPolicy, setSavingPolicy] = useState(false)
  const [policies, setPolicies] = useState({
    super_admin: { required: true, grace_period: 0 },
    admin_escolar: { required: true, grace_period: 7 },
    bienestar_escolar: { required: false, grace_period: 14 },
    teacher: { required: false, grace_period: 30 },
    sostenedor: { required: true, grace_period: 3 }
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  const handlePolicyChange = (role: string, field: string, value: any) => {
    setPolicies(prev => ({
      ...prev,
      [role]: {
        ...prev[role as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleSavePolicies = async () => {
    setSavingPolicy(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('🔐 Políticas MFA actualizadas - P3-SEC-01')
    } catch (error) {
      toast.error('Error al guardar políticas')
    } finally {
      setSavingPolicy(false)
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      super_admin: 'Super Administrador',
      admin_escolar: 'Administrador Escolar',
      bienestar_escolar: 'Bienestar Escolar',
      teacher: 'Profesor',
      sostenedor: 'Sostenedor'
    }
    return labels[role] || role
  }

  const getRiskLevel = (role: string) => {
    const risks: Record<string, string> = {
      super_admin: 'Crítico',
      admin_escolar: 'Alto',
      bienestar_escolar: 'Medio',
      teacher: 'Bajo',
      sostenedor: 'Alto'
    }
    return risks[role] || 'Medio'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Crítico': return 'text-red-600 bg-red-100'
      case 'Alto': return 'text-orange-600 bg-orange-100'
      case 'Medio': return 'text-yellow-600 bg-yellow-100'
      case 'Bajo': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando políticas MFA...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Políticas de MFA</h1>
                <p className="text-gray-600">P3-SEC-01: Configuración de autenticación multifactor por rol</p>
              </div>
            </div>
            
            <Button
              onClick={handleSavePolicies}
              isLoading={savingPolicy}
              leftIcon={<CogIcon className="h-4 w-4" />}
            >
              Guardar Políticas
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>Los cambios en las políticas de MFA se aplicarán en el próximo inicio de sesión de los usuarios.</p>
                <p>Los usuarios existentes tendrán el período de gracia configurado para habilitar MFA.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Configuración por Rol</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {Object.entries(policies).map(([role, policy]) => (
                <div key={role} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <UserGroupIcon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{getRoleLabel(role)}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(getRiskLevel(role))}`}>
                            Riesgo: {getRiskLevel(role)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            policy.required ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {policy.required ? 'MFA Obligatorio' : 'MFA Opcional'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={policy.required}
                          onChange={(e) => handlePolicyChange(role, 'required', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Requerir MFA</span>
                      </label>
                    </div>
                  </div>
                  
                  {policy.required && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Período de gracia (días)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={policy.grace_period}
                          onChange={(e) => handlePolicyChange(role, 'grace_period', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Tiempo que tienen los usuarios para configurar MFA
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado actual
                        </label>
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-gray-700">Política configurada</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Estado de Usuarios</h3>
            
            <div className="space-y-4">
              {[
                { role: 'Super Administrador', total: 2, with_mfa: 2, pending: 0 },
                { role: 'Administrador Escolar', total: 5, with_mfa: 3, pending: 2 },
                { role: 'Bienestar Escolar', total: 3, with_mfa: 1, pending: 0 },
                { role: 'Profesor', total: 45, with_mfa: 12, pending: 0 },
                { role: 'Sostenedor', total: 1, with_mfa: 1, pending: 0 }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.role}</h4>
                    <span className="text-sm text-gray-500">{item.total} usuarios</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{item.with_mfa}</div>
                      <div className="text-xs text-gray-600">Con MFA</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-600">{item.pending}</div>
                      <div className="text-xs text-gray-600">Pendiente</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-600">{item.total - item.with_mfa - item.pending}</div>
                      <div className="text-xs text-gray-600">Sin MFA</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-l-full" 
                      style={{ width: `${(item.with_mfa / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Usuarios Pendientes</h3>
            
            <div className="space-y-3">
              {[
                { 
                  name: 'Carlos Rodríguez', 
                  role: 'Administrador Escolar', 
                  days_left: 5,
                  risk: 'medium'
                },
                { 
                  name: 'Ana Martínez', 
                  role: 'Administrador Escolar', 
                  days_left: 2,
                  risk: 'high'
                }
              ].map((user, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  user.days_left <= 2 ? 'border-red-200 bg-red-50' :
                  user.days_left <= 5 ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        user.days_left <= 2 ? 'bg-red-100' :
                        user.days_left <= 5 ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <ClockIcon className={`h-4 w-4 ${
                          user.days_left <= 2 ? 'text-red-600' :
                          user.days_left <= 5 ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.days_left <= 2 ? 'bg-red-100 text-red-700' :
                        user.days_left <= 5 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.days_left} días restantes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty state */}
              <div className="text-center py-8 text-gray-500">
                <KeyIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm">Otros usuarios están al día con MFA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Métodos MFA Disponibles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Aplicación Móvil</h4>
              <p className="text-sm text-gray-600">Google Authenticator, Authy, Microsoft Authenticator</p>
              <div className="mt-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Recomendado</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">SMS</h4>
              <p className="text-sm text-gray-600">Código de verificación por mensaje de texto</p>
              <div className="mt-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Disponible</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Email</h4>
              <p className="text-sm text-gray-600">Código de verificación por correo electrónico</p>
              <div className="mt-3">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Respaldo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Mejores Prácticas</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Configure períodos de gracia más cortos para roles de mayor riesgo</li>
            <li>• Envíe notificaciones de recordatorio a usuarios pendientes</li>
            <li>• Mantenga códigos de respaldo actualizados para emergencias</li>
            <li>• Revise regularmente el estado de cumplimiento MFA</li>
            <li>• Proporcione capacitación sobre configuración de MFA</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
} 