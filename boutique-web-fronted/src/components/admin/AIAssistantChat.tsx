import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, TrendingUp, Package, DollarSign, Users, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { processAIQuestion, type ChatMessage, type AIInsight } from '../../services/admin/aiAnalyticsService';
import { showToast } from '../../utils/toast';

const QUICK_QUESTIONS = [
  { icon: TrendingUp, text: '¿Cuáles son las tendencias de venta?', color: 'blue' },
  { icon: Package, text: '¿Qué productos tienen stock bajo?', color: 'orange' },
  { icon: DollarSign, text: 'Muéstrame las predicciones de ventas', color: 'green' },
  { icon: Users, text: 'Análisis de comportamiento de clientes', color: 'purple' },
];

const getInsightIcon = (type: AIInsight['type']) => {
  switch (type) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'danger': return '🚨';
    default: return 'ℹ️';
  }
};

const getInsightColor = (type: AIInsight['type']) => {
  switch (type) {
    case 'success': return 'green';
    case 'warning': return 'yellow';
    case 'danger': return 'red';
    default: return 'blue';
  }
};

export const AIAssistantChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 ¡Hola! Soy tu asistente de IA para análisis de negocio.\n\n✨ Puedo ayudarte con:\n📊 Análisis de ventas y tendencias\n📦 Gestión de inventario\n📈 Predicciones de demanda\n👥 Comportamiento de clientes\n📄 Reportes (PDF, Excel, CSV)\n\n🎤 Comandos de Voz:\n• Click en 🎤 para hablar tu pregunta\n• Toggle 🔊/🔇 para activar/desactivar audio automático\n• Ejemplos: "¿Cuáles son las tendencias?", "¿Qué productos tienen stock bajo?"\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar Web Speech API
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as Window & typeof globalThis).SpeechRecognition || 
                                    (window as Window & typeof globalThis).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current!.continuous = false;
      recognitionRef.current!.interimResults = false;
      recognitionRef.current!.lang = 'es-ES';

      recognitionRef.current!.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        showToast.success('🎤 Voz reconocida');
      };

      recognitionRef.current!.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Error de reconocimiento de voz:', event.error);
        setIsListening(false);
        showToast.error('Error al reconocer voz');
      };

      recognitionRef.current!.onend = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Función para iniciar/detener reconocimiento de voz
  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      showToast.error('Reconocimiento de voz no disponible en este navegador');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showToast.info('🎤 Escuchando... Habla ahora');
      } catch (error) {
        console.error('Error al iniciar reconocimiento:', error);
        showToast.error('Error al activar micrófono');
      }
    }
  };

  // Función para leer texto con síntesis de voz
  const speakText = (text: string) => {
    if (!synthRef.current) return;

    // Cancelar cualquier síntesis en curso
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  // Función para detener síntesis de voz
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Simular procesamiento de IA
    setTimeout(async () => {
      const aiResponse = await processAIQuestion(currentInput);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Leer respuesta automáticamente si está activado
      if (autoSpeak && synthRef.current) {
        speakText(aiResponse.content);
      }
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-xl shadow-2xl overflow-hidden border-2 border-purple-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-8 w-8" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold">Asistente IA de Análisis</h3>
            <p className="text-purple-100 text-sm">Potenciado por IA Avanzada</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-4 bg-white border-b border-purple-100">
        <p className="text-sm text-gray-600 mb-3 font-medium">Preguntas rápidas:</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_QUESTIONS.map((q, idx) => {
            const Icon = q.icon;
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickQuestion(q.text)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 border-${q.color}-200 bg-${q.color}-50 hover:bg-${q.color}-100 transition-colors text-left`}
              >
                <Icon className={`h-4 w-4 text-${q.color}-600 flex-shrink-0`} />
                <span className="text-xs text-gray-700">{q.text}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-white border-2 border-purple-200 shadow-lg'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">AI Assistant</span>
                  </div>
                )}
                <p className={`text-sm whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                  {message.content}
                </p>
                
                {/* Insights */}
                {message.insights && message.insights.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.insights.map((insight) => {
                      const color = getInsightColor(insight.type);
                      return (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg bg-${color}-50 border border-${color}-200`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{getInsightIcon(insight.type)}</span>
                            <div className="flex-1">
                              <h4 className={`font-semibold text-sm text-${color}-900`}>
                                {insight.title}
                              </h4>
                              <p className={`text-xs text-${color}-700 mt-1`}>
                                {insight.description}
                              </p>
                              <p className={`text-xs text-${color}-600 mt-2 italic`}>
                                💡 {insight.recommendation}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full bg-${color}-500`}
                                    style={{ width: `${insight.confidence}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">
                                  {insight.confidence}% confianza
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t-2 border-purple-200">
        {/* Controles de Voz */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2">
            {/* Botón de Micrófono */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoiceRecognition}
              className={`p-3 rounded-xl flex items-center gap-2 transition-all ${
                isListening 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
              title={isListening ? 'Detener grabación' : 'Iniciar grabación de voz'}
            >
              {isListening ? (
                <>
                  <MicOff className="h-5 w-5" />
                  {isListening && (
                    <motion.div
                      className="flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-1 h-4 bg-white rounded-full"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                      />
                      <motion.div
                        className="w-1 h-4 bg-white rounded-full"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                      />
                      <motion.div
                        className="w-1 h-4 bg-white rounded-full"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                      />
                    </motion.div>
                  )}
                </>
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </motion.button>

            {/* Botón de Auto-Speak */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-3 rounded-xl transition-all ${
                autoSpeak 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={autoSpeak ? 'Audio automático activado' : 'Audio automático desactivado'}
            >
              {autoSpeak ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </motion.button>

            {/* Botón Stop Speaking */}
            {isSpeaking && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopSpeaking}
                className="p-3 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200"
                title="Detener lectura"
              >
                <VolumeX className="h-5 w-5" />
              </motion.button>
            )}
          </div>

          {/* Indicador de Estado */}
          <div className="flex items-center gap-2 text-xs">
            {isListening && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-red-600 font-semibold"
              >
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
                Escuchando...
              </motion.span>
            )}
            {isSpeaking && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-green-600 font-semibold"
              >
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
                Hablando...
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe o usa el micrófono para preguntar..."
            className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
            Enviar
          </motion.button>
        </div>
      </div>
    </div>
  );
};
