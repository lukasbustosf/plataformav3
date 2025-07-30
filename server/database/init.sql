-- ===============================================
-- EDU21 DATABASE SCHEMA - MODULO II COMPLETE P1
-- ===============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- CORE SYSTEM TABLES
-- ===============================================

-- Schools (Sostenedor management)
CREATE TABLE IF NOT EXISTS schools (
    school_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_name VARCHAR(255) NOT NULL,
    school_code VARCHAR(50) UNIQUE NOT NULL,
    sostenedor_id UUID,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    director_id UUID,
    region VARCHAR(100),
    comuna VARCHAR(100),
    rbd VARCHAR(20) UNIQUE,
    school_type VARCHAR(50) DEFAULT 'particular' CHECK (school_type IN ('municipal', 'particular', 'subvencionado')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Users with complete RBAC
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(school_id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    rut VARCHAR(12) UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'SUPER_ADMIN_FULL',
        'ADMIN_ESCOLAR', 
        'BIENESTAR_ESCOLAR',
        'TEACHER',
        'STUDENT',
        'GUARDIAN',
        'SOSTENEDOR'
    )),
    phone VARCHAR(20),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('M', 'F', 'O')),
    profile_picture_url TEXT,
    
    -- RBAC Fields
    permissions JSONB DEFAULT '{}',
    role_permissions JSONB DEFAULT '{}',
    last_role_update TIMESTAMP WITH TIME ZONE,
    
    -- Authentication
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Status
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- CURRICULUM & OA SYSTEM (COMPLETE)
-- ===============================================

-- Grade Levels (MINEDUC Standard)
CREATE TABLE IF NOT EXISTS grade_levels (
    grade_code VARCHAR(10) PRIMARY KEY,
    grade_name VARCHAR(50) NOT NULL,
    level_type VARCHAR(20) CHECK (level_type IN ('PARVULO', 'BASICA', 'MEDIA')),
    age_min INTEGER,
    age_max INTEGER,
    ciclo VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects (MINEDUC Standard)
CREATE TABLE IF NOT EXISTS subjects (
    subject_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_code VARCHAR(10) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    subject_color VARCHAR(7) DEFAULT '#6366F1',
    department VARCHAR(50),
    is_core BOOLEAN DEFAULT true,
    min_hours_per_week INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Objectives (OA MINEDUC Complete)
CREATE TABLE IF NOT EXISTS learning_objectives (
    oa_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oa_code VARCHAR(50) UNIQUE NOT NULL,
    oa_desc TEXT NOT NULL,
    oa_short_desc VARCHAR(255),
    grade_code VARCHAR(10) REFERENCES grade_levels(grade_code),
    subject_id UUID REFERENCES subjects(subject_id),
    bloom_level VARCHAR(20) CHECK (bloom_level IN ('Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear')),
    oa_version VARCHAR(10) DEFAULT '2023',
    semester INTEGER CHECK (semester IN (1, 2)),
    complexity_level INTEGER CHECK (complexity_level BETWEEN 1 AND 5),
    estimated_hours INTEGER DEFAULT 4,
    prerequisites JSONB DEFAULT '[]',
    is_transversal BOOLEAN DEFAULT false,
    ministerial_priority VARCHAR(20) DEFAULT 'normal' CHECK (ministerial_priority IN ('high', 'normal', 'low')),
    deprecated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Curriculum Units (Ministerial Planning)
CREATE TABLE IF NOT EXISTS units (
    unit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_code VARCHAR(10) REFERENCES grade_levels(grade_code),
    subject_id UUID REFERENCES subjects(subject_id),
    unit_number INTEGER NOT NULL,
    unit_title VARCHAR(255) NOT NULL,
    unit_description TEXT,
    estimated_classes INTEGER DEFAULT 8,
    semester INTEGER CHECK (semester IN (1, 2)),
    year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(grade_code, subject_id, unit_number, year)
);

-- Unit-OA Mapping
CREATE TABLE IF NOT EXISTS unit_oa (
    unit_id UUID REFERENCES units(unit_id) ON DELETE CASCADE,
    oa_id UUID REFERENCES learning_objectives(oa_id) ON DELETE CASCADE,
    sequence_order INTEGER,
    is_primary BOOLEAN DEFAULT true,
    estimated_classes INTEGER DEFAULT 2,
    PRIMARY KEY (unit_id, oa_id)
);

-- ===============================================
-- CLASS & ENROLLMENT SYSTEM
-- ===============================================

-- Courses (e.g., "5th Grade Math", "High School Biology")
CREATE TABLE IF NOT EXISTS courses (
    course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
    grade_code VARCHAR(10) REFERENCES grade_levels(grade_code),
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) UNIQUE,
    description TEXT,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, subject_id, grade_code, year)
);

-- Classes (Enhanced)
CREATE TABLE IF NOT EXISTS classes (
    class_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    class_name VARCHAR(100) NOT NULL,
    grade_code VARCHAR(10) REFERENCES grade_levels(grade_code),
    subject_id UUID REFERENCES subjects(subject_id),
    teacher_id UUID REFERENCES users(user_id),
    co_teacher_id UUID REFERENCES users(user_id),
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    classroom VARCHAR(50),
    max_students INTEGER DEFAULT 35,
    schedule_json JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Enrollments (Enhanced)
CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(user_id),
    class_id UUID NOT NULL REFERENCES classes(class_id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred', 'graduated')),
    final_grade DECIMAL(3,1),
    attendance_percentage DECIMAL(5,2),
    behavior_score DECIMAL(3,1),
    special_needs TEXT,
    guardian_id UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, class_id)
);

-- ===============================================
-- LESSON PLANNING SYSTEM
-- ===============================================

-- Lesson Plans (Complete Implementation)
CREATE TABLE IF NOT EXISTS lesson_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(class_id),
    unit_id UUID REFERENCES units(unit_id),
    creator_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Basic Info
    plan_title VARCHAR(255) NOT NULL,
    plan_date DATE NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    lesson_number INTEGER,
    
    -- Learning Objectives
    oa_ids UUID[] DEFAULT '{}',
    custom_objectives TEXT[],
    
    -- Lesson Structure (Markdown content)
    inicio_md TEXT,
    desarrollo_md TEXT,
    cierre_md TEXT,
    evaluation_md TEXT,
    
    -- Planning Details
    methodology VARCHAR(100),
    differentiation_strategies TEXT,
    materials_needed TEXT[],
    homework_assigned TEXT,
    
    -- Status & Approval
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'in_progress', 'completed', 'cancelled')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    completion_notes TEXT,
    
    -- AI Enhancement
    ai_generated BOOLEAN DEFAULT false,
    ai_suggestions JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson Resources
CREATE TABLE IF NOT EXISTS lesson_resources (
    resource_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES lesson_plans(plan_id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('file', 'quiz', 'game', 'link', 'video', 'presentation')),
    resource_title VARCHAR(255) NOT NULL,
    resource_description TEXT,
    
    -- File resources
    file_url TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(100),
    
    -- Quiz/Game resources
    quiz_id UUID,
    game_session_id UUID,
    
    -- External resources
    external_url TEXT,
    embed_code TEXT,
    
    -- Metadata
    resource_order INTEGER DEFAULT 1,
    is_required BOOLEAN DEFAULT false,
    estimated_time_minutes INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- DIGITAL CLASS BOOK (LIBRO DE CLASES)
-- ===============================================

-- Daily Class Control (Enhanced Attendance)
CREATE TABLE IF NOT EXISTS daily_class_control (
    control_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(class_id),
    lesson_plan_id UUID REFERENCES lesson_plans(plan_id),
    teacher_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Class Details
    class_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    lesson_topic VARCHAR(500) NOT NULL,
    lesson_summary TEXT,
    activities_completed TEXT[],
    
    -- Legal Compliance
    signature_hash VARCHAR(64),
    signature_timestamp TIMESTAMP WITH TIME ZONE,
    legal_validated BOOLEAN DEFAULT false,
    
    -- Attendance Summary
    total_students INTEGER,
    present_count INTEGER,
    absent_count INTEGER,
    late_count INTEGER,
    justified_count INTEGER,
    
    -- Observations
    general_observations TEXT,
    disciplinary_notes TEXT,
    pedagogical_notes TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'signed', 'exported')),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(class_id, class_date)
);

-- Enhanced Attendance (linked to daily control)
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(class_id),
    student_id UUID NOT NULL REFERENCES users(user_id),
    daily_control_id UUID REFERENCES daily_class_control(control_id),
    
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'justified', 'excused', 'medical')),
    arrival_time TIME,
    departure_time TIME,
    
    -- Detailed tracking
    minutes_late INTEGER DEFAULT 0,
    justification_reason TEXT,
    justification_document_url TEXT,
    
    -- Medical/Special cases
    medical_certificate BOOLEAN DEFAULT false,
    requires_followup BOOLEAN DEFAULT false,
    
    -- Notes
    student_notes TEXT,
    teacher_notes TEXT,
    parent_notified BOOLEAN DEFAULT false,
    notification_sent_at TIMESTAMP WITH TIME ZONE,
    
    recorded_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(class_id, student_id, attendance_date)
);

-- ===============================================
-- AI SERVICE SYSTEM
-- ===============================================

-- AI Service Configuration
CREATE TABLE IF NOT EXISTS ai_service_config (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(school_id) ON DELETE CASCADE,
    
    -- Service Settings
    service_enabled BOOLEAN DEFAULT true,
    openai_model VARCHAR(50) DEFAULT 'gpt-4o-mini',
    max_tokens_per_request INTEGER DEFAULT 2000,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    
    -- Budget Management
    monthly_budget_clp INTEGER DEFAULT 100000,
    daily_budget_clp INTEGER DEFAULT 3500,
    alert_threshold_percentage INTEGER DEFAULT 80,
    
    -- Feature Flags
    quiz_generation_enabled BOOLEAN DEFAULT true,
    tts_generation_enabled BOOLEAN DEFAULT true,
    analytics_enabled BOOLEAN DEFAULT true,
    lesson_planning_ai_enabled BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Usage Tracking
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Request Details
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('quiz_generation', 'tts_generation', 'lesson_planning', 'analytics', 'rubric_generation')),
    model_used VARCHAR(50),
    prompt_text TEXT,
    
    -- Usage Metrics
    tokens_used INTEGER NOT NULL,
    cost_clp DECIMAL(10,2) NOT NULL,
    processing_time_ms INTEGER,
    
    -- Content Details
    oa_codes VARCHAR(255)[],
    generated_content_type VARCHAR(50),
    content_quality_score DECIMAL(3,2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'timeout')),
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Budget Tracking
CREATE TABLE IF NOT EXISTS ai_budget_tracking (
    tracking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    
    -- Period
    tracking_date DATE NOT NULL,
    tracking_month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM tracking_date)) STORED,
    tracking_year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM tracking_date)) STORED,
    
    -- Daily Totals
    total_cost_clp DECIMAL(10,2) DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    request_count INTEGER DEFAULT 0,
    
    -- By Service Type
    quiz_generation_cost DECIMAL(10,2) DEFAULT 0,
    tts_generation_cost DECIMAL(10,2) DEFAULT 0,
    analytics_cost DECIMAL(10,2) DEFAULT 0,
    other_cost DECIMAL(10,2) DEFAULT 0,
    
    -- Budget Status
    budget_limit_clp DECIMAL(10,2),
    budget_remaining_clp DECIMAL(10,2),
    alert_triggered BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(school_id, tracking_date)
);

-- ===============================================
-- RBAC PERMISSION SYSTEM
-- ===============================================

-- Permission Definitions
CREATE TABLE IF NOT EXISTS permissions (
    permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(255) NOT NULL,
    permission_description TEXT,
    resource_type VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    is_school_scoped BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Permissions Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
    role_permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(50) NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(permission_id),
    granted BOOLEAN DEFAULT true,
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, permission_id)
);

-- ===============================================
-- QUIZ SYSTEM (Enhanced)
-- ===============================================

-- Quizzes (Enhanced with AI and OA mapping)
CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    mode VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (mode IN ('manual', 'ai')),
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    time_limit_minutes INTEGER DEFAULT 30,
    
    -- OA Integration
    primary_oa_ids UUID[] DEFAULT '{}',
    secondary_oa_ids UUID[] DEFAULT '{}',
    bloom_levels VARCHAR(20)[] DEFAULT '{}',
    
    -- AI Enhancement
    ai_generated BOOLEAN DEFAULT false,
    ai_prompt TEXT,
    ai_quality_score DECIMAL(3,2),
    
    metadata_json JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT true
);

-- Questions (Enhanced with OA mapping)
CREATE TABLE IF NOT EXISTS questions (
    question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    question_order INTEGER NOT NULL,
    stem_md TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'multiple_choice' CHECK (type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
    options_json JSONB DEFAULT '[]',
    correct_answer TEXT,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    difficulty VARCHAR(20) DEFAULT 'medium',
    
    -- Enhanced fields
    bloom_level VARCHAR(20) CHECK (bloom_level IN ('Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear')),
    cognitive_complexity INTEGER CHECK (cognitive_complexity BETWEEN 1 AND 5),
    
    -- Media assets
    asset_url TEXT,
    tts_url TEXT,
    
    -- AI fields
    ai_generated BOOLEAN DEFAULT false,
    ai_confidence_score DECIMAL(3,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question-Learning Objective mapping (Enhanced)
CREATE TABLE IF NOT EXISTS question_learning_objectives (
    question_id UUID REFERENCES questions(question_id) ON DELETE CASCADE,
    oa_id UUID REFERENCES learning_objectives(oa_id),
    mapping_strength VARCHAR(20) DEFAULT 'primary' CHECK (mapping_strength IN ('primary', 'secondary', 'tangential')),
    ai_mapped BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(user_id),
    verified_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (question_id, oa_id)
);

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);

-- OA and curriculum indexes
CREATE INDEX IF NOT EXISTS idx_learning_objectives_grade_subject ON learning_objectives(grade_code, subject_id);
CREATE INDEX IF NOT EXISTS idx_learning_objectives_bloom ON learning_objectives(bloom_level);
CREATE INDEX IF NOT EXISTS idx_learning_objectives_version ON learning_objectives(oa_version);
CREATE INDEX IF NOT EXISTS idx_unit_oa_unit_id ON unit_oa(unit_id);

-- Class and enrollment indexes
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_year_active ON classes(year, active);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);

-- Lesson planning indexes
CREATE INDEX IF NOT EXISTS idx_lesson_plans_school_date ON lesson_plans(school_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_class_id ON lesson_plans(class_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_status ON lesson_plans(status);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_plan_id ON lesson_resources(plan_id);

-- Digital class book indexes
CREATE INDEX IF NOT EXISTS idx_daily_control_class_date ON daily_class_control(class_id, class_date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance(class_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, attendance_date);

-- AI service indexes
CREATE INDEX IF NOT EXISTS idx_ai_usage_school_date ON ai_usage_logs(school_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_service_type ON ai_usage_logs(service_type);
CREATE INDEX IF NOT EXISTS idx_ai_budget_school_month ON ai_budget_tracking(school_id, tracking_year, tracking_month);

-- Quiz and question indexes  
CREATE INDEX IF NOT EXISTS idx_quizzes_school_id ON quizzes(school_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_author_id ON quizzes(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_question_oa_question_id ON question_learning_objectives(question_id);
CREATE INDEX IF NOT EXISTS idx_question_oa_oa_id ON question_learning_objectives(oa_id);

-- ===============================================
-- EVALUATION SYSTEM (P1 CRITICAL)
-- ===============================================

-- Evaluations (P1-T-07, P1-T-10, P1-T-11)
CREATE TABLE IF NOT EXISTS evaluations (
    evaluation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(class_id),
    creator_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Basic information
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('quiz', 'exam', 'task')),
    mode VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (mode IN ('manual', 'ai')),
    
    -- Evaluation configuration
    weight DECIMAL(5,2) NOT NULL CHECK (weight BETWEEN 1 AND 100),
    max_score DECIMAL(6,2) DEFAULT 100,
    passing_score DECIMAL(6,2) DEFAULT 60,
    
    -- Time and attempt limits
    time_limit_minutes INTEGER,
    attempt_limit INTEGER DEFAULT 1,
    late_submission_penalty DECIMAL(5,2) DEFAULT 0,
    
    -- P1-T-07: Lockdown mode (serious exams)
    serious BOOLEAN DEFAULT false,
    lockdown_mode BOOLEAN DEFAULT false,
    anti_cheat_enabled BOOLEAN DEFAULT false,
    shuffle_questions BOOLEAN DEFAULT false,
    shuffle_options BOOLEAN DEFAULT false,
    
    -- Grading
    grading_scale VARCHAR(20) DEFAULT 'chile_1_7' CHECK (grading_scale IN ('chile_1_7', 'percentage', 'points')),
    auto_grade BOOLEAN DEFAULT true,
    
    -- P1-T-10: AI-generated rubric support
    rubric_json JSONB DEFAULT '{}',
    rubric_ai_generated BOOLEAN DEFAULT false,
    
    -- OA alignment (P1 requirement)
    primary_oa_ids UUID[] DEFAULT '{}',
    secondary_oa_ids UUID[] DEFAULT '{}',
    bloom_level_coverage VARCHAR(20)[] DEFAULT '{}',
    
    -- Scheduling
    available_from TIMESTAMP WITH TIME ZONE,
    available_until TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'closed', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- P1 compliance tracking
    p1_compliant BOOLEAN DEFAULT false,
    p1_compliance_score DECIMAL(3,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluation Attempts (Student submissions)
CREATE TABLE IF NOT EXISTS evaluation_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(evaluation_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Attempt tracking
    attempt_number INTEGER DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    
    -- Scoring
    score_raw DECIMAL(6,2),
    score_percentage DECIMAL(5,2),
    score_scaled DECIMAL(3,1), -- Chile 1-7 scale
    
    -- P1-T-07: Anti-cheat and proctoring
    proctored BOOLEAN DEFAULT false,
    anti_cheat_violations INTEGER DEFAULT 0,
    anti_cheat_seed VARCHAR(100),
    browser_lockdown BOOLEAN DEFAULT false,
    
    -- Submission data
    answers_json JSONB DEFAULT '{}',
    time_spent_minutes INTEGER,
    
    -- Status
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'late', 'failed')),
    is_late BOOLEAN DEFAULT false,
    penalty_applied DECIMAL(5,2) DEFAULT 0,
    
    -- Feedback
    feedback TEXT,
    teacher_comments TEXT,
    auto_feedback_json JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(evaluation_id, student_id, attempt_number)
);

-- Task Submissions (P1-T-11: File uploads and assignments)
CREATE TABLE IF NOT EXISTS task_submissions (
    submission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(evaluation_id),
    student_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Submission content
    submission_text TEXT,
    file_urls TEXT[] DEFAULT '{}',
    file_names TEXT[] DEFAULT '{}',
    file_sizes INTEGER[] DEFAULT '{}',
    
    -- Submission tracking
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_late BOOLEAN DEFAULT false,
    late_penalty_applied DECIMAL(5,2) DEFAULT 0,
    
    -- Grading
    score_raw DECIMAL(6,2),
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES users(user_id),
    teacher_feedback TEXT,
    
    -- P1-T-11: Auto-grading support
    auto_gradeable BOOLEAN DEFAULT false,
    auto_grade_score DECIMAL(6,2),
    manual_override BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(evaluation_id, student_id)
);

-- Gradebook Entries (Final grades)
CREATE TABLE IF NOT EXISTS gradebook_entries (
    entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(class_id),
    student_id UUID NOT NULL REFERENCES users(user_id),
    evaluation_id UUID REFERENCES evaluations(evaluation_id),
    
    -- Grade information
    grade_numeric DECIMAL(3,1), -- Chile 1-7 scale
    grade_letter VARCHAR(10),
    grade_percentage DECIMAL(5,2),
    weight DECIMAL(5,2),
    
    -- Metadata
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recorded_by UUID NOT NULL REFERENCES users(user_id),
    semester INTEGER CHECK (semester IN (1, 2)),
    grade_type VARCHAR(20) DEFAULT 'formative' CHECK (grade_type IN ('formative', 'summative', 'final')),
    
    -- Comments and feedback
    feedback TEXT,
    teacher_notes TEXT,
    
    -- P1 OA coverage tracking
    oa_coverage_json JSONB DEFAULT '{}',
    bloom_levels_assessed VARCHAR(20)[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, evaluation_id)
);

-- ===============================================
-- GAME SESSION SYSTEM (P1-T-02)
-- ===============================================

-- Game Sessions (Real-time multiplayer games)
CREATE TABLE IF NOT EXISTS game_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(quiz_id),
    host_id UUID NOT NULL REFERENCES users(user_id),
    class_id UUID REFERENCES classes(class_id),
    
    -- Game configuration
    format VARCHAR(50) NOT NULL DEFAULT 'trivia_lightning',
    title VARCHAR(255) NOT NULL,
    max_participants INTEGER DEFAULT 30,
    
    -- Session settings
    settings_json JSONB DEFAULT '{}',
    game_mode VARCHAR(20) DEFAULT 'collaborative' CHECK (game_mode IN ('competitive', 'collaborative', 'practice')),
    time_per_question INTEGER DEFAULT 30,
    show_correct_answers BOOLEAN DEFAULT true,
    randomize_questions BOOLEAN DEFAULT false,
    
    -- P1-S-01: Accessibility features
    accessibility_enabled BOOLEAN DEFAULT true,
    tts_enabled BOOLEAN DEFAULT true,
    high_contrast_mode BOOLEAN DEFAULT false,
    large_text_mode BOOLEAN DEFAULT false,
    
    -- Session status
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'starting', 'active', 'paused', 'finished', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    
    -- Results
    total_questions INTEGER,
    questions_completed INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    total_participants INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Session Participants
CREATE TABLE IF NOT EXISTS game_participants (
    participation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Participation data
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    final_score DECIMAL(6,2) DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_answers INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0,
    average_response_time INTEGER DEFAULT 0, -- milliseconds
    
    -- Game-specific data
    position_final INTEGER,
    achievements_json JSONB DEFAULT '[]',
    power_ups_used INTEGER DEFAULT 0,
    
    -- P1-S-01: Accessibility usage tracking
    used_tts BOOLEAN DEFAULT false,
    used_high_contrast BOOLEAN DEFAULT false,
    used_large_text BOOLEAN DEFAULT false,
    
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disconnected', 'finished', 'kicked')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(session_id, user_id)
);

-- ===============================================
-- BIENESTAR & PAI SYSTEM (P1-C-01, P1-C-02)
-- ===============================================

-- Support Cases (PAI - Plan de Apoyo Integral)
CREATE TABLE IF NOT EXISTS support_cases (
    case_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id),
    guardian_id UUID REFERENCES users(user_id),
    creator_id UUID NOT NULL REFERENCES users(user_id), -- Bienestar professional
    
    -- Case information
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    case_type VARCHAR(30) NOT NULL CHECK (case_type IN ('academic', 'behavioral', 'emotional', 'social', 'family', 'medical', 'attendance')),
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- P1-C-01: Risk assessment
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_factors TEXT[] DEFAULT '{}',
    protective_factors TEXT[] DEFAULT '{}',
    
    -- P1-C-02: PAI workflow (≤5 minutes creation time)
    pai_status VARCHAR(20) DEFAULT 'draft' CHECK (pai_status IN ('draft', 'active', 'review', 'completed', 'cancelled')),
    pai_objectives TEXT[] DEFAULT '{}',
    pai_strategies TEXT[] DEFAULT '{}',
    pai_timeline_weeks INTEGER DEFAULT 12,
    
    -- Digital signatures (legal compliance)
    signatures_json JSONB DEFAULT '{}',
    signature_hash VARCHAR(64), -- SHA-256
    signed_at TIMESTAMP WITH TIME ZONE,
    
    -- Status and timeline
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'transferred')),
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    next_review_date DATE,
    
    -- Tracking
    interventions_count INTEGER DEFAULT 0,
    sessions_completed INTEGER DEFAULT 0,
    family_involved BOOLEAN DEFAULT false,
    external_referral BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Case Notes (Bienestar interventions tracking)
CREATE TABLE IF NOT EXISTS support_notes (
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES support_cases(case_id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Note content
    note_type VARCHAR(30) NOT NULL CHECK (note_type IN ('session', 'phone_call', 'family_meeting', 'observation', 'intervention', 'follow_up', 'referral')),
    title VARCHAR(255),
    content_md TEXT NOT NULL,
    
    -- P2-C-03: Encrypted private notes
    is_confidential BOOLEAN DEFAULT false,
    confidential_content TEXT, -- Encrypted column
    
    -- Metadata
    session_duration_minutes INTEGER,
    participants TEXT[] DEFAULT '{}',
    next_steps TEXT,
    
    -- Attachments
    attachment_urls TEXT[] DEFAULT '{}',
    attachment_names TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Assessment History (P1-C-01: Weekly risk student lists)
CREATE TABLE IF NOT EXISTS risk_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id),
    assessor_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Assessment data
    assessment_date DATE DEFAULT CURRENT_DATE,
    academic_risk_score INTEGER CHECK (academic_risk_score BETWEEN 0 AND 10),
    behavioral_risk_score INTEGER CHECK (behavioral_risk_score BETWEEN 0 AND 10),
    emotional_risk_score INTEGER CHECK (emotional_risk_score BETWEEN 0 AND 10),
    social_risk_score INTEGER CHECK (social_risk_score BETWEEN 0 AND 10),
    attendance_risk_score INTEGER CHECK (attendance_risk_score BETWEEN 0 AND 10),
    
    -- Overall assessment
    overall_risk_level VARCHAR(20) CHECK (overall_risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_factors_identified TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    
    -- Intervention needs
    requires_pai BOOLEAN DEFAULT false,
    requires_external_referral BOOLEAN DEFAULT false,
    requires_family_contact BOOLEAN DEFAULT false,
    
    -- P1-C-01: Weekly reporting data
    included_in_weekly_report BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, assessment_date)
);

-- ===============================================
-- ADDITIONAL P1 INDEXES
-- ===============================================

-- Evaluation system indexes
CREATE INDEX IF NOT EXISTS idx_evaluations_school_id ON evaluations(school_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_class_id ON evaluations(class_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_creator_id ON evaluations(creator_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_type_status ON evaluations(type, status);
CREATE INDEX IF NOT EXISTS idx_evaluations_p1_compliant ON evaluations(p1_compliant);

CREATE INDEX IF NOT EXISTS idx_evaluation_attempts_evaluation_id ON evaluation_attempts(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_attempts_student_id ON evaluation_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_attempts_status ON evaluation_attempts(status);

CREATE INDEX IF NOT EXISTS idx_task_submissions_evaluation_id ON task_submissions(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_student_id ON task_submissions(student_id);

CREATE INDEX IF NOT EXISTS idx_gradebook_entries_class_student ON gradebook_entries(class_id, student_id);
CREATE INDEX IF NOT EXISTS idx_gradebook_entries_evaluation_id ON gradebook_entries(evaluation_id);

-- Game session indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_school_id ON game_sessions(school_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_host_id ON game_sessions(host_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_quiz_id ON game_sessions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);

CREATE INDEX IF NOT EXISTS idx_game_participants_session_id ON game_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_user_id ON game_participants(user_id);

-- Bienestar system indexes
CREATE INDEX IF NOT EXISTS idx_support_cases_school_id ON support_cases(school_id);
CREATE INDEX IF NOT EXISTS idx_support_cases_student_id ON support_cases(student_id);
CREATE INDEX IF NOT EXISTS idx_support_cases_creator_id ON support_cases(creator_id);
CREATE INDEX IF NOT EXISTS idx_support_cases_status_risk ON support_cases(status, risk_level);
CREATE INDEX IF NOT EXISTS idx_support_cases_pai_status ON support_cases(pai_status);

CREATE INDEX IF NOT EXISTS idx_support_notes_case_id ON support_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_support_notes_author_id ON support_notes(author_id);

CREATE INDEX IF NOT EXISTS idx_risk_assessments_school_student ON risk_assessments(school_id, student_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_date_risk ON risk_assessments(assessment_date, overall_risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_weekly_report ON risk_assessments(included_in_weekly_report);

-- ===============================================
-- SEED DATA
-- ===============================================

-- Insert Grade Levels (MINEDUC Standard)
INSERT INTO grade_levels (grade_code, grade_name, level_type, age_min, age_max, ciclo) VALUES
('PK', 'Pre-Kínder', 'PARVULO', 4, 5, 'Educación Parvularia'),
('K', 'Kínder', 'PARVULO', 5, 6, 'Educación Parvularia'),
('1B', '1° Básico', 'BASICA', 6, 7, 'Primer Ciclo'),
('2B', '2° Básico', 'BASICA', 7, 8, 'Primer Ciclo'),
('3B', '3° Básico', 'BASICA', 8, 9, 'Primer Ciclo'),
('4B', '4° Básico', 'BASICA', 9, 10, 'Primer Ciclo'),
('5B', '5° Básico', 'BASICA', 10, 11, 'Segundo Ciclo'),
('6B', '6° Básico', 'BASICA', 11, 12, 'Segundo Ciclo'),
('7B', '7° Básico', 'BASICA', 12, 13, 'Segundo Ciclo'),
('8B', '8° Básico', 'BASICA', 13, 14, 'Segundo Ciclo'),
('1M', '1° Medio', 'MEDIA', 14, 15, 'Educación Media'),
('2M', '2° Medio', 'MEDIA', 15, 16, 'Educación Media'),
('3M', '3° Medio', 'MEDIA', 16, 17, 'Educación Media'),
('4M', '4° Medio', 'MEDIA', 17, 18, 'Educación Media')
ON CONFLICT (grade_code) DO NOTHING;

-- Insert Subjects (MINEDUC Standard)
INSERT INTO subjects (subject_id, subject_code, subject_name, subject_color, is_core) VALUES
(uuid_generate_v4(), 'MAT', 'Matemática', '#3B82F6', true),
(uuid_generate_v4(), 'LEN', 'Lenguaje y Comunicación', '#EF4444', true),
(uuid_generate_v4(), 'CN', 'Ciencias Naturales', '#10B981', true),
(uuid_generate_v4(), 'HIS', 'Historia, Geografía y Cs. Sociales', '#F59E0B', true),
(uuid_generate_v4(), 'ING', 'Inglés', '#8B5CF6', true),
(uuid_generate_v4(), 'EDF', 'Educación Física y Salud', '#06B6D4', false),
(uuid_generate_v4(), 'ART', 'Artes Visuales', '#EC4899', false),
(uuid_generate_v4(), 'MUS', 'Música', '#F97316', false),
(uuid_generate_v4(), 'TEC', 'Tecnología', '#6B7280', false),
(uuid_generate_v4(), 'REL', 'Religión', '#84CC16', false)
ON CONFLICT (subject_code) DO NOTHING;

-- Insert RBAC Permissions
INSERT INTO permissions (permission_id, permission_code, permission_name, permission_description, resource_type, action_type, is_school_scoped) VALUES
(uuid_generate_v4(), 'quiz.create', 'Create Quiz', 'Create new quizzes', 'quiz', 'create', true),
(uuid_generate_v4(), 'quiz.read', 'Read Quiz', 'View quizzes', 'quiz', 'read', true),
(uuid_generate_v4(), 'quiz.update', 'Update Quiz', 'Edit quizzes', 'quiz', 'update', true),
(uuid_generate_v4(), 'quiz.delete', 'Delete Quiz', 'Delete quizzes', 'quiz', 'delete', true),
(uuid_generate_v4(), 'student.grade', 'Grade Student', 'Assign grades to students', 'student', 'update', true),
(uuid_generate_v4(), 'class.create', 'Create Class', 'Create new classes', 'class', 'create', true),
(uuid_generate_v4(), 'lesson_plan.create', 'Create Lesson Plan', 'Create lesson plans', 'lesson_plan', 'create', true),
(uuid_generate_v4(), 'lesson_plan.approve', 'Approve Lesson Plan', 'Approve lesson plans', 'lesson_plan', 'approve', true),
(uuid_generate_v4(), 'attendance.take', 'Take Attendance', 'Record student attendance', 'attendance', 'create', true),
(uuid_generate_v4(), 'ai_service.use', 'Use AI Service', 'Access AI generation features', 'ai_service', 'use', true),
(uuid_generate_v4(), 'budget.manage', 'Manage Budget', 'Manage AI and school budgets', 'budget', 'manage', true),
(uuid_generate_v4(), 'school.admin', 'School Administration', 'Full school administration access', 'school', 'admin', true),
(uuid_generate_v4(), 'system.admin', 'System Administration', 'Full system administration', 'system', 'admin', false)
ON CONFLICT (permission_code) DO NOTHING;

-- Insert Sample Learning Objectives (MINEDUC 2023 - P1 Priority)
INSERT INTO learning_objectives (oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_id, bloom_level, oa_version, semester, complexity_level, estimated_hours, prerequisites, is_transversal, ministerial_priority) 
SELECT 
    uuid_generate_v4(),
    'MAT-5B-OA01',
    'Representar y describir números naturales de hasta más de 6 dígitos y menores que 1 000 millones utilizando los períodos.',
    'Números naturales hasta 1.000 millones',
    '5B',
    s.subject_id,
    'Comprender',
    '2023',
    1,
    2,
    8,
    '["4B-números-hasta-10000"]'::jsonb,
    false,
    'high'
FROM subjects s WHERE s.subject_code = 'MAT'
UNION ALL
SELECT 
    uuid_generate_v4(),
    'MAT-5B-OA02',
    'Aplicar estrategias de cálculo mental para la multiplicación utilizando las propiedades conmutativa, asociativa y distributiva.',
    'Cálculo mental en multiplicación',
    '5B',
    s.subject_id,
    'Aplicar',
    '2023',
    1,
    3,
    6,
    '["4B-multiplicacion-basica"]'::jsonb,
    false,
    'high'
FROM subjects s WHERE s.subject_code = 'MAT'
UNION ALL
SELECT 
    uuid_generate_v4(),
    'LEN-5B-OA01',
    'Leer de manera fluida textos variados apropiados a su edad, pronunciando las palabras con precisión, respetando la prosodia indicada por todos los signos de puntuación y leyendo con entonación adecuada.',
    'Lectura fluida con prosodia',
    '5B',
    s.subject_id,
    'Aplicar',
    '2023',
    1,
    2,
    4,
    '["4B-lectura-basica"]'::jsonb,
    false,
    'high'
FROM subjects s WHERE s.subject_code = 'LEN'
UNION ALL
SELECT 
    uuid_generate_v4(),
    'LEN-5B-OA02',
    'Comprender textos aplicando estrategias de comprensión lectora; por ejemplo: relacionar la información del texto con sus experiencias y conocimientos.',
    'Estrategias de comprensión lectora',
    '5B',
    s.subject_id,
    'Comprender',
    '2023',
    1,
    3,
    6,
    '["4B-comprension-basica"]'::jsonb,
    false,
    'high'
FROM subjects s WHERE s.subject_code = 'LEN'
UNION ALL
SELECT 
    uuid_generate_v4(),
    'CN-5B-OA01',
    'Reconocer y explicar que los seres vivos están formados por una o más células y que estas se organizan en tejidos, órganos y sistemas.',
    'Organización celular de seres vivos',
    '5B',
    s.subject_id,
    'Comprender',
    '2023',
    1,
    2,
    4,
    '["4B-seres-vivos"]'::jsonb,
    false,
    'high'
FROM subjects s WHERE s.subject_code = 'CN'
ON CONFLICT (oa_code) DO NOTHING; 

-- Insert Role-Permission Mappings
INSERT INTO role_permissions (role_permission_id, role, permission_id, granted)
SELECT 
    uuid_generate_v4(),
    'TEACHER',
    p.permission_id,
    true
FROM permissions p 
WHERE p.permission_code IN ('quiz.create', 'quiz.read', 'quiz.update', 'lesson_plan.create', 'attendance.take', 'ai_service.use', 'student.grade')
ON CONFLICT (role, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_permission_id, role, permission_id, granted)
SELECT 
    uuid_generate_v4(),
    'ADMIN_ESCOLAR',
    p.permission_id,
    true
FROM permissions p 
WHERE p.is_school_scoped = true
ON CONFLICT (role, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_permission_id, role, permission_id, granted)
SELECT 
    uuid_generate_v4(),
    'SUPER_ADMIN_FULL',
    p.permission_id,
    true
FROM permissions p
ON CONFLICT (role, permission_id) DO NOTHING;

-- ===============================================
-- FUNCTIONS AND TRIGGERS
-- ===============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_plans_updated_at BEFORE UPDATE ON lesson_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_class_control_updated_at BEFORE UPDATE ON daily_class_control
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate class book signature
CREATE OR REPLACE FUNCTION generate_class_book_signature()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        NEW.signature_hash = encode(sha256(
            CONCAT(
                NEW.control_id::text,
                NEW.class_date::text,
                NEW.lesson_topic,
                NEW.teacher_id::text,
                COALESCE(NEW.present_count::text, '0'),
                COALESCE(NEW.absent_count::text, '0')
            )::bytea
        ), 'hex');
        NEW.signature_timestamp = NOW();
        NEW.legal_validated = true;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add signature trigger
CREATE TRIGGER generate_signature_trigger BEFORE UPDATE ON daily_class_control
    FOR EACH ROW EXECUTE FUNCTION generate_class_book_signature(); 