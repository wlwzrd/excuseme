import React from 'react';
import { Mic, Send } from 'lucide-react';

export default function InputBar() {
  return (
    <div className="bg-slate-900 border-t border-slate-800">
    <div className="p-3 flex items-center space-x-2">
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2 text-xs text-slate-500 flex items-center justify-between">
        <span>Selecciona una opción del menú de arriba...</span>
        <Mic className="w-4 h-4 text-slate-600" />
      </div>
      <button disabled className="p-2.5 rounded-full bg-slate-800 text-slate-600 cursor-not-allowed">
        <Send className="w-4 h-4" />
      </button>
    </div>
    {/* Aviso de medición (RNF-13) */}
    <p className="px-4 pb-2 text-center text-[10px] leading-tight text-slate-500">
      Medimos el uso de forma anónima con Google Analytics para mejorar ExcuseMe. No guardamos nombres ni teléfonos.
    </p>
    </div>
  );
}
