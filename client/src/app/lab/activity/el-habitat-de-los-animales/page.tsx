'use client'

import React from 'react';
import { FaBookOpen, FaTools, FaVideo, FaCheckCircle, FaLink } from 'react-icons/fa';

// Component Imports
import ActivityDetailView from '@/components/lab/ActivityDetailView';
import GuideStepsMarkdown from '@/components/lab/GuideStepsMarkdown';
import MaterialsList from '@/components/lab/MaterialsList';
import EmbeddedVideo from '@/components/lab/EmbeddedVideo';
import AssessmentChecklist from '@/components/lab/AssessmentChecklist';
import { Button } from '@/components/ui/button';

// Mock Data for the activity
const activityData = {
  id: 'el-habitat-de-los-animales',
  title: 'El hábitat de los animales',
  cover_image_url: 'https://i.imgur.com/3MTaG0S.png',
  description: 'Instrucción General: La educadora dispone las 9 mesas para realizar grupos. Los párvulos se sientan en las mesas, donde tendrán dispuesto los juegos de memorice en el centro con las diferentes tarjetas de animales. La educadora motiva a los párvulos con un vídeo anexo y desarrolla la actividad didáctica con el juego de memorice. El jefe de grupo usa la gorra y es el encargado de: Compartir y repartir el recurso según las indicaciones de la educadora. Entregar la guía de trabajo y materiales a sus compañeros. Recoger y guardar el recurso en el laboratorio.',
  steps_markdown: `Instrucción Específica:

Objetivo de la actividad: Reconocer a través de la observación y de la comparación los diferentes hábitats de los animales.

La educadora para motivar a los párvulos los invita a observar el vídeo anexo del hábitat de los animales.
Luego los invita a observar y a manipular las tarjetas de los diferentes animales del memorice y les conversa acerca de cada uno de los animales que aparecen en las tarjetas, nombrando sus características y destacando donde habitan.
Les solicita a las niñas y a los niños poder colocar las tarjetas según el hábitat que les corresponde en las imágenes que están adjuntas en el PPT, proyectadas en la pizarra o en alguna pared donde los párvulos puedan pegar las tarjetas con los animales, con ayuda de una cinta masking, haciendo corresponder los animales con el hábitat proyectado.
Después de agrupados los animales por hábitats, la educadora, con ayuda de los jefes de grupos, les proporciona los recursos, (papelógrafo, lápices de colores y plumones de colores).
Les solicita a los párvulos escoger unos de los hábitats y representarlo en el papelógrafo junto con los animales del mismo.
Al final cada grupo tendrá un hábitat diferente con su respectiva tarjeta de animalito.

La educadora haciendo referencia a los hábitats pregunta a las niñas y niños:
- ¿Qué es un hábitat?
- ¿En qué lugar vive el conejo?
- ¿Dónde viven las tarántulas?
- ¿Alguno de esos animales pueden vivir con nosotros en casa?
- ¿Cuál de ellos?
- ¿Cuál no podría vivir en nuestras casas?
- ¿Conocen ustedes alguno de estos habitas?

Al terminar, los párvulos muestran sus trabajos y con la ayuda de la educadora los ubican en el panel.
El jefe de grupo se encarga de recoger y guardar el recurso en el laboratorio.`,
  learning_objectives: `OA 7: Describir semejanzas y diferencias respecto a características, necesidades básicas y cambios que ocurren en el proceso de crecimiento, en personas, animales y plantas.
OA 1: Participar en actividades y juegos colaborativos, planificando, acordando estrategias para un propósito común y asumiendo progresivamente responsabilidades en ellos.
OA 10: Reconocer progresivamente requerimientos esenciales de las prácticas de convivencia democrática, tales como: escucha de opiniones divergentes, el respeto por los demás, de los turnos, de los acuerdos de las mayorías.`,
  indicators_markdown: `- Se integra espontáneamente en juegos grupales.
- Nombra algunas características de personas, animales y plantas en diferentes etapas de su proceso de crecimiento.
- Practica algunas normas de convivencia democrática (escucha de opiniones divergentes, el respeto por los demás, los turnos, los acuerdos de la mayoría) ante la sugerencia de un adulto o par.`,
  materials: [
    { name: 'Juego de memorice de animales', quantity: 9 },
    { name: 'Gorras de jefe de grupo', quantity: 9 },
    { name: 'Guías de trabajo', quantity: 36 },
    { name: 'Papelógrafos', quantity: 9 },
    { name: 'Lápices de colores', quantity: 9 },
    { name: 'Plumones de colores', quantity: 9 },
    { name: 'Cinta masking', quantity: 1 }
  ],
  video_url: 'https://www.youtube.com/embed/O22z32cnG9s', // Example video
  assessment_markdown: `
- ¿Reconoce hábitats de animales?
- ¿Participa en la actividad grupal?
- ¿Nombra características de los animales?
- ¿Respeta turnos y opiniones?
`,
  resource_urls: [
    'https://docs.google.com/presentation/d/1oxTbRqWMA0t2uws5YWen2kVdMQB-Eiy0/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
    'https://docs.google.com/presentation/d/1LHrVhtwl77D6IQFTBHXv5ZswxSBc0QtH/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
    'https://drive.google.com/file/d/1qzmZOsGvIkdR9aXBD1C0i5oKxD1EYkqQ/view?usp=drive_link',
    'https://docs.google.com/document/d/1gJUuQ-OdGn_M2P3ju_TKRM0rBn0-yBHD/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
  ],
  oa_ids: ['OA 7', 'OA 1', 'OA 10'],
  duration_minutes: 45,
  group_size: 4,
  bloom_level: 'Reconocer'
};

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
  const { isFavorite, toggleFavorite } = useFavorites(activityData.id);

  // Define the tabs and their content using real data
  const tabs = [
    {
      id: 'materials',
      label: <><FaTools /> Materiales</>,
      content: <MaterialsList materials={(activityData.materials || []).map((material: any, index: number) => ({
        id: material.id || `material-${index}`,
        name: material.name,
        quantity: material.quantity,
        unit: material.unit || 'unidad',
        imageUrl: material.imageUrl
      }))} />
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
      coverImage={activityData.cover_image_url}
      description={activityData.description}
      stepsMarkdown={activityData.steps_markdown}
      objectivesMarkdown={activityData.learning_objectives}
      indicatorsMarkdown={activityData.indicators_markdown}
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
