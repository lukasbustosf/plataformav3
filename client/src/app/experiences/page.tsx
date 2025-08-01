'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface Experience {
    id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    oa_code: string;
    experience_type: string;
    icon: string;
    color: string;
    status: 'available' | 'locked' | 'completed';
    progress?: number;
}

const ExperiencesPage = () => {
    const { user } = useAuth();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadExperiences();
    }, []);

    const loadExperiences = async () => {
        try {
            setLoading(true);
            
            const response = await fetch('/api/experiences', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar experiencias');
            }

            const data = await response.json();
            setExperiences(data.experiences || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'locked': return 'bg-gray-100 text-gray-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available': return 'Disponible';
            case 'locked': return 'Bloqueado';
            case 'completed': return 'Completado';
            default: return 'Desconocido';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">Cargando Experiencias...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Error al Cargar</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={loadExperiences}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                🎮 Experiencias Gamificadas
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Descubre y aprende a través de experiencias interactivas
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Bienvenido</p>
                                <p className="font-semibold text-gray-900">{user?.name || 'Estudiante'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filtros */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Asignatura:</span>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option value="">Todas</option>
                                <option value="matematicas">Matemáticas</option>
                                <option value="lenguaje">Lenguaje</option>
                                <option value="ciencias">Ciencias</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Nivel:</span>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option value="">Todos</option>
                                <option value="1">1° Básico</option>
                                <option value="2">2° Básico</option>
                                <option value="3">3° Básico</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid de Experiencias */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiences.map((experience) => (
                        <div 
                            key={experience.id}
                            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                                experience.status === 'locked' ? 'opacity-60' : ''
                            }`}
                        >
                            {/* Header de la tarjeta */}
                            <div 
                                className="h-32 rounded-t-xl flex items-center justify-center"
                                style={{ backgroundColor: experience.color + '20' }}
                            >
                                <div className="text-6xl">{experience.icon}</div>
                            </div>

                            {/* Contenido de la tarjeta */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(experience.status)}`}>
                                        {getStatusText(experience.status)}
                                    </span>
                                    <span className="text-xs text-gray-500">{experience.grade}</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {experience.title}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {experience.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="font-medium">Asignatura:</span>
                                        <span className="ml-2">{experience.subject}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="font-medium">OA:</span>
                                        <span className="ml-2">{experience.oa_code}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="font-medium">Tipo:</span>
                                        <span className="ml-2">{experience.experience_type}</span>
                                    </div>
                                </div>

                                {/* Barra de progreso */}
                                {experience.progress !== undefined && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Progreso</span>
                                            <span>{experience.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${experience.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Botón de acción */}
                                <Link 
                                    href={experience.status === 'available' ? `/experiences/${experience.id}` : '#'}
                                    className={`w-full text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                                        experience.status === 'available'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {experience.status === 'available' ? 'Comenzar Experiencia' : 'Bloqueado'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mensaje si no hay experiencias */}
                {experiences.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎮</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No hay experiencias disponibles
                        </h3>
                        <p className="text-gray-600">
                            Pronto tendremos nuevas experiencias gamificadas para ti.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperiencesPage; 