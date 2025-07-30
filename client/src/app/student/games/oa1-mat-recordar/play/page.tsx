'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FarmCountingGameOA1Remember from '@/components/game/FarmCountingGameOA1Remember';

export default function GamePage() {
  const router = useRouter();

  const handleGameEnd = (score: number, results: any) => {
    console.log('Juego Terminado - Nivel Recordar');
    console.log('Puntaje Final:', score);
    console.log('Resultados:', results);
    router.push(`/student/games/oa1-mat-recordar/results?score=${score}`);
  };

  return (
    <div>
      <FarmCountingGameOA1Remember onGameEnd={handleGameEnd} />
    </div>
  );
}