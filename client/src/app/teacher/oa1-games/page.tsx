'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PuzzlePieceIcon, BookOpenIcon, BeakerIcon, PencilIcon, CheckBadgeIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

// Data for the OA1 games. In the future, this could come from an API.
const oa1Games = [
  {
    id: 'oa1-mat-recordar',
    name: 'Recordar: Conteo Básico',
    description: 'Juego de identificación de números y secuencias simples.',
    icon: PuzzlePieceIcon,
    bloomLevel: 'Recordar',
    complexity: 'Básico',
    skill: 'Contar números del 0 al 100 de 1 en 1.',
  },
  {
    id: 'oa1-mat-comprender',
    name: 'Comprender: Agrupación',
    description: 'Juego para agrupar objetos en decenas y unidades.',
    icon: BookOpenIcon,
    bloomLevel: 'Comprender',
    complexity: 'Básico',
    skill: 'Contar de 10 en 10.',
  },
  {
    id: 'oa1-mat-aplicar',
    name: 'Aplicar: La Feria',
    description: 'Simulación de compras para aplicar el conteo en un contexto real.',
    icon: BeakerIcon,
    bloomLevel: 'Aplicar',
    complexity: 'Intermedio',
    skill: 'Contar de 5 en 5 y de 10 en 10.',
  },
  {
    id: 'oa1-mat-analyze',
    name: 'Analizar: Patrones Numéricos',
    description: 'Juego para identificar y completar patrones y secuencias.',
    icon: PencilIcon,
    bloomLevel: 'Analizar',
    complexity: 'Intermedio',
    skill: 'Identificar el patrón en secuencias numéricas (de 2 en 2, 5 en 5, 10 en 10).',
  },
  {
    id: 'oa1-mat-evaluar',
    name: 'Evaluar: ¿Cuál es el Mayor?',
    description: 'Juego de comparación de cantidades para tomar decisiones.',
    icon: CheckBadgeIcon,
    bloomLevel: 'Evaluar',
    complexity: 'Avanzado',
    skill: 'Comparar números y determinar cuál es mayor o menor.',
  },
  {
    id: 'oa1-mat-crear',
    name: 'Crear: Diseña tu Secuencia',
    description: 'Juego para que los estudiantes creen sus propias secuencias numéricas.',
    icon: SparklesIcon,
    bloomLevel: 'Crear',
    complexity: 'Avanzado',
    skill: 'Crear secuencias numéricas con un patrón definido.',
  },
]

export default function OA1GamesPage() {
  const [selectedGame, setSelectedGame] = useState<typeof oa1Games[0] | null>(null)

  return (
    <DashboardLayout>
      <PageHeader
        title="Juegos para el OA1 de Matemáticas"
        description="Catálogo de evaluaciones gamificadas para el Objetivo de Aprendizaje 1 de 1º Básico: 'Contar números del 0 al 100'."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {oa1Games.map((game) => (
          <Card key={game.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">{game.name}</CardTitle>
              <game.icon className="h-6 w-6 text-gray-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{game.description}</p>
              <div className="flex space-x-2">
                <Link href={`/student/games/${game.id}/play`} passHref legacyBehavior>
                  <a target="_blank">
                    <Button variant="outline">
                      Probar Juego
                    </Button>
                  </a>
                </Link>
                <Button onClick={() => setSelectedGame(game)}>
                  Ver Ficha Curricular
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for Curricular Specification */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Ficha Curricular: {selectedGame.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedGame(null)}>
                  <XMarkIcon className="h-6 w-6" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-semibold text-gray-700">Objetivo de Aprendizaje</td>
                    <td className="py-2 text-gray-900">MAT-1B-OA01</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold text-gray-700">Habilidad Específica</td>
                    <td className="py-2 text-gray-900">{selectedGame.skill}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold text-gray-700">Nivel Taxonomía de Bloom</td>
                    <td className="py-2 text-gray-900">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {selectedGame.bloomLevel}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-gray-700">Nivel de Complejidad</td>
                    <td className="py-2 text-gray-900">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {selectedGame.complexity}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 flex justify-end">
                <Link href={`/student/games/${selectedGame.id}/play`} passHref legacyBehavior>
                  <a target="_blank">
                    <Button>
                      Ir a Probar el Juego
                    </Button>
                  </a>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
