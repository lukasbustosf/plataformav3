import React, { createContext, useContext, useReducer, useEffect } from 'react';

// =====================================================
// TIPOS DE ACCIONES PARA EL REDUCER
// =====================================================

const ACTIONS = {
    UPDATE_PROGRESS: 'UPDATE_PROGRESS',
    ADD_REWARD: 'ADD_REWARD',
    RECORD_HYPOTHESIS: 'RECORD_HYPOTHESIS',
    UPDATE_WORLD: 'UPDATE_WORLD',
    COMPLETE_CHALLENGE: 'COMPLETE_CHALLENGE',
    UNLOCK_TOOL: 'UNLOCK_TOOL',
    UPDATE_METADATA: 'UPDATE_METADATA',
    RESET_SESSION: 'RESET_SESSION',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR'
};

// =====================================================
// ESTADO INICIAL DEL JUEGO
// =====================================================

const initialState = {
    // Estado del progreso
    currentWorld: 'bosque_decenas',
    completedChallenges: [],
    unlockedWorlds: ['bosque_decenas'],
    unlockedTools: [],
    
    // Estado de recompensas
    rewards: [],
    albumItems: [],
    
    // Estado del juego
    score: 0,
    timeSpent: 0,
    hypotheses: [],
    
    // Estado de la sesión
    sessionId: null,
    userId: null,
    isLoading: false,
    error: null,
    
    // Metadatos
    metadata: {
        patternsDiscovered: 0,
        toolsUsed: 0,
        familyActivities: 0,
        totalActions: 0
    }
};

// =====================================================
// REDUCER PARA MANEJAR EL ESTADO
// =====================================================

function gameSessionReducer(state, action) {
    switch (action.type) {
        case ACTIONS.UPDATE_PROGRESS:
            return {
                ...state,
                ...action.payload,
                metadata: {
                    ...state.metadata,
                    totalActions: state.metadata.totalActions + 1
                }
            };
            
        case ACTIONS.ADD_REWARD:
            return {
                ...state,
                rewards: [...state.rewards, action.payload],
                score: state.score + (action.payload.points || 10)
            };
            
        case ACTIONS.RECORD_HYPOTHESIS:
            return {
                ...state,
                hypotheses: [...state.hypotheses, action.payload],
                metadata: {
                    ...state.metadata,
                    patternsDiscovered: state.metadata.patternsDiscovered + 1
                }
            };
            
        case ACTIONS.UPDATE_WORLD:
            return {
                ...state,
                currentWorld: action.payload.worldId,
                unlockedWorlds: state.unlockedWorlds.includes(action.payload.worldId) 
                    ? state.unlockedWorlds 
                    : [...state.unlockedWorlds, action.payload.worldId]
            };
            
        case ACTIONS.COMPLETE_CHALLENGE:
            return {
                ...state,
                completedChallenges: [...state.completedChallenges, action.payload.challengeId],
                score: state.score + (action.payload.points || 25)
            };
            
        case ACTIONS.UNLOCK_TOOL:
            return {
                ...state,
                unlockedTools: [...state.unlockedTools, action.payload.toolId],
                metadata: {
                    ...state.metadata,
                    toolsUsed: state.metadata.toolsUsed + 1
                }
            };
            
        case ACTIONS.UPDATE_METADATA:
            return {
                ...state,
                metadata: {
                    ...state.metadata,
                    ...action.payload
                }
            };
            
        case ACTIONS.RESET_SESSION:
            return {
                ...initialState,
                sessionId: state.sessionId,
                userId: state.userId
            };
            
        case ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
            
        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
            
        default:
            return state;
    }
}

// =====================================================
// CONTEXT Y PROVIDER
// =====================================================

const GameSessionContext = createContext();

export function GameSessionProvider({ children, sessionId, userId }) {
    const [state, dispatch] = useReducer(gameSessionReducer, {
        ...initialState,
        sessionId,
        userId
    });

    // =====================================================
    // FUNCIONES PARA ACTUALIZAR EL ESTADO
    // =====================================================

    const updateProgress = (progressData) => {
        dispatch({
            type: ACTIONS.UPDATE_PROGRESS,
            payload: progressData
        });
    };

    const addReward = (reward) => {
        dispatch({
            type: ACTIONS.ADD_REWARD,
            payload: {
                ...reward,
                earned_at: new Date().toISOString()
            }
        });
    };

    const recordHypothesis = (hypothesis) => {
        dispatch({
            type: ACTIONS.RECORD_HYPOTHESIS,
            payload: {
                ...hypothesis,
                recorded_at: new Date().toISOString()
            }
        });
    };

    const updateWorld = (worldId) => {
        dispatch({
            type: ACTIONS.UPDATE_WORLD,
            payload: { worldId }
        });
    };

    const completeChallenge = (challengeId, points = 25) => {
        dispatch({
            type: ACTIONS.COMPLETE_CHALLENGE,
            payload: { challengeId, points }
        });
    };

    const unlockTool = (toolId) => {
        dispatch({
            type: ACTIONS.UNLOCK_TOOL,
            payload: { toolId }
        });
    };

    const updateMetadata = (metadata) => {
        dispatch({
            type: ACTIONS.UPDATE_METADATA,
            payload: metadata
        });
    };

    const resetSession = () => {
        dispatch({ type: ACTIONS.RESET_SESSION });
    };

    const setLoading = (isLoading) => {
        dispatch({
            type: ACTIONS.SET_LOADING,
            payload: isLoading
        });
    };

    const setError = (error) => {
        dispatch({
            type: ACTIONS.SET_ERROR,
            payload: error
        });
    };

    // =====================================================
    // FUNCIONES DE UTILIDAD
    // =====================================================

    const getCurrentWorldConfig = () => {
        const worlds = [
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
        ];
        
        return worlds.find(w => w.id === state.currentWorld) || worlds[0];
    };

    const getProgressPercentage = () => {
        const totalChallenges = 15; // Número total de desafíos en la experiencia
        return Math.round((state.completedChallenges.length / totalChallenges) * 100);
    };

    const getUnlockedTools = () => {
        const allTools = [
            {
                id: 'calculadora_patrones',
                name: 'Calculadora de Patrones',
                description: 'Herramienta para descubrir reglas numéricas',
                icon: '🧮'
            },
            {
                id: 'microscopio_numerico',
                name: 'Microscopio Numérico',
                description: 'Herramienta para analizar secuencias',
                icon: '🔬'
            }
        ];
        
        return allTools.filter(tool => state.unlockedTools.includes(tool.id));
    };

    const getRecentHypotheses = (count = 5) => {
        return state.hypotheses
            .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at))
            .slice(0, count);
    };

    const getSessionStats = () => {
        return {
            totalChallenges: state.completedChallenges.length,
            totalRewards: state.rewards.length,
            totalHypotheses: state.hypotheses.length,
            progressPercentage: getProgressPercentage(),
            currentWorld: getCurrentWorldConfig(),
            unlockedTools: getUnlockedTools(),
            recentHypotheses: getRecentHypotheses()
        };
    };

    // =====================================================
    // EFECTO PARA SINCRONIZAR CON EL SERVIDOR
    // =====================================================

    useEffect(() => {
        // Aquí se podría implementar sincronización automática con el servidor
        // Por ahora, solo guardamos en localStorage para persistencia
        if (state.sessionId) {
            localStorage.setItem(`gameSession_${state.sessionId}`, JSON.stringify(state));
        }
    }, [state, state.sessionId]);

    // =====================================================
    // VALOR DEL CONTEXT
    // =====================================================

    const contextValue = {
        // Estado
        gameState: state,
        
        // Funciones de actualización
        updateProgress,
        addReward,
        recordHypothesis,
        updateWorld,
        completeChallenge,
        unlockTool,
        updateMetadata,
        resetSession,
        setLoading,
        setError,
        
        // Funciones de utilidad
        getCurrentWorldConfig,
        getProgressPercentage,
        getUnlockedTools,
        getRecentHypotheses,
        getSessionStats
    };

    return (
        <GameSessionContext.Provider value={contextValue}>
            {children}
        </GameSessionContext.Provider>
    );
}

// =====================================================
// HOOK PERSONALIZADO PARA USAR EL CONTEXT
// =====================================================

export function useGameSession() {
    const context = useContext(GameSessionContext);
    
    if (!context) {
        throw new Error('useGameSession debe ser usado dentro de un GameSessionProvider');
    }
    
    return context;
}

// =====================================================
// HOOKS ESPECÍFICOS PARA FUNCIONALIDADES
// =====================================================

export function useGameProgress() {
    const { gameState, updateProgress, getProgressPercentage } = useGameSession();
    
    return {
        progress: gameState,
        updateProgress,
        progressPercentage: getProgressPercentage()
    };
}

export function useGameRewards() {
    const { gameState, addReward, getSessionStats } = useGameSession();
    
    return {
        rewards: gameState.rewards,
        addReward,
        stats: getSessionStats()
    };
}

export function useGameWorlds() {
    const { gameState, updateWorld, getCurrentWorldConfig } = useGameSession();
    
    return {
        currentWorld: gameState.currentWorld,
        unlockedWorlds: gameState.unlockedWorlds,
        updateWorld,
        currentWorldConfig: getCurrentWorldConfig()
    };
}

export function useGameTools() {
    const { gameState, unlockTool, getUnlockedTools } = useGameSession();
    
    return {
        unlockedTools: gameState.unlockedTools,
        unlockTool,
        availableTools: getUnlockedTools()
    };
}

export function useGameHypotheses() {
    const { gameState, recordHypothesis, getRecentHypotheses } = useGameSession();
    
    return {
        hypotheses: gameState.hypotheses,
        recordHypothesis,
        recentHypotheses: getRecentHypotheses()
    };
}

export default GameSessionContext; 