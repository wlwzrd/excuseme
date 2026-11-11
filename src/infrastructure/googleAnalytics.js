// Adaptador de Analytics: Google Analytics 4.
// No mide en desarrollo local ni al abrir el archivo directamente, para no
// contaminar los datos, y nunca lanza errores hacia la app (RNF-14).
const LOCAL_HOSTS = new Set(['', 'localhost', '127.0.0.1', '[::1]']);

export function shouldMeasure(hostname) {
  return !LOCAL_HOSTS.has(hostname) && !hostname.endsWith('.localhost');
}

export function createGoogleAnalytics(measurementId) {
  let enabled = false;
  try {
    enabled = Boolean(measurementId) && typeof window !== 'undefined' && shouldMeasure(window.location.hostname);
    if (enabled) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments); // gtag espera el objeto arguments, no un arreglo
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId);
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }
  } catch {
    enabled = false;
  }

  return {
    track(event, params = {}) {
      if (!enabled) return;
      try {
        window.gtag('event', event, params);
      } catch {
        /* la analítica nunca interrumpe la app */
      }
    },
  };
}
