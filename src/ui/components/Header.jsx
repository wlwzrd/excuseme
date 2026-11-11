import React from 'react';
import { ShieldCheck } from 'lucide-react';
import AppMenu from './AppMenu.jsx';

export default function Header({ onShare, onOpenPage }) {
  return (
    <header className="relative z-20 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
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
      <AppMenu onShare={onShare} onOpenPage={onOpenPage} />
    </header>
  );
}
