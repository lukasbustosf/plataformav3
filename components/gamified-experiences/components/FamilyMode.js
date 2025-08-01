import React, { useState, useEffect } from 'react';
import { useGameSession } from '../../../contexts/GameSessionContext';
import './FamilyMode.css';

const FamilyMode = ({ onClose, onStartActivity, onShareDiscovery }) => {
    const { gameState, updateMetadata } = useGameSession();
    
    // Estados del componente
    const [activeTab, setActiveTab] = useState('activities');
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [sharedDiscoveries, setSharedDiscoveries] = useState([]);
    
    // Configuración de pestañas familiares
    const familyTabs = {
        activities: {
            title: 'Actividades Familiares',
            icon: '👨‍👩‍👧‍👦',
            description: 'Juegos y actividades para hacer en familia'
        },
        progress: {
            title: 'Progreso Compartido',
            icon: '📊',
            description: 'Ver el progreso del estudiante'
        },
        discoveries: {
            title: 'Descubrimientos',
            icon: '🔍',
            description: 'Patrones y logros compartidos'
        },
        rewards: {
            title: 'Recompensas Familiares',
            icon: '🏆',
            description: 'Logros obtenidos juntos'
        }
    };
    
    // Actividades familiares disponibles
    const familyActivities = [
        {
            id: 'number_hunt',
            name: 'Búsqueda de Números',
            description: 'Busca números en tu casa y clasifícalos',
            duration: '15-20 min',
            difficulty: 'Fácil',
            materials: ['Papel', 'Lápiz'],
            instructions: [
                'Busca números en tu casa (reloj, calendario, etc.)',
                'Escribe los números que encuentres',
                'Clasifícalos por tamaño',
                'Cuenta cuántos hay de cada tipo'
            ],
            learning_objectives: ['Reconocimiento de números', 'Clasificación', 'Conteo'],
            icon: '🔍',
            category: 'exploration'
        },
        {
            id: 'pattern_creation',
            name: 'Crear Patrones',
            description: 'Crea patrones con objetos de la casa',
            duration: '20-25 min',
            difficulty: 'Medio',
            materials: ['Objetos pequeños', 'Papel'],
            instructions: [
                'Recoge objetos pequeños (botones, monedas, etc.)',
                'Crea un patrón simple (ej: botón, moneda, botón)',
                'Continúa el patrón',
                'Describe el patrón que creaste'
            ],
            learning_objectives: ['Identificación de patrones', 'Secuenciación', 'Descripción'],
            icon: '🎨',
            category: 'creation'
        },
        {
            id: 'counting_games',
            name: 'Juegos de Conteo',
            description: 'Juegos divertidos para practicar conteo',
            duration: '10-15 min',
            difficulty: 'Fácil',
            materials: ['Objetos cotidianos'],
            instructions: [
                'Cuenta objetos en tu casa',
                'Juega "¿Cuántos hay?"',
                'Cuenta de 2 en 2, de 5 en 5',
                'Practica contar hacia atrás'
            ],
            learning_objectives: ['Conteo', 'Secuencias numéricas', 'Subitización'],
            icon: '🔢',
            category: 'counting'
        },
        {
            id: 'math_story',
            name: 'Historia Matemática',
            description: 'Crea una historia usando números',
            duration: '15-20 min',
            difficulty: 'Medio',
            materials: ['Imaginación', 'Papel'],
            instructions: [
                'Inventa una historia con números',
                'Usa diferentes cantidades',
                'Incluye patrones en la historia',
                'Dibuja la historia'
            ],
            learning_objectives: ['Contextualización', 'Creatividad', 'Narrativa'],
            icon: '📖',
            category: 'storytelling'
        },
        {
            id: 'measurement_fun',
            name: 'Diversión con Medidas',
            description: 'Mide objetos usando partes del cuerpo',
            duration: '20-25 min',
            difficulty: 'Medio',
            materials: ['Objetos de la casa'],
            instructions: [
                'Mide objetos con tus manos',
                'Compara tamaños',
                'Estima cuántas manos mide cada objeto',
                'Registra tus mediciones'
            ],
            learning_objectives: ['Medición', 'Estimación', 'Comparación'],
            icon: '📏',
            category: 'measurement'
        },
        {
            id: 'number_art',
            name: 'Arte con Números',
            description: 'Crea arte usando números y patrones',
            duration: '25-30 min',
            difficulty: 'Medio',
            materials: ['Papel', 'Lápices de colores', 'Marcadores'],
            instructions: [
                'Dibuja números grandes',
                'Decóralos con patrones',
                'Crea un collage numérico',
                'Explica tu obra de arte'
            ],
            learning_objectives: ['Expresión artística', 'Reconocimiento visual', 'Creatividad'],
            icon: '🎨',
            category: 'art'
        }
    ];
    
    // Obtener actividades por categoría
    const getActivitiesByCategory = (category) => {
        if (category === 'all') return familyActivities;
        return familyActivities.filter(activity => activity.category === category);
    };
    
    // Obtener progreso del estudiante
    const getStudentProgress = () => {
        return {
            totalPatterns: gameState.metadata?.patternsDiscovered || 0,
            totalTools: gameState.metadata?.toolsUsed || 0,
            totalActions: gameState.metadata?.totalActions || 0,
            currentWorld: gameState.currentWorld,
            completedChallenges: gameState.completedChallenges.length,
            totalRewards: gameState.rewards.length
        };
    };
    
    // Obtener descubrimientos recientes
    const getRecentDiscoveries = () => {
        return gameState.hypotheses.slice(-5).map(hypothesis => ({
            id: hypothesis.id,
            pattern: hypothesis.pattern,
            description: hypothesis.description,
            discovered_at: hypothesis.recorded_at,
            shared: hypothesis.shared || false
        }));
    };
    
    // Manejar inicio de actividad
    const handleStartActivity = (activity) => {
        setSelectedActivity(activity);
        setShowActivityModal(true);
    };
    
    // Confirmar inicio de actividad
    const confirmStartActivity = () => {
        if (selectedActivity) {
            onStartActivity(selectedActivity);
            updateMetadata({ 
                familyActivities: (gameState.metadata?.familyActivities || 0) + 1 
            });
            setShowActivityModal(false);
            setSelectedActivity(null);
        }
    };
    
    // Compartir descubrimiento
    const handleShareDiscovery = (discovery) => {
        onShareDiscovery(discovery);
        setSharedDiscoveries(prev => [...prev, discovery]);
        updateMetadata({ 
            familyActivities: (gameState.metadata?.familyActivities || 0) + 1 
        });
    };
    
    // Obtener color por categoría
    const getCategoryColor = (category) => {
        switch (category) {
            case 'exploration': return '#4CAF50';
            case 'creation': return '#2196F3';
            case 'counting': return '#FF9800';
            case 'storytelling': return '#9C27B0';
            case 'measurement': return '#607D8B';
            case 'art': return '#E91E63';
            default: return '#7f8c8d';
        }
    };
    
    // Obtener icono por dificultad
    const getDifficultyIcon = (difficulty) => {
        switch (difficulty) {
            case 'Fácil': return '🟢';
            case 'Medio': return '🟡';
            case 'Difícil': return '🔴';
            default: return '⚪';
        }
    };
    
    // =====================================================
    // COMPONENTE DE PESTAÑA FAMILIAR
    // =====================================================
    
    const FamilyTabButton = ({ tab, isActive, onClick }) => {
        const tabData = familyTabs[tab];
        
        return (
            <button
                className={`family-tab-button ${isActive ? 'active' : ''}`}
                onClick={() => onClick(tab)}
            >
                <div className="family-tab-icon">{tabData.icon}</div>
                <div className="family-tab-content">
                    <div className="family-tab-title">{tabData.title}</div>
                    <div className="family-tab-description">{tabData.description}</div>
                </div>
            </button>
        );
    };
    
    // =====================================================
    // COMPONENTE DE ACTIVIDAD FAMILIAR
    // =====================================================
    
    const FamilyActivityCard = ({ activity, onStart }) => {
        const categoryColor = getCategoryColor(activity.category);
        const difficultyIcon = getDifficultyIcon(activity.difficulty);
        
        return (
            <div 
                className="family-activity-card"
                style={{ '--category-color': categoryColor }}
            >
                <div className="activity-header">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-meta">
                        <span className="activity-duration">{activity.duration}</span>
                        <span className="activity-difficulty">
                            {difficultyIcon} {activity.difficulty}
                        </span>
                    </div>
                </div>
                
                <div className="activity-content">
                    <h3 className="activity-name">{activity.name}</h3>
                    <p className="activity-description">{activity.description}</p>
                    
                    <div className="activity-materials">
                        <strong>Materiales:</strong> {activity.materials.join(', ')}
                    </div>
                    
                    <div className="activity-objectives">
                        <strong>Objetivos:</strong>
                        <ul>
                            {activity.learning_objectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className="activity-actions">
                    <button 
                        className="start-activity-button"
                        onClick={() => onStart(activity)}
                    >
                        🚀 Comenzar Actividad
                    </button>
                </div>
            </div>
        );
    };
    
    // =====================================================
    // COMPONENTE DE PROGRESO DEL ESTUDIANTE
    // =====================================================
    
    const StudentProgress = () => {
        const progress = getStudentProgress();
        
        return (
            <div className="student-progress">
                <div className="progress-header">
                    <h3>📊 Progreso del Estudiante</h3>
                    <p>Descubre cómo va el aprendizaje</p>
                </div>
                
                <div className="progress-grid">
                    <div className="progress-item">
                        <div className="progress-icon">🔍</div>
                        <div className="progress-info">
                            <div className="progress-value">{progress.totalPatterns}</div>
                            <div className="progress-label">Patrones Descubiertos</div>
                        </div>
                    </div>
                    
                    <div className="progress-item">
                        <div className="progress-icon">🛠️</div>
                        <div className="progress-info">
                            <div className="progress-value">{progress.totalTools}</div>
                            <div className="progress-label">Herramientas Usadas</div>
                        </div>
                    </div>
                    
                    <div className="progress-item">
                        <div className="progress-icon">🎯</div>
                        <div className="progress-info">
                            <div className="progress-value">{progress.completedChallenges}</div>
                            <div className="progress-label">Desafíos Completados</div>
                        </div>
                    </div>
                    
                    <div className="progress-item">
                        <div className="progress-icon">🏆</div>
                        <div className="progress-info">
                            <div className="progress-value">{progress.totalRewards}</div>
                            <div className="progress-label">Recompensas Ganadas</div>
                        </div>
                    </div>
                </div>
                
                <div className="current-world-info">
                    <h4>🌍 Mundo Actual</h4>
                    <div className="world-display">
                        <span className="world-name">
                            {gameState.currentWorld === 'bosque_decenas' ? 'Bosque de las Decenas' :
                             gameState.currentWorld === 'rio_cincos' ? 'Río de los Cincos' :
                             gameState.currentWorld === 'montana_cientos' ? 'Montaña de los Cientos' :
                             'Explorando'}
                        </span>
                    </div>
                </div>
            </div>
        );
    };
    
    // =====================================================
    // COMPONENTE DE DESCUBRIMIENTOS
    // =====================================================
    
    const DiscoveriesList = () => {
        const discoveries = getRecentDiscoveries();
        
        return (
            <div className="discoveries-list">
                <div className="discoveries-header">
                    <h3>🔍 Descubrimientos Recientes</h3>
                    <p>Patrones y logros del estudiante</p>
                </div>
                
                {discoveries.length === 0 ? (
                    <div className="no-discoveries">
                        <div className="no-discoveries-icon">🔍</div>
                        <p>¡Aún no hay descubrimientos para compartir!</p>
                        <p>Anima al estudiante a explorar patrones</p>
                    </div>
                ) : (
                    <div className="discoveries-grid">
                        {discoveries.map((discovery, index) => (
                            <div key={discovery.id || index} className="discovery-card">
                                <div className="discovery-header">
                                    <div className="discovery-icon">🔍</div>
                                    <div className="discovery-date">
                                        {new Date(discovery.discovered_at).toLocaleDateString()}
                                    </div>
                                </div>
                                
                                <div className="discovery-content">
                                    <h4 className="discovery-pattern">{discovery.pattern}</h4>
                                    <p className="discovery-description">{discovery.description}</p>
                                </div>
                                
                                <div className="discovery-actions">
                                    {!discovery.shared ? (
                                        <button 
                                            className="share-discovery-button"
                                            onClick={() => handleShareDiscovery(discovery)}
                                        >
                                            💝 Compartir con Familia
                                        </button>
                                    ) : (
                                        <div className="shared-badge">✅ Compartido</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    // =====================================================
    // COMPONENTE DE MODAL DE ACTIVIDAD
    // =====================================================
    
    const ActivityModal = () => {
        if (!showActivityModal || !selectedActivity) return null;
        
        return (
            <div className="activity-modal-overlay">
                <div className="activity-modal">
                    <div className="modal-header">
                        <h2>{selectedActivity.name}</h2>
                        <button 
                            className="modal-close"
                            onClick={() => setShowActivityModal(false)}
                        >
                            ✕
                        </button>
                    </div>
                    
                    <div className="modal-content">
                        <div className="activity-details">
                            <div className="activity-info">
                                <p><strong>Duración:</strong> {selectedActivity.duration}</p>
                                <p><strong>Dificultad:</strong> {selectedActivity.difficulty}</p>
                                <p><strong>Materiales:</strong> {selectedActivity.materials.join(', ')}</p>
                            </div>
                            
                            <div className="activity-instructions">
                                <h4>📋 Instrucciones:</h4>
                                <ol>
                                    {selectedActivity.instructions.map((instruction, index) => (
                                        <li key={index}>{instruction}</li>
                                    ))}
                                </ol>
                            </div>
                            
                            <div className="activity-objectives">
                                <h4>🎯 Objetivos de Aprendizaje:</h4>
                                <ul>
                                    {selectedActivity.learning_objectives.map((objective, index) => (
                                        <li key={index}>{objective}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-actions">
                        <button 
                            className="cancel-button"
                            onClick={() => setShowActivityModal(false)}
                        >
                            Cancelar
                        </button>
                        <button 
                            className="confirm-button"
                            onClick={confirmStartActivity}
                        >
                            🚀 Comenzar Actividad
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    
    // =====================================================
    // RENDERIZADO
    // =====================================================
    
    return (
        <div className="family-mode">
            {/* Header */}
            <div className="family-header">
                <h2 className="family-title">👨‍👩‍👧‍👦 Modo Familiar</h2>
                <button className="close-button" onClick={onClose}>
                    ✕
                </button>
            </div>
            
            {/* Pestañas */}
            <div className="family-tabs">
                {Object.keys(familyTabs).map(tab => (
                    <FamilyTabButton
                        key={tab}
                        tab={tab}
                        isActive={activeTab === tab}
                        onClick={setActiveTab}
                    />
                ))}
            </div>
            
            {/* Contenido de la pestaña activa */}
            <div className="family-content">
                {activeTab === 'activities' && (
                    <div className="activities-section">
                        <div className="section-header">
                            <h3>🎮 Actividades Familiares</h3>
                            <p>Juegos y actividades para hacer en familia y reforzar el aprendizaje</p>
                        </div>
                        
                        <div className="activities-grid">
                            {familyActivities.map(activity => (
                                <FamilyActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    onStart={handleStartActivity}
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {activeTab === 'progress' && (
                    <StudentProgress />
                )}
                
                {activeTab === 'discoveries' && (
                    <DiscoveriesList />
                )}
                
                {activeTab === 'rewards' && (
                    <div className="rewards-section">
                        <div className="section-header">
                            <h3>🏆 Recompensas Familiares</h3>
                            <p>Logros obtenidos trabajando juntos</p>
                        </div>
                        
                        <div className="family-rewards">
                            <div className="reward-item">
                                <div className="reward-icon">👨‍👩‍👧‍👦</div>
                                <div className="reward-info">
                                    <h4>Actividades Completadas</h4>
                                    <p>{gameState.metadata?.familyActivities || 0} actividades realizadas</p>
                                </div>
                            </div>
                            
                            <div className="reward-item">
                                <div className="reward-icon">💝</div>
                                <div className="reward-info">
                                    <h4>Descubrimientos Compartidos</h4>
                                    <p>{sharedDiscoveries.length} patrones compartidos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Modal de actividad */}
            <ActivityModal />
        </div>
    );
};

export default FamilyMode; 