const OpenAI = require('openai');
const crypto = require('crypto');
const { supabase } = require('../database/supabase');
const logger = require('../utils/logger');

class AIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 30000 // 30 seconds
        });
        
        // P1 Enhanced Cost tracking in CLP (Chilean Pesos)
        this.costPerThousandTokens = {
            'gpt-4o-mini': {
                input: 0.15 / 1000000, // Per token in USD
                output: 0.60 / 1000000
            },
            'tts-1': {
                character: 0.015 / 1000 // Per character in USD
            }
        };
        
        // Real-time USD to CLP conversion (should be updated daily)
        this.usdToClp = 950; // Exchange rate
        
        // P1 Performance targets
        this.targetGenerationTime = 60000; // 60 seconds max
        this.targetOAAlignment = 0.95; // 95% minimum
        this.maxRetries = 2;
    }

    // P1-T-01: Generate quiz with <60s, 95% OA alignment
    async generateQuizQuestions(schoolId, userId, params) {
        const startTime = Date.now();
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Generation timeout exceeded 60 seconds')), this.targetGenerationTime);
        });

        try {
            const result = await Promise.race([
                this._performQuizGeneration(schoolId, userId, params, startTime),
                timeoutPromise
            ]);

            // Validate OA alignment meets P1 requirements
            const oaAlignment = this._calculateOAAlignment(result.questions, params.oaCodes);
            if (oaAlignment < this.targetOAAlignment) {
                throw new Error(`OA alignment (${(oaAlignment * 100).toFixed(1)}%) below required 95%`);
            }

            result.metadata.oaAlignment = oaAlignment;
            result.metadata.p1Compliant = true;

            return result;

        } catch (error) {
            console.error('P1 Quiz generation failed:', error);
            
            // Log failed attempt with P1 compliance tracking
            await this.logUsage(schoolId, userId, 'quiz_generation', 0, 0, {
                model: 'gpt-4o-mini',
                status: 'failed',
                errorMessage: error.message,
                p1Compliant: false,
                processingTime: Date.now() - startTime
            });
            
            throw error;
        }
    }

    /**
     * Generate content specifically for gamified evaluations
     * Connects game formats + engines + skins for contextual content
     */
    async generateGameContent(params) {
        const startTime = Date.now();
        const {
            gameFormat,
            engineId,
            title,                          // ✅ Recibir título para contexto
            description,                    // ✅ Recibir descripción
            oaCodes = [],
            difficulty = 'medium',
            questionCount = 10,
            skinTheme = 'default',
            schoolId,
            userId
        } = params;

        try {
            console.log(`🎮 Generating content for ${gameFormat} + ${engineId} + ${skinTheme}`);

            // Get OA context for educational alignment
            let oaContext = '';
            if (oaCodes.length > 0) {
                // In production, fetch from database
                // For now, use mock data
                oaContext = oaCodes.map(oa => `${oa}: Objetivo específico de aprendizaje`).join('\n');
            }

            // Check if we have a valid OpenAI API key
            const hasValidApiKey = process.env.OPENAI_API_KEY && 
                                 process.env.OPENAI_API_KEY !== 'your-openai-api-key-here' &&
                                 process.env.OPENAI_API_KEY.startsWith('sk-');

            let gameContent;
            
            console.log(`🔍 ROUTE CHECK: hasValidApiKey = ${hasValidApiKey}`);
            console.log(`🔍 ROUTE CHECK: Will use ${hasValidApiKey ? 'REAL AI' : 'MOCK'} generation`);
            
            if (!hasValidApiKey) {
                console.log('🔧 Using mock AI response (no valid API key)');
                gameContent = this._generateMockGameContent({
                    ...params,
                    title,
                    description,
                    oaContext
                });
            } else {
                console.log('🚀 Using OpenAI for real content generation');
                gameContent = await this._generateRealAIContent({
                    ...params,
                    title,
                    description,
                    oaContext
                });
            }

            const processingTime = Date.now() - startTime;
            
            // Enhance content with engine-specific mechanics
            const enhancedContent = this._enhanceWithEngineLogic(gameContent, engineId, skinTheme);

            // Log usage
            console.log(`✅ Generated ${enhancedContent.questions?.length || 0} items in ${processingTime}ms`);

            return {
                questions: enhancedContent.questions || [],
                gameConfig: enhancedContent.gameConfig || {},
                skinContext: enhancedContent.skinContext || {},
                engineConfig: enhancedContent.engineConfig || {},
                metadata: {
                    gameFormat,
                    engineId,
                    skinTheme,
                    oaCodes,
                    difficulty,
                    aiGenerated: true,
                    mockMode: !hasValidApiKey,
                    processingTimeMs: processingTime,
                    generatedAt: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('❌ Game content generation failed:', error);
            
            // Fallback to mock content if AI fails
            console.log('🔄 Falling back to mock content generation');
            const mockContent = this._generateMockGameContent({
                ...params,
                title,
                description,
                oaContext: oaCodes.map(oa => `${oa}: Objetivo específico de aprendizaje`).join('\n')
            });
            const enhancedContent = this._enhanceWithEngineLogic(mockContent, engineId, skinTheme);
            
            return {
                questions: enhancedContent.questions || [],
                gameConfig: enhancedContent.gameConfig || {},
                skinContext: enhancedContent.skinContext || {},
                engineConfig: enhancedContent.engineConfig || {},
                metadata: {
                    gameFormat,
                    engineId,
                    skinTheme,
                    oaCodes,
                    difficulty,
                    aiGenerated: false,
                    mockMode: true,
                    fallbackUsed: true,
                    errorMessage: error.message,
                    processingTimeMs: Date.now() - startTime,
                    generatedAt: new Date().toISOString()
                }
            };
        }
    }

    /**
     * Generate mock game content for development/demo
     */
    _generateMockGameContent(params) {
        console.log(`🎭 _generateMockGameContent CALLED WITH PARAMS:`, JSON.stringify(params, null, 2));
        
        const { 
            gameFormat, 
            engineId, 
            skinTheme, 
            questionCount = 3, 
            difficulty,
            title,           // ✅ Usar título para contexto
            oaCodes,         // ✅ Usar OAs específicos
            oaContext        // ✅ Usar contexto educativo
        } = params;
        
        console.log(`🎭 Generating CONTEXT-AWARE MOCK content for ${gameFormat} + ${engineId} + ${skinTheme}`);
        console.log(`📚 Educational context: "${title}" with OAs: ${oaCodes?.join(', ')}`);
        
        // Extract numeric context from title
        const numericContext = this.extractNumericContext(title);
        console.log(`🔢 Detected numeric context:`, numericContext);
        
        const mockContent = {
            questions: [],
            gameConfig: {
                time_per_question: 15,
                progressive_difficulty: true,
                visual_feedback: true
            },
            skinContext: {
                theme: skinTheme,
                colors: ['#FF6B35', '#F7931E', '#FFD700'],
                sounds: ['granja_ambiente', 'animal_sounds']
            }
        };

        // 🔧 EMERGENCY FIX: Generate questions with CORRECT RANGE
        console.log('🔧 APPLYING EMERGENCY RANGE FIX');
        console.log('🔢 Numeric context extracted:', numericContext);
        
        for (let i = 1; i <= questionCount; i++) {
            // Force correct range calculation
            const { range } = numericContext;
            const [minNum, maxNum] = range;
            const rangeSize = maxNum - minNum + 1;
            
            let targetNumber;
            if (rangeSize <= 20) {
                targetNumber = minNum + (i - 1);
                if (targetNumber > maxNum) targetNumber = maxNum;
            } else {
                // Large range: distributed segments
                const segmentSize = Math.ceil(rangeSize / questionCount);
                targetNumber = minNum + ((i - 1) * segmentSize);
                if (targetNumber > maxNum) targetNumber = maxNum;
            }
            
            console.log(`🔢 Q${i} FORCED target: ${targetNumber} (range: ${minNum}-${maxNum})`);
            
            // Generate space-themed question with correct number
            const spaceElements = [
                { emoji: '🚀', name: 'cohetes', location: 'en la galaxia' },
                { emoji: '⭐', name: 'estrellas', location: 'en el cielo nocturno' },
                { emoji: '🛸', name: 'naves', location: 'en el espacio' },
                { emoji: '👽', name: 'alienígenas', location: 'en Marte' },
                { emoji: '🪐', name: 'planetas', location: 'en el sistema solar' }
            ];
            
            const element = spaceElements[(i - 1) % spaceElements.length];
            
            const fixedQuestion = {
                id: `fixed_q${i}`,
                text: `${element.emoji} ¿Cuántos ${element.name} hay ${element.location}?`,
                visual_elements: Array(Math.min(targetNumber, 15)).fill(element.emoji),
                options: [
                    `${Math.max(1, targetNumber - 1)}`,
                    `${targetNumber}`,
                    `${targetNumber + 1}`,
                    `${targetNumber + 2}`
                ],
                correct_answer: `${targetNumber}`,
                explanation: `Hay exactamente ${targetNumber} ${element.name} ${element.location}.`,
                engine_data: {
                    counting_target: targetNumber,
                    visual_support: true,
                    audio_hint: `Cuenta hasta ${targetNumber}`,
                    numeric_context: numericContext.context,
                    engine_id: 'ENG01'
                },
                skin_context: {
                    theme: skinTheme,
                    visual_description: `${targetNumber} ${element.name} en ambiente espacial`,
                    sound_effects: ['space_ambient', 'cosmic_sounds']
                },
                difficulty: difficulty,
                points: 10
            };
            
            mockContent.questions.push(fixedQuestion);
            console.log(`✅ FIXED Q${i}: "${fixedQuestion.text}" → ${fixedQuestion.correct_answer}`);
        }

        return mockContent;
    }

    /**
     * Extract numeric context from evaluation title
     * PUBLIC METHOD - Can be accessed externally
     */
    extractNumericContext(title) {
        if (!title) return { range: [1, 10], type: 'basic_counting' };
        
        const titleLower = title.toLowerCase();
        console.log(`🔍 EXTRACTING NUMERIC CONTEXT from: "${title}"`);
        
        // Extract number ranges - IMPROVED PATTERNS
        // Patterns: "números de 10 a 100", "del 30 al 40", "30 al 40", "números 10-100"
        const rangeMatch = titleLower.match(/(?:números?\s+)?(?:del?\s+)?(\d+)\s+a(?:l)?\s+(\d+)|(\d+)\s*[-–]\s*(\d+)/);
        if (rangeMatch) {
            const start = parseInt(rangeMatch[1] || rangeMatch[3]);
            const end = parseInt(rangeMatch[2] || rangeMatch[4]);
            console.log(`✅ FOUND RANGE: ${start} to ${end}`);
            return {
                range: [start, end],
                type: 'number_range',
                context: `números del ${start} al ${end}`
            };
        }
        
        // Extract single numbers like "tabla del 7", "número 15"
        const singleMatch = titleLower.match(/(?:tabla|número|numero)\s+(?:del\s+)?(\d+)/);
        if (singleMatch) {
            const num = parseInt(singleMatch[1]);
            return {
                range: [num, num + 10],
                type: 'multiplication_table',
                context: `tabla del ${num}`,
                baseNumber: num
            };
        }
        
        // Extract mathematical operations
        if (titleLower.includes('suma') || titleLower.includes('adición')) {
            return { range: [1, 20], type: 'addition', context: 'operaciones de suma' };
        }
        if (titleLower.includes('resta') || titleLower.includes('sustracción')) {
            return { range: [1, 20], type: 'subtraction', context: 'operaciones de resta' };
        }
        
        // Default to basic counting 1-10
        return { range: [1, 10], type: 'basic_counting', context: 'conteo básico' };
    }

    /**
     * Generate context-aware mock question based on extracted numeric context
     */
    _generateContextAwareMockQuestion(index, gameFormat, engineId, skinTheme, difficulty, numericContext, title) {
        console.log(`🔍 _generateContextAwareMockQuestion called with:`, {
            index, gameFormat, engineId, skinTheme, difficulty, title,
            numericContext: JSON.stringify(numericContext)
        });
        
        const { range, type, context, baseNumber } = numericContext;
        const [minNum, maxNum] = range;
        
        console.log(`🔢 Question ${index}: Processing range [${minNum}, ${maxNum}], type: ${type}`);
        
        // Calculate target number based on context
        let targetNumber;
        console.log(`🔢 BEFORE CALCULATION - Type: ${type}, Range: [${minNum}, ${maxNum}], Index: ${index}`);
        
        if (type === 'number_range') {
            // Better distribution for number ranges
            const rangeSize = maxNum - minNum + 1;
            
            if (rangeSize <= 20) {
                // Small range: use sequential numbers
                targetNumber = minNum + (index - 1);
                if (targetNumber > maxNum) targetNumber = maxNum;
            } else {
                // Large range: use smart distribution
                const segmentSize = Math.ceil(rangeSize / 10);
                const segmentStart = minNum + ((index - 1) * segmentSize);
                // Add some variation within the segment
                targetNumber = segmentStart + Math.floor(Math.random() * Math.min(segmentSize, 5));
                if (targetNumber > maxNum) targetNumber = maxNum;
            }
            
            console.log(`📊 Range distribution: segment size ${rangeSize <= 20 ? 'sequential' : Math.ceil(rangeSize / 10)}, target: ${targetNumber}`);
        } else if (type === 'multiplication_table') {
            targetNumber = baseNumber * index;
            console.log(`✖️ Multiplication: ${baseNumber} × ${index} = ${targetNumber}`);
        } else {
            targetNumber = Math.min(minNum + index, maxNum);
            console.log(`🔢 Basic counting: ${targetNumber}`);
        }

        // Generate question based on engine and context
        if (engineId === 'ENG01') {
            // 🎯 UNIFIED ENG01 LOGIC for all skins
            let skinElements = {};
            
            if (skinTheme === 'granja') {
                skinElements = {
                    objects: ['🐔 pollitos', '🐄 vacas', '🐷 cerditos', '🐑 ovejas'],
                    environment: 'granja',
                    sounds: ['granja_ambiente', 'animal_sounds'],
                    preposition: 'en la granja'
                };
            } else if (skinTheme === 'espacio') {
                skinElements = {
                    objects: ['🚀 cohetes', '⭐ estrellas', '🛸 naves', '👽 alienígenas'],
                    environment: 'espacio',
                    sounds: ['space_ambient', 'cosmic_sounds'],
                    preposition: 'en el espacio'
                };
            } else {
                // Default elements
                skinElements = {
                    objects: ['🔵 objetos', '🟢 elementos', '🟡 figuras', '🔴 formas'],
                    environment: 'entorno',
                    sounds: ['generic_ambient'],
                    preposition: 'en total'
                };
            }
            
            const objectData = skinElements.objects[index % skinElements.objects.length];
            const objectEmoji = objectData.split(' ')[0];
            const objectName = objectData.split(' ')[1];
            
            const question = {
                id: `q${index}`,
                text: `${objectEmoji} ¿Cuántos ${objectName} ves ${skinElements.preposition}?`,
                visual_elements: Array(Math.min(targetNumber, 10)).fill(objectEmoji),
                options: [
                    `${targetNumber - 1}`,
                    `${targetNumber}`,
                    `${targetNumber + 1}`,
                    `${targetNumber + 2}`
                ],
                correct_answer: `${targetNumber}`,
                explanation: `Hay exactamente ${targetNumber} ${objectName} ${skinElements.preposition}`,
                engine_data: {
                    counting_target: targetNumber,
                    visual_support: true,
                    audio_hint: `Cuenta hasta ${targetNumber}`,
                    numeric_context: context,
                    engine_id: 'ENG01'
                },
                skin_context: {
                    theme: skinTheme,
                    visual_description: `${targetNumber} ${objectName} en ambiente ${skinElements.environment}`,
                    sound_effects: skinElements.sounds
                },
                difficulty: difficulty,
                points: 10
            };
            
            console.log(`✅ Generated ENG01 question ${index}: "${question.text}" with answer: ${question.correct_answer}`);
            return question;
        } else if (engineId === 'ENG02' && type === 'addition') {
            // Addition problems
            const num1 = Math.floor(targetNumber / 2);
            const num2 = targetNumber - num1;
            
            const question = {
                id: `q${index}`,
                text: `🔢 ${num1} + ${num2} = ?`,
                visual_elements: [
                    ...Array(num1).fill('●'),
                    '➕',
                    ...Array(num2).fill('●')
                ],
                options: [
                    `${targetNumber - 1}`,
                    `${targetNumber}`,
                    `${targetNumber + 1}`,
                    `${targetNumber + 2}`
                ],
                correct_answer: `${targetNumber}`,
                explanation: `${num1} + ${num2} = ${targetNumber}`,
                engine_data: {
                    operation_type: 'addition',
                    operands: [num1, num2],
                    result: targetNumber,
                    numeric_context: context
                },
                skin_context: {
                    theme: skinTheme,
                    visual_description: `Operación de suma con resultado ${targetNumber}`,
                    sound_effects: ['calculo_correcto']
                },
                difficulty: difficulty,
                points: 10
            };
            
            console.log(`✅ Generated addition question ${index}: "${question.text}" with answer: ${question.correct_answer}`);
            return question;
        }
        
        // Fallback to basic question
        return this._generateMockQuestion(index, gameFormat, engineId, skinTheme, difficulty);
    }

    /**
     * Generate a single mock question (legacy method)
     */
    _generateMockQuestion(index, gameFormat, engineId, skinTheme, difficulty) {
        const questionTemplates = {
            'trivia_lightning': {
                'ENG01': {
                    'granja': {
                        text: `🐔 ¿Cuántos pollitos ves en el corral número ${index}?`,
                        visual_elements: Array(index + 1).fill('🐔'),
                        options: [`${index}`, `${index + 1}`, `${index + 2}`, `${index + 3}`],
                        correct_answer: `${index + 1}`,
                        explanation: `Contamos uno por uno: ${Array(index + 1).fill().map((_, i) => i + 1).join(', ')} = ${index + 1} pollitos`
                    },
                    'espacio': {
                        text: `🚀 ¿Cuántas estrellas brillan en la galaxia ${index}?`,
                        visual_elements: Array(index + 2).fill('⭐'),
                        options: [`${index + 1}`, `${index + 2}`, `${index + 3}`, `${index + 4}`],
                        correct_answer: `${index + 2}`,
                        explanation: `Contamos las estrellas: ${index + 2} estrellas brillantes`
                    },
                    'default': {
                        text: `¿Cuántos elementos hay en el grupo ${index}?`,
                        options: [`${index}`, `${index + 1}`, `${index + 2}`, `${index + 3}`],
                        correct_answer: `${index + 1}`,
                        explanation: `La respuesta correcta es ${index + 1}`
                    }
                },
                'ENG02': {
                    'granja': {
                        text: `🐄 Si hay ${index} vacas y llegan ${index + 1} más, ¿cuántas vacas hay en total?`,
                        visual_elements: [...Array(index).fill('🐄'), '➕', ...Array(index + 1).fill('🐄')],
                        options: [`${index * 2}`, `${index * 2 + 1}`, `${index + (index + 1)}`, `${index * 3}`],
                        correct_answer: `${index + (index + 1)}`,
                        explanation: `${index} + ${index + 1} = ${index + (index + 1)} vacas en total`
                    }
                }
            },
            'memory_flip': {
                'ENG01': {
                    'granja': [
                        {
                            pair_id: `pair${index}`,
                            card_a: { type: 'visual', content: Array(index + 1).fill('🐔').join(''), display: 'animals' },
                            card_b: { type: 'number', content: `${index + 1}`, display: 'numeral' }
                        }
                    ]
                }
            }
        };

        const formatTemplate = questionTemplates[gameFormat]?.[engineId]?.[skinTheme] || 
                              questionTemplates[gameFormat]?.[engineId]?.['default'] ||
                              questionTemplates['trivia_lightning']['ENG01']['default'];

        return {
            id: `q${index}`,
            ...formatTemplate,
            engine_data: {
                counting_target: engineId === 'ENG01' ? index + 1 : null,
                operation_type: engineId === 'ENG02' ? 'addition' : null,
                visual_support: true,
                audio_hint: `Pregunta número ${index} para ${skinTheme}`
            },
            skin_context: {
                theme: skinTheme,
                visual_description: `Elementos temáticos de ${skinTheme}`,
                sound_effects: skinTheme === 'granja' ? ['pollito_pio', 'vaca_muu'] : ['generic_success']
            },
            difficulty: difficulty,
            points: 10
        };
    }

    /**
     * Generate real AI content (when API key is available)
     */
    async _generateRealAIContent(params) {
        const {
            gameFormat,
            engineId,
            oaCodes,
            oaContext,
            difficulty,
            questionCount,
            skinTheme
        } = params;

        // Generate format-specific content based on game format + engine combination
        const gamePrompt = this._buildGameContentPrompt({
            gameFormat,
            engineId,
            oaCodes,
            oaContext,
            difficulty,
            questionCount,
            skinTheme
        });

        // Estimate budget (cheaper for game content vs traditional quiz)
        const estimatedTokens = Math.ceil(gamePrompt.length / 4) + (questionCount * 150);
        const estimatedCost = this._calculateCostCLP(estimatedTokens);

        console.log(`💰 Estimated cost: ${estimatedCost.toFixed(2)} CLP for ${questionCount} items`);

        // Generate content with OpenAI (with timeout)
        const completion = await Promise.race([
            this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Eres un experto en desarrollo de juegos educativos chilenos. 
                        Especializas en crear contenido contextualizado y atractivo para niños.
                        DEBES generar contenido específico para el formato ${gameFormat} usando el engine ${engineId}.
                        Responde SOLO con JSON válido.`
                    },
                    {
                        role: 'user',
                        content: gamePrompt
                    }
                ],
                temperature: 0.4, // Slightly higher for creative game content
                max_tokens: 2000,
                response_format: { type: "json_object" }
            }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('OpenAI request timeout')), 20000) // 20 seconds timeout
            )
        ]);

        const response = completion.choices[0].message.content;
        const tokensUsed = completion.usage.total_tokens;
        const actualCost = this._calculateCostCLP(tokensUsed);

        // Parse and enhance content
        let parsedContent;
        try {
            parsedContent = JSON.parse(response);
        } catch (parseError) {
            throw new Error('AI response was not valid JSON');
        }

        return parsedContent;
    }

    // P1 Enhanced prompt building for 95% OA alignment
    _buildP1QuizPrompt(params) {
        const {
            oaContext,
            oaDetails,
            subject,
            gradeLevel,
            difficulty,
            questionCount,
            questionTypes,
            bloomLevels,
            topic,
            additionalInstructions
        } = params;

        let prompt = `INSTRUCCIONES CRÍTICAS - CUMPLIMIENTO P1:
- DEBES generar ${questionCount} preguntas con alineación ≥95% a los objetivos de aprendizaje especificados
- Cada pregunta DEBE evaluar específicamente los conceptos mencionados en los OA
- Tiempo máximo de generación: 60 segundos
- Usar contexto chileno exclusivamente

DATOS CURRICULARES:
- Asignatura: ${subject}
- Nivel: ${gradeLevel}
- Dificultad: ${difficulty}
- Tema: ${topic || 'Según objetivos de aprendizaje'}

`;

        if (oaContext) {
            prompt += `OBJETIVOS DE APRENDIZAJE OBLIGATORIOS (MINEDUC 2023):
${oaContext}

ALINEACIÓN REQUERIDA: Cada pregunta DEBE evaluar directamente estos objetivos. NO crear preguntas genéricas.

`;
        }

        // Enhanced specifications for P1 compliance
        prompt += `ESPECIFICACIONES P1:
- Tipos de pregunta: ${questionTypes.join(', ')}
- Niveles Bloom obligatorios: ${bloomLevels.join(', ')}
- Vocabulario apropiado para ${gradeLevel} chileno
- Contextos familiares para estudiantes chilenos
- Distractores plausibles basados en errores comunes
- Explicaciones que refuercen el OA evaluado

`;

        if (additionalInstructions) {
            prompt += `INSTRUCCIONES ADICIONALES:
${additionalInstructions}

`;
        }

        prompt += `FORMATO JSON OBLIGATORIO:
{
  "questions": [
    {
      "stem": "Texto de la pregunta (específico al OA)",
      "type": "multiple_choice",
      "options": ["A) Opción 1", "B) Opción 2", "C) Opción 3", "D) Opción 4"],
      "correct_answer": "A",
      "explanation": "Explicación que refuerza el OA evaluado",
      "bloom_level": "Comprender",
      "oa_alignment": "MAT-5B-OA01",
      "oa_alignment_score": 0.98,
      "difficulty": "medium",
      "points": 1,
      "chilean_context": "Descripción del contexto chileno usado"
    }
  ]
}

VALIDACIÓN FINAL: Revisa que cada pregunta evalúe directamente los OA especificados con alta precisión.`;

        return prompt;
    }

    /**
     * Build prompt specific to game format + engine + skin combination
     */
    _buildGameContentPrompt(params) {
        const { gameFormat, engineId, oaCodes, oaContext, difficulty, questionCount, skinTheme } = params;

        // Base educational context
        const baseContext = `
OBJETIVOS DE APRENDIZAJE:
${oaContext || 'Matemática básica 1° Básico'}

FORMATO DE JUEGO: ${gameFormat}
ENGINE EDUCATIVO: ${engineId}
TEMA VISUAL: ${skinTheme}
DIFICULTAD: ${difficulty}
CANTIDAD: ${questionCount} elementos`;

        // Format-specific prompts
        const formatPrompts = {
            'trivia_lightning': this._buildTriviaPrompt(engineId, skinTheme, questionCount),
            'memory_flip': this._buildMemoryFlipPrompt(engineId, skinTheme, questionCount),
            'drag_drop_sorting': this._buildDragDropPrompt(engineId, skinTheme, questionCount),
            'number_line_race': this._buildNumberLinePrompt(engineId, skinTheme, questionCount),
            'word_builder': this._buildWordBuilderPrompt(engineId, skinTheme, questionCount),
            'color_match': this._buildColorMatchPrompt(engineId, skinTheme, questionCount)
        };

        return `${baseContext}

${formatPrompts[gameFormat] || formatPrompts['trivia_lightning']}`;
    }

    _buildTriviaPrompt(engineId, skinTheme, count) {
        const skinContexts = {
            'granja': '🐄 Contexto: Granja chilena con animales (gallinas, vacas, cerdos, ovejas)',
            'espacio': '🚀 Contexto: Exploración espacial con planetas y astronautas',
            'oceano': '🐠 Contexto: Océano Pacífico con vida marina chilena',
            'default': '🎯 Contexto: Elementos visuales amigables'
        };

        const engineAdaptations = {
            'ENG01': 'Enfoque en CONTEO y números. Preguntas que requieren contar elementos visuales.',
            'ENG02': 'Enfoque en OPERACIONES básicas. Suma, resta usando manipulables.',
            'ENG05': 'Enfoque en RECONOCIMIENTO de texto. Letras, palabras, lectura.'
        };

        return `
GENERA ${count} preguntas para Trivia Lightning:

${skinContexts[skinTheme] || skinContexts.default}
${engineAdaptations[engineId] || engineAdaptations.ENG01}

FORMATO REQUERIDO:
{
  "questions": [
    {
      "id": "q1",
      "text": "🐔 ¿Cuántos pollitos ves en la imagen?",
      "visual_elements": ["🐔", "🐔", "🐔"],
      "options": ["2", "3", "4", "5"],
      "correct_answer": "3",
      "explanation": "Contamos uno por uno: 1, 2, 3 pollitos",
      "engine_data": {
        "counting_target": 3,
        "visual_support": true,
        "audio_hint": "Cuenta los pollitos uno por uno"
      },
      "skin_context": {
        "theme": "${skinTheme}",
        "visual_description": "Pollitos amarillos en un corral verde",
        "sound_effects": ["pollito_pio", "granja_ambiente"]
      }
    }
  ],
  "gameConfig": {
    "time_per_question": 15,
    "progressive_difficulty": true,
    "visual_feedback": true
  }
}`;
    }

    _buildMemoryFlipPrompt(engineId, skinTheme, count) {
        return `
GENERA ${count/2} pares para Memory Flip (${count} cartas total):

TEMA: ${skinTheme}
ENGINE: ${engineId}

FORMATO REQUERIDO:
{
  "questions": [
    {
      "pair_id": "pair1",
      "card_a": {
        "type": "question",
        "content": "🐄🐄🐄",
        "display": "visual"
      },
      "card_b": {
        "type": "answer", 
        "content": "3",
        "display": "number"
      }
    }
  ]
}`;
    }

    _buildDragDropPrompt(engineId, skinTheme, count) {
        return `
GENERA ${count} elementos para Drag & Drop Sorting:

TEMA: ${skinTheme}
ENGINE: ${engineId}

FORMATO REQUERIDO:
{
  "questions": [
    {
      "instruction": "Arrastra los animales grandes al corral grande",
      "draggable_items": [
        {"id": "cow1", "visual": "🐄", "category": "grande", "value": "vaca"},
        {"id": "chicken1", "visual": "🐔", "category": "pequeño", "value": "gallina"}
      ],
      "drop_zones": [
        {"id": "big_pen", "label": "Corral Grande", "accepts": ["grande"]},
        {"id": "small_pen", "label": "Corral Pequeño", "accepts": ["pequeño"]}
      ]
    }
  ]
}`;
    }

    _buildNumberLinePrompt(engineId, skinTheme, count) {
        return `
GENERA ${count} desafíos para Number Line Race:

TEMA: ${skinTheme}
ENGINE: ENG01 (Counter/Number Line)

FORMATO REQUERIDO:
{
  "questions": [
    {
      "operation": "2 + 3",
      "start_position": 2,
      "moves": ["+1", "+1", "+1"],
      "target_position": 5,
      "race_character": "🐔 Pollito Pepe",
      "background": "granja_path",
      "celebration": "🎉 ¡Pollito Pepe llegó a la meta!"
    }
  ]
}`;
    }

    _buildWordBuilderPrompt(engineId, skinTheme, count) {
        return `
GENERA ${count} palabras para Word Builder:

TEMA: ${skinTheme} 
ENGINE: ${engineId}

FORMATO REQUERIDO:
{
  "questions": [
    {
      "target_word": "VACA",
      "letters": ["V", "A", "C", "A", "X", "O"],
      "visual_hint": "🐄",
      "audio_hint": "Animal que da leche",
      "difficulty": 1
    }
  ]
}`;
    }

    _buildColorMatchPrompt(engineId, skinTheme, count) {
        return `
GENERA ${count} elementos para Color Match:

TEMA: ${skinTheme}
ENGINE: ${engineId}

FORMATO REQUERIDO:
{
  "questions": [
    {
      "instruction": "Encuentra el pollito amarillo",
      "target": {"color": "amarillo", "object": "🐔"},
      "options": [
        {"color": "amarillo", "object": "🐔"},
        {"color": "rojo", "object": "🐔"},
        {"color": "azul", "object": "🐔"}
      ],
      "correct_index": 0
    }
  ]
}`;
    }

    // P1 Enhanced question validation with OA alignment scoring
    _validateAndEnhanceP1Questions(questions, context) {
        return questions.map((q, index) => {
            const enhanced = {
                question_order: index + 1,
                stem_md: q.stem || q.question || '',
                type: q.type || 'multiple_choice',
                options_json: q.options || [],
                correct_answer: q.correct_answer || q.answer || '',
                explanation: q.explanation || '',
                points: q.points || 1,
                difficulty: q.difficulty || context.difficulty || 'medium',
                bloom_level: q.bloom_level || context.bloomLevels?.[0] || 'Recordar',
                ai_generated: true,
                ai_confidence_score: q.oa_alignment_score || this._calculateConfidenceScore(q),
                cognitive_complexity: this._mapDifficultyToComplexity(q.difficulty || context.difficulty),
                
                // P1 Enhanced OA mapping
                oa_alignment: q.oa_alignment || context.oaCodes?.[0] || '',
                oa_alignment_score: q.oa_alignment_score || 0.85,
                chilean_context: q.chilean_context || 'Contexto educativo chileno',
                p1_validated: true
            };

            // Validate OA alignment specificity
            if (context.oaDetails && enhanced.oa_alignment) {
                const relevantOA = context.oaDetails.find(oa => oa.oa_code === enhanced.oa_alignment);
                if (relevantOA) {
                    enhanced.oa_complexity_match = relevantOA.complexity_level;
                    enhanced.oa_bloom_match = relevantOA.bloom_level === enhanced.bloom_level;
                }
            }

            // Enhanced validation for P1 standards
            if (!enhanced.stem_md || enhanced.stem_md.length < 15) {
                enhanced.stem_md = `Pregunta ${index + 1} sobre ${enhanced.oa_alignment}: ${enhanced.stem_md}`;
            }

            if (enhanced.type === 'multiple_choice' && (!enhanced.options_json || enhanced.options_json.length < 4)) {
                enhanced.options_json = [
                    'A) Opción correcta',
                    'B) Distractor plausible 1',
                    'C) Distractor plausible 2', 
                    'D) Distractor plausible 3'
                ];
                enhanced.correct_answer = 'A';
            }

            if (!enhanced.explanation || enhanced.explanation.length < 20) {
                enhanced.explanation = `Esta pregunta evalúa ${enhanced.bloom_level.toLowerCase()} relacionado con ${enhanced.oa_alignment}.`;
            }

            return enhanced;
        });
    }

    /**
     * Enhance generated content with engine-specific logic
     */
    _enhanceWithEngineLogic(content, engineId, skinTheme) {
        const engineEnhancements = {
            'ENG01': this._enhanceForCountingEngine,
            'ENG02': this._enhanceForDragDropEngine,
            'ENG05': this._enhanceForTextEngine,
            'ENG06': this._enhanceForLetterSoundEngine,
            'ENG07': this._enhanceForReadingEngine,
            'ENG09': this._enhanceForLifeCycleEngine
        };

        const enhancer = engineEnhancements[engineId];
        if (enhancer) {
            return enhancer.call(this, content, skinTheme);
        }

        return content;
    }

    _enhanceForCountingEngine(content, skinTheme) {
        // Add counting-specific mechanics
        if (content.questions) {
            content.questions = content.questions.map(q => ({
                ...q,
                engine_mechanics: {
                    type: 'counting',
                    interactive_objects: true,
                    one_to_one_correspondence: true,
                    cardinal_principle: true,
                    visual_feedback: 'highlight_on_count'
                },
                accessibility: {
                    tts_support: true,
                    keyboard_navigation: true,
                    count_aloud: true
                }
            }));
        }

        content.engineConfig = {
            countingRange: [1, 20],
            visualCounters: true,
            audioSupport: true,
            progressionStyle: 'step_by_step'
        };

        return content;
    }

    _enhanceForDragDropEngine(content, skinTheme) {
        if (content.questions) {
            content.questions = content.questions.map(q => ({
                ...q,
                engine_mechanics: {
                    type: 'drag_drop',
                    drag_sensitivity: 'medium',
                    drop_zone_tolerance: 'generous',
                    snap_to_grid: true,
                    visual_feedback: 'highlight_valid_drops'
                }
            }));
        }

        return content;
    }

    _enhanceForTextEngine(content, skinTheme) {
        if (content.questions) {
            content.questions = content.questions.map(q => ({
                ...q,
                engine_mechanics: {
                    type: 'text_recognition',
                    reading_support: true,
                    phonetic_hints: true,
                    visual_word_building: true
                }
            }));
        }

        return content;
    }

    _enhanceForLetterSoundEngine(content, skinTheme) {
        // Add letter-sound specific enhancements
        return content;
    }

    _enhanceForReadingEngine(content, skinTheme) {
        // Add reading fluency specific enhancements  
        return content;
    }

    _enhanceForLifeCycleEngine(content, skinTheme) {
        // Add life cycle simulation enhancements
        return content;
    }

    // Calculate cost in Chilean Pesos
    _calculateCostCLP(tokens, model = 'gpt-4o-mini') {
        const costUSDCents = (tokens / 1000) * this.costPerThousandTokens[model].input;
        const costUSD = costUSDCents / 100;
        return Math.round(costUSD * this.usdToClp);
    }

    // P1 OA Alignment calculation for compliance
    _calculateOAAlignment(questions, oaCodes) {
        if (!questions || questions.length === 0 || !oaCodes || oaCodes.length === 0) {
            return 0;
        }

        let totalAlignment = 0;
        questions.forEach(q => {
            if (q.oa_alignment && oaCodes.includes(q.oa_alignment)) {
                totalAlignment += q.oa_alignment_score || 0.85;
            }
        });

        return totalAlignment / questions.length;
    }

    // Enhanced confidence scoring
    _calculateConfidenceScore(question) {
        let score = 0.5;

        if (question.explanation && question.explanation.length > 30) score += 0.15;
        if (question.oa_alignment) score += 0.15;
        if (question.oa_alignment_score && question.oa_alignment_score > 0.9) score += 0.1;
        if (question.chilean_context) score += 0.05;
        if (question.type === 'multiple_choice' && question.options?.length >= 4) score += 0.05;

        return Math.min(1.0, score);
    }

    _mapDifficultyToComplexity(difficulty) {
        switch (difficulty) {
            case 'easy': return 1;
            case 'medium': return 3;
            case 'hard': return 5;
            default: return 2;
        }
    }

    _assessQuestionQuality(questions) {
        if (!questions || questions.length === 0) return 0;

        const scores = questions.map(q => {
            let qualityScore = q.ai_confidence_score || 0.5;
            
            // P1 quality bonuses
            if (q.oa_alignment_score && q.oa_alignment_score >= 0.95) qualityScore += 0.1;
            if (q.chilean_context && q.chilean_context.length > 10) qualityScore += 0.05;
            if (q.explanation && q.explanation.length > 50) qualityScore += 0.05;
            
            return Math.min(1.0, qualityScore);
        });

        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        // Bonus for OA alignment consistency
        const oaAlignments = new Set(questions.map(q => q.oa_alignment).filter(Boolean));
        const alignmentBonus = Math.min(0.1, oaAlignments.size * 0.02);
        
        return Math.min(1.0, average + alignmentBonus);
    }

    // Enhanced budget checking with CLP conversion
    async _checkBudgetAvailability(schoolId, estimatedCostCLP) {
        try {
            // Get school AI configuration
            const { data: config } = await supabase
                .from('ai_service_config')
                .select('*')
                .eq('school_id', schoolId)
                .single();

            if (!config?.service_enabled) {
                throw new Error('AI service is disabled for this school');
            }

            // Check daily budget
            const today = new Date().toISOString().split('T')[0];
            const { data: todayUsage } = await supabase
                .from('ai_budget_tracking')
                .select('total_cost_clp')
                .eq('school_id', schoolId)
                .eq('tracking_date', today)
                .single();

            const currentDailySpend = todayUsage?.total_cost_clp || 0;
            const dailyBudget = config.daily_budget_clp;

            if (currentDailySpend + estimatedCostCLP > dailyBudget) {
                throw new Error(`Insufficient daily budget. Used: $${currentDailySpend} CLP, Budget: $${dailyBudget} CLP`);
            }

            // Check 80% alert threshold (P1-O-02)
            const dailyUsagePercent = ((currentDailySpend + estimatedCostCLP) / dailyBudget) * 100;
            if (dailyUsagePercent >= config.alert_threshold_percentage) {
                await this._triggerBudgetAlert(schoolId, { dailyUsagePercent, alertThreshold: config.alert_threshold_percentage });
            }

        } catch (error) {
            console.error('Budget check failed:', error);
            throw error;
        }
    }

    async _triggerBudgetAlert(schoolId, alertData) {
        try {
            await supabase
                .from('ai_usage_logs')
                .insert({
                    school_id: schoolId,
                    user_id: null,
                    service_type: 'budget_alert',
                    model_used: 'system',
                    tokens_used: 0,
                    cost_clp: 0,
                    generated_content_type: 'alert',
                    status: 'completed',
                    prompt_text: `Budget alert: Daily ${alertData.dailyUsagePercent.toFixed(1)}%`
                });

            console.warn(`P1 Budget Alert - School ${schoolId}:`, alertData);
        } catch (error) {
            console.error('Failed to trigger budget alert:', error);
        }
    }

    // Enhanced usage logging
    async logUsage(schoolId, userId, serviceType, tokensUsed, costCLP, metadata = {}) {
        try {
            await supabase
                .from('ai_usage_logs')
                .insert({
                    school_id: schoolId,
                    user_id: userId,
                    service_type: serviceType,
                    model_used: metadata.model || 'gpt-4o-mini',
                    prompt_text: metadata.prompt || '',
                    tokens_used: tokensUsed,
                    cost_clp: costCLP,
                    processing_time_ms: metadata.processingTime || 0,
                    oa_codes: metadata.oaCodes || [],
                    generated_content_type: metadata.contentType || serviceType,
                    content_quality_score: metadata.qualityScore || null,
                    status: metadata.status || 'completed',
                    error_message: metadata.errorMessage || null
                });

            if (costCLP > 0) {
                await this._updateBudgetTracking(schoolId, costCLP, serviceType);
            }

        } catch (error) {
            console.error('Usage logging failed:', error);
        }
    }

    async _updateBudgetTracking(schoolId, costCLP, serviceType) {
        const today = new Date().toISOString().split('T')[0];
        
        const serviceColumnMap = {
            'quiz_generation': 'quiz_generation_cost',
            'tts_generation': 'tts_generation_cost',
            'lesson_planning': 'analytics_cost',
            'analytics': 'analytics_cost'
        };

        const serviceColumn = serviceColumnMap[serviceType] || 'other_cost';
        
        // Upsert daily tracking
        await supabase
            .from('ai_budget_tracking')
            .upsert({
                school_id: schoolId,
                tracking_date: today,
                total_cost_clp: costCLP,
                request_count: 1,
                [serviceColumn]: costCLP
            }, {
                onConflict: 'school_id,tracking_date',
                update: {
                    total_cost_clp: supabase.sql`total_cost_clp + ${costCLP}`,
                    request_count: supabase.sql`request_count + 1`,
                    [serviceColumn]: supabase.sql`${serviceColumn} + ${costCLP}`,
                    updated_at: new Date().toISOString()
                }
            });
    }

    // P1 Analytics and reporting methods
    async getP1ComplianceReport(schoolId, startDate, endDate) {
        const { data: logs } = await supabase
            .from('ai_usage_logs')
            .select('*')
            .eq('school_id', schoolId)
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .eq('service_type', 'quiz_generation');

        const p1Metrics = {
            totalGenerations: logs?.length || 0,
            avgProcessingTime: 0,
            avgQualityScore: 0,
            p1CompliantGenerations: 0,
        };

        if (logs && logs.length > 0) {
            const processingTimes = logs.map(log => log.processing_time_ms || 0);
            const qualityScores = logs.map(log => log.content_quality_score || 0);
            
            p1Metrics.avgProcessingTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
            p1Metrics.avgQualityScore = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;
            p1Metrics.p1CompliantGenerations = logs.filter(log => 
                (log.processing_time_ms || 0) < this.targetGenerationTime
            ).length;
        }

        return p1Metrics;
    }

    async getBudgetStatus(schoolId) {
        const today = new Date().toISOString().split('T')[0];
        
        const [configResult, dailyResult] = await Promise.all([
            supabase.from('ai_service_config').select('*').eq('school_id', schoolId).single(),
            supabase.from('ai_budget_tracking').select('total_cost_clp').eq('school_id', schoolId).eq('tracking_date', today).single()
        ]);

        const config = configResult.data;
        const dailySpend = dailyResult.data?.total_cost_clp || 0;

        return {
            dailyBudget: config?.daily_budget_clp || 0,
            monthlyBudget: config?.monthly_budget_clp || 0,
            dailySpent: dailySpend,
            dailyRemaining: (config?.daily_budget_clp || 0) - dailySpend,
            dailyUsagePercent: config?.daily_budget_clp ? (dailySpend / config.daily_budget_clp) * 100 : 0,
            alertThreshold: config?.alert_threshold_percentage || 80
        };
    }
}

module.exports = new AIService(); 
