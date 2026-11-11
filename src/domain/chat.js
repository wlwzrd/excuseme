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

export function callLog(reason, durationSeconds) {
  return {
    sender: 'bot',
    text: `📞 ${reason}. Duración: ${formatDuration(durationSeconds)}.\n\n¿Quieres programar otra excusa?`,
    showOptions: true,
  };
}

export function hideOptions(messages) {
  return messages.map((m) => (m.showOptions ? { ...m, showOptions: false } : m));
}
