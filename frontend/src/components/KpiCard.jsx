import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Sparkles } from 'lucide-react';

export default function KpiCard({
  title,
  subtitle,
  value,
  unit,
  anomaly,
  anomalyLabel = "vs Climatology",
  isPositiveGood = true,
  icon: Icon,
  accentColor = "cyan",
  badge,
  footerNote
}) {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'cyan':
        return {
          glow: 'shadow-glow-cyan',
          border: 'border-cyan-500/30 hover:border-cyan-500/60',
          bgIcon: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
        };
      case 'amber':
        return {
          glow: 'shadow-glow-amber',
          border: 'border-amber-500/30 hover:border-amber-500/60',
          bgIcon: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        };
      case 'blue':
        return {
          glow: 'shadow-glow-blue',
          border: 'border-blue-500/30 hover:border-blue-500/60',
          bgIcon: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30'
        };
      case 'emerald':
        return {
          glow: 'shadow-emerald-500/20',
          border: 'border-emerald-500/30 hover:border-emerald-500/60',
          bgIcon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        };
      case 'purple':
      default:
        return {
          glow: 'shadow-purple-500/20',
          border: 'border-purple-500/30 hover:border-purple-500/60',
          bgIcon: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
        };
    }
  };

  const styles = getAccentStyles();
  const isUp = anomaly && anomaly.startsWith('+');
  const isDown = anomaly && anomaly.startsWith('-');

  return (
    <div className={`bg-space-900/90 rounded-2xl p-5 border ${styles.border} transition-all duration-300 hover:-translate-y-0.5 ${styles.glow} flex flex-col justify-between relative overflow-hidden backdrop-blur-sm group`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none"></div>

      <div>
        {/* Top header row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={`p-2 rounded-xl border ${styles.bgIcon}`}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">{title}</span>
              {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
            </div>
          </div>
          {badge && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {badge}
            </span>
          )}
        </div>

        {/* Main Metric Value */}
        <div className="flex items-baseline gap-2 my-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            {value}
          </span>
          {unit && <span className="text-sm font-semibold text-cyan-400/80">{unit}</span>}
        </div>
      </div>

      {/* Bottom context / Anomaly */}
      <div className="pt-3 border-t border-space-800/80 flex items-center justify-between text-xs mt-1">
        {anomaly ? (
          <div className="flex items-center gap-1.5 font-mono">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
              isUp 
                ? (isPositiveGood ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10')
                : isDown 
                ? (isPositiveGood ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10')
                : 'text-slate-400 bg-slate-800'
            }`}>
              {isUp && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
              {isDown && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {!isUp && !isDown && <Minus className="w-3 h-3 mr-0.5" />}
              {anomaly}
            </span>
            <span className="text-[11px] text-slate-400">{anomalyLabel}</span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Baseline Synchronized</span>
        )}

        {footerNote && (
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            {footerNote}
          </span>
        )}
      </div>
    </div>
  );
}

