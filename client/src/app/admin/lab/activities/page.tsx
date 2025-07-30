'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { PlusIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal' // Importar el modal

export default function AdminLabActivitiesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para el modal de eliminación
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchActivities = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/lab/activities')
      if (!response.ok) throw new Error('Failed to fetch activities')
      const result = await response.json()
      if (result.success) {
        setActivities(result.data)
      } else {
        throw new Error(result.message || 'An error occurred')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching lab activities:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const openDeleteModal = (activity: any) => {
    setActivityToDelete(activity)
    setIsModalOpen(true)
  }

  const closeDeleteModal = () => {
    setActivityToDelete(null)
    setIsModalOpen(false)
  }

  const handleDelete = async () => {
    if (!activityToDelete) return
    setIsDeleting(true)
    setError(null)
    try {
      const response = await fetch(`/api/lab/activities/${activityToDelete.id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Error al eliminar la actividad')
      }
      // Refrescar la lista de actividades
      await fetchActivities()
      closeDeleteModal()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Título',
      render: (_value: any, item: any) => (
        <div>
          <div className="font-medium text-gray-900">{item?.title || 'Sin Título'}</div>
          <div className="text-sm text-gray-500">{item?.slug || ''}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_value: any, item: any) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item?.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {item?.status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha de Creación',
      render: (_value: any, item: any) => (
        <div className="text-sm text-gray-500">
          {item?.created_at ? new Date(item.created_at).toLocaleDateString() : 'Fecha inválida'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: any, item: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => item?.id && router.push(`/admin/lab/activities/edit/${item.id}`)}
            disabled={!item?.id}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={!item?.id}
            onClick={() => openDeleteModal(item)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-3" />
              Catálogo de Actividades del Laboratorio
            </h1>
            <p className="text-gray-600">
              Gestiona todas las actividades disponibles en el módulo de laboratorios.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/admin/lab/activities/new')}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear Nueva Actividad
          </Button>
        </div>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

        <div className="bg-white rounded-lg shadow">
          <ResponsiveTable
            data={activities}
            columns={columns}
            loading={loading}
            emptyMessage="No se encontraron actividades."
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Eliminar Actividad"
        message={`¿Estás seguro de que quieres eliminar la actividad "${activityToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        loading={isDeleting}
      />
    </DashboardLayout>
  )
}
