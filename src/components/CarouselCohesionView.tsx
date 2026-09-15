import { useMemo } from 'preact/hooks';
import { Check, X, AlertCircle, Layers2 } from 'lucide-preact';
import { useApp } from '../state/AppContext';
import { useI18n } from '../i18n';
import { PLATFORM_PRESETS } from '../config/platforms';
import { calculateMetrics, formatAspectRatio } from '../utils/math';
import { PlatformIcon } from './PlatformIcon';

export function CarouselCohesionView() {
  const { mediaList, activeIndex, setActiveIndex, activePlatform, activeCategory, viewMode, focalPoint } = useApp();
  const { t } = useI18n();

  const masterRatio = mediaList[0]?.aspectRatio ?? (9 / 16);

  // Filter presets to the active platform (same as ViewportGrid)
  const filteredPresets = useMemo(() => {
    return PLATFORM_PRESETS.filter((p) => {
      if (activePlatform !== 'all' && p.platform !== activePlatform) return false;
      if (activeCategory !== 'all') {
        const catMap: Record<string, number> = { vertical: 9 / 16, portrait: 4 / 5, square: 1, landscape: 16 / 9 };
        const expected = catMap[activeCategory];
        const presetRatio = p.aspectRatio.w / p.aspectRatio.h;
        if (expected && Math.abs(presetRatio - expected) > 0.08) return false;
      }
      return true;
    });
  }, [activePlatform, activeCategory]);

  const activeMedia = mediaList[activeIndex] ?? mediaList[0];

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
        <Layers2 className="w-4 h-4 text-[var(--accent)]" />
        <h2 className="text-sm font-semibold tracking-tight text-[var(--ink)]">
          {t.carousel.title}
        </h2>
        <span className="text-[11px] font-mono px-1.5 py-0.25 bg-[var(--paper-surface)] text-[var(--ink-muted)] border border-[var(--rule)] tabular-nums">
          {t.carousel.master} {formatAspectRatio(Math.round(masterRatio * 160), 160)}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Slide health overview */}
        <div className="shrink-0 w-full md:w-36 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <span className="text-xs font-mono uppercase text-[var(--ink-muted)] hidden md:block">
            {t.carousel.slides}
          </span>
          {mediaList.map((item, idx) => {
            const ratioDiff = Math.abs(item.aspectRatio - masterRatio) / masterRatio;
            const isPass = ratioDiff < 0.015;
            const isWarn = ratioDiff < 0.1;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative border transition-all shrink-0 w-24 md:w-full text-left p-1 ${
                  idx === activeIndex
                    ? 'border-[var(--accent)] bg-[var(--paper-surface)] ring-1 ring-[var(--accent)]'
                    : 'border-[var(--rule)] bg-[var(--paper-elevated)] opacity-70 hover:opacity-100'
                }`}
                style={{ aspectRatio: `${masterRatio}` }}
                title={item.name}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <span className="text-[10px] font-mono text-white">{t.uploader.video}</span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                )}

                {/* Health Badge */}
                <div className="absolute top-1 right-1 p-0.5 bg-[var(--paper)] border border-[var(--rule)]">
                  {isPass ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : isWarn ? (
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                  ) : (
                    <X className="w-3 h-3 text-[var(--accent)]" />
                  )}
                </div>

                {idx === 0 && (
                  <div className="absolute bottom-1 left-1 text-[7px] font-mono uppercase font-bold text-white bg-[var(--accent)] px-1">
                    {t.carousel.cover}
                  </div>
                )}
                <div className="absolute bottom-1 right-1 text-[8px] font-mono text-white bg-black/80 px-1 tabular-nums">
                  0{idx + 1}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Platform cards for the active slide */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--rule)]">
            <p className="text-xs font-mono text-[var(--ink-muted)] tabular-nums">
              {t.carousel.slide(activeIndex + 1, activeMedia.naturalWidth, activeMedia.naturalHeight)}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredPresets.map((preset) => {
              const metrics = calculateMetrics(activeMedia.naturalWidth, activeMedia.naturalHeight, preset.aspectRatio);
              const isExact = metrics.fitType === 'exact';
              const isCrop = metrics.fitType === 'crop_horizontal' || metrics.fitType === 'crop_vertical';
              const barPercent = Math.max(metrics.pillarboxPercent, metrics.letterboxPercent);

              return (
                <div
                  key={preset.id}
                  className={`border overflow-hidden flex flex-col bg-[var(--paper-elevated)] ${
                    isExact
                      ? 'border-[var(--ink)]'
                      : isCrop
                      ? 'border-[var(--accent)]'
                      : 'border-[var(--rule)]'
                  }`}
                >
                  {/* Thumbnail at preset ratio */}
                  <div
                    className="relative overflow-hidden bg-black"
                    style={{ aspectRatio: `${preset.aspectRatio.w} / ${preset.aspectRatio.h}` }}
                  >
                    {activeMedia.type === 'video' ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <span className="text-[10px] font-mono text-neutral-400">{t.uploader.video}</span>
                      </div>
                    ) : (
                      <img
                        src={activeMedia.url}
                        alt={activeMedia.name}
                        className="w-full h-full"
                        style={{
                          objectFit: viewMode === 'fit' ? 'contain' : 'cover',
                          objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
                        }}
                        draggable={false}
                      />
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="p-2 bg-[var(--paper-surface)] border-t border-[var(--rule)] flex items-center gap-1.5">
                    <PlatformIcon platform={preset.platform} className="w-3 h-3 text-[var(--ink-muted)] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-[var(--ink)] truncate font-semibold">{preset.label}</p>
                      <p className={`text-[9px] font-mono tabular-nums ${
                        isExact ? 'text-emerald-500 font-bold' : isCrop ? 'text-[var(--accent)] font-semibold' : 'text-amber-500'
                      }`}>
                        {isExact
                          ? t.carousel.pass
                          : isCrop
                          ? t.carousel.crop(metrics.cropLossPercent)
                          : t.carousel.bars(barPercent)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Batch Summary Matrix */}
      <BatchSummaryMatrix />
    </div>
  );
}

/** Table: Hairline horizontal dividers, no vertical dividers */
function BatchSummaryMatrix() {
  const { mediaList, activePlatform, activeCategory } = useApp();
  const { t } = useI18n();

  const filteredPresets = useMemo(() => {
    return PLATFORM_PRESETS.filter((p) => {
      if (activePlatform !== 'all' && p.platform !== activePlatform) return false;
      if (activeCategory !== 'all') {
        const catMap: Record<string, number> = { vertical: 9 / 16, portrait: 4 / 5, square: 1, landscape: 16 / 9 };
        const expected = catMap[activeCategory];
        const presetRatio = p.aspectRatio.w / p.aspectRatio.h;
        if (expected && Math.abs(presetRatio - expected) > 0.08) return false;
      }
      return true;
    });
  }, [activePlatform, activeCategory]);

  const matrix = useMemo(() => {
    return mediaList.map((item) =>
      filteredPresets.map((preset) => {
        return calculateMetrics(item.naturalWidth, item.naturalHeight, preset.aspectRatio);
      })
    );
  }, [mediaList, filteredPresets]);

  if (mediaList.length < 2 || filteredPresets.length === 0) return null;

  const slidePassCounts = matrix.map((row) => row.filter((m) => m.fitType === 'exact').length);

  return (
    <details className="mt-6 group border border-[var(--rule)] bg-[var(--paper-elevated)] p-4">
      <summary className="cursor-pointer text-xs font-mono text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center justify-between select-none">
        <span>{t.carousel.batchMatrix(mediaList.length, filteredPresets.length)}</span>
        <span className="text-[var(--accent)] font-bold text-sm group-open:rotate-90 transition-transform">→</span>
      </summary>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--rule)] bg-[var(--paper-surface)]">
              <th className="text-left px-3 py-2 text-[var(--ink-muted)] font-mono uppercase text-[10px]">
                {t.carousel.slideLabel(1).replace('1', '').trim() || 'Slide'}
              </th>
              {filteredPresets.map((p) => (
                <th key={p.id} className="px-2 py-2 text-center whitespace-nowrap">
                  <div className="flex flex-col items-center gap-0.5">
                    <PlatformIcon platform={p.platform} className="w-3 h-3 text-[var(--ink-muted)]" />
                    <span className="text-[9px] font-mono text-[var(--ink-muted)] max-w-[56px] truncate">{p.label}</span>
                  </div>
                </th>
              ))}
              <th className="px-2 py-2 text-center text-[var(--ink-muted)] font-mono uppercase text-[10px]">
                {t.carousel.passRate}
              </th>
            </tr>
          </thead>
          <tbody>
            {mediaList.map((item, rowIdx) => (
              <tr key={item.id} className="border-b border-[var(--rule-subtle)] hover:bg-[var(--paper-surface)] transition-colors">
                <td className="px-3 py-2 font-medium text-[var(--ink)]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[var(--ink-muted)] tabular-nums">0{rowIdx + 1}</span>
                    <span className="truncate max-w-[120px] text-[11px] font-mono">{item.name}</span>
                  </div>
                </td>
                {matrix[rowIdx].map((m, colIdx) => {
                  const isCrop = m.fitType === 'crop_horizontal' || m.fitType === 'crop_vertical';
                  return (
                    <td key={filteredPresets[colIdx].id} className="px-1 py-2 text-center">
                      {m.fitType === 'exact' ? (
                        <span className="inline-block text-emerald-500 font-bold text-xs">✓</span>
                      ) : isCrop ? (
                        <span className="text-[10px] font-mono text-[var(--accent)] font-semibold tabular-nums">
                          -{m.cropLossPercent}%
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-500 tabular-nums">
                          {t.carousel.barsLabel}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="px-2 py-2 text-center">
                  <span className="font-mono text-[10px] tabular-nums font-semibold text-[var(--ink)]">
                    {slidePassCounts[rowIdx]}/{filteredPresets.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
