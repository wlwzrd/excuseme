import React from 'react';
import { MoreVertical, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-lg shadow-md">
            E
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <h1 className="font-semibold text-slate-100 text-base leading-tight">ExcuseMe</h1>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-emerald-400 font-medium">en línea (Servicio de Excusas)</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-slate-400">
        <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white transition" />
      </div>
    </header>
  );
}
