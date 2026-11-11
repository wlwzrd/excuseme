// Adaptador de RingtonePlayer: tono sintetizado con la Web Audio API.
//
// iOS solo deja iniciar audio dentro de un toque del usuario. Como la llamada puede
// sonar segundos después (por el retardo), prepare() se llama en el toque que elige
// la excusa: crea y reanuda el contexto de audio ahí, y se reutiliza cuando suena.
export function createWebAudioRingtone() {
  let ctx = null;
  let interval = null;
  let activeOscillators = [];

  const ensureContext = () => {
    if (ctx && ctx.state !== 'closed') return ctx;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    ctx = new AudioContext();
    return ctx;
  };

  const resume = (context) => {
    if (context.state === 'suspended') context.resume().catch(() => {});
  };

  const silenceActive = () => {
    activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        /* ya había terminado */
      }
    });
    activeOscillators = [];
  };

  const beep = () => {
    if (!ctx || ctx.state === 'closed') return;
    resume(ctx);
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.frequency.setValueAtTime(480, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.8);
    osc2.stop(ctx.currentTime + 1.8);
    activeOscillators = [osc1, osc2];
  };

  const stop = () => {
    if (interval) clearInterval(interval);
    interval = null;
    silenceActive(); // el contexto se conserva: ya está desbloqueado para la próxima llamada
  };

  return {
    // Debe llamarse dentro de un toque del usuario.
    prepare() {
      try {
        // Safari reciente: trata el sonido como reproducción, para que no lo calle el modo silencio.
        if (navigator.audioSession) navigator.audioSession.type = 'playback';
      } catch {
        /* API no disponible */
      }
      try {
        const context = ensureContext();
        if (!context) return;
        resume(context);
        // Un sonido vacío dentro del toque termina de desbloquear el audio en iOS.
        const source = context.createBufferSource();
        source.buffer = context.createBuffer(1, 1, 22050);
        source.connect(context.destination);
        source.start(0);
      } catch (e) {
        console.log('No se pudo preparar el audio', e);
      }
    },

    start() {
      stop();
      try {
        const context = ensureContext();
        if (!context) return;
        resume(context);
        beep();
        interval = setInterval(beep, 3000);
      } catch (e) {
        console.log('Audio no disponible o bloqueado por el navegador', e);
      }
    },

    stop,
  };
}
