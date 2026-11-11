// Presentación de cada escenario (icono y color). Es asunto de la interfaz, no del dominio.
import { Briefcase, Sparkles, Users } from 'lucide-react';

const STYLES = {
  familia: { icon: Users, color: 'from-amber-500 to-orange-600' },
  empresa: { icon: Briefcase, color: 'from-blue-600 to-indigo-700' },
  random: { icon: Sparkles, color: 'from-purple-600 to-pink-600' },
};

const FALLBACK = { icon: Sparkles, color: 'from-slate-600 to-slate-700' };

export const styleFor = (scenarioId) => STYLES[scenarioId] ?? FALLBACK;
