'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import FarmCountingGameOA1Analyze from '@/components/game/FarmCountingGameOA1Analyze'

// We can create a mapping from game template IDs to components
const gameTemplateMap = {
  'FarmCountingGameOA1Analyze': FarmCountingGameOA1Analyze,
  // Add other game templates here as we create them
};

export default function StudentEvaluationPlayPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const { data: gameData, isLoading, error } = useQuery(
    ['game-session-play', sessionId],
    () => api.getGameSessionForPlay(sessionId),
    { enabled: !!sessionId }
  );

  const handleGameEnd = async (score: number, results: any) => {
    console.log('Juego terminado', { score, results });
    try {
      await api.submitEvaluationAttempt(sessionId, score, results);
      console.log('Resultados de la evaluación guardados exitosamente.');
    } catch (submitError) {
      console.error('Error al guardar los resultados de la evaluación:', submitError);
      // Optionally show a toast or error message to the user
    }
    router.push(`/student/evaluation/${sessionId}/results?score=${score}`);
  };

  if (isLoading) {
    return <div>Cargando juego...</div>;
  }

  if (error) {
    return <div>Error al cargar el juego: {(error as Error).message}</div>;
  }

  if (!gameData || !gameData.game_template_id) {
    return <div>No se pudo determinar el juego a cargar.</div>;
  }

  const GameComponent = gameTemplateMap[gameData.game_template_id as keyof typeof gameTemplateMap];

  if (!GameComponent) {
    return <div>Juego no encontrado: {gameData.game_template_id}</div>;
  }

  return (
    <div>
      <GameComponent questions={gameData.questions} onGameEnd={handleGameEnd} />
    </div>
  );
}
