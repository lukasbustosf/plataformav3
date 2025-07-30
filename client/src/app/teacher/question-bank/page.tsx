'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import NewQuestionModal from '@/components/question-bank/NewQuestionModal';
import { api } from '@/lib/api';
import type { Question } from '@/types';

const QuestionBankPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const fetchedQuestions = await api.getQuestionsFromBank();
        setQuestions(fetchedQuestions);
      } catch (err: unknown) {
        setError((err as Error).message || 'No se pudieron cargar las preguntas.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleQuestionCreated = (newQuestion: Question) => {
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
  };

  const handleQuestionUpdated = (updatedQuestion: Question) => {
    setQuestions(prevQuestions => 
        prevQuestions.map(q => q.question_id === updatedQuestion.question_id ? updatedQuestion : q)
    );
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      try {
        await api.deleteQuestionFromBank(id);
        setQuestions(prevQuestions => prevQuestions.filter(q => q.question_id !== id));
      } catch (err: unknown) {
        alert((err as Error).message || 'No se pudo eliminar la pregunta.');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  }

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banco de Preguntas</h1>
            <p className="text-sm text-gray-500 mt-1">
              Crea, edita y organiza preguntas para tus evaluaciones y actividades.
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Pregunta
            </button>
          </div>
        </header>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
              <div className="relative w-full md:w-1/3">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Buscar preguntas..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  />
              </div>
              <button className="border border-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 flex items-center text-sm">
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filtros
              </button>
          </div>

          {isLoading ? (
            <p>Cargando preguntas...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Aún no hay preguntas en tu banco.</p>
              <p className="text-sm text-gray-400 mt-2">
                Haz clic en "Nueva Pregunta" para empezar a crear.
              </p>
            </div>
          ) : (
            <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                    {questions.map((question) => (
                        <li key={question.question_id} className="py-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900 flex items-center">
                                    {question.stem_md}
                                    {question.source === 'EDU21' && (
                                        <span className="ml-2 text-xs font-semibold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">EDU21</span>
                                    )}
                                </p>
                                <p className="text-gray-700 text-sm mt-2">Tipo: {question.stem_md}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handleEdit(question)}
                                    className={`text-gray-400 hover:text-gray-600 ${question.source === 'EDU21' ? 'cursor-not-allowed' : ''}`}
                                    disabled={question.source === 'EDU21'}
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(question.question_id)}
                                    className={`text-gray-400 hover:text-red-600 ${question.source === 'EDU21' ? 'cursor-not-allowed' : ''}`}
                                    disabled={question.source === 'EDU21'}
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
          )}
        </div>
      </div>
      <NewQuestionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onQuestionCreated={handleQuestionCreated}
        onQuestionUpdated={handleQuestionUpdated}
        editingQuestion={editingQuestion}
      />
    </>
  );
};

export default QuestionBankPage;
