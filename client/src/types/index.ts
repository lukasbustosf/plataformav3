// ===============================================
// EDU21 TYPE DEFINITIONS - MODULO II COMPLETE
// ===============================================

// ===============================================
// CORE SYSTEM TYPES
// ===============================================

export interface School {
  school_id: string;
  school_name: string;
  school_code: string;
  sostenedor_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  director_id?: string;
  region?: string;
  comuna?: string;
  rbd?: string;
  school_type: 'municipal' | 'particular' | 'subvencionado';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  user_id: string;
  school_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  rut?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'O';
  profile_picture_url?: string;
  
  // RBAC Fields
  permissions?: Record<string, any>;
  role_permissions?: Record<string, any>;
  last_role_update?: string;
  
  // Authentication
  email_verified: boolean;
  last_login?: string;
  login_attempts: number;
  locked_until?: string;
  
  // Status
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserRole = 
  | 'SUPER_ADMIN_FULL'
  | 'ADMIN_ESCOLAR'
  | 'BIENESTAR_ESCOLAR'
  | 'TEACHER'
  | 'STUDENT'
  | 'GUARDIAN'
  | 'SOSTENEDOR';

// ===============================================
// CURRICULUM & OA SYSTEM
// ===============================================

export interface GradeLevel {
  id: string;
  grade_code: string;
  grade_name: string;
  level_type: 'PARVULO' | 'BASICA' | 'MEDIA';
  age_min?: number;
  age_max?: number;
  ciclo?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Subject {
  id: string;
  subject_id: string;
  subject_code: string;
  subject_name: string;
  subject_color?: string;
  icon?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LearningObjective {
  id: string;
  oa_id: string;
  oa_code: string;
  oa_desc: string;
  oa_short_desc?: string;
  grade_code: string;
  subject_id: string;
  bloom_level: BloomLevel;
  oa_version: string;
  semester?: 1 | 2;
  complexity_level?: number;
  estimated_hours?: number;
  prerequisites?: string[];
  is_transversal: boolean;
  ministerial_priority: 'high' | 'normal' | 'low';
  deprecated_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  subjects?: Subject;
  grade_levels?: GradeLevel;
  
  // P1 Analytics (optional, populated when requested)
  coverage?: {
    total_questions: number;
    total_attempts: number;
    unique_students: number;
    average_score: number;
    last_assessed: number | null;
  };
  
  statistics?: {
    mastery_level: 'developing' | 'proficient' | 'advanced';
    trend: 'improving' | 'stable' | 'declining';
    recommended_focus: 'practice' | 'review' | 'advanced';
  };
}

export type BloomLevel = 
  | 'Recordar'
  | 'Comprender'
  | 'Aplicar'
  | 'Analizar'
  | 'Evaluar'
  | 'Crear';

export interface Unit {
  unit_id: string;
  grade_code: string;
  subject_id: string;
  unit_number: number;
  unit_title: string;
  unit_description?: string;
  estimated_classes: number;
  semester?: 1 | 2;
  year: number;
  created_at: string;
  
  // Relations
  unit_oa?: UnitOA[];
}

export interface UnitOA {
  unit_id: string;
  oa_id: string;
  sequence_order: number;
  is_primary: boolean;
  estimated_classes: number;
  notes?: string;
  
  // Relations
  units?: Unit;
  learning_objectives?: LearningObjective;
}

// ===============================================
// CLASS & ENROLLMENT SYSTEM
// ===============================================

export interface Class {
  class_id: string;
  school_id: string;
  class_name: string;
  grade_code: string;
  subject_id: string;
  teacher_id: string;
  co_teacher_id?: string;
  year: number;
  classroom?: string;
  max_students: number;
  schedule_json: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  subjects?: Subject;
  grade_levels?: GradeLevel;
  teacher?: User;
  co_teacher?: User;
  enrollments?: Enrollment[];
  students?: User[];
}

export interface Enrollment {
  enrollment_id: string;
  student_id: string;
  class_id: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  final_grade?: number;
  attendance_percentage?: number;
  behavior_score?: number;
  special_needs?: string;
  guardian_id?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  students?: User;
  classes?: Class;
  guardian?: User;
}

// ===============================================
// LESSON PLANNING SYSTEM
// ===============================================

export interface LessonPlan {
  plan_id: string;
  school_id: string;
  class_id: string;
  unit_id?: string;
  creator_id: string;
  
  // Basic Info
  plan_title: string;
  plan_date: string;
  duration_minutes: number;
  lesson_number?: number;
  
  // Learning Objectives
  oa_ids: string[];
  custom_objectives?: string[];
  
  // Lesson Structure (Markdown content)
  inicio_md?: string;
  desarrollo_md?: string;
  cierre_md?: string;
  evaluation_md?: string;
  
  // Planning Details
  methodology?: string;
  differentiation_strategies?: string;
  materials_needed?: string[];
  homework_assigned?: string;
  
  // Status & Approval
  status: LessonPlanStatus;
  submitted_at?: string;
  approved_by?: string;
  approved_at?: string;
  completion_notes?: string;
  
  // AI Enhancement
  ai_generated: boolean;
  ai_suggestions?: Record<string, any>;
  
  created_at: string;
  updated_at: string;
  
  // Relations
  classes?: Class;
  units?: Unit;
  creator?: User;
  approver?: User;
  lesson_resources?: LessonResource[];
  learning_objectives?: LearningObjective[];
}

export type LessonPlanStatus = 
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface LessonResource {
  resource_id: string;
  plan_id: string;
  resource_type: ResourceType;
  resource_title: string;
  resource_description?: string;
  
  // File resources
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  
  // Quiz/Game resources
  quiz_id?: string;
  game_session_id?: string;
  
  // External resources
  external_url?: string;
  embed_code?: string;
  
  // Metadata
  resource_order: number;
  is_required: boolean;
  estimated_time_minutes?: number;
  
  created_at: string;
  
  // Relations
  quizzes?: Quiz;
}

export type ResourceType = 
  | 'file'
  | 'quiz'
  | 'game'
  | 'link'
  | 'video'
  | 'presentation';

// ===============================================
// DIGITAL CLASS BOOK
// ===============================================

export interface DailyClassControl {
  control_id: string;
  school_id: string;
  class_id: string;
  lesson_plan_id?: string;
  teacher_id: string;
  
  // Class Details
  class_date: string;
  start_time?: string;
  end_time?: string;
  lesson_topic: string;
  lesson_summary?: string;
  activities_completed?: string[];
  
  // Legal Compliance
  signature_hash?: string;
  signature_timestamp?: string;
  legal_validated: boolean;
  
  // Attendance Summary
  total_students?: number;
  present_count?: number;
  absent_count?: number;
  late_count?: number;
  justified_count?: number;
  
  // Observations
  general_observations?: string;
  disciplinary_notes?: string;
  pedagogical_notes?: string;
  
  // Status
  status: ClassControlStatus;
  completed_at?: string;
  
  created_at: string;
  updated_at: string;
  
  // Relations
  classes?: Class;
  teacher?: User;
  lesson_plans?: LessonPlan;
  attendance?: Attendance[];
}

export type ClassControlStatus = 
  | 'draft'
  | 'completed'
  | 'signed'
  | 'exported';

export interface Attendance {
  attendance_id: string;
  school_id: string;
  class_id: string;
  student_id: string;
  daily_control_id?: string;
  
  attendance_date: string;
  status: AttendanceStatus;
  arrival_time?: string;
  departure_time?: string;
  
  // Detailed tracking
  minutes_late: number;
  justification_reason?: string;
  justification_document_url?: string;
  
  // Medical/Special cases
  medical_certificate: boolean;
  requires_followup: boolean;
  
  // Notes
  student_notes?: string;
  teacher_notes?: string;
  parent_notified: boolean;
  notification_sent_at?: string;
  
  recorded_by?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  students?: User;
  classes?: Class;
  daily_class_control?: DailyClassControl;
}

export type AttendanceStatus = 
  | 'present'
  | 'absent'
  | 'late'
  | 'justified'
  | 'excused'
  | 'medical';

export interface ClassBookExport {
  export_id: string;
  school_id: string;
  class_id?: string;
  exported_by: string;
  
  // Export Details
  export_type: 'daily' | 'weekly' | 'monthly' | 'semester' | 'annual';
  period_start: string;
  period_end: string;
  
  // Files
  csv_file_url: string;
  pdf_file_url?: string;
  signature_file_url?: string;
  
  // Legal Validation
  sha256_hash: string;
  digital_signature?: string;
  validation_token?: string;
  
  // Status
  status: 'generated' | 'signed' | 'validated' | 'submitted';
  
  created_at: string;
  
  // Relations
  exporter?: User;
}

// ===============================================
// AI SERVICE SYSTEM
// ===============================================

export interface AIServiceConfig {
  config_id: string;
  school_id: string;
  
  // Service Settings
  service_enabled: boolean;
  openai_model: string;
  max_tokens_per_request: number;
  temperature: number;
  
  // Budget Management
  monthly_budget_clp: number;
  daily_budget_clp: number;
  alert_threshold_percentage: number;
  
  // Feature Flags
  quiz_generation_enabled: boolean;
  tts_generation_enabled: boolean;
  analytics_enabled: boolean;
  lesson_planning_ai_enabled: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface AIUsageLog {
  log_id: string;
  school_id: string;
  user_id: string;
  
  // Request Details
  service_type: AIServiceType;
  model_used?: string;
  prompt_text?: string;
  
  // Usage Metrics
  tokens_used: number;
  cost_clp: number;
  processing_time_ms?: number;
  
  // Content Details
  oa_codes?: string[];
  generated_content_type?: string;
  content_quality_score?: number;
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'timeout';
  error_message?: string;
  
  created_at: string;
  
  // Relations
  users?: User;
}

export type AIServiceType = 
  | 'quiz_generation'
  | 'tts_generation'
  | 'lesson_planning'
  | 'analytics'
  | 'rubric_generation';

export interface AIBudgetStatus {
  config: AIServiceConfig;
  today: {
    used: number;
    limit: number;
    remaining: number;
    requests: number;
  };
  monthly: {
    used: number;
    limit: number;
    remaining: number;
    requests: number;
    tokens: number;
  };
}

export interface AIBudgetTracking {
  date: string;
  daily_budget_clp: number;
  daily_used_clp: number;
  daily_requests: number;
  cumulative_monthly_clp: number;
  remaining_daily_clp: number;
  alert_triggered: boolean;
}

// ===============================================
// RBAC PERMISSION SYSTEM
// ===============================================

export interface Permission {
  permission_id: string;
  permission_code: string;
  permission_name: string;
  permission_description?: string;
  resource_type: string;
  action_type: string;
  is_school_scoped: boolean;
  created_at: string;
}

export interface RolePermission {
  role_permission_id: string;
  role: UserRole;
  permission_id: string;
  granted: boolean;
  conditions?: Record<string, any>;
  created_at: string;
  
  // Relations
  permissions?: Permission;
}

export interface UserPermissionOverride {
  override_id: string;
  user_id: string;
  permission_id: string;
  granted: boolean;
  reason?: string;
  granted_by?: string;
  expires_at?: string;
  created_at: string;
  
  // Relations
  permissions?: Permission;
  granted_by_user?: User;
}

export interface UserPermissionSummary {
  role: UserRole;
  permissions: Array<Permission & {
    source: 'role' | 'user_override';
    expires_at?: string;
  }>;
}

// ===============================================
// QUIZ SYSTEM (Enhanced)
// ===============================================

export interface Quiz {
  quiz_id: string;
  school_id: string;
  author_id: string;
  title: string;
  description?: string;
  mode: 'manual' | 'ai';
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit_minutes: number;
  
  // OA Integration
  primary_oa_ids?: string[];
  secondary_oa_ids?: string[];
  bloom_levels?: BloomLevel[];
  
  // AI Enhancement
  ai_generated: boolean;
  ai_prompt?: string;
  ai_quality_score?: number;
  
  metadata_json: Record<string, any>;
  created_at: string;
  updated_at: string;
  active: boolean;
  
  // Relations
  author?: User;
  questions?: Question[];
  learning_objectives?: LearningObjective[];
}

export interface GameSession {
  session_id: string;
  quiz_id: string;
  host_id: string;
  school_id: string;
  format: GameFormat;
  status: GameStatus;
  settings_json: Record<string, any>;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  
  // 🎨 Skin System Integration
  applied_skin?: {
    session_id: string;
    skin_id: string;
    skin_name: string;
    applied_at: string;
    theme: {
      primary_color: string;
      secondary_color: string;
      accent_color: string;
      background: string;
      font_family: string;
      animations: string;
    };
    elements: {
      counters?: string[];
      sound_indicators?: string;
      progress_indicators?: string;
      sound_effects?: string;
      visual_effects?: string;
    };
    engine_config: Record<string, any>;
    engine_id: string;
    preview_url: string;
  };
  
  // Relations
  quizzes?: Quiz;
  host?: User;
  participants?: GameParticipant[];
}

export type GameFormat = 
  | 'trivia_lightning'
  | 'color_match'
  | 'memory_flip'
  | 'picture_bingo'
  | 'drag_drop_sorting'
  | 'number_line_race'
  | 'word_builder'
  | 'word_search'
  | 'hangman_visual'
  | 'escape_room_mini';

export type GameStatus = 
  | 'waiting'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface GameParticipant {
  session_id: string;
  user_id: string;
  score: number;
  accuracy: number;
  time_ms: number;
  joined_at: string;
  
  // Relations
  users?: User;
}

export interface GameComponentProps {
  quiz: Quiz;
  session: GameSession;
  user: User;
  currentQuestion?: Question;
  timeRemaining?: number;
  onAnswer: (answer: any) => void;
  onGameEnd: () => void;
  onComplete?: (score: number) => void;
  onNext?: () => void;
  isPreview?: boolean;
  disabled?: boolean;
}

export interface Question {
  question_id: string;
  quiz_id: string;
  question_order: number;
  stem_md: string;
  type: QuestionType;
  options_json: Array<{ text: string; is_correct: boolean; }>;
  correct_answer?: string;
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Enhanced fields
  bloom_level?: BloomLevel;
  cognitive_complexity?: number;
  
  // Media assets
  asset_url?: string;
  tts_url?: string;
  
  // AI fields
  ai_generated: boolean;
  ai_confidence_score?: number;
  
  // 🐄 Farm Context for Skin System
  farm_context?: {
    visual: string;
    narrative: string;
    operation?: string;
    animal_sound?: string;
  };
  
  created_at: string;
  source?: string;
  subject?: any;
  grade?: any;
  learning_objective?: any;
  question_type?: any;
  
  // Relations
  question_learning_objectives?: QuestionLearningObjective[];
}

export type QuestionType = 
  | 'multiple_choice'
  | 'true_false'
  | 'short_answer'
  | 'essay';

export interface QuestionLearningObjective {
  question_id: string;
  oa_id: string;
  mapping_strength: 'primary' | 'secondary' | 'tangential';
  ai_mapped: boolean;
  verified_by?: string;
  verified_at?: string;
  
  // Relations
  learning_objectives?: LearningObjective;
  verified_by_user?: User;
}

// ===============================================
// API RESPONSE TYPES
// ===============================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errorType?: string;
  details?: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===============================================
// DASHBOARD & ANALYTICS TYPES
// ===============================================

export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  totalQuizzes: number;
  totalLessonPlans: number;
  
  // Recent activity
  recentQuizzes: Quiz[];
  recentLessonPlans: LessonPlan[];
  upcomingClasses: Class[];
  
  // AI Usage
  aiUsageToday: number;
  aiUsageMonth: number;
  aiCostToday: number;
  aiCostMonth: number;
}

export interface AttendanceStats {
  totalDays: number;
  totalStudents: number;
  byStatus: Record<AttendanceStatus, number>;
  byStudent: Record<string, Record<AttendanceStatus, number>>;
  byDate: Record<string, Record<AttendanceStatus, number>>;
  percentages: Record<AttendanceStatus, number>;
}

export interface AIAnalytics {
  period: string;
  dailyUsage: AIBudgetTracking[];
  serviceStats: Record<AIServiceType, {
    requests: number;
    totalCost: number;
    totalTokens: number;
  }>;
  totals: {
    cost: number;
    tokens: number;
    requests: number;
  };
}

// ===============================================
// FORM & UI TYPES
// ===============================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  helpText?: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ===============================================
// WEBSOCKET & REAL-TIME TYPES
// ===============================================

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
  schoolId?: string;
}

export interface GameSessionUpdate extends WebSocketMessage {
  type: 'game_update';
  payload: {
    sessionId: string;
    status: string;
    participants: any[];
    currentQuestion?: any;
    scores?: Record<string, number>;
  };
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification';
  payload: {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    autoClose?: boolean;
  };
}

// ===============================================
// WEBSOCKET MESSAGE TYPES
// ===============================================

export interface WSGameJoin {
  session_id: string;
  user_id: string;
}

export interface WSGameStart {
  session_id: string;
}

export interface WSGameAnswer {
  session_id: string;
  question_id: string;
  answer: string | number;
  time_taken: number;
}

export interface WSGameLeaderboard {
  session_id: string;
  participants: Array<{
    user_id: string;
    score: number;
    accuracy: number;
    time_ms: number;
  }>;
}

export interface WSGameEnd {
  session_id: string;
  final_scores: Array<{
    user_id: string;
    score: number;
    rank: number;
  }>;
}

// ===============================================
// ERROR TYPES
// ===============================================

export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// ===============================================
// EXPORT TYPES
// ===============================================

export * from './auth';
export * from './components';

// Default export for convenience
export default interface EDU21Types {
  User: User;
  Class: Class;
  Quiz: Quiz;
  Question: Question;
  LearningObjective: LearningObjective;
  LessonPlan: LessonPlan;
  DailyClassControl: DailyClassControl;
  Attendance: Attendance;
  AIServiceConfig: AIServiceConfig;
  Permission: Permission;
} 