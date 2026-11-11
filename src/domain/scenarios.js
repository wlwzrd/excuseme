// Catálogo de excusas. Datos puros: sin iconos, colores ni nada de la interfaz.
export const SCENARIOS = Object.freeze([
  Object.freeze({
    id: 'familia',
    title: 'Familia',
    subtitle: 'Emergencia Doméstica',
    callerName: 'Mamá (Urgente)',
    callerNumber: '+57 300 987 6543',
    script:
      '¡Hola! Necesito que vengas a la casa inmediatamente. Ocurrió una fuga de agua en la cocina y se está inundando todo. Por favor cancela lo que estés haciendo y ven ya mismo.',
    chatPrompt: 'Escogiste opción: Familia. Preparando llamada de emergencia familiar...',
  }),
  Object.freeze({
    id: 'empresa',
    title: 'Empresa',
    subtitle: 'Crisis Laboral',
    callerName: 'Jefe / Operaciones',
    callerNumber: '+57 315 456 7890',
    script:
      'Buenas tardes. Disculpa interrumpir, pero se acaba de caer el servidor principal de la empresa y los clientes clave están llamando. Necesitamos tu acceso de administrador urgentemente en línea.',
    chatPrompt: 'Escogiste opción: Empresa. Preparando llamada de crisis corporativa...',
  }),
  Object.freeze({
    id: 'random',
    title: 'Random',
    subtitle: 'Situación Inesperada',
    callerName: 'Vecino / Portería',
    callerNumber: '+57 320 111 2233',
    script:
      '¡Hola! Qué pena molestarte a esta hora, pero dejaste las luces del auto encendidas en el parqueadero y parece que la alarma se activó. Tienes que bajar a revisarlo antes de que se agote la batería.',
    chatPrompt: 'Escogiste opción: Random. Preparando llamada de imprevisto...',
  }),
]);

export function findScenario(id) {
  const scenario = SCENARIOS.find((s) => s.id === id);
  if (!scenario) throw new Error(`Escenario desconocido: ${id}`);
  return scenario;
}
