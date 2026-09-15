import { useState } from 'preact/hooks';
import { PLATFORM_PRESETS } from '../config/platforms';
import { useApp } from '../state/AppContext';
import { useI18n } from '../i18n';
import { ViewportCard } from './ViewportCard';
import { RotateCcw, LayoutGrid, Square, Columns2 } from 'lucide-preact';

export function ViewportGrid() {
  const { activeCategory, activePlatform, setActiveCategory, setActivePlatform } = useApp();
  const { t } = useI18n();
  const [mobileCols, setMobileCols] = useState<1 | 2>(2);
  const [desktopCols, setDesktopCols] = useState<2 | 3>(3);

  const filteredPresets = PLATFORM_PRESETS.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesPlatform = activePlatform === 'all' || p.platform === activePlatform;
    return matchesCategory && matchesPlatform;
  });

  return (
    <section className="w-full">
      {/* Row: count + icon-only column layout toggles */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-mono text-[var(--ink-muted)] tabular-nums">
          {t.grid.formats(filteredPresets.length)}
        </span>

        {/* Mobile: icon segmented toggle (1col | 2col) */}
        <div className="sm:hidden flex items-center bg-[var(--paper)] p-0.5 border border-[var(--rule)]">
          <button
            onClick={() => setMobileCols(1)}
            className={`p-1.5 transition-colors ${
              mobileCols === 1
                ? 'bg-[var(--ink)] text-[var(--paper)]'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
            title={t.grid.oneCol}
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setMobileCols(2)}
            className={`p-1.5 transition-colors ${
              mobileCols === 2
                ? 'bg-[var(--ink)] text-[var(--paper)]'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
            title={t.grid.twoCol}
          >
            <Columns2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop: icon segmented toggle (2col | 3col) — same style as mobile */}
        <div className="hidden sm:flex items-center bg-[var(--paper)] p-0.5 border border-[var(--rule)]">
          <button
            onClick={() => setDesktopCols(2)}
            className={`p-1.5 transition-colors ${
              desktopCols === 2
                ? 'bg-[var(--ink)] text-[var(--paper)]'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
            title={t.grid.twoCol}
          >
            <Columns2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDesktopCols(3)}
            className={`p-1.5 transition-colors ${
              desktopCols === 3
                ? 'bg-[var(--ink)] text-[var(--paper)]'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
            title={t.grid.threeCols}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {filteredPresets.length === 0 ? (
        <div className="p-10 text-center bg-[var(--paper-elevated)] border border-[var(--rule)] flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-[var(--ink-muted)]">{t.grid.noMatch}</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActivePlatform('all');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.grid.resetFilters}
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-3 sm:gap-4 ${
            mobileCols === 1 ? 'grid-cols-1' : 'grid-cols-2'
          } ${
            desktopCols === 2
              ? 'sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2'
              : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
          }`}
        >
          {filteredPresets.map((preset) => (
            <ViewportCard key={preset.id} preset={preset} />
          ))}
        </div>
      )}
    </section>
  );
}
