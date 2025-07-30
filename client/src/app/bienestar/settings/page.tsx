'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CogIcon,
  BellIcon,
  ClockIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BienestarSettingsPage() {
  const { user } = useAuth()
  
  // Alert Settings
  const [alertSettings, setAlertSettings] = useState({
    riskStudentThreshold: 3,
    absenceAlertDays: 3,
    behaviorIncidentThreshold: 2,
    paiReviewReminder: 7,
    interventionMissedSessions: 2,
    emailNotifications: true,
    smsNotifications: false,
    dashboardAlerts: true,
    weeklyReports: true
  })

  // Risk Assessment Settings
  const [riskSettings, setRiskSettings] = useState({
    academicRiskThreshold: 4.0,
    attendanceRiskThreshold: 85,
    behaviorRiskThreshold: 5,
    autoAssignRiskLevel: true,
    requireSupervisorApproval: true,
    riskReviewFrequency: 30
  })

  // Intervention Settings
  const [interventionSettings, setInterventionSettings] = useState({
    maxSessionsPerWeek: 3,
    defaultSessionDuration: 45,
    requireParentConsent: true,
    autoScheduleFollowUp: true,
    interventionTimeout: 180,
    allowSelfReferral: false
  })

  // Professional Settings
  const [professionalSettings, setProfessionalSettings] = useState({
    requireLicense: true,
    maxCasesPerProfessional: 15,
    requireSupervision: true,
    documentationDeadline: 24,
    qualificationRequirement: 'degree'
  })

  // Report Settings
  const [reportSettings, setReportSettings] = useState({
    autoGenerateMonthly: true,
    includePersonalData: false,
    shareWithEducationalTeam: true,
    retentionPeriodYears: 7,
    reportFormat: 'pdf',
    includePhotos: false
  })

  const handleSaveSettings = () => {
    toast.success('Configuración guardada exitosamente')
  }

  const handleResetSettings = () => {
    if (confirm('¿Estás seguro de que deseas restablecer todas las configuraciones a sus valores por defecto?')) {
      toast.success('Configuración restablecida a valores por defecto')
    }
  }

  const handleTestNotifications = () => {
    toast.success('Notificación de prueba enviada')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración de Bienestar ⚙️</h1>
                <p className="text-gray-600 mt-1">
                  Configuración del sistema de bienestar estudiantil
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleResetSettings}
                  variant="outline"
                >
                  Restablecer
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alert Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <BellIcon className="h-6 w-6 text-yellow-600 mr-3" />
                <h2 className="text-lg font-medium text-gray-900">Alertas y Notificaciones</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Umbral para alerta de estudiante en riesgo
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={alertSettings.riskStudentThreshold}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      riskStudentThreshold: parseInt(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">factores de riesgo</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de ausencia para alerta
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={alertSettings.absenceAlertDays}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      absenceAlertDays: parseInt(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">días consecutivos</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Umbral de incidentes de comportamiento
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={alertSettings.behaviorIncidentThreshold}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      behaviorIncidentThreshold: parseInt(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">incidentes por semana</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recordatorio de revisión PAI
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={alertSettings.paiReviewReminder}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      paiReviewReminder: parseInt(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">días antes del vencimiento</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Tipos de notificaciones</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={alertSettings.emailNotifications}
                      onChange={(e) => setAlertSettings({
                        ...alertSettings,
                        emailNotifications: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Notificaciones por email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={alertSettings.smsNotifications}
                      onChange={(e) => setAlertSettings({
                        ...alertSettings,
                        smsNotifications: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Notificaciones SMS</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={alertSettings.dashboardAlerts}
                      onChange={(e) => setAlertSettings({
                        ...alertSettings,
                        dashboardAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Alertas en dashboard</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={alertSettings.weeklyReports}
                      onChange={(e) => setAlertSettings({
                        ...alertSettings,
                        weeklyReports: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Reportes semanales automáticos</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleTestNotifications}
                variant="outline"
                className="w-full"
              >
                Probar Notificaciones
              </Button>
            </div>
          </div>

          {/* Risk Assessment Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-lg font-medium text-gray-900">Evaluación de Riesgo</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Umbral de riesgo académico (promedio)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="1.0"
                    max="7.0"
                    step="0.1"
                    value={riskSettings.academicRiskThreshold}
                    onChange={(e) => setRiskSettings({
                      ...riskSettings,
                      academicRiskThreshold: parseFloat(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">nota promedio</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Umbral de riesgo por asistencia
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="60"
                    max="100"
                    value={riskSettings.attendanceRiskThreshold}
                    onChange={(e) => setRiskSettings({
                      ...riskSettings,
                      attendanceRiskThreshold: parseInt(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">% de asistencia</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia de revisión de riesgo
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="7"
                    max="90"
                    value={riskSettings.riskReviewFrequency}
                    onChange={(e) => setRiskSettings({
                      ...riskSettings,
                      riskReviewFrequency: parseInt(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">días</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Configuraciones automáticas</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={riskSettings.autoAssignRiskLevel}
                      onChange={(e) => setRiskSettings({
                        ...riskSettings,
                        autoAssignRiskLevel: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Asignar nivel de riesgo automáticamente</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={riskSettings.requireSupervisorApproval}
                      onChange={(e) => setRiskSettings({
                        ...riskSettings,
                        requireSupervisorApproval: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Requerir aprobación del supervisor</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Intervention Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <HeartIcon className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-lg font-medium text-gray-900">Intervenciones</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de sesiones por semana
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={interventionSettings.maxSessionsPerWeek}
                  onChange={(e) => setInterventionSettings({
                    ...interventionSettings,
                    maxSessionsPerWeek: parseInt(e.target.value)
                  })}
                  className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración por defecto de sesión
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="15"
                    max="120"
                    step="15"
                    value={interventionSettings.defaultSessionDuration}
                    onChange={(e) => setInterventionSettings({
                      ...interventionSettings,
                      defaultSessionDuration: parseInt(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">minutos</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo límite de intervención
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={interventionSettings.interventionTimeout}
                    onChange={(e) => setInterventionSettings({
                      ...interventionSettings,
                      interventionTimeout: parseInt(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">días</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Políticas de intervención</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={interventionSettings.requireParentConsent}
                      onChange={(e) => setInterventionSettings({
                        ...interventionSettings,
                        requireParentConsent: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Requerir consentimiento de apoderados</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={interventionSettings.autoScheduleFollowUp}
                      onChange={(e) => setInterventionSettings({
                        ...interventionSettings,
                        autoScheduleFollowUp: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Programar seguimiento automáticamente</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={interventionSettings.allowSelfReferral}
                      onChange={(e) => setInterventionSettings({
                        ...interventionSettings,
                        allowSelfReferral: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Permitir auto-derivación de estudiantes</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <UserIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-lg font-medium text-gray-900">Profesionales</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de casos por profesional
                </label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={professionalSettings.maxCasesPerProfessional}
                  onChange={(e) => setProfessionalSettings({
                    ...professionalSettings,
                    maxCasesPerProfessional: parseInt(e.target.value)
                  })}
                  className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plazo para documentación
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="2"
                    max="72"
                    value={professionalSettings.documentationDeadline}
                    onChange={(e) => setProfessionalSettings({
                      ...professionalSettings,
                      documentationDeadline: parseInt(e.target.value)
                    })}
                    className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <span className="text-sm text-gray-500">horas</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requisito de calificación mínima
                </label>
                <select
                  value={professionalSettings.qualificationRequirement}
                  onChange={(e) => setProfessionalSettings({
                    ...professionalSettings,
                    qualificationRequirement: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="certificate">Certificado</option>
                  <option value="diploma">Diploma</option>
                  <option value="degree">Título universitario</option>
                  <option value="master">Magíster</option>
                </select>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Requisitos profesionales</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={professionalSettings.requireLicense}
                      onChange={(e) => setProfessionalSettings({
                        ...professionalSettings,
                        requireLicense: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Requerir licencia profesional vigente</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={professionalSettings.requireSupervision}
                      onChange={(e) => setProfessionalSettings({
                        ...professionalSettings,
                        requireSupervision: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Requerir supervisión clínica</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Report Settings */}
          <div className="bg-white shadow rounded-lg lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-lg font-medium text-gray-900">Reportes y Documentación</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Período de retención de datos
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={reportSettings.retentionPeriodYears}
                        onChange={(e) => setReportSettings({
                          ...reportSettings,
                          retentionPeriodYears: parseInt(e.target.value)
                        })}
                        className="w-20 border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      <span className="text-sm text-gray-500">años</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato por defecto de reportes
                    </label>
                    <select
                      value={reportSettings.reportFormat}
                      onChange={(e) => setReportSettings({
                        ...reportSettings,
                        reportFormat: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="word">Word</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">Configuraciones de privacidad</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportSettings.autoGenerateMonthly}
                        onChange={(e) => setReportSettings({
                          ...reportSettings,
                          autoGenerateMonthly: e.target.checked
                        })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Generar reportes mensuales automáticamente</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportSettings.includePersonalData}
                        onChange={(e) => setReportSettings({
                          ...reportSettings,
                          includePersonalData: e.target.checked
                        })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Incluir datos personales en reportes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportSettings.shareWithEducationalTeam}
                        onChange={(e) => setReportSettings({
                          ...reportSettings,
                          shareWithEducationalTeam: e.target.checked
                        })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Compartir con equipo educativo</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportSettings.includePhotos}
                        onChange={(e) => setReportSettings({
                          ...reportSettings,
                          includePhotos: e.target.checked
                        })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Incluir fotografías en documentos</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Gestión de Configuración</h3>
              <p className="text-sm text-gray-500 mt-1">
                Última actualización: {new Date().toLocaleDateString('es-CL')}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleResetSettings}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Restablecer Todo
              </Button>
              <Button
                onClick={handleSaveSettings}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Guardar Todos los Cambios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 