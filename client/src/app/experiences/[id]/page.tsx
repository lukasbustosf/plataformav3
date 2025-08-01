'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameSessionProvider } from '@/contexts/GameSessionContext';
import DiscoveryPath from '@/components/gamified-experiences/DiscoveryPath';

const ExperiencePage = () => {
    const params = useParams();
    const router = useRouter();
    const experienceId = params.id as string;
    
    // Datos mock de la experiencia
    const experience = {
        id: experienceId,
        title: 'Descubriendo la Ruta Numérica',
        description: 'Explora patrones del 0 al 100',
        subject: 'Matemáticas',
        grade: '1° Básico',
        oa_code: 'MA01OA01',
        experience_type: 'Discovery_Learning',
        settings: {}
    };

    const sessionId = `session_${Date.now()}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header de la experiencia */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => router.push('/experiences')}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                ← Volver
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {experience.title}
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    {experience.subject} • {experience.grade} • {experience.oa_code}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Estudiante</p>
                                <p className="font-semibold text-gray-900">Usuario Demo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido de la experiencia */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <GameSessionProvider>
                    <DiscoveryPath 
                        experienceId={experienceId}
                        sessionId={sessionId}
                    />
                </GameSessionProvider>
            </div>
        </div>
    );
};

export default ExperiencePage; 