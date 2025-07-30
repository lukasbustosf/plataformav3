'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Tipos para los datos que cargaremos
interface Material {
  id: number;
  name: string;
}

export default function NewActivityPage() {
  const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    lab_material_id: '', // El nuevo campo clave
    // ... otros campos de la actividad
  });
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar los materiales para el menú desplegable
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/lab/materials');
        const result = await response.json();
        if (result.success) {
          setMaterials(result.data);
        } else {
          throw new Error(result.message || 'No se pudieron cargar los materiales');
        }
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchMaterials();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Generar slug automáticamente a partir del título
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, title: value, slug: slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
        body: JSON.stringify({
            ...formData,
            lab_material_id: parseInt(formData.lab_material_id)
        }),
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Ocurrió un error en el servidor');
      }
      
      alert('¡Actividad creada con éxito!');
      router.push('/admin/lab/activities'); // Redirigir a la lista de actividades
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <Button variant="secondary" onClick={() => router.back()} className="mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Crear Nueva Actividad de Laboratorio</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título de la Actividad</label>
              <Input id="title" name="title" type="text" required value={formData.title} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug (URL amigable)</label>
              <Input id="slug" name="slug" type="text" required value={formData.slug} onChange={handleChange} placeholder="Se genera automáticamente" />
            </div>
          </div>

          <div>
            <label htmlFor="lab_material_id" className="block text-sm font-medium text-gray-700">Material Principal Asociado</label>
            <Select id="lab_material_id" name="lab_material_id" required value={formData.lab_material_id} onChange={handleChange}>
              <option value="" disabled>Selecciona un material</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción Corta</label>
            <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} />
          </div>

          {/* Aquí se añadirían el resto de los campos del formulario para una actividad completa */}
          <p className="text-sm text-gray-500 text-center">Más campos del formulario de actividad (pasos, OAs, imágenes, etc.) se añadirán aquí.</p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Actividad'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
