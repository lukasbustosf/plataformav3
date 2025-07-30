'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Evaluation {
  eval_id: string;
  title: string;
  type: 'quiz' | 'exam' | 'task';
  weight: number;
  total_points: number;
  due_date?: string;
}

interface GradebookEntry {
  entry_id: string;
  student_id: string;
  eval_id: string;
  nota_10: number; // Chilean 1-7 scale
  score_raw: number;
  percentage: number;
  recorded_at: string;
  notes?: string;
}

interface Attempt {
  attempt_id: string;
  student_id: string;
  eval_id: string;
  status: 'in_progress' | 'submitted' | 'graded' | 'overdue';
  score_raw?: number;
  auto_graded: boolean;
}

interface GradebookGridProps {
  classId: string;
  students: Student[];
  evaluations: Evaluation[];
}

export default function GradebookGrid({ classId, students, evaluations }: GradebookGridProps) {
  const [grades, setGrades] = useState<Record<string, GradebookEntry>>({});
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});
  const [loading, setLoading] = useState(true);
  const [editingGrade, setEditingGrade] = useState<{studentId: string, evalId: string} | null>(null);
  const [tempGrade, setTempGrade] = useState<string>('');
  const [tempNotes, setTempNotes] = useState<string>('');
  
  useEffect(() => {
    fetchGradebookData();
  }, [classId]);

  const fetchGradebookData = async () => {
    setLoading(true);
    try {
      // Fetch gradebook entries
      const gradesResponse = await fetch(`/api/gradebook?class_id=${classId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const gradesData = await gradesResponse.json();

      // Create grades map
      const gradesMap: Record<string, GradebookEntry> = {};
      gradesData.entries?.forEach((entry: GradebookEntry) => {
        const key = `${entry.student_id}-${entry.eval_id}`;
        gradesMap[key] = entry;
      });
      setGrades(gradesMap);

      // Fetch evaluation attempts
      const attemptsResponse = await fetch(`/api/evaluation/attempts?class_id=${classId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const attemptsData = await attemptsResponse.json();

      // Create attempts map
      const attemptsMap: Record<string, Attempt> = {};
      attemptsData.attempts?.forEach((attempt: Attempt) => {
        const key = `${attempt.student_id}-${attempt.eval_id}`;
        attemptsMap[key] = attempt;
      });
      setAttempts(attemptsMap);

    } catch (error) {
      console.error('Error fetching gradebook data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeEdit = (studentId: string, evalId: string) => {
    const key = `${studentId}-${evalId}`;
    const existingGrade = grades[key];
    
    setEditingGrade({ studentId, evalId });
    setTempGrade(existingGrade?.nota_10?.toString() || '');
    setTempNotes(existingGrade?.notes || '');
  };

  const handleGradeSave = async () => {
    if (!editingGrade) return;

    const { studentId, evalId } = editingGrade;
    const nota10 = parseFloat(tempGrade);

    if (isNaN(nota10) || nota10 < 1.0 || nota10 > 7.0) {
      alert('La nota debe estar entre 1.0 y 7.0');
      return;
    }

    try {
      const evaluation = evaluations.find(e => e.eval_id === evalId);
      if (!evaluation) return;

      // Calculate score_raw from nota_10
      const percentage = convertGradeToPercentage(nota10);
      const scoreRaw = Math.round((percentage / 100) * evaluation.total_points);

      const response = await fetch(`/api/evaluation/${evalId}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          student_id: studentId,
          score: scoreRaw,
          feedback: tempNotes,
          attempt_id: attempts[`${studentId}-${evalId}`]?.attempt_id
        })
      });

      const data = await response.json();
      if (data.success) {
        await fetchGradebookData(); // Refresh data
        setEditingGrade(null);
        setTempGrade('');
        setTempNotes('');
      } else {
        alert('Error al guardar la nota: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Error al guardar la nota');
    }
  };

  const handleGradeCancel = () => {
    setEditingGrade(null);
    setTempGrade('');
    setTempNotes('');
  };

  const convertGradeToPercentage = (nota10: number): number => {
    // Standard Chilean grading scale conversion
    const scale = {
      1.0: 0, 2.0: 20, 3.0: 40, 4.0: 55,
      5.0: 70, 6.0: 85, 7.0: 100
    };

    // Find the closest scale points
    const grades = Object.keys(scale).map(k => parseFloat(k)).sort((a, b) => a - b);
    
    for (let i = 0; i < grades.length - 1; i++) {
      const lower = grades[i];
      const upper = grades[i + 1];
      
      if (nota10 >= lower && nota10 <= upper) {
        // Linear interpolation
        const ratio = (nota10 - lower) / (upper - lower);
        const lowerPercent = scale[lower as keyof typeof scale];
        const upperPercent = scale[upper as keyof typeof scale];
        return lowerPercent + ratio * (upperPercent - lowerPercent);
      }
    }
    
    return nota10 === 7.0 ? 100 : 0;
  };

  const getGradeColor = (nota10: number): string => {
    if (nota10 >= 6.0) return 'text-green-700 bg-green-50';
    if (nota10 >= 4.0) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  const getStatusIcon = (studentId: string, evalId: string): string => {
    const key = `${studentId}-${evalId}`;
    const attempt = attempts[key];
    const grade = grades[key];

    if (grade) return '✅'; // Graded
    if (attempt?.status === 'in_progress') return '⏳'; // In progress
    if (attempt?.status === 'submitted') return '📝'; // Needs grading
    if (attempt?.status === 'overdue') return '⚠️'; // Overdue
    return '➖'; // Not started
  };

  const calculateStudentAverage = (studentId: string): number | null => {
    const studentGrades = evaluations
      .map(evaluation => {
        const key = `${studentId}-${evaluation.eval_id}`;
        const grade = grades[key];
        return grade ? { nota: grade.nota_10, weight: evaluation.weight } : null;
      })
      .filter(Boolean) as Array<{ nota: number; weight: number }>;

    if (studentGrades.length === 0) return null;

    // Weighted average
    const totalWeight = studentGrades.reduce((sum, g) => sum + g.weight, 0);
    const weightedSum = studentGrades.reduce((sum, g) => sum + (g.nota * g.weight), 0);
    
    return totalWeight > 0 ? weightedSum / totalWeight : null;
  };

  const calculateEvaluationAverage = (evalId: string): number | null => {
    const evalGrades = students
      .map(student => {
        const key = `${student.user_id}-${evalId}`;
        return grades[key]?.nota_10;
      })
      .filter(grade => grade !== undefined) as number[];

    if (evalGrades.length === 0) return null;
    return evalGrades.reduce((sum, grade) => sum + grade, 0) / evalGrades.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando libro de clases...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            📚 Libro de Clases
          </h3>
          <Button
            onClick={fetchGradebookData}
            variant="outline"
            size="sm"
          >
            🔄 Actualizar
          </Button>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Estudiante
              </th>
              {evaluations.map(evaluation => (
                <th
                  key={evaluation.eval_id}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[120px]"
                >
                  <div>
                    <div className="font-semibold">{evaluation.title}</div>
                    <div className="text-xs text-gray-400">
                      {evaluation.type} • {evaluation.weight}% • {evaluation.total_points}pts
                    </div>
                    {evaluation.due_date && (
                      <div className="text-xs text-gray-400">
                        {new Date(evaluation.due_date).toLocaleDateString()}
                      </div>
                    )}
                    <div className="text-xs text-blue-600 mt-1">
                      ⊕ {calculateEvaluationAverage(evaluation.eval_id)?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Promedio
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.user_id} className="hover:bg-gray-50">
                {/* Student Name (Sticky) */}
                <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap border-r border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.email}
                    </div>
                  </div>
                </td>

                {/* Grades */}
                {evaluations.map(evaluation => {
                  const key = `${student.user_id}-${evaluation.eval_id}`;
                  const grade = grades[key];
                  const isEditing = editingGrade?.studentId === student.user_id && 
                                  editingGrade?.evalId === evaluation.eval_id;

                  return (
                    <td
                      key={evaluation.eval_id}
                      className="px-3 py-4 text-center border-r border-gray-200"
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={tempGrade}
                            onChange={(e) => setTempGrade(e.target.value)}
                            min="1.0"
                            max="7.0"
                            step="0.1"
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm"
                            placeholder="1.0-7.0"
                          />
                          <div className="flex space-x-1">
                            <Button
                              onClick={handleGradeSave}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                            >
                              ✓
                            </Button>
                            <Button
                              onClick={handleGradeCancel}
                              variant="outline"
                              size="sm"
                              className="text-xs px-2 py-1"
                            >
                              ✗
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg">
                              {getStatusIcon(student.user_id, evaluation.eval_id)}
                            </span>
                            {grade && (
                              <span
                                className={`px-2 py-1 rounded text-sm font-medium cursor-pointer ${getGradeColor(grade.nota_10)}`}
                                onClick={() => handleGradeEdit(student.user_id, evaluation.eval_id)}
                                title="Click para editar"
                              >
                                {grade.nota_10.toFixed(1)}
                              </span>
                            )}
                          </div>
                          
                          {grade && (
                            <div className="text-xs text-gray-500">
                              {grade.score_raw}/{evaluation.total_points}
                              <br />
                              {grade.percentage.toFixed(0)}%
                            </div>
                          )}
                          
                          {!grade && attempts[key]?.status === 'submitted' && (
                            <Button
                              onClick={() => handleGradeEdit(student.user_id, evaluation.eval_id)}
                              size="sm"
                              className="text-xs px-2 py-1"
                            >
                              Calificar
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}

                {/* Student Average */}
                <td className="px-6 py-4 text-center">
                  {(() => {
                    const avg = calculateStudentAverage(student.user_id);
                    return avg ? (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(avg)}`}>
                        {avg.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>✅ Calificado</span>
            <span>📝 Pendiente</span>
            <span>⏳ En progreso</span>
            <span>⚠️ Atrasado</span>
            <span>➖ No iniciado</span>
          </div>
          <div className="text-right">
            <div>Escala chilena: 1.0 (0%) - 7.0 (100%)</div>
            <div>Click en las notas para editar</div>
          </div>
        </div>
      </div>
    </div>
  );
} 