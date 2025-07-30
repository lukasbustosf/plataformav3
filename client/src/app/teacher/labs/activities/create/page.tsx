'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function TeacherNewActivityPage() {
  const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>([])
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    description: '',
    lab_material_id: '',
    steps_markdown: '',
    learning_objectives: '',
    indicators_markdown: '',
    assessment_markdown: '',
    resource_urls: '',
    video_url: '',
    cover_image_url: '',
    oa_ids: '',
    tags: '',
    duration_minutes: 45,
    group_size: 4,
    difficulty_level: 2,
    target_cycle: 'PK',
    status: 'draft',
  });
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/lab/materials');
        const result = await response.json();
        if (result.success) {
          setMaterials(result.data);
        } else {
          throw new Error('No se pudieron cargar los materiales');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData((prev: any) => ({ ...prev, title: value, slug: slug }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/lab/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      router.push('/teacher/labs/activities');
    } catch (err: any) {
      setError(err.message);
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
            <h1 className="text-xl font-bold">Crear Nueva Actividad</h1>
            <div/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <SectionCard title="Información Básica" icon={<InformationCircleIcon className="h-6 w-6 text-gray-500"/>}>
                <FieldGroup label="Título"><Input name="title" required value={formData.title} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Slug"><Input name="slug" required value={formData.slug} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Descripción"><Textarea name="description" rows={4} value={formData.description} onChange={handleChange} /></FieldGroup>
              </SectionCard>
              
              <SectionCard title="Contenido Pedagógico" icon={<BookOpenIcon className="h-6 w-6 text-gray-500"/>}>
                <FieldGroup label="Pasos (Markdown)"><Textarea name="steps_markdown" rows={12} value={formData.steps_markdown} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Objetivos de Aprendizaje (uno por línea)"><Textarea name="learning_objectives" rows={5} value={formData.learning_objectives} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Indicadores (Markdown)"><Textarea name="indicators_markdown" rows={5} value={formData.indicators_markdown} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Evaluación (Markdown)"><Textarea name="assessment_markdown" rows={5} value={formData.assessment_markdown} onChange={handleChange} /></FieldGroup>
              </SectionCard>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <SectionCard title="Clasificación" icon={<TagIcon className="h-6 w-6 text-gray-500"/>}>
                <FieldGroup label="Material Asociado">
                  <Select name="lab_material_id" required value={formData.lab_material_id} onChange={handleChange}>
                    <option value="" disabled>Selecciona un material</option>
                    {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </Select>
                </FieldGroup>
                <FieldGroup label="Duración (minutos)"><Input name="duration_minutes" type="number" value={formData.duration_minutes} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Tamaño Grupo"><Input name="group_size" type="number" value={formData.group_size} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Dificultad (1-5)"><Input name="difficulty_level" type="number" value={formData.difficulty_level} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Ciclo">
                  <Select name="target_cycle" value={formData.target_cycle} onChange={handleChange}>
                    <option value="PK">Pre-Kínder</option>
                    <option value="K1">Kínder</option>
                  </Select>
                </FieldGroup>
              </SectionCard>

              <SectionCard title="Recursos y OAs" icon={<DocumentTextIcon className="h-6 w-6 text-gray-500"/>}>
                <FieldGroup label="URL Imagen Portada"><Input name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="URL Video"><Input name="video_url" value={formData.video_url} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="URLs Recursos (uno por línea)"><Textarea name="resource_urls" rows={4} value={formData.resource_urls} onChange={handleChange} /></FieldGroup>
                <FieldGroup label="Códigos OA (uno por línea)"><Textarea name="oa_ids" rows={4} value={formData.oa_ids} onChange={handleChange} /></FieldGroup>
              </SectionCard>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t p-4 mt-8">
          <div className="max-w-7xl mx-auto flex justify-end">
            {error && <p className="text-sm text-red-600 mr-4 self-center">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Actividad'}
            </Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
