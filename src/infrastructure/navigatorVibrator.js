// Adaptador de Vibrator: Vibration API (solo móviles compatibles).
export function createNavigatorVibrator() {
  const supported = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  return {
    start: () => supported && navigator.vibrate([1000, 1000, 1000, 1000]),
    stop: () => supported && navigator.vibrate(0),
  };
}
