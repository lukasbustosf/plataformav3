'use client';

import React, { useState, useEffect } from 'react';
import ttsService, { speakQuestion, speakInstructions, stopTTS, pauseTTS, resumeTTS } from '@/lib/ttsService';

interface TTSInfo {
  isSupported: boolean;
  isEnabled: boolean;
  voicesCount: number;
  spanishVoices: number;
  currentVoice: string;
}

interface TTSOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error?: any) => void;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface TTSControlsProps {
  gameType?: string;
  currentQuestion?: string;
  instructions?: string;
  className?: string;
  position?: 'fixed' | 'inline';
  showAdvancedControls?: boolean;
}

const TTSControls: React.FC<TTSControlsProps> = ({
  gameType = 'game',
  currentQuestion = '',
  instructions = '',
  className = '',
  position = 'fixed',
  showAdvancedControls = false
}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ttsInfo, setTtsInfo] = useState<TTSInfo | null>(null);

  useEffect(() => {
    // Inicializar información TTS
    const info = ttsService.getInfo();
    setTtsInfo({
      ...info,
      currentVoice: ttsService.currentVoice || 'Sistema'
    });
    
    // Configurar TTS con valores iniciales
    ttsService.rate = rate;
    ttsService.pitch = pitch;
    ttsService.volume = volume;
    ttsService.isEnabled = isEnabled;
  }, []);

  useEffect(() => {
    // Actualizar configuración TTS cuando cambien los valores
    ttsService.rate = rate;
    ttsService.pitch = pitch;
    ttsService.volume = volume;
    ttsService.isEnabled = isEnabled;
  }, [rate, pitch, volume, isEnabled]);

  const handleSpeak = (text: string, type: 'question' | 'instruction' | 'general' = 'general') => {
    if (!isEnabled || !text) return;

    setIsSpeaking(true);
    setIsPaused(false);

    const options = {
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onError: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    };

    switch (type) {
      case 'question':
        speakQuestion(text, options);
        break;
      case 'instruction':
        speakInstructions(gameType, text);
        break;
      default:
        ttsService.speak(text, options);
    }
  };

  const handleStop = () => {
    stopTTS();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (isSpeaking && !isPaused) {
      pauseTTS();
      setIsPaused(true);
    } else if (isPaused) {
      resumeTTS();
      setIsPaused(false);
    }
  };

  const handleToggleEnabled = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    if (!newEnabled) {
      handleStop();
    }
  };

  const handleAccessibilityMode = () => {
    ttsService.setAccessibilityMode(true);
    setRate(0.7);
    setVolume(1.0);
  };

  const handleTest = () => {
    ttsService.test();
  };

  if (!ttsInfo?.isSupported) {
    return (
      <div className={`tts-controls not-supported ${className}`}>
        <div className="text-xs text-gray-500">
          TTS no disponible en este navegador
        </div>
      </div>
    );
  }

  const baseClasses = position === 'fixed' 
    ? 'tts-controls fixed'
    : 'tts-controls inline-block';

  return (
    <div className={`${baseClasses} ${className} ${!isEnabled ? 'disabled' : ''}`}>
      <div className="sr-only" aria-live="polite">
        {isSpeaking ? 'Reproduciendo audio' : 'Audio detenido'}
      </div>

      {/* Controles principales */}
      <div className="tts-control-row">
        {/* Botón principal TTS */}
        <button
          onClick={() => handleSpeak(currentQuestion || instructions, currentQuestion ? 'question' : 'instruction')}
          disabled={!isEnabled || (!currentQuestion && !instructions)}
          className={`tts-button ${isSpeaking ? 'speaking' : ''} ${!isEnabled ? 'disabled' : ''}`}
          aria-label={isSpeaking ? 'Detener lectura' : 'Leer contenido'}
          title={isSpeaking ? 'Detener lectura' : 'Leer contenido'}
        >
          <span className="icon">
            {isSpeaking ? '⏹️' : '🔊'}
          </span>
          {isSpeaking ? 'Parar' : 'Leer'}
        </button>

        {/* Controles de reproducción */}
        {isSpeaking && (
          <>
            <button
              onClick={handlePause}
              className="tts-button"
              aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              title={isPaused ? 'Reanudar' : 'Pausar'}
            >
              <span className="icon">
                {isPaused ? '▶️' : '⏸️'}
              </span>
            </button>
            
            <button
              onClick={handleStop}
              className="tts-button"
              aria-label="Detener"
              title="Detener"
            >
              <span className="icon">⏹️</span>
            </button>
          </>
        )}

        {/* Toggle habilitado */}
        <button
          onClick={handleToggleEnabled}
          className={`tts-button ${isEnabled ? '' : 'disabled'}`}
          aria-label={isEnabled ? 'Desactivar TTS' : 'Activar TTS'}
          title={isEnabled ? 'Desactivar TTS' : 'Activar TTS'}
        >
          <span className="icon">
            {isEnabled ? '🔊' : '🔇'}
          </span>
        </button>

        {/* Expandir controles avanzados */}
        {showAdvancedControls && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="tts-button"
            aria-label={isExpanded ? 'Ocultar controles' : 'Mostrar controles'}
            title={isExpanded ? 'Ocultar controles' : 'Mostrar controles'}
          >
            <span className="icon">
              {isExpanded ? '⬇️' : '⬆️'}
            </span>
          </button>
        )}
      </div>

      {/* Controles avanzados */}
      {(showAdvancedControls && isExpanded) && (
        <>
          <div className="tts-control-row">
            <label className="tts-label" htmlFor="tts-rate">
              Velocidad:
            </label>
            <input
              id="tts-rate"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="tts-slider"
              aria-label="Velocidad de lectura"
            />
            <span className="text-xs">{rate.toFixed(1)}x</span>
          </div>

          <div className="tts-control-row">
            <label className="tts-label" htmlFor="tts-pitch">
              Tono:
            </label>
            <input
              id="tts-pitch"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="tts-slider"
              aria-label="Tono de voz"
            />
            <span className="text-xs">{pitch.toFixed(1)}</span>
          </div>

          <div className="tts-control-row">
            <label className="tts-label" htmlFor="tts-volume">
              Volumen:
            </label>
            <input
              id="tts-volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="tts-slider"
              aria-label="Volumen"
            />
            <span className="text-xs">{Math.round(volume * 100)}%</span>
          </div>

          {/* Botones de ayuda */}
          <div className="tts-control-row">
            <button
              onClick={handleAccessibilityMode}
              className="tts-button text-xs"
              title="Configuración de accesibilidad optimizada"
            >
              ♿ Accesible
            </button>
            
            <button
              onClick={handleTest}
              className="tts-button text-xs"
              title="Probar funcionamiento del TTS"
            >
              🧪 Test
            </button>
          </div>

          {/* Información del sistema */}
          <div className="text-xs text-gray-500 mt-2">
            <div>Voces: {ttsInfo?.voicesCount || 0}</div>
            <div>Español: {ttsInfo?.spanishVoices || 0}</div>
            <div className="truncate">
              Actual: {ttsInfo?.currentVoice || 'Sistema'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Componente simplificado para botón rápido
export const TTSButton: React.FC<{
  text: string;
  type?: 'question' | 'instruction' | 'general';
  gameType?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ 
  text, 
  type = 'general', 
  gameType = 'game',
  className = '',
  size = 'md'
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopTTS();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    const options = {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    };

    switch (type) {
      case 'question':
        speakQuestion(text, options);
        break;
      case 'instruction':
        speakInstructions(gameType, text);
        break;
      default:
        ttsService.speak(text, options);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  return (
    <button
      onClick={handleSpeak}
      className={`tts-button ${isSpeaking ? 'speaking' : ''} ${sizeClasses[size]} ${className}`}
      aria-label={isSpeaking ? 'Detener lectura' : 'Leer texto'}
      title={isSpeaking ? 'Detener lectura' : 'Leer texto'}
    >
      <span className="icon">
        {isSpeaking ? '⏹️' : '🔊'}
      </span>
      {size !== 'sm' && (isSpeaking ? 'Parar' : 'Leer')}
    </button>
  );
};

// Hook personalizado para usar TTS fácilmente
export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string, options: TTSOptions = {}) => {
    setIsSpeaking(true);
    ttsService.speak(text, {
      ...options,
      onStart: () => {
        setIsSpeaking(true);
        if (options.onStart) options.onStart();
      },
      onEnd: () => {
        setIsSpeaking(false);
        if (options.onEnd) options.onEnd();
      },
      onError: () => {
        setIsSpeaking(false);
        if (options.onError) options.onError();
      }
    });
  };

  const stop = () => {
    stopTTS();
    setIsSpeaking(false);
  };

  return {
    speak,
    stop,
    isSpeaking,
    service: ttsService
  };
};

export default TTSControls; 