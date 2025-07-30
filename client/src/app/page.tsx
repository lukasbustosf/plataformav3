'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuth()

  useEffect(() => {
    console.log('=== HOMEPAGE USEEFFECT ===')
    console.log('HomePage useEffect:', { 
      isLoading, 
      isAuthenticated, 
      userRole: user?.role,
      userEmail: user?.email,
      token: localStorage.getItem('auth_token')?.substring(0, 20) + '...'
    })
    
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        console.log('Not authenticated or no user, redirecting to login')
        router.replace('/login')
      } else {
        console.log('User authenticated, role:', user.role)
        // Redirect to role-appropriate dashboard
        switch (user.role) {
          case 'SUPER_ADMIN_FULL':
            console.log('Redirecting to admin dashboard')
            router.replace('/admin/dashboard')
            break
          case 'ADMIN_ESCOLAR':
            console.log('Redirecting to school dashboard')
            router.replace('/school/dashboard')
            break
          case 'BIENESTAR_ESCOLAR':
            console.log('Redirecting to bienestar dashboard')
            router.replace('/bienestar/dashboard')
            break
          case 'TEACHER':
            console.log('Redirecting to teacher dashboard')
            router.replace('/teacher/dashboard')
            break
          case 'STUDENT':
            console.log('Redirecting to student dashboard')
            router.replace('/student/dashboard')
            break
          case 'GUARDIAN':
            console.log('Redirecting to guardian dashboard')
            router.replace('/guardian/dashboard')
            break
          case 'SOSTENEDOR':
            console.log('Redirecting to sostenedor dashboard')
            router.replace('/sostenedor/dashboard')
            break
          default:
            console.log('Unknown role:', user.role, 'redirecting to login')
            router.replace('/login')
        }
      }
    }
    console.log('=== HOMEPAGE USEEFFECT END ===')
  }, [isAuthenticated, user, isLoading, router])

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
        <h1 className="mt-6 text-2xl font-bold text-primary-900">EDU21</h1>
        <p className="mt-2 text-primary-600">Cargando plataforma educativa...</p>
        <noscript>
          <a href="/login" className="text-sm underline">Continuar al login</a>
        </noscript>
      </div>
    </div>
  )
} 