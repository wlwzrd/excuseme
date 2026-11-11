import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createExcuseService } from '../src/application/excuseService.js';

// Adaptadores falsos: registran lo que la aplicación les pide, sin navegador.
function setup() {
  const log = [];
  let tickFn = null;
  let voiceHandlers = null;
  const service = createExcuseService({
    ringtone: { start: () => log.push('ring:start'), stop: () => log.push('ring:stop') },
    vibrator: { start: () => log.push('vib:start'), stop: () => log.push('vib:stop') },
    voice: {
      speak: (text, handlers) => {
        log.push(`voice:speak:${text.slice(0, 12)}`);
        voiceHandlers = handlers;
      },
      pause: () => log.push('voice:pause'),
      resume: () => log.push('voice:resume'),
      cancel: () => log.push('voice:cancel'),
    },
    clock: {
      now: () => new Date('2026-01-01T12:00:00Z'),
      every: (_ms, fn) => {
        tickFn = fn;
        return () => {
          tickFn = null;
        };
      },
    },
  });
  return {
    service,
    log,
    advance: (seconds) => {
      for (let i = 0; i < seconds; i++) tickFn?.();
    },
    tickerRunning: () => tickFn !== null,
    voice: () => voiceHandlers,
  };
}

const lastMessage = (service) => service.getState().messages.at(-1);

test('arranca con el mensaje de bienvenida y retardo de 5 s', () => {
  const { service } = setup();
  const state = service.getState();
  assert.equal(state.delay, 5);
  assert.equal(state.messages.length, 1);
  assert.equal(state.messages[0].showOptions, true);
  assert.equal(state.call.status, 'idle');
});

test('con retardo "Ahora" suena y vibra de inmediato', () => {
  const { service, log } = setup();
  service.setDelay(0);
  service.selectScenario('empresa');
  assert.equal(service.getState().call.status, 'ringing');
  assert.deepEqual(log, ['ring:start', 'vib:start']);
});

test('con retardo, cuenta regresiva y luego suena', () => {
  const { service, log, advance, tickerRunning } = setup();
  service.selectScenario('familia');
  assert.equal(service.getState().call.status, 'countdown');
  assert.equal(service.getState().call.secondsLeft, 5);
  advance(4);
  assert.equal(service.getState().call.secondsLeft, 1);
  assert.deepEqual(log, []);
  advance(1);
  assert.equal(service.getState().call.status, 'ringing');
  assert.deepEqual(log, ['ring:start', 'vib:start']);
  assert.equal(tickerRunning(), false);
});

test('prepara el audio en el toque que elige la excusa, antes de que suene (iOS)', () => {
  const log = [];
  const service = createExcuseService({
    ringtone: { prepare: () => log.push('prepare'), start: () => log.push('start'), stop() {} },
    vibrator: { start() {}, stop() {} },
    voice: { speak() {}, pause() {}, resume() {}, cancel() {} },
    clock: { now: () => new Date(), every: () => () => {} },
  });
  service.selectScenario('familia'); // con retardo: aún no suena
  assert.deepEqual(log, ['prepare']);
});

test('elegir una excusa la registra en el chat y oculta el menú', () => {
  const { service } = setup();
  service.selectScenario('random');
  const { messages } = service.getState();
  assert.equal(messages.length, 3);
  assert.equal(messages[1].sender, 'user');
  assert.equal(messages[1].text, 'Opción seleccionada: Random');
  assert.ok(messages.every((m) => !m.showOptions));
  assert.equal(new Set(messages.map((m) => m.id)).size, 3);
});

test('contestar detiene el tono, lee el guion y cronometra', () => {
  const { service, log, advance, voice } = setup();
  service.setDelay(0);
  service.selectScenario('empresa');
  service.answer();
  assert.equal(service.getState().call.status, 'connected');
  assert.deepEqual(log.slice(2), ['ring:stop', 'vib:stop', 'voice:speak:Buenas tarde']);
  voice().onStart();
  assert.equal(service.getState().isSpeaking, true);
  advance(3);
  assert.equal(service.getState().call.duration, 3);
  voice().onEnd();
  assert.equal(service.getState().isSpeaking, false);
});

test('colgar registra la duración y vuelve a ofrecer el menú', () => {
  const { service, log, advance, tickerRunning } = setup();
  service.setDelay(0);
  service.selectScenario('empresa');
  service.answer();
  advance(75);
  service.hangUp();
  assert.equal(service.getState().call.status, 'idle');
  assert.match(lastMessage(service).text, /Llamada terminada por el usuario\. Duración: 1:15\./);
  assert.equal(lastMessage(service).showOptions, true);
  assert.equal(log.at(-1), 'voice:cancel');
  assert.equal(tickerRunning(), false);
});

test('rechazar registra la llamada con duración 0:00', () => {
  const { service } = setup();
  service.setDelay(0);
  service.selectScenario('familia');
  service.reject();
  assert.equal(service.getState().call.status, 'idle');
  assert.match(lastMessage(service).text, /Llamada rechazada\. Duración: 0:00\./);
});

test('silenciar pausa y reanuda la voz', () => {
  const { service, log } = setup();
  service.setDelay(0);
  service.selectScenario('familia');
  service.answer();
  service.toggleMute();
  assert.equal(service.getState().call.muted, true);
  service.toggleMute();
  assert.deepEqual(log.slice(-2), ['voice:pause', 'voice:resume']);
});

test('ignora acciones que no corresponden al estado actual', () => {
  const { service, log } = setup();
  service.answer();
  service.hangUp();
  service.reject();
  service.toggleMute();
  assert.equal(service.getState().messages.length, 1);
  assert.deepEqual(log, []);

  service.selectScenario('familia');
  service.selectScenario('empresa'); // ya hay una llamada programada
  assert.equal(service.getState().call.scenario.id, 'familia');
  assert.equal(service.getState().messages.length, 3);
});

test('rechaza retardos fuera de las opciones y escenarios desconocidos', () => {
  const { service } = setup();
  assert.throws(() => service.setDelay(7));
  assert.throws(() => service.selectScenario('nope'));
});

test('notifica a los suscriptores y permite desuscribirse', () => {
  const { service } = setup();
  let calls = 0;
  const unsubscribe = service.subscribe(() => calls++);
  service.setDelay(10);
  assert.equal(calls, 1);
  unsubscribe();
  service.setDelay(30);
  assert.equal(calls, 1);
});
