// Máquina de estados de la llamada. Funciones puras: reciben un estado y
// devuelven uno nuevo. No conocen React, el navegador ni el reloj.
//
//   idle ──schedule──▶ countdown ──tick…──▶ ringing ──answer──▶ connected
//                 └──(retardo 0)──────────────▲
//   ringing / connected ──(colgar o rechazar)──▶ idle

export const CallStatus = Object.freeze({
  IDLE: 'idle',
  COUNTDOWN: 'countdown',
  RINGING: 'ringing',
  CONNECTED: 'connected',
});

export const DELAY_OPTIONS = Object.freeze([0, 5, 10, 30]);
export const DEFAULT_DELAY = 5;

export function idle() {
  return { status: CallStatus.IDLE, scenario: null, secondsLeft: null, duration: 0, muted: false };
}

export function schedule(scenario, delaySeconds) {
  if (!scenario) throw new Error('Se requiere un escenario para programar la llamada');
  if (!Number.isInteger(delaySeconds) || delaySeconds < 0) {
    throw new Error(`Retardo inválido: ${delaySeconds}`);
  }
  if (delaySeconds === 0) return ring(scenario);
  return { ...idle(), status: CallStatus.COUNTDOWN, scenario, secondsLeft: delaySeconds };
}

function ring(scenario) {
  return { ...idle(), status: CallStatus.RINGING, scenario };
}

// Avanza un segundo: descuenta la espera o suma duración a la llamada en curso.
export function tick(call) {
  if (call.status === CallStatus.COUNTDOWN) {
    const secondsLeft = call.secondsLeft - 1;
    return secondsLeft <= 0 ? ring(call.scenario) : { ...call, secondsLeft };
  }
  if (call.status === CallStatus.CONNECTED) {
    return { ...call, duration: call.duration + 1 };
  }
  return call;
}

export function answer(call) {
  if (call.status !== CallStatus.RINGING) {
    throw new Error('Solo se puede contestar una llamada que está sonando');
  }
  return { ...call, status: CallStatus.CONNECTED, duration: 0, muted: false };
}

export function toggleMute(call) {
  if (call.status !== CallStatus.CONNECTED) return call;
  return { ...call, muted: !call.muted };
}

// Una llamada cuenta para considerar a alguien "usuario" si fue contestada y duró al menos esto.
export const MIN_USER_CALL_SECONDS = 10;

export function countsAsUser(durationSeconds) {
  return durationSeconds >= MIN_USER_CALL_SECONDS;
}

export function isActive(call) {
  return call.status === CallStatus.RINGING || call.status === CallStatus.CONNECTED;
}

// 75 -> "1:15" (registro del chat)
export function formatDuration(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// 75 -> "01:15" (cronómetro en pantalla)
export function formatTimer(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
