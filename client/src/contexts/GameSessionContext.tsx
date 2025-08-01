'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// =====================================================
// TIPOS Y INTERFACES
// =====================================================

interface GameState {
  // Progreso del juego
  currentWorld: string;
  completedChallenges: string[];
  unlockedTools: string[];
  unlockedWorlds: string[];
  
  // Recompensas
  rewards: Reward[];
  achievements: Achievement[];
  
  // Herramientas disponibles
  availableTools: Tool[];
  activeTool: string | null;
  
  // Hipótesis y descubrimientos
  hypotheses: Hypothesis[];
  discoveries: Discovery[];
  
  // Estado de la sesión
  sessionId: string | null;
  isActive: boolean;
  startTime: Date | null;
  
  // Métricas
  totalActions: number;
  patternsDiscovered: number;
  toolsUsed: number;
  familyActivities: number;
}

interface Reward {
  id: string;
  type: 'album' | 'achievement' | 'tool' | 'family';
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  claimed: boolean;
  unlockedAt?: Date;
  claimedAt?: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  active: boolean;
  cooldown: number;
  lastUsed?: Date;
}

interface Hypothesis {
  id: string;
  pattern: string;
  numbers: number[];
  isCorrect: boolean;
  createdAt: Date;
  testedAt?: Date;
}

interface Discovery {
  id: string;
  type: 'pattern' | 'sequence' | 'relationship';
  title: string;
  description: string;
  data: any;
  discoveredAt: Date;
  sharedWithFamily: boolean;
}

// =====================================================
// ACCIONES DEL REDUCER
// =====================================================

type GameAction =
  | { type: 'SET_SESSION'; payload: { sessionId: string; startTime: Date } }
  | { type: 'COMPLETE_CHALLENGE'; payload: { challengeId: string; world: string } }
  | { type: 'UNLOCK_WORLD'; payload: { worldId: string } }
  | { type: 'UNLOCK_TOOL'; payload: { toolId: string } }
  | { type: 'ACTIVATE_TOOL'; payload: { toolId: string } }
  | { type: 'DEACTIVATE_TOOL' }
  | { type: 'ADD_REWARD'; payload: Reward }
  | { type: 'CLAIM_REWARD'; payload: { rewardId: string } }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: { achievementId: string; progress: number } }
  | { type: 'ADD_HYPOTHESIS'; payload: Hypothesis }
  | { type: 'TEST_HYPOTHESIS'; payload: { hypothesisId: string; isCorrect: boolean } }
  | { type: 'ADD_DISCOVERY'; payload: Discovery }
  | { type: 'SHARE_DISCOVERY'; payload: { discoveryId: string } }
  | { type: 'INCREMENT_ACTION' }
  | { type: 'INCREMENT_PATTERN_DISCOVERY' }
  | { type: 'INCREMENT_TOOL_USAGE' }
  | { type: 'INCREMENT_FAMILY_ACTIVITY' }
  | { type: 'RESET_SESSION' };

// =====================================================
// ESTADO INICIAL
// =====================================================

const initialState: GameState = {
  currentWorld: 'bosque_decenas',
  completedChallenges: [],
  unlockedTools: [],
  unlockedWorlds: ['bosque_decenas'],
  
  rewards: [],
  achievements: [],
  
  availableTools: [
    {
      id: 'lupa',
      name: 'Lupa de Patrones',
      description: 'Ayuda a identificar patrones numéricos',
      icon: '🔍',
      unlocked: true,
      active: false,
      cooldown: 30
    },
    {
      id: 'calculadora',
      name: 'Calculadora Mágica',
      description: 'Calcula sumas y restas automáticamente',
      icon: '🧮',
      unlocked: false,
      active: false,
      cooldown: 60
    },
    {
      id: 'microfono',
      name: 'Micrófono de Números',
      description: 'Reconoce números hablados',
      icon: '🎤',
      unlocked: false,
      active: false,
      cooldown: 45
    }
  ],
  activeTool: null,
  
  hypotheses: [],
  discoveries: [],
  
  sessionId: null,
  isActive: false,
  startTime: null,
  
  totalActions: 0,
  patternsDiscovered: 0,
  toolsUsed: 0,
  familyActivities: 0
};

// =====================================================
// REDUCER
// =====================================================

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        startTime: action.payload.startTime,
        isActive: true
      };
      
    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        completedChallenges: [...state.completedChallenges, action.payload.challengeId]
      };
      
    case 'UNLOCK_WORLD':
      return {
        ...state,
        unlockedWorlds: [...state.unlockedWorlds, action.payload.worldId]
      };
      
    case 'UNLOCK_TOOL':
      return {
        ...state,
        availableTools: state.availableTools.map(tool =>
          tool.id === action.payload.toolId
            ? { ...tool, unlocked: true }
            : tool
        ),
        unlockedTools: [...state.unlockedTools, action.payload.toolId]
      };
      
    case 'ACTIVATE_TOOL':
      return {
        ...state,
        activeTool: action.payload.toolId,
        availableTools: state.availableTools.map(tool =>
          tool.id === action.payload.toolId
            ? { ...tool, active: true, lastUsed: new Date() }
            : { ...tool, active: false }
        )
      };
      
    case 'DEACTIVATE_TOOL':
      return {
        ...state,
        activeTool: null,
        availableTools: state.availableTools.map(tool => ({
          ...tool,
          active: false
        }))
      };
      
    case 'ADD_REWARD':
      return {
        ...state,
        rewards: [...state.rewards, action.payload]
      };
      
    case 'CLAIM_REWARD':
      return {
        ...state,
        rewards: state.rewards.map(reward =>
          reward.id === action.payload.rewardId
            ? { ...reward, claimed: true, claimedAt: new Date() }
            : reward
        )
      };
      
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload]
      };
      
    case 'UPDATE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.payload.achievementId
            ? {
                ...achievement,
                progress: action.payload.progress,
                unlocked: action.payload.progress >= achievement.maxProgress,
                unlockedAt: action.payload.progress >= achievement.maxProgress ? new Date() : achievement.unlockedAt
              }
            : achievement
        )
      };
      
    case 'ADD_HYPOTHESIS':
      return {
        ...state,
        hypotheses: [...state.hypotheses, action.payload]
      };
      
    case 'TEST_HYPOTHESIS':
      return {
        ...state,
        hypotheses: state.hypotheses.map(hypothesis =>
          hypothesis.id === action.payload.hypothesisId
            ? { ...hypothesis, isCorrect: action.payload.isCorrect, testedAt: new Date() }
            : hypothesis
        )
      };
      
    case 'ADD_DISCOVERY':
      return {
        ...state,
        discoveries: [...state.discoveries, action.payload]
      };
      
    case 'SHARE_DISCOVERY':
      return {
        ...state,
        discoveries: state.discoveries.map(discovery =>
          discovery.id === action.payload.discoveryId
            ? { ...discovery, sharedWithFamily: true }
            : discovery
        )
      };
      
    case 'INCREMENT_ACTION':
      return {
        ...state,
        totalActions: state.totalActions + 1
      };
      
    case 'INCREMENT_PATTERN_DISCOVERY':
      return {
        ...state,
        patternsDiscovered: state.patternsDiscovered + 1
      };
      
    case 'INCREMENT_TOOL_USAGE':
      return {
        ...state,
        toolsUsed: state.toolsUsed + 1
      };
      
    case 'INCREMENT_FAMILY_ACTIVITY':
      return {
        ...state,
        familyActivities: state.familyActivities + 1
      };
      
    case 'RESET_SESSION':
      return initialState;
      
    default:
      return state;
  }
}

// =====================================================
// CONTEXTO
// =====================================================

interface GameSessionContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  
  // Acciones útiles
  startSession: (sessionId: string) => void;
  completeChallenge: (challengeId: string, world: string) => void;
  unlockTool: (toolId: string) => void;
  activateTool: (toolId: string) => void;
  deactivateTool: () => void;
  addReward: (reward: Reward) => void;
  claimReward: (rewardId: string) => void;
  addHypothesis: (hypothesis: Hypothesis) => void;
  testHypothesis: (hypothesisId: string, isCorrect: boolean) => void;
  addDiscovery: (discovery: Discovery) => void;
  shareDiscovery: (discoveryId: string) => void;
  resetSession: () => void;
  
  // Getters útiles
  getCurrentWorld: () => string;
  getCompletedChallenges: () => string[];
  getUnlockedTools: () => string[];
  getActiveTool: () => Tool | null;
  getRewards: (type?: string) => Reward[];
  getAchievements: () => Achievement[];
  getHypotheses: () => Hypothesis[];
  getDiscoveries: () => Discovery[];
  getSessionStats: () => {
    totalActions: number;
    patternsDiscovered: number;
    toolsUsed: number;
    familyActivities: number;
  };
}

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

// =====================================================
// PROVIDER
// =====================================================

interface GameSessionProviderProps {
  children: ReactNode;
}

export function GameSessionProvider({ children }: GameSessionProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Persistencia en localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('gameSessionState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Restaurar estado pero mantener la estructura correcta
        Object.keys(parsedState).forEach(key => {
          if (key in state) {
            dispatch({ type: 'SET_SESSION', payload: { sessionId: parsedState.sessionId || 'default', startTime: new Date() } });
          }
        });
      } catch (error) {
        console.error('Error al restaurar estado del juego:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (state.sessionId) {
      localStorage.setItem('gameSessionState', JSON.stringify(state));
    }
  }, [state]);
  
  // Acciones útiles
  const startSession = (sessionId: string) => {
    dispatch({ type: 'SET_SESSION', payload: { sessionId, startTime: new Date() } });
  };
  
  const completeChallenge = (challengeId: string, world: string) => {
    dispatch({ type: 'COMPLETE_CHALLENGE', payload: { challengeId, world } });
  };
  
  const unlockTool = (toolId: string) => {
    dispatch({ type: 'UNLOCK_TOOL', payload: { toolId } });
  };
  
  const activateTool = (toolId: string) => {
    dispatch({ type: 'ACTIVATE_TOOL', payload: { toolId } });
  };
  
  const deactivateTool = () => {
    dispatch({ type: 'DEACTIVATE_TOOL' });
  };
  
  const addReward = (reward: Reward) => {
    dispatch({ type: 'ADD_REWARD', payload: reward });
  };
  
  const claimReward = (rewardId: string) => {
    dispatch({ type: 'CLAIM_REWARD', payload: { rewardId } });
  };
  
  const addHypothesis = (hypothesis: Hypothesis) => {
    dispatch({ type: 'ADD_HYPOTHESIS', payload: hypothesis });
  };
  
  const testHypothesis = (hypothesisId: string, isCorrect: boolean) => {
    dispatch({ type: 'TEST_HYPOTHESIS', payload: { hypothesisId, isCorrect } });
  };
  
  const addDiscovery = (discovery: Discovery) => {
    dispatch({ type: 'ADD_DISCOVERY', payload: discovery });
  };
  
  const shareDiscovery = (discoveryId: string) => {
    dispatch({ type: 'SHARE_DISCOVERY', payload: { discoveryId } });
  };
  
  const resetSession = () => {
    dispatch({ type: 'RESET_SESSION' });
  };
  
  // Getters útiles
  const getCurrentWorld = () => state.currentWorld;
  const getCompletedChallenges = () => state.completedChallenges;
  const getUnlockedTools = () => state.unlockedTools;
  const getActiveTool = () => state.availableTools.find(tool => tool.active) || null;
  const getRewards = (type?: string) => 
    type ? state.rewards.filter(reward => reward.type === type) : state.rewards;
  const getAchievements = () => state.achievements;
  const getHypotheses = () => state.hypotheses;
  const getDiscoveries = () => state.discoveries;
  const getSessionStats = () => ({
    totalActions: state.totalActions,
    patternsDiscovered: state.patternsDiscovered,
    toolsUsed: state.toolsUsed,
    familyActivities: state.familyActivities
  });
  
  const value: GameSessionContextType = {
    state,
    dispatch,
    startSession,
    completeChallenge,
    unlockTool,
    activateTool,
    deactivateTool,
    addReward,
    claimReward,
    addHypothesis,
    testHypothesis,
    addDiscovery,
    shareDiscovery,
    resetSession,
    getCurrentWorld,
    getCompletedChallenges,
    getUnlockedTools,
    getActiveTool,
    getRewards,
    getAchievements,
    getHypotheses,
    getDiscoveries,
    getSessionStats
  };
  
  return (
    <GameSessionContext.Provider value={value}>
      {children}
    </GameSessionContext.Provider>
  );
}

// =====================================================
// HOOKS PERSONALIZADOS
// =====================================================

export function useGameSession() {
  const context = useContext(GameSessionContext);
  if (context === undefined) {
    throw new Error('useGameSession debe ser usado dentro de GameSessionProvider');
  }
  return context;
}

export function useGameProgress() {
  const { state } = useGameSession();
  return {
    currentWorld: state.currentWorld,
    completedChallenges: state.completedChallenges,
    unlockedWorlds: state.unlockedWorlds,
    progress: (state.completedChallenges.length / 10) * 100 // Ejemplo: 10 desafíos totales
  };
}

export function useGameRewards() {
  const { getRewards, claimReward } = useGameSession();
  return {
    rewards: getRewards(),
    albumRewards: getRewards('album'),
    achievementRewards: getRewards('achievement'),
    toolRewards: getRewards('tool'),
    familyRewards: getRewards('family'),
    claimReward
  };
}

export function useGameWorlds() {
  const { state, dispatch } = useGameSession();
  return {
    currentWorld: state.currentWorld,
    unlockedWorlds: state.unlockedWorlds,
    unlockWorld: (worldId: string) => dispatch({ type: 'UNLOCK_WORLD', payload: { worldId } })
  };
}

export function useGameTools() {
  const { state, activateTool, deactivateTool, unlockTool } = useGameSession();
  return {
    availableTools: state.availableTools,
    activeTool: state.activeTool,
    activateTool,
    deactivateTool,
    unlockTool
  };
}

export function useGameHypotheses() {
  const { state, addHypothesis, testHypothesis } = useGameSession();
  return {
    hypotheses: state.hypotheses,
    addHypothesis,
    testHypothesis
  };
}

export function useGameDiscoveries() {
  const { state, addDiscovery, shareDiscovery } = useGameSession();
  return {
    discoveries: state.discoveries,
    addDiscovery,
    shareDiscovery
  };
}

export function useGameStats() {
  const { getSessionStats } = useGameSession();
  return getSessionStats();
} 