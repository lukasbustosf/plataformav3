'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { 
  CubeIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Definimos un tipo para los datos que esperamos de la API
interface Material {
  id: number;
  name: string;
  internal_code: string;
  quantity_per_kit: number;
  status: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
  lab_material: Material[];
}

export default function AdminLabManagementPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductsAndMaterials = async () => {
      setLoading(true)
      setError(null)
      try {
        // Usamos la API que ya migramos a Prisma
        const response = await fetch('/api/lab/products');
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue exitosa');
        }
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Falló al obtener los productos');
        }
        
        setProducts(result.data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductsAndMaterials()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario de Laboratorio</h1>
            <p className="text-gray-600">Administra los kits y materiales disponibles en la plataforma.</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => router.push('/admin/lab-management/materials/new')}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear Nuevo Material
            </Button>
          </div>
        </div>

        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
                  <p className="text-sm text-gray-500">Código del Kit: {product.code}</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {product.lab_material.length > 0 ? (
                    product.lab_material.map((material) => (
                      <div key={material.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center">
                          <CubeIcon className="h-6 w-6 text-gray-400 mr-4"/>
                          <div>
                            <p className="font-medium text-gray-900">{material.name}</p>
                            <p className="text-sm text-gray-500">Código: {material.internal_code} | Cantidad: {material.quantity_per_kit}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              material.status === 'active' ? 'bg-green-100 text-green-800' :
                              material.status === 'out_of_stock' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {material.status}
                            </span>
                          <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/lab-management/materials/edit/${material.id}`)}>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => alert('Función de eliminar no implementada')}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <p>Este kit no tiene materiales asociados.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

 