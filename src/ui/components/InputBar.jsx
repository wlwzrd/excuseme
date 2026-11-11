import React from 'react';
import { Mic, Send } from 'lucide-react';

export default function InputBar() {
  return (
    <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2 text-xs text-slate-500 flex items-center justify-between">
        <span>Selecciona una opción del menú de arriba...</span>
        <Mic className="w-4 h-4 text-slate-600" />
      </div>
      <button disabled className="p-2.5 rounded-full bg-slate-800 text-slate-600 cursor-not-allowed">
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
