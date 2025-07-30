'use client'

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { QuestionMarkCircleIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

interface QuestionBankSelectorProps {
  selectedQuestionIds: string[];
  onQuestionIdsChange: (questionIds: string[]) => void;
}

const QuestionBankSelector: React.FC<QuestionBankSelectorProps> = ({
  selectedQuestionIds,
  onQuestionIdsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const { data, isLoading, error } = useQuery(
    ['question-bank', searchTerm, currentPage],
    () => api.getQuestionsFromBank(), // This API call needs to support search and pagination
    { keepPreviousData: true }
  );

  const allQuestions = data || []; // Assuming data is an array of questions

  // Filter questions based on search term (client-side for now)
  const filteredQuestions = allQuestions.filter(q =>
    (q.stem_md || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handleAddQuestion = (questionId: string) => {
    if (!selectedQuestionIds.includes(questionId)) {
      onQuestionIdsChange([...selectedQuestionIds, questionId]);
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    onQuestionIdsChange(selectedQuestionIds.filter(id => id !== questionId));
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buscar preguntas por texto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {isLoading && <p>Cargando preguntas del banco...</p>}
      {error ? <p className="text-red-500">Error al cargar preguntas: {error instanceof Error ? error.message : String(error)}</p> : null}

      <div className="space-y-3">
        {paginatedQuestions.length === 0 && !isLoading && !error ? (
          <p className="text-gray-500">No se encontraron preguntas en el banco.</p>
        ) : (
          paginatedQuestions.map((question: any) => (
            <div key={question.question_id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{question.stem_md}</p>
                <p className="text-sm text-gray-600">Tipo: {question.type} | Puntos: {question.points}</p>
              </div>
              <div className="flex items-center space-x-2">
                {selectedQuestionIds.includes(question.question_id) ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveQuestion(question.question_id)}
                  >
                    <MinusCircleIcon className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddQuestion(question.question_id)}
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1 || isLoading}
          variant="secondary"
        >
          Anterior
        </Button>
        <span>Página {currentPage} de {totalPages}</span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages || isLoading}
          variant="secondary"
        >
          Siguiente
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
          <QuestionMarkCircleIcon className="h-5 w-5" />
          Preguntas Seleccionadas ({selectedQuestionIds.length})
        </h3>
        <ul className="list-disc list-inside text-sm text-blue-800 mt-2">
          {selectedQuestionIds.length === 0 ? (
            <li>Ninguna pregunta seleccionada manualmente. La IA generará preguntas.</li>
          ) : (
            selectedQuestionIds.map(id => <li key={id}>{id}</li>) // Ideally show question title/stem
          )}
        </ul>
      </div>
    </div>
  );
};

export default QuestionBankSelector;
