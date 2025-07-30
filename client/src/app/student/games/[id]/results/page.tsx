'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon, ArrowPathIcon, ArrowRightIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import Confetti from 'react-confetti';
import { useAuth } from '@/store/auth';

// Import new visual components
import { MasteryGauge } from '@/components/game/MasteryGauge';
import { BloomRadarChart } from '@/components/game/BloomRadarChart';
import { AchievementCertificate } from '@/components/game/AchievementCertificate';
import { ResultsPDFDocument } from '@/components/game/ResultsPDFDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';


interface GameResult {
  score: number;
  history: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    skill: string;
  }[];
  gameTitle: string;
  gameId: string;
}

export default function GameResultsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [results, setResults] = useState<GameResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const resultsData = sessionStorage.getItem('lastGameResults');
    if (resultsData) {
      const parsedResults = JSON.parse(resultsData);
      // Ensure history is an array before setting results
      if (parsedResults && !Array.isArray(parsedResults.history)) {
        parsedResults.history = []; // Default to empty array if not an array
      }
      setResults(parsedResults);
      const accuracy = (parsedResults.history && Array.isArray(parsedResults.history)) ? parsedResults.history.filter((h: any) => h.isCorrect).length / parsedResults.history.length : 0;
      if (accuracy >= 0.8) {
        setShowConfetti(true);
      }
    } else {
      // router.push('/student/dashboard');
    }
  }, [router]);

  if (!results) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold">Cargando resultados...</h1>
          <p className="mt-2">Si no hay resultados, por favor vuelve al catálogo de juegos.</p>
          <Button onClick={() => router.push('/teacher/oa1-games')} className="mt-4">Volver al Catálogo</Button>
        </div>
      </DashboardLayout>
    );
  }

  const correctAnswers = results.history.filter(h => h.isCorrect).length;
  const totalQuestions = results.history.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const incorrectAnswers = results.history.filter(h => !h.isCorrect);

  const skillsData = Object.entries(results.history.reduce((acc, h) => {
    const skill = h.skill || 'General';
    if (!acc[skill]) {
      acc[skill] = { correct: 0, total: 0 };
    }
    acc[skill].total++;
    if (h.isCorrect) acc[skill].correct++;
    return acc;
  }, {} as Record<string, { correct: number, total: number }>))
  .map(([skill, data]) => ({
    skill,
    accuracy: Math.round((data.correct / data.total) * 100),
  }));

  const dominatedSkills = skillsData.filter(s => s.accuracy === 100).map(s => s.skill);
  const practiceSkills = skillsData.filter(s => s.accuracy < 100).map(s => s.skill);

  return (
    <DashboardLayout>
      {showConfetti && isClient && <Confetti recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">{results.gameTitle}</h1>
            <p className="text-xl text-gray-600 mt-2">¡Aquí tienes tu informe de maestría!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Gráficos y Certificado */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Medidor de Dominio</CardTitle></CardHeader>
              <CardContent>
                <MasteryGauge accuracy={accuracy} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Radar de Habilidades</CardTitle></CardHeader>
              <CardContent>
                <BloomRadarChart skillsData={skillsData} />
              </CardContent>
            </Card>
             <AchievementCertificate 
                studentName={user?.first_name || 'Estudiante'}
                gameTitle={results.gameTitle}
                score={results.score}
                accuracy={accuracy}
              />
          </div>

          {/* Columna Derecha: Repaso y Próximos Pasos */}
          <div className="lg:col-span-2 space-y-6">
            {incorrectAnswers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <ArrowPathIcon className="h-7 w-7 mr-3 text-orange-500" />
                    Zona de Repaso Inteligente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {incorrectAnswers.map((item, index) => (
                      <li key={index} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                        <p className="font-semibold text-gray-700">{item.question}</p>
                        <div className="mt-2 flex items-center">
                          <XCircleIcon className="h-6 w-6 mr-2 text-red-500" />
                          <p className="text-red-700">Tu respuesta: {item.userAnswer}</p>
                        </div>
                        <div className="mt-1 flex items-center">
                          <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500" />
                          <p className="text-green-700">Respuesta correcta: {item.correctAnswer}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                  <ArrowRightIcon className="h-7 w-7 mr-3 text-blue-500" />
                  ¿Cuál es tu Próximo Paso?
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                {isClient && (
                  <>
                    {/*
                    // Deshabilitado temporalmente debido a problemas de tipado con @react-pdf/renderer
                    <PDFDownloadLink
                      document={<ResultsPDFDocument results={results} studentName={user?.first_name || 'Estudiante'} />}
                      fileName={`informe-${results.gameId}-${new Date().toISOString().split('T')[0]}.pdf`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none bg-gray-200 text-gray-900 hover:bg-gray-300 h-10 px-4 py-2"
                    >
                      {({ loading }: any) => (
                        <>
                          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                          {loading ? 'Generando PDF...' : 'Descargar Informe'}
                        </>
                      )}
                    </PDFDownloadLink>
                    */}
                    <Button variant="secondary" disabled={true}>
                      <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                      Descargar Informe (Función Deshabilitada)
                    </Button>
                  </>
                )}
                {practiceSkills.length > 0 ? (
                  <Button onClick={() => router.push(`/student/games/${results.gameId}/play`)}>
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    Volver a Intentar
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/teacher/oa1-games')}>
                    ¡Buscar un Desafío Mayor!
                  </Button>
                )}
                 <Button onClick={() => router.push('/teacher/oa1-games')} variant="outline">
                    Ver Catálogo de Juegos
                  </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
