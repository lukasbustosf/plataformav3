const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');
const { supabase } = require('../database/supabase');
const logger = require('../utils/logger');

// ===============================================
// P1 AI QUIZ GENERATION (Enhanced)
// ===============================================

// P1-T-01: Generate quiz questions with <60s, 95% OA alignment
router.post('/generate/quiz', 
    authenticateToken, 
    requirePermission('ai_service.use'),
    async (req, res) => {
        try {
            const {
                oaCodes = [],
                subject,
                gradeLevel,
                difficulty = 'medium',
                questionCount = 5,
                questionTypes = ['multiple_choice'],
                bloomLevels = ['Recordar', 'Comprender'],
                topic = '',
                additionalInstructions = ''
            } = req.body;

            // P1 Enhanced validation
            if (!subject || !gradeLevel) {
                return res.status(400).json({
                    success: false,
                    error: 'Subject and grade level are required for P1 compliance',
                    errorType: 'VALIDATION_ERROR'
                });
            }

            if (questionCount < 1 || questionCount > 20) {
                return res.status(400).json({
                    success: false,
                    error: 'Question count must be between 1 and 20',
                    errorType: 'VALIDATION_ERROR'
                });
            }

            // P1 OA requirement check
            if (oaCodes.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'At least one learning objective (OA) is required for P1 compliance',
                    errorType: 'OA_REQUIRED'
                });
            }

            const startTime = Date.now();

            const result = await aiService.generateQuizQuestions(
                req.user.school_id,
                req.user.user_id,
                {
                    oaCodes,
                    subject,
                    gradeLevel,
                    difficulty,
                    questionCount,
                    questionTypes,
                    bloomLevels,
                    topic,
                    additionalInstructions
                }
            );

            const processingTime = Date.now() - startTime;

            res.json({
                success: true,
                data: result,
                p1Compliance: {
                    processingTime,
                    targetTime: 60000,
                    timeMet: processingTime < 60000,
                    oaAlignment: result.metadata.oaAlignment,
                    targetAlignment: 0.95,
                    alignmentMet: result.metadata.oaAlignment >= 0.95
                }
            });

        } catch (error) {
            console.error('P1 AI quiz generation error:', error);

            // Enhanced P1 error handling
            if (error.message.includes('Insufficient budget')) {
                return res.status(402).json({
                    success: false,
                    error: error.message,
                    errorType: 'BUDGET_EXCEEDED',
                    p1Impact: 'Budget management required for P1 compliance'
                });
            }

            if (error.message.includes('OA alignment')) {
                return res.status(422).json({
                    success: false,
                    error: error.message,
                    errorType: 'OA_ALIGNMENT_FAILED',
                    p1Impact: 'P1 requires ≥95% OA alignment'
                });
            }

            if (error.message.includes('timeout')) {
                return res.status(408).json({
                    success: false,
                    error: 'Generation exceeded P1 time limit of 60 seconds',
                    errorType: 'TIMEOUT_ERROR',
                    p1Impact: 'P1 compliance requires <60s generation'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Failed to generate quiz questions',
                errorType: 'GENERATION_ERROR',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// ===============================================
// P1 BUDGET MANAGEMENT (P1-O-02)
// ===============================================

// Get budget status with P1 80% alert
router.get('/budget/status', 
    authenticateToken, 
    requirePermission('budget.manage'),
    async (req, res) => {
        try {
            const budgetStatus = await aiService.getBudgetStatus(req.user.school_id);

            res.json({
                success: true,
                data: {
                    ...budgetStatus,
                    p1Alerts: {
                        budgetAlert80: budgetStatus.dailyUsagePercent >= budgetStatus.alertThreshold,
                        alertThreshold: budgetStatus.alertThreshold,
                        daysRemaining: budgetStatus.monthlyBudget > 0 ? 
                            Math.floor(budgetStatus.monthlyRemaining / (budgetStatus.dailySpent || 1)) : 0
                    }
                }
            });

        } catch (error) {
            console.error('Budget status error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch budget status'
            });
        }
    }
);

// P1-O-02: Configure budget with CLP slider and 80% alert
router.post('/budget/configure', 
    authenticateToken, 
    requireRole('ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL', 'SOSTENEDOR'),
    async (req, res) => {
        try {
            const {
                dailyBudgetClp,
                monthlyBudgetClp,
                alertThreshold = 80,
                serviceEnabled = true
            } = req.body;

            // P1 validation
            if (dailyBudgetClp < 0 || monthlyBudgetClp < 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Budget amounts must be positive'
                });
            }

            if (alertThreshold < 50 || alertThreshold > 100) {
                return res.status(400).json({
                    success: false,
                    error: 'Alert threshold must be between 50% and 100%'
                });
            }

            const { data, error } = await supabase
                .from('ai_service_config')
                .upsert({
                    school_id: req.user.school_id,
                    daily_budget_clp: dailyBudgetClp,
                    monthly_budget_clp: monthlyBudgetClp,
                    alert_threshold_percentage: alertThreshold,
                    service_enabled: serviceEnabled,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'school_id'
                });

            if (error) throw error;

            res.json({
                success: true,
                message: 'AI budget configuration updated successfully',
                data: {
                    dailyBudgetClp,
                    monthlyBudgetClp,
                    alertThreshold,
                    serviceEnabled,
                    p1Compliant: alertThreshold <= 80
                }
            });

        } catch (error) {
            console.error('Budget configuration error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to configure budget'
            });
        }
    }
);

// ===============================================
// P1 COMPLIANCE REPORTING
// ===============================================

// P1 compliance report for administrators
router.get('/compliance/p1-report', 
    authenticateToken,
    requireRole('ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL', 'SOSTENEDOR'),
    async (req, res) => {
        try {
            const { 
                startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate = new Date().toISOString().split('T')[0]
            } = req.query;

            const complianceReport = await aiService.getP1ComplianceReport(
                req.user.school_id, 
                startDate, 
                endDate
            );

            // Enhanced P1 metrics
            const p1Status = {
                overallCompliance: complianceReport.p1CompliantGenerations / Math.max(complianceReport.totalGenerations, 1),
                targetsMet: {
                    timeTarget: complianceReport.avgProcessingTime < 60000,
                    qualityTarget: complianceReport.avgQualityScore >= 0.8
                },
                recommendations: []
            };

            // P1 Recommendations
            if (p1Status.overallCompliance < 0.9) {
                p1Status.recommendations.push('Consider optimizing generation parameters for better P1 compliance');
            }
            if (complianceReport.avgProcessingTime > 45000) {
                p1Status.recommendations.push('Generation times approaching P1 limit - monitor performance');
            }
            if (complianceReport.avgQualityScore < 0.8) {
                p1Status.recommendations.push('Review OA alignment strategies to improve quality scores');
            }

            res.json({
                success: true,
                data: {
                    ...complianceReport,
                    p1Status,
                    period: { startDate, endDate }
                }
            });

        } catch (error) {
            console.error('P1 compliance report error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate P1 compliance report'
            });
        }
    }
);

// ===============================================
// LEARNING OBJECTIVES INTEGRATION (Enhanced)
// ===============================================

// Get learning objectives for AI generation with P1 filtering
router.get('/objectives', authenticateToken, async (req, res) => {
    try {
        const { 
            gradeCode, 
            subjectId, 
            bloomLevel,
            search = '',
            limit = 100,
            p1Priority = false // P1 feature: prioritize high-priority OAs
        } = req.query;

        let query = supabase
            .from('learning_objectives')
            .select(`
                *,
                subjects(subject_name, subject_code),
                grade_levels(grade_name)
            `)
            .order('oa_code');

        if (gradeCode) {
            query = query.eq('grade_code', gradeCode);
        }

        if (subjectId) {
            query = query.eq('subject_id', subjectId);
        }

        if (bloomLevel) {
            query = query.eq('bloom_level', bloomLevel);
        }

        if (search) {
            query = query.or(`oa_desc.ilike.%${search}%,oa_code.ilike.%${search}%`);
        }

        // P1 Priority filtering
        if (p1Priority === 'true') {
            query = query.eq('ministerial_priority', 'high');
        }

        const { data: objectives, error } = await query.limit(limit);

        if (error) throw error;

        // Enhanced response with P1 metadata
        const enhancedObjectives = objectives?.map(oa => ({
            ...oa,
            p1Metadata: {
                complexity: oa.complexity_level || 1,
                estimatedGenerationTime: (oa.complexity_level || 1) * 10, // seconds
                aiCompatible: true,
                priority: oa.ministerial_priority === 'high'
            }
        })) || [];

        res.json({
            success: true,
            data: enhancedObjectives,
            p1Stats: {
                total: enhancedObjectives.length,
                highPriority: enhancedObjectives.filter(oa => oa.ministerial_priority === 'high').length,
                avgComplexity: enhancedObjectives.reduce((sum, oa) => sum + (oa.complexity_level || 1), 0) / enhancedObjectives.length
            }
        });

    } catch (error) {
        console.error('Objectives fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch learning objectives'
        });
    }
});

// ===============================================
// COST ESTIMATION (Enhanced)
// ===============================================

// P1 Enhanced cost estimation with CLP conversion
router.post('/estimate/cost', authenticateToken, async (req, res) => {
    try {
        const {
            serviceType,
            questionCount = 5,
            textLength = 0,
            complexity = 'medium',
            oaCount = 1
        } = req.body;

        let estimatedTokens = 0;
        let model = 'gpt-4o-mini';

        switch (serviceType) {
            case 'quiz_generation':
                // P1 Enhanced estimation with OA complexity
                const baseTokens = 300;
                const questionTokens = questionCount * 150;
                const oaTokens = oaCount * 50; // OA context overhead
                const complexityMultiplier = complexity === 'hard' ? 1.5 : complexity === 'easy' ? 0.8 : 1.0;
                
                estimatedTokens = Math.round((baseTokens + questionTokens + oaTokens) * complexityMultiplier);
                break;
            case 'lesson_planning':
                estimatedTokens = 500 + (textLength / 4);
                break;
            case 'tts_generation':
                model = 'tts-1';
                estimatedTokens = textLength;
                break;
            default:
                estimatedTokens = 200;
        }

        // P1 Cost calculation in CLP
        const estimatedCostCLP = aiService._calculateCostCLP(estimatedTokens, model);
        const estimatedTimeSeconds = Math.min(estimatedTokens / 30, 60); // P1 time estimate

        res.json({
            success: true,
            data: {
                estimatedTokens,
                estimatedCostCLP,
                estimatedTimeSeconds,
                model,
                serviceType,
                p1Compliance: {
                    withinTimeLimit: estimatedTimeSeconds <= 60,
                    costEfficient: estimatedCostCLP <= 1000, // Example threshold
                    tokenLimit: estimatedTokens <= 2000
                }
            }
        });

    } catch (error) {
        console.error('Cost estimation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to estimate cost'
        });
    }
});

// ===============================================
// ANALYTICS AND MONITORING
// ===============================================

// P1 Analytics for educators (P1-ADMIN-ESC)
router.get('/analytics/weekly-oa-bloom', 
    authenticateToken,
    requireRole('ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'),
    async (req, res) => {
        try {
            const { 
                weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            } = req.query;

            // Get AI usage with OA breakdown
            const { data: usageLogs } = await supabase
                .from('ai_usage_logs')
                .select('oa_codes, content_quality_score, created_at')
                .eq('school_id', req.user.school_id)
                .eq('service_type', 'quiz_generation')
                .gte('created_at', weekStart)
                .order('created_at', { ascending: false });

            // Process OA coverage and Bloom distribution
            const oaCoverage = {};
            const bloomDistribution = {};
            let totalQuestions = 0;

            if (usageLogs) {
                usageLogs.forEach(log => {
                    if (log.oa_codes && Array.isArray(log.oa_codes)) {
                        log.oa_codes.forEach(oaCode => {
                            oaCoverage[oaCode] = (oaCoverage[oaCode] || 0) + 1;
                            totalQuestions++;
                        });
                    }
                });
            }

            // Get OA details for analysis
            const { data: objectives } = await supabase
                .from('learning_objectives')
                .select('oa_code, bloom_level, ministerial_priority')
                .in('oa_code', Object.keys(oaCoverage));

            if (objectives) {
                objectives.forEach(oa => {
                    bloomDistribution[oa.bloom_level] = (bloomDistribution[oa.bloom_level] || 0) + (oaCoverage[oa.oa_code] || 0);
                });
            }

            res.json({
                success: true,
                data: {
                    weekStart,
                    oaCoverage,
                    bloomDistribution,
                    totalQuestions,
                    uniqueOAs: Object.keys(oaCoverage).length,
                    p1Metrics: {
                        coverageEfficiency: Object.keys(oaCoverage).length / Math.max(totalQuestions, 1),
                        bloomDiversity: Object.keys(bloomDistribution).length,
                        avgQuality: usageLogs?.reduce((sum, log) => sum + (log.content_quality_score || 0), 0) / Math.max(usageLogs?.length || 1, 1)
                    }
                }
            });

        } catch (error) {
            console.error('Weekly OA/Bloom analytics error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate weekly analytics'
            });
        }
    }
);

// Health check for AI service
router.get('/health', authenticateToken, async (req, res) => {
    try {
        const budgetStatus = await aiService.getBudgetStatus(req.user.school_id);
        
        res.json({
            success: true,
            status: 'healthy',
            data: {
                serviceEnabled: budgetStatus.dailyBudget > 0,
                budgetAvailable: budgetStatus.dailyRemaining > 0,
                p1Ready: budgetStatus.dailyUsagePercent < 90,
                lastCheck: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('AI health check error:', error);
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            error: 'Health check failed'
        });
    }
});

// ===============================================
// P1 AI SERVICE ROUTES
// ===============================================

/**
 * P1-T-01: Generate AI quiz aligned to OA (< 60s, 10 items, match OA ≥ 95%)
 * POST /ai/generate-quiz
 */
router.post('/generate-quiz', authenticateToken, requirePermission('ai_service.use'), async (req, res) => {
    try {
        const { user } = req;
        const {
            grade_code,
            subject_id, 
            oa_ids,
            question_count = 10,
            difficulty = 'medium',
            time_limit = 30,
            include_tts = true
        } = req.body;

        // Validate required fields
        if (!grade_code || !subject_id || !oa_ids || !Array.isArray(oa_ids) || oa_ids.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Grade code, subject ID, and learning objectives are required'
            });
        }

        // Validate OA count (max 5 for focused quiz)
        if (oa_ids.length > 5) {
            return res.status(400).json({
                success: false,
                error: 'Maximum 5 learning objectives allowed per quiz'
            });
        }

        // Check if user has permission for this school
        if (user.role === 'TEACHER') {
            const { data: classCheck } = await supabase
                .from('classes')
                .select('class_id')
                .eq('teacher_id', user.user_id)
                .eq('grade_code', grade_code)
                .eq('subject_id', subject_id)
                .limit(1);

            if (!classCheck || classCheck.length === 0) {
                return res.status(403).json({
                    success: false,
                    error: 'You can only generate quizzes for your assigned classes'
                });
            }
        }

        logger.info(`🎯 Generating AI quiz for user ${user.user_id}, school ${user.school_id}`);

        // Generate quiz using AI service
        const quizResult = await aiService.generateQuiz(
            user.school_id,
            user.user_id,
            grade_code,
            subject_id,
            oa_ids,
            {
                questionCount: question_count,
                difficulty,
                timeLimit: time_limit,
                includeTTS: include_tts,
                gradeCode: grade_code
            }
        );

        // Log successful generation
        logger.info(`✅ Quiz generated successfully: ${quizResult.quiz_id}`);

        res.json({
            success: true,
            data: {
                quiz_id: quizResult.quiz_id,
                title: quizResult.title,
                question_count: quizResult.questions.length,
                oa_coverage: quizResult.oa_coverage,
                processing_time_ms: quizResult.processing_time,
                cost_clp: Math.round(quizResult.cost_clp),
                tokens_used: quizResult.tokens_used,
                message: `Quiz generado exitosamente en ${(quizResult.processing_time / 1000).toFixed(1)}s`
            }
        });

    } catch (error) {
        logger.error('❌ AI quiz generation failed:', error);
        
        // Handle specific error types
        if (error.message.includes('Budget exceeded')) {
            return res.status(402).json({
                success: false,
                error: 'Presupuesto de IA agotado para este mes',
                error_code: 'BUDGET_EXCEEDED'
            });
        }

        if (error.message.includes('No learning objectives found')) {
            return res.status(404).json({
                success: false,
                error: 'Objetivos de aprendizaje no encontrados',
                error_code: 'OA_NOT_FOUND'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error al generar quiz con IA',
            error_code: 'AI_GENERATION_FAILED'
        });
    }
});

/**
 * P1-S-01: Generate TTS for accessibility (WCAG AA compliance)
 * POST /ai/generate-tts
 */
router.post('/generate-tts', authenticateToken, requirePermission('ai_service.use'), async (req, res) => {
    try {
        const { user } = req;
        const {
            text,
            voice = 'nova',
            speed = 0.9,
            format = 'mp3'
        } = req.body;

        // Validate text
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text content is required'
            });
        }

        // Validate text length (max 4000 characters)
        if (text.length > 4000) {
            return res.status(400).json({
                success: false,
                error: 'Text too long (maximum 4000 characters)'
            });
        }

        logger.info(`🎵 Generating TTS for user ${user.user_id}, ${text.length} characters`);

        // Generate TTS using AI service
        const ttsResult = await aiService.generateTTS(
            user.school_id,
            user.user_id,
            text,
            {
                voice,
                speed,
                format
            }
        );

        res.json({
            success: true,
            data: {
                audio_url: ttsResult.audio_url,
                character_count: ttsResult.character_count,
                cost_clp: Math.round(ttsResult.cost_clp),
                voice: ttsResult.voice,
                accessibility_compliant: true,
                wcag_level: 'AA'
            }
        });

    } catch (error) {
        logger.error('❌ TTS generation failed:', error);
        
        if (error.message.includes('Budget exceeded')) {
            return res.status(402).json({
                success: false,
                error: 'Presupuesto de TTS agotado para este mes',
                error_code: 'TTS_BUDGET_EXCEEDED'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error al generar audio TTS',
            error_code: 'TTS_GENERATION_FAILED'
        });
    }
});

/**
 * P1-T-10: Generate AI rubric for evaluations
 * POST /ai/generate-rubric
 */
router.post('/generate-rubric', authenticateToken, requirePermission('ai_service.use'), async (req, res) => {
    try {
        const { user } = req;
        const {
            evaluation_type, // 'quiz', 'exam', 'task', 'project'
            oa_ids,
            grade_code,
            subject_id,
            total_points = 100,
            criteria_count = 4
        } = req.body;

        // Validate inputs
        if (!evaluation_type || !oa_ids || !grade_code || !subject_id) {
            return res.status(400).json({
                success: false,
                error: 'Evaluation type, OAs, grade, and subject are required'
            });
        }

        // Get learning objectives details
        const { data: objectives, error: oaError } = await supabase
            .from('learning_objectives')
            .select('*')
            .in('oa_id', oa_ids);

        if (oaError) throw oaError;

        // Get subject details
        const { data: subject } = await supabase
            .from('subjects')
            .select('*')
            .eq('subject_id', subject_id)
            .single();

        // Generate rubric using AI
        const rubricResult = await aiService.generateRubric(
            user.school_id,
            user.user_id,
            {
                evaluationType: evaluation_type,
                objectives,
                subject,
                gradeCode: grade_code,
                totalPoints: total_points,
                criteriaCount: criteria_count
            }
        );

        res.json({
            success: true,
            data: rubricResult
        });

    } catch (error) {
        logger.error('❌ AI rubric generation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Error al generar rúbrica con IA'
        });
    }
});

/**
 * P1-O-02: Get AI budget status and configure limits
 * GET /ai/budget/status
 */
router.get('/budget/status', authenticateToken, requireRole(['ADMIN_ESCOLAR', 'SOSTENEDOR']), async (req, res) => {
    try {
        const { user } = req;

        // Get budget configuration
        const { data: config, error: configError } = await supabase
            .from('ai_service_config')
            .select('*')
            .eq('school_id', user.school_id)
            .single();

        if (configError && configError.code !== 'PGRST116') {
            throw configError;
        }

        // Get current month's usage
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const { data: usage, error: usageError } = await supabase
            .from('ai_budget_tracking')
            .select('*')
            .eq('school_id', user.school_id)
            .eq('tracking_month', currentMonth)
            .eq('tracking_year', currentYear)
            .order('tracking_date', { ascending: false });

        if (usageError) throw usageError;

        // Calculate totals
        const totalSpent = usage?.reduce((sum, day) => sum + day.total_cost_clp, 0) || 0;
        const monthlyLimit = config?.monthly_budget_clp || 0;
        const usagePercentage = monthlyLimit > 0 ? (totalSpent / monthlyLimit) * 100 : 0;
        const remaining = Math.max(0, monthlyLimit - totalSpent);

        // Determine status
        let status = 'active';
        if (usagePercentage >= 100) {
            status = 'exceeded';
        } else if (usagePercentage >= 95) {
            status = 'critical';
        } else if (usagePercentage >= 80) {
            status = 'warning';
        }

        res.json({
            success: true,
            data: {
                configuration: config || {
                    enabled: false,
                    monthly_budget_clp: 0,
                    alert_threshold: 80
                },
                current_usage: {
                    total_spent_clp: totalSpent,
                    monthly_limit_clp: monthlyLimit,
                    remaining_clp: remaining,
                    usage_percentage: usagePercentage,
                    status
                },
                daily_usage: usage || [],
                alerts: {
                    budget_80_percent: usagePercentage >= 80,
                    budget_95_percent: usagePercentage >= 95,
                    budget_exceeded: usagePercentage >= 100
                }
            }
        });

    } catch (error) {
        logger.error('❌ Failed to get budget status:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener estado del presupuesto'
        });
    }
});

/**
 * P1-O-02: Configure AI budget limits
 * PUT /ai/budget/configure
 */
router.put('/budget/configure', authenticateToken, requireRole(['ADMIN_ESCOLAR', 'SOSTENEDOR']), async (req, res) => {
    try {
        const { user } = req;
        const {
            enabled = true,
            monthly_budget_clp,
            alert_threshold = 80,
            auto_disable_on_exceed = true
        } = req.body;

        // Validate budget amount
        if (enabled && (!monthly_budget_clp || monthly_budget_clp <= 0)) {
            return res.status(400).json({
                success: false,
                error: 'Monthly budget must be greater than 0 when enabled'
            });
        }

        // Validate alert threshold
        if (alert_threshold < 0 || alert_threshold > 100) {
            return res.status(400).json({
                success: false,
                error: 'Alert threshold must be between 0 and 100'
            });
        }

        // Update or create configuration
        const configData = {
            school_id: user.school_id,
            enabled,
            monthly_budget_clp: monthly_budget_clp || 0,
            alert_threshold,
            auto_disable_on_exceed,
            updated_by: user.user_id,
            updated_at: new Date().toISOString()
        };

        const { data: config, error } = await supabase
            .from('ai_service_config')
            .upsert(configData, {
                onConflict: 'school_id'
            })
            .select()
            .single();

        if (error) throw error;

        logger.info(`💰 AI budget configured for school ${user.school_id}: $${monthly_budget_clp.toLocaleString()} CLP`);

        res.json({
            success: true,
            data: config,
            message: 'Configuración de presupuesto actualizada exitosamente'
        });

    } catch (error) {
        logger.error('❌ Failed to configure budget:', error);
        res.status(500).json({
            success: false,
            error: 'Error al configurar presupuesto'
        });
    }
});

/**
 * Get AI usage statistics
 * GET /ai/usage/stats
 */
router.get('/usage/stats', authenticateToken, requireRole(['ADMIN_ESCOLAR', 'SOSTENEDOR', 'TEACHER']), async (req, res) => {
    try {
        const { user } = req;
        const { start_date, end_date, service_type } = req.query;

        // Default to last 30 days
        const endDate = end_date || new Date().toISOString().split('T')[0];
        const startDate = start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        let query = supabase
            .from('ai_usage_logs')
            .select('*')
            .eq('school_id', user.school_id)
            .gte('created_at', startDate)
            .lte('created_at', endDate + 'T23:59:59.999Z')
            .order('created_at', { ascending: false });

        // Filter by user if TEACHER role
        if (user.role === 'TEACHER') {
            query = query.eq('user_id', user.user_id);
        }

        // Filter by service type if specified
        if (service_type) {
            query = query.eq('service_type', service_type);
        }

        const { data: usage, error } = await query;

        if (error) throw error;

        // Get usage statistics using AI service
        const stats = await aiService.getUsageStats(user.school_id, startDate, endDate);

        res.json({
            success: true,
            data: {
                statistics: stats,
                raw_usage: usage,
                period: {
                    start_date: startDate,
                    end_date: endDate
                }
            }
        });

    } catch (error) {
        logger.error('❌ Failed to get usage stats:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener estadísticas de uso'
        });
    }
});

/**
 * Get AI service health status
 * GET /ai/health
 */
router.get('/health', authenticateToken, async (req, res) => {
    try {
        // Check OpenAI API connectivity
        const healthCheck = {
            openai_api: 'unknown',
            budget_check: 'unknown',
            database: 'unknown',
            timestamp: new Date().toISOString()
        };

        try {
            // Simple API call to check connectivity
            const testCompletion = await require('openai').chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: 'Test' }],
                max_tokens: 1
            });
            healthCheck.openai_api = 'healthy';
        } catch (error) {
            healthCheck.openai_api = 'unhealthy';
        }

        try {
            // Check budget system
            const budgetResult = await aiService.checkBudget(req.user.school_id);
            healthCheck.budget_check = 'healthy';
        } catch (error) {
            healthCheck.budget_check = 'unhealthy';
        }

        try {
            // Check database connectivity
            const { data } = await supabase
                .from('ai_service_config')
                .select('school_id')
                .limit(1);
            healthCheck.database = 'healthy';
        } catch (error) {
            healthCheck.database = 'unhealthy';
        }

        const overallHealth = Object.values(healthCheck).every(status => 
            status === 'healthy' || status === new Date().toISOString()
        ) ? 'healthy' : 'degraded';

        res.json({
            success: true,
            data: {
                overall_status: overallHealth,
                components: healthCheck
            }
        });

    } catch (error) {
        logger.error('❌ Health check failed:', error);
        res.status(500).json({
            success: false,
            error: 'Health check failed'
        });
    }
});

// ===============================================
// P2 AI LESSON OUTLINE GENERATION
// ===============================================

// P2-T-08: Generate lesson outline with AI
router.post('/lesson-outline', authenticateToken, requireRole(['TEACHER', 'ADMIN_ESCOLAR']), async (req, res) => {
    const startTime = Date.now();
    
    try {
        const {
            class_id,
            lesson_topic,
            oa_codes = [],
            duration_minutes = 90,
            student_level = 'grade_appropriate',
            special_requirements = [],
            school_id
        } = req.body;

        // Budget check
        const budgetCheck = await checkAIBudget(school_id || req.user.school_id);
        if (!budgetCheck.allowed) {
            return res.status(429).json({
                success: false,
                error: 'AI budget exceeded',
                budget_info: budgetCheck
            });
        }

        // Generate lesson outline
        const lessonOutline = await openAI.generateLessonOutline(
            `Crear planificación de clase sobre ${lesson_topic} de ${duration_minutes} minutos`,
            {
                topic: lesson_topic,
                oas: oa_codes,
                duration: duration_minutes,
                studentLevel: student_level,
                requirements: special_requirements
            }
        );

        const generationTime = Date.now() - startTime;

        // Record usage
        await recordAIUsage({
            school_id: school_id || req.user.school_id,
            user_id: req.user.user_id,
            operation: 'lesson_outline',
            tokens_used: estimateTokenUsage(lessonOutline),
            cost_usd: calculateCost(lessonOutline),
            generation_time_ms: generationTime
        });

        res.json({
            success: true,
            data: {
                lesson_outline: lessonOutline,
                generation_time_ms: generationTime,
                estimated_cost: calculateCost(lessonOutline)
            }
        });

    } catch (error) {
        logger.error('Lesson outline generation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Lesson outline generation failed'
        });
    }
});

// ===============================================
// HELPER FUNCTIONS
// ===============================================

async function checkAIBudget(school_id) {
    // Mock implementation - replace with actual database queries
    const mockBudget = {
        monthly_limit_usd: 500,
        current_usage_usd: 380,
        usage_percentage: 76,
        allowed: true,
        remaining_usd: 120,
        alert_threshold: 80
    };

    if (mockBudget.usage_percentage >= 100) {
        return { ...mockBudget, allowed: false };
    }

    if (mockBudget.usage_percentage >= mockBudget.alert_threshold) {
        // Trigger alert - implement notification system
        await triggerBudgetAlert(school_id, mockBudget);
    }

    return mockBudget;
}

async function recordAIUsage(usageData) {
    // Mock implementation - replace with actual database insert
    console.log('Recording AI usage:', usageData);
    
    // In real implementation:
    // - Insert into ai_usage_log table
    // - Update monthly usage counters
    // - Check if budget alerts need to be triggered
    
    return {
        usage_id: `usage_${Date.now()}`,
        recorded_at: new Date().toISOString()
    };
}

function estimateTokenUsage(aiResult) {
    // Rough estimation - replace with actual token counting
    const textLength = JSON.stringify(aiResult).length;
    return Math.ceil(textLength / 4); // ~4 chars per token
}

function calculateCost(aiResult) {
    const tokens = estimateTokenUsage(aiResult);
    const costPerToken = 0.00000153; // GPT-4o mini pricing
    return tokens * costPerToken;
}

async function saveGeneratedQuiz(quizData) {
    // Mock implementation - replace with actual database save
    console.log('Saving generated quiz:', quizData);
    return `quiz_${Date.now()}`;
}

async function getAIBudgetStatus(school_id) {
    // Mock implementation
    return {
        school_id,
        monthly_budget_usd: 500,
        current_usage_usd: 380,
        usage_percentage: 76,
        remaining_usd: 120,
        alert_threshold: 80,
        alerts_triggered: 0,
        last_alert: null,
        budget_reset_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
        usage_by_operation: {
            quiz_generation: { count: 45, cost_usd: 180 },
            lesson_outline: { count: 23, cost_usd: 120 },
            rubric_generation: { count: 12, cost_usd: 80 }
        }
    };
}

async function setAIBudget(budgetData) {
    // Mock implementation - replace with actual database update
    console.log('Setting AI budget:', budgetData);
    return true;
}

async function getAIUsageAnalytics(params) {
    // Mock implementation
    return {
        total_operations: 80,
        total_cost_usd: 380,
        avg_generation_time_ms: 2850,
        avg_oa_alignment_score: 0.96,
        operations_by_type: {
            quiz_generation: { count: 45, avg_time_ms: 2200, success_rate: 0.98 },
            lesson_outline: { count: 23, avg_time_ms: 3200, success_rate: 0.96 },
            rubric_generation: { count: 12, avg_time_ms: 1800, success_rate: 1.0 }
        },
        daily_usage: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            operations: Math.floor(Math.random() * 10),
            cost_usd: Math.random() * 20
        }))
    };
}

async function triggerBudgetAlert(school_id, budgetInfo) {
    // Mock implementation - implement notification system
    console.log(`Budget alert for school ${school_id}:`, budgetInfo);
    
    // In real implementation:
    // - Send email to sostenedor
    // - Create in-app notification
    // - Log alert in audit trail
}

module.exports = router; 
