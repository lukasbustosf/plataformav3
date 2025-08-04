'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameSessionProvider } from '@/contexts/GameSessionContext';
import DiscoveryPath from '@/components/gamified-experiences/DiscoveryPath';
import CityBuilder from '@/components/gamified-experiences/CityBuilder';
import FarmCounter from '@/components/gamified-experiences/FarmCounter';
import MagicGarden from '@/components/gamified-experiences/MagicGarden';
import EnigmaBuilder from '@/components/gamified-experiences/EnigmaBuilder';

const ExperiencePage = () => {
    const params = useParams();
    const router = useRouter();
    const experienceId = params.id as string;
    
    // Determinar qué experiencia mostrar basado en el ID
    const getExperienceConfig = (id: string) => {
        switch (id) {
            case 'mock-experience-1':
                return {
                    title: 'Descubriendo la Ruta Numérica',
                    description: 'Explora patrones del 0 al 100',
                    subject: 'Matemáticas',
                    grade: '1° Básico',
                    oa_code: 'MA01OA01',
                    experience_type: 'Discovery_Learning',
                    component: 'discovery-path'
                };
            case 'mock-experience-2':
                return {
                    title: 'Diseña tu Ciudad Numérica',
                    description: 'Construye una ciudad usando números del 1 al 100',
                    subject: 'Matemáticas',
                    grade: '1° Básico',
                    oa_code: 'MA01OA01',
                    experience_type: 'Project_Based_Learning',
                    component: 'city-builder'
                };
            case 'mock-experience-3':
                return {
                    title: 'Granja Contador',
                    description: 'Cuenta animales de la granja del 1 al 20 con patrones especiales',
                    subject: 'Matemáticas',
                    grade: '1° Básico',
                    oa_code: 'MA01OA01',
                    experience_type: 'Interactive_Counting',
                    component: 'farm-counter'
                };
            case 'mock-experience-4':
                return {
                    title: 'El Jardín Mágico Personalizado',
                    description: 'Crea tu jardín mágico mientras aprendes a contar de manera adaptativa',
                    subject: 'Matemáticas',
                    grade: '1° Básico',
                    oa_code: 'MA01OA01',
                    experience_type: 'Adaptive_Learning',
                    component: 'magic-garden'
                };
            case 'mock-experience-5':
                return {
                    title: 'El Enigma Numérico',
                    description: 'Resuelve enigmas matemáticos usando herramientas de investigación',
                    subject: 'Matemáticas',
                    grade: '1° Básico',
                    oa_code: 'MA01OA01',
                    experience_type: 'Inquiry_Based_Learning',
                    component: 'enigma-builder'
                };
            default:
                return {
                    title: 'Experiencia Desconocida',
                    description: 'Experiencia no encontrada',
                    subject: 'Desconocido',
                    grade: 'Desconocido',
                    oa_code: 'Desconocido',
                    experience_type: 'Desconocido',
                    component: 'discovery-path'
                };
        }
    };

    const experience = getExperienceConfig(experienceId);
    const sessionId = `session_${Date.now()}`;

    // Renderizar el componente correcto según la experiencia
    const renderExperienceComponent = () => {
        switch (experience.component) {
            case 'city-builder':
                return <CityBuilder />;
            case 'farm-counter':
                return <FarmCounter />;
            case 'magic-garden':
                return <MagicGarden />;
            case 'enigma-builder':
                return <EnigmaBuilder />;
            case 'discovery-path':
            default:
                return (
                    <DiscoveryPath 
                        experienceId={experienceId}
                        sessionId={sessionId}
                    />
                );
        }
    };

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
                    {renderExperienceComponent()}
                </GameSessionProvider>
            </div>
        </div>
    );
};

export default ExperiencePage; 