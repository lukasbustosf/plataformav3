'use client';

import React, { useState } from 'react';
import TTSControls, { TTSButton, useTTS } from '@/components/ui/ttsControls';

export default function TestTTSPage() {
  const [testText, setTestText] = useState(
    'Hola, este es un texto de prueba para el sistema de texto a voz. ' +
    '¿Escuchas correctamente la pronunciación en español?'
  );
  
  const [gameQuestion, setGameQuestion] = useState(
    '¿Cuál es la capital de Chile?'
  );

  const [gameInstructions, setGameInstructions] = useState(
    'Lee la pregunta y selecciona la respuesta correcta entre las opciones disponibles. Tienes 30 segundos para responder.'
  );

  const { speak, stop, isSpeaking } = useTTS();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔊 Test del Sistema TTS Gratuito
          </h1>

          {/* Información del sistema */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              ℹ️ Información del Sistema
            </h2>
            <p className="text-blue-800 text-sm">
              Este TTS usa <strong>Web Speech API</strong> del navegador - 
              es 100% gratuito, sin límites y funciona offline.
            </p>
          </div>

          {/* Test básico */}
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">📝 Test de Texto Personalizado</h3>
              
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Escribe aquí el texto que quieres probar..."
              />
              
              <div className="mt-3 flex items-center gap-3">
                <TTSButton 
                  text={testText}
                  type="general"
                  size="md"
                  className="flex-shrink-0"
                />
                <button
                  onClick={() => speak(testText)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  disabled={!testText.trim()}
                >
                  {isSpeaking ? 'Hablando...' : 'Usar Hook useTTS'}
                </button>
                <button
                  onClick={stop}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Detener
                </button>
              </div>
            </div>

            {/* Test de pregunta de juego */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">🎮 Test de Pregunta de Juego</h3>
              
              <div className="tts-question p-3 mb-3">
                <input
                  value={gameQuestion}
                  onChange={(e) => setGameQuestion(e.target.value)}
                  className="w-full text-lg font-medium bg-transparent border-none focus:outline-none"
                  placeholder="Escribe una pregunta de juego..."
                />
              </div>
              
              <TTSButton 
                text={gameQuestion}
                type="question"
                gameType="trivia_lightning"
                size="lg"
              />
            </div>

            {/* Test de instrucciones */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">📋 Test de Instrucciones</h3>
              
              <div className="tts-instruction p-3 mb-3">
                <textarea
                  value={gameInstructions}
                  onChange={(e) => setGameInstructions(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none resize-none h-20"
                  placeholder="Escribe las instrucciones del juego..."
                />
              </div>
              
              <TTSButton 
                text={gameInstructions}
                type="instruction"
                gameType="memory_flip"
                size="md"
              />
            </div>

            {/* Test de feedback */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">✅ Test de Feedback</h3>
              
              <div className="space-y-3">
                <div className="tts-feedback correct p-3">
                  <p className="font-medium text-green-800">¡Respuesta correcta! Muy bien.</p>
                  <TTSButton 
                    text="¡Respuesta correcta! Muy bien."
                    type="general"
                    size="sm"
                    className="mt-2"
                  />
                </div>
                
                <div className="tts-feedback incorrect p-3">
                  <p className="font-medium text-red-800">Respuesta incorrecta. Inténtalo de nuevo.</p>
                  <TTSButton 
                    text="Respuesta incorrecta. Inténtalo de nuevo."
                    type="general"
                    size="sm"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Controles avanzados */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">⚙️ Panel de Control Completo</h3>
              
              <TTSControls
                gameType="trivia_lightning"
                currentQuestion={gameQuestion}
                instructions={gameInstructions}
                position="inline"
                showAdvancedControls={true}
                className="!relative !bottom-auto !right-auto !shadow-none !border-dashed !opacity-100"
              />
            </div>

            {/* Ejemplos de diferentes voces */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">🗣️ Tests de Idioma y Contenido</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Matemáticas</h4>
                  <TTSButton 
                    text="Dos más dos es igual a cuatro. Tres por cinco es quince."
                    type="general"
                    size="sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Ciencias</h4>
                  <TTSButton 
                    text="El agua hierve a cien grados centígrados."
                    type="general"
                    size="sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Historia</h4>
                  <TTSButton 
                    text="Chile obtuvo su independencia en mil ochocientos diez."
                    type="general"
                    size="sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Geografía</h4>
                  <TTSButton 
                    text="Los Andes recorren Chile de norte a sur."
                    type="general"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                💡 Cómo usar
              </h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Haz clic en cualquier botón 🔊 para escuchar el texto</li>
                <li>• Usa los controles avanzados para ajustar velocidad y tono</li>
                <li>• El botón ♿ activa modo de accesibilidad optimizado</li>
                <li>• Funciona en Chrome, Firefox, Safari y Edge</li>
                <li>• No requiere conexión a internet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Panel flotante de ejemplo */}
      <TTSControls
        gameType="test"
        currentQuestion="Pregunta de ejemplo flotante"
        instructions="Instrucciones de ejemplo"
        showAdvancedControls={true}
      />
    </div>
  );
} 