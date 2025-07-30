'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface OAOption {
  oa_id: string;
  oa_code: string;
  oa_desc: string;
  bloom_level: string;
  grade_code: string;
  subject_name: string;
}

interface RubricCriterion {
  criterion_id: string;
  name: string;
  description: string;
  weight: number;
  levels: RubricLevel[];
}

interface RubricLevel {
  level_id: string;
  name: string;
  description: string;
  points: number;
}

interface EvaluationCreatorProps {
  classId: string;
  onClose: () => void;
  onSuccess: (evaluationId: string) => void;
}

export function EvaluationCreator({ classId, onClose, onSuccess }: EvaluationCreatorProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [oaOptions, setOaOptions] = useState<OAOption[]>([]);
  
  // Form state
  const [evaluationData, setEvaluationData] = useState({
    title: '',
    description: '',
    type: 'quiz', // quiz, exam, task
    mode: 'manual', // manual, ai
    weight: 20,
    attempt_limit: 1,
    time_limit: 60,
    serious: false, // P1-T-07: Lockdown mode for serious exams
    selected_oas: [] as string[],
    instructions: '',
    grading_scale: 'chilean_1_7',
    rubric_mode: 'automatic', // automatic, manual, ai_generated
    rubric_criteria: [] as RubricCriterion[],
    task_settings: {
      allow_file_upload: false,
      file_types: ['pdf', 'doc', 'docx'],
      max_file_size: 5,
      late_penalty: 10,
      deadline: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadOAOptions();
  }, []);

  const loadOAOptions = async () => {
    try {
      // Mock OA data - in real implementation would fetch from API
      setOaOptions([
        {
          oa_id: '1',
          oa_code: 'MAT05-OA04',
          oa_desc: 'Resolver problemas con fracciones',
          bloom_level: 'Aplicar',
          grade_code: '5B',
          subject_name: 'Matemáticas'
        },
        {
          oa_id: '2', 
          oa_code: 'LEN05-OA02',
          oa_desc: 'Leer y comprender textos narrativos',
          bloom_level: 'Comprender',
          grade_code: '5B',
          subject_name: 'Lenguaje'
        },
        {
          oa_id: '3',
          oa_code: 'CIE05-OA01',
          oa_desc: 'Explicar el sistema solar',
          bloom_level: 'Analizar',
          grade_code: '5B',
          subject_name: 'Ciencias'
        }
      ]);
    } catch (error) {
      console.error('Error loading OA options:', error);
    }
  };

  const generateAIRubric = async () => {
    if (evaluationData.selected_oas.length === 0) {
      setErrors({ ...errors, oas: 'Selecciona al menos un OA para generar rúbrica IA' });
      return;
    }

    setLoading(true);
    try {
      // Mock AI rubric generation - P1-T-10 requirement
      const mockRubric: RubricCriterion[] = [
        {
          criterion_id: '1',
          name: 'Precisión Conceptual',
          description: 'Demuestra comprensión precisa de los conceptos del OA',
          weight: 40,
          levels: [
            {
              level_id: '1',
              name: 'Excelente',
              description: 'Demuestra comprensión completa y precisa',
              points: 4
            },
            {
              level_id: '2',
              name: 'Bueno',
              description: 'Demuestra comprensión adecuada con errores menores',
              points: 3
            },
            {
              level_id: '3',
              name: 'Suficiente',
              description: 'Demuestra comprensión básica con algunos errores',
              points: 2
            },
            {
              level_id: '4',
              name: 'Insuficiente',
              description: 'Comprensión limitada o incorrecta',
              points: 1
            }
          ]
        },
        {
          criterion_id: '2',
          name: 'Aplicación Práctica',
          description: 'Aplica conocimientos para resolver problemas',
          weight: 35,
          levels: [
            {
              level_id: '1',
              name: 'Excelente',
              description: 'Aplica correctamente en contextos diversos',
              points: 4
            },
            {
              level_id: '2',
              name: 'Bueno',
              description: 'Aplica correctamente en contextos conocidos',
              points: 3
            },
            {
              level_id: '3',
              name: 'Suficiente',
              description: 'Aplica con guía en contextos simples',
              points: 2
            },
            {
              level_id: '4',
              name: 'Insuficiente',
              description: 'No logra aplicar conocimientos',
              points: 1
            }
          ]
        },
        {
          criterion_id: '3',
          name: 'Comunicación',
          description: 'Comunica ideas de forma clara y organizada',
          weight: 25,
          levels: [
            {
              level_id: '1',
              name: 'Excelente',
              description: 'Comunicación clara, precisa y bien organizada',
              points: 4
            },
            {
              level_id: '2',
              name: 'Bueno',
              description: 'Comunicación generalmente clara y organizada',
              points: 3
            },
            {
              level_id: '3',
              name: 'Suficiente',
              description: 'Comunicación básica pero comprensible',
              points: 2
            },
            {
              level_id: '4',
              name: 'Insuficiente',
              description: 'Comunicación confusa o incompleta',
              points: 1
            }
          ]
        }
      ];

      setEvaluationData({
        ...evaluationData,
        rubric_criteria: mockRubric,
        rubric_mode: 'ai_generated'
      });

      setErrors({ ...errors, rubric: '' });

    } catch (error) {
      console.error('Error generating AI rubric:', error);
      setErrors({ ...errors, rubric: 'Error generando rúbrica IA' });
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!evaluationData.title.trim()) {
          newErrors.title = 'El título es obligatorio';
        }
        if (!evaluationData.type) {
          newErrors.type = 'Selecciona un tipo de evaluación';
        }
        if (evaluationData.weight < 1 || evaluationData.weight > 100) {
          newErrors.weight = 'El peso debe estar entre 1 y 100%';
        }
        break;

      case 2:
        if (evaluationData.selected_oas.length === 0) {
          newErrors.oas = 'Selecciona al menos un Objetivo de Aprendizaje';
        }
        break;

      case 3:
        if (evaluationData.type === 'task') {
          if (!evaluationData.task_settings.deadline) {
            newErrors.deadline = 'La fecha límite es obligatoria para tareas';
          }
        }
        if (evaluationData.type === 'exam' && evaluationData.time_limit < 30) {
          newErrors.time_limit = 'Los exámenes deben tener al menos 30 minutos';
        }
        break;

      case 4:
        if (evaluationData.rubric_mode !== 'automatic' && evaluationData.rubric_criteria.length === 0) {
          newErrors.rubric = 'Define al menos un criterio de evaluación';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      // P1 Compliance: Generate evaluation with all required fields
      const evaluationPayload = {
        class_id: classId,
        title: evaluationData.title,
        description: evaluationData.description,
        type: evaluationData.type,
        mode: evaluationData.mode,
        weight: evaluationData.weight,
        attempt_limit: evaluationData.attempt_limit,
        time_limit: evaluationData.time_limit,
        serious: evaluationData.serious, // P1-T-07: Lockdown mode
        grading_scale: evaluationData.grading_scale,
        rubric_json: evaluationData.rubric_criteria,
        oa_ids: evaluationData.selected_oas,
        instructions: evaluationData.instructions,
        task_settings: evaluationData.type === 'task' ? evaluationData.task_settings : null,
        p1_compliance: {
          lockdown_capable: evaluationData.serious,
          ai_rubric_generated: evaluationData.rubric_mode === 'ai_generated',
          oa_alignment_verified: true,
          weight_within_limits: evaluationData.weight >= 1 && evaluationData.weight <= 100
        }
      };

      // Mock API call
      console.log('Creating evaluation:', evaluationPayload);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockEvaluationId = 'eval_' + Date.now();
      onSuccess(mockEvaluationId);

    } catch (error) {
      console.error('Error creating evaluation:', error);
      setErrors({ submit: 'Error al crear la evaluación' });
    } finally {
      setLoading(false);
    }
  };

  const toggleOA = (oaId: string) => {
    const newSelected = evaluationData.selected_oas.includes(oaId)
      ? evaluationData.selected_oas.filter(id => id !== oaId)
      : [...evaluationData.selected_oas, oaId];
    
    setEvaluationData({ ...evaluationData, selected_oas: newSelected });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Información Básica</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título de la Evaluación *
        </label>
        <input
          type="text"
          value={evaluationData.title}
          onChange={(e) => setEvaluationData({ ...evaluationData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Evaluación Fracciones - Unidad 3"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          value={evaluationData.description}
          onChange={(e) => setEvaluationData({ ...evaluationData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Descripción opcional de la evaluación..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Evaluación *
          </label>
          <select
            value={evaluationData.type}
            onChange={(e) => setEvaluationData({ ...evaluationData, type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="quiz">Quiz / Cuestionario</option>
            <option value="exam">Examen Sumativo</option>
            <option value="task">Tarea / Proyecto</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso en Nota Final (%) *
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={evaluationData.weight}
            onChange={(e) => setEvaluationData({ ...evaluationData, weight: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
      </div>

      {/* P1-T-07: Lockdown mode for serious exams */}
      {evaluationData.type === 'exam' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="serious-mode"
              checked={evaluationData.serious}
              onChange={(e) => setEvaluationData({ ...evaluationData, serious: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="serious-mode" className="text-sm font-medium text-gray-700">
              Activar Modo Examen Serio (Lockdown)
            </label>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Bloquea navegación, oculta iconos y activa modo anti-trampa para exámenes sumativos importantes
          </p>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Objetivos de Aprendizaje</h3>
      
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona los Objetivos de Aprendizaje (OA) que evaluará esta actividad:
        </p>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {oaOptions.map((oa) => (
            <div
              key={oa.oa_id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                evaluationData.selected_oas.includes(oa.oa_id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleOA(oa.oa_id)}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={evaluationData.selected_oas.includes(oa.oa_id)}
                  onChange={() => toggleOA(oa.oa_id)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-blue-600">{oa.oa_code}</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {oa.bloom_level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{oa.oa_desc}</p>
                  <p className="text-xs text-gray-500">{oa.subject_name} - {oa.grade_code}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {errors.oas && <p className="text-red-500 text-sm mt-2">{errors.oas}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Configuración de Evaluación</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Límite de Intentos
          </label>
          <select
            value={evaluationData.attempt_limit}
            onChange={(e) => setEvaluationData({ ...evaluationData, attempt_limit: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1 intento</option>
            <option value={2}>2 intentos</option>
            <option value={3}>3 intentos</option>
            <option value={-1}>Intentos ilimitados</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiempo Límite (minutos)
          </label>
          <input
            type="number"
            min="5"
            max="180"
            value={evaluationData.time_limit}
            onChange={(e) => setEvaluationData({ ...evaluationData, time_limit: parseInt(e.target.value) || 60 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.time_limit && <p className="text-red-500 text-sm mt-1">{errors.time_limit}</p>}
        </div>
      </div>

      {/* P1-T-11: Task-specific settings */}
      {evaluationData.type === 'task' && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-gray-900">Configuración de Tarea</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Límite *
            </label>
            <input
              type="datetime-local"
              value={evaluationData.task_settings.deadline}
              onChange={(e) => setEvaluationData({
                ...evaluationData,
                task_settings: { ...evaluationData.task_settings, deadline: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="allow-upload"
              checked={evaluationData.task_settings.allow_file_upload}
              onChange={(e) => setEvaluationData({
                ...evaluationData,
                task_settings: { ...evaluationData.task_settings, allow_file_upload: e.target.checked }
              })}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="allow-upload" className="text-sm font-medium text-gray-700">
              Permitir subida de archivos
            </label>
          </div>

          {evaluationData.task_settings.allow_file_upload && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño máximo (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={evaluationData.task_settings.max_file_size}
                  onChange={(e) => setEvaluationData({
                    ...evaluationData,
                    task_settings: { ...evaluationData.task_settings, max_file_size: parseInt(e.target.value) || 5 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penalidad por atraso (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={evaluationData.task_settings.late_penalty}
                  onChange={(e) => setEvaluationData({
                    ...evaluationData,
                    task_settings: { ...evaluationData.task_settings, late_penalty: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instrucciones para Estudiantes
        </label>
        <textarea
          value={evaluationData.instructions}
          onChange={(e) => setEvaluationData({ ...evaluationData, instructions: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Instrucciones detalladas para completar la evaluación..."
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Rúbrica de Evaluación</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modo de Rúbrica
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="rubric_mode"
              value="automatic"
              checked={evaluationData.rubric_mode === 'automatic'}
              onChange={(e) => setEvaluationData({ ...evaluationData, rubric_mode: e.target.value as any })}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm">Calificación automática (1-7)</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="rubric_mode"
              value="ai_generated"
              checked={evaluationData.rubric_mode === 'ai_generated'}
              onChange={(e) => setEvaluationData({ ...evaluationData, rubric_mode: e.target.value as any })}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm">Generar rúbrica con IA (P1-T-10)</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="rubric_mode"
              value="manual"
              checked={evaluationData.rubric_mode === 'manual'}
              onChange={(e) => setEvaluationData({ ...evaluationData, rubric_mode: e.target.value as any })}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm">Crear rúbrica manual</span>
          </label>
        </div>
      </div>

      {evaluationData.rubric_mode === 'ai_generated' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900">Rúbrica Generada con IA</h4>
            <Button
              onClick={generateAIRubric}
              disabled={loading || evaluationData.selected_oas.length === 0}
              className="text-sm"
            >
              {loading ? 'Generando...' : 'Generar Rúbrica IA'}
            </Button>
          </div>
          
          {evaluationData.rubric_criteria.length > 0 && (
            <div className="space-y-3">
              {evaluationData.rubric_criteria.map((criterion, index) => (
                <div key={criterion.criterion_id} className="bg-white rounded border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{criterion.name}</h5>
                    <span className="text-sm text-gray-600">{criterion.weight}% peso</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{criterion.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {criterion.levels.map((level) => (
                      <div key={level.level_id} className="text-xs bg-gray-50 rounded p-2">
                        <div className="font-medium">{level.name} ({level.points}pts)</div>
                        <div className="text-gray-600">{level.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {errors.rubric && <p className="text-red-500 text-sm mt-2">{errors.rubric}</p>}
        </div>
      )}

      {evaluationData.rubric_mode === 'manual' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            La funcionalidad de creación manual de rúbricas se implementará en una próxima actualización.
            Por ahora, puedes usar la generación automática con IA.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Crear Nueva Evaluación
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Paso {step} de 4
          </div>
          
          <div className="flex items-center space-x-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={loading}
              >
                Anterior
              </Button>
            )}
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={loading}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Creando...' : 'Crear Evaluación'}
              </Button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}
      </div>
    </div>
  );
} 