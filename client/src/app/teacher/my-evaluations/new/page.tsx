'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Question } from '@/types';

const NewEvaluationPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const fetchedQuestions = await api.getQuestionsFromBank();
        setAllQuestions(fetchedQuestions);
      } catch (err: unknown) {
        setError((err as Error).message || 'No se pudieron cargar las preguntas.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions(prevSelected => 
      prevSelected.includes(questionId) 
        ? prevSelected.filter(id => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  const handleSaveEvaluation = async () => {
    if (!title || selectedQuestions.length === 0) {
        alert('Por favor, introduce un título y selecciona al menos una pregunta.');
        return;
    }

    setIsSaving(true);
    try {
        await api.createEvaluation({ 
            title, 
            description, 
            questionIds: selectedQuestions 
        });
        router.push('/teacher/my-evaluations');
    } catch (err: unknown) {
        setError((err as Error).message || 'No se pudo guardar la evaluación.');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Constructor de Evaluaciones</h1>
        <p className="text-sm text-gray-500 mt-1">
          Define los detalles de tu evaluación y selecciona las preguntas que la conformarán.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Evaluation Details */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Detalles de la Evaluación</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Ej: Evaluación de Sumas y Restas"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Una breve descripción de la evaluación para los estudiantes."
              ></textarea>
            </div>
            <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Preguntas Seleccionadas</h3>
                <p className="text-sm text-gray-500">{selectedQuestions.length} de {allQuestions.length}</p>
            </div>
          </div>
          <button 
            onClick={handleSaveEvaluation}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar Evaluación'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Right Column: Question Bank */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Banco de Preguntas</h2>
            {isLoading ? (
                <p>Cargando preguntas...</p>
            ) : (
                <ul className="divide-y divide-gray-200 h-96 overflow-y-auto">
                    {allQuestions.map(q => (
                        <li key={q.question_id} className="p-2 flex items-center">
                            <input 
                                type="checkbox"
                                id={`q-${q.question_id}`}
                                checked={selectedQuestions.includes(q.question_id)}
                                onChange={() => handleSelectQuestion(q.question_id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`q-${q.question_id}`} className="ml-3 text-sm text-gray-700">
                                {q.stem_md}
                                {q.source === 'EDU21' && <span className="ml-2 text-xs font-semibold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">EDU21</span>}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  );
};

export default NewEvaluationPage;
