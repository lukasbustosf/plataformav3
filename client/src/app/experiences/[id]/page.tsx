'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { GameSessionProvider } from '@/contexts/GameSessionContext';
import DiscoveryPath from '@/components/gamified-experiences/DiscoveryPath';

interface ExperienceData {
    id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    oa_code: string;
    experience_type: string;
    settings: any;
}

const ExperiencePage = () => {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const experienceId = params.id as string;
    
    const [experience, setExperience] = useState<ExperienceData | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        loadExperience();
    }, [experienceId, user]);

    const loadExperience = async () => {
        try {
            setLoading(true);
            
            // Cargar datos de la experiencia
            const expResponse = await fetch(`/api/experiences/${experienceId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            if (!expResponse.ok) {
                throw new Error('Experiencia no encontrada');
            }

            const expData = await expResponse.json();
            setExperience(expData.experience);

            // Crear o cargar sesión de la experiencia
            const sessionResponse = await fetch(`/api/experiences/${experienceId}/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    user_id: user.id,
                    school_id: user.school_id
                })
            });

            if (!sessionResponse.ok) {
                throw new Error('Error al crear sesión');
            }

            const sessionData = await sessionResponse.json();
            setSessionId(sessionData.session_id);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const handleSessionUpdate = (sessionData: any) => {
        // Aquí se podría implementar lógica adicional cuando se actualiza la sesión
        console.log('Sesión actualizada:', sessionData);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">Cargando Experiencia...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => router.push('/experiences')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Volver a Experiencias
                    </button>
                </div>
            </div>
        );
    }

    if (!experience || !sessionId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Experiencia no disponible</h2>
                    <p className="text-gray-600 mb-4">Esta experiencia no está disponible en este momento.</p>
                    <button 
                        onClick={() => router.push('/experiences')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Volver a Experiencias
                    </button>
                </div>
            </div>
        );
    }

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
                                <p className="font-semibold text-gray-900">{user?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido de la experiencia */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <GameSessionProvider sessionId={sessionId} userId={user?.id}>
                    <DiscoveryPath 
                        sessionId={sessionId}
                        onSessionUpdate={handleSessionUpdate}
                    />
                </GameSessionProvider>
            </div>
        </div>
    );
};

export default ExperiencePage; 