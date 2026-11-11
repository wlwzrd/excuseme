// Puertos: lo que la aplicación necesita del mundo exterior.
// La capa de aplicación solo conoce estos contratos; las implementaciones
// concretas (adaptadores) viven en src/infrastructure y se conectan en src/main.jsx.

/**
 * Tono de llamada entrante.
 * @typedef {Object} RingtonePlayer
 * @property {() => void} start
 * @property {() => void} stop
 */

/**
 * Voz que lee el guion de la excusa.
 * @typedef {Object} VoiceSpeaker
 * @property {(text: string, handlers: { onStart: () => void, onEnd: () => void }) => void} speak
 * @property {() => void} pause
 * @property {() => void} resume
 * @property {() => void} cancel
 */

/**
 * Vibración del dispositivo mientras suena la llamada.
 * @typedef {Object} Vibrator
 * @property {() => void} start
 * @property {() => void} stop
 */

/**
 * Reloj: hora actual y temporizador periódico.
 * @typedef {Object} Clock
 * @property {() => Date} now
 * @property {(ms: number, fn: () => void) => (() => void)} every  Devuelve la función para cancelarlo.
 */

export {};
