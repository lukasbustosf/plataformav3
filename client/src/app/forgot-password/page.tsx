'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const schema = yup.object({
  email: yup
    .string()
    .email('Ingresa un email válido')
    .required('El email es requerido')
})

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitted(true)
      toast.success('Instrucciones enviadas a tu email')
    } catch (error) {
      toast.error('Error al enviar el email. Inténtalo nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Email Enviado
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hemos enviado las instrucciones para restablecer tu contraseña a{' '}
              <span className="font-medium text-primary-600">{getValues('email')}</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Revisa tu bandeja de entrada</strong> - El email puede tardar unos minutos en llegar
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Revisa tu carpeta de spam</strong> - A veces los emails automáticos llegan ahí
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Sigue las instrucciones</strong> - Haz clic en el enlace del email para crear una nueva contraseña
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setIsLoading(false)
                  }}
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Intentar con otro email
                </button>
                <span className="text-gray-300">|</span>
                <Link
                  href="/login"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Volver al login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">E21</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No te preocupes, ingresa tu email y te enviaremos instrucciones para crear una nueva.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`pl-10 input-field ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="tu.email@colegio.cl"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando instrucciones...
                  </>
                ) : (
                  'Enviar instrucciones'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Volver al login
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">
                ¿Necesitas más ayuda?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Si tienes problemas para acceder a tu cuenta, contacta al administrador de tu colegio 
                  o envía un email a{' '}
                  <a href="mailto:soporte@edu21.cl" className="font-medium underline">
                    soporte@edu21.cl
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 