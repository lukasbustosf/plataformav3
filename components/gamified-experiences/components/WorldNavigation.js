import React, { useState } from 'react';
import { useGameWorlds } from '../../../contexts/GameSessionContext';
import './WorldNavigation.css';

const WorldNavigation = ({ worlds, currentWorld, unlockedWorlds, onWorldSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { updateWorld } = useGameWorlds();

    // Manejar selección de mundo
    const handleWorldSelect = (worldId) => {
        if (unlockedWorlds.includes(worldId)) {
            updateWorld(worldId);
            onWorldSelect(worldId);
        }
    };

    // Obtener progreso del mundo actual
    const getWorldProgress = (worldId) => {
        // Aquí se calcularía el progreso real basado en desafíos completados
        // Por ahora, simulamos progreso
        const progressMap = {
            'bosque_decenas': 75,
            'rio_cincos': 45,
            'montana_cientos': 20
        };
        return progressMap[worldId] || 0;
    };

    // Verificar si un mundo está bloqueado
    const isWorldLocked = (worldId) => {
        return !unlockedWorlds.includes(worldId);
    };

    // Obtener el mundo actual
    const currentWorldData = worlds.find(w => w.id === currentWorld);

    return (
        <div className="world-navigation">
            {/* Mundo actual - Vista principal */}
            <div className="current-world-display">
                <div 
                    className="current-world-card"
                    style={{ 
                        background: `linear-gradient(135deg, ${currentWorldData?.color}20, ${currentWorldData?.color}40)`,
                        borderColor: currentWorldData?.color
                    }}
                >
                    <div className="world-icon">
                        {currentWorldData?.icon}
                    </div>
                    <div className="world-info">
                        <h3 className="world-name">{currentWorldData?.name}</h3>
                        <p className="world-range">Números {currentWorldData?.range}</p>
                        <p className="world-pattern">Patrón: {currentWorldData?.pattern}</p>
                    </div>
                    <div className="world-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ 
                                    width: `${getWorldProgress(currentWorld)}%`,
                                    backgroundColor: currentWorldData?.color
                                }}
                            />
                        </div>
                        <span className="progress-text">
                            {getWorldProgress(currentWorld)}% completado
                        </span>
                    </div>
                </div>
                
                {/* Botón para expandir/collapsar */}
                <button 
                    className="expand-button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? "Ocultar otros mundos" : "Mostrar otros mundos"}
                >
                    {isExpanded ? '▼' : '▲'}
                </button>
            </div>

            {/* Lista de mundos - Vista expandida */}
            {isExpanded && (
                <div className="worlds-list">
                    {worlds.map((world) => {
                        const isLocked = isWorldLocked(world.id);
                        const isCurrent = world.id === currentWorld;
                        const progress = getWorldProgress(world.id);
                        
                        return (
                            <div 
                                key={world.id}
                                className={`world-item ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                                onClick={() => !isLocked && handleWorldSelect(world.id)}
                            >
                                <div className="world-item-icon">
                                    {isLocked ? '🔒' : world.icon}
                                </div>
                                
                                <div className="world-item-info">
                                    <h4 className="world-item-name">
                                        {world.name}
                                        {isCurrent && <span className="current-badge">Actual</span>}
                                    </h4>
                                    <p className="world-item-range">
                                        Números {world.range}
                                    </p>
                                    <p className="world-item-pattern">
                                        Patrón: {world.pattern}
                                    </p>
                                </div>
                                
                                <div className="world-item-progress">
                                    {!isLocked && (
                                        <>
                                            <div className="progress-bar-small">
                                                <div 
                                                    className="progress-fill-small"
                                                    style={{ 
                                                        width: `${progress}%`,
                                                        backgroundColor: world.color
                                                    }}
                                                />
                                            </div>
                                            <span className="progress-text-small">
                                                {progress}%
                                            </span>
                                        </>
                                    )}
                                    
                                    {isLocked && (
                                        <div className="locked-indicator">
                                            <span className="lock-icon">🔒</span>
                                            <span className="lock-text">Bloqueado</span>
                                        </div>
                                    )}
                                </div>
                                
                                {!isLocked && !isCurrent && (
                                    <button 
                                        className="select-world-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleWorldSelect(world.id);
                                        }}
                                    >
                                        Ir a este mundo
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Indicadores de progreso global */}
            <div className="global-progress">
                <div className="progress-summary">
                    <div className="progress-item">
                        <span className="progress-label">Mundos desbloqueados:</span>
                        <span className="progress-value">
                            {unlockedWorlds.length} de {worlds.length}
                        </span>
                    </div>
                    <div className="progress-item">
                        <span className="progress-label">Progreso total:</span>
                        <span className="progress-value">
                            {Math.round((unlockedWorlds.length / worlds.length) * 100)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorldNavigation; 