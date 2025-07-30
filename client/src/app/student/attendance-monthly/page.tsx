'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function AttendanceMonthlyPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando asistencia mensual...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Asistencia Mensual</h1>
              <p className="text-gray-600">P3-S-03: Vista móvil de asistencia</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Marzo 2025</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">17</div>
              <div className="text-sm text-gray-600">Días Presente</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-gray-600">Ausencias</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-gray-600">Atrasos</div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 20 }, (_, i) => {
              const status = Math.random() > 0.15 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late')
              const color = status === 'present' ? 'bg-green-500' : 
                           status === 'late' ? 'bg-yellow-500' : 'bg-red-500'
              return (
                <div key={i} className={`w-full h-12 rounded-lg flex items-center justify-center text-white text-sm font-medium ${color}`}>
                  {i + 1}
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 flex gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span>Presente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span>Tarde</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span>Ausente</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Estadísticas del Mes</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Porcentaje de Asistencia</span>
              <span className="font-semibold text-green-600">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Porcentaje de Puntualidad</span>
              <span className="font-semibold text-blue-600">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tendencia</span>
              <span className="font-semibold text-gray-600">📈 Estable</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 