import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { buildApiUrl, getStorageItem, setStorageItem, removeStorageItem } from './utils'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  Quiz, 
  Question, 
  GameSession, 
  Class, 
  LearningObjective,
  Subject,
  GradeLevel,
  APIResponse 
} from '@/types'

class ApiService {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    // Detectar automáticamente la URL base correcta
    let baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Si estamos en producción y no hay NEXT_PUBLIC_API_URL configurada,
    // usar la URL de Vercel para que las rutas funcionen con vercel.json
    if (typeof window !== 'undefined' && window.location.hostname === 'plataformav3.vercel.app') {
      baseURL = 'https://plataformav3.vercel.app';
    }
    
    this.baseURL = baseURL;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Token management
  private getToken(): string | null {
    return getStorageItem('auth_token', null)
  }

  private setToken(token: string): void {
    setStorageItem('auth_token', token)
  }

  private clearAuth(): void {
    removeStorageItem('auth_token')
    removeStorageItem('user_data')
  }

  private isDemoToken(token: string | null): boolean {
    return token?.startsWith('demo-token-') || false
  }

  // Generic API request handler
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: any
  ): Promise<T> {
    try {
      const response: AxiosResponse<APIResponse<T>> = await this.client.request({
        method,
        url: `/api${endpoint}`,
        data,
        ...config,
      })

      if (response.data.error) {
        const error = response.data.error
        const message = typeof error === 'string' ? error : (error as any)?.message || 'API Error'
        throw new Error(message)
      }

      return (response.data.data || response.data) as T
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error?.message || error.message
        throw new Error(message)
      }
      throw error
    }
  }

  // Lab-specific request handler (doesn't add /api prefix)
  private async labRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: any
  ): Promise<T> {
    try {
      const response: AxiosResponse<APIResponse<T>> = await this.client.request({
        method,
        url: endpoint,
        data,
        ...config,
      })

      if (response.data.error) {
        const error = response.data.error
        const message = typeof error === 'string' ? error : (error as any)?.message || 'API Error'
        throw new Error(message)
      }

      return (response.data.data || response.data) as T
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error?.message || error.message
        throw new Error(message)
      }
      throw error
    }
  }

  // Authentication APIs
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>(
      'POST',
      '/auth/login',
      credentials
    )
    
    this.setToken(response.token)
    setStorageItem('user_data', response.user)
    
    return response
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>(
      'POST',
      '/auth/register',
      data
    )
    
    this.setToken(response.token)
    setStorageItem('user_data', response.user)
    
    return response
  }

  async logout(): Promise<void> {
    try {
      await this.request('POST', '/auth/logout')
    } finally {
      this.clearAuth()
    }
  }

  async refreshToken(): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>(
      'POST',
      '/auth/refresh'
    )
    
    this.setToken(response.token)
    setStorageItem('user_data', response.user)
    
    return response
  }

  async getCurrentUser(): Promise<User> {
    const token = this.getToken()
    
    // If using demo token, return user data from localStorage
    if (this.isDemoToken(token)) {
      const userData = getStorageItem('user_data', null)
      if (userData) {
        return userData
      }
      throw new Error('Demo user data not found')
    }
    
    return this.request<User>('GET', '/auth/me')
  }

  // Quiz APIs
  async getQuizzes(params?: { page?: number; limit?: number; search?: string }): Promise<{
    quizzes: Quiz[]
    total: number
  }> {
    return this.request('GET', '/quiz', { params })
  }

  async getQuiz(id: string): Promise<Quiz> {
    return this.request('GET', `/quiz/${id}`)
  }

  async createQuiz(quiz: Partial<Quiz>): Promise<Quiz> {
    return this.request('POST', '/quiz', quiz)
  }

  async updateQuiz(id: string, quiz: Partial<Quiz>): Promise<Quiz> {
    return this.request('PUT', `/quiz/${id}`, quiz)
  }

  async deleteQuiz(id: string): Promise<void> {
    return this.request('DELETE', `/quiz/${id}`)
  }

  async generateAIQuiz(data: {
    title: string
    oa_codes: string[]
    difficulty: number
    question_count: number
  }): Promise<Quiz> {
    return this.request('POST', '/quiz/generate-ai', data)
  }

  // Question APIs
  async createQuestion(quizId: string, question: Partial<Question>): Promise<Question> {
    return this.request('POST', `/quiz/${quizId}/questions`, question)
  }

  async updateQuestion(quizId: string, questionId: string, question: Partial<Question>): Promise<Question> {
    return this.request('PUT', `/quiz/${quizId}/questions/${questionId}`, question)
  }

  async deleteQuestion(quizId: string, questionId: string): Promise<void> {
    return this.request('DELETE', `/quiz/${quizId}/questions/${questionId}`)
  }

  // Question Bank APIs
  async createQuestionInBank(question: Partial<Question>): Promise<Question> {
    return this.request('POST', '/question-bank', question)
  }

  async getQuestionsFromBank(): Promise<Question[]> {
    return this.request('GET', '/question-bank')
  }

  async deleteQuestionFromBank(id: string): Promise<void> {
    return this.request('DELETE', `/question-bank/${id}`)
  }

  async updateQuestionInBank(id: string, question: Partial<Question>): Promise<Question> {
    return this.request('PUT', `/question-bank/${id}`, question)
  }

  // My Evaluations APIs
  async createEvaluation(evaluation: { title: string, description: string, questionIds: string[] }): Promise<any> {
    return this.request('POST', '/my-evaluations', evaluation)
  }

  async getMyEvaluations(): Promise<any[]> {
    return this.request('GET', '/my-evaluations')
  }

  

  async getStudentAssignments(studentId: string): Promise<any[]> {
    return this.request('GET', `/my-evaluations/student-assignments/${studentId}`)
  }

  async getGameEngines(): Promise<any[]> {
    return this.request('GET', '/my-evaluations/engines')
  }

  async assignEvaluation(data: { evaluationId: string, classIds: string[], dueDate: string, engineId: string }): Promise<{ gameSessionId: string }> {
    return this.request('POST', '/my-evaluations/assign', data)
  }

  async getEvaluationForStudent(sessionId: string): Promise<any> {
    return this.request('GET', `/evaluation/student/${sessionId}/details`);
  }

  async getGameSessionForPlay(sessionId: string): Promise<any> {
    return this.request('GET', `/evaluation/student/${sessionId}/play`);
  }

  async submitEvaluationAttempt(sessionId: string, score: number, results: any): Promise<any> {
    return this.request('POST', '/evaluation/submit-attempt', { sessionId, score, results });
  }

  // Game Session APIs
  async createGameSession(data: {
    quiz_id: string
    format: string
    settings: any
  }): Promise<GameSession> {
    return this.request('POST', '/game', data)
  }

  async getGameSession(id: string): Promise<GameSession> {
    return this.request('GET', `/game/${id}`)
  }

  async startGameSession(id: string): Promise<GameSession> {
    return this.request('POST', `/game/${id}/start`)
  }

  async endGameSession(id: string): Promise<GameSession> {
    return this.request('POST', `/game/${id}/end`)
  }

  async getGameResults(id: string): Promise<{
    session: GameSession
    participants: any[]
    leaderboard: any[]
  }> {
    return this.request('GET', `/game/${id}/results`)
  }

  // Class APIs
  async getClasses(): Promise<{ classes: Class[] }> {
    return this.request('GET', '/class')
  }

  async getClass(id: string): Promise<{ class: Class }> {
    return this.request('GET', `/class/${id}`)
  }

  async createClass(classData: Partial<Class>): Promise<Class> {
    return this.request('POST', '/class', classData)
  }

  async updateClass(id: string, classData: Partial<Class>): Promise<Class> {
    return this.request('PUT', `/class/${id}`, classData)
  }

  async deleteClass(id: string): Promise<void> {
    return this.request('DELETE', `/class/${id}`)
  }

  // Curriculum APIs
  async getGradeLevels(): Promise<{ grades: GradeLevel[] }> {
    return this.request('GET', '/curriculum/grades')
  }

  async getSubjects(): Promise<{ subjects: Subject[] }> {
    return this.request('GET', '/curriculum/subjects')
  }

  async getLearningObjectives(params?: {
    grade?: string
    subject?: string
    bloom_level?: string
    search?: string
    priority?: string
    version?: string
    semester?: number
    include_coverage?: boolean
    include_statistics?: boolean
    page?: number
    limit?: number
  }): Promise<{ 
    success: boolean
    data: LearningObjective[]
    pagination: {
      page: number
      limit: number
      total: number
      total_pages: number
    }
  }> {
    return this.request('GET', '/curriculum/oa', { params })
  }

  async getBloomLevels(): Promise<{ 
    success: boolean
    data: Array<{
      level: string
      order: number
      description: string
      color: string
    }>
  }> {
    return this.request('GET', '/curriculum/bloom-levels')
  }

  // P1 OA Management (ADMIN_ESCOLAR only)
  async createLearningObjective(data: {
    oa_code: string
    oa_desc: string
    oa_short_desc?: string
    grade_code: string
    subject_id: string
    bloom_level: string
    semester?: number
    complexity_level?: number
    estimated_hours?: number
    prerequisites?: string[]
    is_transversal?: boolean
    ministerial_priority?: 'high' | 'normal' | 'low'
  }): Promise<{
    success: boolean
    data: LearningObjective
    message: string
  }> {
    return this.request('POST', '/curriculum/oa', { data })
  }

  async updateLearningObjective(id: string, data: Partial<LearningObjective>): Promise<{
    success: boolean
    data: LearningObjective
    message: string
  }> {
    return this.request('PUT', `/curriculum/oa/${id}`, { data })
  }

  async deleteLearningObjective(id: string): Promise<{
    success: boolean
    message: string
  }> {
    return this.request('DELETE', `/curriculum/oa/${id}`)
  }

  async getLearningObjectiveDetails(id: string, includeUsage = false): Promise<{
    success: boolean
    data: LearningObjective & {
      coverage: {
        total_questions: number
        total_attempts: number
        unique_students: number
        average_score: number
        last_assessed: number | null
      }
      statistics: {
        mastery_level: string
        trend: string
        recommended_focus: string
      }
    }
  }> {
    return this.request('GET', `/curriculum/oa/${id}`, { 
      params: { include_usage: includeUsage.toString() } 
    })
  }

  // P1-ADMIN-ESC: Weekly OA/Bloom coverage reports
  async generateCoverageReport(params: {
    grade_code: string
    subject_id: string
    week_start: string
    week_end: string
    format?: 'json' | 'csv' | 'pdf'
  }): Promise<{
    success: boolean
    data?: {
      period: { week_start: string; week_end: string }
      grade_code: string
      subject_id: string
      summary: {
        total_oas: number
        covered_oas: number
        coverage_percentage: number
        high_priority_covered: number
        bloom_distribution: Record<string, {
          total: number
          covered: number
          percentage: number
        }>
        remedial_suggestions: Array<{
          type: string
          message: string
          oas: string[]
        }>
      }
      detailed_coverage: Array<{
        oa_id: string
        oa_code: string
        oa_desc: string
        bloom_level: string
        ministerial_priority: string
        was_assessed: boolean
        assessment_count: number
        average_score: number
      }>
      generated_at: string
      generated_by: string
    }
  }> {
    if (params.format && params.format !== 'json') {
      // For file downloads, return the response directly
      const token = this.getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
      
      const response = await fetch(`${this.baseURL}/api/curriculum/coverage-report?${new URLSearchParams(params)}`, {
        headers
      })
      return response as any
    }
    return this.request('GET', '/curriculum/coverage-report', { params })
  }

  // Curriculum Units
  async getCurriculumUnits(params?: {
    grade_code?: string
    subject_id?: string
    year?: number
  }): Promise<{
    success: boolean
    data: Array<{
      unit_id: string
      unit_title: string
      unit_number: number
      estimated_classes: number
      grade_code: string
      subject_id: string
      year: number
      unit_oa: Array<{
        sequence_order: number
        is_primary: boolean
        estimated_classes: number
        learning_objectives: LearningObjective
      }>
    }>
  }> {
    return this.request('GET', '/curriculum/units', { params })
  }

  // Report APIs
  async generateQuizReport(quizId: string, format: 'pdf' | 'csv'): Promise<Blob> {
    const response = await this.client.get(`/api/reports/quiz/${quizId}/${format}`, {
      responseType: 'blob'
    })
    return response.data
  }

  async generateAttendanceReport(classId: string, format: 'pdf' | 'csv'): Promise<Blob> {
    const response = await this.client.get(`/api/reports/attendance/${classId}/${format}`, {
      responseType: 'blob'
    })
    return response.data
  }

  async generateOAReport(params: {
    class_id?: string
    grade?: string
    subject?: string
    date_from?: string
    date_to?: string
  }): Promise<Blob> {
    const response = await this.client.get('/api/reports/oa-coverage', {
      params,
      responseType: 'blob'
    })
    return response.data
  }

  // File upload
  async uploadFile(file: File, type: 'image' | 'audio' | 'document'): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return this.request('POST', '/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Analytics APIs
  async getStudentProgress(studentId: string): Promise<{
    bloom_progress: any[]
    oa_coverage: any[]
    recent_activities: any[]
  }> {
    return this.request('GET', `/analytics/student/${studentId}/progress`)
  }

  async getClassAnalytics(classId: string): Promise<{
    performance_summary: any
    bloom_distribution: any[]
    oa_coverage: any[]
    engagement_metrics: any
  }> {
    return this.request('GET', `/analytics/class/${classId}`)
  }

  async getSchoolDashboard(): Promise<{
    overview: any
    classes_summary: any[]
    teacher_activity: any[]
    student_engagement: any
  }> {
    return this.request('GET', '/analytics/school/dashboard')
  }

  // Notification APIs
  async getNotifications(): Promise<{
    notifications: any[];
    unread_count: number;
  }> {
    return this.request('GET', '/notifications');
  }

  async markNotificationRead(id: string): Promise<void> {
    return this.request('PATCH', `/notifications/${id}/read`);
  }

  async markAllNotificationsRead(): Promise<void> {
    return this.request('PATCH', '/notifications/read-all');
  }

  // Settings APIs
  async getSchoolSettings(): Promise<any> {
    return this.request('GET', '/settings/school')
  }

  async updateSchoolSettings(settings: any): Promise<any> {
    return this.request('PUT', '/settings/school', settings)
  }

  async getUserSettings(): Promise<any> {
    return this.request('GET', '/settings/user')
  }

  async updateUserSettings(settings: any): Promise<any> {
    return this.request('PUT', '/settings/user', settings)
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('GET', '/health')
  }

  // Lab Activities methods
  async getLabActivity(id: string): Promise<any> {
    return this.labRequest('GET', `/lab/activities/id/${id}`)
  }

  async getLabMaterials(): Promise<any> {
    return this.labRequest('GET', '/lab/materials')
  }

  async getLabActivities(params?: any): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.labRequest('GET', `/lab/activities${queryString}`)
  }

  async deleteLabActivity(id: string): Promise<any> {
    return this.labRequest('DELETE', `/lab/activities/${id}`)
  }

  async updateLabActivity(id: string, data: any): Promise<any> {
    return this.labRequest('PUT', `/lab/activities/${id}`, data)
  }
}

// Create and export a singleton instance
export const api = new ApiService()
export default api 