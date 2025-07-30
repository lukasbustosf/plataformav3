'use client'

import { useEffect, useRef } from 'react'

interface WeeklyData {
  week: number
  attendance_rate: number
  punctuality_rate: number
}

interface AttendanceChartProps {
  data: WeeklyData[]
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Chart dimensions
    const padding = 40
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Draw grid lines
    ctx.strokeStyle = '#e5e5e5'
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding + (chartHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(rect.width - padding, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i <= data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, rect.height - padding)
      ctx.stroke()
    }

    // Draw attendance line
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    data.forEach((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = rect.height - padding - (chartHeight * item.attendance_rate / 100)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw punctuality line
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    data.forEach((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = rect.height - padding - (chartHeight * item.punctuality_rate / 100)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw data points
    data.forEach((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      
      // Attendance point
      const attendanceY = rect.height - padding - (chartHeight * item.attendance_rate / 100)
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(x, attendanceY, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Punctuality point
      const punctualityY = rect.height - padding - (chartHeight * item.punctuality_rate / 100)
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.arc(x, punctualityY, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw labels
    ctx.font = '12px system-ui'
    ctx.fillStyle = '#666'
    ctx.textAlign = 'center'

    // Week labels
    data.forEach((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      ctx.fillText(`Sem ${item.week}`, x, rect.height - 10)
    })

    // Y-axis labels
    ctx.textAlign = 'right'
    for (let i = 0; i <= 10; i++) {
      const y = padding + (chartHeight / 10) * i
      const value = 100 - (i * 10)
      ctx.fillText(`${value}%`, padding - 10, y + 4)
    }

  }, [data])

  return (
    <div className="space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-64 border border-gray-200 rounded-lg bg-white"
        />
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Asistencia</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Puntualidad</span>
        </div>
      </div>

      {/* Mobile Summary */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {data.map((item) => (
          <div key={item.week} className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-900 mb-2">Semana {item.week}</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-green-600">Asistencia:</span>
                <span className="font-medium">{item.attendance_rate}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-600">Puntualidad:</span>
                <span className="font-medium">{item.punctuality_rate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 