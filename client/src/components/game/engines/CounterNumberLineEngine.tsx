'use client'

import React, { useState } from 'react';

interface CounterNumberLineEngineProps {
  questions: any[];
  onGameEnd: (score: number, results: any) => void;
}

const CounterNumberLineEngine: React.FC<CounterNumberLineEngineProps> = ({ questions, onGameEnd }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  const handleAnswer = (answer: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;

    if (isCorrect) {
      setScore(score + 10);
    }

    const newResults = [...results, { question: currentQuestion, answer, isCorrect }];
    setResults(newResults);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onGameEnd(score + (isCorrect ? 10 : 0), newResults);
    }
  };

  if (!questions || questions.length === 0) {
    return <div>No hay preguntas para este juego.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Pregunta {currentQuestionIndex + 1}</h2>
      <p>{currentQuestion.text}</p>
      {/* This is a simplified representation. A real engine would have interactive elements. */}
      <div>
        {currentQuestion.options.map((option: any, index: number) => (
          <button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CounterNumberLineEngine;
