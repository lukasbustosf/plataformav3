'use client'

import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

interface LogExecutionModalProps {
  open: boolean;
  onClose: () => void;
  activityId: string;
  onSuccess: () => void;
}

export function LogExecutionModal({ open, onClose, activityId, onSuccess }: LogExecutionModalProps) {
  const [formData, setFormData] = useState({
    execution_date: new Date().toISOString().split('T')[0],
    student_count: '',
    notes: '',
    course_id: '',
    duration_actual_minutes: '',
    success_rating: '',
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  // En un futuro, esto llamaría a /api/my-courses para obtener los cursos del profesor
  useEffect(() => {
    setCourses([
      { course_id: 'demo-course-1', course_name: '1º Básico A (Demo)' },
      { course_id: 'demo-course-2', course_name: 'Kínder B (Demo)' },
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidenceFile(e.target.files[0]);
    } else {
      setEvidenceFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let body: FormData | string;
      let headers = {};
      if (evidenceFile) {
        body = new FormData();
        Object.entries(formData).forEach(([key, value]) => (body as FormData).append(key, value));
        body.append('activity_id', activityId);
        body.append('evidence', evidenceFile);
      } else {
        headers = { 'Content-Type': 'application/json' };
        body = JSON.stringify({ ...formData, activity_id: activityId });
      }
      const response = await fetch('/api/lab/activity-logs', {
        method: 'POST',
        headers,
        body,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Error al registrar');
      onSuccess();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Registrar Ejecución de Actividad
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="execution_date" className="block text-sm font-medium text-gray-700">Fecha de Ejecución</label>
                    <Input type="date" name="execution_date" id="execution_date" value={formData.execution_date} onChange={handleChange} required />
                  </div>
                  <div>
                    <label htmlFor="student_count" className="block text-sm font-medium text-gray-700">N° de Estudiantes Participantes</label>
                    <Input type="number" name="student_count" id="student_count" placeholder="Ej: 25" value={formData.student_count} onChange={handleChange} required />
                  </div>
                  <div>
                    <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">Curso (Opcional)</label>
                    <Select name="course_id" id="course_id" value={formData.course_id} onChange={handleChange}>
                      <option value="">Seleccionar curso</option>
                      {courses.map((c: any) => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas / Observaciones (Opcional)</label>
                    <Textarea name="notes" id="notes" rows={4} value={formData.notes} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="duration_actual_minutes" className="block text-sm font-medium text-gray-700">Duración Real (minutos)</label>
                    <Input type="number" name="duration_actual_minutes" id="duration_actual_minutes" placeholder="Ej: 45" value={formData.duration_actual_minutes} onChange={handleChange} required />
                  </div>
                  <div>
                    <label htmlFor="success_rating" className="block text-sm font-medium text-gray-700">Valoración de la Actividad</label>
                    <select
                      name="success_rating"
                      id="success_rating"
                      value={formData.success_rating}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                    >
                      <option value="">Selecciona una valoración</option>
                      <option value="1">★☆☆☆☆ (1)</option>
                      <option value="2">★★☆☆☆ (2)</option>
                      <option value="3">★★★☆☆ (3)</option>
                      <option value="4">★★★★☆ (4)</option>
                      <option value="5">★★★★★ (5)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">Evidencia (imagen o PDF, opcional)</label>
                    <input
                      type="file"
                      id="evidence"
                      name="evidence"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                    />
                    {evidenceFile && <span className="text-xs text-gray-500">Archivo seleccionado: {evidenceFile.name}</span>}
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
