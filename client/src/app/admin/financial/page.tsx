'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  BanknotesIcon,
  CreditCardIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'

// P2-O-04: Monthly Financial Summary Interface
interface MonthlyFinancialSummary {
  month: string
  year: number
  total_revenue_clp: number
  total_expenses_clp: number
  net_profit_clp: number
  profit_margin_percent: number
  
  // Revenue breakdown
  subscription_revenue: number
  ai_usage_revenue: number
  premium_features_revenue: number
  training_services_revenue: number
  
  // Expense breakdown
  infrastructure_costs: number
  ai_tokens_costs: number
  staff_costs: number
  marketing_costs: number
  other_operational_costs: number
  
  // School statistics
  active_schools: number
  new_schools_this_month: number
  churned_schools: number
  average_revenue_per_school: number
  
  // Payment status
  pending_payments_clp: number
  overdue_payments_clp: number
  collected_payments_clp: number
  payment_success_rate: number
  
  // AI usage costs
  total_ai_tokens_used: number
  ai_cost_per_school_avg: number
  schools_over_ai_budget: number
  
  // Growth metrics
  revenue_growth_percent: number
  school_growth_percent: number
  ai_usage_growth_percent: number
  
  created_at: string
  updated_at: string
}

export default function FinancialMonitoringPage() {
  const [currentMonth, setCurrentMonth] = useState<MonthlyFinancialSummary | null>(null)
  const [historicalData, setHistoricalData] = useState<MonthlyFinancialSummary[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().substring(0, 7))
  const [loading, setLoading] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [generateReportLoading, setGenerateReportLoading] = useState(false)

  // P2-O-04: Mock financial data
  const mockFinancialData: MonthlyFinancialSummary[] = [
    {
      month: '2024-01',
      year: 2024,
      total_revenue_clp: 45_600_000,
      total_expenses_clp: 32_800_000,
      net_profit_clp: 12_800_000,
      profit_margin_percent: 28.1,
      
      subscription_revenue: 35_200_000,
      ai_usage_revenue: 8_400_000,
      premium_features_revenue: 1_600_000,
      training_services_revenue: 400_000,
      
      infrastructure_costs: 8_500_000,
      ai_tokens_costs: 12_300_000,
      staff_costs: 8_900_000,
      marketing_costs: 2_100_000,
      other_operational_costs: 1_000_000,
      
      active_schools: 284,
      new_schools_this_month: 23,
      churned_schools: 5,
      average_revenue_per_school: 160_563,
      
      pending_payments_clp: 3_200_000,
      overdue_payments_clp: 890_000,
      collected_payments_clp: 41_510_000,
      payment_success_rate: 93.2,
      
      total_ai_tokens_used: 2_847_392,
      ai_cost_per_school_avg: 43_310,
      schools_over_ai_budget: 18,
      
      revenue_growth_percent: 12.5,
      school_growth_percent: 8.8,
      ai_usage_growth_percent: 24.3,
      
      created_at: '2024-01-31T23:59:59Z',
      updated_at: '2024-01-31T23:59:59Z'
    },
    {
      month: '2024-02',
      year: 2024,
      total_revenue_clp: 48_900_000,
      total_expenses_clp: 34_100_000,
      net_profit_clp: 14_800_000,
      profit_margin_percent: 30.3,
      
      subscription_revenue: 37_800_000,
      ai_usage_revenue: 9_200_000,
      premium_features_revenue: 1_500_000,
      training_services_revenue: 400_000,
      
      infrastructure_costs: 8_800_000,
      ai_tokens_costs: 13_100_000,
      staff_costs: 9_200_000,
      marketing_costs: 2_400_000,
      other_operational_costs: 600_000,
      
      active_schools: 302,
      new_schools_this_month: 21,
      churned_schools: 3,
      average_revenue_per_school: 162_059,
      
      pending_payments_clp: 2_800_000,
      overdue_payments_clp: 450_000,
      collected_payments_clp: 45_650_000,
      payment_success_rate: 94.8,
      
      total_ai_tokens_used: 3_124_587,
      ai_cost_per_school_avg: 43_411,
      schools_over_ai_budget: 22,
      
      revenue_growth_percent: 7.2,
      school_growth_percent: 6.3,
      ai_usage_growth_percent: 9.7,
      
      created_at: '2024-02-29T23:59:59Z',
      updated_at: '2024-02-29T23:59:59Z'
    }
  ]

  useEffect(() => {
    setHistoricalData(mockFinancialData)
    setCurrentMonth(mockFinancialData[mockFinancialData.length - 1])
  }, [])

  // P2-O-04: Generate monthly financial report
  const handleGenerateMonthlyReport = async () => {
    setGenerateReportLoading(true)
    try {
      const response = await fetch('/api/admin/financial/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          month: selectedMonth,
          format: 'pdf', // or 'excel'
          include_detailed_breakdown: true,
          include_school_analysis: true,
          include_ai_usage_details: true
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Reporte financiero generado exitosamente - P2-O-04')
        
        // Download the generated report
        const link = document.createElement('a')
        link.href = data.download_url
        link.download = `reporte_financiero_${selectedMonth}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Error al generar reporte financiero')
      console.error('Report generation error:', error)
    } finally {
      setGenerateReportLoading(false)
    }
  }

  // P2-O-04: Send monthly summary to stakeholders
  const handleSendMonthlySummary = async () => {
    try {
      const response = await fetch('/api/admin/financial/send-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          month: selectedMonth,
          recipients: ['ceo@edu21.cl', 'cfo@edu21.cl', 'board@edu21.cl'],
          include_charts: true,
          include_recommendations: true
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Resumen financiero enviado a stakeholders - P2-O-04')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Error al enviar resumen financiero')
      console.error('Summary sending error:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (!currentMonth) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Cargando datos financieros...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Monitoreo Financiero - P2-O-04</h1>
            <p className="mt-1 text-sm text-gray-600">
              Resumen financiero mensual y análisis de ingresos/gastos
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {historicalData.map((data) => (
                <option key={data.month} value={data.month}>
                  {new Date(`${data.month}-01`).toLocaleDateString('es-CL', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
              onClick={handleGenerateMonthlyReport}
              isLoading={generateReportLoading}
            >
              Generar Reporte
            </Button>
            
            <Button
              variant="primary"
              leftIcon={<BanknotesIcon className="h-4 w-4" />}
              onClick={handleSendMonthlySummary}
            >
              Enviar Resumen
            </Button>
          </div>
        </div>

        {/* Key Financial Metrics - P2-O-04 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(currentMonth.total_revenue_clp)}
                </p>
                <div className="flex items-center mt-1">
                  {currentMonth.revenue_growth_percent > 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    currentMonth.revenue_growth_percent > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercent(currentMonth.revenue_growth_percent)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <CreditCardIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(currentMonth.total_expenses_clp)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {((currentMonth.total_expenses_clp / currentMonth.total_revenue_clp) * 100).toFixed(1)}% de ingresos
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilidad Neta</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(currentMonth.net_profit_clp)}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Margen: {currentMonth.profit_margin_percent.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <BuildingOffice2Icon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Escuelas Activas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentMonth.active_schools}
                </p>
                <div className="flex items-center mt-1">
                                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      +{currentMonth.new_schools_this_month} este mes
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Desglose de Ingresos</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Suscripciones</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentMonth.subscription_revenue)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(currentMonth.subscription_revenue / currentMonth.total_revenue_clp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uso de IA</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentMonth.ai_usage_revenue)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(currentMonth.ai_usage_revenue / currentMonth.total_revenue_clp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Características Premium</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentMonth.premium_features_revenue)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(currentMonth.premium_features_revenue / currentMonth.total_revenue_clp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Servicios de Capacitación</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentMonth.training_services_revenue)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(currentMonth.training_services_revenue / currentMonth.total_revenue_clp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Desglose de Gastos</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tokens IA</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentMonth.ai_tokens_costs)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(currentMonth.ai_tokens_costs / currentMonth.total_expenses_clp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Personal</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentMonth.staff_costs)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(currentMonth.staff_costs / currentMonth.total_expenses_clp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Infraestructura</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentMonth.infrastructure_costs)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(currentMonth.infrastructure_costs / currentMonth.total_expenses_clp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Marketing</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentMonth.marketing_costs)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(currentMonth.marketing_costs / currentMonth.total_expenses_clp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Otros Operacionales</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(currentMonth.other_operational_costs)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full" 
                      style={{ width: `${(currentMonth.other_operational_costs / currentMonth.total_expenses_clp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status and AI Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Pagos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">Pagos Cobrados</span>
                </div>
                <span className="text-sm font-medium text-green-900">
                  {formatCurrency(currentMonth.collected_payments_clp)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-800">Pagos Pendientes</span>
                </div>
                <span className="text-sm font-medium text-yellow-900">
                  {formatCurrency(currentMonth.pending_payments_clp)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm text-red-800">Pagos Vencidos</span>
                </div>
                <span className="text-sm font-medium text-red-900">
                  {formatCurrency(currentMonth.overdue_payments_clp)}
                </span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Tasa de Éxito</span>
                  <span className="text-lg font-bold text-green-600">
                    {currentMonth.payment_success_rate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis de Uso IA</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tokens Totales Usados</span>
                <span className="text-sm font-medium text-gray-900">
                  {currentMonth.total_ai_tokens_used.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Costo Promedio por Escuela</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(currentMonth.ai_cost_per_school_avg)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Escuelas Sobre Presupuesto</span>
                <span className={`text-sm font-medium ${
                  currentMonth.schools_over_ai_budget > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {currentMonth.schools_over_ai_budget}
                </span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Crecimiento Uso IA</span>
                  <span className={`text-lg font-bold ${
                    currentMonth.ai_usage_growth_percent > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercent(currentMonth.ai_usage_growth_percent)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Trend Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Tendencia Histórica</h3>
            <Button
              variant="outline"
              leftIcon={<ChartBarIcon className="h-4 w-4" />}
              onClick={() => setShowDetailModal(true)}
            >
              Ver Detalles
            </Button>
          </div>
          
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Gráfico de tendencias financieras mensuales
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Implementación de gráficos con Chart.js o similar
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 