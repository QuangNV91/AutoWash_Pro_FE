import { Clock, Star, CheckCircle2 } from 'lucide-react';

// Màu theme cho từng gói dịch vụ
const THEME_STYLES = {
  cyan: {
    badge: 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300',
    selected: 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    accent: 'text-cyan-400',
    check: 'text-cyan-400',
    dot: 'bg-cyan-400',
  },
  purple: {
    badge: 'bg-purple-500/20 border border-purple-500/40 text-purple-300',
    selected: 'border-purple-400 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.25)]',
    hover: 'hover:border-purple-500/50 hover:bg-purple-500/5 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    accent: 'text-purple-400',
    check: 'text-purple-400',
    dot: 'bg-purple-400',
  },
  emerald: {
    badge: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300',
    selected: 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    accent: 'text-emerald-400',
    check: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  amber: {
    badge: 'bg-amber-500/20 border border-amber-500/40 text-amber-300',
    selected: 'border-amber-400 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    hover: 'hover:border-amber-500/50 hover:bg-amber-500/5 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    accent: 'text-amber-400',
    check: 'text-amber-400',
    dot: 'bg-amber-400',
  },
};

export default function ServiceCard({ service, isSelected, onSelect, compact = false }) {
  const price = service.basePrice ?? service.base_price ?? service.price;
  const duration = service.durationMinutes ?? service.duration_minutes ?? service.duration;
  const points = service.basePoints ?? service.base_points ?? service.points;
  const theme = THEME_STYLES[service.themeColor] ?? THEME_STYLES.cyan;

  return (
    <div
      onClick={() => onSelect(service)}
      className={`cursor-pointer rounded-2xl transition-all duration-300 border relative overflow-hidden group
        ${compact ? 'p-4' : 'p-6'}
        ${isSelected
          ? `border-2 ${theme.selected}`
          : `border-white/10 bg-white/5 ${theme.hover}`
        }
      `}
    >
      {/* Glow corner khi selected */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-24 h-24 opacity-40 pointer-events-none"
          style={{ background: `radial-gradient(circle at top right, ${getGlowColor(service.themeColor)}, transparent 70%)` }}
        />
      )}

      {/* Badge gói */}
      {service.badge && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-3 ${theme.badge}`}>
          {service.badge}
        </span>
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <div className={`absolute top-3 right-3 ${theme.check}`}>
          <CheckCircle2 size={18} />
        </div>
      )}

      <h3 className={`font-hero font-medium text-white ${compact ? 'text-base mb-1' : 'text-xl mb-2'} tracking-tight pr-6`}>
        {service.name}
      </h3>

      <div className={`flex items-baseline gap-1 ${compact ? 'mb-3' : 'mb-4'}`}>
        <span className={`font-medium ${compact ? 'text-xl' : 'text-3xl'} text-white`}>
          {price.toLocaleString('vi-VN')}
        </span>
        <span className="text-white/40 text-sm">đ</span>
      </div>

      <div className={`flex items-center gap-4 text-sm text-white/60 ${compact ? 'mb-3' : 'mb-6'}`}>
        <span className="flex items-center gap-1.5">
          <Clock size={compact ? 13 : 15} />
          {duration} phút
        </span>
        <span className={`flex items-center gap-1.5 ${theme.accent}`}>
          <Star size={compact ? 13 : 15} />
          +{points} điểm
        </span>
      </div>

      {/* Features list — full mode */}
      {!compact && service.features && (
        <div className="border-t border-white/10 pt-4">
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-white/70">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${theme.dot}`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feature count — compact mode */}
      {compact && service.features && (
        <div className="border-t border-white/10 pt-3">
          <p className={`text-xs ${theme.accent} font-medium`}>
            {service.features.length} tính năng bao gồm
          </p>
        </div>
      )}
    </div>
  );
}

function getGlowColor(themeColor) {
  const map = {
    cyan: 'rgba(6,182,212,0.4)',
    purple: 'rgba(168,85,247,0.4)',
    emerald: 'rgba(16,185,129,0.4)',
    amber: 'rgba(245,158,11,0.4)',
  };
  return map[themeColor] ?? map.cyan;
}
