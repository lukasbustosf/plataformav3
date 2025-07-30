'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import toast from 'react-hot-toast'
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  PencilIcon,
  CogIcon,
  UsersIcon,
  CalendarIcon,
  BanknotesIcon,
  CpuChipIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface SchoolLicense {
  license_id: string
  school_id: string
  school_name: string
  sostenedor_name: string
  license_type: 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'expired' | 'suspended' | 'trial' | 'grace_period'
  start_date: string
  end_date: string
  max_students: number
  current_students: number
  max_teachers: number
  current_teachers: number
  features_enabled: string[]
  monthly_cost_clp: number
  ai_budget_clp: number
  ai_used_clp: number
  last_payment_date?: string
  next_billing_date: string
  payment_status: 'paid' | 'pending' | 'overdue' | 'failed'
  contract_terms: string
  auto_renew: boolean
  support_level: 'basic' | 'priority' | 'dedicated'
  compliance_status: 'compliant' | 'warning' | 'violation'
  usage_metrics: {
    monthly_logins: number
    monthly_quizzes: number
    monthly_games: number
    ai_requests: number
    storage_gb: number
  }
}

const LICENSE_FEATURES = {
  basic: [
    'Hasta 500 estudiantes',
    'Quizzes manuales ilimitados',
    'Juegos básicos (6 formatos)',
    'Reportes estándar',
    'Soporte por email',
    'Almacenamiento 10GB'
  ],
  premium: [
    'Hasta 2000 estudiantes',
    'Generación IA de quizzes',
    'Todos los formatos de juego (24)',
    'Reportes avanzados + Analytics',
    'TTS y accesibilidad',
    'Soporte prioritario',
    'Almacenamiento 50GB',
    'API access'
  ],
  enterprise: [
    'Estudiantes ilimitados',
    'IA avanzada + modelos custom',
    'Formatos de juego personalizados',
    'Dashboards ejecutivos',
    'White-label opcional',
    'Soporte dedicado 24/7',
    'Almacenamiento ilimitado',
    'SSO y compliance avanzado',
    'Multi-tenancy'
  ]
}

export default function AdminLicensesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [complianceFilter, setComplianceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('school_name')
  const [selectedLicense, setSelectedLicense] = useState<SchoolLicense | null>(null)
  const [showLicenseModal, setShowLicenseModal] = useState(false)

  // Mock license data for demonstration
  const mockLicenses: SchoolLicense[] = [
    {
      license_id: 'lic-001',
      school_id: 'school-001',
      school_name: 'Colegio San Francisco',
      sostenedor_name: 'Fundación Educacional San Francisco',
      license_type: 'premium',
      status: 'active',
      start_date: '2024-03-01',
      end_date: '2025-02-28',
      max_students: 1200,
      current_students: 987,
      max_teachers: 45,
      current_teachers: 38,
      features_enabled: ['ai_generation', 'advanced_games', 'analytics', 'tts'],
      monthly_cost_clp: 890000,
      ai_budget_clp: 150000,
      ai_used_clp: 89000,
      last_payment_date: '2025-06-01',
      next_billing_date: '2025-07-01',
      payment_status: 'paid',
      contract_terms: 'Anual con descuento 15%',
      auto_renew: true,
      support_level: 'priority',
      compliance_status: 'compliant',
      usage_metrics: {
        monthly_logins: 15420,
        monthly_quizzes: 342,
        monthly_games: 156,
        ai_requests: 2840,
        storage_gb: 23.5
      }
    },
    {
      license_id: 'lic-002',
      school_id: 'school-002',
      school_name: 'Instituto Comercial Los Andes',
      sostenedor_name: 'Corporación Educacional Los Andes',
      license_type: 'enterprise',
      status: 'active',
      start_date: '2024-01-15',
      end_date: '2026-01-14',
      max_students: 5000,
      current_students: 3245,
      max_teachers: 180,
      current_teachers: 156,
      features_enabled: ['all_features', 'white_label', 'sso', 'custom_games'],
      monthly_cost_clp: 2100000,
      ai_budget_clp: 500000,
      ai_used_clp: 312000,
      last_payment_date: '2025-06-15',
      next_billing_date: '2025-07-15',
      payment_status: 'paid',
      contract_terms: 'Bianual corporativo - descuento 25%',
      auto_renew: true,
      support_level: 'dedicated',
      compliance_status: 'compliant',
      usage_metrics: {
        monthly_logins: 42380,
        monthly_quizzes: 876,
        monthly_games: 445,
        ai_requests: 8950,
        storage_gb: 156.8
      }
    },
    {
      license_id: 'lic-003',
      school_id: 'school-003',
      school_name: 'Escuela Rural Valle Verde',
      sostenedor_name: 'Municipalidad de Valle Verde',
      license_type: 'basic',
      status: 'trial',
      start_date: '2025-06-01',
      end_date: '2025-06-30',
      max_students: 150,
      current_students: 89,
      max_teachers: 8,
      current_teachers: 6,
      features_enabled: ['basic_quizzes', 'basic_games'],
      monthly_cost_clp: 0,
      ai_budget_clp: 0,
      ai_used_clp: 0,
      next_billing_date: '2025-07-01',
      payment_status: 'pending',
      contract_terms: 'Trial 30 días gratuito',
      auto_renew: false,
      support_level: 'basic',
      compliance_status: 'compliant',
      usage_metrics: {
        monthly_logins: 892,
        monthly_quizzes: 23,
        monthly_games: 12,
        ai_requests: 0,
        storage_gb: 1.2
      }
    },
    {
      license_id: 'lic-004',
      school_id: 'school-004',
      school_name: 'Colegio Internacional Santiago',
      sostenedor_name: 'Grupo Educacional Internacional',
      license_type: 'premium',
      status: 'grace_period',
      start_date: '2024-05-01',
      end_date: '2025-04-30',
      max_students: 800,
      current_students: 756,
      max_teachers: 35,
      current_teachers: 32,
      features_enabled: ['ai_generation', 'advanced_games', 'analytics'],
      monthly_cost_clp: 650000,
      ai_budget_clp: 120000,
      ai_used_clp: 145000,
      last_payment_date: '2025-05-01',
      next_billing_date: '2025-06-01',
      payment_status: 'overdue',
      contract_terms: 'Mensual',
      auto_renew: true,
      support_level: 'priority',
      compliance_status: 'warning',
      usage_metrics: {
        monthly_logins: 12560,
        monthly_quizzes: 298,
        monthly_games: 134,
        ai_requests: 4120,
        storage_gb: 34.7
      }
    },
    {
      license_id: 'lic-005',
      school_id: 'school-005',
      school_name: 'Liceo Técnico Industrial',
      sostenedor_name: 'Fundación Técnica Industrial',
      license_type: 'basic',
      status: 'expired',
      start_date: '2024-01-01',
      end_date: '2025-05-31',
      max_students: 600,
      current_students: 0,
      max_teachers: 25,
      current_teachers: 0,
      features_enabled: [],
      monthly_cost_clp: 420000,
      ai_budget_clp: 0,
      ai_used_clp: 0,
      last_payment_date: '2025-04-01',
      next_billing_date: '2025-06-01',
      payment_status: 'failed',
      contract_terms: 'Anual',
      auto_renew: false,
      support_level: 'basic',
      compliance_status: 'violation',
      usage_metrics: {
        monthly_logins: 0,
        monthly_quizzes: 0,
        monthly_games: 0,
        ai_requests: 0,
        storage_gb: 8.9
      }
    }
  ]

  // Load licenses data - using mock data for now
  const licensesData = mockLicenses
  const isLoading = false
  const refetch = () => {}

  const licenses = mockLicenses // Use mock data for demonstration

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'trial': return 'text-blue-600 bg-blue-100'
      case 'grace_period': return 'text-yellow-600 bg-yellow-100'
      case 'expired': return 'text-gray-600 bg-gray-100'
      case 'suspended': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa'
      case 'trial': return 'Trial'
      case 'grace_period': return 'Período Gracia'
      case 'expired': return 'Expirada'
      case 'suspended': return 'Suspendida'
      default: return status
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'violation': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-blue-600 bg-blue-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getLicenseTypeColor = (type: string) => {
    switch (type) {
      case 'basic': return 'text-gray-600 bg-gray-100'
      case 'premium': return 'text-purple-600 bg-purple-100'
      case 'enterprise': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.sostenedor_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || license.status === statusFilter
    const matchesType = typeFilter === 'all' || license.license_type === typeFilter
    const matchesCompliance = complianceFilter === 'all' || license.compliance_status === complianceFilter

    return matchesSearch && matchesStatus && matchesType && matchesCompliance
  })

  const getLicenseStats = () => {
    const total = licenses.length
    const active = licenses.filter(l => l.status === 'active').length
    const trial = licenses.filter(l => l.status === 'trial').length
    const expired = licenses.filter(l => l.status === 'expired').length
    const totalRevenue = licenses
      .filter(l => l.status === 'active')
      .reduce((sum, l) => sum + l.monthly_cost_clp, 0)
    const totalStudents = licenses.reduce((sum, l) => sum + l.current_students, 0)
    const complianceIssues = licenses.filter(l => l.compliance_status !== 'compliant').length

    return { total, active, trial, expired, totalRevenue, totalStudents, complianceIssues }
  }

  const stats = getLicenseStats()

  const handleCreateLicense = () => {
    setSelectedLicense(null)
    setShowLicenseModal(true)
  }

  const handleEditLicense = (license: SchoolLicense) => {
    setSelectedLicense(license)
    setShowLicenseModal(true)
  }

  const handleSuspendLicense = async (licenseId: string) => {
    if (!confirm('¿Estás seguro de que quieres suspender esta licencia?')) return
    
    try {
      // Mock API call - replace with actual API when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Licencia suspendida')
      // refetch() - would refresh data from API
    } catch (error) {
      toast.error('Error al suspender licencia')
    }
  }

  const handleReactivateLicense = async (licenseId: string) => {
    try {
      // Mock API call - replace with actual API when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Licencia reactivada')
      // refetch() - would refresh data from API
    } catch (error) {
      toast.error('Error al reactivar licencia')
    }
  }

  const handleExportLicenses = () => {
    const csvData = licenses.map(license => ({
      'ID Licencia': license.license_id,
      'Escuela': license.school_name,
      'Sostenedor': license.sostenedor_name,
      'Tipo': license.license_type,
      'Estado': getStatusLabel(license.status),
      'Estudiantes': `${license.current_students}/${license.max_students}`,
      'Profesores': `${license.current_teachers}/${license.max_teachers}`,
      'Costo Mensual': `$${license.monthly_cost_clp.toLocaleString('es-CL')}`,
      'Próximo Pago': license.next_billing_date,
      'Compliance': license.compliance_status
    }))

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `licencias-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Licencias</h1>
            <p className="mt-1 text-sm text-gray-600">
              Administra licencias de escuelas, facturación y compliance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="outline"
              leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
              onClick={handleExportLicenses}
            >
              Exportar
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={handleCreateLicense}
            >
              Nueva Licencia
            </Button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Licencias</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">{stats.active} activas • {stats.trial} trial</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-500">CLP mensual recurrente</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Across all schools</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Alertas Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceIssues}</p>
                <p className="text-xs text-gray-500">Requieren atención</p>
              </div>
            </div>
          </div>
        </div>

        {/* License Type Comparison */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comparación de Planes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(LICENSE_FEATURES).map(([type, features]) => (
              <div key={type} className={`border-2 rounded-lg p-4 ${
                type === 'premium' ? 'border-purple-200 bg-purple-50' : 
                type === 'enterprise' ? 'border-indigo-200 bg-indigo-50' : 
                'border-gray-200 bg-gray-50'
              }`}>
                <div className="text-center mb-4">
                  <h4 className={`text-lg font-semibold capitalize ${
                    type === 'premium' ? 'text-purple-900' : 
                    type === 'enterprise' ? 'text-indigo-900' : 
                    'text-gray-900'
                  }`}>
                    {type}
                  </h4>
                  <div className="text-sm text-gray-600">
                    {licenses.filter(l => l.license_type === type && l.status === 'active').length} escuelas activas
                  </div>
                </div>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar escuela o sostenedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-4"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="trial">Trial</option>
              <option value="grace_period">Período Gracia</option>
              <option value="expired">Expiradas</option>
              <option value="suspended">Suspendidas</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todos los tipos</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>

            <select
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todo compliance</option>
              <option value="compliant">Compliant</option>
              <option value="warning">Warning</option>
              <option value="violation">Violation</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="school_name">Nombre escuela</option>
              <option value="end_date">Fecha vencimiento</option>
              <option value="monthly_cost_clp">Costo mensual</option>
              <option value="current_students">Estudiantes</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Mostrando {filteredLicenses.length} de {licenses.length} licencias
          </div>
        </div>

        {/* Licenses Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Escuela
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo & Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuarios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facturación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IA Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLicenses.map((license) => (
                  <tr key={license.license_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{license.school_name}</div>
                        <div className="text-sm text-gray-500">{license.sostenedor_name}</div>
                        <div className="text-xs text-gray-400">ID: {license.license_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLicenseTypeColor(license.license_type)}`}>
                          {license.license_type.toUpperCase()}
                        </span>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(license.status)}`}>
                            {getStatusLabel(license.status)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Vence: {new Date(license.end_date).toLocaleDateString('es-CL')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center space-x-1">
                          <UsersIcon className="h-4 w-4 text-gray-400" />
                          <span>{license.current_students}/{license.max_students}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <span className="text-xs">Prof:</span>
                          <span className="text-xs">{license.current_teachers}/{license.max_teachers}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full" 
                            style={{ width: `${(license.current_students / license.max_students) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          ${license.monthly_cost_clp.toLocaleString('es-CL')}/mes
                        </div>
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(license.payment_status)}`}>
                          {license.payment_status === 'paid' ? 'Pagado' : 
                           license.payment_status === 'pending' ? 'Pendiente' :
                           license.payment_status === 'overdue' ? 'Vencido' : 'Fallido'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Próximo: {new Date(license.next_billing_date).toLocaleDateString('es-CL')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {license.ai_budget_clp > 0 ? (
                          <>
                            <div className="flex items-center space-x-1">
                              <CpuChipIcon className="h-4 w-4 text-purple-400" />
                              <span>${license.ai_used_clp.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              de ${license.ai_budget_clp.toLocaleString('es-CL')}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div 
                                className={`h-1 rounded-full ${
                                  (license.ai_used_clp / license.ai_budget_clp) > 0.8 ? 'bg-red-500' :
                                  (license.ai_used_clp / license.ai_budget_clp) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min((license.ai_used_clp / license.ai_budget_clp) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">No incluido</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplianceColor(license.compliance_status)}`}>
                          {license.compliance_status === 'compliant' ? 'OK' :
                           license.compliance_status === 'warning' ? 'Warning' : 'Violation'}
                        </span>
                        {license.compliance_status !== 'compliant' && (
                          <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Soporte: {license.support_level}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<PencilIcon className="h-3 w-3" />}
                          onClick={() => handleEditLicense(license)}
                        >
                          Editar
                        </Button>
                        {license.status === 'active' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<XCircleIcon className="h-3 w-3" />}
                            onClick={() => handleSuspendLicense(license.license_id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Suspender
                          </Button>
                        ) : license.status === 'suspended' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<CheckCircleIcon className="h-3 w-3" />}
                            onClick={() => handleReactivateLicense(license.license_id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Reactivar
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<ChartBarIcon className="h-3 w-3" />}
                          onClick={() => router.push(`/admin/licenses/${license.license_id}/analytics`)}
                        >
                          Analytics
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Renewals & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Renewals */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Próximas Renovaciones</h3>
            <div className="space-y-3">
              {licenses
                .filter(l => {
                  const daysUntilRenewal = Math.ceil((new Date(l.next_billing_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  return daysUntilRenewal <= 30 && l.status === 'active'
                })
                .slice(0, 5)
                .map((license) => {
                  const daysUntilRenewal = Math.ceil((new Date(license.next_billing_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <div key={license.license_id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                      <div>
                        <div className="font-medium text-sm">{license.school_name}</div>
                        <div className="text-xs text-gray-500">
                          {daysUntilRenewal} días • ${license.monthly_cost_clp.toLocaleString('es-CL')}
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded ${
                        daysUntilRenewal <= 7 ? 'bg-red-100 text-red-800' :
                        daysUntilRenewal <= 14 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {new Date(license.next_billing_date).toLocaleDateString('es-CL')}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Compliance Alerts */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas de Compliance</h3>
            <div className="space-y-3">
              {licenses
                .filter(l => l.compliance_status !== 'compliant')
                .slice(0, 5)
                .map((license) => (
                  <div key={license.license_id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <div className="font-medium text-sm">{license.school_name}</div>
                      <div className="text-xs text-gray-500">
                        {license.compliance_status === 'warning' ? 'Supera límites de uso' : 'Violación de términos'}
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded ${getComplianceColor(license.compliance_status)}`}>
                      {license.compliance_status === 'warning' ? 'Warning' : 'Violation'}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
