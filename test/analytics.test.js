import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createExcuseService } from '../src/application/excuseService.js';
import { countsAsUser } from '../src/domain/call.js';
import { channelFromQuery } from '../src/infrastructure/campaign.js';
import { shouldMeasure } from '../src/infrastructure/googleAnalytics.js';
import { createLocalVisitorStore, dayKey } from '../src/infrastructure/localVisitorStore.js';

function setup({ shareResult = 'shared', days = 1, isFirstVisit = true, analytics } = {}) {
  const events = [];
  let tickFn = null;
  let voiceHandlers = null;
  const service = createExcuseService({
    ringtone: { start() {}, stop() {} },
    vibrator: { start() {}, stop() {} },
    voice: {
      speak: (_text, handlers) => {
        voiceHandlers = handlers;
      },
      pause() {},
      resume() {},
      cancel() {},
    },
    clock: {
      now: () => new Date(2026, 0, 15, 12, 0, 0),
      every: (_ms, fn) => {
        tickFn = fn;
        return () => {
          tickFn = null;
        };
      },
    },
    analytics: analytics ?? { track: (event, params) => events.push([event, params]) },
    visitor: { registerVisit: () => ({ isFirstVisit }), registerAnsweredCall: () => days },
    sharer: { share: async () => shareResult },
    channel: 'whatsapp/story',
  });
  return {
    service,
    events,
    advance: (seconds) => {
      for (let i = 0; i < seconds; i++) tickFn?.();
    },
    voice: () => voiceHandlers,
  };
}

const answeredCall = (ctx, scenario = 'empresa') => {
  ctx.service.setDelay(0);
  ctx.service.selectScenario(scenario);
  ctx.service.answer();
};

test('al abrir registra la visita con el canal y si es la primera', () => {
  const { service, events } = setup();
  service.start();
  assert.deepEqual(events, [['visita', { primera_visita: true, canal: 'whatsapp/story' }]]);
});

test('elegir una excusa registra el tipo y el retardo (RF-13, RF-14)', () => {
  const { service, events } = setup();
  service.setDelay(10);
  service.selectScenario('familia');
  assert.deepEqual(events, [['excusa_elegida', { tipo: 'familia', retardo: 10 }]]);
});

test('contestar registra el día de uso del visitante (RF-19)', () => {
  const ctx = setup({ days: 2 });
  answeredCall(ctx);
  assert.deepEqual(ctx.events.at(-1), ['llamada_contestada', { tipo: 'empresa', dia_de_uso: 2 }]);
});

test('colgar registra duración, longitud del guion y si cuenta como usuario', () => {
  const ctx = setup();
  answeredCall(ctx);
  ctx.advance(12);
  ctx.service.hangUp();
  const [name, params] = ctx.events.at(-1);
  assert.equal(name, 'llamada_colgada');
  assert.equal(params.tipo, 'empresa');
  assert.equal(params.duracion, 12);
  assert.equal(params.valida, true);
  assert.equal(params.guion_completo, false);
  assert.ok(params.longitud_guion > 50);
});

test('una llamada de menos de 10 segundos no cuenta como usuario', () => {
  const ctx = setup();
  answeredCall(ctx);
  ctx.advance(9);
  ctx.service.hangUp();
  assert.equal(ctx.events.at(-1)[1].valida, false);
  assert.equal(countsAsUser(9), false);
  assert.equal(countsAsUser(10), true);
});

test('marca el guion como completo solo si la voz terminó de leerlo', () => {
  const ctx = setup();
  answeredCall(ctx);
  ctx.voice().onEnd({ completed: true });
  ctx.advance(15);
  ctx.service.hangUp();
  assert.equal(ctx.events.at(-1)[1].guion_completo, true);

  const interrupted = setup();
  answeredCall(interrupted);
  interrupted.voice().onEnd({ completed: false });
  interrupted.service.hangUp();
  assert.equal(interrupted.events.at(-1)[1].guion_completo, false);
});

test('rechazar registra llamada_rechazada y no pide calificación', () => {
  const { service, events } = setup();
  service.setDelay(0);
  service.selectScenario('random');
  service.reject();
  assert.deepEqual(events.at(-1), ['llamada_rechazada', { tipo: 'random' }]);
  assert.equal(service.getState().messages.at(-1).rating, undefined);
});

test('al colgar pide la calificación y la registra una sola vez (RF-16)', () => {
  const ctx = setup();
  answeredCall(ctx, 'familia');
  ctx.service.hangUp();
  const message = ctx.service.getState().messages.at(-1);
  assert.deepEqual(message.rating, { scenarioId: 'familia', value: null });

  ctx.service.rate(message.id, 4);
  ctx.service.rate(message.id, 1); // un segundo toque se ignora
  assert.equal(ctx.service.getState().messages.at(-1).rating.value, 4);
  const ratings = ctx.events.filter(([name]) => name === 'calificacion');
  assert.deepEqual(ratings, [['calificacion', { valor: 4, tipo: 'familia' }]]);
});

test('rechaza calificaciones fuera de 1 a 5 e ignora mensajes sin calificación', () => {
  const ctx = setup();
  answeredCall(ctx);
  ctx.service.hangUp();
  const { id } = ctx.service.getState().messages.at(-1);
  assert.throws(() => ctx.service.rate(id, 6));
  assert.throws(() => ctx.service.rate(id, 0));
  ctx.service.rate(1, 5); // el mensaje de bienvenida no se califica
  assert.equal(ctx.events.filter(([name]) => name === 'calificacion').length, 0);
});

test('compartir registra el evento y avisa en el chat si copió el enlace (RF-20)', async () => {
  const shared = setup({ shareResult: 'shared' });
  await shared.service.share();
  assert.deepEqual(shared.events, [['compartir', undefined]]);
  assert.equal(shared.service.getState().messages.length, 1);

  const copied = setup({ shareResult: 'copied' });
  await copied.service.share();
  assert.match(copied.service.getState().messages.at(-1).text, /Enlace copiado/);
});

test('si la analítica falla, la app sigue funcionando (RNF-14)', () => {
  const ctx = setup({
    analytics: {
      track() {
        throw new Error('bloqueado');
      },
    },
  });
  ctx.service.start();
  answeredCall(ctx);
  ctx.service.hangUp();
  assert.equal(ctx.service.getState().call.status, 'idle');
});

test('ningún evento lleva el texto del guion ni datos personales (RNF-10)', () => {
  const ctx = setup();
  ctx.service.start();
  answeredCall(ctx);
  ctx.advance(11);
  ctx.service.hangUp();
  const allowed = new Set([
    'primera_visita', 'canal', 'tipo', 'retardo', 'dia_de_uso',
    'duracion', 'longitud_guion', 'guion_completo', 'valida', 'valor',
  ]);
  for (const [, params] of ctx.events) {
    for (const [key, value] of Object.entries(params ?? {})) {
      assert.ok(allowed.has(key), `parámetro inesperado: ${key}`);
      assert.ok(String(value).length <= 40, `valor demasiado largo en ${key}`);
    }
  }
});

test('el canal sale de las etiquetas UTM del enlace (RF-21)', () => {
  assert.equal(channelFromQuery('?utm_source=whatsapp&utm_medium=story'), 'whatsapp/story');
  assert.equal(channelFromQuery('?utm_source=whatsapp&utm_medium=directo'), 'whatsapp/directo');
  assert.equal(channelFromQuery('?utm_source=instagram&utm_medium=story'), 'instagram/story');
  assert.equal(channelFromQuery('?utm_source=compartir&utm_medium=boton'), 'compartir/boton');
  assert.equal(channelFromQuery('?utm_source=Instagram'), 'instagram');
  assert.equal(channelFromQuery(''), 'sin_etiqueta');
  assert.equal(channelFromQuery('?utm_source=<script>'), 'script');
});

test('no se mide en desarrollo local', () => {
  assert.equal(shouldMeasure('wlwzrd.github.io'), true);
  assert.equal(shouldMeasure('localhost'), false);
  assert.equal(shouldMeasure('127.0.0.1'), false);
  assert.equal(shouldMeasure(''), false);
});

test('el visitante se recuerda de forma anónima y cuenta días distintos (RF-18)', () => {
  const data = new Map();
  const storage = { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
  const store = createLocalVisitorStore(storage);
  assert.equal(store.registerVisit().isFirstVisit, true);
  assert.equal(store.registerVisit().isFirstVisit, false);
  assert.equal(store.registerAnsweredCall(new Date(2026, 0, 15, 9)), 1);
  assert.equal(store.registerAnsweredCall(new Date(2026, 0, 15, 22)), 1); // mismo día
  assert.equal(store.registerAnsweredCall(new Date(2026, 0, 16, 8)), 2);
  assert.equal(createLocalVisitorStore(storage).registerVisit().isFirstVisit, false); // otra sesión
  assert.equal(dayKey(new Date(2026, 0, 5)), '2026-01-05');
});

test('sin almacenamiento disponible, el visitante funciona en memoria', () => {
  const broken = {
    getItem() {
      throw new Error('bloqueado');
    },
    setItem() {
      throw new Error('bloqueado');
    },
  };
  const store = createLocalVisitorStore(broken);
  assert.equal(store.registerVisit().isFirstVisit, true);
  assert.equal(store.registerAnsweredCall(new Date(2026, 0, 15)), 1);
  assert.equal(store.registerAnsweredCall(new Date(2026, 0, 16)), 2);
});
