// Adaptador de VisitorStore: recuerda al visitante de forma anónima en localStorage (RF-18).
// Guarda un identificador aleatorio y los días en que contestó llamadas. Nada de esto
// identifica a una persona ni sale del navegador (RNF-12). Si localStorage no está
// disponible, la app funciona igual, solo que sin memoria entre visitas.
const KEY = 'excuseme:visitante';
const MAX_DAYS = 90;

export function dayKey(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function randomId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function createLocalVisitorStore(storage = safeLocalStorage()) {
  let memory = null;

  const read = () => {
    try {
      const raw = storage?.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && typeof data.id === 'string' && Array.isArray(data.days)) return data;
      }
    } catch {
      /* dato ilegible: se trata como visitante nuevo */
    }
    return memory;
  };

  const write = (data) => {
    memory = data;
    try {
      storage?.setItem(KEY, JSON.stringify(data));
    } catch {
      /* sin almacenamiento: queda solo en memoria */
    }
  };

  return {
    registerVisit() {
      const existing = read();
      if (existing) return { isFirstVisit: false };
      write({ id: randomId(), days: [] });
      return { isFirstVisit: true };
    },

    registerAnsweredCall(date) {
      const data = read() ?? { id: randomId(), days: [] };
      const today = dayKey(date);
      const days = data.days.includes(today) ? data.days : [...data.days, today].slice(-MAX_DAYS);
      write({ ...data, days });
      return days.length;
    },
  };
}

function safeLocalStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}
