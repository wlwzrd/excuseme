// Mensajes del chat. Solo contenido: el id y la hora los pone la capa de aplicación.
import { formatDuration } from './call.js';

export const EndReason = Object.freeze({
  REJECTED: 'Llamada rechazada',
  HUNG_UP: 'Llamada terminada por el usuario',
});

export function welcome() {
  return {
    sender: 'bot',
    text:
      '¡Hola! Bienvenido a ExcuseMe 🚨. ¿Necesitas una excusa rápida para retirarte de donde estás?\n\n' +
      'Selecciona una opción del menú y programaré una llamada simulada realista con voz de IA.',
    showOptions: true,
  };
}

export function selection(scenario) {
  return [
    { sender: 'user', text: `Opción seleccionada: ${scenario.title}`, showOptions: false },
    { sender: 'bot', text: scenario.chatPrompt, showOptions: false },
  ];
}

// ratingFor: id del escenario cuando el mensaje debe pedir la calificación "¿Te funcionó?".
export function callLog(reason, durationSeconds, { ratingFor = null } = {}) {
  const message = {
    sender: 'bot',
    text: `📞 ${reason}. Duración: ${formatDuration(durationSeconds)}.\n\n¿Quieres programar otra excusa?`,
    showOptions: true,
  };
  return ratingFor ? { ...message, rating: { scenarioId: ratingFor, value: null } } : message;
}

export const RATING_VALUES = Object.freeze([1, 2, 3, 4, 5]);

export function rate(messages, messageId, value) {
  if (!RATING_VALUES.includes(value)) throw new Error(`Calificación inválida: ${value}`);
  return messages.map((m) =>
    m.id === messageId && m.rating && m.rating.value === null
      ? { ...m, rating: { ...m.rating, value } }
      : m,
  );
}

export function linkCopied() {
  return { sender: 'bot', text: '🔗 Enlace copiado. ¡Compártelo con quien lo necesite!', showOptions: false };
}

export function hideOptions(messages) {
  return messages.map((m) => (m.showOptions ? { ...m, showOptions: false } : m));
}
