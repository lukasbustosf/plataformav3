'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/select'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Product {
  id: string;
  name: string;
}

export default function EditMaterialPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    name: '',
    internal_code: '',
    lab_product_id: '',
    quantity_per_kit: 1,
    status: 'active',
  });
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Cargar productos (kits)
        const productsResponse = await fetch('/api/lab/products');
        const productsResult = await productsResponse.json();
        if (productsResult.success) {
          setProducts(productsResult.data);
        } else {
          throw new Error('No se pudieron cargar los kits');
        }

        // Cargar datos del material a editar
        const materialResponse = await fetch(`/api/lab/materials/${id}`);
        const materialResult = await materialResponse.json();
        if (materialResult.success) {
          setFormData({
            name: materialResult.data.name,
            internal_code: materialResult.data.internal_code,
            lab_product_id: materialResult.data.lab_product_id || '',
            quantity_per_kit: materialResult.data.quantity_per_kit,
            status: materialResult.data.status,
          });
        } else {
          throw new Error(materialResult.message || 'No se pudo cargar el material');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lab/materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity_per_kit: Number(formData.quantity_per_kit)
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Error al actualizar el material');
      }

      router.push('/admin/lab-management');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardLayout><LoadingSpinner /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div>
        <Button variant="secondary" onClick={() => router.back()} className="mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Editar Material</h1>
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
              {loading ? 'Actualizando...' : 'Actualizar Material'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
