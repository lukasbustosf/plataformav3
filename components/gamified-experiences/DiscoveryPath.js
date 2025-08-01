import React, { useState, useEffect, useContext } from 'react';
import { GameSessionContext } from '../../contexts/GameSessionContext';
import WorldNavigation from './components/WorldNavigation';
import PatternDiscoveryArea from './components/PatternDiscoveryArea';
import FeedbackSystem from './components/FeedbackSystem';
import RewardsInterface from './components/RewardsInterface';
import FamilyMode from './components/FamilyMode';
import './DiscoveryPath.css';

const DiscoveryPath = ({ sessionId, onSessionUpdate }) => {
    const { gameState, updateProgress, addReward, recordHypothesis, updateMetadata } = useContext(GameSessionContext);
    
    // Estados locales del componente
    const [currentWorld, setCurrentWorld] = useState('bosque_decenas');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFamilyMode, setShowFamilyMode] = useState(false);
    const [showRewards, setShowRewards] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [feedbackQueue, setFeedbackQueue] = useState([]);
    
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
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar cambio de mundo
    const handleWorldChange = (worldId) => {
        setCurrentWorld(worldId);
        updateProgress({ currentWorld: worldId });
    };

    // Manejar acciones del usuario
    const handleUserAction = async (actionType, actionData) => {
        try {
            setCurrentAction(actionType);
            
            const response = await fetch(`/api/experiences/discovery-path/${sessionId}/action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': gameState.userId
                },
                body: JSON.stringify({
                    action_type: actionType,
                    action_data: actionData,
                    world_id: currentWorld,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al procesar la acción');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Procesar respuesta según el tipo de acción
                switch (actionType) {
                    case 'pattern_discovery':
                        if (data.data.isValid) {
                            recordHypothesis({
                                id: `hypothesis_${Date.now()}`,
                                pattern: data.data.pattern,
                                description: `Descubrí el patrón: ${data.data.pattern}`,
                                numbers: actionData.selectedNumbers,
                                isValid: true
                            });
                            
                            // Agregar feedback
                            addFeedbackToQueue('pattern_discovery', {
                                isValid: true,
                                pattern: data.data.pattern
                            });
                            
                            // Verificar si desbloquea nueva herramienta
                            if (data.data.unlocksTool) {
                                updateProgress({ 
                                    unlockedTools: [...gameState.unlockedTools, data.data.toolId] 
                                });
                                addFeedbackToQueue('tool_unlocked', {
                                    toolId: data.data.toolId,
                                    toolName: data.data.toolName
                                });
                            }
                        } else {
                            addFeedbackToQueue('pattern_discovery', {
                                isValid: false,
                                pattern: actionData.selectedNumbers.join(', ')
                            });
                        }
                        break;
                        
                    case 'voice_command':
                        addFeedbackToQueue('voice_command', {
                            isValid: data.data.isValid,
                            pattern: data.data.recognizedPattern
                        });
                        break;
                        
                    case 'tool_activation':
                        updateMetadata({ toolsUsed: (gameState.metadata?.toolsUsed || 0) + 1 });
                        break;
                        
                    default:
                        break;
                }
                
                // Actualizar progreso general
                updateMetadata({ totalActions: (gameState.metadata?.totalActions || 0) + 1 });
                
                // Notificar actualización de sesión
                if (onSessionUpdate) {
                    onSessionUpdate(data.data);
                }
            }
        } catch (err) {
            console.error('Error en acción del usuario:', err);
            addFeedbackToQueue('error', { message: 'Error al procesar la acción' });
        } finally {
            setCurrentAction(null);
        }
    };

    // Manejar completación de desafío
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
                    performance_metrics: performanceMetrics,
                    world_id: currentWorld,
                    completion_time: new Date().toISOString()
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
                    score: gameState.score + (data.data.points || 25)
                });
                
                // Agregar recompensa si corresponde
                if (data.data.reward) {
                    addReward(data.data.reward);
                    addFeedbackToQueue('challenge_completed', {
                        challengeId,
                        challengeName: data.data.challengeName,
                        points: data.data.points
                    });
                }
                
                // Verificar si desbloquea nuevo mundo
                if (data.data.unlocksWorld) {
                    updateProgress({
                        unlockedWorlds: [...gameState.unlockedWorlds, data.data.worldId]
                    });
                }
            }
        } catch (err) {
            console.error('Error al completar desafío:', err);
        }
    };

    // Manejar reclamación de recompensa
    const handleClaimReward = async (rewardId, rewardType) => {
        try {
            const response = await fetch(`/api/experiences/discovery-path/${sessionId}/claim-reward`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': gameState.userId
                },
                body: JSON.stringify({
                    reward_id: rewardId,
                    reward_type: rewardType,
                    claim_time: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al reclamar recompensa');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // La recompensa ya se agregó en el contexto
                addFeedbackToQueue('reward_claimed', {
                    rewardId,
                    rewardName: data.data.rewardName,
                    points: data.data.points
                });
            }
        } catch (err) {
            console.error('Error al reclamar recompensa:', err);
        }
    };

    // Manejar modo familiar
    const handleFamilyModeToggle = () => {
        setShowFamilyMode(!showFamilyMode);
    };

    // Manejar inicio de actividad familiar
    const handleStartFamilyActivity = (activity) => {
        updateMetadata({ 
            familyActivities: (gameState.metadata?.familyActivities || 0) + 1 
        });
        
        addFeedbackToQueue('family_activity', {
            activityName: activity.name,
            activityType: activity.category
        });
        
        setShowFamilyMode(false);
    };

    // Manejar compartir descubrimiento
    const handleShareDiscovery = (discovery) => {
        updateMetadata({ 
            familyActivities: (gameState.metadata?.familyActivities || 0) + 1 
        });
        
        addFeedbackToQueue('family_activity', {
            activityName: 'Descubrimiento Compartido',
            discoveryPattern: discovery.pattern
        });
    };

    // Manejar mostrar recompensas
    const handleShowRewards = () => {
        setShowRewards(!showRewards);
    };

    // Agregar feedback a la cola
    const addFeedbackToQueue = (type, data) => {
        setFeedbackQueue(prev => [...prev, { type, data, timestamp: Date.now() }]);
    };

    // Manejar procesamiento de feedback
    const handleFeedbackProcess = (action, data) => {
        // Esta función será llamada por el FeedbackSystem
        // para procesar las acciones y generar feedback
        addFeedbackToQueue(action, data);
    };

    // Renderizar pantalla de carga
    if (isLoading) {
        return (
            <div className="discovery-path-loading">
                <div className="loading-spinner">🌳</div>
                <h2>Cargando Experiencia de Descubrimiento...</h2>
                <p>Preparando tu aventura numérica</p>
            </div>
        );
    }

    // Renderizar pantalla de error
    if (error) {
        return (
            <div className="discovery-path-error">
                <div className="error-icon">❌</div>
                <h2>Error al Cargar la Experiencia</h2>
                <p>{error}</p>
                <button onClick={loadSessionState}>Reintentar</button>
            </div>
        );
    }

    return (
        <div className="discovery-path">
            {/* Header con controles principales */}
            <div className="discovery-header">
                <div className="header-left">
                    <h1>🔍 Descubriendo la Ruta Numérica</h1>
                    <p>Explora patrones y secuencias matemáticas</p>
                </div>
                
                <div className="header-controls">
                    <button 
                        className="family-mode-button"
                        onClick={handleFamilyModeToggle}
                        disabled={showRewards}
                    >
                        👨‍👩‍👧‍👦 Modo Familiar
                    </button>
                    
                    <button 
                        className="rewards-button"
                        onClick={handleShowRewards}
                        disabled={showFamilyMode}
                    >
                        🏆 Recompensas
                    </button>
                </div>
            </div>

            {/* Navegación de mundos */}
            <WorldNavigation 
                worlds={experienceConfig.worlds}
                currentWorld={currentWorld}
                unlockedWorlds={gameState.unlockedWorlds}
                onWorldSelect={handleWorldChange}
            />

            {/* Área principal de descubrimiento */}
            <PatternDiscoveryArea 
                currentWorld={currentWorld}
                worldConfig={experienceConfig.worlds.find(w => w.id === currentWorld)}
                tools={experienceConfig.tools.filter(tool => 
                    gameState.unlockedTools.includes(tool.id)
                )}
                onUserAction={handleUserAction}
                onChallengeComplete={handleChallengeComplete}
                isProcessing={currentAction !== null}
            />

            {/* Sistema de feedback */}
            <FeedbackSystem 
                gameState={gameState}
                onAction={handleFeedbackProcess}
            />

            {/* Interfaz de recompensas */}
            {showRewards && (
                <RewardsInterface 
                    rewards={gameState.rewards}
                    onClaimReward={handleClaimReward}
                    onClose={() => setShowRewards(false)}
                />
            )}

            {/* Modo familiar */}
            {showFamilyMode && (
                <FamilyMode 
                    onClose={() => setShowFamilyMode(false)}
                    onStartActivity={handleStartFamilyActivity}
                    onShareDiscovery={handleShareDiscovery}
                />
            )}
        </div>
    );
};

export default DiscoveryPath; 