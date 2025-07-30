'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ClockIcon, 
  TrophyIcon,
  FireIcon,
  HeartIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Import all game components (using named imports)
import { TriviaLightning } from '@/components/game/TriviaLightning'
import { ColorMatch } from '@/components/game/ColorMatch'
import { MemoryFlip } from '@/components/game/MemoryFlip'
import { PictureBingo } from '@/components/game/PictureBingo'
import { DragDropSorting } from '@/components/game/DragDropSorting'
import { NumberLineRace } from '@/components/game/NumberLineRace'
import { FarmCountingGame } from '@/components/game/FarmCountingGame'
import FarmCountingGameOA1 from '@/components/game/FarmCountingGameOA1'
import FarmCountingGameOA1V2 from '@/components/game/FarmCountingGameOA1V2'
import FarmCountingGameOA1Evaluar from '@/components/game/FarmCountingGameOA1Evaluar'
import FarmCountingGameOA1Crear from '@/components/game/FarmCountingGameOA1Crear'
import { WordBuilder } from '@/components/game/WordBuilder'
import { WordSearch } from '@/components/game/WordSearch'
import { HangmanVisual } from '@/components/game/HangmanVisual'
import { EscapeRoomMini } from '@/components/game/EscapeRoomMini'
import { StoryPath } from '@/components/game/StoryPath'
import { BoardRace } from '@/components/game/BoardRace'
import { Crossword } from '@/components/game/Crossword'
import { WordSearchDuel } from '@/components/game/WordSearchDuel'
import { TimedEquationDuel } from '@/components/game/TimedEquationDuel'
import { MysteryBoxReveal } from '@/components/game/MysteryBoxReveal'
import { DebateCards } from '@/components/game/DebateCards'
import { CaseStudySprint } from '@/components/game/CaseStudySprint'
import { SimulationTycoon } from '@/components/game/SimulationTycoon'
import { CodingPuzzle } from '@/components/game/CodingPuzzle'
import { DataLab } from '@/components/game/DataLab'
import { TimelineBuilder } from '@/components/game/TimelineBuilder'
import { ArgumentMap } from '@/components/game/ArgumentMap'
import { AdvancedEscapeRoom } from '@/components/game/AdvancedEscapeRoom'

// All game components are now imported from /components/game/

export default function StudentGamePlayPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [gameSession, setGameSession] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<any[]>([])
  const [answerHistory, setAnswerHistory] = useState<any[]>([])

  const gameId = params.id

  const OA1_GAME_IDS = [
    'oa1-mat-recordar',
    'oa1-mat-comprender',
    'oa1-mat-aplicar',
    'oa1-mat-analyze',
    'oa1-mat-evaluar',
    'oa1-mat-crear'
  ];

  const isOA1Game = OA1_GAME_IDS.includes(gameId);

  // Fetch game session and questions
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        console.log(`🎮 Fetching game data for ${gameId}...`)
        const response = await fetch(`http://localhost:5000/api/game/${gameId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token-student'}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const session = data.session
          
          console.log(`🎮 Game status: ${session.status}`, session)
          setGameSession(session)
          
          // Extract questions from the quiz
          if (session.quizzes?.questions) {
            setQuestions(session.quizzes.questions)
            setTimeLeft(session.settings_json?.time_limit || 30)
          }
          
          if (session.status === 'active') {
          toast.success(`¡Juego iniciado: ${session.title}!`)
          }
        } else {
          toast.error('No se pudo cargar el juego')
          router.push('/student/games')
        }
      } catch (error) {
        console.error('Error fetching game data:', error)
        toast.error('Error al cargar el juego')
        router.push('/student/games')
      } finally {
        setLoading(false)
      }
    }

    fetchGameData()
  }, [gameId, router])

  // Auto-refresh when game is waiting
  useEffect(() => {
    if (gameSession?.status === 'waiting') {
      console.log(`🔄 Game "${gameSession.title}" (${gameSession.format}) is waiting, setting up auto-refresh...`)
      console.log(`🔄 Game ID: ${gameId}`)
      console.log(`🔄 Join Code: ${gameSession.join_code}`)
      
      const interval = setInterval(async () => {
        try {
          console.log(`🔄 Auto-refresh check for ${gameId}...`)
          const response = await fetch(`http://localhost:5000/api/game/${gameId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token-student'}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            console.log(`🔄 Auto-refresh result:`)
            console.log(`   Current status: ${gameSession.status}`)
            console.log(`   New status: ${data.session.status}`)
            console.log(`   Title: ${data.session.title}`)
            console.log(`   Format: ${data.session.format}`)
            
            const currentStatus = gameSession.status
            const newStatus = data.session.status
            
            if (newStatus !== currentStatus) {
              console.log(`🚀 STATUS CHANGED! ${currentStatus} → ${newStatus}`)
              console.log('🔄 Updating game session state...')
              
              // Force state update with new session data
              setGameSession((prevState: any) => ({
                ...prevState,
                ...data.session
              }))
              
              // Also update questions if they exist
              if (data.session.quizzes?.questions) {
                console.log(`📝 Updating questions: ${data.session.quizzes.questions.length} found`)
                setQuestions(data.session.quizzes.questions)
              }
              
              if (newStatus === 'active') {
                console.log('✅ Game is now ACTIVE! Player can start playing!')
                toast.success('¡El juego ha comenzado! 🎮')
              }
            } else {
              console.log(`🔄 No status change detected, still ${currentStatus}...`)
            }
          } else {
            console.error(`🔄 Auto-refresh failed: ${response.status}`)
          }
        } catch (error) {
          console.error('🔄 Auto-refresh error:', error)
        }
              }, 1500) // Check every 1.5 seconds for faster response

      return () => {
        console.log('🔄 Cleaning up auto-refresh interval')
        clearInterval(interval)
      }
    } else {
      console.log(`🔄 Game status is "${gameSession?.status}", no auto-refresh needed`)
    }
  }, [gameSession?.status, gameId])

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      // Auto advance to next question
      handleNextQuestion()
    }
  }, [timeLeft, questions.length])

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(gameSession?.settings_json?.time_limit || 30)
    } else {
      // Game finished
      router.push(`/student/games/${gameId}/results?score=${score}`)
    }
  }

  const handleAnswer = (optionIndex: number) => {
    const currentQ = questions[currentQuestion]
    const isCorrect = currentQ.correct_answer === currentQ.options_json[optionIndex]
    
    // Store answer history
    setAnswerHistory(prev => [...prev, {
      question: currentQ.stem_md,
      userAnswer: currentQ.options_json[optionIndex],
      correctAnswer: currentQ.correct_answer,
      isCorrect: isCorrect,
      skill: currentQ.skill || 'general'
    }]);

    if (isCorrect) {
      const points = Math.max(50, 100 - (30 - timeLeft) * 2) // More points for faster answers
      setScore(score + points)
      toast.success(`¡Correcto! +${points} puntos`)
    } else {
      toast.error('Respuesta incorrecta')
    }
    
    setTimeout(() => {
      handleNextQuestion()
    }, 1500)
  }

  if (loading || !gameSession || questions.length === 0) {
    if (isOA1Game) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Cargando juego OA1...</h2>
            <p className="text-gray-600">Preparando la experiencia de juego</p>
          </div>
        </div>
      );
    } else {
      return (
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">Cargando juego...</h2>
              <p className="text-gray-600">Preparando la experiencia de juego</p>
            </div>
          </div>
        </DashboardLayout>
      );
    }
  }

  const handleManualRefresh = async () => {
    try {
      console.log('🔄 Manual refresh requested...')
      const response = await fetch(`http://localhost:5000/api/game/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo_token'}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`🔄 Manual refresh result: ${data.session.status}`)
        setGameSession(data.session)
        
        if (data.session.quizzes?.questions) {
          setQuestions(data.session.quizzes.questions)
        }
        
        if (data.session.status === 'active') {
          toast.success('¡El juego ha comenzado! 🎮')
        } else {
          toast('Estado del juego actualizado', { icon: '🔄' })
        }
      }
    } catch (error) {
      console.error('Manual refresh error:', error)
      toast.error('Error al actualizar el estado del juego')
    }
  }

  // Check if game is waiting to start
  if (gameSession.status === 'waiting') {
    if (isOA1Game) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
          <div className="text-center max-w-md">
            {/* Waiting Animation */}
            <div className="relative mb-6">
              <div className="animate-pulse bg-blue-100 rounded-full h-20 w-20 mx-auto flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m0-18l4 4m-4-4L8 7" />
                </svg>
              </div>
            </div>
            
            {/* Status */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ⏳ Esperando inicio del juego OA1
            </h2>
            <p className="text-gray-600 mb-4">
              El juego OA1 está listo para comenzar.
            </p>
            
            {/* Game Info */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">{gameSession.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Engine:</strong> {gameSession.engine_id || gameSession.format}</p>
                <p><strong>Preguntas:</strong> {questions.length}</p>
                {gameSession.join_code && (
                  <p><strong>Código:</strong> <span className="font-mono font-bold text-blue-600">{gameSession.join_code}</span></p>
                )}
              </div>
            </div>
            
            {/* Manual Refresh Button */}
            <div className="mb-4">
              <Button
                onClick={handleManualRefresh}
                variant="outline"
                className="w-full"
              >
                🔄 Verificar estado del juego
              </Button>
            </div>
            
            {/* Auto-refresh */}
            <div className="text-sm text-gray-500">
              <p>Esta página se actualizará automáticamente cuando el juego comience</p>
              <p className="mt-1">O puedes usar el botón de arriba para verificar manualmente</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center max-w-md">
              {/* Waiting Animation */}
              <div className="relative mb-6">
                <div className="animate-pulse bg-blue-100 rounded-full h-20 w-20 mx-auto flex items-center justify-center">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m0-18l4 4m-4-4L8 7" />
                  </svg>
                </div>
              </div>
              
              {/* Status */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ⏳ Esperando inicio del juego
              </h2>
              <p className="text-gray-600 mb-4">
                El profesor necesita iniciar el juego antes de que puedas participar
              </p>
              
              {/* Game Info */}
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">{gameSession.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Engine:</strong> {gameSession.engine_id || gameSession.format}</p>
                  <p><strong>Preguntas:</strong> {questions.length}</p>
                  {gameSession.join_code && (
                    <p><strong>Código:</strong> <span className="font-mono font-bold text-blue-600">{gameSession.join_code}</span></p>
                  )}
                </div>
              </div>
              
              {/* Manual Refresh Button */}
              <div className="mb-4">
                <Button
                  onClick={handleManualRefresh}
                  variant="outline"
                  className="w-full"
                >
                  🔄 Verificar estado del juego
                </Button>
              </div>
              
              {/* Auto-refresh */}
              <div className="text-sm text-gray-500">
                <p>Esta página se actualizará automáticamente cuando el juego comience</p>
                <p className="mt-1">O puedes usar el botón de arriba para verificar manualmente</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      );
    }
  }

  const handleGameEnd = (finalScore?: number, history?: any[]) => {
    const results = {
      score: finalScore ?? score,
      history: history ?? answerHistory,
      gameTitle: gameSession?.title || 'Juego Completado',
      gameId: gameId,
    };
    sessionStorage.setItem('lastGameResults', JSON.stringify(results));
    router.push(`/student/games/${gameId}/results`);
  }

  const renderGameComponent = () => {
    console.log(`🎮 Rendering game component for format: ${gameSession.format}`)
    
    // Common props for components that extend GameComponentProps
    const baseGameProps = {
      quiz: gameSession.quizzes || gameSession,
      session: gameSession,
      user: user!,
      currentQuestion: questions[currentQuestion],
      timeRemaining: timeLeft,
      onAnswer: handleAnswer,
      onGameEnd: () => handleGameEnd(),
      isPreview: false
    }

    // Common callback functions for custom components
    const commonCallbacks = {
      onComplete: (result: any) => {
        console.log('Game completed:', result)
        handleGameEnd(result.score || result.winner?.score || score, result.history);
      },
      onExit: () => handleGameEnd(),
      enableAudio: gameSession.settings_json?.tts_enabled || true
    }

    // 🚨 NEW: Use engine_id first, then fallback to format
    const gameType = gameSession.engine_id || gameSession.format;
    console.log(`🎮 Rendering game for type: ${gameType} (engine_id: ${gameSession.engine_id}, format: ${gameSession.format})`);
    
    switch (gameType) {
      // === EDUCATIONAL ENGINES (PRIMARY) ===
      case 'ENG01':
        console.log('🔢 Rendering ENG01 - Counter/Number Line (PURE)')
        
        // 🐛 DEBUG: Mostrar datos completos de la sesión
        console.log('🐛 DEBUG - Datos de gameSession:', {
          title: gameSession.title,
          settings_json: gameSession.settings_json,
          farm_theme: gameSession.settings_json?.farm_theme,
          grade_level: gameSession.settings_json?.grade_level,
          specialized_component: gameSession.settings_json?.specialized_component,
          theme: gameSession.settings_json?.theme
        });
        
        // Check for specialized OA1 component
        const isOA1Specialized = gameSession.settings_json?.specialized_component === 'FarmCountingGameOA1' ||
                                gameSession.settings_json?.theme === 'granja_oa1' ||
                                gameSession.title?.includes('OA1');
        
        // Check for specialized OA1 V2 component
        const isOA1V2Specialized = gameSession.settings_json?.specialized_component === 'FarmCountingGameOA1V2' ||
                                  gameSession.settings_json?.theme === 'granja_oa1_v2' ||
                                  gameSession.title?.includes('OA1 V2') ||
                                  gameSession.settings_json?.version === '2.0';
        
        // Check if this is a farm-themed game for 1° básico (legacy)
        const titleContainsGranja = gameSession.title?.toLowerCase().includes('granja');
        const titleContainsFarm = gameSession.title?.toLowerCase().includes('farm');
        const farmThemeTrue = gameSession.settings_json?.farm_theme === true;
        const grade1B = gameSession.settings_json?.grade_level === '1B';
        
        console.log('🐛 DEBUG - Criterios de detección:', {
          isOA1Specialized,
          isOA1V2Specialized,
          titleContainsGranja,
          titleContainsFarm, 
          farmThemeTrue,
          grade1B
        });
        
        // 🚨 FIX: Prioritize specific game IDs before general theme checks
        if (gameId === 'oa1-mat-evaluar') {
          console.log('⚖️ Using FarmCountingGameOA1Evaluar - Specialized Component for MAT.1B.OA.01 (Evaluar)')
          return <FarmCountingGameOA1Evaluar 
            gameSession={gameSession} 
            onGameEnd={handleGameEnd} 
            difficultyLevel={gameSession.settings_json?.difficultyLevel || 'avanzado'}
          />
        } else if (gameId === 'oa1-mat-crear') {
          console.log('💡 Using FarmCountingGameOA1Crear - Specialized Component for MAT.1B.OA.01 (Crear)')
          return <FarmCountingGameOA1Crear gameSession={gameSession} onGameEnd={handleGameEnd} />
        } else if (['oa1-mat-recordar', 'oa1-mat-comprender', 'oa1-mat-aplicar', 'oa1-mat-analyze'].includes(gameId)) {
          console.log('🌾 Using FarmCountingGameOA1 - Specialized Component for MAT.1B.OA.01')
          
          // Adapter function to match the expected signature
          const handleOA1Answer = (questionId: string, answer: any, timeSpent: number) => {
            console.log(`🎯 OA1 Answer: questionId=${questionId}, answer=${answer}, timeSpent=${timeSpent}ms`);
            // This function is now mostly for logging, as the component handles its own state.
          };
          
          return <FarmCountingGameOA1 
            gameSession={gameSession}
            onAnswer={handleOA1Answer}
            onGameComplete={(finalScore, history) => handleGameEnd(finalScore, history)}
            difficultyLevel={gameSession.settings_json?.difficultyLevel || 'basico'}
          />
        } else if (isOA1V2Specialized) {
          console.log('🌟 Using FarmCountingGameOA1V2 - Specialized Component V2 for MAT.1B.OA.01')
          
          // Adapter function to match the expected signature
          const handleOA1V2Answer = (questionId: string, answer: any, isCorrect: boolean) => {
            console.log(`🎯 OA1 V2 Answer: questionId=${questionId}, answer=${answer}, isCorrect=${isCorrect}`);
            
            // For OA1 V2, the component handles its own scoring internally
            // We just need to track the answer for analytics
          };
          
          // Game end handler for V2
          const handleGameEnd = (finalScore: number, results: any) => {
            console.log(`🎯 OA1 V2 Game End: score=${finalScore}`, results);
            setScore(finalScore);
            router.push(`/student/games/${gameId}/results?score=${finalScore}`);
          };
          
          // Simple TTS function
          const speakText = (text: string) => {
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'es-ES';
              speechSynthesis.speak(utterance);
            }
          };
          
          // Create quiz object from gameSession
          const currentQuiz = {
            quiz_id: gameSession.quiz_id,
            title: gameSession.title,
            description: gameSession.description,
            questions: questions,
            version: gameSession.settings_json?.version,
            bloom_scaler: gameSession.settings_json?.bloom_scaler,
            adaptive_tutor: gameSession.settings_json?.adaptive_tutor,
            sticker_collection: gameSession.settings_json?.sticker_collection,
            cooperative_mode: gameSession.settings_json?.cooperative_mode,
            voice_recognition: gameSession.settings_json?.voice_recognition,
            pdf_guide: gameSession.settings_json?.pdf_guide,
            arasaac_pictograms: gameSession.settings_json?.arasaac_pictograms,
            state_machine: gameSession.settings_json?.state_machine
          };
          
          return <FarmCountingGameOA1V2 
            quiz={currentQuiz}
            onQuestionAnswer={handleOA1V2Answer}
            onGameEnd={handleGameEnd}
            onTTSSpeak={speakText}
          />
        } else if (isOA1Specialized) {
          console.log('🌾 Using FarmCountingGameOA1 - Specialized Component for MAT.1B.OA.01')
          
          // Adapter function to match the expected signature
          const handleOA1Answer = (questionId: string, answer: any, timeSpent: number) => {
            console.log(`🎯 OA1 Answer: questionId=${questionId}, answer=${answer}, timeSpent=${timeSpent}ms`);
            
            // For OA1, answer is typically a number, so we can pass it directly
            const points = Math.max(50, 200 - Math.floor(timeSpent / 100)); // More points for faster answers
            setScore(score + points);
            
            // Move to next question or level in the specialized component
            // The component handles its own progression
          };
          
          return <FarmCountingGameOA1 
            gameSession={gameSession}
            onAnswer={handleOA1Answer}
            onGameComplete={handleGameEnd}
            difficultyLevel={gameSession.settings_json?.difficultyLevel || 'basico'}
          />
        } else {
          const isFarmTheme = titleContainsGranja || titleContainsFarm || farmThemeTrue || grade1B;
          console.log(`🐛 DEBUG - isFarmTheme: ${isFarmTheme}`);
          
          if (isFarmTheme) {
            console.log('🐄 Using Farm Counting Game for ENG01 + Farm Theme')
            return <FarmCountingGame {...baseGameProps} />
          } else {
            console.log('🔢 Using Generic Number Line Race for ENG01')
            return <NumberLineRace {...baseGameProps} />
          }
        }
      
      case 'ENG02':
        console.log('🔢 Rendering ENG02 - Drag-Drop Numbers')
        return <DragDropSorting {...baseGameProps} />
      
      case 'ENG05':
        console.log('📝 Rendering ENG05 - Text Recognition')
        return <WordBuilder {...baseGameProps} />
      
      case 'ENG06':
        console.log('🔤 Rendering ENG06 - Letter-Sound Matching')
        return <WordSearch {...baseGameProps} />
      
      case 'ENG07':
        console.log('📖 Rendering ENG07 - Reading Fluency')
        return <WordBuilder {...baseGameProps} />
      
      case 'ENG09':
        console.log('🔬 Rendering ENG09 - Life Cycle Simulation')
        return <PictureBingo {...baseGameProps} />
      
      // === FALLBACK TO LEGACY FORMATS ===
      case 'trivia_lightning':
        console.log('⚠️ LEGACY: Rendering TriviaLightning')
        return <TriviaLightning {...baseGameProps} />
      
      case 'color_match':
        console.log('🎨 Rendering ColorMatch')
        return <ColorMatch {...baseGameProps} />
      
      case 'memory_flip':
        console.log('🧠 Rendering MemoryFlip')
        return <MemoryFlip {...baseGameProps} />
      
      case 'picture_bingo':
        console.log('🏁 Rendering PictureBingo')
        return <PictureBingo {...baseGameProps} />
      
      case 'drag_drop_sorting':
        console.log('🎯 Rendering DragDropSorting')
        return <DragDropSorting {...baseGameProps} />
      
      case 'number_line_race':
        console.log('🔢 Rendering NumberLineRace')
        return <NumberLineRace {...baseGameProps} />
      
      case 'word_builder':
        console.log('📝 Rendering WordBuilder')
        return <WordBuilder {...baseGameProps} />
      
      case 'word_search':
        console.log('🔍 Rendering WordSearch')
        return <WordSearch {...baseGameProps} />
      
      case 'hangman_visual':
        console.log('🎭 Rendering HangmanVisual')
        return <HangmanVisual {...baseGameProps} />

      // === ADVANCED GAMES (G-10 to G-16) ===
      case 'escape_room_mini':
        console.log('🏠 Rendering EscapeRoomMini')
        return <EscapeRoomMini {...baseGameProps} />
      
      case 'story_path':
        console.log('📖 Rendering StoryPath')
        const storyPathProps = {
          story: {
            title: gameSession.title || 'Historia Interactiva',
            description: gameSession.description || 'Una aventura de decisiones',
            startNodeId: 'start',
            nodes: [
              {
                id: 'start',
                title: 'Inicio de la Historia',
                content: questions[0]?.stem_md || 'Comienza tu aventura...',
                choices: questions[0]?.options_json?.map((option: string, index: number) => ({
                  id: `choice_${index}`,
                  text: option,
                  nextNodeId: index === questions[0]?.options_json.indexOf(questions[0]?.correct_answer) ? 'success' : 'continue',
                  points: index === questions[0]?.options_json.indexOf(questions[0]?.correct_answer) ? 20 : 5
                })) || [
                  { id: 'choice_1', text: 'Continuar', nextNodeId: 'success', points: 10 }
                ],
                isEnding: false,
                points: 0
              },
              {
                id: 'success',
                title: '¡Excelente decisión!',
                content: '¡Has tomado una gran decisión! Tu aventura continúa...',
                choices: [],
                isEnding: true,
                points: 50
              },
              {
                id: 'continue',
                title: 'Continúa tu aventura',
                content: 'Tu decisión te lleva por un camino interesante...',
                choices: [],
                isEnding: true,
                points: 25
              }
            ]
          },
          ...commonCallbacks
        }
        return <StoryPath {...storyPathProps} />
      
      case 'board_race':
        console.log('🎲 Rendering BoardRace')
        const boardRaceProps = {
          questions: questions.map(q => ({
            id: q.question_id || `q_${Math.random()}`,
            question: q.stem_md,
            options: q.options_json || [],
            correctAnswer: q.options_json?.indexOf(q.correct_answer) || 0,
            explanation: q.explanation,
            audio_url: q.tts_url
          })),
          players: [
            {
              id: user!.user_id,
              name: user!.first_name || 'Estudiante',
              avatar: user!.profile_picture_url || '👤',
              position: 0,
              score: 0,
              color: '#3B82F6',
              isActive: true
            }
          ],
          boardSize: 30,
          ...commonCallbacks
        }
        return <BoardRace {...boardRaceProps} />
      
      case 'crossword':
        console.log('🔤 Rendering Crossword')
        const crosswordProps = {
          clues: questions.map((q, index) => ({
            id: `clue_${index}`,
            number: index + 1,
            direction: (index % 2 === 0 ? 'across' : 'down') as 'across' | 'down',
            clue: q.stem_md,
            answer: q.correct_answer || q.correct || q.options_json?.[0] || 'RESPUESTA',
            startRow: Math.floor(index / 3) + 1,
            startCol: (index % 3) + 1,
            audio_url: q.tts_url
          })),
          gridSize: 15,
          ...commonCallbacks
        }
        return <Crossword {...crosswordProps} />
      
      case 'word_search_duel':
        console.log('⚔️ Rendering WordSearchDuel')
        const wordSearchDuelProps = {
          words: questions.map(q => q.correct_answer || q.stem_md.split(' ')[0] || 'PALABRA').slice(0, 10),
          gridSize: 15,
          playerCount: 2,
          teams: [
            { 
              id: 'team1', 
              name: 'Tu Equipo', 
              members: [user!.first_name || 'Estudiante'], 
              score: 0, 
              color: '#3B82F6',
              foundWords: []
            },
            { 
              id: 'team2', 
              name: 'Oponente', 
              members: ['Bot'], 
              score: 0, 
              color: '#EF4444',
              foundWords: []
            }
          ],
          ...commonCallbacks
        }
        return <WordSearchDuel {...wordSearchDuelProps} />
      
      case 'timed_equation_duel':
        console.log('🔢⚡ Rendering TimedEquationDuel')
        
        // Ensure we have equations for all difficulty levels
        const equationsWithDifficulty = questions.map((q, index) => {
          let difficulty: 'easy' | 'medium' | 'hard'
          
          // Use the difficulty from the question if available
          if (q.difficulty && ['easy', 'medium', 'hard'].includes(q.difficulty)) {
            difficulty = q.difficulty as 'easy' | 'medium' | 'hard'
          } else {
            // Distribute difficulties evenly if not specified
            const difficultyOptions: ('easy' | 'medium' | 'hard')[] = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard']
            difficulty = difficultyOptions[index % difficultyOptions.length]
          }
          
          return {
            id: `eq_${index}`,
            problem: q.stem_md,
            answer: parseFloat(q.correct_answer || q.correct || '0') || (index + 1),
            difficulty,
            timeLimit: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 45,
            audio_url: q.tts_url
          }
        })
        
        const timedEquationProps = {
          equations: equationsWithDifficulty,
          players: [
            {
              id: user!.user_id,
              name: user!.first_name || 'Estudiante',
              score: 0,
              streak: 0,
              totalCorrect: 0,
              totalAttempts: 0,
              averageTime: 0
            },
            {
              id: 'bot',
              name: 'Oponente IA',
              score: 0,
              streak: 0,
              totalCorrect: 0,
              totalAttempts: 0,
              averageTime: 0
            }
          ],
          ...commonCallbacks
        }
        return <TimedEquationDuel {...timedEquationProps} />
      
      case 'mystery_box_reveal':
        console.log('📦❓ Rendering MysteryBoxReveal')
        const mysteryBoxProps = {
          items: questions.map((q, index) => ({
            id: q.question_id || `item_${index}`,
            name: q.correct_answer || `Objeto ${index + 1}`,
            description: q.explanation || 'Objeto misterioso para descubrir',
            image_url: q.asset_url || '/placeholder-mystery.jpg',
            category: 'Educación',
            hints: q.options_json || ['Pista 1', 'Pista 2'],
            stages: [
              {
                id: `stage_${index}_1`,
                clue: q.stem_md,
                revealPercentage: 25,
                pointCost: 50,
                audio_url: q.tts_url
              },
              {
                id: `stage_${index}_2`,
                clue: q.explanation || 'Más revelación',
                revealPercentage: 50,
                pointCost: 100
              },
              {
                id: `stage_${index}_3`,
                clue: 'Revelación final',
                revealPercentage: 75,
                pointCost: 150
              }
            ]
          })),
          initialPoints: 1000,
          ...commonCallbacks
        }
        return <MysteryBoxReveal {...mysteryBoxProps} />

      // === CRITICAL THINKING GAMES (G-17 to G-24) ===
      case 'debate_cards':
        console.log('💬 Rendering DebateCards')
        const debateCardsProps = {
          topic: {
            title: gameSession.title || 'Debate Educativo',
            description: gameSession.description || 'Expresa tu opinión con argumentos sólidos',
            context: 'Utiliza las cartas de evidencia para defender tu posición',
            cards: questions.map((q, index) => ({
              id: `card_${index}`,
              position: (index % 2 === 0 ? 'favor' : 'contra') as 'favor' | 'contra',
              argument: q.stem_md,
              evidence: q.explanation || 'Evidencia del argumento',
              strength: Math.floor(Math.random() * 5) + 1,
              points: (Math.floor(Math.random() * 3) + 1) * 10,
              audio_url: q.tts_url
            }))
          },
          players: [
            {
              id: user!.user_id,
              name: user!.first_name || 'Estudiante',
              team: 'A' as const,
              score: 0,
              cardsPlayed: [],
              isActive: true
            },
            {
              id: 'opponent',
              name: 'Oponente',
              team: 'B' as const,
              score: 0,
              cardsPlayed: [],
              isActive: false
            }
          ],
          rounds: 6,
          timePerTurn: 120,
          ...commonCallbacks
        }
        return <DebateCards {...debateCardsProps} />
      
      case 'case_study_sprint':
        console.log('📊 Rendering CaseStudySprint')
        const caseStudyProps = {
          caseStudy: {
            title: gameSession.title || 'Caso de Estudio',
            description: 'Analiza el siguiente caso y responde las preguntas',
            context: 'Contexto del caso de estudio para análisis educativo',
            content: questions.map(q => q.stem_md).join('\n\n') || 'Contenido del caso de estudio',
            questions: questions.map((q, index) => ({
              id: q.question_id || `q_${index}`,
              question: q.stem_md,
              options: q.options_json || ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
              correctAnswer: q.options_json?.indexOf(q.correct_answer) || 0,
              explanation: q.explanation || 'Explicación de la respuesta',
              timeLimit: 45,
              bloomLevel: ('Analizar' as 'Comprender' | 'Aplicar' | 'Analizar' | 'Evaluar'),
              points: 20,
              audio_url: q.tts_url
            })),
            totalTime: questions.length * 45 + 300 // Questions time + 5 min reading
          },
          ...commonCallbacks
        }
        return <CaseStudySprint {...caseStudyProps} />
      
      case 'simulation_tycoon':
        console.log('💰 Rendering SimulationTycoon')
        const simulationProps = {
          scenario: {
            title: gameSession.title || 'Simulador Empresarial',
            description: 'Toma decisiones estratégicas para hacer crecer tu empresa',
            initialState: {
              revenue: 1000,
              costs: 800,
              satisfaction: 75,
              reputation: 60,
              efficiency: 50,
              cash: 10000
            },
            events: questions.map((q, index) => ({
              id: `event_${index}`,
              title: q.stem_md,
              description: q.explanation || 'Evento empresarial',
              choices: q.options_json?.map((opt: string, i: number) => ({
                id: `choice_${i}`,
                text: opt,
                cost: Math.floor(Math.random() * 1000),
                impact: {
                  revenue: Math.floor(Math.random() * 400) - 200,
                  costs: Math.floor(Math.random() * 300) - 150,
                  satisfaction: Math.floor(Math.random() * 21) - 10,
                  reputation: Math.floor(Math.random() * 21) - 10,
                  efficiency: Math.floor(Math.random() * 21) - 10
                },
                consequences: `Resultado de elegir: ${opt}`
              })) || [
                {
                  id: 'default_choice',
                  text: 'Continuar',
                  cost: 0,
                  impact: { revenue: 50 },
                  consequences: 'Decisión estándar'
                }
              ],
              impact: {
                revenue: 0,
                costs: 0
              }
            })),
            objectives: {
              target: 'profit',
              value: 5000,
              turns: 12
            }
          },
          maxTurns: 12,
          ...commonCallbacks
        }
        return <SimulationTycoon {...simulationProps} />
      
      case 'coding_puzzle':
        console.log('💻 Rendering CodingPuzzle')
        const codingProps = {
          puzzle: {
            id: 'puzzle_1',
            title: questions[0]?.stem_md || 'Puzzle de Programación',
            description: questions[0]?.explanation || 'Completa el código para resolver el problema',
            instructions: 'Arrastra los bloques de código para crear la solución',
            expectedOutput: [questions[0]?.correct_answer || 'Hola Mundo'],
            availableBlocks: [
              {
                id: 'print_block',
                type: 'action' as const,
                content: 'print("Hola Mundo")',
                color: 'bg-blue-500',
                category: 'basic'
              },
              {
                id: 'var_block',
                type: 'variable' as const,
                content: 'mensaje = "Hola"',
                color: 'bg-green-500',
                category: 'basic'
              },
              {
                id: 'loop_block',
                type: 'loop' as const,
                content: 'for i in range(3):',
                color: 'bg-purple-500',
                category: 'control'
              }
            ],
            testCases: [
              { 
                input: [''], 
                expectedOutput: [questions[0]?.correct_answer || 'Hola Mundo'] 
              }
            ],
            maxBlocks: 5,
            difficulty: 'beginner' as const,
            bloomLevel: 'Aplicar' as const,
            points: 100
          },
          ...commonCallbacks
        }
        return <CodingPuzzle {...codingProps} />
      
      case 'data_lab':
        console.log('📈 Rendering DataLab')
        const dataLabProps = {
          dataset: {
            name: gameSession.title || 'Dataset Educativo',
            description: 'Analiza los datos y responde las preguntas',
            context: 'Dataset para análisis estadístico educativo',
            columns: [
              { id: 'estudiante', name: 'Estudiante', type: 'string' as const, values: Array.from({ length: 20 }, (_, i) => `Estudiante ${i + 1}`) },
              { id: 'edad', name: 'Edad', type: 'number' as const, values: Array.from({ length: 20 }, () => Math.floor(Math.random() * 5) + 15) },
              { id: 'calificacion', name: 'Calificación', type: 'number' as const, values: Array.from({ length: 20 }, () => Math.floor(Math.random() * 4) + 4) },
              { id: 'materia', name: 'Materia', type: 'string' as const, values: Array.from({ length: 20 }, () => ['Matemáticas', 'Ciencias', 'Historia', 'Lenguaje'][Math.floor(Math.random() * 4)]) }
            ],
            data: Array.from({ length: 20 }, (_, i) => ({
              estudiante: `Estudiante ${i + 1}`,
              edad: Math.floor(Math.random() * 5) + 15,
              calificacion: Math.floor(Math.random() * 4) + 4,
              materia: ['Matemáticas', 'Ciencias', 'Historia', 'Lenguaje'][Math.floor(Math.random() * 4)]
            }))
          },
          questions: questions.map((q, index) => ({
            id: `question_${index}`,
            question: q.stem_md,
            type: 'chart-analysis' as const,
            options: q.options_json || ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
            correctAnswer: q.options_json?.indexOf(q.correct_answer) || 0,
            explanation: q.explanation || 'Análisis de datos estadísticos',
            points: 25,
            chartType: 'bar' as const
          })),
          ...commonCallbacks
        }
        return <DataLab {...dataLabProps} />
      
      case 'timeline_builder':
        console.log('📅 Rendering TimelineBuilder')
        const timelineProps = {
          challenge: {
            id: 'timeline_1',
            title: gameSession.title || 'Línea de Tiempo Histórica',
            description: 'Ordena los eventos en orden cronológico correcto',
            context: 'Eventos históricos importantes que debes ordenar',
            events: questions.map((q, index) => ({
              id: `event_${index}`,
              title: q.stem_md,
              description: q.explanation || 'Descripción del evento histórico',
              date: `${2000 + index}-01-01`,
              year: 2000 + index,
              category: 'Historia',
              importance: (['low', 'medium', 'high'][Math.floor(Math.random() * 3)]) as 'low' | 'medium' | 'high',
              audio_url: q.tts_url
            })),
            correctOrder: questions.map((_, index) => `event_${index}`),
            timeLimit: 600, // 10 minutes
            hints: [
              'Observa las fechas cuidadosamente',
              'Los eventos están relacionados cronológicamente',
              'Piensa en la secuencia lógica de los acontecimientos'
            ],
            difficulty: 'medium' as const,
            subject: 'Historia',
            bloomLevel: 'Analizar' as const,
            points: 200
          },
          ...commonCallbacks
        }
        return <TimelineBuilder {...timelineProps} />
      
      case 'argument_map':
        console.log('🗺️ Rendering ArgumentMap')
        const argumentMapProps = {
          challenge: {
            id: 'argument_1',
            title: gameSession.title || 'Mapa de Argumentos',
            description: 'Conecta los argumentos de manera lógica',
            context: 'Analiza los argumentos y sus relaciones',
            mainClaim: questions[0]?.stem_md || 'Argumento principal',
            nodes: questions.map((q, index) => ({
              id: `node_${index}`,
              type: index === 0 ? 'claim' : 'evidence' as 'claim' | 'evidence' | 'warrant' | 'counterargument' | 'rebuttal',
              content: q.stem_md,
              position: { x: 100 + (index % 3) * 150, y: 100 + Math.floor(index / 3) * 120 },
              category: 'general',
              strength: 'medium' as 'weak' | 'medium' | 'strong'
            })),
            correctConnections: [],
            timeLimit: gameSession.settings_json?.time_limit || 1800,
            hints: ['Identifica el argumento principal', 'Busca evidencias que soporten la afirmación'],
            difficulty: 'medium' as 'easy' | 'medium' | 'hard',
            subject: 'Pensamiento Crítico',
            bloomLevel: 'Evaluar' as 'Analizar' | 'Evaluar' | 'Crear',
            points: 100
          },
          ...commonCallbacks
        }
        return <ArgumentMap {...argumentMapProps} />
      
      case 'advanced_escape_room':
        console.log('🏰 Rendering AdvancedEscapeRoom')
        const escapeRoomProps = {
          playerId: user!.user_id,
          playerName: user!.first_name || 'Estudiante',
          timeLimit: gameSession.settings_json?.time_limit || 3600,
          ...commonCallbacks
        }
        return <AdvancedEscapeRoom {...escapeRoomProps} />
      
      default:
        console.warn(`❌ UNKNOWN GAME TYPE: "${gameType}" (engine_id: ${gameSession.engine_id}, format: ${gameSession.format}) - falling back to TriviaLightning`)
        return <TriviaLightning {...baseGameProps} />
    }
  }

  if (isOA1Game) {
    return (
      <div className="min-h-screen">
        {renderGameComponent()}
      </div>
    );
  } else {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* 🎮 ENGINE INFO HEADER */}
          {gameSession && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FireIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{gameSession.title}</h3>
                    <p className="text-sm text-gray-600">
                      Engine: <span className="font-medium">{gameSession.engine_id || gameSession.format}</span>
                    </p>
                    {gameSession.engine_id && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          🎮 {gameSession.engine_id}
                        </div>
                        <span className="text-xs text-gray-500">
                          {gameSession.engine_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    <span>Tiempo: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <TrophyIcon className="w-4 h-4" />
                    <span>Puntos: {score}</span>
                  </div>
                  {gameSession.engine_id && gameSession.settings_json?.engine_config && (
                    <div className="text-xs text-gray-500 mt-1">
                      Engine activo: Configuración optimizada
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {renderGameComponent()}
        </div>
      </DashboardLayout>
    );
  }
} 