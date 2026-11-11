// Casos de uso de ExcuseMe. Orquesta el dominio y los puertos; no sabe nada de
// React ni de las APIs del navegador.
import * as Call from '../domain/call.js';
import * as Chat from '../domain/chat.js';
import { findScenario } from '../domain/scenarios.js';

/**
 * @param {{
 *   ringtone: import('./ports.js').RingtonePlayer,
 *   voice: import('./ports.js').VoiceSpeaker,
 *   vibrator: import('./ports.js').Vibrator,
 *   clock: import('./ports.js').Clock,
 * }} ports
 */
export function createExcuseService({ ringtone, voice, vibrator, clock }) {
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
    const { duration } = state.call;
    stopTicker();
    stopRinging();
    voice.cancel();
    update({
      call: Call.idle(),
      isSpeaking: false,
      messages: [...state.messages, stamp(Chat.callLog(reason, duration))],
    });
  }

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    setDelay(seconds) {
      if (!Call.DELAY_OPTIONS.includes(seconds)) throw new Error(`Retardo no permitido: ${seconds}`);
      update({ delay: seconds });
    },

    // Programar una excusa: registra la elección en el chat y agenda la llamada.
    selectScenario(scenarioId) {
      if (state.call.status !== Call.CallStatus.IDLE) return;
      const scenario = findScenario(scenarioId);
      const call = Call.schedule(scenario, state.delay);
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
      update({ call });
      startTicker();
      voice.speak(call.scenario.script, {
        onStart: () => update({ isSpeaking: true }),
        onEnd: () => update({ isSpeaking: false }),
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

    dispose() {
      stopTicker();
      stopRinging();
      voice.cancel();
      listeners.clear();
    },
  };
}
