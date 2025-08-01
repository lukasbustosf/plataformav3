import React, { useState, useEffect, useRef } from 'react';
import { useGameSession } from '../../../contexts/GameSessionContext';
import './FeedbackSystem.css';

const FeedbackSystem = ({ gameState, onAction }) => {
    const { addReward, updateMetadata } = useGameSession();
    
    // Estados del sistema de feedback
    const [feedbackQueue, setFeedbackQueue] = useState([]);
    const [currentFeedback, setCurrentFeedback] = useState(null);
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [achievementPopup, setAchievementPopup] = useState(null);
    
    // Referencias para audio
    const audioContextRef = useRef(null);
    const soundEffectsRef = useRef({
        success: null,
        error: null,
        warning: null,
        achievement: null,
        pattern: null
    });
    
    // Configuración de sonidos
    const soundConfig = {
        success: { frequency: 800, duration: 300, type: 'sine' },
        error: { frequency: 400, duration: 200, type: 'sawtooth' },
        warning: { frequency: 600, duration: 250, type: 'square' },
        achievement: { frequency: 1000, duration: 500, type: 'sine' },
        pattern: { frequency: 1200, duration: 400, type: 'triangle' }
    };
    
    // =====================================================
    // INICIALIZACIÓN DE AUDIO
    // =====================================================
    
    useEffect(() => {
        // Inicializar Web Audio API
        if (typeof window !== 'undefined' && window.AudioContext) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);
    
    // =====================================================
    // FUNCIONES DE AUDIO
    // =====================================================
    
    const playSound = (type) => {
        if (!audioContextRef.current) return;
        
        const config = soundConfig[type];
        if (!config) return;
        
        try {
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            
            oscillator.frequency.setValueAtTime(config.frequency, audioContextRef.current.currentTime);
            oscillator.type = config.type;
            
            gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + config.duration / 1000);
            
            oscillator.start(audioContextRef.current.currentTime);
            oscillator.stop(audioContextRef.current.currentTime + config.duration / 1000);
            
            setIsPlayingSound(true);
            setTimeout(() => setIsPlayingSound(false), config.duration);
            
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    };
    
    // =====================================================
    // PROCESAMIENTO DE FEEDBACK
    // =====================================================
    
    const processFeedback = (action, data) => {
        let feedback = null;
        let soundType = null;
        let showCelebrationFlag = false;
        let achievement = null;
        
        switch (action) {
            case 'pattern_discovery':
                if (data.isValid) {
                    feedback = {
                        type: 'success',
                        title: '¡Patrón Descubierto!',
                        message: `Has encontrado el patrón: ${data.pattern}`,
                        icon: '🔍',
                        color: '#4CAF50',
                        duration: 4000
                    };
                    soundType = 'pattern';
                    showCelebrationFlag = true;
                    
                    // Verificar si es un logro
                    if (data.numbers.length >= 5) {
                        achievement = {
                            id: 'pattern_master',
                            title: 'Maestro de Patrones',
                            description: 'Descubriste un patrón de 5 números o más',
                            icon: '🏆',
                            points: 50
                        };
                    }
                } else {
                    feedback = {
                        type: 'error',
                        title: 'Intenta de Nuevo',
                        message: 'Los números seleccionados no siguen un patrón claro',
                        icon: '❌',
                        color: '#f44336',
                        duration: 3000
                    };
                    soundType = 'error';
                }
                break;
                
            case 'voice_command':
                if (data.isValid) {
                    feedback = {
                        type: 'success',
                        title: '¡Excelente Pronunciación!',
                        message: `Identificaste correctamente: ${data.pattern}`,
                        icon: '🎤',
                        color: '#2196F3',
                        duration: 3500
                    };
                    soundType = 'success';
                } else {
                    feedback = {
                        type: 'warning',
                        title: 'No Te Entendí',
                        message: 'Intenta decir "uno en uno", "dos en dos", etc.',
                        icon: '⚠️',
                        color: '#ff9800',
                        duration: 3000
                    };
                    soundType = 'warning';
                }
                break;
                
            case 'tool_unlocked':
                feedback = {
                    type: 'achievement',
                    title: '¡Nueva Herramienta!',
                    message: `Has desbloqueado: ${data.toolName}`,
                    icon: '🛠️',
                    color: '#9C27B0',
                    duration: 5000
                };
                soundType = 'achievement';
                showCelebrationFlag = true;
                achievement = {
                    id: `tool_${data.toolId}`,
                    title: 'Herramienta Desbloqueada',
                    description: `Desbloqueaste ${data.toolName}`,
                    icon: '🔧',
                    points: 25
                };
                break;
                
            case 'family_activity':
                feedback = {
                    type: 'success',
                    title: '¡Compartido con la Familia!',
                    message: 'Tu descubrimiento se compartió exitosamente',
                    icon: '👨‍👩‍👧‍👦',
                    color: '#9C27B0',
                    duration: 4000
                };
                soundType = 'success';
                showCelebrationFlag = true;
                break;
                
            case 'challenge_completed':
                feedback = {
                    type: 'success',
                    title: '¡Desafío Completado!',
                    message: `Completaste: ${data.challengeName}`,
                    icon: '🎯',
                    color: '#4CAF50',
                    duration: 4000
                };
                soundType = 'achievement';
                showCelebrationFlag = true;
                achievement = {
                    id: `challenge_${data.challengeId}`,
                    title: 'Desafío Superado',
                    description: `Completaste ${data.challengeName}`,
                    icon: '🏅',
                    points: 100
                };
                break;
                
            default:
                feedback = {
                    type: 'info',
                    title: 'Información',
                    message: 'Acción procesada correctamente',
                    icon: 'ℹ️',
                    color: '#2196F3',
                    duration: 2000
                };
                soundType = 'success';
        }
        
        // Agregar feedback a la cola
        if (feedback) {
            setFeedbackQueue(prev => [...prev, feedback]);
        }
        
        // Reproducir sonido
        if (soundType) {
            playSound(soundType);
        }
        
        // Mostrar celebración
        if (showCelebrationFlag) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }
        
        // Mostrar logro
        if (achievement) {
            setAchievementPopup(achievement);
            addReward(achievement);
            updateMetadata({ achievementsEarned: (gameState.metadata?.achievementsEarned || 0) + 1 });
        }
    };
    
    // =====================================================
    // MANEJO DE COLA DE FEEDBACK
    // =====================================================
    
    useEffect(() => {
        if (feedbackQueue.length > 0 && !currentFeedback) {
            const nextFeedback = feedbackQueue[0];
            setCurrentFeedback(nextFeedback);
            setFeedbackQueue(prev => prev.slice(1));
            
            // Auto-remover feedback después del tiempo especificado
            setTimeout(() => {
                setCurrentFeedback(null);
            }, nextFeedback.duration);
        }
    }, [feedbackQueue, currentFeedback]);
    
    // =====================================================
    // COMPONENTE DE CELEBRACIÓN
    // =====================================================
    
    const CelebrationEffect = () => {
        if (!showCelebration) return null;
        
        return (
            <div className="celebration-overlay">
                <div className="celebration-container">
                    <div className="celebration-icon">🎉</div>
                    <div className="celebration-text">¡Excelente Trabajo!</div>
                    <div className="celebration-particles">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="particle"
                                style={{
                                    '--delay': `${i * 0.1}s`,
                                    '--angle': `${i * 18}deg`,
                                    '--distance': `${50 + Math.random() * 50}px`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };
    
    // =====================================================
    // COMPONENTE DE LOGRO
    // =====================================================
    
    const AchievementPopup = () => {
        if (!achievementPopup) return null;
        
        return (
            <div className="achievement-popup">
                <div className="achievement-content">
                    <div className="achievement-icon">{achievementPopup.icon}</div>
                    <div className="achievement-info">
                        <h3 className="achievement-title">{achievementPopup.title}</h3>
                        <p className="achievement-description">{achievementPopup.description}</p>
                        <div className="achievement-points">+{achievementPopup.points} puntos</div>
                    </div>
                    <button 
                        className="achievement-close"
                        onClick={() => setAchievementPopup(null)}
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    };
    
    // =====================================================
    // COMPONENTE DE FEEDBACK PRINCIPAL
    // =====================================================
    
    const FeedbackMessage = () => {
        if (!currentFeedback) return null;
        
        return (
            <div 
                className={`feedback-message ${currentFeedback.type}`}
                style={{ 
                    '--feedback-color': currentFeedback.color,
                    animation: 'slideInRight 0.3s ease'
                }}
            >
                <div className="feedback-icon">
                    {currentFeedback.icon}
                </div>
                <div className="feedback-content">
                    <h4 className="feedback-title">{currentFeedback.title}</h4>
                    <p className="feedback-text">{currentFeedback.message}</p>
                </div>
                <div className="feedback-progress">
                    <div 
                        className="progress-bar"
                        style={{ 
                            animation: `progress ${currentFeedback.duration}ms linear`
                        }}
                    />
                </div>
            </div>
        );
    };
    
    // =====================================================
    // ESTADÍSTICAS DE FEEDBACK
    // =====================================================
    
    const FeedbackStats = () => {
        const stats = {
            totalActions: gameState.metadata?.totalActions || 0,
            patternsDiscovered: gameState.metadata?.patternsDiscovered || 0,
            toolsUsed: gameState.metadata?.toolsUsed || 0,
            familyActivities: gameState.metadata?.familyActivities || 0,
            achievementsEarned: gameState.metadata?.achievementsEarned || 0
        };
        
        return (
            <div className="feedback-stats">
                <div className="stat-item">
                    <span className="stat-icon">🎯</span>
                    <span className="stat-value">{stats.totalActions}</span>
                    <span className="stat-label">Acciones</span>
                </div>
                <div className="stat-item">
                    <span className="stat-icon">🔍</span>
                    <span className="stat-value">{stats.patternsDiscovered}</span>
                    <span className="stat-label">Patrones</span>
                </div>
                <div className="stat-item">
                    <span className="stat-icon">🛠️</span>
                    <span className="stat-value">{stats.toolsUsed}</span>
                    <span className="stat-label">Herramientas</span>
                </div>
                <div className="stat-item">
                    <span className="stat-icon">👨‍👩‍👧‍👦</span>
                    <span className="stat-value">{stats.familyActivities}</span>
                    <span className="stat-label">Familia</span>
                </div>
                <div className="stat-item">
                    <span className="stat-icon">🏆</span>
                    <span className="stat-value">{stats.achievementsEarned}</span>
                    <span className="stat-label">Logros</span>
                </div>
            </div>
        );
    };
    
    // =====================================================
    // RENDERIZADO
    // =====================================================
    
    return (
        <div className="feedback-system">
            {/* Feedback principal */}
            <FeedbackMessage />
            
            {/* Popup de logros */}
            <AchievementPopup />
            
            {/* Efecto de celebración */}
            <CelebrationEffect />
            
            {/* Estadísticas de feedback */}
            <FeedbackStats />
            
            {/* Indicador de sonido */}
            {isPlayingSound && (
                <div className="sound-indicator">
                    🔊
                </div>
            )}
        </div>
    );
};

export default FeedbackSystem; 