'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { PlusIcon, BookOpenIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useDebounce } from '@/hooks/useDebounce'
import { api } from '@/lib/api'

interface ActivityCardProps {
  activity: any;
  onEdit: (id: string) => void;
  onDelete: (activity: any) => void;
  currentUserId: string;
}

const ActivityCard = ({ activity, onEdit, onDelete, currentUserId }: ActivityCardProps) => {
  const isOwner = activity.creator_id === currentUserId;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" 
         onClick={() => window.location.href = `/teacher/labs/activity/${activity.slug}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">{activity.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {activity.tags?.map((tag: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {activity.cover_image_url && (
          <img 
            src={activity.cover_image_url} 
            alt={activity.title}
            className="w-16 h-16 object-cover rounded-lg ml-4"
          />
        )}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>⏱️ {activity.duration_minutes} min</span>
          <span>📚 {activity.target_cycle}</span>
          <span>📖 {activity.subject}</span>
        </div>
        <div className="flex space-x-2">
          {isOwner && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(activity.id);
                }}
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(activity);
                }}
                className="text-red-600 hover:text-red-700"
              >
                Eliminar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de filtros mejorado
const FiltersSection = ({ 
  searchTerm, 
  setSearchTerm, 
  subjectFilter, 
  setSubjectFilter, 
  gradeFilter, 
  setGradeFilter, 
  materialFilter, 
  setMaterialFilter,
  materials,
  activeFilters,
  clearFilters
}: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header de filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
            {activeFilters > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeFilters} activo{activeFilters !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFilters > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800"
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido de filtros */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4 space-y-4">
          {/* Búsqueda */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar actividades
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="search"
                placeholder="Buscar por título, descripción, OA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Filtros en grid responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de Asignatura */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Asignatura
              </label>
              <select
                id="subject"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Todas las asignaturas</option>
                <option value="Ciencias Naturales">Ciencias Naturales</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Lenguaje">Lenguaje</option>
                <option value="Historia">Historia</option>
              </select>
            </div>

            {/* Filtro de Nivel */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Nivel Educativo
              </label>
              <select
                id="grade"
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Todos los niveles</option>
                <option value="Pre-Kínder">Pre-Kínder</option>
                <option value="Kínder">Kínder</option>
                <option value="1º Básico">1º Básico</option>
                <option value="2º Básico">2º Básico</option>
                <option value="3º Básico">3º Básico</option>
              </select>
            </div>

            {/* Filtro de Material */}
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">
                Material de Laboratorio
              </label>
              <select
                id="material"
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Todos los materiales</option>
                {materials.map((material: any) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Indicadores de filtros activos */}
          {activeFilters > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Búsqueda: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 hover:text-blue-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {subjectFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Asignatura: {subjectFilter}
                  <button
                    onClick={() => setSubjectFilter('all')}
                    className="ml-1 hover:text-green-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {gradeFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Nivel: {gradeFilter}
                  <button
                    onClick={() => setGradeFilter('all')}
                    className="ml-1 hover:text-purple-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {materialFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Material: {materials.find((m: any) => m.id == materialFilter)?.name || 'Seleccionado'}
                  <button
                    onClick={() => setMaterialFilter('all')}
                    className="ml-1 hover:text-orange-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main page component
export default function LabActivitiesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Calcular filtros activos
  const activeFilters = [
    searchTerm,
    subjectFilter !== 'all',
    gradeFilter !== 'all',
    materialFilter !== 'all'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm('');
    setSubjectFilter('all');
    setGradeFilter('all');
    setMaterialFilter('all');
  };

  const fetchMaterials = useCallback(async () => {
    try {
      console.log('🔍 DEBUG: Llamando a getLabMaterials...');
      const response = await api.getLabMaterials();
      console.log('🔍 DEBUG: Respuesta de materiales:', response);
      console.log('🔍 DEBUG: Response.data:', response?.data);
      console.log('🔍 DEBUG: Response.data.length:', response?.data?.length);
      
      const materialsData = response?.data || response || [];
      console.log('🔍 DEBUG: Materials data final:', materialsData);
      
      setMaterials(materialsData);
      console.log('🔍 DEBUG: Materials state actualizado:', materialsData);
    } catch (err) {
      console.error('❌ DEBUG: Error en fetchMaterials:', err);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (debouncedSearchTerm) params.searchTerm = debouncedSearchTerm;
      if (subjectFilter !== 'all') params.subject = subjectFilter;
      if (gradeFilter !== 'all') params.grade_level = gradeFilter;
      if (materialFilter !== 'all') params.lab_material_id = materialFilter;

      console.log('🔍 DEBUG: Llamando a API con params:', params);
      const response = await api.getLabActivities(params);
      console.log('🔍 DEBUG: Respuesta completa de API:', response);
      console.log('🔍 DEBUG: Response.data:', response?.data);
      console.log('🔍 DEBUG: Response.data.length:', response?.data?.length);
      
      // Manejar tanto response.data como response directo
      const activitiesData = response?.data || response || [];
      console.log('🔍 DEBUG: Activities data final:', activitiesData);
      
      setActivities(activitiesData);
      console.log('🔍 DEBUG: Activities state actualizado:', response?.data || []);
    } catch (err: any) {
      console.error('❌ DEBUG: Error en fetchActivities:', err);
      setError(err.message || 'No se pudieron cargar las actividades.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, subjectFilter, gradeFilter, materialFilter]);

  useEffect(() => {
    fetchMaterials();
    fetchActivities();
  }, [fetchMaterials, fetchActivities]);

  const openDeleteModal = (activity: any) => {
    setActivityToDelete(activity);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setActivityToDelete(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!activityToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await api.deleteLabActivity(activityToDelete.id);
      await fetchActivities();
      closeDeleteModal();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (activityId: string) => {
    alert(`Funcionalidad de editar (ID: ${activityId}) no implementada para profesores todavía.`);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header mejorado */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpenIcon className="h-8 w-8 mr-3 text-blue-600" />
              Catálogo de Actividades del Laboratorio
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Explora, filtra y busca actividades didácticas para enriquecer tus clases.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/teacher/labs/activities/create')}
            className="mt-4 sm:mt-0"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear Actividad
          </Button>
        </header>

        {/* Filtros mejorados */}
        <FiltersSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          gradeFilter={gradeFilter}
          setGradeFilter={setGradeFilter}
          materialFilter={materialFilter}
          setMaterialFilter={setMaterialFilter}
          materials={materials}
          activeFilters={activeFilters}
          clearFilters={clearFilters}
        />

        {/* Contenido */}
        <div className="space-y-4">
          {(() => {
            console.log('🔍 DEBUG: Render - activities.length:', activities.length);
            console.log('🔍 DEBUG: Render - activities:', activities);
            return null;
          })()}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity: any) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onEdit={handleEdit}
                  onDelete={openDeleteModal}
                  currentUserId={user?.user_id || ''}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron actividades</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeFilters > 0 
                  ? 'Intenta ajustar los filtros para encontrar más actividades.'
                  : 'Crea tu primera actividad para comenzar.'
                }
              </p>
              {activeFilters > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {isModalOpen && activityToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmar eliminación
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar la actividad "{activityToDelete.title}"? 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}