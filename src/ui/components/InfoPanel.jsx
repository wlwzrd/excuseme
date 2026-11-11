import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

// Panel a pantalla completa para las páginas informativas. Se cierra con el botón o con Escape.
export default function InfoPanel({ title, onClose, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-panel-title"
      className="absolute inset-0 z-40 bg-slate-950 flex flex-col"
    >
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-3 flex items-center space-x-2">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Volver al chat"
          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 id="info-panel-title" className="font-semibold text-slate-100 text-base">
          {title}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
    </div>
  );
}
