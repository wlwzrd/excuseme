// Adaptador de VoiceSpeaker: voz sintetizada con la Web Speech API.
function pickSpanishVoice(voices) {
  return (
    voices.find((v) => v.lang === 'es-CO') ||
    voices.find((v) => v.lang.startsWith('es-4') || v.lang === 'es-MX' || v.lang === 'es-US') ||
    voices.find((v) => v.lang.startsWith('es'))
  );
}

export function createWebSpeechVoice() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  return {
    speak(text, { onStart, onEnd }) {
      if (!synth) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = onStart;
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
      const voice = pickSpanishVoice(synth.getVoices());
      if (voice) utterance.voice = voice;
      synth.speak(utterance);
    },
    pause: () => synth?.pause(),
    resume: () => synth?.resume(),
    cancel: () => synth?.cancel(),
  };
}
