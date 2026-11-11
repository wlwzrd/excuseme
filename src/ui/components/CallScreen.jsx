import React from 'react';
import { Phone, PhoneIncoming, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { CallStatus, formatTimer } from '../../domain/call.js';

const WAVE_HEIGHTS = [40, 75, 30, 90, 60, 100, 45, 80, 35];

export default function CallScreen({ call, isSpeaking, onAnswer, onReject, onHangUp, onToggleMute }) {
  const { scenario, muted } = call;
  const ringing = call.status === CallStatus.RINGING;

  return (
    <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-8 animate-fade-in">
      <div className="text-center pt-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 mb-6">
          <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>WhatsApp Audio</span>
        </div>

        <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-white shadow-2xl mb-4 relative">
          {scenario.callerName[0]}
          {ringing && (
            <span className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-75"></span>
          )}
        </div>

        <h2 className="text-2xl font-bold text-slate-100">{scenario.callerName}</h2>
        <p className="text-sm text-slate-400 mt-1">{scenario.callerNumber}</p>

        <div className="mt-4 text-sm font-medium">
          {ringing ? (
            <span className="text-emerald-400 animate-pulse">Llamada entrante...</span>
          ) : (
            <span className="text-emerald-400">{formatTimer(call.duration)}</span>
          )}
        </div>
      </div>

      {!ringing && (
        <div className="flex items-center justify-center space-x-1.5 py-8">
          {WAVE_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full bg-emerald-500 transition-all duration-300 ${
                isSpeaking && !muted ? 'animate-bounce' : 'h-3 opacity-40'
              }`}
              style={{ height: isSpeaking && !muted ? `${h}%` : '12px', animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      <div className="pb-8">
        {ringing ? (
          <div className="flex items-center justify-around">
            <button onClick={onReject} className="flex flex-col items-center space-y-2 group">
              <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition transform group-active:scale-95">
                <PhoneOff className="w-7 h-7" />
              </div>
              <span className="text-xs text-slate-400">Rechazar</span>
            </button>

            <button onClick={onAnswer} className="flex flex-col items-center space-y-2 group">
              <div className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white shadow-lg transition transform group-active:scale-95 animate-bounce">
                <Phone className="w-7 h-7" />
              </div>
              <span className="text-xs text-slate-400">Contestar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-around">
            <button
              onClick={onToggleMute}
              aria-label={muted ? 'Reanudar voz' : 'Silenciar voz'}
              className={`p-4 rounded-full border transition ${
                muted
                  ? 'bg-slate-800 border-amber-500 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            <button
              onClick={onHangUp}
              aria-label="Colgar"
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition transform active:scale-95"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
