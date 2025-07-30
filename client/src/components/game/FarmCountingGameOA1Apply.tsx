'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// --- Interfaces and Data ---
interface FarmCountingGameOA1ApplyProps {
  onGameEnd: (finalScore: number, results: any) => void;
}

interface QuestionData {
  question_id: string;
  stem_md: string;
  options_json: number[];
  correct_answer: string;
  explanation: string;
  points: number;
  visual_emojis: string;
}

const OA1_APPLY_QUESTIONS: QuestionData[] = [
    {
        question_id: 'oa1-app-1',
        stem_md: 'Tienes 5 🥕 y le das 2 a un 🐰. ¿Cuántas 🥕 te quedan?',
        visual_emojis: '🥕🥕🥕🥕🥕 🐰🐰',
        options_json: [2, 3, 4, 5],
        correct_answer: '3',
        explanation: '¡Exacto! Si tenías 5 y diste 2, te quedan 3 zanahorias.',
        points: 200,
    },
    {
        question_id: 'oa1-app-2',
        stem_md: 'Hay 4 🐥 en un corral y llegan 3 más. ¿Cuántos hay en total?',
        visual_emojis: '🐥🐥🐥🐥 + 🐥🐥🐥',
        options_json: [5, 6, 7, 8],
        correct_answer: '7',
        explanation: '¡Muy bien! 4 pollitos más 3 pollitos son 7 pollitos en total.',
        points: 200,
    },
    {
        question_id: 'oa1-app-3',
        stem_md: 'Necesitas 10 🍎 para un pastel. Ya tienes 7. ¿Cuántas te faltan?',
        visual_emojis: '🍎🍎🍎🍎🍎🍎🍎',
        options_json: [2, 3, 4, 10],
        correct_answer: '3',
        explanation: '¡Correcto! Para llegar a 10 desde 7, te faltan 3 manzanas.',
        points: 250,
    },
    {
        question_id: 'oa1-app-4',
        stem_md: 'Un 🌳 tiene 8 🍐. Si se caen 5, ¿cuántas quedan en el árbol?',
        visual_emojis: '🌳🍐🍐🍐🍐🍐🍐🍐🍐',
        options_json: [2, 3, 4, 5],
        correct_answer: '3',
        explanation: '¡Genial! Si de 8 peras se caen 5, solo quedan 3 en el árbol.',
        points: 250,
    },
    {
        question_id: 'oa1-app-5',
        stem_md: 'Repartes 12 🍓 en 2 canastas iguales. ¿Cuántas fresas hay en cada una?',
        visual_emojis: '🍓🍓🍓🍓🍓🍓 🧺  🍓🍓🍓🍓🍓🍓 🧺',
        options_json: [5, 6, 7, 12],
        correct_answer: '6',
        explanation: '¡Perfecto! Si repartes 12 fresas en 2 canastas, cada una tendrá 6.',
        points: 280,
    },
    {
        question_id: 'oa1-app-6',
        stem_md: 'Cada 🐮 da 2 litros de 🥛. Si hay 3 vacas, ¿cuántos litros tienes?',
        visual_emojis: '🐮🥛🥛 🐮🥛🥛 🐮🥛🥛',
        options_json: [4, 5, 6, 7],
        correct_answer: '6',
        explanation: '¡Muy bien! 3 vacas por 2 litros cada una son 6 litros de leche.',
        points: 280,
    },
    {
        question_id: 'oa1-app-7',
        stem_md: 'Comienzas con 15 🥚. Si usas 5 para un queque, ¿cuántos te quedan?',
        visual_emojis: '🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚',
        options_json: [8, 9, 10, 11],
        correct_answer: '10',
        explanation: '¡Exacto! 15 huevos menos 5 son 10 huevos.',
        points: 250,
    },
    {
        question_id: 'oa1-app-8',
        stem_md: 'Un granjero recoge 8 🌽 y otro recoge 6 🌽. ¿Cuántos tienen en total?',
        visual_emojis: '🌽🌽🌽🌽🌽🌽🌽🌽 + 🌽🌽🌽🌽🌽🌽',
        options_json: [12, 13, 14, 15],
        correct_answer: '14',
        explanation: '¡Correcto! 8 más 6 es igual a 14 mazorcas.',
        points: 220,
    },
    {
        question_id: 'oa1-app-9',
        stem_md: 'Para plantar 1 🌻 necesitas 3 semillas. ¿Cuántas semillas usas para 4 girasoles?',
        visual_emojis: '🌻🌱🌱🌱 🌻🌱🌱🌱 🌻🌱🌱🌱 🌻🌱🌱🌱',
        options_json: [9, 10, 11, 12],
        correct_answer: '12',
        explanation: '¡Genial! 4 girasoles por 3 semillas cada uno son 12 semillas.',
        points: 300,
    },
    {
        question_id: 'oa1-app-10',
        stem_md: 'Hay 20 🐑. Si las pones en 4 corrales iguales, ¿cuántas ovejas hay por corral?',
        visual_emojis: '🐑🐑🐑🐑🐑 🐑🐑🐑🐑🐑 🐑🐑🐑🐑🐑 🐑🐑🐑🐑🐑',
        options_json: [4, 5, 6, 8],
        correct_answer: '5',
        explanation: '¡Perfecto! 20 ovejas divididas en 4 corrales son 5 ovejas en cada uno.',
        points: 300,
    }
];

// --- Component ---
export default function FarmCountingGameOA1Apply({ onGameEnd }: FarmCountingGameOA1ApplyProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [highContrast, setHighContrast] = useState(false);

  const currentQ = OA1_APPLY_QUESTIONS[currentQuestion];

  const speakText = (text: string, options: any = {}) => {
    if (!('speechSynthesis' in window)) return;
    if (options.interrupt && speechSynthesis.speaking) speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
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
    const feedback = { correct: isCorrect, explanation: currentQ.explanation };

    setLastAnswer(feedback);
    setShowResult(true);
    speakText(feedback.explanation);

    if (isCorrect) {
      setScore(prev => prev + currentQ.points);
    }

    setTimeout(() => {
      setShowResult(false);
      setLastAnswer(null);
      if (currentQuestion < OA1_APPLY_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const finalScore = score + (isCorrect ? currentQ.points : 0);
        onGameEnd(finalScore, {});
      }
    }, 4000);
  };

  const containerClass = highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-green-50 to-teal-100';
  const cardClass = highContrast ? 'bg-gray-800' : 'bg-white';
  const textClass = highContrast ? 'text-green-300' : 'text-green-800';
  const buttonClass = highContrast ? 'bg-green-500 text-black' : 'bg-green-600 hover:bg-green-700 text-white';

  if (!gameStarted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${containerClass}`}>
        <div className={`text-center ${cardClass} rounded-xl shadow-2xl p-8 max-w-2xl mx-auto relative`}>
            <div className="absolute top-4 right-4">
                <label className="flex items-center cursor-pointer">
                    <span className="mr-2 text-sm font-medium">Alto Contraste</span>
                    <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} className="toggle toggle-success" />
                </label>
            </div>
          <h1 className={`text-5xl font-bold mb-4 ${textClass}`}>Juego de Aplicación</h1>
          <p className="text-xl text-gray-500 mb-6">Usa lo que sabes para resolver problemas.</p>
          <div className="flex justify-center space-x-4 mb-8 text-6xl">
            <span>🥕</span><span>🐰</span><span>🍎</span><span>🌳</span><span>🧺</span>
          </div>
          <Button onClick={() => setGameStarted(true)} className={`${buttonClass} text-xl px-8 py-4 rounded-full`}>
            ¡Resolver Problemas!
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
            <h1 className={`text-2xl sm:text-3xl font-bold ${textClass}`}>Resolviendo Problemas</h1>
            <div className="text-right">
              <div className={`text-lg font-semibold ${textClass}`}>Puntos: {score}</div>
              <div className="text-sm text-gray-500">Pregunta {currentQuestion + 1} de {OA1_APPLY_QUESTIONS.length}</div>
            </div>
          </div>
        </div>

        <div className={`${cardClass} rounded-xl shadow-lg p-6 sm:p-8 mb-6`}>
          <div className="text-center mb-6">
            <p className="text-2xl sm:text-3xl font-semibold mb-4">{currentQ.stem_md}</p>
            <Button onClick={() => speakText(currentQ.stem_md)} variant="outline" size="sm">Repetir 🔊</Button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6 min-h-[100px] flex justify-center items-center text-4xl sm:text-5xl">
            {currentQ.visual_emojis}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentQ.options_json.map(option => (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`h-28 sm:h-32 text-4xl sm:text-5xl font-bold rounded-xl transform hover:scale-105 transition-shadow shadow-lg ${highContrast ? 'bg-green-500 text-black' : 'bg-gradient-to-br from-teal-400 to-green-500 text-white'}`}
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
