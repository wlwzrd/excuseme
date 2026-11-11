// Adaptador de Sharer: menú de compartir del dispositivo o, si no existe, copiar el enlace.
export function createWebSharer({ url, title, text }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'unavailable';
    }
  };

  return {
    async share() {
      if (typeof navigator === 'undefined') return 'unavailable';
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ title, text, url });
          return 'shared';
        } catch (e) {
          if (e?.name === 'AbortError') return 'cancelled';
        }
      }
      return copy();
    },
  };
}
