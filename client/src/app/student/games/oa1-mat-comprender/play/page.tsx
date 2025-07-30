'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FarmCountingGameOA1Comprehend from '@/components/game/FarmCountingGameOA1Comprehend';

export default function GamePage() {
  const router = useRouter();

  const handleGameEnd = (score: number, results: any) => {
    console.log('Juego Terminado - Nivel Comprender');
    console.log('Puntaje Final:', score);
    console.log('Resultados:', results);
    router.push(`/student/games/oa1-mat-comprender/results?score=${score}`);
  };

  return (
    <div>
      <FarmCountingGameOA1Comprehend onGameEnd={handleGameEnd} />
    </div>
  );
}
