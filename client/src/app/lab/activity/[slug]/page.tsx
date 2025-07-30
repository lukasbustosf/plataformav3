'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import { FaBookOpen, FaTools, FaVideo, FaCheckCircle, FaLink } from 'react-icons/fa';

// Component Imports
import ActivityDetailView from '@/components/lab/ActivityDetailView';
import GuideStepsMarkdown from '@/components/lab/GuideStepsMarkdown';
import MaterialsList from '@/components/lab/MaterialsList';
import EmbeddedVideo from '@/components/lab/EmbeddedVideo';
import AssessmentChecklist from '@/components/lab/AssessmentChecklist';
import { Button } from '@/components/ui/button';

// Hook Imports
import { useActivityDetail } from '@/hooks/lab/useLabActivities';

// This hook handles the logic for favoriting an activity
const useFavorites = (activityId?: string) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    if (activityId) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(activityId));
    }
  }, [activityId]);

  const toggleFavorite = () => {
    if (!activityId) return;
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      favorites = favorites.filter((id: string) => id !== activityId);
    } else {
      favorites.push(activityId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return { isFavorite, toggleFavorite };
};

export default function ActivityDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: activity, isLoading, error } = useActivityDetail(slug);
  const { isFavorite, toggleFavorite } = useFavorites(activity?.data?.id);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando actividad...</div>;
  }

  if (error || !activity) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: La actividad no pudo ser cargada.</div>;
  }

  const { data: activityData } = activity;

  // Define the tabs and their content using real data
  const tabs = [
    {
      id: 'materials',
      label: <><FaTools /> Materiales</>,
      content: <MaterialsList materials={activityData.materials || []} />
    },
    {
      id: 'video',
      label: <><FaVideo /> Video</>,
      content: <EmbeddedVideo videoUrl={activityData.video_url || ''} />
    },
    {
      id: 'assessment',
      label: <><FaCheckCircle /> Pauta de Evaluación</>,
      content: <AssessmentChecklist markdown={activityData.assessment_markdown || ''} />
    },
    {
      id: 'resources',
      label: <><FaLink /> Recursos</>,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recursos Adicionales</h2>
          {activityData.resource_urls && activityData.resource_urls.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {activityData.resource_urls.map((url: string, index: number) => (
                <li key={index}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a></li>
              ))}
            </ul>
          ) : <p>No hay recursos adicionales para esta actividad.</p>}
        </div>
      )
    }
  ].filter(tab => {
    // Conditionally hide tabs if their specific content is not available
    if (tab.id === 'video' && !activityData.video_url) return false;
    if (tab.id === 'assessment' && !activityData.assessment_markdown) return false;
    if (tab.id === 'resources' && (!activityData.resource_urls || activityData.resource_urls.length === 0)) return false;
    if (tab.id === 'materials' && (!activityData.materials || activityData.materials.length === 0)) return false;
    return true;
  });

  // Define the action buttons for the footer
  const actionButtons = (
    <>
      <Button variant="primary" size="lg">Registrar Ejecución</Button>
      <Button variant="outline" size="lg">Descargar PDF</Button>
      <Button variant="ghost" size="lg" onClick={toggleFavorite}>
        {isFavorite ? '❤️ Quitar de Favoritos' : '🤍 Añadir a Favoritos'}
      </Button>
    </>
  );

  return (
    <ActivityDetailView
      title={activityData.title}
      coverImage={activityData.cover_image_url || 'https://via.placeholder.com/1280x360/cccccc/888888?text=Actividad+Educativa'}
      description={activityData.description || 'No hay descripción disponible.'}
      stepsMarkdown={activityData.steps_markdown}
      objectivesMarkdown={activityData.learning_objectives}
      indicatorsMarkdown={activityData.indicators_markdown} // Assuming this field exists now
      metadataChips={
        <>
          {activityData.oa_ids?.map((tag: string) => (
            <span key={tag} className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
              {tag}
            </span>
          ))}
          <span className="bg-gray-700 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
            ⏱️ {activityData.duration_minutes} min
          </span>
          <span className="bg-gray-700 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
            👥 {activityData.group_size}
          </span>
          <span className="bg-gray-700 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
            💡 {activityData.bloom_level}
          </span>
        </>
      }
      tabs={tabs}
      actionButtons={actionButtons}
    />
  );
}