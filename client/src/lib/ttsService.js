/**
 * Servicio TTS Gratuito para EDU21
 * Usa Web Speech API del navegador - 100% gratis, sin límites
 */

class TTSService {
  constructor() {
    this.isEnabled = true;
    this.defaultLang = 'es-ES';
    this.rate = 0.9;
    this.pitch = 1.0;
    this.volume = 0.8;
    this.voices = [];
    this.currentUtterance = null;
    this.isClient = typeof window !== 'undefined';
    this.currentVoice = null; // Add this line
    
    // Solo inicializar en el cliente
    if (this.isClient) {
      // Inicializar cuando las voces estén disponibles
      this.initVoices();
      
      // Escuchar cambios de voces (algunos navegadores cargan voces async)
      if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  /**
   * Inicializa las voces disponibles
   */
  initVoices() {
    if (!this.isClient || typeof speechSynthesis === 'undefined') return;
    
    this.voices = speechSynthesis.getVoices();
    console.log('🔊 TTS: Voces disponibles:', this.voices.length);
    
    // Buscar voces en español
    const spanishVoices = this.voices.filter(voice => 
      voice.lang.startsWith('es')
    );
    
    if (spanishVoices.length > 0) {
      console.log('🇪🇸 Voces en español encontradas:', spanishVoices.map(v => v.name));
      this.currentVoice = spanishVoices[0].name; // Update currentVoice
    }
  }

  /**
   * Obtiene la mejor voz en español disponible
   */
  getBestSpanishVoice() {
    if (!this.isClient || this.voices.length === 0) return null;
    
    // Prioridad: es-ES (España) > es-MX (México) > es-AR (Argentina) > cualquier español
    const priorities = ['es-ES', 'es-MX', 'es-AR', 'es-US'];
    
    for (const lang of priorities) {
      const voice = this.voices.find(v => v.lang === lang);
      if (voice) return voice;
    }
    
    // Fallback: cualquier voz en español
    return this.voices.find(v => v.lang.startsWith('es'));
  }

  /**
   * Habla un texto
   * @param {string} text - Texto a pronunciar
   * @param {Object} options - Opciones adicionales
   */
  speak(text, options = {}) {
    if (!this.isClient || !this.isEnabled || !text || text.trim() === '' || typeof speechSynthesis === 'undefined') {
      return;
    }

    // Detener cualquier reproducción anterior
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar voz
    const voice = this.getBestSpanishVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = options.lang || this.defaultLang;
    }
    
    // Configurar parámetros
    utterance.rate = options.rate || this.rate;
    utterance.pitch = options.pitch || this.pitch;
    utterance.volume = options.volume || this.volume;
    
    // Eventos
    utterance.onstart = () => {
      console.log('🔊 TTS iniciado:', text.substring(0, 50));
      if (options.onStart) options.onStart();
    };
    
    utterance.onend = () => {
      console.log('🔊 TTS terminado');
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };
    
    utterance.onerror = (event) => {
      console.error('❌ Error TTS:', event.error);
      this.currentUtterance = null;
      if (options.onError) options.onError(event);
    };
    
    // Guardar referencia y reproducir
    this.currentUtterance = utterance;
    speechSynthesis.speak(utterance);
  }

  /**
   * Detiene la reproducción actual
   */
  stop() {
    if (!this.isClient || typeof speechSynthesis === 'undefined') return;
    
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Pausa la reproducción
   */
  pause() {
    if (!this.isClient || typeof speechSynthesis === 'undefined') return;
    
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  }

  /**
   * Reanuda la reproducción
   */
  resume() {
    if (!this.isClient || typeof speechSynthesis === 'undefined') return;
    
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }

  /**
   * Habla el texto de una pregunta de juego
   */
  speakQuestion(questionText, options = {}) {
    if (!this.isClient) return;
    
    const cleanText = this.cleanTextForSpeech(questionText);
    this.speak(cleanText, {
      ...options,
      rate: 0.8, // Más lento para preguntas
      onStart: () => {
        // Agregar indicador visual
        if (typeof document !== 'undefined') {
          document.body.classList.add('tts-speaking');
        }
        if (options.onStart) options.onStart();
      },
      onEnd: () => {
        if (typeof document !== 'undefined') {
          document.body.classList.remove('tts-speaking');
        }
        if (options.onEnd) options.onEnd();
      }
    });
  }

  /**
   * Habla feedback de respuesta
   */
  speakFeedback(isCorrect, customMessage = null) {
    if (!this.isClient) return;
    
    const message = customMessage || (isCorrect ? '¡Respuesta correcta!' : 'Incorrecto, inténtalo de nuevo');
    
    this.speak(message, {
      rate: 1.0,
      pitch: isCorrect ? 1.2 : 0.8, // Tono más alto para correcto
      volume: 0.9
    });
  }

  /**
   * Habla instrucciones del juego
   */
  speakInstructions(gameType, instructions) {
    if (!this.isClient) return;
    
    const prefix = this.getGameTypePrefix(gameType);
    const fullText = `${prefix}. ${instructions}`;
    
    this.speak(fullText, {
      rate: 0.7, // Más lento para instrucciones
      pitch: 1.0
    });
  }

  /**
   * Limpia texto para mejor pronunciación
   */
  cleanTextForSpeech(text) {
    return text
      .replace(/[*_#]/g, '') // Markdown
      .replace(/\s+/g, ' ') // Espacios múltiples
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Pausas entre oraciones
      .trim();
  }

  /**
   * Obtiene prefijo para tipo de juego
   */
  getGameTypePrefix(gameType) {
    const prefixes = {
      'trivia_lightning': 'Pregunta rápida',
      'memory_flip': 'Juego de memoria',
      'picture_bingo': 'Bingo con imágenes',
      'drag_drop_sorting': 'Arrastra y ordena',
      'number_line_race': 'Carrera numérica',
      'word_builder': 'Construye la palabra',
      'word_search': 'Sopa de letras',
      'hangman_visual': 'Adivina la palabra'
    };
    
    return prefixes[gameType] || 'Juego educativo';
  }

  /**
   * Configuración rápida de accesibilidad
   */
  setAccessibilityMode(enabled) {
    this.isEnabled = enabled;
    if (enabled) {
      this.rate = 0.7; // Más lento
      this.volume = 1.0; // Volumen máximo
    } else {
      this.stop(); // Detener cualquier reproducción
    }
  }

  /**
   * Información del servicio
   */
  getInfo() {
    return {
      service: 'Web Speech API',
      cost: 'Gratuito',
      isClient: this.isClient,
      isSupported: this.isClient && typeof speechSynthesis !== 'undefined',
      voicesAvailable: this.voices.length,
      voicesCount: this.voices.length,
      spanishVoices: this.voices.filter(v => v.lang.startsWith('es')).length,
      isEnabled: this.isEnabled,
      currentlyPlaying: this.currentUtterance !== null,
      supportedLanguages: this.voices.map(v => v.lang).filter((l, i, arr) => arr.indexOf(l) === i)
    };
  }

  /**
   * Prueba del servicio
   */
  test() {
    if (!this.isClient) {
      console.log('🔊 TTS: No disponible en servidor (SSR)');
      return;
    }
    
    this.speak('Servicio de texto a voz funcionando correctamente en español', {
      onEnd: () => console.log('✅ Test TTS completado')
    });
  }
}

// Crear instancia única
const ttsService = new TTSService();

// Exportar instancia y métodos principales
export default ttsService;
export const speak = (text, options) => ttsService.speak(text, options);
export const speakQuestion = (text, options) => ttsService.speakQuestion(text, options);
export const speakFeedback = (isCorrect, message) => ttsService.speakFeedback(isCorrect, message);
export const speakInstructions = (gameType, instructions) => ttsService.speakInstructions(gameType, instructions);
export const stopTTS = () => ttsService.stop();
export const pauseTTS = () => ttsService.pause();
export const resumeTTS = () => ttsService.resume(); 