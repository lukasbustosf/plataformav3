'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface FarmCountingGameOA1V2Props {
  quiz: any;
  onQuestionAnswer: (questionId: string, answer: any, isCorrect: boolean) => void;
  onGameEnd: (finalScore: number, results: any) => void;
  onTTSSpeak?: (text: string) => void;
}

interface QuestionDataV2 {
  question_id: string;
  question_order: number;
  stem_md: string;
  type: string;
  options_json: number[];
  correct_answer: string;
  explanation: string;
  points: number;
  difficulty: string;
  bloom_level: string;
  farm_context: any;
  v2_features?: any;
}

// 🌟 CONFIGURACIÓN ESPECÍFICA V2 - PREGUNTAS CORREGIDAS
const OA1_V2_QUESTIONS: QuestionDataV2[] = [
  // NIVEL 1: RECORDAR (1-5) - CORREGIDO
  {
    question_id: 'oa1-v2-recordar-1',
    question_order: 1,
    stem_md: '🐣 🐣 🐣 🐣 ¿Cuántos pollitos ves? (Cuenta en voz alta)',
    type: 'multiple_choice',
    options_json: [2, 3, 4, 5],
    correct_answer: '4',
    explanation: 'Hay 4 pollitos. ¡Pío, pío, pío, pío!',
    points: 100,
    difficulty: 'easy',
    bloom_level: 'Recordar',
    v2_features: {
      voice_enabled: true,
      arasaac_pictogram: 'contar',
      sticker_reward: '🐣',
      elo_adjustment: 15,
      cooperative_suitable: true
    },
    farm_context: { count: 4, animal: '🐣', skill: 'conteo_visual_basico' }
  },
  {
    question_id: 'oa1-v2-recordar-2',
    question_order: 2,
    stem_md: '🐤 🐤 ¿Cuántos pollitos amarillos hay?',
    type: 'multiple_choice',
    options_json: [1, 2, 3, 4],
    correct_answer: '2',
    explanation: 'Hay 2 pollitos amarillos. ¡Pío, pío!',
    points: 100,
    difficulty: 'easy',
    bloom_level: 'Recordar',
    v2_features: {
      voice_enabled: true,
      arasaac_pictogram: 'dos',
      sticker_reward: '🐤',
      elo_adjustment: 15,
      cooperative_suitable: true
    },
    farm_context: { count: 2, animal: '🐤', skill: 'conteo_visual_basico' }
  },
  // NIVEL 2: COMPRENDER (6-10) - MEJORADO CON EMOJIS
  {
    question_id: 'oa1-v2-comprender-1',
    question_order: 3,
    stem_md: '🐔 🐔 🐔 🐔 Si hay 4 gallinas y llega 1 más ➕🐔, ¿cuántas habrá en total?',
    type: 'multiple_choice',
    options_json: [4, 5, 6, 7],
    correct_answer: '5',
    explanation: 'Si hay 4 gallinas y llega 1 más, habrá 5 gallinas en total.',
    points: 150,
    difficulty: 'medium',
    bloom_level: 'Comprender',
    v2_features: {
      voice_enabled: true,
      arasaac_pictogram: 'mas',
      sticker_reward: '🐔',
      elo_adjustment: 15,
      cooperative_suitable: true
    },
    farm_context: { count: 5, animal: '🐔', skill: 'suma_basica' }
  },
  {
    question_id: 'oa1-v2-comprender-2',
    question_order: 4,
    stem_md: '🐔 🐔 🐔 Si cada gallina pone 2 huevos y hay 3 gallinas, ¿cuántos huevos hay? 🥚🥚 🥚🥚 🥚🥚',
    type: 'multiple_choice',
    options_json: [5, 6, 7, 8],
    correct_answer: '6',
    explanation: 'Si cada gallina pone 2 huevos y hay 3 gallinas, habrá 6 huevos.',
    points: 150,
    difficulty: 'medium',
    bloom_level: 'Comprender',
    v2_features: {
      voice_enabled: true,
      arasaac_pictogram: 'multiplicar',
      sticker_reward: '🥚',
      elo_adjustment: 15,
      cooperative_suitable: true
    },
    farm_context: { count: 6, animal: '🥚', skill: 'multiplicacion_basica' }
  },
  // NIVEL 3: APLICAR (11-15) - MEJORADO
  {
    question_id: 'oa1-v2-aplicar-1',
    question_order: 5,
    stem_md: '🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄 Si tienes 12 vacas y se van 3 ➖🐄🐄🐄, ¿cuántas quedan?',
    type: 'multiple_choice',
    options_json: [8, 9, 10, 11],
    correct_answer: '9',
    explanation: 'Si tienes 12 vacas y se van 3, quedan 9 vacas.',
    points: 200,
    difficulty: 'hard',
    bloom_level: 'Aplicar',
    v2_features: {
      voice_enabled: true,
      arasaac_pictogram: 'menos',
      sticker_reward: '🐄',
      elo_adjustment: 15,
      cooperative_suitable: true
    },
    farm_context: { count: 9, animal: '🐄', skill: 'resta_basica' }
  },
  {
    question_id: 'oa1-v2-aplicar-2',
    question_order: 6,
    stem_md: '🥕🥕🥕🥕🥕 🥕🥕🥕🥕🥕 🥕🥕🥕🥕🥕 Si agrupas de 5 en 5 y tienes 3 grupos, ¿cuántas zanahorias hay en total?',
    type: 'multiple_choice',
    options_json: [13, 14, 15, 16],
    correct_answer: '15',
    explanation: 'Si agrupas de 5 en 5 y tienes 3 grupos, hay 15 zanahorias.',
    points: 200,
    difficulty: 'hard',
    bloom_level: 'Aplicar',
    v2_features: {
      voice_enabled: true,
      arasaac_pictogram: 'grupo',
      sticker_reward: '🌾',
      elo_adjustment: 15,
      cooperative_suitable: true
    },
    farm_context: { count: 15, animal: '🌾', skill: 'agrupacion' }
  },
  // NIVEL 4: ANALIZAR (16-20) - MEJORADO
  {
    question_id: 'oa1-v2-analizar-1',
    question_order: 7,
    stem_md: '🚜 Observa el patrón: 2️⃣, 4️⃣, 6️⃣, 8️⃣, ¿qué número sigue? 🤔',
    type: 'multiple_choice',
    options_json: [9, 10, 11, 12],
    correct_answer: '10',
    explanation: 'El patrón es contar de 2 en 2, así que después del 8 viene el 10.',
    points: 250,
    difficulty: 'expert',
    bloom_level: 'Analizar',
    v2_features: {
      voice_enabled: true,
      arasaac_pictogram: 'patron',
      sticker_reward: '🚜',
      elo_adjustment: 15,
      cooperative_suitable: true
    },
    farm_context: { pattern: [2, 4, 6, 8], next: 10, skill: 'conteo_por_patrones' }
  },
  {
    question_id: 'oa1-v2-analizar-2',
    question_order: 8,
    stem_md: '🏠 El granjero cuenta hacia atrás: 2️⃣0️⃣ ➡️ 1️⃣8️⃣ ➡️ 1️⃣6️⃣ ➡️ ❓ ¿Qué número sigue?',
    type: 'multiple_choice',
    options_json: [13, 14, 15, 16],
    correct_answer: '14',
    explanation: 'Contando hacia atrás de 2 en 2, después del 16 viene el 14.',
    points: 250,
    difficulty: 'expert',
    bloom_level: 'Analizar',
    v2_features: {
      voice_enabled: true,
      arasaac_pictogram: 'atras',
      sticker_reward: '🏠',
      elo_adjustment: 15,
      cooperative_suitable: true
    },
    farm_context: { pattern: [20, 18, 16], next: 14, skill: 'conteo_regresivo' }
  }
];

// 🌟 ESCALADOR BLOOM V2
const BLOOM_LEVELS = [
  { name: 'Recordar', color: '#E3F2FD', icon: '🧠', active: false },
  { name: 'Comprender', color: '#E8F5E9', icon: '💡', active: false },
  { name: 'Aplicar', color: '#FFF3E0', icon: '🎯', active: false },
  { name: 'Analizar', color: '#F3E5F5', icon: '🔍', active: false }
];

export default function FarmCountingGameOA1V2({ quiz, onQuestionAnswer, onGameEnd, onTTSSpeak }: FarmCountingGameOA1V2Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{correct: boolean, explanation: string} | null>(null);
  
  // 🚀 ESTADOS V2
  const [bloomLevels, setBloomLevels] = useState(BLOOM_LEVELS);
  const [stickersCollected, setStickersCollected] = useState<string[]>([]);
  const [eloRating, setEloRating] = useState(1200);
  const [isCooperativeMode, setIsCooperativeMode] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('A');
  
  // 🎙️ ESTADOS TTS V2 MEJORADOS
  const [isReading, setIsReading] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  
  // 🎵 ESTADOS MÚSICA DE FONDO
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);

  const currentQ = OA1_V2_QUESTIONS[currentQuestion];

  // 🎯 ACTUALIZAR ESCALADOR BLOOM
  useEffect(() => {
    if (currentQ) {
      setBloomLevels(prev => prev.map(level => ({
        ...level,
        active: level.name === currentQ.bloom_level
      })));
    }
  }, [currentQuestion]);

  // 🎵 INICIALIZAR MÚSICA DE FONDO
  useEffect(() => {
    if (gameStarted && musicEnabled && !backgroundMusic) {
      // Crear audio sintético de granja con Web Audio API
      const createFarmAmbience = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Sonido suave de granja con frecuencias relajantes
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(musicVolume * 0.1, audioContext.currentTime + 0.5);
        
        // Crear patrón repetitivo suave
        const now = audioContext.currentTime;
        for (let i = 0; i < 10; i++) {
          const time = now + i * 2;
          oscillator.frequency.setValueAtTime(220 + Math.sin(i) * 50, time);
        }
        
        oscillator.start();
        
        // Crear sonidos ambientales adicionales
        setTimeout(() => {
          const birdOscillator = audioContext.createOscillator();
          const birdGain = audioContext.createGain();
          
          birdOscillator.connect(birdGain);
          birdGain.connect(audioContext.destination);
          
          birdOscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          birdOscillator.type = 'triangle';
          birdGain.gain.setValueAtTime(musicVolume * 0.05, audioContext.currentTime);
          
          birdOscillator.start();
          birdOscillator.stop(audioContext.currentTime + 0.5);
        }, 3000);
        
        return oscillator;
      };
      
      if (musicEnabled) {
        const farmAmbience = createFarmAmbience();
        console.log('🎵 Música de fondo de granja iniciada');
      }
    }
  }, [gameStarted, musicEnabled, musicVolume]);

  // 🎵 CONTROLAR MÚSICA
  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
    if (backgroundMusic) {
      if (musicEnabled) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play();
      }
    }
  };

  // 🔊 EFECTOS SONOROS SIMPLES
  const playSound = (frequency: number, duration: number, type: 'correct' | 'incorrect' | 'click') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
      // Sonido alegre para respuesta correcta
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // Do
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // Mi
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // Sol
      oscillator.type = 'triangle';
    } else if (type === 'incorrect') {
      // Sonido suave para respuesta incorrecta
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.1);
      oscillator.type = 'sine';
    } else {
      // Sonido de clic
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.type = 'square';
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  };

  // 🎙️ FUNCIÓN TTS MEJORADA - SOLO MANUAL
  const speakText = (text: string, options: any = {}) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    
    console.log('🔊 TTS V2: Iniciando lectura manual...', text);
    
    if (options.interrupt && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    setIsReading(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    utterance.lang = 'es-ES';
    
    utterance.onend = () => {
      console.log('🔊 TTS V2: Lectura completada');
      setIsReading(false);
    };
    
    utterance.onerror = (e) => {
      console.warn('🔊 TTS V2: Error en lectura', e);
      setIsReading(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  // 🔄 REPETIR PREGUNTA (MANUAL)
  const repeatQuestion = () => {
    console.log('🔊 Leyendo pregunta manualmente...');
    speakText(currentQ.stem_md, { interrupt: true });
    // NO leer opciones automáticamente
  };

  // 🛑 PARAR TTS MEJORADO
  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsReading(false);
    
    // Feedback visual mejorado
    const button = document.getElementById('stop-button');
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✅ Detenido';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    }
  };

  // 🎯 MANEJAR RESPUESTA CON MEJORAS V2
  const handleAnswer = (selectedAnswer: number) => {
    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = selectedAnswer.toString() === currentQ.correct_answer;
    
    // 🛑 Detener TTS al responder
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsReading(false);
    }
    
    // 🔊 EFECTOS SONOROS
    playSound(0, 0.3, isCorrect ? 'correct' : 'incorrect');
    
    // 🎯 FEEDBACK V2
    const feedback = {
      correct: isCorrect,
      explanation: isCorrect ? currentQ.explanation : `No es correcto. ${currentQ.explanation}`
    };

    setLastAnswer(feedback);
    setShowResult(true);

    // 🏆 PUNTUACIÓN Y RECOMPENSAS V2
    if (isCorrect) {
      setScore(score + currentQ.points);
      
      // 🎖️ STICKER REWARD
      if (currentQ.v2_features?.sticker_reward) {
        setStickersCollected(prev => [...prev, currentQ.v2_features.sticker_reward]);
      }
      
      // 📈 ELO RATING
      setEloRating(prev => prev + (currentQ.v2_features?.elo_adjustment || 10));
    }

    // 🤝 MODO COOPERATIVO
    if (isCooperativeMode) {
      setCurrentPlayer(currentPlayer === 'A' ? 'B' : 'A');
    }

    // Enviar respuesta al sistema
    onQuestionAnswer(currentQ.question_id, selectedAnswer, isCorrect);

    setTimeout(() => {
      setShowResult(false);
      setLastAnswer(null);
      
      if (currentQuestion < OA1_V2_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setQuestionStartTime(Date.now());
      } else {
        // Crear resultados finales
        const finalResults = {
          totalQuestions: OA1_V2_QUESTIONS.length,
          score: score + (isCorrect ? currentQ.points : 0),
          stickersCollected: stickersCollected,
          eloRating: eloRating
        };
        onGameEnd(finalResults.score, finalResults);
      }
    }, 2000);
  };

  // 🎨 RENDERIZAR EMOJIS DEL ENUNCIADO
  const renderQuestionEmojis = () => {
    const emojis = currentQ.stem_md.match(/🐣|🐤|🐔|🐓|🥚|🐄|🐮|🥛|🥕|🚜|🏠|2️⃣|4️⃣|6️⃣|8️⃣|0️⃣|1️⃣|➕|➖|➡️|❓|🤔/g) || [];
    // Aumentamos el límite de 8 a 15 para mostrar todos los elementos necesarios
    return emojis.slice(0, 15).map((emoji, i) => (
      <div 
        key={i} 
        className="text-4xl animate-bounce cursor-pointer hover:scale-110 transition-transform"
        style={{ animationDelay: `${i * 0.1}s` }}
      >
        {emoji}
      </div>
    ));
  };

  // 📝 RENDERIZAR ENUNCIADO CON MEJOR LEGIBILIDAD
  const renderQuestionText = () => {
    const text = currentQ.stem_md;
    
    // Separar el texto en partes más legibles
    const parts = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    parts.forEach((part, index) => {
      if (currentLine.length + part.length > 30) { // Máximo 30 caracteres por línea
        lines.push(currentLine.trim());
        currentLine = part + ' ';
      } else {
        currentLine += part + ' ';
      }
    });
    
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
    
    return lines.map((line, index) => (
      <div key={index} className="mb-2">
        {line}
      </div>
    ));
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 text-green-800">
              🌟 GRANJA CONTADOR OA1 V2 🌟
            </h1>
            
            <div className="mb-6">
              <h2 className="text-3xl font-semibold mb-2 text-green-700">
                ¡Versión Mejorada con Súper Funciones!
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800">🎯 Escalador Bloom</h3>
                  <p className="text-sm text-blue-700">4 niveles de dificultad</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800">🎖️ Stickers Coleccionables</h3>
                  <p className="text-sm text-purple-700">Gana animales únicos</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">📈 Tutor Adaptativo</h3>
                  <p className="text-sm text-yellow-700">Seguimiento ELO inteligente</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800">🎙️ Control de Voz</h3>
                  <p className="text-sm text-green-700">TTS mejorado y opcional</p>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-orange-800">📚 MAT.1B.OA.01:</h3>
                <p className="text-sm text-orange-700">
                  "Contar números del 0 al 20 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10"
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              {['🐣', '🐔', '🐄', '🚜', '🌟'].map((emoji, i) => (
                <div key={i} className="text-8xl animate-pulse">
                  {emoji}
                </div>
              ))}
            </div>

            {/* 🤝 CONFIGURACIÓN COOPERATIVA */}
            <div className="mb-6">
              <label className="flex items-center justify-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isCooperativeMode}
                  onChange={(e) => setIsCooperativeMode(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-lg">🤝 Modo Cooperativo (2 Jugadores)</span>
              </label>
            </div>

            <Button 
              onClick={() => {
                setGameStarted(true);
                setQuestionStartTime(Date.now());
              }}
              className="bg-green-600 hover:bg-green-700 text-white text-xl px-8 py-4 rounded-full"
            >
              🚀 ¡Empezar Aventura V2!
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 🏆 HEADER V2 CON ESCALADOR BLOOM */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-green-800">
              🌟 OA1 V2: Granja Contador Avanzado
            </h1>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-700">Puntos: {score}</div>
              <div className="text-sm text-gray-600">📈 ELO: {eloRating}</div>
              <div className="text-sm text-gray-600">
                Pregunta {currentQuestion + 1} de {OA1_V2_QUESTIONS.length}
              </div>
              {isCooperativeMode && (
                <div className="text-lg font-bold text-purple-700">
                  🤝 Jugador {currentPlayer}
                </div>
              )}
            </div>
          </div>
          
          {/* 🎯 ESCALADOR BLOOM V2 */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">🎯 Escalador Bloom:</h3>
            <div className="flex space-x-2">
              {bloomLevels.map((level, i) => (
                <div 
                  key={i}
                  className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                    level.active ? 'bg-gradient-to-r from-yellow-400 to-green-500 animate-pulse shadow-lg' : 'bg-gray-200'
                  }`}
                  style={{ backgroundColor: level.active ? undefined : level.color }}
                >
                  <div className="text-xs text-center pt-1">{level.icon}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              {bloomLevels.map((level, i) => (
                <span key={i} className={level.active ? 'font-bold text-green-700' : ''}>
                  {level.name}
                </span>
              ))}
            </div>
          </div>
          
          {/* 🎖️ STICKERS COLECCIONADOS */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">🎖️ Stickers Coleccionados:</h3>
            <div className="flex space-x-2">
              {stickersCollected.map((sticker, i) => (
                <div key={i} className="text-2xl animate-bounce">{sticker}</div>
              ))}
              {stickersCollected.length === 0 && (
                <span className="text-gray-500 text-sm">¡Responde correctamente para ganar stickers!</span>
              )}
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion) / OA1_V2_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 🎙️ CONTROLES TTS V2 MEJORADOS + 🎵 MÚSICA */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-center space-x-4 mb-4">
            <Button
              onClick={repeatQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              disabled={isReading}
            >
              🔄 Repetir
            </Button>
            <Button
              id="stop-button"
              onClick={stopSpeaking}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              🛑 Parar
            </Button>
            <select 
              value={voiceSpeed} 
              onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
              className="px-3 py-2 border rounded-lg"
            >
              <option value={0.7}>🐢 Lento</option>
              <option value={1.0}>🚶 Normal</option>
              <option value={1.3}>🏃 Rápido</option>
            </select>
          </div>
          
          {/* 🎵 CONTROLES DE MÚSICA */}
          <div className="flex justify-center space-x-4 pt-4 border-t">
            <Button
              onClick={toggleMusic}
              className={`px-4 py-2 rounded-lg text-white ${
                musicEnabled 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              {musicEnabled ? '🎵 Música ON' : '🔇 Música OFF'}
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm">{Math.round(musicVolume * 100)}%</span>
            </div>
          </div>
        </div>

        {/* 📝 PREGUNTA ACTUAL V2 - MEJORADA LEGIBILIDAD */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* 📖 ENUNCIADO CON MEJOR LEGIBILIDAD */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
            <h2 className="text-3xl font-bold text-center leading-relaxed text-blue-900 mb-4">
              📖 Pregunta {currentQuestion + 1} de {OA1_V2_QUESTIONS.length}
            </h2>
            <div className="text-2xl font-semibold text-center leading-relaxed text-blue-800 bg-white rounded-lg p-4 shadow-inner">
              {renderQuestionText()}
            </div>
          </div>

          {/* 🎨 EMOJIS VISUALES - MEJORADOS CON MÁS ESPACIO */}
          <div className="bg-green-50 rounded-lg p-8 mb-6 border-2 border-green-200">
            <h3 className="text-lg font-semibold text-center text-green-800 mb-6">
              👀 Ayuda Visual
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto min-h-[120px] items-center">
              {renderQuestionEmojis()}
            </div>
          </div>

          {/* ✨ INDICADOR BLOOM ACTUAL - MEJORADO */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-6 border-2 border-yellow-200">
            <h3 className="text-lg font-semibold text-center text-yellow-800 mb-3">
              🎯 Nivel de Dificultad
            </h3>
            <div className="text-center">
              <span className="inline-block text-xl font-bold text-yellow-900 bg-yellow-200 px-4 py-2 rounded-full border-2 border-yellow-400">
                {currentQ.bloom_level}
              </span>
            </div>
            <div className="text-center mt-2 text-sm text-yellow-700">
              {currentQ.bloom_level === 'Recordar' && '🧠 Memoria y reconocimiento'}
              {currentQ.bloom_level === 'Comprender' && '💡 Comprensión y explicación'}
              {currentQ.bloom_level === 'Aplicar' && '🎯 Aplicación práctica'}
              {currentQ.bloom_level === 'Analizar' && '🔍 Análisis y patrones'}
            </div>
          </div>

          {/* 🎮 OPCIONES DE RESPUESTA V2 - MEJORADAS */}
          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
            <h3 className="text-lg font-semibold text-center text-purple-800 mb-4">
              🎯 Elige tu respuesta
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {currentQ.options_json.map((option: number) => (
                <Button
                  key={option}
                  onClick={() => {
                    playSound(0, 0.1, 'click');
                    handleAnswer(option);
                  }}
                  className="h-36 text-6xl font-bold bg-gradient-to-br from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-800 border-4 border-yellow-600 rounded-xl transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                  disabled={showResult}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-2">{option}</div>
                    <div className="text-sm font-normal">Respuesta {String.fromCharCode(65 + currentQ.options_json.indexOf(option))}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 🎉 FEEDBACK V2 */}
        {showResult && lastAnswer && (
          <div className={`text-center p-6 rounded-xl shadow-lg ${
            lastAnswer.correct ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'
          } border-4`}>
            <div className="text-6xl mb-4">
              {lastAnswer.correct ? '🎉' : '💪'}
            </div>
            <div className={`text-xl font-bold ${
              lastAnswer.correct ? 'text-green-800' : 'text-red-800'
            }`}>
              {lastAnswer.explanation}
            </div>
            {lastAnswer.correct && currentQ.v2_features?.sticker_reward && (
              <div className="text-4xl mt-4 animate-bounce">
                ¡Ganaste: {currentQ.v2_features.sticker_reward}!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 