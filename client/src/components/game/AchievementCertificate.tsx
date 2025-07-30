'use client';

import React from 'react';
import { StarIcon, AcademicCapIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface AchievementCertificateProps {
  studentName: string;
  gameTitle: string;
  score: number;
  accuracy: number;
}

const getAchievement = (accuracy: number) => {
  if (accuracy < 60) {
    return {
      title: 'Explorador Valiente',
      icon: <AcademicCapIcon className="h-16 w-16 text-amber-500" />,
      color: 'amber',
      description: '¡Has completado el desafío y has dado un gran primer paso!',
    };
  }
  if (accuracy < 90) {
    return {
      title: 'Arquitecto de Números',
      icon: <StarIcon className="h-16 w-16 text-gray-400" />,
      color: 'gray',
      description: '¡Demostraste una sólida comprensión de las habilidades!',
    };
  }
  return {
    title: 'Maestro del Conteo',
    icon: <SparklesIcon className="h-16 w-16 text-yellow-400" />,
    color: 'yellow',
    description: '¡Has dominado este desafío con una precisión excepcional!',
  };
};

export function AchievementCertificate({ studentName, gameTitle, score, accuracy }: AchievementCertificateProps) {
  const achievement = getAchievement(accuracy);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-t-8 border-${achievement.color}-500`}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          {achievement.icon}
        </div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Certificado de Logro</p>
        <h3 className={`text-3xl font-bold text-${achievement.color}-600`}>{achievement.title}</h3>
        <p className="text-lg text-gray-700 mt-2">
          Otorgado a <span className="font-semibold">{studentName}</span>
        </p>
        <p className="text-md text-gray-500 mt-1">
          por completar el desafío "{gameTitle}" con un puntaje de {score}.
        </p>
        <p className="mt-4 text-center text-gray-600 italic">
          "{achievement.description}"
        </p>
      </div>
    </div>
  );
}
