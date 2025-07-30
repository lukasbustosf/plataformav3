'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

// Definimos un tipo para los kits que cargaremos
interface Product {
  id: string;
  name: string;
}

export default function NewMaterialPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    name: '',
    internal_code: '',
    lab_product_id: '',
    quantity_per_kit: 1,
    status: 'active',
  });
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar los kits (products) para poder seleccionarlos en el formulario
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/lab/products');
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        } else {
          throw new Error(result.message || 'No se pudieron cargar los kits');
        }
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lab/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity_per_kit: Number(formData.quantity_per_kit)
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al crear el material');
      }

      // Si es exitoso, redirigir a la página de gestión
      router.push('/admin/lab-management');
      
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
        <h1 className="text-2xl font-bold mb-6">Crear Nuevo Material</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Material</label>
            <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="internal_code" className="block text-sm font-medium text-gray-700">Código Interno</label>
            <Input id="internal_code" name="internal_code" type="text" required value={formData.internal_code} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="lab_product_id" className="block text-sm font-medium text-gray-700">Kit al que Pertenece</label>
            <Select id="lab_product_id" name="lab_product_id" required value={formData.lab_product_id} onChange={handleChange}>
              <option value="" disabled>Selecciona un kit</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="quantity_per_kit" className="block text-sm font-medium text-gray-700">Cantidad por Kit</label>
            <Input id="quantity_per_kit" name="quantity_per_kit" type="number" required value={formData.quantity_per_kit} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
            <Select id="status" name="status" required value={formData.status} onChange={handleChange}>
              <option value="active">Activo</option>
              <option value="out_of_stock">Sin Stock</option>
              <option value="discontinued">Descontinuado</option>
            </Select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Material'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
