import { Sparkles, ThumbsUp, Check } from 'lucide-react';

const MATCH_LEVELS = {
  best: {
    label: 'Best Match',
    bg: 'bg-gradient-to-r from-rose-500 to-amber-500 text-white',
    Icon: Sparkles,
  },
  great: {
    label: 'Great Match',
    bg: 'bg-rose-100 text-rose-700',
    Icon: ThumbsUp,
  },
  good: {
    label: 'Good Match',
    bg: 'bg-emerald-100 text-emerald-700',
    Icon: Check,
  },
};

export default function MatchBadge({ level = 'good', score, className = '' }) {
  const m = MATCH_LEVELS[level] || MATCH_LEVELS.good;
  const { Icon } = m;

  return (
    <span
      id={`match-badge-${level}`}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${m.bg} ${className}`}
    >
      <Icon size={10} />
      {m.label}
      {score != null && <span className="ml-0.5 opacity-80">{score}%</span>}
    </span>
  );
}
