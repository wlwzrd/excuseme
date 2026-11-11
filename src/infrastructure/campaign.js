// Canal por el que llegó el visitante, leído de las etiquetas UTM del enlace (RF-21).
// "?utm_source=whatsapp&utm_medium=story" -> "whatsapp/story"
export function channelFromQuery(search) {
  const clean = (value) => (value || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
  const params = new URLSearchParams(search || '');
  const source = clean(params.get('utm_source'));
  const medium = clean(params.get('utm_medium'));
  if (!source) return 'sin_etiqueta';
  return medium ? `${source}/${medium}` : source;
}
