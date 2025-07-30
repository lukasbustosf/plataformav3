'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// --- Interfaces and Data ---
interface FarmCountingGameOA1RememberProps {
  onGameEnd: (finalScore: number, results: any) => void;
}

interface QuestionData {
  question_id: string;
  stem_md: string;
  options_json: number[];
  correct_answer: string;
  explanation: string;
  points: number;
  v2_features?: { sticker_reward: string };
  visual_emojis: string;
}

const OA1_REMEMBER_QUESTIONS: QuestionData[] = [
    {
        question_id: 'oa1-rem-1',
        stem_md: '¿Cuántas 🍎 ves en la pantalla?',
        visual_emojis: '🍎🍎🍎🍎🍎',
        options_json: [3, 4, 5, 6],
        correct_answer: '5',
        explanation: '¡Correcto! Hay 5 manzanas.',
        points: 100,
        v2_features: { sticker_reward: '🍎' },
    },
    {
        question_id: 'oa1-rem-2',
        stem_md: 'Sigue la secuencia: 12, 13, 14, ___?',
        visual_emojis: '🔢',
        options_json: [15, 16, 13, 12],
        correct_answer: '15',
        explanation: '¡Muy bien! Después del 14 viene el 15.',
        points: 100,
        v2_features: { sticker_reward: '⭐' },
    },
    {
        question_id: 'oa1-rem-3',
        stem_md: 'Contando de 2 en 2: 6, 8, 10, ___?',
        visual_emojis: '🐰🐰',
        options_json: [9, 11, 12, 14],
        correct_answer: '12',
        explanation: '¡Excelente! El patrón es sumar 2. Después del 10 viene el 12.',
        points: 120,
        v2_features: { sticker_reward: '🐰' },
    },
    {
        question_id: 'oa1-rem-4',
        stem_md: 'Contando hacia atrás: 9, 8, 7, ___?',
        visual_emojis: '🦉',
        options_json: [5, 6, 8, 10],
        correct_answer: '6',
        explanation: '¡Eso es! Contando hacia atrás, antes del 7 está el 6.',
        points: 150,
        v2_features: { sticker_reward: '🦉' },
    },
    {
        question_id: 'oa1-rem-5',
        stem_md: '¿Cuántos 🐮 ves en la pantalla?',
        visual_emojis: '🐮🐮🐮🐮🐮🐮🐮',
        options_json: [5, 6, 7, 8],
        correct_answer: '7',
        explanation: '¡Fantástico! Hay 7 vacas.',
        points: 100,
        v2_features: { sticker_reward: '🐮' },
    },
    {
        question_id: 'oa1-rem-6',
        stem_md: 'Hacia atrás de 2 en 2: 20, 18, 16, ___?',
        visual_emojis: '🐢🐢',
        options_json: [15, 14, 12, 17],
        correct_answer: '14',
        explanation: '¡Muy bien! Restando 2, después del 16 viene el 14.',
        points: 150,
        v2_features: { sticker_reward: '🐢' },
    },
    {
        question_id: 'oa1-rem-7',
        stem_md: 'Contando de 5 en 5: 15, 20, 25, ___?',
        visual_emojis: '🐸🐸🐸🐸🐸',
        options_json: [26, 30, 35, 28],
        correct_answer: '30',
        explanation: '¡Genial! Sumando 5, después del 25 sigue el 30.',
        points: 120,
        v2_features: { sticker_reward: '🐸' },
    },
    {
        question_id: 'oa1-rem-8',
        stem_md: '¿Cuántos 🥕 ves en la pantalla?',
        visual_emojis: '🥕🥕🥕🥕🥕🥕🥕🥕🥕',
        options_json: [7, 8, 9, 10],
        correct_answer: '9',
        explanation: '¡Correcto! Hay 9 zanahorias.',
        points: 100,
        v2_features: { sticker_reward: '🥕' },
    },
    {
        question_id: 'oa1-rem-9',
        stem_md: 'Hacia atrás de 10 en 10: 40, 30, 20, ___?',
        visual_emojis: '🚀',
        options_json: [10, 15, 0, 5],
        correct_answer: '10',
        explanation: '¡Fantástico! Restando 10, antes del 20 va el 10.',
        points: 150,
        v2_features: { sticker_reward: '🚀' },
    },
    {
        question_id: 'oa1-rem-10',
        stem_md: 'Sigue la secuencia: 18, 19, 20, ___?',
        visual_emojis: '💯',
        options_json: [21, 22, 19, 23],
        correct_answer: '21',
        explanation: '¡Perfecto! Después del 20 viene el 21.',
        points: 100,
        v2_features: { sticker_reward: '💯' },
    }
];

// --- Component ---
export default function FarmCountingGameOA1Remember({ onGameEnd }: FarmCountingGameOA1RememberProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [stickersCollected, setStickersCollected] = useState<string[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const currentQ = OA1_REMEMBER_QUESTIONS[currentQuestion];

  const speakText = (text: string, options: any = {}) => {
    if (!('speechSynthesis' in window)) return;
    if (options.interrupt && speechSynthesis.speaking) speechSynthesis.cancel();
    setIsReading(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (gameStarted && currentQ) {
      speakText(currentQ.stem_md, { interrupt: true });
    }
  }, [gameStarted, currentQuestion]);

  const handleAnswer = (selectedAnswer: number) => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    
    const isCorrect = selectedAnswer.toString() === currentQ.correct_answer;
    const feedback = {
      correct: isCorrect,
      explanation: isCorrect ? currentQ.explanation : `Casi. ${currentQ.explanation}`,
    };

    setLastAnswer(feedback);
    setShowResult(true);
    speakText(feedback.explanation);

    if (isCorrect) {
      setScore(prev => prev + currentQ.points);
      if (currentQ.v2_features?.sticker_reward) {
        setStickersCollected(prev => [...prev, currentQ.v2_features!.sticker_reward]);
      }
    }

    setTimeout(() => {
      setShowResult(false);
      setLastAnswer(null);
      if (currentQuestion < OA1_REMEMBER_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const finalScore = score + (isCorrect ? currentQ.points : 0);
        onGameEnd(finalScore, { stickers: stickersCollected });
      }
    }, 3500);
  };

  const containerClass = highContrast
    ? 'bg-black text-white'
    : 'bg-gradient-to-br from-blue-50 to-purple-100';
  const cardClass = highContrast ? 'bg-gray-800' : 'bg-white';
  const textClass = highContrast ? 'text-yellow-300' : 'text-blue-800';
  const buttonClass = highContrast
    ? 'bg-yellow-500 text-black'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  if (!gameStarted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${containerClass}`}>
        <div className={`text-center ${cardClass} rounded-xl shadow-2xl p-8 max-w-2xl mx-auto relative`}>
          <div className="absolute top-4 right-4">
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium">Alto Contraste</span>
              <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} className="toggle toggle-warning" />
            </label>
          </div>
          <h1 className={`text-5xl font-bold mb-4 ${textClass}`}>Juego de Contar: Recordar</h1>
          <p className="text-xl text-gray-500 mb-6">¡Vamos a practicar contar y reconocer números!</p>
          <div className="flex justify-center space-x-4 mb-8 text-6xl">
            <span>🍎</span><span>🐰</span><span>⭐</span><span>🐮</span><span>🏆</span>
          </div>
          <Button onClick={() => setGameStarted(true)} className={`${buttonClass} text-xl px-8 py-4 rounded-full`}>
            ¡Empezar a Jugar!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${containerClass}`}>
      <div className="container mx-auto max-w-4xl">
        <div className={`${cardClass} rounded-xl shadow-lg p-4 mb-6`}>
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl sm:text-3xl font-bold ${textClass}`}>Juego de Contar</h1>
            <div className="text-right">
              <div className={`text-lg font-semibold ${textClass}`}>Puntos: {score}</div>
              <div className="text-sm text-gray-500">Pregunta {currentQuestion + 1} de {OA1_REMEMBER_QUESTIONS.length}</div>
            </div>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
            <div className="bg-green-500 h-4 rounded-full" style={{ width: `${((currentQuestion + 1) / OA1_REMEMBER_QUESTIONS.length) * 100}%` }}></div>
          </div>
        </div>

        <div className={`${cardClass} rounded-xl shadow-lg p-6 sm:p-8 mb-6`}>
          <div className="text-center mb-6">
            <p className="text-2xl sm:text-3xl font-semibold mb-4">{currentQ.stem_md}</p>
            <Button onClick={() => speakText(currentQ.stem_md)} variant="outline" size="sm">
              Repetir 🔊
            </Button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6 min-h-[100px] flex justify-center items-center text-6xl">
            {currentQ.visual_emojis}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentQ.options_json.map(option => (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`h-28 sm:h-32 text-4xl sm:text-5xl font-bold rounded-xl transform hover:scale-105 transition-shadow shadow-lg ${highContrast ? 'bg-yellow-500 text-black' : 'bg-gradient-to-br from-yellow-400 to-orange-400 text-gray-800'}`}
                disabled={showResult}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {showResult && lastAnswer && (
          <div className={`text-center p-6 rounded-xl shadow-lg ${lastAnswer.correct ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="text-5xl mb-3">{lastAnswer.correct ? '🎉' : '💪'}</div>
            <div className={`text-xl font-bold ${lastAnswer.correct ? 'text-green-800' : 'text-red-800'}`}>
              {lastAnswer.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
