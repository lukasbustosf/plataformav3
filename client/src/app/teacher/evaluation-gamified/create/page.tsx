'use client'

import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { GameEvaluationCreator } from '@/components/evaluation/GameEvaluationCreator'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CreateGameEvaluationPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'TEACHER')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user?.role, router])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated || user?.role !== 'TEACHER') {
    return null
  }

  const handleSuccess = (evaluationId: string) => {
    router.push(`/teacher/quiz/${evaluationId}`)
  }

  const handleCancel = () => {
    router.push('/teacher/dashboard')
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6">
        <GameEvaluationCreator 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  )
} 