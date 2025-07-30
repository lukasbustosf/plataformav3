'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  BuildingOffice2Icon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  BellIcon,
  ChartBarIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  KeyIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function SostenedorSettingsPage() {
  const { user, fullName } = useAuth()
  const [activeTab, setActiveTab] = useState('general')

  const [settings, setSettings] = useState({
    general: {
      organizationName: 'Fundación Educacional San Pedro',
      rut: '12.345.678-9',
      address: 'Av. Las Condes 4567, Santiago',
      phone: '+56 2 2890 1234',
      email: 'contacto@fesp.cl',
      website: 'www.fundacionsanpedro.cl',
      representativeName: 'María Elena Rodriguez',
      representativePosition: 'Directora General'
    },
    schools: {
      maxSchools: 25,
      currentSchools: 12,
      autoApproval: false,
      requireCompliance: true,
      monthlyReports: true,
      consolidatedBilling: true
    },
    financial: {
      currency: 'CLP',
      billingCycle: 'monthly',
      paymentMethod: 'transfer',
      budgetAlert: true,
      budgetThreshold: 80,
      costCenter: 'EDU-001',
      taxId: '12345678-9'
    },
    compliance: {
      dataRetention: 7, // years
      auditLogs: true,
      privacyCompliance: true,
      securityReports: true,
      incidentReporting: true,
      regulatoryUpdates: true
    },
    analytics: {
      crossSchoolAnalytics: true,
      consolidatedReports: true,
      benchmarking: true,
      predictiveAnalytics: false,
      exportCapabilities: true,
      dataVisualization: true
    },
    notifications: {
      systemAlerts: true,
      financialAlerts: true,
      complianceAlerts: true,
      performanceAlerts: true,
      monthlyDigest: true,
      emergencyAlerts: true
    }
  })

  const handleSave = (section: string) => {
    toast.success(`Configuración de ${section} guardada exitosamente`)
  }

  const tabs = [
    { id: 'general', name: 'General', icon: BuildingOffice2Icon },
    { id: 'schools', name: 'Colegios', icon: BuildingOffice2Icon },
    { id: 'financial', name: 'Financiero', icon: CurrencyDollarIcon },
    { id: 'compliance', name: 'Cumplimiento', icon: ShieldCheckIcon },
    { id: 'analytics', name: 'Analíticas', icon: ChartBarIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Configuración del Sostenedor ⚙️</h1>
          <p className="mt-2 opacity-90">
            Administra la configuración organizacional de {settings.general.organizationName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white shadow rounded-lg p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 bg-white shadow rounded-lg">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <BuildingOffice2Icon className="h-8 w-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Organización
                      </label>
                      <input
                        type="text"
                        value={settings.general.organizationName}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, organizationName: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RUT
                      </label>
                      <input
                        type="text"
                        value={settings.general.rut}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, rut: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={settings.general.address}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, address: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={settings.general.phone}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, phone: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.general.email}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, email: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sitio Web
                      </label>
                      <input
                        type="url"
                        value={settings.general.website}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, website: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Representante Legal
                      </label>
                      <input
                        type="text"
                        value={settings.general.representativeName}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, representativeName: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={settings.general.representativePosition}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, representativePosition: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave('general')}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}

            {/* Schools Tab */}
            {activeTab === 'schools' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <BuildingOffice2Icon className="h-8 w-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Gestión de Colegios</h2>
                </div>

                <div className="space-y-6">
                  {/* Schools Stats */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h3 className="font-medium text-indigo-900 mb-4">Estado Actual</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Máximo de Colegios
                        </label>
                        <input
                          type="number"
                          value={settings.schools.maxSchools}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            schools: { ...prev.schools, maxSchools: parseInt(e.target.value) }
                          }))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Colegios Actuales
                        </label>
                        <input
                          type="number"
                          value={settings.schools.currentSchools}
                          readOnly
                          className="input-field bg-gray-50"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="w-full">
                          <div className="bg-gray-200 rounded-full h-4">
                            <div 
                              className="bg-indigo-600 h-4 rounded-full" 
                              style={{ width: `${(settings.schools.currentSchools / settings.schools.maxSchools) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {Math.round((settings.schools.currentSchools / settings.schools.maxSchools) * 100)}% utilizado
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* School Management Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Aprobación Automática</h3>
                        <p className="text-sm text-gray-600">Aprobar automáticamente nuevos colegios</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.schools.autoApproval}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          schools: { ...prev.schools, autoApproval: e.target.checked }
                        }))}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Cumplimiento Obligatorio</h3>
                        <p className="text-sm text-gray-600">Exigir cumplimiento de estándares antes de activación</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.schools.requireCompliance}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          schools: { ...prev.schools, requireCompliance: e.target.checked }
                        }))}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Reportes Mensuales</h3>
                        <p className="text-sm text-gray-600">Generar reportes mensuales automáticos</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.schools.monthlyReports}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          schools: { ...prev.schools, monthlyReports: e.target.checked }
                        }))}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Facturación Consolidada</h3>
                        <p className="text-sm text-gray-600">Una sola factura para todos los colegios</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.schools.consolidatedBilling}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          schools: { ...prev.schools, consolidatedBilling: e.target.checked }
                        }))}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave('colegios')}>
                    Guardar Configuración de Colegios
                  </Button>
                </div>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === 'financial' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <CurrencyDollarIcon className="h-8 w-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Configuración Financiera</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moneda
                      </label>
                      <select
                        value={settings.financial.currency}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          financial: { ...prev.financial, currency: e.target.value }
                        }))}
                        className="input-field"
                      >
                        <option value="CLP">Peso Chileno (CLP)</option>
                        <option value="USD">Dólar Americano (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciclo de Facturación
                      </label>
                      <select
                        value={settings.financial.billingCycle}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          financial: { ...prev.financial, billingCycle: e.target.value }
                        }))}
                        className="input-field"
                      >
                        <option value="monthly">Mensual</option>
                        <option value="quarterly">Trimestral</option>
                        <option value="annually">Anual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Método de Pago
                      </label>
                      <select
                        value={settings.financial.paymentMethod}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          financial: { ...prev.financial, paymentMethod: e.target.value }
                        }))}
                        className="input-field"
                      >
                        <option value="transfer">Transferencia Bancaria</option>
                        <option value="credit">Tarjeta de Crédito</option>
                        <option value="debit">Débito Automático</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Centro de Costo
                      </label>
                      <input
                        type="text"
                        value={settings.financial.costCenter}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          financial: { ...prev.financial, costCenter: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RUT para Facturación
                      </label>
                      <input
                        type="text"
                        value={settings.financial.taxId}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          financial: { ...prev.financial, taxId: e.target.value }
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Umbral de Alerta (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.financial.budgetThreshold}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          financial: { ...prev.financial, budgetThreshold: parseInt(e.target.value) }
                        }))}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Alertas de Presupuesto</h3>
                      <p className="text-sm text-gray-600">Recibir notificaciones cuando se alcance el umbral</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.financial.budgetAlert}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        financial: { ...prev.financial, budgetAlert: e.target.checked }
                      }))}
                      className="h-4 w-4 text-indigo-600 rounded"
                    />
                  </div>

                  <Button onClick={() => handleSave('financiero')}>
                    Guardar Configuración Financiera
                  </Button>
                </div>
              </div>
            )}

            {/* Compliance Tab */}
            {activeTab === 'compliance' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Cumplimiento y Seguridad</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retención de Datos (años)
                    </label>
                    <select
                      value={settings.compliance.dataRetention}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        compliance: { ...prev.compliance, dataRetention: parseInt(e.target.value) }
                      }))}
                      className="input-field max-w-xs"
                    >
                      <option value={1}>1 año</option>
                      <option value={3}>3 años</option>
                      <option value={5}>5 años</option>
                      <option value={7}>7 años</option>
                      <option value={10}>10 años</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(settings.compliance).filter(([key]) => key !== 'dataRetention').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {key === 'auditLogs' ? 'Registros de Auditoría' :
                             key === 'privacyCompliance' ? 'Cumplimiento de Privacidad' :
                             key === 'securityReports' ? 'Reportes de Seguridad' :
                             key === 'incidentReporting' ? 'Reporte de Incidentes' :
                             'Actualizaciones Regulatorias'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {key === 'auditLogs' ? 'Mantener logs detallados de todas las acciones' :
                             key === 'privacyCompliance' ? 'Cumplir con leyes de protección de datos' :
                             key === 'securityReports' ? 'Generar reportes automáticos de seguridad' :
                             key === 'incidentReporting' ? 'Sistema automático de reporte de incidentes' :
                             'Recibir actualizaciones sobre cambios regulatorios'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            compliance: { ...prev.compliance, [key]: e.target.checked }
                          }))}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Importante</h3>
                    <p className="text-sm text-yellow-700">
                      Esta configuración afecta el cumplimiento legal y regulatorio. Consulte con su área legal antes de realizar cambios.
                    </p>
                  </div>

                  <Button onClick={() => handleSave('cumplimiento')}>
                    Guardar Configuración de Cumplimiento
                  </Button>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <ChartBarIcon className="h-8 w-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Analíticas y Reportes</h2>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.analytics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {key === 'crossSchoolAnalytics' ? 'Analíticas Entre Colegios' :
                           key === 'consolidatedReports' ? 'Reportes Consolidados' :
                           key === 'benchmarking' ? 'Benchmarking' :
                           key === 'predictiveAnalytics' ? 'Analíticas Predictivas' :
                           key === 'exportCapabilities' ? 'Capacidades de Exportación' :
                           'Visualización de Datos'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {key === 'crossSchoolAnalytics' ? 'Comparar métricas entre diferentes colegios' :
                           key === 'consolidatedReports' ? 'Reportes que incluyen todos los colegios' :
                           key === 'benchmarking' ? 'Comparación con estándares de la industria' :
                           key === 'predictiveAnalytics' ? 'Análisis predictivo con IA (Beta)' :
                           key === 'exportCapabilities' ? 'Exportar datos a Excel, PDF y otros formatos' :
                           'Gráficos y dashboards interactivos'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          analytics: { ...prev.analytics, [key]: e.target.checked }
                        }))}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button onClick={() => handleSave('analíticas')}>
                    Guardar Configuración de Analíticas
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <BellIcon className="h-8 w-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {key === 'systemAlerts' ? 'Alertas del Sistema' :
                           key === 'financialAlerts' ? 'Alertas Financieras' :
                           key === 'complianceAlerts' ? 'Alertas de Cumplimiento' :
                           key === 'performanceAlerts' ? 'Alertas de Rendimiento' :
                           key === 'monthlyDigest' ? 'Resumen Mensual' :
                           'Alertas de Emergencia'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {key === 'systemAlerts' ? 'Notificaciones sobre estado del sistema y mantenimiento' :
                           key === 'financialAlerts' ? 'Alertas sobre presupuesto y facturación' :
                           key === 'complianceAlerts' ? 'Alertas sobre cumplimiento y seguridad' :
                           key === 'performanceAlerts' ? 'Alertas sobre rendimiento de colegios' :
                           key === 'monthlyDigest' ? 'Resumen mensual consolidado de actividad' :
                           'Alertas críticas que requieren atención inmediata'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, [key]: e.target.checked }
                        }))}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button onClick={() => handleSave('notificaciones')}>
                    Guardar Preferencias de Notificación
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 