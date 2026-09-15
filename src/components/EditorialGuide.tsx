export function EditorialGuide() {
  return (
    <section className="w-full pt-16 mt-16 border-t border-[var(--rule)]">
      {/* Publication Eyebrow & Numbering */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-[var(--rule)]">
        <span className="swiss-eyebrow">
          [ 02 / THE SOCIAL GRID CANON ]
        </span>
        <span className="text-xs font-mono text-[var(--ink-muted)]">
          OFFICIAL 2026 SPECIFICATIONS
        </span>
      </div>

      {/* Type-as-Architecture Headline */}
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-tight text-[var(--ink)] mb-4">
          Safe Zones, Aspect Ratios, and the Geometry of Social Feeds<span className="text-[var(--accent)]">.</span>
        </h2>
        <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed max-w-3xl">
          Modern social platforms layer native interface elements over creator content. Subtitles, brand logos,
          and focal imagery placed outside safe margins are systematically obscured by engagement buttons,
          audio marquees, and system navigation bars.
        </p>
      </div>

      {/* Swiss Stat Row: 3 Large Numerals with Hairline Dividers */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--rule)] mb-12 bg-[var(--paper-elevated)]">
        <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[var(--rule)]">
          <span className="block text-4xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight font-mono tabular-nums mb-2">
            68<span className="text-[var(--accent)]">%</span>
          </span>
          <span className="block text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)] mb-1">
            Horizontal Loss
          </span>
          <p className="text-xs text-[var(--ink-muted)] leading-normal">
            Crop loss when forcing a standard 16:9 landscape video into a 9:16 vertical player without letterboxing.
          </p>
        </div>

        <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[var(--rule)]">
          <span className="block text-4xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight font-mono tabular-nums mb-2">
            25<span className="text-[var(--accent)]">%</span>
          </span>
          <span className="block text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)] mb-1">
            Bottom UI Obstruction
          </span>
          <p className="text-xs text-[var(--ink-muted)] leading-normal">
            Lower vertical area occupied by username, captions, hashtags, and sound ticker in TikTok and Reels.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <span className="block text-4xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight font-mono tabular-nums mb-2">
            18<span className="text-[var(--accent)]">%</span>
          </span>
          <span className="block text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)] mb-1">
            Right-Rail Action Stack
          </span>
          <p className="text-xs text-[var(--ink-muted)] leading-normal">
            Lateral margin masked by like, comment, bookmark, share icons, and creator avatar discs.
          </p>
        </div>
      </div>

      {/* Editorial Pull Quote in Serif */}
      <blockquote className="my-12 py-8 px-4 sm:px-8 border-y border-[var(--rule)] bg-[var(--paper-surface)]">
        <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-[var(--ink)] leading-snug max-w-3xl">
          &ldquo;Content does not exist in an abstract rectangle. It is rendered inside a dynamic operating system viewport.&rdquo;
        </p>
        <cite className="block mt-4 font-mono text-xs not-italic uppercase tracking-widest text-[var(--accent)]">
          — Müller-Brockmann Applied to Algorithmic Media
        </cite>
      </blockquote>

      {/* Platform Specification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="border border-[var(--rule)] p-6 bg-[var(--paper-elevated)]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent)] block mb-2">
            CANON 01 // VERTICAL 9:16
          </span>
          <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
            TikTok, Reels &amp; YouTube Shorts
          </h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
            Master resolution: 1080 × 1920 pixels. The central title-safe zone is bounded between 220px from the top
            and 420px from the bottom. Subtitles, lower-thirds, and calls to action must sit within the 1080 × 1280
            central window to guarantee legibility across device displays.
          </p>
          <div className="text-[11px] font-mono text-[var(--ink)] border-t border-[var(--rule)] pt-3 flex justify-between">
            <span>RECOMMENDED ASPECT: 9:16</span>
            <span className="text-[var(--accent)]">MIN BUFFER: 120PX</span>
          </div>
        </div>

        <div className="border border-[var(--rule)] p-6 bg-[var(--paper-elevated)]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent)] block mb-2">
            CANON 02 // FEED &amp; CAROUSEL 4:5
          </span>
          <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
            Instagram Feed &amp; Threads Multi-Slide
          </h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
            Master resolution: 1080 × 1350 pixels. Instagram locks carousel posts to the ratio of the first slide.
            If Slide 1 is 4:5, every subsequent slide is forced to 4:5. Furthermore, profile grid previews extract
            a 1:1 center crop from the middle 1080 × 1080 block.
          </p>
          <div className="text-[11px] font-mono text-[var(--ink)] border-t border-[var(--rule)] pt-3 flex justify-between">
            <span>FEED MAX RATIO: 4:5</span>
            <span className="text-[var(--accent)]">GRID CROP: CENTER 1:1</span>
          </div>
        </div>
      </div>
    </section>
  );
}
