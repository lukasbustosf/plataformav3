'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';

// --- Interfaces and Data ---
interface FarmCountingGameOA1Props {
  gameSession: any;
  onAnswer: (questionId: string, answer: any, timeSpent: number) => void;
  onGameComplete: (finalScore: number, history: any[]) => void;
  difficultyLevel: 'basico' | 'intermedio' | 'avanzado';
}

interface QuestionData {
  id: string;
  type: 'count_visual' | 'pattern_counting' | 'pattern_backward' | 'missing_number' | 'comparison';
  question: string;
  count?: number;
  pattern?: (number | string)[];
  options: number[];
  correctAnswer: number;
  skill: string;
}

const getDifficultyConfig = (level: 'basico' | 'intermedio' | 'avanzado') => {
  const configs = {
    basico: {
      title: "Conteo Fundamental",
      description: "Domina los números hasta 40 con conteo y comparaciones.",
      animals: ["🐣", "🐤", "🦆"],
      background: "#E8F5E8",
      bloom: "Recordar/Comprender"
    },
    intermedio: {
      title: "Secuencias y Patrones",
      description: "Aplica tus habilidades contando en grupos hasta 90.",
      animals: ["🐔", "🐓", "🐇"],
      background: "#F0F8E8",
      bloom: "Aplicar/Analizar"
    },
    avanzado: {
      title: "Dominio Numérico",
      description: "Resuelve desafíos complejos de conteo hasta 100.",
      animals: ["🐄", "🐖", "🐑"],
      background: "#E8F8F0",
      bloom: "Evaluar/Crear"
    }
  };
  return configs[level];
};

// --- ADVANCED QUESTION GENERATION ENGINE V3 ---
const generateQuestions = (difficulty: 'basico' | 'intermedio' | 'avanzado'): QuestionData[] => {
  const questions: QuestionData[] = [];
  const numQuestions = 15;
  const usedQuestions = new Set<string>();

  const createQuestion = (generator: () => QuestionData) => {
    let question;
    let attempts = 0;
    do {
      question = generator();
      attempts++;
    } while (usedQuestions.has(JSON.stringify(question.pattern || question.count)) && attempts < 10);
    usedQuestions.add(JSON.stringify(question.pattern || question.count));
    return question;
  };

  // --- Question Template Pools ---
  const basicTemplates: (() => QuestionData)[] = [
    () => {
      const count = Math.floor(Math.random() * 35) + 5; // Range 5-39
      const animal = getDifficultyConfig('basico').animals[0];
      return {
        id: `b_vis_${count}`, type: 'count_visual', question: `En el estanque hay ${count} ${animal}. ¿Es correcto? ¡Compruébalo!`,
        count, options: ([...new Set([count, count + 1, count - 1, count + 2])].filter(n => n > 0).sort(() => Math.random() - 0.5)) as number[],
        correctAnswer: count, skill: 'Conteo visual 1 a 1'
      };
    },
    () => {
      const start = Math.floor(Math.random() * 40);
      const pattern = [start, start + 1, start + 2];
      return {
        id: `b_seq_${start}`, type: 'pattern_counting', question: `Estás saltando de piedra en piedra: ${pattern.join(', ')}... ¿Cuál es la siguiente?`,
        pattern, correctAnswer: start + 3, options: ([start + 3, start + 2, start + 4, start + 5].sort(() => Math.random() - 0.5)) as number[],
        skill: 'Secuencia simple ascendente'
      };
    },
    () => {
        const num1 = Math.floor(Math.random() * 40);
        const num2 = Math.floor(Math.random() * 40);
        const correctAnswer = Math.max(num1, num2);
        return {
            id: `b_comp_${num1}_${num2}`, type: 'comparison', question: `¿Qué grupo es más grande, el de ${num1} 🥕 o el de ${num2} 🥕?`,
            count: 0, // Not visual
            pattern: [num1, num2],
            options: ([num1, num2, correctAnswer + 1, Math.min(num1, num2) -1].filter(n => n>=0)) as number[],
            correctAnswer, skill: 'Comparación de números'
        }
    }
  ];

  const intermediateTemplates: (() => QuestionData)[] = [
    () => {
      const p = { step: 2, start: Math.floor(Math.random() * 88), skill: "de 2 en 2" };
      const pattern = Array.from({ length: 3 }, (_, k) => p.start + k * p.step);
      const correctAnswer = p.start + 3 * p.step;
      return {
        id: `i_seq2_${p.start}`, type: 'pattern_counting', question: `Los conejos 🐇 avanzan ${p.skill}. Si van por ${pattern.join(', ')}, ¿a qué número llegarán?`,
        pattern, correctAnswer, options: ([...new Set([correctAnswer, correctAnswer + p.step, correctAnswer - p.step, correctAnswer + p.step * 2])].filter(n => n < 101).sort(() => Math.random() - 0.5)) as number[],
        skill: `Conteo hacia adelante ${p.skill}`
      };
    },
    () => {
      const p = { step: 5, start: Math.floor(Math.random() * 75), skill: "de 5 en 5" };
      const missingIndex = 1;
      const pattern = Array.from({ length: 4 }, (_, k) => p.start + k * p.step);
      const correctAnswer = pattern[missingIndex];
      const displayPattern: (string | number)[] = [...pattern]; displayPattern[missingIndex] = '?';
      return {
        id: `i_mis5_${p.start}`, type: 'missing_number', question: `¡Un topo 🐿️ escondió un número en la cerca! ¿Cuál falta?`,
        pattern: displayPattern, correctAnswer, options: ([...new Set([correctAnswer, correctAnswer + p.step, correctAnswer - p.step, p.start])].sort(() => Math.random() - 0.5)) as number[],
        skill: `Encontrar número faltante en secuencia ${p.skill}`
      };
    },
    () => {
        const p = { step: 10, start: Math.floor(Math.random() * 60), skill: "de 10 en 10" };
        const pattern = Array.from({ length: 3 }, (_, k) => p.start + k * p.step);
        const correctAnswer = p.start + 3 * p.step;
        return {
          id: `i_seq10_${p.start}`, type: 'pattern_counting', question: `Para vender huevos 🥚 en cajas, el granjero cuenta ${p.skill}. ¿Cuál es el siguiente número en su conteo?`,
          pattern, correctAnswer, options: ([...new Set([correctAnswer, correctAnswer + p.step, p.start, correctAnswer - p.step])].filter(n => n < 101).sort(() => Math.random() - 0.5)) as number[],
          skill: `Conteo hacia adelante ${p.skill}`
        };
    }
  ];

  const advancedTemplates: (() => QuestionData)[] = [
    () => {
      const p = { step: -2, start: Math.floor(Math.random() * 30) + 70, skill: "hacia atrás de 2 en 2" };
      const pattern = Array.from({ length: 3 }, (_, k) => p.start + k * p.step);
      const correctAnswer = p.start + 3 * p.step;
      return {
        id: `a_bwd2_${p.start}`, type: 'pattern_backward', question: `Un cohete 🚀 está en cuenta regresiva ${p.skill}. ¿Qué número sigue?`,
        pattern, correctAnswer, options: ([...new Set([correctAnswer, correctAnswer + p.step, correctAnswer - p.step, p.start])].filter(n => n > 0).sort(() => Math.random() - 0.5)) as number[],
        skill: `Conteo ${p.skill}`
      };
    },
    () => {
      const p = { step: -10, start: Math.floor(Math.random() * 40) + 60, skill: "hacia atrás de 10 en 10" };
      const missingIndex = 2;
      const pattern = Array.from({ length: 4 }, (_, k) => p.start + k * p.step);
      const correctAnswer = pattern[missingIndex];
      const displayPattern: (string | number)[] = [...pattern]; displayPattern[missingIndex] = '?';
      return {
        id: `a_mis10_${p.start}`, type: 'missing_number', question: `Un pájaro carpintero 🐦 picoteó un número en el árbol. ¿Cuál se borró?`,
        pattern: displayPattern, correctAnswer, options: ([...new Set([correctAnswer, correctAnswer + p.step, correctAnswer - p.step, p.start])].filter(n => n > 0).sort(() => Math.random() - 0.5)) as number[],
        skill: `Encontrar número faltante en secuencia ${p.skill}`
      };
    },
    () => {
        const p = { step: -5, start: Math.floor(Math.random() * 50) + 50, skill: "hacia atrás de 5 en 5" };
        const pattern = Array.from({ length: 3 }, (_, k) => p.start + k * p.step);
        const correctAnswer = p.start + 3 * p.step;
        return {
          id: `a_bwd5_${p.start}`, type: 'pattern_backward', question: `El tren 🚂 va en reversa ${p.skill}. ¿Cuál es su siguiente parada?`,
          pattern, correctAnswer, options: ([...new Set([correctAnswer, correctAnswer + p.step, p.start, correctAnswer - p.step * 2])].filter(n => n > 0).sort(() => Math.random() - 0.5)) as number[],
          skill: `Conteo ${p.skill}`
        };
    },
    () => {
        const num1 = Math.floor(Math.random() * 50) + 50;
        const num2 = Math.floor(Math.random() * 50) + 50;
        const correctAnswer = Math.min(num1, num2);
        return {
            id: `a_comp_${num1}_${num2}`, type: 'comparison', question: `Para una receta se necesitan ${num1}g de harina. Si solo tienes ${num2}g, ¿te falta o te sobra? Elige el número que tienes.`,
            count: 0,
            pattern: [num1, num2],
            options: ([num1, num2, correctAnswer + 10, 100].sort(() => Math.random() - 0.5)) as number[],
            correctAnswer: num2, skill: 'Comparación y lógica'
        }
    }
  ];

  const templatePool = difficulty === 'basico' ? basicTemplates : difficulty === 'intermedio' ? intermediateTemplates : advancedTemplates;

  for (let i = 0; i < numQuestions; i++) {
    const generator = templatePool[i % templatePool.length];
    questions.push(createQuestion(generator));
  }
  return questions;
};


const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  if (speechSynthesis.speaking) speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.95;
  speechSynthesis.speak(utterance);
};

export default function FarmCountingGameOA1({ gameSession, onAnswer, onGameComplete, difficultyLevel }: FarmCountingGameOA1Props) {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{correct: boolean, explanation: string} | null>(null);
  const [answerHistory, setAnswerHistory] = useState<any[]>([]);

  const difficultyConfig = getDifficultyConfig(difficultyLevel);
  const OA_DESCRIPTION = "MA01OA01: Contar números del 0 al 100 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10, hacia adelante y hacia atrás, empezando por cualquier número menor que 100.";

  useEffect(() => {
    setQuestions(generateQuestions(difficultyLevel));
  }, [difficultyLevel]);

  useEffect(() => {
    if (gameStarted && questions.length > 0) {
      speakText(questions[currentQuestionIndex].question);
    }
  }, [gameStarted, currentQuestionIndex, questions]);

  if (questions.length === 0) {
    return <div>Cargando preguntas...</div>;
  }

  const currentQuestionData = questions[currentQuestionIndex];

  const handleAnswer = (selectedAnswer: number) => {
    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;
    
    const feedback = {
      correct: isCorrect,
      explanation: isCorrect 
        ? `¡Excelente! ${currentQuestionData.correctAnswer} es la respuesta correcta.`
        : `Casi. La respuesta correcta era ${currentQuestionData.correctAnswer}. ¡Sigue practicando!`
    };

    // Build and save history entry
    const historyEntry = {
      question: currentQuestionData.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestionData.correctAnswer,
      isCorrect: isCorrect,
      skill: currentQuestionData.skill,
      pattern: currentQuestionData.pattern || [],
      type: currentQuestionData.type,
    };
    setAnswerHistory(prev => [...prev, historyEntry]);

    setLastAnswer(feedback);
    setShowResult(true);
    speakText(feedback.explanation);

    if (isCorrect) {
      setScore(score + 100);
    }

    onAnswer(currentQuestionData.id, selectedAnswer, timeSpent);

    setTimeout(() => {
      setShowResult(false);
      setLastAnswer(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setQuestionStartTime(Date.now());
      } else {
        // Game finished, pass score and history back
        const finalScore = score + (isCorrect ? 100 : 0);
        onGameComplete(finalScore, [...answerHistory, historyEntry]);
      }
    }, 2800);
  };

  const renderAnimals = (count: number) => {
    const animal = difficultyConfig.animals[0];
    return Array.from({ length: count }, (_, i) => (
      <div 
        key={i} 
        className="text-5xl animate-bounce"
        style={{ animationDelay: `${i * 0.05}s` }}
      >
        {animal}
      </div>
    ));
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: difficultyConfig.background }}>
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4 text-green-800">
            🌾 {gameSession.title || 'Granja Contadora OA1'} 🌾
          </h1>
          <div className="mb-6">
            <h2 className="text-3xl font-semibold mb-2 text-green-700">
              {difficultyConfig.title}
            </h2>
            <p className="text-lg text-gray-600 mb-4 max-w-xl mx-auto">
              {difficultyConfig.description}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4 text-left">
              <h3 className="font-bold text-blue-800">📚 Objetivo de Aprendizaje (OA1):</h3>
              <p className="text-sm text-blue-700">{OA_DESCRIPTION}</p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg text-left">
              <h3 className="font-bold text-yellow-800">🎯 Nivel de Taxonomía de Bloom:</h3>
              <p className="text-sm text-yellow-700">{difficultyConfig.bloom}</p>
            </div>
          </div>
          <Button 
            onClick={() => setGameStarted(true)}
            className="bg-green-600 hover:bg-green-700 text-white text-2xl font-bold px-10 py-5 rounded-full shadow-lg transform hover:scale-105 transition-transform"
          >
            🚀 ¡Empezar a Jugar!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ backgroundColor: difficultyConfig.background }}>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-green-800">
              {difficultyConfig.title}
            </h1>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-800">Puntos: {score}</div>
              <div className="text-sm text-gray-600">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-green-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 flex-grow">
              {currentQuestionData.question}
            </h2>
            <Button onClick={() => speakText(currentQuestionData.question)} variant="ghost" size="sm">
              <SpeakerWaveIcon className="h-8 w-8 text-blue-500" />
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 min-h-[150px] flex items-center justify-center">
            {currentQuestionData.type === 'count_visual' && currentQuestionData.count && (
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {renderAnimals(currentQuestionData.count)}
              </div>
            )}
            {(currentQuestionData.type === 'pattern_counting' || currentQuestionData.type === 'pattern_backward' || currentQuestionData.type === 'missing_number') && currentQuestionData.pattern && (
              <div className="text-center">
                <div className="flex items-center justify-center text-4xl sm:text-5xl font-bold space-x-4">
                  {currentQuestionData.pattern.map((num: number | string, i) => (
                    <span key={i} className={`inline-block px-4 py-2 rounded-lg shadow-sm ${num === '?' ? 'bg-yellow-200 text-yellow-800 border-2 border-dashed border-yellow-500' : 'bg-blue-100 text-blue-800'}`}>
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
             {currentQuestionData.type === 'comparison' && currentQuestionData.pattern && (
                <div className="flex items-center justify-around w-full">
                    <div className="text-center">
                        <div className="text-6xl font-bold text-purple-600">{currentQuestionData.pattern[0]}</div>
                        <div className="text-2xl mt-2">🥕</div>
                    </div>
                    <div className="text-4xl font-bold text-gray-500">vs</div>
                    <div className="text-center">
                        <div className="text-6xl font-bold text-teal-600">{currentQuestionData.pattern[1]}</div>
                        <div className="text-2xl mt-2">🥕</div>
                    </div>
                </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentQuestionData.options.map((option: number) => (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                className="h-24 text-3xl font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-b-8 border-yellow-600 rounded-2xl transform hover:-translate-y-1 transition-all duration-150 active:border-b-2"
                disabled={showResult}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {showResult && lastAnswer && (
          <div className={`text-center p-6 rounded-xl shadow-lg border-4 ${
            lastAnswer.correct ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'
          }`}>
            <div className="text-6xl mb-3 animate-pulse">{lastAnswer.correct ? '🎉' : '💪'}</div>
            <div className={`text-2xl font-bold ${
              lastAnswer.correct ? 'text-green-800' : 'text-red-800'
            }`}>
              {lastAnswer.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


 