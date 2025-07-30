'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  LightBulbIcon,
  PlayIcon,
  DocumentTextIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

interface LearningObjective {
  oa_id: string;
  oa_code: string;
  oa_desc: string;
  oa_short_desc?: string;
  bloom_level: string;
  complexity_level: number;
  estimated_hours: number;
  ministerial_priority: 'high' | 'normal' | 'low';
}

interface AIQuizGeneratorProps {
  classId: string;
  gradeCode: string;
  subjectId: string;
  onQuizGenerated?: (quizId: string) => void;
  onClose?: () => void;
}

interface BudgetStatus {
  canProceed: boolean;
  remaining: number;
  usagePercentage: number;
  currentSpending: number;
  monthlyLimit: number;
}

export default function AIQuizGenerator({ 
  classId, 
  gradeCode, 
  subjectId, 
  onQuizGenerated, 
  onClose 
}: AIQuizGeneratorProps) {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [objectives, setObjectives] = useState<LearningObjective[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  
  // Generation options
  const [options, setOptions] = useState({
    questionCount: 10,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    timeLimit: 30,
    includeTTS: true,
    gameMode: false
  });

  // Results
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [generationTime, setGenerationTime] = useState(0);

  useEffect(() => {
    loadLearningObjectives();
    checkBudgetStatus();
  }, [gradeCode, subjectId]);

  const loadLearningObjectives = async () => {
    try {
      const response = await fetch(`/api/curriculum/oa?grade=${gradeCode}&subject=${subjectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setObjectives(data.learning_objectives || []);
      }
    } catch (error) {
      console.error('Error loading objectives:', error);
      toast.error('Error al cargar objetivos de aprendizaje');
    }
  };

  const checkBudgetStatus = async () => {
    try {
      const response = await fetch('/api/ai/budget/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setBudgetStatus(data.data.current_usage);
      }
    } catch (error) {
      console.error('Error checking budget:', error);
    }
  };

  const handleObjectiveToggle = (oaId: string) => {
    setSelectedObjectives(prev => 
      prev.includes(oaId) 
        ? prev.filter(id => id !== oaId)
        : [...prev, oaId].slice(0, 5) // Max 5 objectives
    );
  };

  const selectHighPriorityObjectives = () => {
    const highPriority = objectives
      .filter(oa => oa.ministerial_priority === 'high')
      .slice(0, 5)
      .map(oa => oa.oa_id);
    setSelectedObjectives(highPriority);
  };

  const generateQuiz = async () => {
    if (selectedObjectives.length === 0) {
      toast.error('Selecciona al menos un objetivo de aprendizaje');
      return;
    }

    if (!budgetStatus?.canProceed) {
      toast.error('Presupuesto de IA agotado para este mes');
      return;
    }

    setGenerating(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          grade_code: gradeCode,
          subject_id: subjectId,
          oa_ids: selectedObjectives,
          question_count: options.questionCount,
          difficulty: options.difficulty,
          time_limit: options.timeLimit,
          include_tts: options.includeTTS
        })
      });

      const data = await response.json();

      if (data.success) {
        const endTime = Date.now();
        setGenerationTime(endTime - startTime);
        setGenerationResult(data.data);
        setStep(3);
        
        toast.success(`🎯 Quiz generado exitosamente en ${(data.data.processing_time_ms / 1000).toFixed(1)}s`);
        
        // Update budget status
        await checkBudgetStatus();
        
        if (onQuizGenerated) {
          onQuizGenerated(data.data.quiz_id);
        }
      } else {
        throw new Error(data.error || 'Error al generar quiz');
      }

    } catch (error: any) {
      console.error('Quiz generation error:', error);
      
      if (error.message.includes('Budget exceeded')) {
        toast.error('💸 Presupuesto de IA agotado para este mes');
      } else if (error.message.includes('OA not found')) {
        toast.error('📚 Objetivos de aprendizaje no encontrados');
      } else {
        toast.error('❌ Error al generar quiz con IA. Intenta nuevamente.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const getSelectedObjectivesDetails = () => {
    return objectives.filter(oa => selectedObjectives.includes(oa.oa_id));
  };

  const estimatedCost = () => {
    // Rough estimate: 10 questions ≈ 3000 tokens ≈ $3 CLP per question
    return options.questionCount * 3;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <SparklesIcon className="h-8 w-8 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-purple-900">
              Generador de Quiz con IA
            </h3>
            <p className="text-sm text-purple-700">
              P1-T-01: Genera quiz alineado al 95%+ con OA MINEDUC en menos de 60 segundos
            </p>
          </div>
        </div>

        {/* Budget Status */}
        {budgetStatus && (
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Presupuesto IA</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  ${budgetStatus.remaining.toLocaleString()} CLP
                </div>
                <div className="text-xs text-gray-500">
                  {budgetStatus.usagePercentage.toFixed(1)}% usado este mes
                </div>
              </div>
            </div>
            
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  budgetStatus.usagePercentage >= 95 ? 'bg-red-500' :
                  budgetStatus.usagePercentage >= 80 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetStatus.usagePercentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Learning Objectives Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">
            Selecciona Objetivos de Aprendizaje
          </h4>
          <Button
            onClick={selectHighPriorityObjectives}
            variant="outline"
            size="sm"
          >
            <AcademicCapIcon className="h-4 w-4 mr-1" />
            Seleccionar Prioritarios
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto border rounded-lg">
          {objectives.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {objectives.map((oa) => (
                <label
                  key={oa.oa_id}
                  className={`flex items-start p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedObjectives.includes(oa.oa_id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedObjectives.includes(oa.oa_id)}
                    onChange={() => handleObjectiveToggle(oa.oa_id)}
                    disabled={!selectedObjectives.includes(oa.oa_id) && selectedObjectives.length >= 5}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-blue-600">{oa.oa_code}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        oa.ministerial_priority === 'high' ? 'bg-red-100 text-red-700' :
                        oa.ministerial_priority === 'normal' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {oa.ministerial_priority === 'high' ? 'Prioritario' : 
                         oa.ministerial_priority === 'normal' ? 'Normal' : 'Opcional'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{oa.oa_short_desc || oa.oa_desc}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded ${
                        oa.bloom_level === 'Recordar' ? 'bg-green-100 text-green-700' :
                        oa.bloom_level === 'Comprender' ? 'bg-blue-100 text-blue-700' :
                        oa.bloom_level === 'Aplicar' ? 'bg-yellow-100 text-yellow-700' :
                        oa.bloom_level === 'Analizar' ? 'bg-orange-100 text-orange-700' :
                        oa.bloom_level === 'Evaluar' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {oa.bloom_level}
                      </span>
                      <span>Complejidad: {oa.complexity_level}/5</span>
                      <span>{oa.estimated_hours}h estimadas</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay objetivos disponibles para esta combinación</p>
            </div>
          )}
        </div>

        {selectedObjectives.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>{selectedObjectives.length}</strong> objetivo(s) seleccionado(s)
              {selectedObjectives.length >= 5 && (
                <span className="ml-2 text-blue-600">(máximo alcanzado)</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button onClick={onClose} variant="outline">
          Cancelar
        </Button>
        <Button
          onClick={() => setStep(2)}
          disabled={selectedObjectives.length === 0}
        >
          Configurar Quiz
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configuración del Quiz
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Preguntas
            </label>
            <select
              value={options.questionCount}
              onChange={(e) => setOptions({...options, questionCount: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 preguntas</option>
              <option value={10}>10 preguntas (recomendado)</option>
              <option value={15}>15 preguntas</option>
              <option value={20}>20 preguntas</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dificultad
            </label>
            <select
              value={options.difficulty}
              onChange={(e) => setOptions({...options, difficulty: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Fácil</option>
              <option value="medium">Medio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo Límite (minutos)
            </label>
            <input
              type="number"
              value={options.timeLimit}
              onChange={(e) => setOptions({...options, timeLimit: parseInt(e.target.value)})}
              min={10}
              max={120}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={options.includeTTS}
              onChange={(e) => setOptions({...options, includeTTS: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-sm text-gray-700">
              <SpeakerWaveIcon className="h-4 w-4 inline mr-1" />
              <strong>Incluir TTS (Text-to-Speech)</strong> - P1-S-01 WCAG AA
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={options.gameMode}
              onChange={(e) => setOptions({...options, gameMode: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-sm text-gray-700">
              <PlayIcon className="h-4 w-4 inline mr-1" />
              <strong>Modo Juego</strong> - P1-T-02 (15 formatos disponibles)
            </label>
          </div>
        </div>
      </div>

      {/* Selected Objectives Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Objetivos Seleccionados</h4>
        <div className="space-y-2">
          {getSelectedObjectivesDetails().map((oa) => (
            <div key={oa.oa_id} className="bg-white rounded p-3 border">
              <div className="font-medium text-blue-600">{oa.oa_code}</div>
              <div className="text-sm text-gray-700">{oa.oa_short_desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Estimation */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-green-900">Costo Estimado</div>
            <div className="text-sm text-green-700">
              {options.questionCount} preguntas + {options.includeTTS ? 'TTS' : 'sin TTS'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-900">
              ~${estimatedCost().toLocaleString()} CLP
            </div>
            <div className="text-xs text-green-600">
              ≈ {(estimatedCost() / (budgetStatus?.monthlyLimit || 1) * 100).toFixed(1)}% del presupuesto
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={() => setStep(1)} variant="outline">
          Volver
        </Button>
        <Button
          onClick={generateQuiz}
          disabled={!budgetStatus?.canProceed}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <SparklesIcon className="h-4 w-4 mr-2" />
          Generar Quiz con IA
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
        >
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Quiz Generado Exitosamente!
        </h3>
        
        <p className="text-gray-600 mb-6">
          El quiz fue creado con IA en {(generationTime / 1000).toFixed(1)} segundos
        </p>
      </div>

      {generationResult && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {generationResult.question_count}
              </div>
              <div className="text-sm text-gray-600">Preguntas</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-600">
                {generationResult.oa_coverage}
              </div>
              <div className="text-sm text-gray-600">OA Cubiertos</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {(generationResult.processing_time_ms / 1000).toFixed(1)}s
              </div>
              <div className="text-sm text-gray-600">Tiempo Generación</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-orange-600">
                ${generationResult.cost_clp}
              </div>
              <div className="text-sm text-gray-600">Costo CLP</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Quiz ID:</strong> {generationResult.quiz_id}
              <br />
              <strong>Tokens Utilizados:</strong> {generationResult.tokens_used?.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <Button onClick={onClose} variant="outline">
          Cerrar
        </Button>
        
        {generationResult && (
          <Button
            onClick={() => window.open(`/teacher/quiz/${generationResult.quiz_id}`, '_blank')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Ver Quiz
          </Button>
        )}
      </div>
    </div>
  );

  const renderGenerating = () => (
    <div className="text-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-6"
      >
        <SparklesIcon className="h-16 w-16 text-purple-600" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Generando Quiz con IA...
      </h3>
      
      <p className="text-gray-600 mb-6">
        Creando {options.questionCount} preguntas alineadas a {selectedObjectives.length} objetivos de aprendizaje
      </p>

      <div className="max-w-md mx-auto">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <ClockIcon className="h-4 w-4" />
          <span>Objetivo: menos de 60 segundos</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 bg-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 60, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Generador de Quiz IA
              </h2>
              <p className="text-sm text-gray-600">
                Paso {step} de 3 • Grado {gradeCode}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`flex-1 h-2 rounded-full ${
                    stepNum <= step ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {generating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderGenerating()}
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
} 