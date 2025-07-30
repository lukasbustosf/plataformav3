'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import type { Subject, GradeLevel, LearningObjective, Question, QuestionType } from '@/types';

interface NewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCreated: (newQuestion: Question) => void;
  onQuestionUpdated: (updatedQuestion: Question) => void;
  editingQuestion: Question | null;
}

const NewQuestionModal: React.FC<NewQuestionModalProps> = ({ isOpen, onClose, onQuestionCreated, onQuestionUpdated, editingQuestion }) => {
  const isEditing = !!editingQuestion;

  const [questionText, setQuestionText] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<GradeLevel[]>([]);
  const [availableOAs, setAvailableOAs] = useState<LearningObjective[]>([]);

  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedOA, setSelectedOA] = useState<string>('');

  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [subjectsRes, gradesRes] = await Promise.all([
            api.getSubjects(),
            api.getGradeLevels(),
          ]);
          setSubjects(subjectsRes.subjects);
          setGrades(gradesRes.grades);

          if (isEditing) {
            // Populate form with existing question data
            setQuestionText(editingQuestion.stem_md);
            setFeedback(editingQuestion.explanation || '');
            setSelectedSubject(editingQuestion.subject);
            setSelectedGrade(editingQuestion.grade);
            setSelectedOA(editingQuestion.learning_objective);
            setQuestionType(editingQuestion.question_type);
            // ... and so on for options and correct answer
          } else {
            // Set defaults for new question
            if (subjectsRes.subjects.length > 0) setSelectedSubject(subjectsRes.subjects[0].id);
            if (gradesRes.grades.length > 0) setSelectedGrade(gradesRes.grades[0].id);
          }

        } catch (err) {
          setError('Error al cargar datos iniciales.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, isEditing, editingQuestion]);

  useEffect(() => {
    if (selectedSubject && selectedGrade) {
      const fetchOAs = async () => {
        try {
          const oasRes = await api.getLearningObjectives({ subject: selectedSubject, grade: selectedGrade });
          setAvailableOAs(oasRes.data);
          if (!isEditing && oasRes.data.length > 0) {
            setSelectedOA(oasRes.data[0].id);
          }
        } catch (err) {
          setError('Error al cargar los Objetivos de Aprendizaje.');
        }
      };
      fetchOAs();
    }
  }, [selectedSubject, selectedGrade, isEditing]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const questionData: Partial<Question> = {
        subject: selectedSubject,
        grade: selectedGrade,
        learning_objective: selectedOA,
        stem_md: questionText,
        type: questionType,
        options_json: questionType === 'multiple_choice' ? options.map((opt, i) => ({ text: opt, is_correct: correctAnswer === i.toString() })) : [],
        explanation: feedback
    };

    try {
      if (isEditing) {
        const updatedQuestion = await api.updateQuestionInBank(editingQuestion.question_id, questionData);
        onQuestionUpdated(updatedQuestion);
      } else {
        const newQuestion = await api.createQuestionInBank(questionData);
        onQuestionCreated(newQuestion);
      }
      onClose();
    } catch (err: unknown) {
        setError((err as Error).message || `No se pudo ${isEditing ? 'actualizar' : 'crear'} la pregunta.`);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEditing ? 'Editar Pregunta' : 'Crear Nueva Pregunta'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {isLoading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... form fields ... */}

          <div className="flex justify-end space-x-2 pt-4">
              <button type="button" onClick={onClose} className="border border-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 text-sm" disabled={isLoading}>
                  Cancelar
              </button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Pregunta')}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewQuestionModal;
