import React, { useState, useEffect, useRef } from 'react';
import { useGameSession, useGameHypotheses, useGameTools } from '../../../contexts/GameSessionContext';
import './PatternDiscoveryArea.css';

const PatternDiscoveryArea = ({ 
    worldConfig, 
    tools, 
    unlockedTools, 
    onUserAction, 
    onChallengeComplete, 
    familyMode 
}) => {
    const { recordHypothesis, unlockTool } = useGameSession();
    const { recordHypothesis: recordHypothesisAction } = useGameHypotheses();
    const { unlockTool: unlockToolAction } = useGameTools();
    
    // Estados del componente
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [draggedNumber, setDraggedNumber] = useState(null);
    const [patternSequence, setPatternSequence] = useState([]);
    const [currentPattern, setCurrentPattern] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showTools, setShowTools] = useState(false);
    const [activeTool, setActiveTool] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Referencias para elementos del DOM
    const numberGridRef = useRef(null);
    const patternAreaRef = useRef(null);
    const voiceRecognitionRef = useRef(null);
    
    // Configuración del mundo actual
    const { range, pattern, color } = worldConfig;
    const [minNumber, maxNumber] = range.split('-').map(Number);
    
    // Generar números para el grid
    const generateNumbers = () => {
        const numbers = [];
        for (let i = minNumber; i <= maxNumber; i++) {
            numbers.push({
                id: i,
                value: i,
                isSelected: false,
                isInPattern: false
            });
        }
        return numbers;
    };
    
    const [numberGrid, setNumberGrid] = useState(generateNumbers());
    
    // =====================================================
    // FUNCIONES DE INTERACCIÓN CON NÚMEROS
    // =====================================================
    
    const handleNumberClick = (numberId) => {
        setNumberGrid(prev => prev.map(num => 
            num.id === numberId 
                ? { ...num, isSelected: !num.isSelected }
                : num
        ));
        
        setSelectedNumbers(prev => {
            if (prev.includes(numberId)) {
                return prev.filter(id => id !== numberId);
            } else {
                return [...prev, numberId];
            }
        });
    };
    
    const handleNumberDragStart = (e, numberId) => {
        setDraggedNumber(numberId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', numberId.toString());
    };
    
    const handleNumberDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    
    const handleNumberDrop = (e, targetId) => {
        e.preventDefault();
        if (draggedNumber && draggedNumber !== targetId) {
            // Intercambiar posiciones
            setNumberGrid(prev => {
                const newGrid = [...prev];
                const draggedIndex = newGrid.findIndex(n => n.id === draggedNumber);
                const targetIndex = newGrid.findIndex(n => n.id === targetId);
                
                if (draggedIndex !== -1 && targetIndex !== -1) {
                    [newGrid[draggedIndex], newGrid[targetIndex]] = 
                    [newGrid[targetIndex], newGrid[draggedIndex]];
                }
                
                return newGrid;
            });
        }
        setDraggedNumber(null);
    };
    
    // =====================================================
    // FUNCIONES DE DESCUBRIMIENTO DE PATRONES
    // =====================================================
    
    const analyzePattern = () => {
        if (selectedNumbers.length < 3) {
            setFeedback({
                type: 'warning',
                message: 'Selecciona al menos 3 números para descubrir un patrón'
            });
            return;
        }
        
        const sortedNumbers = selectedNumbers.sort((a, b) => a - b);
        const differences = [];
        
        for (let i = 1; i < sortedNumbers.length; i++) {
            differences.push(sortedNumbers[i] - sortedNumbers[i-1]);
        }
        
        // Verificar si hay un patrón consistente
        const isConsistent = differences.every(diff => diff === differences[0]);
        
        if (isConsistent) {
            const patternType = getPatternType(differences[0]);
            const patternData = {
                numbers: sortedNumbers,
                difference: differences[0],
                type: patternType,
                discovered_at: new Date().toISOString()
            };
            
            // Registrar hipótesis
            recordHypothesis(patternData);
            recordHypothesisAction(patternData);
            
            setPatternSequence(sortedNumbers);
            setCurrentPattern(patternType);
            
            setFeedback({
                type: 'success',
                message: `¡Excelente! Has descubierto el patrón: ${patternType}`
            });
            
            // Desbloquear herramienta si es necesario
            if (sortedNumbers.length >= 5) {
                unlockTool('calculadora_patrones');
                unlockToolAction('calculadora_patrones');
            }
            
            // Enviar acción al servidor
            onUserAction('pattern_discovery', patternData);
            
        } else {
            setFeedback({
                type: 'error',
                message: 'Los números seleccionados no siguen un patrón claro. ¡Intenta de nuevo!'
            });
        }
    };
    
    const getPatternType = (difference) => {
        switch (difference) {
            case 1: return 'de 1 en 1';
            case 2: return 'de 2 en 2';
            case 5: return 'de 5 en 5';
            case 10: return 'de 10 en 10';
            default: return `de ${difference} en ${difference}`;
        }
    };
    
    // =====================================================
    // FUNCIONES DE HERRAMIENTAS
    // =====================================================
    
    const activateTool = (toolId) => {
        setActiveTool(toolId);
        setShowTools(false);
        
        switch (toolId) {
            case 'calculadora_patrones':
                showPatternCalculator();
                break;
            case 'microscopio_numerico':
                showNumberMicroscope();
                break;
            default:
                break;
        }
    };
    
    const showPatternCalculator = () => {
        // Simular calculadora de patrones
        setFeedback({
            type: 'info',
            message: 'Calculadora de Patrones activada. Selecciona números para analizar patrones automáticamente.'
        });
    };
    
    const showNumberMicroscope = () => {
        // Simular microscopio numérico
        setFeedback({
            type: 'info',
            message: 'Microscopio Numérico activado. Amplía la vista de los números para análisis detallado.'
        });
    };
    
    // =====================================================
    // FUNCIONES DE VOZ
    // =====================================================
    
    const startVoiceRecognition = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'es-ES';
            
            recognition.onstart = () => {
                setIsRecording(true);
                setFeedback({
                    type: 'info',
                    message: 'Escuchando... Di el patrón que descubriste'
                });
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                processVoiceCommand(transcript);
            };
            
            recognition.onerror = (event) => {
                setIsRecording(false);
                setFeedback({
                    type: 'error',
                    message: 'Error en el reconocimiento de voz. Intenta de nuevo.'
                });
            };
            
            recognition.onend = () => {
                setIsRecording(false);
            };
            
            voiceRecognitionRef.current = recognition;
            recognition.start();
        } else {
            setFeedback({
                type: 'error',
                message: 'El reconocimiento de voz no está disponible en este dispositivo.'
            });
        }
    };
    
    const processVoiceCommand = (transcript) => {
        const patternKeywords = {
            'uno en uno': 'de 1 en 1',
            'dos en dos': 'de 2 en 2',
            'cinco en cinco': 'de 5 en 5',
            'diez en diez': 'de 10 en 10'
        };
        
        for (const [keyword, pattern] of Object.entries(patternKeywords)) {
            if (transcript.includes(keyword)) {
                setCurrentPattern(pattern);
                setFeedback({
                    type: 'success',
                    message: `¡Perfecto! Has identificado el patrón: ${pattern}`
                });
                
                onUserAction('voice_command', {
                    command: transcript,
                    pattern: pattern
                });
                return;
            }
        }
        
        setFeedback({
            type: 'error',
            message: 'No pude entender el patrón. Intenta decir "uno en uno", "dos en dos", etc.'
        });
    };
    
    // =====================================================
    // FUNCIONES DE FAMILIA
    // =====================================================
    
    const handleFamilyInteraction = () => {
        if (familyMode && selectedNumbers.length > 0) {
            const familyData = {
                activity_type: 'Compartir Descubrimientos',
                numbers: selectedNumbers,
                pattern: currentPattern,
                timestamp: new Date().toISOString()
            };
            
            onUserAction('family_activity', familyData);
            
            setFeedback({
                type: 'success',
                message: '¡Compartiste tu descubrimiento con la familia!'
            });
        }
    };
    
    // =====================================================
    // EFECTOS
    // =====================================================
    
    useEffect(() => {
        // Limpiar feedback después de 5 segundos
        if (feedback) {
            const timer = setTimeout(() => {
                setFeedback(null);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [feedback]);
    
    useEffect(() => {
        // Limpiar reconocimiento de voz al desmontar
        return () => {
            if (voiceRecognitionRef.current) {
                voiceRecognitionRef.current.stop();
            }
        };
    }, []);
    
    // =====================================================
    // RENDERIZADO
    // =====================================================
    
    return (
        <div className="pattern-discovery-area">
            {/* Header con controles */}
            <div className="discovery-header">
                <div className="world-info">
                    <h2 className="world-title">
                        {worldConfig.name}
                    </h2>
                    <p className="world-description">
                        Descubre patrones en los números del {range}
                    </p>
                </div>
                
                <div className="discovery-controls">
                    <button 
                        className="analyze-button"
                        onClick={analyzePattern}
                        disabled={selectedNumbers.length < 3}
                    >
                        🔍 Analizar Patrón
                    </button>
                    
                    <button 
                        className="voice-button"
                        onClick={startVoiceRecognition}
                        disabled={isRecording}
                    >
                        {isRecording ? '🎤 Escuchando...' : '🎤 Hablar'}
                    </button>
                    
                    <button 
                        className="tools-button"
                        onClick={() => setShowTools(!showTools)}
                    >
                        🛠️ Herramientas
                    </button>
                    
                    {familyMode && (
                        <button 
                            className="family-button"
                            onClick={handleFamilyInteraction}
                            disabled={selectedNumbers.length === 0}
                        >
                            👨‍👩‍👧‍👦 Compartir
                        </button>
                    )}
                </div>
            </div>
            
            {/* Área de herramientas */}
            {showTools && (
                <div className="tools-panel">
                    <h3>Herramientas de Exploración</h3>
                    <div className="tools-grid">
                        {tools.map(tool => (
                            <button
                                key={tool.id}
                                className={`tool-button ${unlockedTools.includes(tool.id) ? 'unlocked' : 'locked'}`}
                                onClick={() => unlockedTools.includes(tool.id) && activateTool(tool.id)}
                                disabled={!unlockedTools.includes(tool.id)}
                            >
                                <span className="tool-icon">{tool.icon}</span>
                                <span className="tool-name">{tool.name}</span>
                                {!unlockedTools.includes(tool.id) && (
                                    <span className="lock-icon">🔒</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Grid de números */}
            <div className="number-grid-container">
                <div 
                    ref={numberGridRef}
                    className="number-grid"
                    style={{ '--grid-color': color }}
                >
                    {numberGrid.map(number => (
                        <div
                            key={number.id}
                            className={`number-tile ${number.isSelected ? 'selected' : ''} ${number.isInPattern ? 'in-pattern' : ''}`}
                            onClick={() => handleNumberClick(number.id)}
                            draggable
                            onDragStart={(e) => handleNumberDragStart(e, number.id)}
                            onDragOver={handleNumberDragOver}
                            onDrop={(e) => handleNumberDrop(e, number.id)}
                        >
                            <span className="number-value">{number.value}</span>
                            {number.isSelected && (
                                <div className="selection-indicator">✓</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Área de patrón descubierto */}
            {patternSequence.length > 0 && (
                <div className="pattern-display">
                    <h3>Patrón Descubierto:</h3>
                    <div className="pattern-sequence">
                        {patternSequence.map((num, index) => (
                            <span key={index} className="pattern-number">
                                {num}
                                {index < patternSequence.length - 1 && (
                                    <span className="pattern-arrow">→</span>
                                )}
                            </span>
                        ))}
                    </div>
                    <p className="pattern-type">{currentPattern}</p>
                </div>
            )}
            
            {/* Sistema de feedback */}
            {feedback && (
                <div className={`feedback-message ${feedback.type}`}>
                    <span className="feedback-icon">
                        {feedback.type === 'success' && '✅'}
                        {feedback.type === 'error' && '❌'}
                        {feedback.type === 'warning' && '⚠️'}
                        {feedback.type === 'info' && 'ℹ️'}
                    </span>
                    <span className="feedback-text">{feedback.message}</span>
                </div>
            )}
            
            {/* Indicadores de progreso */}
            <div className="discovery-stats">
                <div className="stat-item">
                    <span className="stat-label">Números seleccionados:</span>
                    <span className="stat-value">{selectedNumbers.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Patrones descubiertos:</span>
                    <span className="stat-value">{patternSequence.length > 0 ? 1 : 0}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Herramientas desbloqueadas:</span>
                    <span className="stat-value">{unlockedTools.length}</span>
                </div>
            </div>
        </div>
    );
};

export default PatternDiscoveryArea; 