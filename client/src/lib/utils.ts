import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { UserRole, BloomLevel, GameFormat } from '@/types'

// Tailwind CSS class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: string | Date, locale: string = 'es-CL'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date, locale: string = 'es-CL'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatTimeAgo(date: string | Date, locale: string = 'es-CL'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return 'hace menos de un minuto'
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`
  
  return formatDate(dateObj, locale)
}

// Role utilities
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    SUPER_ADMIN_FULL: 'Super Administrador',
    ADMIN_ESCOLAR: 'Administrador Escolar',
    BIENESTAR_ESCOLAR: 'Bienestar Escolar',
    TEACHER: 'Profesor',
    STUDENT: 'Estudiante',
    GUARDIAN: 'Apoderado',
    SOSTENEDOR: 'Sostenedor'
  }
  return roleNames[role] || role
}

export function getRoleColor(role: UserRole): string {
  const roleColors: Record<UserRole, string> = {
    SUPER_ADMIN_FULL: 'bg-red-100 text-red-800 border-red-200',
    ADMIN_ESCOLAR: 'bg-purple-100 text-purple-800 border-purple-200',
    BIENESTAR_ESCOLAR: 'bg-green-100 text-green-800 border-green-200',
    TEACHER: 'bg-blue-100 text-blue-800 border-blue-200',
    STUDENT: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    GUARDIAN: 'bg-orange-100 text-orange-800 border-orange-200',
    SOSTENEDOR: 'bg-pink-100 text-pink-800 border-pink-200'
  }
  return roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export function canAccessResource(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole)
}

// Bloom taxonomy utilities
export function getBloomLevelColor(level: BloomLevel): string {
  const colors: Record<BloomLevel, string> = {
    'Recordar': 'bg-red-50 text-red-700 border-red-200',
    'Comprender': 'bg-orange-50 text-orange-700 border-orange-200',
    'Aplicar': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Analizar': 'bg-green-50 text-green-700 border-green-200',
    'Evaluar': 'bg-blue-50 text-blue-700 border-blue-200',
    'Crear': 'bg-purple-50 text-purple-700 border-purple-200'
  }
  return colors[level] || 'bg-gray-50 text-gray-700 border-gray-200'
}

export function getBloomLevelOrder(level: BloomLevel): number {
  const order: Record<BloomLevel, number> = {
    'Recordar': 1,
    'Comprender': 2,
    'Aplicar': 3,
    'Analizar': 4,
    'Evaluar': 5,
    'Crear': 6
  }
  return order[level] || 0
}

// Game format utilities
export function getGameFormatDisplayName(format: GameFormat): string {
  const names: Record<GameFormat, string> = {
    trivia_lightning: 'Trivia Lightning',
    color_match: 'Emparejamiento de Colores',
    memory_flip: 'Memoria Volteada',
    picture_bingo: 'Bingo de Imágenes',
    drag_drop_sorting: 'Clasificación Arrastrar y Soltar',
    number_line_race: 'Carrera en Línea Numérica',
    word_builder: 'Constructor de Palabras',
    word_search: 'Sopa de Letras',
    hangman_visual: 'Ahorcado Visual',
    escape_room_mini: 'Mini Escape Room'
  }
  return names[format] || format
}

export function getGameFormatIcon(format: GameFormat): string {
  const icons: Record<GameFormat, string> = {
    trivia_lightning: '⚡',
    color_match: '🎨',
    memory_flip: '🃏',
    picture_bingo: '🎯',
    drag_drop_sorting: '📦',
    number_line_race: '🏃‍♂️',
    word_builder: '🔤',
    word_search: '🔍',
    hangman_visual: '🎪',
    escape_room_mini: '🗝️'
  }
  return icons[format] || '🎮'
}

export function getRecommendedGameFormat(gradeCode: string): GameFormat {
  // Pre-Kinder to 1st grade
  if (['PK', 'K', '1B'].includes(gradeCode)) {
    return 'color_match'
  }
  // 2nd to 3rd grade
  if (['2B', '3B'].includes(gradeCode)) {
    return 'drag_drop_sorting'
  }
  // 4th to 6th grade
  if (['4B', '5B', '6B'].includes(gradeCode)) {
    return 'picture_bingo'
  }
  // 7th to 8th grade
  if (['7B', '8B'].includes(gradeCode)) {
    return 'word_search'
  }
  // High school
  if (['1M', '2M', '3M', '4M'].includes(gradeCode)) {
    return 'escape_room_mini'
  }
  
  return 'trivia_lightning' // Default
}

// Score and performance utilities
export function calculateGrade(score: number, maxScore: number, scale: number = 7): number {
  const percentage = (score / maxScore) * 100
  const grade = Math.round((percentage / 100) * (scale - 1) + 1)
  return Math.max(1, Math.min(scale, grade))
}

export function getGradeColor(grade: number, scale: number = 7): string {
  const percentage = ((grade - 1) / (scale - 1)) * 100
  
  if (percentage >= 85) return 'text-green-600'
  if (percentage >= 70) return 'text-blue-600'
  if (percentage >= 60) return 'text-yellow-600'
  if (percentage >= 50) return 'text-orange-600'
  return 'text-red-600'
}

export function formatScore(score: number, total: number): string {
  const percentage = Math.round((score / total) * 100)
  return `${score}/${total} (${percentage}%)`
}

// String utilities
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, char => char.toUpperCase())
}

// File utilities
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  return imageExtensions.includes(getFileExtension(filename))
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export function isValidRUT(rut: string): boolean {
  // Chilean RUT validation
  const cleanRut = rut.replace(/[^\dkK]/g, '').toLowerCase()
  if (cleanRut.length < 8 || cleanRut.length > 9) return false
  
  const body = cleanRut.slice(0, -1)
  const dv = cleanRut.slice(-1)
  
  let sum = 0
  let multiplier = 2
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i)) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const remainder = sum % 11
  const calculatedDV = remainder < 2 ? remainder.toString() : 
                      remainder === 10 ? 'k' : (11 - remainder).toString()
  
  return dv === calculatedDV
}

// URL utilities
export function buildApiUrl(endpoint: string, params?: Record<string, any>): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const url = new URL(`${baseUrl}/api${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })
  }
  
  return url.toString()
}

// Local storage utilities
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error)
  }
}

// Random utilities
export function generateId(prefix: string = ''): string {
  const id = Math.random().toString(36).substring(2, 15)
  return prefix ? `${prefix}_${id}` : id
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return '#000000'
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

// Accessibility utilities
export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.overflow = 'hidden'
  
  document.body.appendChild(announcement)
  announcement.textContent = message
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Error handling utilities
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'Ha ocurrido un error inesperado'
} 