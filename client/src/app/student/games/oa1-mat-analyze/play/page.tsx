'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FarmCountingGameOA1Analyze from '@/components/game/FarmCountingGameOA1Analyze';

export default function GamePage() {
  const router = useRouter();

  const handleGameEnd = (score: number, results: any) => {
    console.log('Juego Terminado - Nivel Analizar');
    console.log('Puntaje Final:', score);
    console.log('Resultados:', results);
    router.push(`/student/games/oa1-mat-analyze/results?score=${score}`);
  };

  return (
    <div>
      <FarmCountingGameOA1Analyze questions={[]} onGameEnd={handleGameEnd} />
    </div>
  );
}
