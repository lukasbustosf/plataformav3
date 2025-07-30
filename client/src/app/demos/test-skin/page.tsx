'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  CalculatorIcon,
  SparklesIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'
import { speak, speakFeedback } from '@/lib/ttsService'

export default function TestSkinPage() {
  const [skinEnabled, setSkinEnabled] = useState(false)
  const [currentNumber, setCurrentNumber] = useState(1)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')

  // Juego básico de conteo (ENGINE ENG01)
  const numbers = [1, 2, 3, 4, 5]
  
  // Configuración del skin "🐄 Granja 1° Básico"
  const farmAnimals = ['🐄', '🐷', '🐔', '🐑', '🐰']
  const farmSounds = ['Muuu', 'Oink', 'Cluck', 'Baa', 'Hop']

  const handleNumberClick = (num: number) => {
    if (num === currentNumber) {
      setScore(score + 10)
      
      if (skinEnabled) {
        // Con skin: sonido y mensaje personalizado
        const animalMessage = `¡Excelente! Contaste ${num} ${farmAnimals[num-1]} - ${farmSounds[num-1]}!`
        setMessage(animalMessage)
        // TTS con contexto de granja
        speak(`¡Muy bien! Contaste ${num} animalitos de la granja. ${farmSounds[num-1]}`, {
          rate: 0.9,
          pitch: 1.1
        })
      } else {
        // Sin skin: mensaje básico
        const basicMessage = `¡Correcto! Número ${num}`
        setMessage(basicMessage)
        // TTS básico
        speakFeedback(true, `Correcto, número ${num}`)
      }
      
      setCurrentNumber(currentNumber < 5 ? currentNumber + 1 : 1)
    } else {
      const tryAgainMessage = skinEnabled 
        ? '¡Ops! Ese no es el animalito que buscamos. Intenta de nuevo' 
        : 'Intenta de nuevo'
      setMessage(tryAgainMessage)
      
      if (skinEnabled) {
        speak('¡Ups! Ese no es el animalito que buscamos. Busca el número correcto', {
          rate: 0.8,
          pitch: 0.9
        })
      } else {
        speakFeedback(false)
      }
    }
    
    setTimeout(() => setMessage(''), 3000)
  }

  const handleToggleSkin = (enabled: boolean) => {
    setSkinEnabled(enabled)
    if (enabled) {
      speak('¡Genial! Ahora estás en la granja. Escucha cómo cambia todo', {
        rate: 1.0,
        pitch: 1.2
      })
    } else {
      speak('Volviste al modo básico. ¿Notas la diferencia?', {
        rate: 1.0,
        pitch: 1.0
      })
    }
  }

  const playInstructions = () => {
    if (skinEnabled) {
      speak(`¡Bienvenido a la granja! Necesitas encontrar ${currentNumber} ${farmAnimals[currentNumber-1]} para ayudar al granjero. Escucha los sonidos y cuenta bien`, {
        rate: 0.8
      })
    } else {
      speak(`Juego de conteo. Encuentra el número ${currentNumber}`, {
        rate: 0.8
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header de control */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            🧪 Demo: Diferencia entre Juego con y sin Skin
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-lg font-medium">Sin Skin</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={skinEnabled}
                onChange={(e) => handleToggleSkin(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-lg font-medium">🐄 Con Skin "Granja"</span>
          </div>

          <Button
            onClick={playInstructions}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <SpeakerWaveIcon className="w-5 h-5" />
            🔊 Escuchar Instrucciones
          </Button>
        </div>

        {/* Área de juego */}
        <div className={`rounded-lg shadow-lg p-8 transition-all duration-500 ${
          skinEnabled 
            ? 'bg-gradient-to-br from-green-100 to-yellow-100 border-4 border-green-300' 
            : 'bg-white border-2 border-gray-200'
        }`}>
          
          {/* Título del juego */}
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-bold mb-2 ${
              skinEnabled ? 'text-green-800' : 'text-gray-800'
            }`}>
              {skinEnabled ? '🌾 Conteo en la Granja' : 'Juego de Conteo'}
            </h2>
            
            <p className={`text-lg ${
              skinEnabled ? 'text-green-700' : 'text-gray-600'
            }`}>
              {skinEnabled 
                ? `¡Cuenta los animales! Necesitas encontrar ${currentNumber} ${farmAnimals[currentNumber-1]}`
                : `Encuentra el número ${currentNumber}`
              }
            </p>
          </div>

          {/* Puntuación y feedback */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              skinEnabled ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-100 text-blue-800'
            }`}>
              <SparklesIcon className="w-5 h-5" />
              <span className="font-bold">Puntos: {score}</span>
            </div>
            
            {message && (
              <div className={`mt-3 p-3 rounded-lg ${
                skinEnabled ? 'bg-green-200 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {skinEnabled && <SpeakerWaveIcon className="w-5 h-5 inline mr-2" />}
                {message}
              </div>
            )}
          </div>

          {/* Elementos del juego */}
          <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
            {numbers.map((num) => (
              <Button
                key={num}
                onClick={() => handleNumberClick(num)}
                className={`h-24 text-2xl font-bold transition-all duration-300 ${
                  skinEnabled
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <div className="flex flex-col items-center">
                  {skinEnabled ? (
                    <>
                      <span className="text-3xl mb-1">{farmAnimals[num-1]}</span>
                      <span className="text-sm">{num}</span>
                    </>
                  ) : (
                    <span>{num}</span>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Explicación */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">
            📚 ¿Qué diferencia ves y escuchas?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Sin Skin (Básico):</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Números simples (1, 2, 3, 4, 5)</li>
                <li>• Colores neutros</li>
                <li>• Feedback básico</li>
                <li>• Sonidos genéricos</li>
                <li>• Sin contexto temático</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Con Skin "Granja" (Personalizado):</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Animales visuales (🐄🐷🐔🐑🐰)</li>
                <li>• Colores de campo y granja</li>
                <li>• Sonidos de animales (Muuu, Oink, etc.)</li>
                <li>• Narrativa inmersiva</li>
                <li>• Contexto educativo y divertido</li>
                <li>• TTS personalizado para cada animal</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">🎯 El valor real de los skins:</h4>
            <p className="text-sm text-yellow-700">
              Los skins no solo cambian colores y formas. Transforman la experiencia educativa completa: 
              <strong>visuales, sonidos, narrativa, feedback</strong> y crean un ambiente inmersivo que 
              mejora el aprendizaje y la motivación del estudiante.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 