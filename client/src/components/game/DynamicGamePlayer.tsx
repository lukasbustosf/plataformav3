'use client'

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

import CounterNumberLineEngine from './engines/CounterNumberLineEngine';

import { useRouter } from 'next/navigation';

interface DynamicGamePlayerProps {
  sessionId: string;
}

const DynamicGamePlayer: React.FC<DynamicGamePlayerProps> = ({ sessionId }) => {
  const router = useRouter();
  const {
    data: gameData,
    isLoading,
    error,
  } = useQuery(['game-session-play', sessionId], () => api.getGameSessionForPlay(sessionId));

  if (isLoading) {
    return <div>Cargando juego...</div>;
  }

  if (error) {
    return <div>Error al cargar el juego: {(error as Error).message}</div>;
  }

  const renderGameEngine = () => {
    if (!gameData) return <div>No se encontraron datos del juego.</div>;

    switch (gameData.engine_id) {
      case 'ENG01':
        return <CounterNumberLineEngine questions={gameData.questions} onGameEnd={handleGameEnd} />;
      // case 'ENG02':
      //   return <DragDropEngine questions={gameData.questions} onGameEnd={handleGameEnd} />;
      default:
        return <div>Motor de juego no soportado: {gameData.engine_id}</div>;
    }
  };

  const handleGameEnd = (score: number, results: any) => {
    console.log('Juego terminado', { score, results });
    router.push(`/student/evaluation/${sessionId}/results?score=${score}`);
  };

  return <div>{renderGameEngine()}</div>;
};

export default DynamicGamePlayer;
