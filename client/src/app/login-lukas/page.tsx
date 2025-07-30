'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function LoginLukas() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Solo usuarios demo para desarrollo
  const demoUsers = [
    {
      email: 'superadmin@demo.edu21.cl',
      password: 'demo123',
      role: 'SUPER_ADMIN_FULL',
      name: 'Sistema Administrador',
      description: 'Acceso completo a todas las funcionalidades'
    },
    {
      email: 'profesor@demo.edu21.cl',
      password: 'demo123',
      role: 'TEACHER',
      name: 'María González',
      description: 'Acceso de profesor a laboratorios'
    },
    {
      email: 'director@demo.edu21.cl',
      password: 'demo123',
      role: 'ADMIN_ESCOLAR',
      name: 'Carlos Ruiz',
      description: 'Acceso de administrador escolar'
    },
    {
      email: 'bienestar@demo.edu21.cl',
      password: 'demo123',
      role: 'BIENESTAR_ESCOLAR',
      name: 'Ana López',
      description: 'Acceso a módulo de bienestar'
    },
    {
      email: 'estudiante@demo.edu21.cl',
      password: 'demo123',
      role: 'STUDENT',
      name: 'Juan Pérez',
      description: 'Acceso de estudiante'
    }
  ]

  const handleDemoLogin = async (demoEmail: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log('=== DEMO LOGIN LUKAS START ===')
      console.log('Email:', demoEmail)

      const demoUser = demoUsers.find(user => user.email === demoEmail)
      if (!demoUser) {
        throw new Error('Usuario demo no encontrado')
      }

      console.log('Demo user found:', demoUser.role, demoUser.name)

      // Generate demo token with role
      const roleForToken = demoUser.role === 'SUPER_ADMIN_FULL' ? 'superadmin' : demoUser.role.toLowerCase().replace('_', '')
      const demoToken = `demo-token-${roleForToken}-${Date.now()}`
      console.log('Generated token:', demoToken)

      // Clear any existing auth state first (ANTES de guardar el token)
      useAuthStore.getState().clearAuth()

      // Guardar token en localStorage para que el fetch pueda leerlo
      try {
        localStorage.setItem('auth_token', demoToken)
        localStorage.setItem('user_data', JSON.stringify({
          user_id: `demo-${roleForToken}-${Date.now()}`,
          school_id: null,
          email: demoUser.email,
          first_name: demoUser.name.split(' ')[0],
          last_name: demoUser.name.split(' ')[1] || '',
          role: demoUser.role as any,
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          last_login: new Date().toISOString(),
          email_verified: true,
          login_attempts: 0
        }))
        console.log('✅ Token guardado en localStorage:', localStorage.getItem('auth_token'))
        console.log('✅ User data guardado en localStorage:', localStorage.getItem('user_data'))
      } catch (error) {
        console.error('❌ Error guardando token en localStorage:', error)
      }

      // Set new auth state
      console.log('Setting auth state...')
      useAuthStore.setState({
        user: {
          user_id: `demo-${roleForToken}-${Date.now()}`,
          school_id: null,
          email: demoUser.email,
          first_name: demoUser.name.split(' ')[0],
          last_name: demoUser.name.split(' ')[1] || '',
          role: demoUser.role as any,
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          last_login: new Date().toISOString(),
          email_verified: true,
          login_attempts: 0
        },
        token: demoToken,
        isAuthenticated: true,
        isLoading: false
      })

      console.log('Auth state after setting:', {
        isAuthenticated: useAuthStore.getState().isAuthenticated,
        userRole: useAuthStore.getState().user?.role,
        userEmail: useAuthStore.getState().user?.email,
        hasToken: !!useAuthStore.getState().token
      })

      console.log('Demo login successful, redirecting to dashboard...')

      // Redirect based on role
      const redirectPath = getRedirectPath(demoUser.role)
      console.log('Redirecting to:', redirectPath)
      router.push(redirectPath)

      console.log('=== DEMO LOGIN LUKAS END ===')
    } catch (error: any) {
      console.error('Demo login error:', error)
      setError(error.message || 'Error en el login demo')
    } finally {
      setLoading(false)
    }
  }

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN_FULL':
        return '/admin/dashboard'
      case 'ADMIN_ESCOLAR':
        return '/admin/dashboard'
      case 'TEACHER':
        return '/teacher/dashboard'
      case 'BIENESTAR_ESCOLAR':
        return '/bienestar/dashboard'
      case 'STUDENT':
        return '/student/dashboard'
      default:
        return '/'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            🔧 Login de Desarrollador
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acceso rápido a usuarios demo para desarrollo
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Solo para desarrollo y testing interno
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Usuarios Demo Disponibles:</h3>
          
          {demoUsers.map((user) => (
            <div
              key={user.email}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer bg-white"
              onClick={() => handleDemoLogin(user.email)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.description}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Volver al login público
          </a>
        </div>
      </div>
    </div>
  )
} 