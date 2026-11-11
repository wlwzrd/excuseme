// Casos de uso de ExcuseMe. Orquesta el dominio y los puertos; no sabe nada de
// React ni de las APIs del navegador.
import * as Call from '../domain/call.js';
import * as Chat from '../domain/chat.js';
import { findScenario } from '../domain/scenarios.js';
import { Events } from './events.js';

const noAnalytics = { track() {} };
const noVisitor = { registerVisit: () => ({ isFirstVisit: false }), registerAnsweredCall: () => 1 };
const noSharer = { share: async () => 'unavailable' };

/**
 * @param {{
 *   ringtone: import('./ports.js').RingtonePlayer,
 *   voice: import('./ports.js').VoiceSpeaker,
 *   vibrator: import('./ports.js').Vibrator,
 *   clock: import('./ports.js').Clock,
 *   analytics?: import('./ports.js').Analytics,
 *   visitor?: import('./ports.js').VisitorStore,
 *   sharer?: import('./ports.js').Sharer,
 *   channel?: string,
 * }} ports
 */
export function createExcuseService({
  ringtone,
  voice,
  vibrator,
  clock,
  analytics = noAnalytics,
  visitor = noVisitor,
  sharer = noSharer,
  channel = 'sin_etiqueta',
}) {
  let nextId = 1;
  const stamp = (message) => ({ ...message, id: nextId++, at: clock.now() });

  let state = {
    delay: Call.DEFAULT_DELAY,
    call: Call.idle(),
    isSpeaking: false,
    messages: [stamp(Chat.welcome())],
  };

  const listeners = new Set();
  const update = (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };

  // La analítica nunca debe romper un caso de uso (RNF-14).
  const track = (event, params) => {
    try {
      analytics.track(event, params);
    } catch {
      /* se ignora */
    }
  };

  let scriptFinished = false;
  let cancelTicker = null;
  const stopTicker = () => {
    if (cancelTicker) cancelTicker();
    cancelTicker = null;
  };
  const startTicker = () => {
    stopTicker();
    cancelTicker = clock.every(1000, onTick);
  };

  const startRinging = () => {
    ringtone.start();
    vibrator.start();
  };
  const stopRinging = () => {
    ringtone.stop();
    vibrator.stop();
  };

  function onTick() {
    const wasCountdown = state.call.status === Call.CallStatus.COUNTDOWN;
    const call = Call.tick(state.call);
    const startedRinging = wasCountdown && call.status === Call.CallStatus.RINGING;
    if (startedRinging) stopTicker();
    update({ call });
    if (startedRinging) startRinging();
  }

  function endCall(reason) {
    const { duration, scenario, status } = state.call;
    const wasConnected = status === Call.CallStatus.CONNECTED;

    if (wasConnected) {
      track(Events.CALL_HUNG_UP, {
        tipo: scenario.id,
        duracion: duration,
        longitud_guion: scenario.script.length,
        guion_completo: scriptFinished,
        valida: Call.countsAsUser(duration),
      });
    } else {
      track(Events.CALL_REJECTED, { tipo: scenario.id });
    }

    stopTicker();
    stopRinging();
    voice.cancel();
    update({
      call: Call.idle(),
      isSpeaking: false,
      messages: [
        ...state.messages,
        stamp(Chat.callLog(reason, duration, { ratingFor: wasConnected ? scenario.id : null })),
      ],
    });
  }

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    // Se llama una vez al abrir la app.
    start() {
      const { isFirstVisit } = visitor.registerVisit();
      track(Events.VISIT, { primera_visita: isFirstVisit, canal: channel });
    },

    setDelay(seconds) {
      if (!Call.DELAY_OPTIONS.includes(seconds)) throw new Error(`Retardo no permitido: ${seconds}`);
      update({ delay: seconds });
    },

    // Programar una excusa: registra la elección en el chat y agenda la llamada.
    selectScenario(scenarioId) {
      if (state.call.status !== Call.CallStatus.IDLE) return;
      const scenario = findScenario(scenarioId);
      // Este método corre dentro del toque del usuario: es el momento de desbloquear el audio (iOS).
      ringtone.prepare?.();
      const call = Call.schedule(scenario, state.delay);
      track(Events.EXCUSE_SELECTED, { tipo: scenario.id, retardo: state.delay });
      update({
        call,
        messages: [...Chat.hideOptions(state.messages), ...Chat.selection(scenario).map(stamp)],
      });
      if (call.status === Call.CallStatus.RINGING) startRinging();
      else startTicker();
    },

    answer() {
      if (state.call.status !== Call.CallStatus.RINGING) return;
      stopRinging();
      const call = Call.answer(state.call);
      scriptFinished = false;
      update({ call });
      track(Events.CALL_ANSWERED, {
        tipo: call.scenario.id,
        dia_de_uso: visitor.registerAnsweredCall(clock.now()),
      });
      startTicker();
      voice.speak(call.scenario.script, {
        onStart: () => update({ isSpeaking: true }),
        onEnd: ({ completed = false } = {}) => {
          if (completed && state.call.status === Call.CallStatus.CONNECTED) scriptFinished = true;
          update({ isSpeaking: false });
        },
      });
    },

    reject() {
      if (state.call.status === Call.CallStatus.RINGING) endCall(Chat.EndReason.REJECTED);
    },

    hangUp() {
      if (state.call.status === Call.CallStatus.CONNECTED) endCall(Chat.EndReason.HUNG_UP);
    },

    toggleMute() {
      const call = Call.toggleMute(state.call);
      if (call === state.call) return;
      update({ call });
      if (call.muted) voice.pause();
      else voice.resume();
    },

    // Calificación "¿Te funcionó?" de 1 a 5 (RF-16). Solo se acepta una vez por llamada.
    rate(messageId, value) {
      const target = state.messages.find((m) => m.id === messageId);
      if (!target?.rating || target.rating.value !== null) return;
      update({ messages: Chat.rate(state.messages, messageId, value) });
      track(Events.RATING, { valor: value, tipo: target.rating.scenarioId });
    },

    async share() {
      track(Events.SHARE);
      const result = await sharer.share();
      if (result === 'copied') update({ messages: [...state.messages, stamp(Chat.linkCopied())] });
      return result;
    },

    dispose() {
      stopTicker();
      stopRinging();
      voice.cancel();
      listeners.clear();
    },
  };
}
