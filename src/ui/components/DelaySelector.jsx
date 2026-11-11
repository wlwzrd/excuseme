import React from 'react';
import { Clock } from 'lucide-react';
import { DELAY_OPTIONS } from '../../domain/call.js';

export default function DelaySelector({ delay, onChange }) {
  return (
    <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
      <div className="flex items-center space-x-1.5 text-slate-400">
        <Clock className="w-4 h-4 text-emerald-400" />
        <span>Retardo de llamada:</span>
      </div>
      <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 space-x-1">
        {DELAY_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              delay === s ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s === 0 ? 'Ahora' : `${s}s`}
          </button>
        ))}
      </div>
    </div>
  );
}
