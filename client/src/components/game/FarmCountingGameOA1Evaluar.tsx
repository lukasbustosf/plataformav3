'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// --- Interfaces and Data ---
interface FarmCountingGameOA1EvaluarProps {
  gameSession: any;
  onGameEnd: (finalScore: number, results: any) => void;
  difficultyLevel: 'basico' | 'intermedio' | 'avanzado';
}

interface QuestionData {
  id: string;
  stem_md: string;
  type: 'comparison' | 'sequence_validation' | 'best_strategy';
  options: { value: string; label: string }[];
  correct_answer: string;
  explanation: string;
  visual_aid: { type: 'emoji-group' | 'number-line'; items: any[] };
}

const generateEvaluarQuestions = (difficulty: 'basico' | 'intermedio' | 'avanzado'): QuestionData[] => {
  const questions: QuestionData[] = [];
  const numQuestions = 5;

  for (let i = 0; i < numQuestions; i++) {
    switch (difficulty) {
      case 'basico': {
        const num1 = Math.floor(Math.random() * 50) + 1;
        const num2 = num1 + Math.floor(Math.random() * 10) + 1;
        const isNum2Greater = Math.random() > 0.5;
        const [n1, n2] = isNum2Greater ? [num1, num2] : [num2, num1];

        questions.push({
          id: `basico_ev_${i}`,
          stem_md: `Un granjero tiene ${n1} 🐔 y otro tiene ${n2} 🐔. ¿Es correcto decir que el segundo granjero tiene más gallinas?`,
          type: 'comparison',
          options: [
            { value: 'si', label: 'Sí, es correcto' },
            { value: 'no', label: 'No, es incorrecto' },
          ],
          correct_answer: isNum2Greater ? 'si' : 'no',
          explanation: `La afirmación es ${isNum2Greater ? 'correcta' : 'incorrecta'} porque ${n2} es ${n2 > n1 ? 'mayor' : 'menor'} que ${n1}.`,
          visual_aid: { type: 'emoji-group', items: [{ emoji: '🐔', count: n1 }, { emoji: '🐔', count: n2 }] }
        });
        break;
      }
      case 'intermedio': {
        const step = [2, 5, 10][i % 3];
        const start = Math.floor(Math.random() * 50);
        const isCorrect = Math.random() > 0.5;
        const sequence = [start, start + step, start + 2 * step];
        const finalNum = isCorrect ? start + 3 * step : start + 3 * step + (Math.random() > 0.5 ? 1 : -1);
        sequence.push(finalNum);

        questions.push({
          id: `intermedio_ev_${i}`,
          stem_md: `Un niño afirma que la secuencia sigue la regla de contar de ${step} en ${step}. ¿Es correcta su afirmación?`,
          type: 'sequence_validation',
          options: [
            { value: 'si', label: 'Sí, la secuencia es correcta' },
            { value: 'no', label: 'No, hay un error en la secuencia' },
          ],
          correct_answer: isCorrect ? 'si' : 'no',
          explanation: `La afirmación es ${isCorrect ? 'correcta' : 'incorrecta'}. La secuencia correcta debería ser ${[start, start + step, start + 2 * step, start + 3 * step].join(', ')}.`,
          visual_aid: { type: 'number-line', items: sequence }
        });
        break;
      }
      case 'avanzado': {
        const num = Math.floor(Math.random() * 40) + 60; // 60-99
        const step = [-2, -5, -10][i % 3];
        const isCorrect = Math.random() > 0.5;
        const sequence = [num, num + step, num + 2 * step];
        const finalNum = isCorrect ? num + 3 * step : num + 3 * step + (Math.random() > 0.5 ? 1 : -1);
        sequence.push(finalNum);

        questions.push({
          id: `avanzado_ev_${i}`,
          stem_md: `Un estudiante ordena los números ${sequence.join(', ')} y dice que está contando hacia atrás de ${Math.abs(step)} en ${Math.abs(step)}. ¿Es su juicio correcto?`,
          type: 'sequence_validation',
          options: [
            { value: 'si', label: 'Sí, su juicio es correcto' },
            { value: 'no', label: 'No, su juicio es incorrecto' },
          ],
          correct_answer: isCorrect ? 'si' : 'no',
          explanation: `El juicio es ${isCorrect ? 'correcto' : 'incorrecto'}. Al contar hacia atrás de ${Math.abs(step)} en ${Math.abs(step)} desde ${num}, la secuencia debería ser ${[num, num + step, num + 2 * step, num + 3 * step].join(', ')}.`,
          visual_aid: { type: 'number-line', items: sequence }
        });
        break;
      }
    }
  }
  return questions;
};


// --- Component ---
export default function FarmCountingGameOA1Evaluar({ gameSession, onGameEnd, difficultyLevel }: FarmCountingGameOA1EvaluarProps) {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);

  useEffect(() => {
    setQuestions(generateEvaluarQuestions(difficultyLevel));
  }, [difficultyLevel]);

  if (questions.length === 0) {
    return <div>Cargando juego de evaluación...</div>;
  }

  const currentQ = questions[currentQuestionIndex];

  const handleAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === currentQ.correct_answer;
    const feedback = { correct: isCorrect, explanation: currentQ.explanation };

    setLastAnswer(feedback);
    setShowResult(true);

    if (isCorrect) {
      setScore(prev => prev + 100);
    }

    setTimeout(() => {
      setShowResult(false);
      setLastAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        const finalScore = score + (isCorrect ? 100 : 0);
        onGameEnd(finalScore, {});
      }
    }, 4000);
  };

  const renderVisualAid = () => {
    const { type, items } = currentQ.visual_aid;
    if (type === 'emoji-group') {
      return (
        <div className="flex flex-wrap justify-center items-center gap-8 p-4">
          {(items as { emoji: string; count: number }[]).map((group, index) => (
            <div key={index} className="text-center">
              <div className="flex flex-wrap justify-center gap-1 text-4xl">
                {Array.from({ length: group.count }).map((_, i) => <span key={i}>{group.emoji}</span>)}
              </div>
              <p className="mt-2 font-bold text-xl text-gray-700">Grupo {group.count}</p>
            </div>
          ))}
        </div>
      );
    } else if (type === 'number-line') {
      return (
        <div className="flex justify-center items-center p-4 space-x-2">
          {(items as number[]).map((num, index) => (
            <React.Fragment key={index}>
              <div className="text-3xl font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-md">{num}</div>
              {index < items.length - 1 && (
                <div className="h-1 w-8 bg-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!gameStarted) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-100">
            <div className="text-center bg-white rounded-xl shadow-2xl p-8 max-w-2xl mx-auto">
                <h1 className="text-5xl font-bold mb-4 text-purple-800">Juego de Evaluación</h1>
                <p className="text-xl text-gray-600 mb-6">¡Juzga, critica y justifica tus respuestas!</p>
                <div className="bg-pink-100 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-pink-800">Nivel de Dificultad: <span className="font-bold capitalize">{difficultyLevel}</span> ⚖️</h3>
                </div>
                <Button onClick={() => setGameStarted(true)} className="bg-purple-600 hover:bg-purple-700 text-white text-xl px-8 py-4 rounded-full">
                    ¡Empezar a Evaluar!
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-800">Desafío de Evaluación</h1>
            <div className="text-right">
              <div className="text-lg font-semibold text-purple-800">Puntos: {score}</div>
              <div className="text-sm text-gray-500">Pregunta {currentQuestionIndex + 1} de {questions.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="text-center mb-6">
            <p className="text-2xl sm:text-3xl font-semibold mb-4">{currentQ.stem_md}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 mb-6 min-h-[120px] flex items-center justify-center">
            {renderVisualAid()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map(option => (
              <Button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="h-28 sm:h-32 text-2xl font-bold rounded-xl transform hover:scale-105 transition-shadow shadow-lg bg-gradient-to-br from-purple-400 to-pink-500 text-white"
                disabled={showResult}
              >
                {option.label}
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
