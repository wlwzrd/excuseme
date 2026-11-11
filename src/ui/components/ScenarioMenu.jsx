import React from 'react';
import { SCENARIOS } from '../../domain/scenarios.js';
import { styleFor } from '../scenarioStyles.js';

export default function ScenarioMenu({ onSelect }) {
  return (
    <div className="w-full mt-3 space-y-2.5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
        Selecciona una excusa:
      </p>
      <div className="grid grid-cols-1 gap-2">
        {SCENARIOS.map((scenario) => {
          const { icon: Icon, color } = styleFor(scenario.id);
          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario.id)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 transition text-left group shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${color} text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100 text-sm group-hover:text-emerald-400 transition">
                    {scenario.title}
                  </div>
                  <div className="text-xs text-slate-400">{scenario.subtitle}</div>
                </div>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 group-hover:bg-emerald-950 group-hover:text-emerald-400 transition border border-slate-700/50">
                Llamar
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
