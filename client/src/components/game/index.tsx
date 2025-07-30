import React, { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { withGameErrorBoundary } from './GameErrorBoundary'

// Lazy load game components for better performance
const TriviaLightning = lazy(() => import('./TriviaLightning').then(m => ({ default: m.TriviaLightning })))
const ColorMatch = lazy(() => import('./ColorMatch').then(m => ({ default: m.ColorMatch })))
const MemoryFlip = lazy(() => import('./MemoryFlip').then(m => ({ default: m.MemoryFlip })))
const PictureBingo = lazy(() => import('./PictureBingo').then(m => ({ default: m.PictureBingo })))
const DragDropSorting = lazy(() => import('./DragDropSorting').then(m => ({ default: m.DragDropSorting })))
const NumberLineRace = lazy(() => import('./NumberLineRace').then(m => ({ default: m.NumberLineRace })))
const WordBuilder = lazy(() => import('./WordBuilder').then(m => ({ default: m.WordBuilder })))
const WordSearch = lazy(() => import('./WordSearch').then(m => ({ default: m.WordSearch })))
const HangmanVisual = lazy(() => import('./HangmanVisual').then(m => ({ default: m.HangmanVisual })))
const EscapeRoomMini = lazy(() => import('./EscapeRoomMini').then(m => ({ default: m.EscapeRoomMini })))
const StoryPath = lazy(() => import('./StoryPath').then(m => ({ default: m.StoryPath })))
const BoardRace = lazy(() => import('./BoardRace').then(m => ({ default: m.BoardRace })))
const Crossword = lazy(() => import('./Crossword').then(m => ({ default: m.Crossword })))
const WordSearchDuel = lazy(() => import('./WordSearchDuel').then(m => ({ default: m.WordSearchDuel })))
const TimedEquationDuel = lazy(() => import('./TimedEquationDuel').then(m => ({ default: m.TimedEquationDuel })))
const MysteryBoxReveal = lazy(() => import('./MysteryBoxReveal').then(m => ({ default: m.MysteryBoxReveal })))
const DebateCards = lazy(() => import('./DebateCards').then(m => ({ default: m.DebateCards })))
const SimulationTycoon = lazy(() => import('./SimulationTycoon').then(m => ({ default: m.SimulationTycoon })))
const CaseStudySprint = lazy(() => import('./CaseStudySprint').then(m => ({ default: m.CaseStudySprint })))
const CodingPuzzle = lazy(() => import('./CodingPuzzle').then(m => ({ default: m.CodingPuzzle })))
const DataLab = lazy(() => import('./DataLab').then(m => ({ default: m.DataLab })))
const TimelineBuilder = lazy(() => import('./TimelineBuilder').then(m => ({ default: m.TimelineBuilder })))
const ArgumentMap = lazy(() => import('./ArgumentMap').then(m => ({ default: m.ArgumentMap })))
const AdvancedEscapeRoom = lazy(() => import('./AdvancedEscapeRoom').then(m => ({ default: m.AdvancedEscapeRoom })))

// Game Loading Component
const GameLoadingFallback = ({ gameName }: { gameName: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Cargando {gameName}...</h2>
      <p className="text-gray-500 mt-2">Preparando la experiencia de juego</p>
    </div>
  </div>
)

// Wrap all games with error boundaries and lazy loading
const createGameComponent = (Component: any, gameFormat: string, gameName: string) => {
  const WrappedComponent = withGameErrorBoundary((props: any) => (
    <Suspense fallback={<GameLoadingFallback gameName={gameName} />}>
      <Component {...props} />
    </Suspense>
  ), gameFormat)
  
  WrappedComponent.displayName = `Enhanced${gameName.replace(/\s+/g, '')}`
  return WrappedComponent
}

// Enhanced game components with error boundaries and lazy loading
const EnhancedGames = {
  TriviaLightning: createGameComponent(TriviaLightning, 'trivia_lightning', 'Trivia Lightning'),
  ColorMatch: createGameComponent(ColorMatch, 'color_match', 'Color Match'),
  MemoryFlip: createGameComponent(MemoryFlip, 'memory_flip', 'Memory Flip'),
  PictureBingo: createGameComponent(PictureBingo, 'picture_bingo', 'Picture Bingo'),
  DragDropSorting: createGameComponent(DragDropSorting, 'drag_drop_sorting', 'Drag & Drop Sorting'),
  NumberLineRace: createGameComponent(NumberLineRace, 'number_line_race', 'Número-Línea Race'),
  WordBuilder: createGameComponent(WordBuilder, 'word_builder', 'Word Builder'),
  WordSearch: createGameComponent(WordSearch, 'word_search', 'Sopa de Letras'),
  HangmanVisual: createGameComponent(HangmanVisual, 'hangman_visual', 'Hangman Visual'),
  EscapeRoomMini: createGameComponent(EscapeRoomMini, 'escape_room_mini', 'Escape Room Mini'),
  StoryPath: createGameComponent(StoryPath, 'story_path', 'Story Path'),
  BoardRace: createGameComponent(BoardRace, 'board_race', 'Board Race'),
  Crossword: createGameComponent(Crossword, 'crossword', 'Crossword'),
  WordSearchDuel: createGameComponent(WordSearchDuel, 'word_search_duel', 'Word Search Duel'),
  TimedEquationDuel: createGameComponent(TimedEquationDuel, 'timed_equation_duel', 'Timed Equation Duel'),
  MysteryBoxReveal: createGameComponent(MysteryBoxReveal, 'mystery_box_reveal', 'Mystery Box Reveal'),
  DebateCards: createGameComponent(DebateCards, 'debate_cards', 'Debate Cards'),
  SimulationTycoon: createGameComponent(SimulationTycoon, 'simulation_tycoon', 'Simulation Tycoon'),
  CaseStudySprint: createGameComponent(CaseStudySprint, 'case_study_sprint', 'Case Study Sprint'),
  CodingPuzzle: createGameComponent(CodingPuzzle, 'coding_puzzle', 'Coding Puzzle'),
  DataLab: createGameComponent(DataLab, 'data_lab', 'Data Lab'),
  TimelineBuilder: createGameComponent(TimelineBuilder, 'timeline_builder', 'Timeline Builder'),
  ArgumentMap: createGameComponent(ArgumentMap, 'argument_map', 'Argument Map'),
  AdvancedEscapeRoom: createGameComponent(AdvancedEscapeRoom, 'advanced_escape_room', 'Advanced Escape Room')
}

// Export enhanced games for backward compatibility
export const {
  TriviaLightning: TriviaLightningWithErrorBoundary,
  ColorMatch: ColorMatchWithErrorBoundary,
  MemoryFlip: MemoryFlipWithErrorBoundary,
  PictureBingo: PictureBingoWithErrorBoundary,
  DragDropSorting: DragDropSortingWithErrorBoundary,
  NumberLineRace: NumberLineRaceWithErrorBoundary,
  WordBuilder: WordBuilderWithErrorBoundary,
  WordSearch: WordSearchWithErrorBoundary,
  HangmanVisual: HangmanVisualWithErrorBoundary,
  EscapeRoomMini: EscapeRoomMiniWithErrorBoundary,
  StoryPath: StoryPathWithErrorBoundary,
  BoardRace: BoardRaceWithErrorBoundary,
  Crossword: CrosswordWithErrorBoundary,
  WordSearchDuel: WordSearchDuelWithErrorBoundary,
  TimedEquationDuel: TimedEquationDuelWithErrorBoundary,
  MysteryBoxReveal: MysteryBoxRevealWithErrorBoundary,
  DebateCards: DebateCardsWithErrorBoundary,
  SimulationTycoon: SimulationTycoonWithErrorBoundary,
  CaseStudySprint: CaseStudySprintWithErrorBoundary,
  CodingPuzzle: CodingPuzzleWithErrorBoundary,
  DataLab: DataLabWithErrorBoundary,
  TimelineBuilder: TimelineBuilderWithErrorBoundary,
  ArgumentMap: ArgumentMapWithErrorBoundary,
  AdvancedEscapeRoom: AdvancedEscapeRoomWithErrorBoundary
} = EnhancedGames

// Enhanced Game Format Registry with complete metadata
export interface GameFormat {
  id: string
  code: string
  name: string
  description: string
  component: React.ComponentType<any>
  cycleRecommended: string[]
  bloomLevel: string[]
  accessibility: boolean
  maxPlayers: number
  estimatedDuration: number // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'basic' | 'puzzle' | 'competitive' | 'collaborative' | 'critical-thinking'
  requirements: {
    minQuestions: number
    supportsTTS: boolean
    supportsKeyboard: boolean
    supportsTouch: boolean
  }
  performance: {
    bundle_size_kb: number
    loading_priority: 'high' | 'medium' | 'low'
    memory_usage: 'low' | 'medium' | 'high'
  }
  wcag_compliance: {
    level: 'AA' | 'AAA'
    features: string[]
  }
}

export const GAME_FORMATS: GameFormat[] = [
  // G-01 to G-09 - Basic Educational Games
  {
    id: 'G-01',
    code: 'trivia_lightning',
    name: 'Trivia Lightning',
    description: 'Pregunta MCQ → respuesta rápida con puntuación por tiempo',
    component: EnhancedGames.TriviaLightning,
    cycleRecommended: ['Prekínder', '1° Básico', '2° Básico', '3° Básico', '4° Básico'],
    bloomLevel: ['Recordar', 'Comprender'],
    accessibility: true,
    maxPlayers: 30,
    estimatedDuration: 15,
    difficulty: 'beginner',
    category: 'basic',
    requirements: {
      minQuestions: 5,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 45,
      loading_priority: 'high',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-02',
    code: 'color_match',
    name: 'Color Match',
    description: 'Seleccionar color/figura que coincide con pregunta',
    component: EnhancedGames.ColorMatch,
    cycleRecommended: ['Prekínder', '1° Básico'],
    bloomLevel: ['Recordar'],
    accessibility: true,
    maxPlayers: 25,
    estimatedDuration: 10,
    difficulty: 'beginner',
    category: 'basic',
    requirements: {
      minQuestions: 3,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 30,
      loading_priority: 'high',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AAA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts', 'shape_alternatives']
    }
  },
  {
    id: 'G-03',
    code: 'memory-flip',
    name: 'Memory Flip',
    description: 'Parear cartas (pregunta↔respuesta) estilo memoria',
    component: EnhancedGames.MemoryFlip,
    cycleRecommended: ['1° Básico', '2° Básico', '3° Básico'],
    bloomLevel: ['Recordar', 'Comprender'],
    accessibility: true,
    maxPlayers: 20,
    estimatedDuration: 12,
    difficulty: 'beginner',
    category: 'puzzle',
    requirements: {
      minQuestions: 4,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 25,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-04',
    code: 'picture-bingo',
    name: 'Picture Bingo',
    description: 'Cartón 3×3 con imágenes; docente canta preguntas',
    component: EnhancedGames.PictureBingo,
    cycleRecommended: ['1° Básico', '2° Básico', '3° Básico', '4° Básico'],
    bloomLevel: ['Recordar'],
    accessibility: true,
    maxPlayers: 35,
    estimatedDuration: 20,
    difficulty: 'beginner',
    category: 'collaborative',
    requirements: {
      minQuestions: 9,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 50,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-05',
    code: 'drag-drop-sorting',
    name: 'Drag & Drop Sorting',
    description: 'Arrastrar fichas al contenedor correcto con categorías',
    component: EnhancedGames.DragDropSorting,
    cycleRecommended: ['2° Básico', '3° Básico', '4° Básico', '5° Básico'],
    bloomLevel: ['Comprender', 'Aplicar'],
    accessibility: true,
    maxPlayers: 20,
    estimatedDuration: 15,
    difficulty: 'intermediate',
    category: 'puzzle',
    requirements: {
      minQuestions: 6,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 35,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-06',
    code: 'number-line-race',
    name: 'Número-Línea Race',
    description: 'Resolver operación y avanzar pez en línea numérica',
    component: EnhancedGames.NumberLineRace,
    cycleRecommended: ['2° Básico', '3° Básico', '4° Básico', '5° Básico'],
    bloomLevel: ['Aplicar'],
    accessibility: true,
    maxPlayers: 25,
    estimatedDuration: 18,
    difficulty: 'intermediate',
    category: 'competitive',
    requirements: {
      minQuestions: 8,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 30,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-07',
    code: 'word-builder',
    name: 'Word Builder',
    description: 'Arrastrar letras para formar palabra con sonidos fonéticos',
    component: EnhancedGames.WordBuilder,
    cycleRecommended: ['1° Básico', '2° Básico', '3° Básico'],
    bloomLevel: ['Recordar', 'Comprender'],
    accessibility: true,
    maxPlayers: 20,
    estimatedDuration: 15,
    difficulty: 'beginner',
    category: 'puzzle',
    requirements: {
      minQuestions: 5,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 25,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-08',
    code: 'word-search',
    name: 'Sopa de Letras',
    description: 'Encontrar palabras en grilla de letras con zoom',
    component: EnhancedGames.WordSearch,
    cycleRecommended: ['2° Básico', '3° Básico', '4° Básico', '5° Básico'],
    bloomLevel: ['Recordar', 'Comprender'],
    accessibility: true,
    maxPlayers: 25,
    estimatedDuration: 20,
    difficulty: 'intermediate',
    category: 'puzzle',
    requirements: {
      minQuestions: 10,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 40,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-09',
    code: 'hangman-visual',
    name: 'Hangman Visual',
    description: 'Adivinar palabra con vidas usando imágenes no violentas',
    component: EnhancedGames.HangmanVisual,
    cycleRecommended: ['2° Básico', '3° Básico', '4° Básico', '5° Básico', '6° Básico'],
    bloomLevel: ['Recordar', 'Comprender'],
    accessibility: true,
    maxPlayers: 15,
    estimatedDuration: 12,
    difficulty: 'intermediate',
    category: 'puzzle',
    requirements: {
      minQuestions: 5,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 20,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  
  // G-10 to G-16 - Advanced Puzzle Games
  {
    id: 'G-10',
    code: 'escape-room-mini',
    name: 'Escape Room Mini',
    description: 'Secuencia de puzzles con presión de tiempo y pistas progresivas',
    component: EnhancedGames.EscapeRoomMini,
    cycleRecommended: ['4° Básico', '5° Básico', '6° Básico', '7° Básico', '8° Básico'],
    bloomLevel: ['Aplicar', 'Analizar'],
    accessibility: true,
    maxPlayers: 10,
    estimatedDuration: 25,
    difficulty: 'advanced',
    category: 'puzzle',
    requirements: {
      minQuestions: 3,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 50,
      loading_priority: 'high',
      memory_usage: 'medium'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-11',
    code: 'story-path',
    name: 'Story Path',
    description: 'Narrativa ramificada con decisiones y consecuencias',
    component: EnhancedGames.StoryPath,
    cycleRecommended: ['3° Básico', '4° Básico', '5° Básico', '6° Básico'],
    bloomLevel: ['Comprender', 'Analizar'],
    accessibility: true,
    maxPlayers: 20,
    estimatedDuration: 30,
    difficulty: 'intermediate',
    category: 'collaborative',
    requirements: {
      minQuestions: 5,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 40,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-12',
    code: 'board-race',
    name: 'Board Race',
    description: 'Carrera en tablero con preguntas y dado virtual',
    component: EnhancedGames.BoardRace,
    cycleRecommended: ['2° Básico', '3° Básico', '4° Básico', '5° Básico'],
    bloomLevel: ['Recordar', 'Comprender', 'Aplicar'],
    accessibility: true,
    maxPlayers: 30,
    estimatedDuration: 20,
    difficulty: 'intermediate',
    category: 'competitive',
    requirements: {
      minQuestions: 10,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 40,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-13',
    code: 'crossword',
    name: 'Crossword',
    description: 'Crucigrama colaborativo en tiempo real con pistas audio',
    component: EnhancedGames.Crossword,
    cycleRecommended: ['4° Básico', '5° Básico', '6° Básico', '7° Básico'],
    bloomLevel: ['Recordar', 'Comprender'],
    accessibility: true,
    maxPlayers: 15,
    estimatedDuration: 25,
    difficulty: 'advanced',
    category: 'collaborative',
    requirements: {
      minQuestions: 8,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: false
    },
    performance: {
      bundle_size_kb: 30,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-14',
    code: 'word-search-duel',
    name: 'Word Search Duel',
    description: 'Sopa de letras competitiva por equipos en tiempo real',
    component: EnhancedGames.WordSearchDuel,
    cycleRecommended: ['3° Básico', '4° Básico', '5° Básico', '6° Básico'],
    bloomLevel: ['Recordar', 'Comprender'],
    accessibility: true,
    maxPlayers: 20,
    estimatedDuration: 15,
    difficulty: 'intermediate',
    category: 'competitive',
    requirements: {
      minQuestions: 12,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 35,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-15',
    code: 'timed-equation-duel',
    name: 'Timed Equation Duel',
    description: 'Duelo matemático con ecuaciones y cronómetro',
    component: EnhancedGames.TimedEquationDuel,
    cycleRecommended: ['4° Básico', '5° Básico', '6° Básico', '7° Básico', '8° Básico'],
    bloomLevel: ['Aplicar', 'Analizar'],
    accessibility: true,
    maxPlayers: 25,
    estimatedDuration: 18,
    difficulty: 'advanced',
    category: 'competitive',
    requirements: {
      minQuestions: 15,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 40,
      loading_priority: 'high',
      memory_usage: 'medium'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-16',
    code: 'mystery-box-reveal',
    name: 'Mystery Box Reveal',
    description: 'Adivinar contenido con pistas progresivas y animaciones',
    component: EnhancedGames.MysteryBoxReveal,
    cycleRecommended: ['2° Básico', '3° Básico', '4° Básico', '5° Básico'],
    bloomLevel: ['Comprender', 'Analizar'],
    accessibility: true,
    maxPlayers: 20,
    estimatedDuration: 15,
    difficulty: 'intermediate',
    category: 'puzzle',
    requirements: {
      minQuestions: 5,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 25,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },

  // G-17 to G-24 - Advanced Critical Thinking Games
  {
    id: 'G-17',
    code: 'debate-cards',
    name: 'Debate Cards',
    description: 'Argumentación con cartas de posiciones y evidencias',
    component: EnhancedGames.DebateCards,
    cycleRecommended: ['6° Básico', '7° Básico', '8° Básico', '1° Medio'],
    bloomLevel: ['Analizar', 'Evaluar', 'Crear'],
    accessibility: true,
    maxPlayers: 15,
    estimatedDuration: 35,
    difficulty: 'advanced',
    category: 'critical-thinking',
    requirements: {
      minQuestions: 6,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 50,
      loading_priority: 'high',
      memory_usage: 'medium'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-18',
    code: 'case-study-sprint',
    name: 'Case Study Sprint',
    description: 'Análisis rápido de casos con decisiones cronometradas',
    component: EnhancedGames.CaseStudySprint,
    cycleRecommended: ['7° Básico', '8° Básico', '1° Medio', '2° Medio'],
    bloomLevel: ['Analizar', 'Evaluar'],
    accessibility: true,
    maxPlayers: 12,
    estimatedDuration: 40,
    difficulty: 'advanced',
    category: 'critical-thinking',
    requirements: {
      minQuestions: 5,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 40,
      loading_priority: 'high',
      memory_usage: 'medium'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-19',
    code: 'simulation-tycoon',
    name: 'Simulation Tycoon',
    description: 'Simulación de gestión con decisiones y KPIs',
    component: EnhancedGames.SimulationTycoon,
    cycleRecommended: ['8° Básico', '1° Medio', '2° Medio', '3° Medio'],
    bloomLevel: ['Aplicar', 'Analizar', 'Evaluar'],
    accessibility: true,
    maxPlayers: 8,
    estimatedDuration: 45,
    difficulty: 'advanced',
    category: 'critical-thinking',
    requirements: {
      minQuestions: 10,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 60,
      loading_priority: 'high',
      memory_usage: 'high'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-20',
    code: 'coding-puzzle',
    name: 'Coding Puzzle',
    description: 'Programación visual con bloques arrastrables',
    component: EnhancedGames.CodingPuzzle,
    cycleRecommended: ['5° Básico', '6° Básico', '7° Básico', '8° Básico'],
    bloomLevel: ['Aplicar', 'Analizar', 'Crear'],
    accessibility: true,
    maxPlayers: 15,
    estimatedDuration: 30,
    difficulty: 'advanced',
    category: 'puzzle',
    requirements: {
      minQuestions: 5,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 50,
      loading_priority: 'high',
      memory_usage: 'medium'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-21',
    code: 'data-lab',
    name: 'Data Lab',
    description: 'Análisis de datos con gráficos interactivos y filtros',
    component: EnhancedGames.DataLab,
    cycleRecommended: ['7° Básico', '8° Básico', '1° Medio', '2° Medio'],
    bloomLevel: ['Analizar', 'Evaluar'],
    accessibility: true,
    maxPlayers: 10,
    estimatedDuration: 35,
    difficulty: 'advanced',
    category: 'critical-thinking',
    requirements: {
      minQuestions: 8,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 40,
      loading_priority: 'high',
      memory_usage: 'medium'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-22',
    code: 'timeline-builder',
    name: 'Timeline Builder',
    description: 'Construcción colaborativa de líneas de tiempo históricas',
    component: EnhancedGames.TimelineBuilder,
    cycleRecommended: ['4° Básico', '5° Básico', '6° Básico', '7° Básico'],
    bloomLevel: ['Comprender', 'Analizar', 'Crear'],
    accessibility: true,
    maxPlayers: 20,
    estimatedDuration: 25,
    difficulty: 'intermediate',
    category: 'collaborative',
    requirements: {
      minQuestions: 8,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 30,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-23',
    code: 'argument-map',
    name: 'Argument Map',
    description: 'Mapeo visual de argumentos y evidencias conectadas',
    component: EnhancedGames.ArgumentMap,
    cycleRecommended: ['6° Básico', '7° Básico', '8° Básico', '1° Medio'],
    bloomLevel: ['Analizar', 'Evaluar', 'Crear'],
    accessibility: true,
    maxPlayers: 12,
    estimatedDuration: 40,
    difficulty: 'advanced',
    category: 'critical-thinking',
    requirements: {
      minQuestions: 6,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 35,
      loading_priority: 'medium',
      memory_usage: 'low'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  },
  {
    id: 'G-24',
    code: 'advanced-escape-room',
    name: 'Advanced Escape Room',
    description: 'Escape room complejo con múltiples salas y puzzles avanzados',
    component: EnhancedGames.AdvancedEscapeRoom,
    cycleRecommended: ['8° Básico', '1° Medio', '2° Medio', '3° Medio'],
    bloomLevel: ['Aplicar', 'Analizar', 'Evaluar', 'Crear'],
    accessibility: true,
    maxPlayers: 6,
    estimatedDuration: 60,
    difficulty: 'advanced',
    category: 'critical-thinking',
    requirements: {
      minQuestions: 5,
      supportsTTS: true,
      supportsKeyboard: true,
      supportsTouch: true
    },
    performance: {
      bundle_size_kb: 70,
      loading_priority: 'high',
      memory_usage: 'high'
    },
    wcag_compliance: {
      level: 'AA',
      features: ['keyboard_navigation', 'screen_reader', 'high_contrast', 'tts']
    }
  }
]

// Performance monitoring and analytics
export class GamePerformanceMonitor {
  private static instance: GamePerformanceMonitor
  private metrics: Map<string, any> = new Map()

  static getInstance(): GamePerformanceMonitor {
    if (!this.instance) {
      this.instance = new GamePerformanceMonitor()
    }
    return this.instance
  }

  startGameLoad(gameFormat: string) {
    const startTime = performance.now()
    this.metrics.set(`${gameFormat}_load_start`, startTime)
  }

  endGameLoad(gameFormat: string) {
    const endTime = performance.now()
    const startTime = this.metrics.get(`${gameFormat}_load_start`)
    if (startTime) {
      const loadTime = endTime - startTime
      this.metrics.set(`${gameFormat}_load_time`, loadTime)
      console.log(`Game ${gameFormat} loaded in ${loadTime.toFixed(2)}ms`)
    }
  }

  recordGameMetric(gameFormat: string, metricName: string, value: any) {
    this.metrics.set(`${gameFormat}_${metricName}`, value)
  }

  getMetrics(gameFormat?: string) {
    if (gameFormat) {
      const gameMetrics: { [key: string]: any } = {}
      this.metrics.forEach((value, key) => {
        if (key.startsWith(gameFormat)) {
          gameMetrics[key] = value
        }
      })
      return gameMetrics
    }
    const allMetrics: { [key: string]: any } = {}
    this.metrics.forEach((value, key) => {
      allMetrics[key] = value
    })
    return allMetrics
  }
}

// Game Renderer Component with performance monitoring
export const GameRenderer: React.FC<{
  gameFormat: string
  sessionId?: string
  [key: string]: any
}> = ({ gameFormat, sessionId, ...props }) => {
  const [isLoading, setIsLoading] = useState(true)
  const monitor = GamePerformanceMonitor.getInstance()

  useEffect(() => {
    monitor.startGameLoad(gameFormat)
    const timer = setTimeout(() => {
      setIsLoading(false)
      monitor.endGameLoad(gameFormat)
    }, 100)

    return () => clearTimeout(timer)
  }, [gameFormat])

  const gameConfig = GAME_FORMATS.find(g => g.code === gameFormat)
  
  if (!gameConfig) {
    throw new Error(`Game format "${gameFormat}" not found`)
  }

  const GameComponent = gameConfig.component

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GameComponent
        {...props}
        sessionId={sessionId}
        gameFormat={gameFormat}
        performance={gameConfig.performance}
        wcag={gameConfig.wcag_compliance}
      />
    </motion.div>
  )
}

// Utility functions for game management
export const getGamesByCategory = (category: string) => {
  return GAME_FORMATS.filter(game => game.category === category)
}

export const getGamesByDifficulty = (difficulty: string) => {
  return GAME_FORMATS.filter(game => game.difficulty === difficulty)
}

export const getGamesByCycle = (cycle: string) => {
  return GAME_FORMATS.filter(game => game.cycleRecommended.includes(cycle))
}

export const getRecommendedGame = (cycle: string, subject?: string): GameFormat | null => {
  const cycleGames = getGamesByCycle(cycle)
  if (cycleGames.length === 0) return null
  
  // Return first suitable game for the cycle
  return cycleGames[0]
}

export const validateGameRequirements = (gameFormat: string, questionCount: number): boolean => {
  const game = GAME_FORMATS.find(g => g.code === gameFormat)
  if (!game) return false
  
  return questionCount >= game.requirements.minQuestions
}

export const isGameAccessible = (gameFormat: string): boolean => {
  const game = GAME_FORMATS.find(g => g.code === gameFormat)
  return game?.accessibility === true
}

// Export all games and utilities
export default {
  GAME_FORMATS,
  EnhancedGames,
  GameRenderer,
  GamePerformanceMonitor,
  getGamesByCategory,
  getGamesByDifficulty,
  getGamesByCycle,
  getRecommendedGame,
  validateGameRequirements,
  isGameAccessible
} 