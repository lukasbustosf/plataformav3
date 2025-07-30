'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Interfaces (pueden ser externalizadas en un futuro)
interface QuestionData {
  question_id: string;
  stem_md: string;
  type: string;
  options_json: { value: string; label: string }[];
  correct_answer: string;
  explanation: string;
  points: number;
  bloom_level: string;
  visual_aid: { type: 'emoji-group' | 'number-line'; items: { emoji: string; count: number }[] | number[] };
}

// 🌟 NEW QUESTIONS - MA01OA01 - Nivel: Comprender
const OA1_COMPREHEND_QUESTIONS: QuestionData[] = [
  {
    question_id: 'oa1-comp-1',
    stem_md: '¿Qué grupo tiene MÁS animales?',
    type: 'multiple_choice',
    options_json: [{ value: 'A', label: 'Grupo A' }, { value: 'B', label: 'Grupo B' }],
    correct_answer: 'A',
    explanation: '¡Correcto! El Grupo A tiene 6 🐄, que es más que 4 🐔.',
    points: 150,
    bloom_level: 'Comprender',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🐄', count: 6 }, { emoji: '🐔', count: 4 }] }
  },
  {
    question_id: 'oa1-comp-2',
    stem_md: 'Si juntas 3 🍎 y 2 🍌, ¿cuántas frutas tienes en total?',
    type: 'multiple_choice',
    options_json: [{ value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' }],
    correct_answer: '5',
    explanation: '¡Muy bien! 3 manzanas más 2 bananas son 5 frutas.',
    points: 150,
    bloom_level: 'Comprender',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🍎', count: 3 }, { emoji: '🍌', count: 2 }] }
  },
  {
    question_id: 'oa1-comp-3',
    stem_md: 'Ordena estos números del MÁS PEQUEÑO al MÁS GRANDE: 15, 8, 12',
    type: 'multiple_choice',
    options_json: [
      { value: '8,12,15', label: '8, 12, 15' },
      { value: '15,12,8', label: '15, 12, 8' },
      { value: '12,8,15', label: '12, 8, 15' }
    ],
    correct_answer: '8,12,15',
    explanation: '¡Excelente! El orden correcto es 8, luego 12 y finalmente 15.',
    points: 200,
    bloom_level: 'Comprender',
    visual_aid: { type: 'number-line', items: [15, 8, 12] }
  },
  {
    question_id: 'oa1-comp-4',
    stem_md: '¿Qué número es MAYOR que 10 pero MENOR que 13?',
    type: 'multiple_choice',
    options_json: [{ value: '10', label: '10' }, { value: '11', label: '11' }, { value: '13', label: '13' }],
    correct_answer: '11',
    explanation: '¡Genial! El número 11 está entre el 10 y el 13.',
    points: 180,
    bloom_level: 'Comprender',
    visual_aid: { type: 'number-line', items: [10, 11, 12, 13] }
  },
  {
    question_id: 'oa1-comp-5',
    stem_md: 'Mira este grupo de 🐑. ¿Son más o menos de 10?',
    type: 'multiple_choice',
    options_json: [{ value: 'mas', label: 'Más de 10' }, { value: 'menos', label: 'Menos de 10' }],
    correct_answer: 'menos',
    explanation: '¡Perfecto! Hay 8 ovejas, que es menos de 10.',
    points: 150,
    bloom_level: 'Comprender',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🐑', count: 8 }] }
  },
  {
    question_id: 'oa1-comp-6',
    stem_md: '¿Cuántos grupos de 3 🍎 puedes formar con 9 manzanas?',
    type: 'multiple_choice',
    options_json: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }],
    correct_answer: '3',
    explanation: '¡Correcto! Con 9 manzanas puedes formar 3 grupos de 3.',
    points: 200,
    bloom_level: 'Comprender',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🍎', count: 9 }] }
  },
  {
    question_id: 'oa1-comp-7',
    stem_md: 'Si tienes 5 🐥 y 3 🐔, ¿cuántos animales tienes en total?',
    type: 'multiple_choice',
    options_json: [{ value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' }],
    correct_answer: '8',
    explanation: '¡Muy bien! 5 pollitos más 3 gallinas son 8 animales.',
    points: 180,
    bloom_level: 'Comprender',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🐥', count: 5 }, { emoji: '🐔', count: 3 }] }
  },
  {
    question_id: 'oa1-comp-8',
    stem_md: '¿Qué número está entre 7 y 9?',
    type: 'multiple_choice',
    options_json: [{ value: '6', label: '6' }, { value: '8', label: '8' }, { value: '10', label: '10' }],
    correct_answer: '8',
    explanation: '¡Excelente! El número 8 está entre el 7 y el 9.',
    points: 150,
    bloom_level: 'Comprender',
    visual_aid: { type: 'number-line', items: [7, 8, 9] }
  },
  {
    question_id: 'oa1-comp-9',
    stem_md: 'Si tienes 10 🥕 y le das la mitad a tu amigo, ¿cuántas le das?',
    type: 'multiple_choice',
    options_json: [{ value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' }],
    correct_answer: '5',
    explanation: '¡Correcto! La mitad de 10 zanahorias son 5.',
    points: 200,
    bloom_level: 'Comprender',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🥕', count: 10 }] }
  },
  {
    question_id: 'oa1-comp-10',
    stem_md: '¿Cuál es el número más grande: 14, 9, 18?',
    type: 'multiple_choice',
    options_json: [{ value: '14', label: '14' }, { value: '9', label: '9' }, { value: '18', label: '18' }],
    correct_answer: '18',
    explanation: '¡Genial! El número más grande es 18.',
    points: 150,
    bloom_level: 'Comprender',
    visual_aid: { type: 'number-line', items: [9, 14, 18] }
  }
];

export default function FarmCountingGameOA1Comprehend({ onGameEnd }: { onGameEnd: (score: number, results: any) => void; }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [highContrast, setHighContrast] = useState(false);

  const currentQ = OA1_COMPREHEND_QUESTIONS[currentQuestion];

  // Función TTS
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

  const handleAnswer = (selectedAnswer: string) => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    const isCorrect = selectedAnswer === currentQ.correct_answer;
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
      if (currentQuestion < OA1_COMPREHEND_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const finalScore = score + (isCorrect ? currentQ.points : 0);
        router.push(`/student/games/oa1-mat-comprender/results?score=${finalScore}`);
      }
    }, 4000); // Más tiempo para escuchar la explicación
  };

  const renderVisualAid = () => {
    const { type, items } = currentQ.visual_aid;
    if (type === 'emoji-group') {
      return (
        <div className="flex flex-wrap justify-center items-center gap-8 p-4">
          {(items as { emoji: string; count: number }[]).map((group, index) => (
            <div key={index} className="text-center">
              <div className="flex flex-wrap justify-center gap-2 text-5xl">
                {Array.from({ length: Math.abs(group.count) }).map((_, i) => (
                  <span key={i} className={group.count < 0 ? 'opacity-50 line-through' : ''}>
                    {group.emoji}
                  </span>
                ))}
              </div>
              {group.count < 0 && <p className="text-sm text-gray-500">(-{Math.abs(group.count)})</p>}
              {group.count > 0 && index === 0 && items.length > 1 && <p className={`mt-2 font-bold text-xl ${highContrast ? 'text-white' : 'text-gray-700'}`}>Grupo {String.fromCharCode(65 + index)}</p>}
            </div>
          ))}
        </div>
      );
    } else if (type === 'number-line') {
      return (
        <div className="flex justify-center items-center p-4">
          {(items as number[]).map((num, index) => (
            <React.Fragment key={index}>
              <div className={`text-3xl font-bold ${highContrast ? 'text-yellow-300' : 'text-indigo-800'}`}>{num}</div>
              {index < items.length - 1 && (
                <div className={`h-1 w-8 ${highContrast ? 'bg-gray-600' : 'bg-gray-300'} mx-2`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }
    return null;
  };

  const OA_DESCRIPTION = "MA01OA01: Contar números del 0 al 100 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10, hacia adelante y hacia atrás, empezando por cualquier número menor que 100.";

  if (!gameStarted) {
    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${highContrast ? 'bg-black' : 'bg-gradient-to-br from-sky-50 to-indigo-100'}`}>
            <div className={`text-center ${highContrast ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-2xl p-8 max-w-2xl mx-auto`}>
                <h1 className={`text-5xl font-bold mb-4 ${highContrast ? 'text-yellow-300' : 'text-indigo-800'}`}>Juego de Comprensión</h1>
                <p className={`text-xl ${highContrast ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Demuestra que entiendes los números.</p>
                
                <div className={`${highContrast ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg mb-6`}>
                    <h3 className={`font-semibold ${highContrast ? 'text-yellow-300' : 'text-blue-800'}`}>Objetivo de Aprendizaje (OA1):</h3>
                    <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-blue-700'}`}>{OA_DESCRIPTION}</p>
                </div>

                <div className={`${highContrast ? 'bg-gray-700' : 'bg-purple-50'} p-4 rounded-lg mb-6`}>
                    <h3 className={`font-semibold ${highContrast ? 'text-yellow-300' : 'text-purple-800'}`}>Nivel de Bloom: <span className="font-bold">Comprender</span> 💡</h3>
                </div>

                <div className="absolute top-4 right-4">
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-2 text-sm font-medium">Alto Contraste</span>
                        <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} className="toggle toggle-warning" />
                    </label>
                </div>
                <Button onClick={() => setGameStarted(true)} className={`bg-indigo-600 hover:bg-indigo-700 text-white text-xl px-8 py-4 rounded-full ${highContrast ? 'bg-yellow-500' : ''}`}>
                    ¡Empezar Desafío!
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-sky-100 to-indigo-200'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`${highContrast ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-6`}>
          <div className="flex justify-between items-center">
            <h1 className={`text-3xl font-bold ${highContrast ? 'text-yellow-300' : 'text-indigo-800'}`}>Desafío de Comprensión</h1>
            <div className="text-right">
              <div className={`text-lg font-semibold ${highContrast ? 'text-white' : 'text-indigo-700'}`}>Puntos: {score}</div>
              <div className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>Pregunta {currentQuestion + 1} de {OA1_COMPREHEND_QUESTIONS.length}</div>
            </div>
          </div>
          <div className={`${highContrast ? 'text-gray-400' : 'text-gray-600'} text-sm mt-2`}>
            OA1: {OA_DESCRIPTION}
          </div>
          <div className={`${highContrast ? 'text-yellow-300' : 'text-purple-800'} font-bold text-sm mt-1`}>
            Nivel de Bloom: Comprender 💡
          </div>
        </div>

        <div className={`${highContrast ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-6`}>
          <div className={`${highContrast ? 'bg-gray-700' : 'bg-sky-50'} rounded-lg p-6 mb-6 text-center`}>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-white' : 'text-sky-900'} mb-4`}>{currentQ.stem_md}</h2>
            <Button onClick={() => speakText(currentQ.stem_md)} variant="outline" size="sm">Repetir 🔊</Button>
          </div>

          <div className={`${highContrast ? 'bg-gray-900' : 'bg-green-50'} rounded-lg p-6 mb-6 min-h-[120px]`}>
            {renderVisualAid()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options_json.map(option => (
              <Button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`h-24 text-2xl font-bold rounded-xl transform hover:scale-105 transition-shadow shadow-lg ${highContrast ? 'bg-yellow-500 text-black' : 'bg-gradient-to-br from-yellow-400 to-orange-400 text-gray-800'}`}
                disabled={showResult}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {showResult && lastAnswer && (
          <div className={`text-center p-6 rounded-xl shadow-lg ${lastAnswer.correct ? (highContrast ? 'bg-green-800' : 'bg-green-100') : (highContrast ? 'bg-red-800' : 'bg-red-100')}`}>
            <div className="text-5xl mb-3">{lastAnswer.correct ? '🎉' : '💪'}</div>
            <div className={`text-xl font-bold ${lastAnswer.correct ? (highContrast ? 'text-green-300' : 'text-green-800') : (highContrast ? 'text-red-300' : 'text-red-800')}`}>
              {lastAnswer.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}