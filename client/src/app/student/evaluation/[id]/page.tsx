'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { ExclamationTriangleIcon, ClockIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Placeholder type - we will define this properly later
interface EvaluationDetails {
  title: string;
  teacherName: string;
  questionCount: number;
  dueDate: string;
}

export default function StudentEvaluationPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string
  const { user, isLoading: isAuthLoading } = useAuth()

  const {
    data: evaluationDetails,
    isLoading: isEvaluationLoading,
    error,
  } = useQuery<EvaluationDetails, Error>(
    ['evaluation-details', sessionId],
    async () => {
      return api.getEvaluationForStudent(sessionId);
    },
    {
      enabled: !!sessionId && !isAuthLoading,
    }
  )

  const handleStartEvaluation = () => {
    router.push(`/student/evaluation/${sessionId}/play`)
  }

  if (isAuthLoading || isEvaluationLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Error al cargar la evaluación</h2>
          <p className="mt-2 text-md text-gray-600">
            {error.message || 'No se pudo encontrar la evaluación o no tienes permiso para acceder a ella.'}
          </p>
          <div className="mt-8">
            <Button onClick={() => router.push('/student/dashboard')}>
              Volver a mi panel
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!evaluationDetails) {
    return null // Should be handled by loading and error states
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div>
            <h1 className="text-center text-4xl font-extrabold text-gray-900">
              {evaluationDetails.title}
            </h1>
            <p className="mt-2 text-center text-lg text-gray-600">
              Asignada por: <strong>{evaluationDetails.teacherName}</strong>
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex justify-around text-center">
              <div className="flex flex-col items-center">
                <QuestionMarkCircleIcon className="h-10 w-10 text-blue-600" />
                <span className="mt-2 text-lg font-medium text-gray-800">{evaluationDetails.questionCount} Preguntas</span>
              </div>
              <div className="flex flex-col items-center">
                <ClockIcon className="h-10 w-10 text-blue-600" />
                <span className="mt-2 text-lg font-medium text-gray-800">
                  Fecha Límite: {new Date(evaluationDetails.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleStartEvaluation} 
                className="w-full text-xl py-4"
                variant="primary"
                size="lg"
              >
                Comenzar Evaluación
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Una vez que comiences, deberás completar la evaluación. ¡Asegúrate de estar listo!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
