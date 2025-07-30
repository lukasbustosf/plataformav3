import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/utils'
import type { User, UserRole, AuthState, LoginCredentials, RegisterData } from '@/types'

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  getCurrentUser: () => Promise<void>
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true })
          
          // HARDCODED LOGIN - Determine role based on email
          console.log('Demo login for:', credentials.email)
          
          let selectedUser
          let selectedToken
          
          // Map demo emails to roles
          if (credentials.email.includes('bienestar') || credentials.email.includes('Bienestar')) {
            selectedUser = {
              user_id: 'bienestar-456',
              school_id: 'school-abc',
              email: 'bienestar@demo.edu21.cl',
              first_name: 'Ana',
              last_name: 'López',
              role: 'BIENESTAR_ESCOLAR' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            }
            selectedToken = 'demo-token-bienestar-456'
          } else if (credentials.email.includes('director') || credentials.email.includes('Director')) {
            selectedUser = {
              user_id: 'admin-789',
              school_id: 'school-abc',
              email: 'director@demo.edu21.cl',
              first_name: 'Carlos',
              last_name: 'Ruiz',
              role: 'ADMIN_ESCOLAR' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            }
            selectedToken = 'demo-token-admin-789'
          } else if (credentials.email.includes('estudiante') || credentials.email.includes('Estudiante')) {
            selectedUser = {
              user_id: 'student-101',
              school_id: 'school-abc',
              email: 'estudiante@demo.edu21.cl',
              first_name: 'Diego',
              last_name: 'Silva',
              role: 'STUDENT' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            }
            selectedToken = 'demo-token-student-101'
          } else if (credentials.email.includes('sostenedor') || credentials.email.includes('Sostenedor')) {
            selectedUser = {
              user_id: 'sostenedor-555',
              school_id: null, // Sostenedor manages multiple schools
              email: 'sostenedor@demo.edu21.cl',
              first_name: 'Patricia',
              last_name: 'Mendoza',
              role: 'SOSTENEDOR' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            }
            selectedToken = 'demo-token-sostenedor-555'
          } else {
            // Default to teacher
            selectedUser = {
              user_id: 'teacher-123',
              school_id: 'school-abc',
              email: 'profesor@demo.edu21.cl',
              first_name: 'María',
              last_name: 'González',
              role: 'TEACHER' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            }
            selectedToken = 'demo-token-teacher-123'
          }
          
          set({
            user: selectedUser,
            token: selectedToken,
            isAuthenticated: true,
            isLoading: false
          })
          
          // Store in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', selectedToken)
            localStorage.setItem('user_data', JSON.stringify(selectedUser))
            localStorage.setItem('demo_role', selectedUser.role)
          }
          
          console.log('Demo login successful as:', selectedUser.role)
        } catch (error) {
          console.error('Login error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true })
          
          const response = await api.register(data)
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await api.logout()
        } catch (error) {
          console.warn('Logout API call failed:', error)
        } finally {
          get().clearAuth()
        }
      },

      refreshToken: async () => {
        try {
          const response = await api.refreshToken()
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true
          })
        } catch (error) {
          get().clearAuth()
          throw error
        }
      },

      getCurrentUser: async () => {
        try {
          const user = await api.getCurrentUser()
          set({ user })
        } catch (error) {
          get().clearAuth()
          throw error
        }
      },

      setUser: (user: User) => {
        console.log('Setting user in auth store:', user.role, user.email)
        const newState = {
          user, 
          isAuthenticated: true,
          isLoading: false 
        }
        set(newState)
        
        // Also store in localStorage directly for reliability
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(user))
        }
        console.log('User set successfully, isAuthenticated: true')
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
        
        // Clear local storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
          localStorage.removeItem('demo_role')
        }
      },

      initializeAuth: async () => {
        try {
          console.log('=== AUTH INITIALIZATION START ===')
          set({ isLoading: true })
          
          // Check if user is already authenticated (has valid token)
          let isAlreadyAuthenticated = false
          if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('auth_token')
            const storedUser = localStorage.getItem('user_data')
            if (storedToken && storedUser) {
              try {
                const userData = JSON.parse(storedUser)
                if (userData && userData.user_id) {
                  isAlreadyAuthenticated = true
                }
              } catch (e) {
                console.warn('Invalid stored user data')
              }
            }
          }
          
          // If not authenticated, just set loading to false and let user go to login
          if (!isAlreadyAuthenticated) {
            console.log('No valid authentication found, user needs to login')
            set({ isLoading: false })
            return
          }
          
          // If already authenticated, restore session as teacher
          const selectedRole = 'TEACHER'
          
          // HARDCODED USERS FOR DEVELOPMENT - SWITCH BASED ON ROLE
          const hardcodedUsers = {
            'TEACHER': {
              user_id: 'teacher-123',
              school_id: 'school-abc',
              email: 'profesor@demo.edu21.cl',
              first_name: 'María',
              last_name: 'González',
              role: 'TEACHER' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            },
            'BIENESTAR_ESCOLAR': {
              user_id: 'bienestar-456',
              school_id: 'school-abc',
              email: 'bienestar@demo.edu21.cl',
              first_name: 'Ana',
              last_name: 'López',
              role: 'BIENESTAR_ESCOLAR' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            },
            'ADMIN_ESCOLAR': {
              user_id: 'admin-789',
              school_id: 'school-abc',
              email: 'director@demo.edu21.cl',
              first_name: 'Carlos',
              last_name: 'Ruiz',
              role: 'ADMIN_ESCOLAR' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            },
            'STUDENT': {
              user_id: 'student-101',
              school_id: 'school-abc',
              email: 'estudiante@demo.edu21.cl',
              first_name: 'Diego',
              last_name: 'Silva',
              role: 'STUDENT' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            },
            'SOSTENEDOR': {
              user_id: 'sostenedor-555',
              school_id: null, // Sostenedor manages multiple schools
              email: 'sostenedor@demo.edu21.cl',
              first_name: 'Patricia',
              last_name: 'Mendoza',
              role: 'SOSTENEDOR' as UserRole,
              active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              last_login: new Date().toISOString(),
              email_verified: true,
              login_attempts: 0
            }
          }
          
          const selectedUser = hardcodedUsers[selectedRole as keyof typeof hardcodedUsers] || hardcodedUsers['TEACHER']
          const hardcodedToken = `demo-token-${selectedUser.user_id}`
          
          console.log('Setting hardcoded user:', selectedUser.role, selectedUser.email)
          
          set({
            user: selectedUser,
            token: hardcodedToken,
            isAuthenticated: true,
            isLoading: false
          })
          
          // Store in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', hardcodedToken)
            localStorage.setItem('user_data', JSON.stringify(selectedUser))
          }
          
          console.log('Hardcoded auth successful - authenticated as:', selectedUser.role)
        } catch (error) {
          console.error('Auth initialization failed:', error)
          // Even if there's an error, set hardcoded auth as teacher
          const hardcodedTeacher = {
            user_id: 'teacher-123',
            school_id: 'school-abc',
            email: 'profesor@demo.edu21.cl',
            first_name: 'María',
            last_name: 'González',
            role: 'TEACHER' as UserRole,
            active: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            last_login: new Date().toISOString(),
            email_verified: true,
            login_attempts: 0
          }
          
          set({
            user: hardcodedTeacher,
            token: 'demo-token-teacher-123',
            isAuthenticated: true,
            isLoading: false
          })
        }
      },

    }),
    {
      name: 'edu21-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Auth utilities
export const useAuth = () => {
  const auth = useAuthStore()
  
  return {
    ...auth,
    // Computed properties
    isTeacher: auth.user?.role === 'TEACHER',
    isStudent: auth.user?.role === 'STUDENT',
    isAdmin: auth.user?.role === 'ADMIN_ESCOLAR',
    isSuperAdmin: auth.user?.role === 'SUPER_ADMIN_FULL',
    isBienestar: auth.user?.role === 'BIENESTAR_ESCOLAR',
    isGuardian: auth.user?.role === 'GUARDIAN',
    isSostenedor: auth.user?.role === 'SOSTENEDOR',
    
    // Permission checks
    canCreateQuiz: auth.user?.role === 'TEACHER' || auth.user?.role === 'ADMIN_ESCOLAR',
    canManageClasses: auth.user?.role === 'TEACHER' || auth.user?.role === 'ADMIN_ESCOLAR',
    canViewReports: ['TEACHER', 'ADMIN_ESCOLAR', 'BIENESTAR_ESCOLAR', 'SOSTENEDOR'].includes(auth.user?.role || ''),
    canManageUsers: ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(auth.user?.role || ''),
    canAccessSettings: ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(auth.user?.role || ''),
    
    // User info
    fullName: auth.user ? `${auth.user.first_name} ${auth.user.last_name}` : '',
    schoolId: auth.user?.school_id,
    userId: auth.user?.user_id
  }
}

// Auth guard hook for protecting routes
export const useAuthGuard = (requiredRoles?: string[]) => {
  const auth = useAuth()
  
  const hasPermission = () => {
    if (!auth.isAuthenticated || !auth.user) {
      return false
    }
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }
    
    return requiredRoles.includes(auth.user.role)
  }
  
  return {
    ...auth,
    hasPermission: hasPermission(),
    redirectTo: !auth.isAuthenticated ? '/login' : 
               !hasPermission() ? '/unauthorized' : null
  }
} 