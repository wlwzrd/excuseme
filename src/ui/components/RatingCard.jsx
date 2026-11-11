import React from 'react';
import { RATING_VALUES } from '../../domain/chat.js';

// Calificación "¿Te funcionó?" (RF-16): un toque, sin escribir, y se puede ignorar.
export default function RatingCard({ rating, onRate }) {
  if (rating.value !== null) {
    return (
      <p className="mt-2 px-1 text-xs text-emerald-400">Gracias por tu calificación: {rating.value}/5</p>
    );
  }
  return (
    <div className="w-full mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
      <p className="text-xs font-semibold text-slate-300 mb-2">¿Te funcionó la excusa?</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400">Nada</span>
        <div className="flex space-x-1.5">
          {RATING_VALUES.map((value) => (
            <button
              key={value}
              onClick={() => onRate(value)}
              aria-label={`Calificar con ${value} de 5`}
              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white transition"
            >
              {value}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-slate-400">Perfecto</span>
      </div>
    </div>
  );
}
