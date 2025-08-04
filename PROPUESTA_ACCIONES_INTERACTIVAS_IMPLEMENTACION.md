# PROPUESTA DE IMPLEMENTACIÓN - ACCIONES INTERACTIVAS AVANZADAS

## 🎯 ACCIONES PRIORITARIAS PARA IMPLEMENTAR

### 1. **SISTEMA DE PUZZLES NUMÉRICOS** (Alta Prioridad)

#### Implementación Técnica
```typescript
interface NumberPuzzleConfig {
  id: string;
  type: "sliding_puzzle" | "rotation_puzzle" | "pattern_puzzle";
  grid: number[][];
  targetGrid: number[][];
  maxMoves: number;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

const PUZZLE_CONFIGS = {
  pollitos: {
    sliding_puzzle: {
      grid: [[1, 2, 3], [4, 5, 6], [7, 8, 0]],
      targetGrid: [[1, 2, 3], [4, 5, 6], [7, 8, 0]],
      maxMoves: 20,
      hint: "Mueve las piezas para ordenar los números del 1 al 8"
    }
  },
  gallinas: {
    rotation_puzzle: {
      grid: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]],
      targetGrid: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]],
      maxMoves: 30,
      hint: "Rota los bloques para ordenar los números del 1 al 15"
    }
  }
};
```

#### Componente React
```typescript
const NumberPuzzle: React.FC<{config: NumberPuzzleConfig}> = ({config}) => {
  const [currentGrid, setCurrentGrid] = useState(config.grid);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleTileClick = (row: number, col: number) => {
    // Lógica de movimiento de piezas
    const newGrid = moveTile(currentGrid, row, col);
    setCurrentGrid(newGrid);
    setMoves(prev => prev + 1);
    
    if (isGridComplete(newGrid, config.targetGrid)) {
      setIsComplete(true);
      speak("¡Excelente! Has completado el puzzle.");
    }
  };
  
  return (
    <div className="number-puzzle">
      <div className="puzzle-grid">
        {currentGrid.map((row, rowIndex) => (
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`puzzle-tile ${tile === 0 ? 'empty' : ''}`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            >
              {tile !== 0 && tile}
            </div>
          ))
        ))}
      </div>
      <div className="puzzle-info">
        <span>Movimientos: {moves}/{config.maxMoves}</span>
        <button onClick={() => setCurrentGrid(config.grid)}>Reiniciar</button>
      </div>
    </div>
  );
};
```

### 2. **SISTEMA DE CARRERAS NUMÉRICAS** (Alta Prioridad)

#### Implementación Técnica
```typescript
interface RaceConfig {
  id: string;
  track: RaceTile[];
  obstacles: Obstacle[];
  powerUps: PowerUp[];
  finishLine: number;
  timeLimit: number;
}

interface RaceTile {
  position: number;
  type: "normal" | "speed" | "slow" | "skip" | "backward";
  number: number;
  effect: string;
}

const RACE_CONFIGS = {
  pollitos: {
    track: [
      {position: 1, type: "normal", number: 1, effect: "Cuenta 1"},
      {position: 2, type: "speed", number: 2, effect: "Cuenta 2 y avanza 2"},
      {position: 3, type: "normal", number: 3, effect: "Cuenta 3"},
      {position: 4, type: "skip", number: 4, effect: "Salta al 6"},
      {position: 5, type: "normal", number: 5, effect: "Cuenta 5"}
    ],
    finishLine: 5,
    timeLimit: 60
  }
};
```

#### Componente React
```typescript
const NumberRace: React.FC<{config: RaceConfig}> = ({config}) => {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [score, setScore] = useState(0);
  
  const handleNumberClick = (number: number) => {
    if (number === currentNumber) {
      const currentTile = config.track[playerPosition];
      
      switch (currentTile.type) {
        case "speed":
          setPlayerPosition(prev => Math.min(prev + 2, config.finishLine));
          break;
        case "skip":
          setPlayerPosition(prev => Math.min(prev + 3, config.finishLine));
          break;
        case "backward":
          setPlayerPosition(prev => Math.max(prev - 1, 0));
          break;
        default:
          setPlayerPosition(prev => prev + 1);
      }
      
      setCurrentNumber(prev => prev + 1);
      setScore(prev => prev + 50);
      
      if (playerPosition >= config.finishLine) {
        speak("¡Felicidades! Has ganado la carrera.");
      }
    } else {
      speak("Ese número no es correcto. Intenta de nuevo.");
    }
  };
  
  return (
    <div className="number-race">
      <div className="race-track">
        {config.track.map((tile, index) => (
          <div
            key={index}
            className={`race-tile ${tile.type} ${playerPosition === index ? 'current' : ''}`}
          >
            <span className="tile-number">{tile.number}</span>
            <span className="tile-effect">{tile.effect}</span>
          </div>
        ))}
      </div>
      <div className="race-controls">
        <div className="current-number">Número actual: {currentNumber}</div>
        <div className="number-buttons">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="number-btn"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 3. **SISTEMA DE MEMORIA NUMÉRICA** (Media Prioridad)

#### Implementación Técnica
```typescript
interface MemoryCard {
  id: string;
  value: number;
  emoji: string;
  isRevealed: boolean;
  isMatched: boolean;
}

interface MemoryConfig {
  id: string;
  cards: MemoryCard[];
  pairs: number;
  timeLimit: number;
  difficulty: "easy" | "medium" | "hard";
}

const MEMORY_CONFIGS = {
  pollitos: {
    cards: [
      {id: "1", value: 1, emoji: "🐣", isRevealed: false, isMatched: false},
      {id: "2", value: 2, emoji: "🐣🐣", isRevealed: false, isMatched: false},
      {id: "3", value: 3, emoji: "🐣🐣🐣", isRevealed: false, isMatched: false},
      {id: "4", value: 4, emoji: "🐣🐣🐣🐣", isRevealed: false, isMatched: false},
      {id: "5", value: 5, emoji: "🐣🐣🐣🐣🐣", isRevealed: false, isMatched: false}
    ],
    pairs: 5,
    timeLimit: 120,
    difficulty: "easy"
  }
};
```

#### Componente React
```typescript
const NumberMemory: React.FC<{config: MemoryConfig}> = ({config}) => {
  const [cards, setCards] = useState(config.cards);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  
  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2) return;
    
    const updatedCards = cards.map(card => 
      card.id === cardId ? {...card, isRevealed: true} : card
    );
    setCards(updatedCards);
    setFlippedCards(prev => [...prev, cardId]);
    
    if (flippedCards.length === 1) {
      // Verificar si hay match
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      const secondCard = cards.find(c => c.id === cardId);
      
      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        setMatchedPairs(prev => prev + 1);
        speak(`¡Excelente! Encontraste el par ${firstCard.value}`);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            flippedCards.includes(card.id) || card.id === cardId 
              ? {...card, isRevealed: false} 
              : card
          ));
        }, 1000);
      }
      setFlippedCards([]);
    }
  };
  
  return (
    <div className="number-memory">
      <div className="memory-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className={`memory-card ${card.isRevealed ? 'revealed' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.isRevealed && (
              <div className="card-content">
                <span className="card-emoji">{card.emoji}</span>
                <span className="card-number">{card.value}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="memory-info">
        <span>Pares encontrados: {matchedPairs}/{config.pairs}</span>
        <span>Tiempo: {timeLeft}s</span>
      </div>
    </div>
  );
};
```

### 4. **SISTEMA DE CONSTRUCCIÓN NUMÉRICA** (Media Prioridad)

#### Implementación Técnica
```typescript
interface ConstructionBlock {
  id: string;
  number: number;
  size: "small" | "medium" | "large";
  color: string;
  position: {x: number, y: number};
}

interface ConstructionConfig {
  id: string;
  blueprint: ConstructionLevel[];
  availableBlocks: ConstructionBlock[];
  maxHeight: number;
  stability: number;
}

const CONSTRUCTION_CONFIGS = {
  pollitos: {
    blueprint: [
      {level: 1, requiredNumbers: [1, 2, 3], height: 1},
      {level: 2, requiredNumbers: [4, 5], height: 2},
      {level: 3, requiredNumbers: [6, 7, 8], height: 3}
    ],
    availableBlocks: [
      {id: "1", number: 1, size: "small", color: "#FF6B6B", position: {x: 0, y: 0}},
      {id: "2", number: 2, size: "small", color: "#4ECDC4", position: {x: 0, y: 0}},
      {id: "3", number: 3, size: "small", color: "#45B7D1", position: {x: 0, y: 0}}
    ],
    maxHeight: 3,
    stability: 0.8
  }
};
```

#### Componente React
```typescript
const NumberConstruction: React.FC<{config: ConstructionConfig}> = ({config}) => {
  const [placedBlocks, setPlacedBlocks] = useState<ConstructionBlock[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isStable, setIsStable] = useState(true);
  
  const handleBlockPlacement = (block: ConstructionBlock, position: {x: number, y: number}) => {
    const newBlock = {...block, position};
    const updatedBlocks = [...placedBlocks, newBlock];
    setPlacedBlocks(updatedBlocks);
    
    // Verificar estabilidad
    const stability = calculateStability(updatedBlocks);
    setIsStable(stability > config.stability);
    
    // Verificar si el nivel está completo
    const levelComplete = checkLevelComplete(updatedBlocks, currentLevel, config.blueprint);
    if (levelComplete) {
      setCurrentLevel(prev => prev + 1);
      speak(`¡Excelente! Has completado el nivel ${currentLevel}.`);
    }
  };
  
  return (
    <div className="number-construction">
      <div className="construction-area">
        <div className="blueprint">
          {config.blueprint.map(level => (
            <div key={level.level} className={`construction-level ${currentLevel === level.level ? 'active' : ''}`}>
              {level.requiredNumbers.map(num => (
                <div key={num} className="required-number">{num}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="construction-grid">
          {placedBlocks.map(block => (
            <div
              key={block.id}
              className="construction-block"
              style={{
                left: block.position.x,
                bottom: block.position.y,
                backgroundColor: block.color
              }}
            >
              {block.number}
            </div>
          ))}
        </div>
      </div>
      <div className="block-palette">
        {config.availableBlocks.map(block => (
          <div
            key={block.id}
            className="available-block"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('block', JSON.stringify(block))}
          >
            {block.number}
          </div>
        ))}
      </div>
      <div className="construction-info">
        <span>Nivel: {currentLevel}</span>
        <span className={`stability ${isStable ? 'stable' : 'unstable'}`}>
          Estabilidad: {isStable ? '✅' : '❌'}
        </span>
      </div>
    </div>
  );
};
```

## 🎨 ESTILOS CSS PARA NUEVAS ACTIVIDADES

### Estilos para Puzzles Numéricos
```css
.number-puzzle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.puzzle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.puzzle-tile {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  border: 2px solid #fff;
  border-radius: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.puzzle-tile:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.puzzle-tile.empty {
  background: transparent;
  border: 2px dashed #ccc;
  cursor: default;
}

.puzzle-info {
  display: flex;
  gap: 2rem;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
}
```

### Estilos para Carreras Numéricas
```css
.number-race {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.race-track {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.race-tile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255,255,255,0.9);
  border-radius: 15px;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.race-tile.current {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255,215,0,0.5);
  transform: scale(1.05);
}

.race-tile.speed {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
}

.race-tile.skip {
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
}

.race-tile.backward {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
}

.race-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.number-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.number-btn {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.number-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}
```

## 🔄 INTEGRACIÓN CON EXPERIENCIA EXISTENTE

### Modificación del LEVEL_CONFIG
```typescript
// Agregar nuevos tipos de actividades al LEVEL_CONFIG existente
const LEVEL_CONFIG = {
  pollitos: {
    // ... configuración existente ...
    activities: [
      // ... actividades existentes ...
      {
        id: "puzzle_pollitos",
        instruction: "Completa el puzzle ordenando los números",
        type: "number_puzzle",
        config: PUZZLE_CONFIGS.pollitos.sliding_puzzle,
        feedback: "¡Excelente! Has ordenado los números correctamente."
      },
      {
        id: "race_pollitos",
        instruction: "Gana la carrera contando correctamente",
        type: "number_race",
        config: RACE_CONFIGS.pollitos,
        feedback: "¡Felicidades! Has ganado la carrera."
      }
    ]
  }
};
```

### Actualización del Componente Principal
```typescript
// En FarmCounter.tsx, agregar casos para nuevos tipos de actividades
const handleInteractiveActivity = useCallback((activityType: string, value: any) => {
  // ... casos existentes ...
  
  switch (activityType) {
    // ... casos existentes ...
    
    case 'number_puzzle':
      // Lógica para puzzles numéricos
      break;
      
    case 'number_race':
      // Lógica para carreras numéricas
      break;
      
    case 'number_memory':
      // Lógica para memoria numérica
      break;
      
    case 'number_construction':
      // Lógica para construcción numérica
      break;
  }
}, [/* dependencias */]);
```

## 📊 MÉTRICAS DE ÉXITO ESPERADAS

### Engagement
- **Puzzles**: 85-90% de completación
- **Carreras**: 80-85% de victorias
- **Memoria**: 75-80% de pares encontrados
- **Construcción**: 70-75% de estructuras estables

### Aprendizaje
- **Comprensión de secuencias**: +15% vs actividades básicas
- **Retención de patrones**: +20% vs actividades básicas
- **Aplicación de conceptos**: +25% vs actividades básicas

### Motivación
- **Tiempo de sesión**: +30% vs actividades básicas
- **Retorno diario**: +40% vs actividades básicas
- **Completación de niveles**: +25% vs actividades básicas

---

*Esta propuesta de implementación proporciona una base sólida para expandir las experiencias gamificadas con actividades más complejas y motivadoras, manteniendo la accesibilidad y el enfoque educativo.* 