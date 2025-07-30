'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface Evaluation {
  eval_id: string;
  title: string;
  description: string;
  type: 'quiz' | 'exam' | 'task';
  serious: boolean; // Lockdown mode
  attempt_limit: number;
  time_limit_minutes?: number;
  total_points: number;
  available_from?: string;
  available_until?: string;
  due_date?: string;
  status: string;
}

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface EvaluationLauncherProps {
  evaluation: Evaluation;
  students: Student[];
  onLaunch?: (attemptId: string, studentId: string) => void;
  onClose?: () => void;
}

export default function EvaluationLauncher({ 
  evaluation, 
  students, 
  onLaunch, 
  onClose 
}: EvaluationLauncherProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [launching, setLaunching] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, any>>({});
  const [showLockdownWarning, setShowLockdownWarning] = useState(false);

  useEffect(() => {
    fetchExistingAttempts();
  }, [evaluation.eval_id]);

  const fetchExistingAttempts = async () => {
    try {
      const response = await fetch(`/api/evaluation/${evaluation.eval_id}/attempts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Create a map of student attempts
      const attemptMap: Record<string, any> = {};
      data.attempts?.forEach((attempt: any) => {
        if (!attemptMap[attempt.student_id]) {
          attemptMap[attempt.student_id] = [];
        }
        attemptMap[attempt.student_id].push(attempt);
      });
      
      setAttempts(attemptMap);
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    const availableStudents = students.filter(student => {
      const studentAttempts = attempts[student.user_id] || [];
      return studentAttempts.length < evaluation.attempt_limit;
    });
    setSelectedStudents(availableStudents.map(s => s.user_id));
  };

  const clearSelection = () => {
    setSelectedStudents([]);
  };

  const launchEvaluation = async () => {
    if (selectedStudents.length === 0) {
      alert('Selecciona al menos un estudiante.');
      return;
    }

    if (evaluation.serious && !showLockdownWarning) {
      setShowLockdownWarning(true);
      return;
    }

    setLaunching(true);
    
    try {
      const launchPromises = selectedStudents.map(async (studentId) => {
        const response = await fetch(`/api/evaluation/${evaluation.eval_id}/launch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ student_id: studentId })
        });

        const data = await response.json();
        if (data.success) {
          onLaunch?.(data.attempt_id, studentId);
          return { success: true, studentId, attemptId: data.attempt_id };
        } else {
          throw new Error(data.error || 'Failed to launch evaluation');
        }
      });

      const results = await Promise.allSettled(launchPromises);
      
      // Count successful launches
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      if (successful > 0) {
        alert(`✅ Evaluación lanzada exitosamente para ${successful} estudiante(s).`);
        await fetchExistingAttempts(); // Refresh attempts
        setSelectedStudents([]);
      }

      if (failed > 0) {
        alert(`⚠️ ${failed} lanzamiento(s) fallaron. Verifica los permisos.`);
      }

    } catch (error) {
      console.error('Error launching evaluation:', error);
      alert('Error al lanzar la evaluación. Intenta nuevamente.');
    } finally {
      setLaunching(false);
      setShowLockdownWarning(false);
    }
  };

  const getStudentStatus = (student: Student) => {
    const studentAttempts = attempts[student.user_id] || [];
    
    if (studentAttempts.length === 0) {
      return { status: 'not_started', text: 'No iniciado', color: 'gray' };
    }
    
    if (studentAttempts.length >= evaluation.attempt_limit) {
      return { status: 'completed', text: 'Completado', color: 'green' };
    }
    
    const activeAttempt = studentAttempts.find((a: any) => a.status === 'in_progress');
    if (activeAttempt) {
      return { status: 'in_progress', text: 'En progreso', color: 'blue' };
    }
    
    return { 
      status: 'can_retry', 
      text: `${studentAttempts.length}/${evaluation.attempt_limit} intentos`, 
      color: 'yellow' 
    };
  };

  const isWithinTimeWindow = () => {
    const now = new Date();
    
    if (evaluation.available_from && new Date(evaluation.available_from) > now) {
      return { valid: false, message: 'La evaluación aún no está disponible' };
    }
    
    if (evaluation.available_until && new Date(evaluation.available_until) < now) {
      return { valid: false, message: 'La evaluación ya no está disponible' };
    }
    
    return { valid: true, message: '' };
  };

  const timeWindow = isWithinTimeWindow();

  const LockdownWarningModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-bold text-red-600 mb-4">
            MODO EXAMEN SERIO ACTIVADO
          </h3>
          
          <div className="text-left text-sm text-gray-700 space-y-2 mb-6">
            <p><strong>Restricciones activas:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Sin ayuda de Text-to-Speech (TTS)</li>
              <li>Preguntas y opciones serán mezcladas aleatoriamente</li>
              <li>Detección de cambio de ventana activa</li>
              <li>IP y navegador registrados para auditoría</li>
              <li>Una vez iniciado, no se puede pausar</li>
            </ul>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowLockdownWarning(false)}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={launchEvaluation}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Confirmar Lanzamiento
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Lanzar Evaluación: {evaluation.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                {evaluation.type === 'quiz' && '🎯'}
                {evaluation.type === 'exam' && '📝'}
                {evaluation.type === 'task' && '📋'}
                <span className="ml-1 capitalize">{evaluation.type}</span>
              </span>
              
              {evaluation.serious && (
                <span className="flex items-center text-red-600 font-medium">
                  🔒 Modo Serio
                </span>
              )}
              
              <span>{evaluation.total_points} puntos</span>
              
              {evaluation.time_limit_minutes && (
                <span>⏱️ {evaluation.time_limit_minutes} min</span>
              )}
            </div>
          </div>
          
          <Button onClick={onClose} variant="outline" size="sm">
            ✕ Cerrar
          </Button>
        </div>

        {/* Time Window Warning */}
        {!timeWindow.valid && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-yellow-600 text-xl mr-2">⚠️</span>
              <span className="text-yellow-800">{timeWindow.message}</span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button
              onClick={selectAllStudents}
              variant="outline"
              size="sm"
              disabled={!timeWindow.valid}
            >
              Seleccionar Disponibles
            </Button>
            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
            >
              Limpiar Selección
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            {selectedStudents.length} estudiante(s) seleccionado(s)
          </div>
        </div>

        {/* Students List */}
        <div className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-medium text-gray-900">
            Estudiantes ({students.length})
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {students.map((student) => {
              const status = getStudentStatus(student);
              const canLaunch = status.status === 'not_started' || status.status === 'can_retry';
              
              return (
                <div
                  key={student.user_id}
                  className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${
                    selectedStudents.includes(student.user_id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.user_id)}
                      onChange={() => handleStudentSelect(student.user_id)}
                      disabled={!canLaunch || !timeWindow.valid}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    
                    <div>
                      <div className="font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status.color === 'gray' ? 'bg-gray-100 text-gray-800' :
                      status.color === 'green' ? 'bg-green-100 text-green-800' :
                      status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {status.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Launch Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={launchEvaluation}
            isLoading={launching}
            disabled={selectedStudents.length === 0 || !timeWindow.valid}
            className={`${
              evaluation.serious 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {evaluation.serious && '🔒'} Lanzar Evaluación ({selectedStudents.length})
          </Button>
        </div>
      </div>

      {/* Lockdown Warning Modal */}
      {showLockdownWarning && <LockdownWarningModal />}
    </>
  );
} 