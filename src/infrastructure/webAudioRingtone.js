// Adaptador de RingtonePlayer: tono sintetizado con la Web Audio API.
export function createWebAudioRingtone() {
  let ctx = null;
  let interval = null;

  const beep = () => {
    if (!ctx || ctx.state === 'closed') return;
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
  };

  const stop = () => {
    if (interval) clearInterval(interval);
    interval = null;
    if (ctx) {
      try {
        ctx.close();
      } catch {
        /* ya estaba cerrado */
      }
    }
    ctx = null;
  };

  return {
    start() {
      stop();
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        ctx = new AudioContext();
        beep();
        interval = setInterval(beep, 3000);
      } catch (e) {
        console.log('Audio no disponible o bloqueado por el navegador', e);
      }
    },
    stop,
  };
}
