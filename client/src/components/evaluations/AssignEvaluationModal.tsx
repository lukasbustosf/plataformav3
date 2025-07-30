'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import type { Class } from '@/types';

interface AssignEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: any; // The evaluation to assign
  onAssigned: () => void; // Callback after successful assignment
}

const AssignEvaluationModal: React.FC<AssignEvaluationModalProps> = ({ isOpen, onClose, evaluation, onAssigned }) => {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [availableEngines, setAvailableEngines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [classesRes, enginesRes] = await Promise.all([
            api.getClasses(),
            api.getGameEngines(),
          ]);
          setAvailableClasses(classesRes.classes);
          setAvailableEngines(enginesRes);
          if (enginesRes.length > 0) setSelectedEngine(enginesRes[0].id);
        } catch (err: unknown) {
          setError('Error al cargar datos iniciales.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleClassChange = (classId: string) => {
    setSelectedClasses(prevSelected => 
      prevSelected.includes(classId) 
        ? prevSelected.filter(id => id !== classId)
        : [...prevSelected, classId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (selectedClasses.length === 0 || !dueDate || !selectedEngine) {
      setError('Por favor, selecciona al menos una clase, una fecha límite y un formato de juego.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await api.assignEvaluation({
        evaluationId: evaluation.id,
        classIds: selectedClasses,
        dueDate,
        engineId: selectedEngine,
      });
      console.log('Assignment successful, gameSessionId:', result.gameSessionId);
      onAssigned();
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || 'No se pudo asignar la evaluación.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Asignar Evaluación: {evaluation?.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {isLoading && <p>Cargando clases y formatos de juego...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Seleccionar Clases</label>
            <div className="mt-1 border rounded-md p-2 h-32 overflow-y-auto">
              {availableClasses.length === 0 ? (
                <p className="text-sm text-gray-500">No hay clases disponibles.</p>
              ) : (
                availableClasses.map(cls => (
                  <div key={cls.class_id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`class-${cls.class_id}`}
                      checked={selectedClasses.includes(cls.class_id)}
                      onChange={() => handleClassChange(cls.class_id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`class-${cls.class_id}`} className="ml-2 text-sm text-gray-700">
                      {cls.class_name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <label htmlFor="engine" className="block text-sm font-medium text-gray-700">Formato de Juego</label>
            <select
              id="engine"
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              {availableEngines.map(engine => (
                <option key={engine.id} value={engine.id}>{engine.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Fecha Límite</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="border border-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 text-sm" disabled={isLoading}>
                Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? 'Asignando...' : 'Asignar Evaluación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignEvaluationModal;