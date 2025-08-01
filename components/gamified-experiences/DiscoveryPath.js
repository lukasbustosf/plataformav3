import React, { useState, useEffect, useContext } from 'react';
import { GameSessionContext } from '../../contexts/GameSessionContext';
import WorldNavigation from './components/WorldNavigation';
import PatternDiscoveryArea from './components/PatternDiscoveryArea';
import FeedbackSystem from './components/FeedbackSystem';
import RewardsInterface from './components/RewardsInterface';
import FamilyMode from './components/FamilyMode';
import './DiscoveryPath.css';

const DiscoveryPath = ({ sessionId, onSessionUpdate }) => {
    const { gameState, updateProgress, addReward, recordHypothesis } = useContext(GameSessionContext);
    
    // Estados locales del componente
    const [currentWorld, setCurrentWorld] = useState('bosque_decenas');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [familyMode, setFamilyMode] = useState(false);
    const [showRewards, setShowRewards] = useState(false);
    
    // Configuración de la experiencia
    const experienceConfig = {
        worlds: [
            {
                id: 'bosque_decenas',
                name: 'Bosque de las Decenas',
                range: '0-20',
                pattern: 'de 1 en 1',
                color: '#4CAF50',
                icon: '🌳'
            },
            {
                id: 'rio_cincos',
                name: 'Río de los Cincos',
                range: '0-50',
                pattern: 'de 5 en 5',
                color: '#2196F3',
                icon: '🌊'
            },
            {
                id: 'montana_cientos',
                name: 'Montaña de los Cientos',
                range: '0-100',
                pattern: 'de 10 en 10',
                color: '#FF9800',
                icon: '⛰️'
            }
        ],
        tools: [
            {
                id: 'calculadora_patrones',
                name: 'Calculadora de Patrones',
                description: 'Herramienta para descubrir reglas numéricas',
                unlocked: false,
                icon: '🧮'
            },
            {
                id: 'microscopio_numerico',
                name: 'Microscopio Numérico',
                description: 'Herramienta para analizar secuencias',
                unlocked: false,
                icon: '🔬'
            }
        ]
    };

    // Cargar estado inicial de la sesión
    useEffect(() => {
        loadSessionState();
    }, [sessionId]);

    const loadSessionState = async () => {
        try {
            setIsLoading(true);
            
            const response = await fetch(`/api/experiences/discovery-path/${sessionId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': gameState.userId // Asumiendo que está en el contexto
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar la sesión');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Actualizar el estado del juego con los datos de la sesión
                updateProgress({
                    currentWorld: data.data.current_world,
                    completedChallenges: data.data.completed_challenges,
                    unlockedTools: data.data.unlocked_tools,
                    rewards: data.data.rewards
                });
                
                setCurrentWorld(data.data.current_world);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error al cargar sesión:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar cambio de mundo
    const handleWorldChange = (worldId) => {
        setCurrentWorld(worldId);
        updateProgress({ currentWorld: worldId });
    };

    // Manejar acción del usuario
    const handleUserAction = async (actionType, actionData) => {
        try {
            const response = await fetch(`/api/experiences/discovery-path/${sessionId}/action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': gameState.userId
                },
                body: JSON.stringify({
                    action_type: actionType,
                    data: actionData,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al procesar la acción');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Actualizar estado local
                if (data.data.progress_update) {
                    updateProgress(data.data.progress_update);
                }
                
                // Agregar recompensas si las hay
                if (data.data.rewards && data.data.rewards.length > 0) {
                    data.data.rewards.forEach(reward => {
                        addReward({
                            id: reward,
                            type: 'achievement',
                            earned_at: new Date().toISOString()
                        });
                    });
                }
                
                // Mostrar feedback
                if (data.data.feedback) {
                    // Aquí se mostraría el feedback visual/auditivo
                    console.log('Feedback:', data.data.feedback);
                }
            }
        } catch (err) {
            console.error('Error al procesar acción:', err);
            setError(err.message);
        }
    };

    // Manejar completar desafío
    const handleChallengeComplete = async (challengeId, performanceMetrics) => {
        try {
            const response = await fetch(`/api/experiences/discovery-path/${sessionId}/complete-challenge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': gameState.userId
                },
                body: JSON.stringify({
                    challenge_id: challengeId,
                    performance_metrics: performanceMetrics
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al completar desafío');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Actualizar progreso
                updateProgress({
                    completedChallenges: [...gameState.completedChallenges, challengeId],
                    worldUnlocked: data.data.world_unlocked,
                    nextWorld: data.data.next_world
                });
                
                // Si se desbloqueó un nuevo mundo, cambiar a él
                if (data.data.world_unlocked && data.data.next_world) {
                    setCurrentWorld(data.data.next_world);
                }
                
                // Agregar recompensas
                if (data.data.rewards && data.data.rewards.length > 0) {
                    data.data.rewards.forEach(reward => {
                        addReward({
                            id: reward,
                            type: 'world_access',
                            earned_at: new Date().toISOString()
                        });
                    });
                }
            }
        } catch (err) {
            console.error('Error al completar desafío:', err);
            setError(err.message);
        }
    };

    // Manejar reclamar recompensa
    const handleClaimReward = async (rewardId, rewardType) => {
        try {
            const response = await fetch(`/api/experiences/discovery-path/${sessionId}/claim-reward`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': gameState.userId
                },
                body: JSON.stringify({
                    reward_type: rewardType,
                    reward_id: rewardId
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al reclamar recompensa');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Actualizar estado local
                updateProgress({
                    rewards: [...gameState.rewards, {
                        id: rewardId,
                        type: rewardType,
                        claimed_at: new Date().toISOString()
                    }]
                });
            }
        } catch (err) {
            console.error('Error al reclamar recompensa:', err);
            setError(err.message);
        }
    };

    // Manejar modo familiar
    const handleFamilyModeToggle = () => {
        setFamilyMode(!familyMode);
    };

    // Manejar mostrar recompensas
    const handleShowRewards = () => {
        setShowRewards(!showRewards);
    };

    // Renderizar pantalla de carga
    if (isLoading) {
        return (
            <div className="discovery-path-loading">
                <div className="loading-spinner">🔄</div>
                <h2>Cargando tu aventura numérica...</h2>
                <p>Preparando el Bosque de las Decenas</p>
            </div>
        );
    }

    // Renderizar pantalla de error
    if (error) {
        return (
            <div className="discovery-path-error">
                <div className="error-icon">⚠️</div>
                <h2>¡Ups! Algo salió mal</h2>
                <p>{error}</p>
                <button 
                    className="retry-button"
                    onClick={loadSessionState}
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    // Obtener configuración del mundo actual
    const currentWorldConfig = experienceConfig.worlds.find(w => w.id === currentWorld);

    return (
        <div className="discovery-path">
            {/* Header con navegación y controles */}
            <header className="discovery-header">
                <div className="header-left">
                    <h1 className="experience-title">
                        🎮 Descubriendo la Ruta Numérica
                    </h1>
                    <p className="experience-subtitle">
                        Explora patrones numéricos en el {currentWorldConfig?.name}
                    </p>
                </div>
                
                <div className="header-right">
                    <button 
                        className="family-mode-button"
                        onClick={handleFamilyModeToggle}
                        data-active={familyMode}
                    >
                        👨‍👩‍👧‍👦 {familyMode ? 'Modo Familiar' : 'Modo Individual'}
                    </button>
                    
                    <button 
                        className="rewards-button"
                        onClick={handleShowRewards}
                    >
                        🏆 Recompensas
                    </button>
                </div>
            </header>

            {/* Navegación por mundos */}
            <WorldNavigation 
                worlds={experienceConfig.worlds}
                currentWorld={currentWorld}
                unlockedWorlds={gameState.unlockedWorlds || []}
                onWorldSelect={handleWorldChange}
            />

            {/* Área principal de descubrimiento */}
            <main className="discovery-main">
                <PatternDiscoveryArea 
                    worldConfig={currentWorldConfig}
                    tools={experienceConfig.tools}
                    unlockedTools={gameState.unlockedTools || []}
                    onUserAction={handleUserAction}
                    onChallengeComplete={handleChallengeComplete}
                    familyMode={familyMode}
                />
            </main>

            {/* Sistema de feedback */}
            <FeedbackSystem 
                gameState={gameState}
                onAction={handleUserAction}
            />

            {/* Interfaz de recompensas */}
            {showRewards && (
                <RewardsInterface 
                    rewards={gameState.rewards || []}
                    onClaimReward={handleClaimReward}
                    onClose={() => setShowRewards(false)}
                />
            )}

            {/* Modo familiar */}
            {familyMode && (
                <FamilyMode 
                    sessionId={sessionId}
                    currentWorld={currentWorld}
                    onSessionUpdate={onSessionUpdate}
                />
            )}
        </div>
    );
};

export default DiscoveryPath; 