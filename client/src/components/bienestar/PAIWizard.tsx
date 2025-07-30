'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserGroupIcon, 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  PrinterIcon,
  PencilIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  rut: string;
  grade: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: string[];
  guardian_contact: {
    name: string;
    phone: string;
    email: string;
  };
}

interface PAIData {
  student_id: string;
  risk_assessment: {
    academic_risk: number;
    social_risk: number;
    emotional_risk: number;
    behavioral_risk: number;
    family_risk: number;
  };
  identified_needs: string[];
  support_objectives: {
    short_term: string[];
    medium_term: string[];
    long_term: string[];
  };
  intervention_strategies: {
    academic: string[];
    psychological: string[];
    social: string[];
    family: string[];
  };
  responsible_team: {
    coordinator: string;
    teachers: string[];
    specialists: string[];
    external_support: string[];
  };
  timeline: {
    start_date: string;
    review_dates: string[];
    end_date: string;
  };
  success_indicators: string[];
  emergency_protocols: {
    contacts: { name: string; role: string; phone: string }[];
    procedures: string[];
  };
}

interface PAIWizardProps {
  studentId?: string;
  onComplete?: (paiId: string) => void;
  onClose?: () => void;
  maxTimeMinutes?: number;
}

export default function PAIWizard({ 
  studentId, 
  onComplete, 
  onClose, 
  maxTimeMinutes = 5 
}: PAIWizardProps) {
  const [step, setStep] = useState(1);
  const [startTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(maxTimeMinutes * 60);
  const [saving, setSaving] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [paiData, setPaiData] = useState<PAIData>({
    student_id: studentId || '',
    risk_assessment: {
      academic_risk: 1,
      social_risk: 1,
      emotional_risk: 1,
      behavioral_risk: 1,
      family_risk: 1
    },
    identified_needs: [],
    support_objectives: {
      short_term: [],
      medium_term: [],
      long_term: []
    },
    intervention_strategies: {
      academic: [],
      psychological: [],
      social: [],
      family: []
    },
    responsible_team: {
      coordinator: '',
      teachers: [],
      specialists: [],
      external_support: []
    },
    timeline: {
      start_date: new Date().toISOString().split('T')[0],
      review_dates: [],
      end_date: ''
    },
    success_indicators: [],
    emergency_protocols: {
      contacts: [],
      procedures: []
    }
  });

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          toast.error('⏰ Tiempo límite alcanzado para crear PAI');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load student data
  useEffect(() => {
    if (studentId) {
      loadStudentData();
    }
  }, [studentId]);

  const loadStudentData = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}/risk-profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setStudent(data.data.student);
        // Pre-fill risk assessment based on existing data
        if (data.data.risk_profile) {
          setPaiData(prev => ({
            ...prev,
            risk_assessment: data.data.risk_profile.assessment || prev.risk_assessment,
            identified_needs: data.data.risk_profile.needs || []
          }));
        }
      }
    } catch (error) {
      console.error('Error loading student:', error);
      toast.error('Error al cargar datos del estudiante');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (maxTimeMinutes * 60)) * 100;
    if (percentage <= 20) return 'text-red-600';
    if (percentage <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const updateRiskAssessment = (category: keyof PAIData['risk_assessment'], value: number) => {
    setPaiData(prev => ({
      ...prev,
      risk_assessment: {
        ...prev.risk_assessment,
        [category]: value
      }
    }));
  };

  const addToArray = (path: string, value: string) => {
    if (!value.trim()) return;
    
    setPaiData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const finalKey = keys[keys.length - 1];
      if (Array.isArray(current[finalKey])) {
        current[finalKey] = [...current[finalKey], value];
      }
      
      return newData;
    });
  };

  const removeFromArray = (path: string, index: number) => {
    setPaiData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const finalKey = keys[keys.length - 1];
      if (Array.isArray(current[finalKey])) {
        current[finalKey] = current[finalKey].filter((_: any, i: number) => i !== index);
      }
      
      return newData;
    });
  };

  const savePAI = async () => {
    setSaving(true);
    
    try {
      // P1-C-02: Generate digital signature for PAI
      const creationTime = Date.now() - startTime;
      const signatureData = {
        student_id: paiData.student_id,
        created_at: new Date().toISOString(),
        creator_id: localStorage.getItem('user_id'),
        creation_time_ms: creationTime,
        risk_assessment: paiData.risk_assessment,
        intervention_count: paiData.intervention_strategies.academic.length + 
                           paiData.intervention_strategies.psychological.length +
                           paiData.intervention_strategies.social.length +
                           paiData.intervention_strategies.family.length
      };

      // Generate PAI signature (SHA-256)
      const signatureString = JSON.stringify(signatureData, Object.keys(signatureData).sort());
      const signature = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signatureString));
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const response = await fetch('/api/bienestar/pai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...paiData,
          creation_time: creationTime,
          created_with_wizard: true,
          p1_compliant: creationTime <= (5 * 60 * 1000), // P1-C-02: ≤5 minutes
          digital_signature: {
            hash: hashHex,
            timestamp: new Date().toISOString(),
            algorithm: 'SHA-256',
            signature_data: signatureData
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        if (creationTime <= (5 * 60 * 1000)) {
          toast.success('✅ PAI creado exitosamente con firma digital P1-C-02 compliant (≤5min)');
        } else {
          toast.success('✅ PAI creado con firma digital (excedió límite P1 de 5 minutos)');
        }
        if (onComplete) {
          onComplete(data.data.pai_id);
        }
      } else {
        throw new Error(data.error || 'Error al crear PAI');
      }

    } catch (error: any) {
      console.error('Error saving PAI:', error);
      toast.error('❌ Error al guardar PAI: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <UserGroupIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Wizard PAI (Plan de Apoyo Integral)
            </h3>
            <p className="text-sm text-blue-700">
              P1-C-02: Creación rápida en ≤ 5 minutos con firma digital
            </p>
          </div>
        </div>

        {student && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Estudiante Seleccionado</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre:</span>
                <span className="ml-2 font-medium">{student.first_name} {student.last_name}</span>
              </div>
              <div>
                <span className="text-gray-600">RUT:</span>
                <span className="ml-2 font-medium">{student.rut}</span>
              </div>
              <div>
                <span className="text-gray-600">Grado:</span>
                <span className="ml-2 font-medium">{student.grade}</span>
              </div>
              <div>
                <span className="text-gray-600">Nivel de Riesgo:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  student.risk_level === 'critical' ? 'bg-red-100 text-red-700' :
                  student.risk_level === 'high' ? 'bg-orange-100 text-orange-700' :
                  student.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {student.risk_level === 'critical' ? 'Crítico' :
                   student.risk_level === 'high' ? 'Alto' :
                   student.risk_level === 'medium' ? 'Medio' : 'Bajo'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risk Assessment */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Evaluación de Riesgo (1-5 escala)
        </h4>
        
        <div className="space-y-4">
          {Object.entries(paiData.risk_assessment).map(([category, value]) => (
            <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  {category === 'academic_risk' ? 'Riesgo Académico' :
                   category === 'social_risk' ? 'Riesgo Social' :
                   category === 'emotional_risk' ? 'Riesgo Emocional' :
                   category === 'behavioral_risk' ? 'Riesgo Conductual' :
                   'Riesgo Familiar'}
                </div>
                <div className="text-sm text-gray-600">
                  {category === 'academic_risk' ? 'Rendimiento, asistencia, comprensión' :
                   category === 'social_risk' ? 'Relaciones, integración, bullying' :
                   category === 'emotional_risk' ? 'Autoestima, ansiedad, depresión' :
                   category === 'behavioral_risk' ? 'Disciplina, agresividad, impulsividad' :
                   'Apoyo familiar, situación económica, violencia'}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateRiskAssessment(category as keyof PAIData['risk_assessment'], level)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                      value >= level 
                        ? level <= 2 ? 'bg-green-500 border-green-500 text-white' :
                          level <= 3 ? 'bg-yellow-500 border-yellow-500 text-white' :
                          'bg-red-500 border-red-500 text-white'
                        : 'border-gray-300 text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onClose} variant="outline">
          Cancelar
        </Button>
        <Button onClick={() => setStep(2)}>
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Necesidades Identificadas y Objetivos
      </h3>

      {/* Needs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Necesidades Identificadas
        </label>
        <div className="space-y-2">
          {paiData.identified_needs.map((need, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">{need}</span>
              <button
                onClick={() => removeFromArray('identified_needs', index)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Agregar necesidad identificada..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addToArray('identified_needs', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['short_term', 'medium_term', 'long_term'].map((term) => (
          <div key={term}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivos {term === 'short_term' ? 'Corto Plazo (1-3 meses)' :
                       term === 'medium_term' ? 'Mediano Plazo (3-6 meses)' :
                       'Largo Plazo (6+ meses)'}
            </label>
            <div className="space-y-2">
              {paiData.support_objectives[term as keyof typeof paiData.support_objectives].map((obj: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-900">{obj}</span>
                  <button
                    onClick={() => removeFromArray(`support_objectives.${term}`, index)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <textarea
                placeholder={`Objetivo ${term === 'short_term' ? 'corto plazo' : term === 'medium_term' ? 'mediano plazo' : 'largo plazo'}...`}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addToArray(`support_objectives.${term}`, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={() => setStep(1)} variant="outline">
          Volver
        </Button>
        <Button onClick={() => setStep(3)}>
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Estrategias de Intervención y Equipo Responsable
      </h3>

      {/* Intervention Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(paiData.intervention_strategies).map(([category, strategies]) => (
          <div key={category}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estrategias {
                category === 'academic' ? 'Académicas' :
                category === 'psychological' ? 'Psicológicas' :
                category === 'social' ? 'Sociales' : 'Familiares'
              }
            </label>
            <div className="space-y-2">
              {strategies.map((strategy: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-900">{strategy}</span>
                  <button
                    onClick={() => removeFromArray(`intervention_strategies.${category}`, index)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder={`Estrategia ${category}...`}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToArray(`intervention_strategies.${category}`, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={paiData.timeline.start_date}
            onChange={(e) => setPaiData(prev => ({
              ...prev,
              timeline: { ...prev.timeline, start_date: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Término
          </label>
          <input
            type="date"
            value={paiData.timeline.end_date}
            onChange={(e) => setPaiData(prev => ({
              ...prev,
              timeline: { ...prev.timeline, end_date: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coordinador Responsable
          </label>
          <input
            type="text"
            value={paiData.responsible_team.coordinator}
            onChange={(e) => setPaiData(prev => ({
              ...prev,
              responsible_team: { ...prev.responsible_team, coordinator: e.target.value }
            }))}
            placeholder="Nombre del coordinador"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={() => setStep(2)} variant="outline">
          Volver
        </Button>
        <div className="flex flex-col space-y-2">
          <Button
            onClick={savePAI}
            isLoading={saving}
            disabled={timeRemaining <= 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            Crear PAI con Firma Digital
          </Button>
          
          {/* P1-C-02 Compliance Status */}
          <div className={`text-xs px-3 py-2 rounded-lg ${
            timeRemaining > 0 && (maxTimeMinutes * 60 - timeRemaining) <= (5 * 60) 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
          }`}>
            <div className="flex items-center space-x-1">
              <ShieldCheckIcon className="h-3 w-3" />
              <span className="font-medium">
                P1-C-02: {timeRemaining > 0 && (maxTimeMinutes * 60 - timeRemaining) <= (5 * 60) 
                  ? 'Compliant' 
                  : 'No Compliant'} 
              </span>
            </div>
            <div className="mt-1">
              Tiempo transcurrido: {Math.floor((maxTimeMinutes * 60 - timeRemaining) / 60)}:{
                ((maxTimeMinutes * 60 - timeRemaining) % 60).toString().padStart(2, '0')
              } / 5:00 min
            </div>
            <div className="text-xs opacity-75 mt-1">
              SHA-256 automático al completar
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header with Timer */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Wizard PAI (Plan de Apoyo Integral)
              </h2>
              <p className="text-sm text-gray-600">
                Paso {step} de 3 • Tiempo límite: {maxTimeMinutes} minutos
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                <ClockIcon className="h-5 w-5" />
                <span className="font-mono text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`flex-1 h-2 rounded-full ${
                    stepNum <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
} 