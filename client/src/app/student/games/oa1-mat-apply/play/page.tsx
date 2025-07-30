'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FarmCountingGameOA1Apply from '@/components/game/FarmCountingGameOA1Apply';

export default function GamePage() {
  const router = useRouter();

  const handleGameEnd = (score: number, results: any) => {
    console.log('Juego Terminado - Nivel Aplicar');
    console.log('Puntaje Final:', score);
    console.log('Resultados:', results);
    router.push(`/student/games/oa1-mat-apply/results?score=${score}`);
  };

  return (
    <div>
      <FarmCountingGameOA1Apply onGameEnd={handleGameEnd} />
    </div>
  );
}
