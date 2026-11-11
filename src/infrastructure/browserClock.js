// Adaptador de Clock: reloj y temporizadores del navegador.
export function createBrowserClock() {
  return {
    now: () => new Date(),
    every(ms, fn) {
      const id = setInterval(fn, ms);
      return () => clearInterval(id);
    },
  };
}
