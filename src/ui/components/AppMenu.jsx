import React, { useEffect, useRef, useState } from 'react';
import { FileText, Info, Menu, Share2, Shield } from 'lucide-react';

const ITEMS = [
  { id: 'share', label: 'Compartir', icon: Share2 },
  { id: 'about', label: 'Acerca de', icon: Info },
  { id: 'privacy', label: 'Privacidad y cookies', icon: Shield },
  { id: 'terms', label: 'Términos y condiciones', icon: FileText },
];

// Menú principal. Se puede usar con teclado: Enter o Espacio lo abre, las flechas
// recorren las opciones y Escape lo cierra.
export default function AppMenu({ onShare, onOpenPage }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus();
  }, [open]);

  const close = ({ restoreFocus = true } = {}) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  };

  const choose = (id) => {
    close({ restoreFocus: id === 'share' });
    if (id === 'share') onShare();
    else onOpenPage(id);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    const index = itemRefs.current.indexOf(document.activeElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      itemRefs.current[(index + 1) % ITEMS.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      itemRefs.current[(index - 1 + ITEMS.length) % ITEMS.length]?.focus();
    }
  };

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((value) => !value)}
        aria-label="Menú"
        aria-haspopup="menu"
        aria-expanded={open}
        className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" aria-hidden="true" onClick={() => close({ restoreFocus: false })} />
          <ul
            role="menu"
            aria-label="Menú principal"
            className="absolute right-0 top-10 z-40 w-60 py-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl"
          >
            {ITEMS.map(({ id, label, icon: Icon }, i) => (
              <li key={id} role="none">
                <button
                  ref={(el) => (itemRefs.current[i] = el)}
                  role="menuitem"
                  onClick={() => choose(id)}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 focus:bg-slate-800 transition text-left"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
