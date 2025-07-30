'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { CogIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface GameSettingsPageProps {
  params: { id: string }
}

export default function GameSettingsPage({ params }: GameSettingsPageProps) {
  const router = useRouter()
  const sessionId = params.id

  const [settings, setSettings] = useState({
    maxPlayers: 30,
    timeLimit: 30,
    showCorrectAnswers: true,
    allowHints: false,
    shuffleQuestions: true,
    shuffleOptions: true,
    accessibilityMode: false,
    ttsEnabled: true,
    allowLateJoin: true,
    pauseAllowed: true,
    showLeaderboard: true,
    enableChat: false
  })

  const handleSave = () => {
    toast.success('Configuración del juego guardada')
    router.back()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Volver al Lobby</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuración del Juego</h1>
              <p className="text-gray-600">Sesión: {sessionId}</p>
            </div>
          </div>
          <CogIcon className="h-8 w-8 text-gray-400" />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* Basic Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Jugadores
                  </label>
                  <select
                    value={settings.maxPlayers}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                    className="input-field"
                  >
                    <option value={10}>10 estudiantes</option>
                    <option value={20}>20 estudiantes</option>
                    <option value={30}>30 estudiantes</option>
                    <option value={40}>40 estudiantes</option>
                    <option value={50}>50 estudiantes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo por Pregunta (segundos)
                  </label>
                  <select
                    value={settings.timeLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="input-field"
                  >
                    <option value={15}>15 segundos</option>
                    <option value={30}>30 segundos</option>
                    <option value={45}>45 segundos</option>
                    <option value={60}>60 segundos</option>
                    <option value={90}>90 segundos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Game Behavior */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Comportamiento del Juego</h3>
              <div className="space-y-4">
                {[
                  { key: 'showCorrectAnswers', label: 'Mostrar Respuestas Correctas', desc: 'Mostrar la respuesta correcta después de cada pregunta' },
                  { key: 'allowHints', label: 'Permitir Pistas', desc: 'Los estudiantes pueden solicitar pistas durante el juego' },
                  { key: 'shuffleQuestions', label: 'Mezclar Preguntas', desc: 'Presentar las preguntas en orden aleatorio' },
                  { key: 'shuffleOptions', label: 'Mezclar Opciones', desc: 'Presentar las opciones de respuesta en orden aleatorio' },
                  { key: 'allowLateJoin', label: 'Permitir Entrada Tardía', desc: 'Los estudiantes pueden unirse después de que inicie el juego' },
                  { key: 'pauseAllowed', label: 'Permitir Pausas', desc: 'El profesor puede pausar el juego en cualquier momento' },
                  { key: 'showLeaderboard', label: 'Mostrar Clasificación', desc: 'Mostrar clasificación en tiempo real durante el juego' },
                  { key: 'enableChat', label: 'Habilitar Chat', desc: 'Permitir chat entre estudiantes durante el juego' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{setting.label}</h4>
                      <p className="text-sm text-gray-600">{setting.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings[setting.key as keyof typeof settings] as boolean}
                      onChange={(e) => setSettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accesibilidad</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Modo de Accesibilidad</h4>
                    <p className="text-sm text-gray-600">Activar características especiales para estudiantes con necesidades especiales</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.accessibilityMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, accessibilityMode: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Texto a Voz (TTS)</h4>
                    <p className="text-sm text-gray-600">Leer las preguntas en voz alta automáticamente</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.ttsEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, ttsEnabled: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button onClick={handleSave}>
                Guardar Configuración
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 