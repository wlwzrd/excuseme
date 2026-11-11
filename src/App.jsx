import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, PhoneOff, PhoneIncoming, ShieldAlert, Users, Briefcase, 
  Sparkles, Send, Volume2, VolumeX, CheckCheck, Clock, ArrowLeft, 
  MoreVertical, Mic, AlertTriangle, ShieldCheck
} from 'lucide-react';

const SCENARIOS = {
  familia: {
    id: 'familia',
    title: 'Familia',
    subtitle: 'Emergencia Doméstica',
    icon: Users,
    color: 'from-amber-500 to-orange-600',
    callerName: 'Mamá (Urgente)',
    callerNumber: '+57 300 987 6543',
    avatarBg: 'bg-amber-600',
    script: '¡Hola! Necesito que vengas a la casa inmediatamente. Ocurrió una fuga de agua en la cocina y se está inundando todo. Por favor cancela lo que estés haciendo y ven ya mismo.',
    chatPrompt: 'Escogiste opción: Familia. Preparando llamada de emergencia familiar...'
  },
  empresa: {
    id: 'empresa',
    title: 'Empresa',
    subtitle: 'Crisis Laboral',
    icon: Briefcase,
    color: 'from-blue-600 to-indigo-700',
    callerName: 'Jefe / Operaciones',
    callerNumber: '+57 315 456 7890',
    avatarBg: 'bg-blue-700',
    script: 'Buenas tardes. Disculpa interrumpir, pero se acaba de caer el servidor principal de la empresa y los clientes clave están llamando. Necesitamos tu acceso de administrador urgentemente en línea.',
    chatPrompt: 'Escogiste opción: Empresa. Preparando llamada de crisis corporativa...'
  },
  random: {
    id: 'random',
    title: 'Random',
    subtitle: 'Situación Inesperada',
    icon: Sparkles,
    color: 'from-purple-600 to-pink-600',
    callerName: 'Vecino / Portería',
    callerNumber: '+57 320 111 2233',
    avatarBg: 'bg-purple-600',
    script: '¡Hola! Qué pena molestarte a esta hora, pero dejaste las luces del auto encendidas en el parqueadero y parece que la alarma se activó. Tienes que bajar a revisarlo antes de que se agote la batería.',
    chatPrompt: 'Escogiste opción: Random. Preparando llamada de imprevisto...'
  }
};

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola! Bienvenido a ExcuseMe 🚨. ¿Necesitas una excusa rápida para retirarte de donde estás?\n\nSelecciona una opción del menú y programaré una llamada simulada realista con voz de IA.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showOptions: true
    }
  ]);
  const [delay, setDelay] = useState(5);
  const [activeCallState, setActiveCallState] = useState('idle'); // 'idle' | 'ringing' | 'connected'
  const [currentScenario, setCurrentScenario] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef(null);
  const audioCtxRef = useRef(null);
  const ringIntervalRef = useRef(null);
  const callTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, countdown]);

  useEffect(() => {
    return () => {
      stopRingtone();
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const playRingtone = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtxRef.current = new AudioContext();

      const playBeep = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const osc1 = audioCtxRef.current.createOscillator();
        const osc2 = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, audioCtxRef.current.currentTime);
        osc2.frequency.setValueAtTime(480, audioCtxRef.current.currentTime);

        gain.gain.setValueAtTime(0.15, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc1.start();
        osc2.start();
        osc1.stop(audioCtxRef.current.currentTime + 1.8);
      };

      playBeep();
      ringIntervalRef.current = setInterval(playBeep, 3000);

      if (navigator.vibrate) {
        navigator.vibrate([1000, 1000, 1000, 1000]);
      }
    } catch (e) {
      console.log('Audio Autoplay restricted', e);
    }
  };

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch(e){}
      audioCtxRef.current = null;
    }
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  };

  const handleSelectOption = (scenarioId) => {
    const scenario = SCENARIOS[scenarioId];
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev.map(m => ({ ...m, showOptions: false })),
      {
        id: Date.now(),
        sender: 'user',
        text: `Opción seleccionada: ${scenario.title}`,
        time: userTime
      },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: scenario.chatPrompt,
        time: userTime
      }
    ]);

    if (delay === 0) {
      triggerCall(scenario);
    } else {
      setCountdown(delay);
      let current = delay;
      countdownTimerRef.current = setInterval(() => {
        current -= 1;
        setCountdown(current);
        if (current <= 0) {
          clearInterval(countdownTimerRef.current);
          setCountdown(null);
          triggerCall(scenario);
        }
      }, 1000);
    }
  };

  const triggerCall = (scenario) => {
    setCurrentScenario(scenario);
    setActiveCallState('ringing');
    playRingtone();
  };

  const acceptCall = () => {
    stopRingtone();
    setActiveCallState('connected');
    setCallDuration(0);

    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    speakScript(currentScenario.script);
  };

  const speakScript = (text) => {
    if ('speechSynthesis' in window) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      const voices = synthRef.current.getVoices();
      const spanishVoice =
        voices.find(v => v.lang === 'es-CO') ||
        voices.find(v => v.lang.startsWith('es-4') || v.lang === 'es-MX' || v.lang === 'es-US') ||
        voices.find(v => v.lang.startsWith('es'));
      if (spanishVoice) utterance.voice = spanishVoice;

      synthRef.current.speak(utterance);
    }
  };

  const hangUpCall = (reason = 'Llamada finalizada') => {
    stopRingtone();
    if (synthRef.current) synthRef.current.cancel();
    if (callTimerRef.current) clearInterval(callTimerRef.current);

    const formattedDuration = `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}`;

    setActiveCallState('idle');
    setIsSpeaking(false);
    setIsMuted(false);

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'bot',
        text: `📞 ${reason}. Duración: ${callDuration > 0 ? formattedDuration : '0:00'}.

¿Quieres programar otra excusa?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showOptions: true
      }
    ]);

    setCallDuration(0);
    setCurrentScenario(null);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-950 font-sans shadow-2xl relative border-x border-slate-800">
      
      {/* HEADER DE WHATSAPP */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-lg shadow-md">
              E
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h1 className="font-semibold text-slate-100 text-base leading-tight">ExcuseMe</h1>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-emerald-400 font-medium">en línea (Servicio de Excusas)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white transition" />
        </div>
      </header>

      {/* CONTROLES DE CONFIGURACIÓN DE TIEMPO */}
      <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Retardo de llamada:</span>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 space-x-1">
          {[0, 5, 10, 30].map((s) => (
            <button
              key={s}
              onClick={() => setDelay(s)}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                delay === s 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s === 0 ? 'Ahora' : `${s}s`}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm whitespace-pre-line leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none'
                  : 'bg-slate-800 border border-slate-700/60 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.text}
              <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-400">
                <span>{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-300" />}
              </div>
            </div>

            {/* OPCIONES DE MENÚ */}
            {msg.showOptions && (
              <div className="w-full mt-3 space-y-2.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Selecciona una excusa:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(SCENARIOS).map((sec) => {
                    const Icon = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleSelectOption(sec.id)}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 transition text-left group shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${sec.color} text-white shadow-md`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 text-sm group-hover:text-emerald-400 transition">
                              {sec.title}
                            </div>
                            <div className="text-xs text-slate-400">{sec.subtitle}</div>
                          </div>
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 group-hover:bg-emerald-950 group-hover:text-emerald-400 transition border border-slate-700/50">
                          Llamar
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* CONTADOR DE ESPERA */}
        {countdown !== null && (
          <div className="flex items-center justify-center p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs animate-pulse space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Llamada entrante en {countdown} segundos... ¡Prepara tu excusa!</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* PIE DE PÁGINA / SIMULADOR DE ENTRADA */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2 text-xs text-slate-500 flex items-center justify-between">
          <span>Selecciona una opción del menú de arriba...</span>
          <Mic className="w-4 h-4 text-slate-600" />
        </div>
        <button 
          disabled 
          className="p-2.5 rounded-full bg-slate-800 text-slate-600 cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* PANTALLA DE LLAMADA ENTRANTE / EN CURSO */}
      {activeCallState !== 'idle' && currentScenario && (
        <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-8 animate-fade-in">
          
          {/* HEADER DE LLAMADA */}
          <div className="text-center pt-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 mb-6">
              <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>WhatsApp Audio</span>
            </div>

            <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-white shadow-2xl mb-4 relative">
              {currentScenario.callerName[0]}
              {activeCallState === 'ringing' && (
                <span className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-75"></span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-slate-100">{currentScenario.callerName}</h2>
            <p className="text-sm text-slate-400 mt-1">{currentScenario.callerNumber}</p>

            <div className="mt-4 text-sm font-medium">
              {activeCallState === 'ringing' ? (
                <span className="text-emerald-400 animate-pulse">Llamada entrante...</span>
              ) : (
                <span className="text-emerald-400">{formatTimer(callDuration)}</span>
              )}
            </div>
          </div>

          {/* ONDAS DE VOZ DURANTE LA LLAMADA */}
          {activeCallState === 'connected' && (
            <div className="flex items-center justify-center space-x-1.5 py-8">
              {[40, 75, 30, 90, 60, 100, 45, 80, 35].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full bg-emerald-500 transition-all duration-300 ${
                    isSpeaking ? 'animate-bounce' : 'h-3 opacity-40'
                  }`}
                  style={{
                    height: isSpeaking ? `${h}%` : '12px',
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* CONTROLES INFERIORES DE LLAMADA */}
          <div className="pb-8">
            {activeCallState === 'ringing' ? (
              <div className="flex items-center justify-around">
                <button
                  onClick={() => hangUpCall('Llamada rechazada')}
                  className="flex flex-col items-center space-y-2 group"
                >
                  <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition transform group-active:scale-95">
                    <PhoneOff className="w-7 h-7" />
                  </div>
                  <span className="text-xs text-slate-400">Rechazar</span>
                </button>

                <button
                  onClick={acceptCall}
                  className="flex flex-col items-center space-y-2 group"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white shadow-lg transition transform group-active:scale-95 animate-bounce">
                    <Phone className="w-7 h-7" />
                  </div>
                  <span className="text-xs text-slate-400">Contestar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-around">
                <button
                  onClick={() => {
                    const next = !isMuted;
                    setIsMuted(next);
                    if (synthRef.current) next ? synthRef.current.pause() : synthRef.current.resume();
                  }}
                  className={`p-4 rounded-full border transition ${
                    isMuted 
                      ? 'bg-slate-800 border-amber-500 text-amber-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>

                <button
                  onClick={() => hangUpCall('Llamada terminada por el usuario')}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition transform active:scale-95"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
