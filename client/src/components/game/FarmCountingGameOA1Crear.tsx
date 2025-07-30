'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// --- Interfaces and Data ---
interface FarmCountingGameOA1CrearProps {
  onGameEnd: (finalScore: number, results: any) => void;
  gameSession: any;
}

interface QuestionData {
  question_id: string;
  stem_md: string;
  type: string;
  options_json: { value: string; label: string }[];
  correct_answer: string;
  explanation: string;
  points: number;
  bloom_level: string;
  visual_aid: { type: 'emoji-group' | 'number-line' | 'chart'; items: any[] };
}

const OA1_CREAR_QUESTIONS: QuestionData[] = [
  {
    question_id: 'oa1-cr-1',
    stem_md: 'Crea una secuencia de 5 números que vaya de 2 en 2, empezando en 10.',
    type: 'multiple_choice',
    options_json: [
      { value: '10,12,14,16,18', label: '10, 12, 14, 16, 18' },
      { value: '10,11,12,13,14', label: '10, 11, 12, 13, 14' },
      { value: '10,20,30,40,50', label: '10, 20, 30, 40, 50' }
    ],
    correct_answer: '10,12,14,16,18',
    explanation: '¡Excelente! Has creado una secuencia correcta de 2 en 2.',
    points: 450,
    bloom_level: 'Crear',
    visual_aid: { type: 'number-line', items: [10, 12, 14, 16, 18] }
  },
  {
    question_id: 'oa1-cr-2',
    stem_md: 'Diseña un problema de suma donde el resultado sea 15. Usa objetos de la granja.',
    type: 'multiple_choice',
    options_json: [
      { value: '8_vacas_mas_7_ovejas', label: '8 vacas + 7 ovejas = 15' },
      { value: '10_pollos_mas_3_patos', label: '10 pollos + 3 patos = 13' },
      { value: '5_cerdos_mas_5_caballos', label: '5 cerdos + 5 caballos = 10' }
    ],
    correct_answer: '8_vacas_mas_7_ovejas',
    explanation: '¡Fantástico! 8 + 7 = 15. Has creado un problema de suma perfecto.',
    points: 480,
    bloom_level: 'Crear',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🐄', count: 8 }, { emoji: '🐑', count: 7 }] }
  },
  {
    question_id: 'oa1-cr-3',
    stem_md: 'Imagina que tienes 20 manzanas. ¿Cómo las repartirías en 4 grupos iguales? Dibuja o describe.',
    type: 'multiple_choice',
    options_json: [
      { value: '4_grupos_de_5', label: '4 grupos de 5 manzanas cada uno.' },
      { value: '2_grupos_de_10', label: '2 grupos de 10 manzanas cada uno.' },
      { value: '5_grupos_de_4', label: '5 grupos de 4 manzanas cada uno.' }
    ],
    correct_answer: '4_grupos_de_5',
    explanation: '¡Muy bien! 20 dividido en 4 grupos iguales da 5 manzanas por grupo.',
    points: 480,
    bloom_level: 'Crear',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🍎', count: 20 }] }
  },
  {
    question_id: 'oa1-cr-4',
    stem_md: 'Crea un patrón de figuras usando 3 tipos de figuras diferentes y que se repita 3 veces.',
    type: 'multiple_choice',
    options_json: [
      { value: '▲●■▲●■▲●■', label: '▲, ●, ■, ▲, ●, ■, ▲, ●, ■' },
      { value: '▲▲●●■■', label: '▲, ▲, ●, ●, ■, ■' },
      { value: '▲●■●▲', label: '▲, ●, ■, ●, ▲' }
    ],
    correct_answer: '▲●■▲●■▲●■',
    explanation: '¡Excelente! Has creado un patrón claro y repetitivo.',
    points: 500,
    bloom_level: 'Crear',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '▲', count: 1 }, { emoji: '●', count: 1 }, { emoji: '■', count: 1 }] }
  },
  {
    question_id: 'oa1-cr-5',
    stem_md: 'Si tienes 10 flores y quieres hacer ramos de 3 flores cada uno, ¿cuántos ramos completos puedes crear y cuántas flores te sobran?',
    type: 'multiple_choice',
    options_json: [
      { value: '3_ramos_y_sobra_1', label: '3 ramos y sobra 1 flor.' },
      { value: '3_ramos_y_sobran_2', label: '3 ramos y sobran 2 flores.' },
      { value: '4_ramos_y_no_sobra_nada', label: '4 ramos y no sobra nada.' }
    ],
    correct_answer: '3_ramos_y_sobra_1',
    explanation: '¡Correcto! 3 ramos de 3 flores son 9, y te sobra 1 flor de las 10.',
    points: 500,
    bloom_level: 'Crear',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🌸', count: 10 }] }
  },
  {
    question_id: 'oa1-cr-6',
    stem_md: 'Inventa una historia corta donde uses los números 5, 10 y 15 para contar algo.',
    type: 'multiple_choice',
    options_json: [
      { value: 'historia_numeros', label: 'Había 5 pájaros, llegaron 10 más, y luego 15 se fueron volando.' },
      { value: 'historia_sin_numeros', label: 'Un día, un perro corrió por el campo.' },
      { value: 'historia_solo_un_numero', label: 'Tengo 20 juguetes.' }
    ],
    correct_answer: 'historia_numeros',
    explanation: '¡Qué creatividad! Has integrado los números perfectamente en tu historia.',
    points: 480,
    bloom_level: 'Crear',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🐦', count: 5 }, { emoji: '🐦', count: 10 }, { emoji: '🐦', count: 15 }] }
  },
  {
    question_id: 'oa1-cr-7',
    stem_md: 'Dibuja una recta numérica del 0 al 20 y marca los números que van de 5 en 5.',
    type: 'multiple_choice',
    options_json: [
      { value: '0,5,10,15,20', label: '0, 5, 10, 15, 20 marcados.' },
      { value: '0,1,2,3,4,5', label: '0, 1, 2, 3, 4, 5 marcados.' },
      { value: '5,10,15', label: '5, 10, 15 marcados.' }
    ],
    correct_answer: '0,5,10,15,20',
    explanation: '¡Perfecto! Has identificado y marcado correctamente los múltiplos de 5.',
    points: 450,
    bloom_level: 'Crear',
    visual_aid: { type: 'number-line', items: [0, 5, 10, 15, 20] }
  },
  {
    question_id: 'oa1-cr-8',
    stem_md: 'Crea un problema de resta donde el resultado sea 7. Usa animales de la granja.',
    type: 'multiple_choice',
    options_json: [
      { value: '12_patos_menos_5_patos', label: '12 patos - 5 patos = 7' },
      { value: '10_vacas_menos_2_vacas', label: '10 vacas - 2 vacas = 8' },
      { value: '5_ovejas_menos_3_ovejas', label: '5 ovejas - 3 ovejas = 2' }
    ],
    correct_answer: '12_patos_menos_5_patos',
    explanation: '¡Excelente! 12 - 5 = 7. Has creado un problema de resta.',
    points: 500,
    bloom_level: 'Crear',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '🦆', count: 12 }] }
  },
  {
    question_id: 'oa1-cr-9',
    stem_md: 'Si tienes 3 grupos de 4 objetos cada uno, ¿cuántos objetos tienes en total? Dibuja o describe.',
    type: 'multiple_choice',
    options_json: [
      { value: '12_objetos', label: '12 objetos en total (3x4).' },
      { value: '7_objetos', label: '7 objetos en total (3+4).' },
      { value: '1_objeto', label: '1 objeto.' }
    ],
    correct_answer: '12_objetos',
    explanation: '¡Correcto! 3 grupos de 4 objetos son 12 objetos en total.',
    points: 480,
    bloom_level: 'Crear',
    visual_aid: { type: 'emoji-group', items: [{ emoji: '📦', count: 3 }] }
  },
  {
    question_id: 'oa1-cr-10',
    stem_md: 'Crea un gráfico de barras simple que muestre que tienes más 🍎 que 🍌, y más 🍌 que 🍊.',
    type: 'multiple_choice',
    options_json: [
      { value: 'manzana_5_platano_3_naranja_1', label: 'Manzana: 5, Plátano: 3, Naranja: 1' },
      { value: 'manzana_2_platano_4_naranja_6', label: 'Manzana: 2, Plátano: 4, Naranja: 6' },
      { value: 'manzana_3_platano_3_naranja_3', label: 'Manzana: 3, Plátano: 3, Naranja: 3' }
    ],
    correct_answer: 'manzana_5_platano_3_naranja_1',
    explanation: '¡Excelente! Tu gráfico muestra la relación correcta de cantidades.',
    points: 500,
    bloom_level: 'Crear',
    visual_aid: { type: 'chart', items: [{ label: '🍎', value: 5 }, { label: '🍌', value: 3 }, { label: '🍊', value: 1 }] }
  }
];

// --- Component ---
export default function FarmCountingGameOA1Crear({ onGameEnd, gameSession }: FarmCountingGameOA1CrearProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<any[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [highContrast, setHighContrast] = useState(false);

  const containerClass = highContrast ? 'bg-black' : 'bg-gradient-to-br from-purple-50 to-pink-100';
  const cardClass = highContrast ? 'bg-gray-800 text-white' : 'bg-white';
  const textClass = highContrast ? 'text-yellow-300' : 'text-purple-800';

  const currentQ = OA1_CREAR_QUESTIONS[currentQuestion];

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

  useEffect(() => {
    if (gameStarted && currentQuestion >= OA1_CREAR_QUESTIONS.length) {
      // The parent component (`play/page.tsx`) expects the history array directly.
      // It will then assemble the full results object, including gameTitle and gameId.
      onGameEnd(score, answerHistory);
    }
  }, [currentQuestion, gameStarted, score, answerHistory, onGameEnd]);

  const handleAnswer = (selectedAnswer: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const isCorrect = selectedAnswer === currentQ.correct_answer;
    const feedback = { correct: isCorrect, explanation: currentQ.explanation };
    
    setLastAnswer(feedback);
    setShowResult(true);
    speakText(feedback.explanation);

    if (isCorrect) {
      setScore(prevScore => prevScore + currentQ.points);
    }

    setAnswerHistory(prevHistory => [
      ...prevHistory,
      {
        question: currentQ.stem_md,
        userAnswer: currentQ.options_json.find(opt => opt.value === selectedAnswer)?.label || selectedAnswer,
        correctAnswer: currentQ.options_json.find(opt => opt.value === currentQ.correct_answer)?.label || currentQ.correct_answer,
        isCorrect: isCorrect,
        skill: currentQ.bloom_level || 'general'
      }
    ]);

    setTimeout(() => {
      setShowResult(false);
      setLastAnswer(null);
      setCurrentQuestion(prev => prev + 1);
    }, 4000);
  };

  const renderVisualAid = () => {
    const { type, items } = currentQ.visual_aid;
    if (type === 'emoji-group') {
      return (
        <div className="flex flex-wrap justify-center items-center gap-4 p-4">
          {(items as { emoji: string; count: number }[]).map((group, index) => (
            <div key={index} className="text-center">
              <div className="flex flex-wrap justify-center gap-1 text-5xl">
                {Array.from({ length: group.count }).map((_, i) => <span key={i}>{group.emoji}</span>)}
              </div>
              {group.count > 0 && items.length > 1 && <p className={`mt-2 font-bold text-xl ${highContrast ? 'text-white' : 'text-gray-700'}`}>Grupo {String.fromCharCode(65 + index)}</p>}
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
    } else if (type === 'chart') {
      return (
        <div className="flex justify-center items-end h-48 p-4">
          {(items as { label: string; value: number }[]).map((bar, index) => (
            <div key={index} className="flex flex-col items-center mx-2">
              <div 
                className={`w-12 rounded-t-lg ${highContrast ? 'bg-blue-500' : 'bg-blue-400'}`}
                style={{ height: `${bar.value * 10}px` }} // Scale for visualization
              ></div>
              <span className={`mt-2 text-lg font-bold ${highContrast ? 'text-white' : 'text-gray-700'}`}>{bar.label} ({bar.value})</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const OA_DESCRIPTION = "MA01OA01: Contar números del 0 al 100 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10, hacia adelante y hacia atrás, empezando por cualquier número menor que 100.";

  if (!gameStarted) {
    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${containerClass}`}>
            <div className={`text-center ${cardClass} rounded-xl shadow-2xl p-8 max-w-2xl mx-auto`}>
                <h1 className={`text-5xl font-bold mb-4 ${textClass}`}>Juego de Creación</h1>
                <p className={`text-xl ${highContrast ? 'text-gray-300' : 'text-gray-600'} mb-6`}>¡Diseña, inventa y construye con números!</p>
                
                <div className={`${highContrast ? 'bg-gray-700' : 'bg-purple-100'} p-4 rounded-lg mb-6`}>
                    <h3 className={`font-semibold ${textClass}`}>Objetivo de Aprendizaje (OA1):</h3>
                    <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-purple-700'}`}>{OA_DESCRIPTION}</p>
                </div>

                <div className={`${highContrast ? 'bg-gray-700' : 'bg-pink-100'} p-4 rounded-lg mb-6`}>
                    <h3 className={`font-semibold ${highContrast ? 'text-yellow-300' : 'text-pink-800'}`}>Nivel de Bloom: <span className="font-bold">Crear</span> 💡</h3>
                </div>

                <div className="absolute top-4 right-4">
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-2 text-sm font-medium">Alto Contraste</span>
                        <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} className="toggle toggle-warning" />
                    </label>
                </div>
                <Button onClick={() => setGameStarted(true)} className={`bg-purple-600 hover:bg-purple-700 text-white text-xl px-8 py-4 rounded-full ${highContrast ? 'bg-yellow-500' : ''}`}>
                    ¡Empezar a Crear!
                </Button>
            </div>
        </div>
    );
  }

  if (currentQuestion >= OA1_CREAR_QUESTIONS.length) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${containerClass}`}>
        <div className={`text-center ${cardClass} rounded-xl shadow-2xl p-8 max-w-2xl mx-auto`}>
          <h1 className={`text-5xl font-bold mb-4 ${textClass}`}>¡Juego Terminado!</h1>
          <p className={`text-2xl ${highContrast ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Generando tu reporte final...
          </p>
          <div className={`text-3xl font-bold ${textClass}`}>
            Puntaje Final: {score}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${containerClass}`}>
      <div className="container mx-auto max-w-4xl">
        <div className={`${cardClass} rounded-xl shadow-lg p-4 mb-6`}>
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl sm:text-3xl font-bold ${textClass}`}>Desafío de Creación</h1>
            <div className="text-right">
              <div className={`text-lg font-semibold ${textClass}`}>Puntos: {score}</div>
              <div className="text-sm text-gray-500">Pregunta {currentQuestion + 1} de {OA1_CREAR_QUESTIONS.length}</div>
            </div>
          </div>
          <div className={`${highContrast ? 'text-gray-400' : 'text-gray-600'} text-sm mt-2`}>
            OA1: {OA_DESCRIPTION}
          </div>
          <div className={`${highContrast ? 'text-yellow-300' : 'text-pink-800'} font-bold text-sm mt-1`}>
            Nivel de Bloom: Crear 💡
          </div>
        </div>

        <div className={`${cardClass} rounded-xl shadow-lg p-6 sm:p-8 mb-6`}>
          <div className="text-center mb-6">
            <p className="text-2xl sm:text-3xl font-semibold mb-4">{currentQ.stem_md}</p>
            <Button onClick={() => speakText(currentQ.stem_md)} variant="outline" size="sm">Repetir 🔊</Button>
          </div>

          <div className={`${highContrast ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg p-6 mb-6 min-h-[120px]`}>
            {renderVisualAid()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options_json.map(option => (
              <Button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`h-28 sm:h-32 text-4xl sm:text-5xl font-bold rounded-xl transform hover:scale-105 transition-shadow shadow-lg ${highContrast ? 'bg-yellow-500 text-black' : 'bg-gradient-to-br from-purple-400 to-pink-500 text-white'}`}
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
