import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as Call from '../src/domain/call.js';
import { findScenario, SCENARIOS } from '../src/domain/scenarios.js';

const scenario = SCENARIOS[0];

test('una llamada nueva está inactiva', () => {
  assert.equal(Call.idle().status, Call.CallStatus.IDLE);
  assert.equal(Call.isActive(Call.idle()), false);
});

test('con retardo 0 la llamada suena de inmediato', () => {
  const call = Call.schedule(scenario, 0);
  assert.equal(call.status, Call.CallStatus.RINGING);
  assert.equal(call.scenario, scenario);
});

test('con retardo, cuenta regresiva y luego suena', () => {
  let call = Call.schedule(scenario, 3);
  assert.equal(call.status, Call.CallStatus.COUNTDOWN);
  assert.equal(call.secondsLeft, 3);
  call = Call.tick(call);
  assert.equal(call.secondsLeft, 2);
  call = Call.tick(Call.tick(call));
  assert.equal(call.status, Call.CallStatus.RINGING);
  assert.equal(call.secondsLeft, null);
});

test('rechaza retardos inválidos y escenarios vacíos', () => {
  assert.throws(() => Call.schedule(scenario, -1));
  assert.throws(() => Call.schedule(scenario, 1.5));
  assert.throws(() => Call.schedule(null, 5));
});

test('al contestar, la duración avanza con cada tick', () => {
  let call = Call.answer(Call.schedule(scenario, 0));
  assert.equal(call.status, Call.CallStatus.CONNECTED);
  call = Call.tick(Call.tick(call));
  assert.equal(call.duration, 2);
});

test('no se puede contestar si no está sonando', () => {
  assert.throws(() => Call.answer(Call.idle()));
  assert.throws(() => Call.answer(Call.schedule(scenario, 5)));
});

test('el tick no altera una llamada inactiva ni una que suena', () => {
  const idle = Call.idle();
  assert.equal(Call.tick(idle), idle);
  const ringing = Call.schedule(scenario, 0);
  assert.equal(Call.tick(ringing), ringing);
});

test('silenciar solo aplica a una llamada en curso', () => {
  const ringing = Call.schedule(scenario, 0);
  assert.equal(Call.toggleMute(ringing), ringing);
  const connected = Call.answer(ringing);
  assert.equal(Call.toggleMute(connected).muted, true);
  assert.equal(Call.toggleMute(Call.toggleMute(connected)).muted, false);
});

test('formatos de tiempo', () => {
  assert.equal(Call.formatDuration(0), '0:00');
  assert.equal(Call.formatDuration(75), '1:15');
  assert.equal(Call.formatTimer(5), '00:05');
  assert.equal(Call.formatTimer(605), '10:05');
});

test('findScenario encuentra por id y falla con ids desconocidos', () => {
  assert.equal(findScenario('empresa').title, 'Empresa');
  assert.throws(() => findScenario('nope'));
});
