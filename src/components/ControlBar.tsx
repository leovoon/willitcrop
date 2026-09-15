import { Crop, Maximize2, Scan, Eye, EyeOff, RotateCcw, LayoutGrid, Layers2, LayoutDashboard, Smartphone } from 'lucide-preact';
import { useApp } from '../state/AppContext';
import { CategoryFilter, PlatformFilter } from '../types/presets';
import { PlatformIcon } from './PlatformIcon';
import { useI18n } from '../i18n';

export function ControlBar() {
  const {
    viewMode,
    setViewMode,
    batchMode,
    setBatchMode,
    mediaList,
    showSafeZones,
    setShowSafeZones,
    showMockupFrame,
    setShowMockupFrame,
    activeCategory,
    setActiveCategory,
    activePlatform,
    setActivePlatform,
    focalPoint,
    resetFocalPoint,
  } = useApp();
  const { t } = useI18n();

  const isFocalCentered =
    Math.round(focalPoint.x * 100) === 50 && Math.round(focalPoint.y * 100) === 50;
  const hasMultiple = mediaList.length > 1;

  const CATEGORIES: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: t.controlBar.allAspects },
    { id: 'vertical', label: t.controlBar.aspectVertical },
    { id: 'portrait', label: t.controlBar.aspectPortrait },
    { id: 'square', label: t.controlBar.aspectSquare },
    { id: 'landscape', label: t.controlBar.aspectLandscape },
  ];

  const PLATFORMS: { id: PlatformFilter; label: string }[] = [
    { id: 'all', label: t.controlBar.allPlatforms },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'youtube', label: 'YouTube Shorts' },
    { id: 'x', label: 'X (Twitter)' },
    { id: 'threads', label: 'Threads' },
    { id: 'facebook', label: 'Facebook' },
  ];

  return (
    <div className="w-full bg-[var(--paper-elevated)] border border-[var(--rule)] p-3 sm:p-4 mb-4 flex flex-col gap-4">
      {/* Top Row: View Mode Controls, Safe Zones, and Focal Reset */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* View Mode Segmented Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono uppercase text-[var(--ink-muted)] mr-1 hidden sm:inline">
            {t.controlBar.mode}
          </span>
          <div className="inline-flex bg-[var(--paper)] p-0.5 border border-[var(--rule)]">
            <button
              onClick={() => setViewMode('fit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'fit'
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{t.controlBar.fit}</span>
            </button>
            <button
              onClick={() => setViewMode('crop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'crop'
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>{t.controlBar.crop}</span>
            </button>
            <button
              onClick={() => setViewMode('inspect')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'inspect'
                  ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>{t.controlBar.inspect}</span>
            </button>
          </div>
        </div>

        {/* Batch Mode Toggle (if multiple files uploaded) */}
        {hasMultiple && (
          <div className="inline-flex bg-[var(--paper)] p-0.5 border border-[var(--rule)]">
            <button
              onClick={() => setBatchMode('platform')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                batchMode === 'platform'
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
              title={t.controlBar.platformsTitle}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t.controlBar.platforms}</span>
            </button>
            <button
              onClick={() => setBatchMode('carousel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                batchMode === 'carousel'
                  ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
              title={t.controlBar.carouselTitle}
            >
              <Layers2 className="w-3.5 h-3.5" />
              <span>{t.controlBar.carousel}</span>
            </button>
          </div>
        )}

        {/* Mockup Frame & Safe Zones & Focal Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--rule)] flex-wrap">
          <button
            onClick={() => setShowMockupFrame((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium border transition-colors ${
              showMockupFrame
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'bg-[var(--paper)] text-[var(--ink-muted)] border-[var(--rule)] hover:text-[var(--ink)]'
            }`}
            title={t.controlBar.mockupTitle}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{showMockupFrame ? t.controlBar.mockupOn : t.controlBar.mockupOff}</span>
          </button>

          <button
            onClick={() => setShowSafeZones((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium border transition-colors ${
              showSafeZones
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)]'
                : 'bg-[var(--paper)] text-[var(--ink-muted)] border-[var(--rule)] hover:text-[var(--ink)]'
            }`}
            title={t.controlBar.safeZonesTitle}
          >
            {showSafeZones ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showSafeZones ? t.controlBar.safeZonesOn : t.controlBar.safeZonesOff}</span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-[var(--rule)]">
            <span className="text-[11px] font-mono text-[var(--ink-muted)] tabular-nums hidden sm:inline">
              {t.controlBar.focal} {Math.round(focalPoint.x * 100)}%, {Math.round(focalPoint.y * 100)}%
            </span>
            <button
              onClick={resetFocalPoint}
              disabled={isFocalCentered}
              className={`p-1.5 border text-xs transition-colors ${
                isFocalCentered
                  ? 'border-transparent text-[var(--ink-muted)] opacity-30 cursor-not-allowed'
                  : 'border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--ink)]'
              }`}
              title={t.controlBar.resetFocal}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="h-px bg-[var(--rule)] w-full" />

      {/* Bottom Row: Filter by Platform & Aspect Ratio */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Platform Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-mono uppercase text-[var(--ink-muted)] shrink-0">
            {t.controlBar.platform}
          </span>
          <div className="flex items-center gap-1 bg-[var(--paper)] p-0.5 border border-[var(--rule)] shrink-0">
            {PLATFORMS.map((platform) => {
              const isActive = activePlatform === platform.id;
              return (
                <button
                  key={platform.id}
                  onClick={() => setActivePlatform(platform.id)}
                  title={platform.label}
                  aria-label={platform.label}
                  className={`p-2 border transition-all flex items-center justify-center min-w-[36px] min-h-[36px] ${
                    isActive
                      ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                      : 'border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-surface)]'
                  }`}
                >
                  {platform.id === 'all' ? (
                    <LayoutGrid className="w-3.5 h-3.5" />
                  ) : (
                    <PlatformIcon platform={platform.id} className="w-3.5 h-3.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Aspect Ratio Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-mono uppercase text-[var(--ink-muted)] shrink-0 hidden sm:inline">
            {t.controlBar.aspect}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-mono font-medium whitespace-nowrap border transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)]'
                    : 'bg-[var(--paper)] text-[var(--ink-muted)] border-[var(--rule)] hover:text-[var(--ink)] hover:border-[var(--ink-muted)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
