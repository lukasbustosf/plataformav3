'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeftIcon, InformationCircleIcon, ListBulletIcon, CheckCircleIcon, DocumentTextIcon, TagIcon, PhotoIcon, VideoCameraIcon, CubeIcon, ClockIcon, UserGroupIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Material { id: number; name: string; }

interface FieldGroupProps {
  label: string;
  children: React.ReactNode;
}

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const FieldGroup = ({ label, children }: FieldGroupProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const SectionCard = ({ title, icon, children }: SectionCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function EditActivityPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [materials, setMaterials] = useState<Material[]>([])
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem('auth_token');
        const [activityRes, materialsRes] = await Promise.all([
          fetch(`/api/lab/activities/id/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/lab/materials', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const activityResult = await activityRes.json();
        const materialsResult = await materialsRes.json();
        console.log('Respuesta actividad:', activityResult);
        console.log('Respuesta materiales:', materialsResult);

        if (activityResult.success) {
          const data = activityResult.data;
          setFormData({
            ...data,
            learning_objectives: Array.isArray(data.learning_objectives) ? data.learning_objectives.join('\n') : '',
            resource_urls: Array.isArray(data.resource_urls) ? data.resource_urls.join('\n') : '',
            oa_ids: Array.isArray(data.oa_ids) ? data.oa_ids.join('\n') : '',
            tags: Array.isArray(data.tags) ? data.tags.join('\n') : '',
          });
        } else { throw new Error('No se pudo cargar la actividad'); }

        if (materialsResult.success) {
          setMaterials(materialsResult.data);
        } else { throw new Error('No se pudo cargar los materiales'); }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Leer SIEMPRE el token actualizado de localStorage
      const token = localStorage.getItem('auth_token');
      console.log('🔍 [DEBUG] Token leído de localStorage:', token);
      console.log('🔍 [DEBUG] Token substring:', token?.substring(0, 50) + '...');
      
      const response = await fetch(`/api/lab/activities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        router.push('/admin/lab/activities');
      } else {
        setError(result.message || 'Error al actualizar la actividad');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div className="flex justify-center items-center h-64"><LoadingSpinner /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit}>
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Volver
            </Button>
            <h1 className="text-xl font-bold">Editar Actividad</h1>
            <div/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda - Contenido Principal */}
            <div className="lg:col-span-2 space-y-6">
              <SectionCard title="Información Básica" icon={<InformationCircleIcon className="h-6 w-6 text-gray-500"/>}>
                <FieldGroup label="Título"><Input name="title" required value={formData.title || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Slug"><Input name="slug" required value={formData.slug || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Descripción"><Textarea name="description" rows={4} value={formData.description || ''} onChange={handleChange} /></FieldGroup>
              </SectionCard>
              
              <SectionCard title="Contenido Pedagógico" icon={<BookOpenIcon className="h-6 w-6 text-gray-500"/>}>
                <FieldGroup label="Pasos (Markdown)"><Textarea name="steps_markdown" rows={12} value={formData.steps_markdown || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Objetivos de Aprendizaje (uno por línea)"><Textarea name="learning_objectives" rows={5} value={formData.learning_objectives || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Indicadores (Markdown)"><Textarea name="indicators_markdown" rows={5} value={formData.indicators_markdown || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Evaluación (Markdown)"><Textarea name="assessment_markdown" rows={5} value={formData.assessment_markdown || ''} onChange={handleChange} /></FieldGroup>
              </SectionCard>
            </div>

            {/* Columna Derecha - Metadata */}
            <div className="lg:col-span-1 space-y-6">
              <SectionCard title="Clasificación" icon={<TagIcon className="h-6 w-6 text-gray-500"/>}>
                <FieldGroup label="Material Asociado">
                  <Select name="lab_material_id" value={formData.lab_material_id || ''} onChange={handleChange}>
                    <option value="">Ninguno</option>
                    {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </Select>
                </FieldGroup>
                <FieldGroup label="Duración (minutos)"><Input name="duration_minutes" type="number" value={formData.duration_minutes || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Tamaño Grupo"><Input name="group_size" type="number" value={formData.group_size || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Dificultad (1-5)"><Input name="difficulty_level" type="number" value={formData.difficulty_level || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Ciclo">
                  <Select name="target_cycle" value={formData.target_cycle || ''} onChange={handleChange}>
                    <option value="PK">Pre-Kínder</option>
                    <option value="K1">Kínder</option>
                  </Select>
                </FieldGroup>
                <FieldGroup label="Estado">
                  <Select name="status" value={formData.status || ''} onChange={handleChange}>
                    <option value="draft">Borrador</option>
                    <option value="active">Activo</option>
                    <option value="archived">Archivado</option>
                  </Select>
                </FieldGroup>
              </SectionCard>

              <SectionCard title="Recursos y OAs" icon={<DocumentTextIcon className="h-6 w-6 text-gray-500"/>}>
                <FieldGroup label="URL Imagen Portada"><Input name="cover_image_url" value={formData.cover_image_url || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="URL Video"><Input name="video_url" value={formData.video_url || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="URLs Recursos (uno por línea)"><Textarea name="resource_urls" rows={4} value={formData.resource_urls || ''} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Códigos OA (uno por línea)"><Textarea name="oa_ids" rows={4} value={formData.oa_ids || ''} onChange={handleChange} /></FieldGroup>
              </SectionCard>
            </div>
          </div>
        </div>
        
        {/* Barra de Guardado Fija */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t p-4 mt-8">
          <div className="max-w-7xl mx-auto flex justify-end">
            {error && (
              <div className="text-red-500 font-bold text-center mt-4">
                Error: {error}
              </div>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Actividad'}
            </Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
