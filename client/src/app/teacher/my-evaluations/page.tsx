'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import AssignEvaluationModal from '@/components/evaluations/AssignEvaluationModal';

const MyEvaluationsPage = () => {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [evaluationToAssign, setEvaluationToAssign] = useState<any | null>(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setIsLoading(true);
        const fetchedEvaluations = await api.getMyEvaluations();
        setEvaluations(fetchedEvaluations);
      } catch (err) {
        setError('No se pudieron cargar las evaluaciones.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  const handleAssignClick = (evaluation: any) => {
    setEvaluationToAssign(evaluation);
    setIsAssignModalOpen(true);
  };

  const handleEvaluationAssigned = () => {
    // Optionally refresh the list or show a success message
    alert('Evaluación asignada con éxito!');
    setIsAssignModalOpen(false);
    setEvaluationToAssign(null);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setEvaluationToAssign(null);
  };

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Evaluaciones</h1>
            <p className="text-sm text-gray-500 mt-1">
              Crea, asigna y revisa tus propias evaluaciones y juegos a partir del banco de preguntas.
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Link href="/teacher/my-evaluations/new" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear Nueva Evaluación
            </Link>
          </div>
        </header>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          {isLoading ? (
            <p>Cargando evaluaciones...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : evaluations.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Aún no has creado ninguna evaluación.</p>
              <p className="text-sm text-gray-400 mt-2">
                Haz clic en "Crear Nueva Evaluación" para empezar.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {evaluations.map(ev => (
                <li key={ev.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{ev.title}</p>
                    <p className="text-sm text-gray-600">{ev.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{ev.questionIds.length} preguntas</p>
                  </div>
                  <button 
                    onClick={() => handleAssignClick(ev)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600"
                  >
                    Asignar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {evaluationToAssign && (
        <AssignEvaluationModal
          isOpen={isAssignModalOpen}
          onClose={closeAssignModal}
          evaluation={evaluationToAssign}
          onAssigned={handleEvaluationAssigned}
        />
      )}
    </>
  );
};

export default MyEvaluationsPage;
