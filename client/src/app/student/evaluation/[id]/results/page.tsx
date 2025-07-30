'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function EvaluationResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const score = searchParams.get('score')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            ¡Evaluación Completada!
          </h1>
          <p className="mt-4 text-2xl text-gray-600">
            Tu puntaje final es:
          </p>
          <p className="mt-2 text-8xl font-bold text-blue-600">
            {score || '0'}
          </p>
        </div>
        <div className="mt-8">
          <Button onClick={() => router.push('/student/dashboard')}>
            Volver a mi panel
          </Button>
        </div>
      </div>
    </div>
  )
}
