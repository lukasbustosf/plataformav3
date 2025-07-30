'use client'

import { useEffect, useRef } from 'react'

interface BloomLevel {
  level: string
  score: number
  maxScore: number
}

interface BloomRadarChartProps {
  data: BloomLevel[]
  size?: number
}

export function BloomRadarChart({ data, size = 300 }: BloomRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = size
    canvas.height = size
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size)
    
    const centerX = size / 2
    const centerY = size / 2
    const radius = (size / 2) - 40

    // Draw background grid
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    
    // Draw concentric circles
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw axes
    const angleStep = (2 * Math.PI) / data.length
    ctx.strokeStyle = '#e5e7eb'
    
    data.forEach((_, index) => {
      const angle = index * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
    })

    // Draw labels
    ctx.fillStyle = '#374151'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    
    data.forEach((item, index) => {
      const angle = index * angleStep - Math.PI / 2
      const labelRadius = radius + 20
      const x = centerX + Math.cos(angle) * labelRadius
      const y = centerY + Math.sin(angle) * labelRadius
      
      ctx.fillText(item.level, x, y + 4)
    })

    // Draw data polygon
    ctx.strokeStyle = '#3b82f6'
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
    ctx.lineWidth = 2
    
    ctx.beginPath()
    data.forEach((item, index) => {
      const angle = index * angleStep - Math.PI / 2
      const value = (item.score / item.maxScore) * radius
      const x = centerX + Math.cos(angle) * value
      const y = centerY + Math.sin(angle) * value
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw data points
    ctx.fillStyle = '#3b82f6'
    data.forEach((item, index) => {
      const angle = index * angleStep - Math.PI / 2
      const value = (item.score / item.maxScore) * radius
      const x = centerX + Math.cos(angle) * value
      const y = centerY + Math.sin(angle) * value
      
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

  }, [data, size])

  return (
    <div className="flex justify-center">
      <canvas 
        ref={canvasRef} 
        className="border border-gray-200 rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  )
} 