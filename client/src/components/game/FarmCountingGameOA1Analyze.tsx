'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// --- Interfaces and Data ---
interface FarmCountingGameOA1AnalyzeProps {
  questions: QuestionData[];
  onGameEnd: (finalScore: number, results: any) => void;
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



// --- Component ---
export default function FarmCountingGameOA1Analyze({ questions, onGameEnd }: FarmCountingGameOA1AnalyzeProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [highContrast, setHighContrast] = useState(false);

  const containerClass = highContrast ? 'bg-black' : 'bg-gradient-to-br from-purple-50 to-pink-100';
  const cardClass = highContrast ? 'bg-gray-800 text-white' : 'bg-white';
  const textClass = highContrast ? 'text-yellow-300' : 'text-purple-800';

  const currentQ = questions[currentQuestion];

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
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const finalScore = score + (isCorrect ? currentQ.points : 0);
        onGameEnd(finalScore, {});
      }
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
                <h1 className={`text-5xl font-bold mb-4 ${highContrast ? 'text-yellow-300' : 'text-purple-800'}`}>Juego de Análisis</h1>
                <p className={`text-xl ${highContrast ? 'text-gray-300' : 'text-gray-600'} mb-6`}>¡Encuentra patrones y relaciones!</p>
                
                <div className={`${highContrast ? 'bg-gray-700' : 'bg-purple-100'} p-4 rounded-lg mb-6`}>
                    <h3 className={`font-semibold ${highContrast ? 'text-yellow-300' : 'text-purple-800'}`}>Objetivo de Aprendizaje (OA1):</h3>
                    <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-purple-700'}`}>{OA_DESCRIPTION}</p>
                </div>

                <div className={`${highContrast ? 'bg-gray-700' : 'bg-pink-100'} p-4 rounded-lg mb-6`}>
                    <h3 className={`font-semibold ${highContrast ? 'text-yellow-300' : 'text-pink-800'}`}>Nivel de Bloom: <span className="font-bold">Analizar</span> 🔍</h3>
                </div>

                <div className="absolute top-4 right-4">
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-2 text-sm font-medium">Alto Contraste</span>
                        <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} className="toggle toggle-warning" />
                    </label>
                </div>
                <Button onClick={() => setGameStarted(true)} className={`bg-purple-600 hover:bg-purple-700 text-white text-xl px-8 py-4 rounded-full ${highContrast ? 'bg-yellow-500' : ''}`}>
                    ¡Empezar a Analizar!
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
            <h1 className={`text-2xl sm:text-3xl font-bold ${textClass}`}>Desafío de Análisis</h1>
            <div className="text-right">
              <div className={`text-lg font-semibold ${textClass}`}>Puntos: {score}</div>
              <div className="text-sm text-gray-500">Pregunta {currentQuestion + 1} de {questions.length}</div>
            </div>
          </div>
          <div className={`${highContrast ? 'text-gray-400' : 'text-gray-600'} text-sm mt-2`}>
            OA1: {OA_DESCRIPTION}
          </div>
          <div className={`${highContrast ? 'text-yellow-300' : 'text-pink-800'} font-bold text-sm mt-1`}>
            Nivel de Bloom: Analizar 🔍
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
