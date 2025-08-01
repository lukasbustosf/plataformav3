import React, { useState, useEffect } from 'react';
import { useGameRewards } from '../../../contexts/GameSessionContext';
import './RewardsInterface.css';

const RewardsInterface = ({ rewards, onClaimReward, onClose }) => {
    const { stats } = useGameRewards();
    
    // Estados del componente
    const [activeTab, setActiveTab] = useState('album');
    const [selectedReward, setSelectedReward] = useState(null);
    const [showClaimAnimation, setShowClaimAnimation] = useState(false);
    const [claimedReward, setClaimedReward] = useState(null);
    
    // Configuración de categorías de recompensas
    const rewardCategories = {
        album: {
            title: 'Álbum de Descubrimientos',
            icon: '📚',
            description: 'Colecciona patrones y logros'
        },
        achievements: {
            title: 'Logros Especiales',
            icon: '🏆',
            description: 'Desafíos completados'
        },
        tools: {
            title: 'Herramientas Desbloqueadas',
            icon: '🛠️',
            description: 'Instrumentos de exploración'
        },
        family: {
            title: 'Actividades Familiares',
            icon: '👨‍👩‍👧‍👦',
            description: 'Logros compartidos'
        }
    };
    
    // Datos de recompensas disponibles
    const availableRewards = {
        album: [
            {
                id: 'pattern_1_1',
                name: 'Patrón de 1 en 1',
                description: 'Descubriste el patrón más básico',
                icon: '🔢',
                rarity: 'common',
                points: 10,
                unlocked: true
            },
            {
                id: 'pattern_2_2',
                name: 'Patrón de 2 en 2',
                description: 'Dominaste el patrón de pares',
                icon: '🔢',
                rarity: 'common',
                points: 15,
                unlocked: true
            },
            {
                id: 'pattern_5_5',
                name: 'Patrón de 5 en 5',
                description: 'Descubriste el patrón de quintos',
                icon: '🔢',
                rarity: 'rare',
                points: 25,
                unlocked: false
            },
            {
                id: 'pattern_10_10',
                name: 'Patrón de 10 en 10',
                description: 'Maestro de las decenas',
                icon: '🔢',
                rarity: 'epic',
                points: 50,
                unlocked: false
            }
        ],
        achievements: [
            {
                id: 'first_pattern',
                name: 'Primer Descubrimiento',
                description: 'Descubriste tu primer patrón',
                icon: '🌟',
                rarity: 'common',
                points: 20,
                unlocked: true
            },
            {
                id: 'pattern_master',
                name: 'Maestro de Patrones',
                description: 'Descubriste 5 patrones diferentes',
                icon: '👑',
                rarity: 'epic',
                points: 100,
                unlocked: false
            },
            {
                id: 'voice_expert',
                name: 'Experto en Voz',
                description: 'Usaste comandos de voz exitosamente',
                icon: '🎤',
                rarity: 'rare',
                points: 30,
                unlocked: false
            },
            {
                id: 'family_champion',
                name: 'Campeón Familiar',
                description: 'Compartiste 10 descubrimientos',
                icon: '👨‍👩‍👧‍👦',
                rarity: 'epic',
                points: 75,
                unlocked: false
            }
        ],
        tools: [
            {
                id: 'calculadora_patrones',
                name: 'Calculadora de Patrones',
                description: 'Herramienta para analizar secuencias',
                icon: '🧮',
                rarity: 'rare',
                points: 40,
                unlocked: true
            },
            {
                id: 'microscopio_numerico',
                name: 'Microscopio Numérico',
                description: 'Amplía la vista de los números',
                icon: '🔬',
                rarity: 'epic',
                points: 60,
                unlocked: false
            }
        ],
        family: [
            {
                id: 'shared_discovery',
                name: 'Descubrimiento Compartido',
                description: 'Compartiste un patrón con la familia',
                icon: '💝',
                rarity: 'common',
                points: 15,
                unlocked: true
            },
            {
                id: 'family_team',
                name: 'Equipo Familiar',
                description: 'Completaste una actividad familiar',
                icon: '🤝',
                rarity: 'rare',
                points: 25,
                unlocked: false
            }
        ]
    };
    
    // Obtener recompensas por categoría
    const getRewardsByCategory = (category) => {
        return availableRewards[category] || [];
    };
    
    // Obtener recompensas desbloqueadas
    const getUnlockedRewards = (category) => {
        return getRewardsByCategory(category).filter(reward => reward.unlocked);
    };
    
    // Obtener progreso de categoría
    const getCategoryProgress = (category) => {
        const categoryRewards = getRewardsByCategory(category);
        const unlockedCount = getUnlockedRewards(category).length;
        return {
            total: categoryRewards.length,
            unlocked: unlockedCount,
            percentage: Math.round((unlockedCount / categoryRewards.length) * 100)
        };
    };
    
    // Manejar reclamar recompensa
    const handleClaimReward = (reward) => {
        if (reward.unlocked && !reward.claimed) {
            setSelectedReward(reward);
            setShowClaimAnimation(true);
            
            // Simular animación de reclamación
            setTimeout(() => {
                setShowClaimAnimation(false);
                setClaimedReward(reward);
                
                // Llamar a la función de reclamación
                onClaimReward(reward.id, reward.type || 'achievement');
                
                // Limpiar después de 3 segundos
                setTimeout(() => {
                    setClaimedReward(null);
                }, 3000);
            }, 2000);
        }
    };
    
    // Obtener color por rareza
    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return '#4CAF50';
            case 'rare': return '#2196F3';
            case 'epic': return '#9C27B0';
            case 'legendary': return '#FF9800';
            default: return '#7f8c8d';
        }
    };
    
    // Obtener icono por rareza
    const getRarityIcon = (rarity) => {
        switch (rarity) {
            case 'common': return '⭐';
            case 'rare': return '⭐⭐';
            case 'epic': return '⭐⭐⭐';
            case 'legendary': return '⭐⭐⭐⭐';
            default: return '⭐';
        }
    };
    
    // =====================================================
    // COMPONENTE DE PESTAÑA
    // =====================================================
    
    const TabButton = ({ category, isActive, onClick }) => {
        const categoryData = rewardCategories[category];
        const progress = getCategoryProgress(category);
        
        return (
            <button
                className={`tab-button ${isActive ? 'active' : ''}`}
                onClick={() => onClick(category)}
            >
                <div className="tab-icon">{categoryData.icon}</div>
                <div className="tab-content">
                    <div className="tab-title">{categoryData.title}</div>
                    <div className="tab-progress">
                        {progress.unlocked}/{progress.total} ({progress.percentage}%)
                    </div>
                </div>
                <div className="tab-progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ 
                            width: `${progress.percentage}%`,
                            backgroundColor: getRarityColor('common')
                        }}
                    />
                </div>
            </button>
        );
    };
    
    // =====================================================
    // COMPONENTE DE RECOMPENSA
    // =====================================================
    
    const RewardCard = ({ reward, onClaim }) => {
        const rarityColor = getRarityColor(reward.rarity);
        const rarityIcon = getRarityIcon(reward.rarity);
        
        return (
            <div 
                className={`reward-card ${reward.unlocked ? 'unlocked' : 'locked'} ${reward.claimed ? 'claimed' : ''}`}
                style={{ '--rarity-color': rarityColor }}
            >
                <div className="reward-header">
                    <div className="reward-icon">{reward.icon}</div>
                    <div className="rarity-badge">
                        {rarityIcon}
                    </div>
                </div>
                
                <div className="reward-content">
                    <h3 className="reward-name">{reward.name}</h3>
                    <p className="reward-description">{reward.description}</p>
                    <div className="reward-points">+{reward.points} puntos</div>
                </div>
                
                <div className="reward-status">
                    {reward.unlocked ? (
                        reward.claimed ? (
                            <div className="claimed-badge">✅ Reclamado</div>
                        ) : (
                            <button 
                                className="claim-button"
                                onClick={() => onClaim(reward)}
                            >
                                🎁 Reclamar
                            </button>
                        )
                    ) : (
                        <div className="locked-badge">🔒 Bloqueado</div>
                    )}
                </div>
            </div>
        );
    };
    
    // =====================================================
    // COMPONENTE DE ESTADÍSTICAS
    // =====================================================
    
    const RewardsStats = () => {
        const totalRewards = Object.keys(availableRewards).reduce((total, category) => {
            return total + availableRewards[category].length;
        }, 0);
        
        const totalUnlocked = Object.keys(availableRewards).reduce((total, category) => {
            return total + getUnlockedRewards(category).length;
        }, 0);
        
        const totalPoints = rewards.reduce((total, reward) => total + (reward.points || 0), 0);
        
        return (
            <div className="rewards-stats">
                <div className="stat-item">
                    <span className="stat-icon">📚</span>
                    <span className="stat-value">{totalUnlocked}/{totalRewards}</span>
                    <span className="stat-label">Recompensas</span>
                </div>
                <div className="stat-item">
                    <span className="stat-icon">🏆</span>
                    <span className="stat-value">{totalPoints}</span>
                    <span className="stat-label">Puntos</span>
                </div>
                <div className="stat-item">
                    <span className="stat-icon">🎯</span>
                    <span className="stat-value">{Math.round((totalUnlocked / totalRewards) * 100)}%</span>
                    <span className="stat-label">Progreso</span>
                </div>
            </div>
        );
    };
    
    // =====================================================
    // COMPONENTE DE ANIMACIÓN DE RECLAMACIÓN
    // =====================================================
    
    const ClaimAnimation = () => {
        if (!showClaimAnimation || !selectedReward) return null;
        
        return (
            <div className="claim-animation-overlay">
                <div className="claim-animation-container">
                    <div className="claim-icon">{selectedReward.icon}</div>
                    <div className="claim-text">¡Reclamando {selectedReward.name}!</div>
                    <div className="claim-particles">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="claim-particle"
                                style={{
                                    '--delay': `${i * 0.1}s`,
                                    '--angle': `${i * 30}deg`,
                                    '--distance': `${40 + Math.random() * 30}px`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };
    
    // =====================================================
    // COMPONENTE DE RECOMPENSA RECLAMADA
    // =====================================================
    
    const ClaimedRewardPopup = () => {
        if (!claimedReward) return null;
        
        return (
            <div className="claimed-reward-popup">
                <div className="claimed-content">
                    <div className="claimed-icon">{claimedReward.icon}</div>
                    <div className="claimed-info">
                        <h3 className="claimed-title">¡Recompensa Reclamada!</h3>
                        <p className="claimed-name">{claimedReward.name}</p>
                        <div className="claimed-points">+{claimedReward.points} puntos</div>
                    </div>
                </div>
            </div>
        );
    };
    
    // =====================================================
    // RENDERIZADO
    // =====================================================
    
    return (
        <div className="rewards-interface">
            {/* Header */}
            <div className="rewards-header">
                <h2 className="rewards-title">🏆 Recompensas y Logros</h2>
                <button className="close-button" onClick={onClose}>
                    ✕
                </button>
            </div>
            
            {/* Pestañas */}
            <div className="rewards-tabs">
                {Object.keys(rewardCategories).map(category => (
                    <TabButton
                        key={category}
                        category={category}
                        isActive={activeTab === category}
                        onClick={setActiveTab}
                    />
                ))}
            </div>
            
            {/* Contenido de la pestaña activa */}
            <div className="rewards-content">
                <div className="category-header">
                    <h3 className="category-title">
                        {rewardCategories[activeTab].title}
                    </h3>
                    <p className="category-description">
                        {rewardCategories[activeTab].description}
                    </p>
                </div>
                
                <div className="rewards-grid">
                    {getRewardsByCategory(activeTab).map(reward => (
                        <RewardCard
                            key={reward.id}
                            reward={reward}
                            onClaim={handleClaimReward}
                        />
                    ))}
                </div>
            </div>
            
            {/* Estadísticas */}
            <RewardsStats />
            
            {/* Animaciones */}
            <ClaimAnimation />
            <ClaimedRewardPopup />
        </div>
    );
};

export default RewardsInterface; 