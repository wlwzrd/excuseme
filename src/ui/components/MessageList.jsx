import React, { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCheck } from 'lucide-react';
import { CallStatus } from '../../domain/call.js';
import RatingCard from './RatingCard.jsx';
import ScenarioMenu from './ScenarioMenu.jsx';

const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function MessageList({ messages, call, onSelectScenario, onRate }) {
  const endRef = useRef(null);
  const countdown = call.status === CallStatus.COUNTDOWN ? call.secondsLeft : null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, countdown]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
          <div
            className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm whitespace-pre-line leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-emerald-700 text-white rounded-tr-none'
                : 'bg-slate-800 border border-slate-700/60 text-slate-200 rounded-tl-none'
            }`}
          >
            {msg.text}
            <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-400">
              <span>{formatTime(msg.at)}</span>
              {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-300" />}
            </div>
          </div>
          {msg.rating && <RatingCard rating={msg.rating} onRate={(value) => onRate(msg.id, value)} />}
          {msg.showOptions && <ScenarioMenu onSelect={onSelectScenario} />}
        </div>
      ))}

      {countdown !== null && (
        <div className="flex items-center justify-center p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs animate-pulse space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Llamada entrante en {countdown} segundos... ¡Prepara tu excusa!</span>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
