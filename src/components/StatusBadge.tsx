import { CropMetrics, ViewMode } from '../types/presets';
import { useI18n } from '../i18n';

interface StatusBadgeProps {
  metrics: CropMetrics;
  viewMode: ViewMode;
}

export function StatusBadge({ metrics, viewMode }: StatusBadgeProps) {
  const { t } = useI18n();

  if (metrics.fitType === 'exact') {
    return (
      <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-mono tracking-tight font-medium bg-[var(--paper-surface)] text-[var(--ink)] border border-[var(--rule)] shrink-0">
        <span className="w-1.5 h-1.5 bg-emerald-500 shrink-0" />
        <span className="tabular-nums compact-hide">{t.status.passFull}</span>
        <span className="tabular-nums compact-show">{t.status.passShort}</span>
      </span>
    );
  }

  if (viewMode === 'fit') {
    const barsPercent = metrics.pillarboxPercent || metrics.letterboxPercent;
    return (
      <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-mono tracking-tight font-medium bg-[var(--paper-surface)] text-[var(--ink-muted)] border border-[var(--rule)] shrink-0">
        <span className="w-1.5 h-1.5 bg-[var(--ink-muted)] shrink-0" />
        <span className="tabular-nums compact-hide">{t.status.barsFull(barsPercent)}</span>
        <span className="tabular-nums compact-show">{t.status.barsShort(barsPercent)}</span>
      </span>
    );
  }

  // Crop / Inspect mode
  const isCritical = metrics.severity === 'critical';

  return (
    <span
      className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-mono tracking-tight font-medium border shrink-0 ${
        isCritical
          ? 'bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent)]'
          : 'bg-[var(--paper-surface)] text-[var(--ink)] border-[var(--rule)]'
      }`}
      title={metrics.summary}
    >
      <span
        className={`w-1.5 h-1.5 shrink-0 ${
          isCritical ? 'bg-[var(--accent)]' : 'bg-amber-500'
        }`}
      />
      <span className="tabular-nums compact-hide">{t.status.cropFull(metrics.cropLossPercent)}</span>
      <span className="tabular-nums compact-show">{t.status.cropShort(metrics.cropLossPercent)}</span>
    </span>
  );
}
