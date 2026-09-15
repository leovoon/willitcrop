import { useState, useRef } from 'preact/hooks';
import { PlatformPreset } from '../types/presets';
import { useApp } from '../state/AppContext';
import { useI18n } from '../i18n';
import { calculateMetrics, getObjectPosition } from '../utils/math';
import { StatusBadge } from './StatusBadge';
import { SafeZoneOverlay } from './SafeZoneOverlay';
import { PlatformIcon } from './PlatformIcon';
import { AppMockupFrame } from './mockups/AppMockupFrame';

interface ViewportCardProps {
  preset: PlatformPreset;
}

export function ViewportCard({ preset }: ViewportCardProps) {
  const { media, viewMode, showSafeZones, showMockupFrame, focalPoint, setFocalPoint } = useApp();
  const { t } = useI18n();
  const presetLabel = preset.labelKey ? t.platforms[preset.labelKey] : preset.label;
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; focalX: number; focalY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!media) return null;

  const metrics = calculateMetrics(media.naturalWidth, media.naturalHeight, preset.aspectRatio);
  const isExact = metrics.fitType === 'exact';
  const objectPos = getObjectPosition(focalPoint);

  const handlePointerDown = (e: PointerEvent) => {
    if (viewMode === 'fit') return; // In fit mode dragging doesn't shift content
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      focalX: focalPoint.x,
      focalY: focalPoint.y,
    };
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging || !dragStartRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Movement relative to card dimensions
    const deltaX = (e.clientX - dragStartRef.current.x) / rect.width;
    const deltaY = (e.clientY - dragStartRef.current.y) / rect.height;

    // Dampen and invert for natural camera panning
    const newX = Math.max(0, Math.min(1, dragStartRef.current.focalX - deltaX * 1.2));
    const newY = Math.max(0, Math.min(1, dragStartRef.current.focalY - deltaY * 1.2));

    setFocalPoint({ x: newX, y: newY });
  };

  const handlePointerUp = (e: PointerEvent) => {
    setIsDragging(false);
    dragStartRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const mediaContent = (
    <div
      ref={containerRef}
      className={`relative w-full bg-black overflow-hidden select-none transition-all ${
        !showMockupFrame
          ? `border ${
              isExact
                ? 'border-[var(--ink)]'
                : metrics.severity === 'critical' && viewMode === 'crop'
                ? 'border-[var(--accent)]'
                : 'border-[var(--rule)]'
            }`
          : ''
      } ${viewMode !== 'fit' ? 'cursor-grab active:cursor-grabbing touch-none' : ''}`}
      style={{
        aspectRatio: `${preset.aspectRatio.w} / ${preset.aspectRatio.h}`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Media element: Video or Image */}
      {media.type === 'video' ? (
        <video
          src={media.url}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full pointer-events-none transition-[object-position] duration-75 ${
            viewMode === 'crop' ? 'object-cover' : 'object-contain'
          }`}
          style={{ objectPosition: objectPos }}
        />
      ) : (
        <img
          src={media.url}
          alt={presetLabel}
          draggable={false}
          className={`w-full h-full pointer-events-none transition-[object-position] duration-75 ${
            viewMode === 'crop' ? 'object-cover' : 'object-contain'
          }`}
          style={{ objectPosition: objectPos }}
        />
      )}

      {/* Inspect Mode: Overlay guidelines & crop math */}
      {viewMode === 'inspect' && metrics.fitType !== 'exact' && (
        <div className="absolute inset-0 pointer-events-none border border-dashed border-[var(--accent)] bg-[var(--accent-muted)] flex flex-col items-center justify-between p-2 z-20">
          <span className="text-[10px] font-mono uppercase bg-[var(--paper)] text-[var(--accent)] px-1.5 py-0.5 border border-[var(--accent)]">
            {metrics.fitType === 'crop_horizontal' ? t.status.widthOverflow : t.status.heightOverflow}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono font-bold text-[var(--accent)] bg-[var(--paper)] px-2 py-0.5 border border-[var(--accent)] tabular-nums">
              {t.status.croppedArea(metrics.cropLossPercent)}
            </span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--ink)] bg-[var(--paper)] px-1 border border-[var(--rule)]">
            {t.status.panAdjust}
          </span>
        </div>
      )}

      {/* Precision Crosshair while Dragging */}
      {isDragging && (
        <div
          className="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-20"
          style={{
            left: `${focalPoint.x * 100}%`,
            top: `${focalPoint.y * 100}%`,
          }}
        >
          <div className="w-full h-px bg-[var(--accent)]" />
          <div className="h-full w-px bg-[var(--accent)] absolute" />
          <div className="w-2 h-2 rounded-full border border-[var(--accent)] bg-[var(--paper)] absolute" />
        </div>
      )}

      {/* SVG Safe Zone Overlay */}
      {showSafeZones && preset.safeZones && preset.safeZones.length > 0 && (
        <SafeZoneOverlay safeZones={preset.safeZones} />
      )}

      {/* Fit Mode Letterboxing Indicator */}
      {viewMode === 'fit' && metrics.fitType !== 'exact' && (
        <div className="absolute top-2 right-2 pointer-events-none z-20">
          <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[var(--paper)] text-[var(--ink-muted)] border border-[var(--rule)]">
            {t.status.letterboxed}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <article
      className={`card-container flex flex-col border transition-colors ${
        isExact
          ? 'border-[var(--ink)] bg-[var(--paper-elevated)]'
          : 'border-[var(--rule)] bg-[var(--paper-elevated)] hover:border-[var(--ink-muted)]'
      }`}
    >
      {/* Top Header Row (Responsive with Container Query) */}
      <div className="p-2 sm:p-3 border-b border-[var(--rule)] bg-[var(--paper-surface)] flex flex-col gap-1 compact-p">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="p-1 border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] flex items-center justify-center shrink-0"
              title={preset.platform}
              aria-label={preset.platform}
            >
              <PlatformIcon platform={preset.platform} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </span>

            <span className="text-[10px] sm:text-[11px] font-mono font-medium px-1.5 py-0.25 bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] tabular-nums shrink-0">
              {preset.aspectRatio.w}:{preset.aspectRatio.h}
            </span>

            <span className="text-[10px] text-[var(--ink-muted)] font-mono tabular-nums truncate compact-hide">
              {preset.recommendedResolution.w} × {preset.recommendedResolution.h}
            </span>
          </div>

          <div className="shrink-0">
            <StatusBadge metrics={metrics} viewMode={viewMode} />
          </div>
        </div>

        <h3 className="text-xs sm:text-sm font-semibold text-[var(--ink)] tracking-tight truncate" title={presetLabel}>
          {presetLabel}
        </h3>
      </div>

      {/* Viewport Canvas Frame */}
      <div className="p-2.5 sm:p-4 flex items-center justify-center bg-[var(--paper)] flex-1 min-h-[220px] sm:min-h-[280px]">
        <div className="w-full max-w-[270px] flex items-center justify-center">
          {showMockupFrame ? (
            <AppMockupFrame preset={preset}>
              {mediaContent}
            </AppMockupFrame>
          ) : (
            mediaContent
          )}
        </div>
      </div>
    </article>
  );
}
