import { ComponentChildren } from 'preact';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-preact';
import { useI18n } from '../../i18n';

interface InstagramFeedMockupProps {
  children: ComponentChildren;
}

export function InstagramFeedMockup({ children }: InstagramFeedMockupProps) {
  const { t } = useI18n();
  return (
    <div className="w-full flex flex-col bg-[var(--paper)] text-[var(--ink)] select-none border border-[var(--rule)]">
      {/* IG Post Header */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-[var(--rule)] bg-[var(--paper-surface)]">
        <div className="flex items-center gap-2">
          {/* Story Ring Avatar */}
          <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#cc2366] flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full bg-[var(--paper)] flex items-center justify-center text-[10px] font-bold text-[var(--ink)]">
              W
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-[var(--ink)] tracking-tight">
              willitcrop
            </span>
            <span className="text-[10px] text-[var(--ink-muted)] font-mono">
              {t.mockup.originalAudio}
            </span>
          </div>
        </div>

        <button className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-1" aria-label="More options">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Media Viewport Container */}
      <div className="relative w-full overflow-hidden bg-black">
        {children}
      </div>

      {/* IG Action Row */}
      <div className="px-3 pt-2.5 pb-1 flex items-center justify-between border-t border-[var(--rule)] bg-[var(--paper-surface)]">
        <div className="flex items-center gap-3.5 text-[var(--ink)]">
          <button className="hover:opacity-75 transition-opacity" aria-label="Like">
            <Heart className="w-4 h-4" />
          </button>
          <button className="hover:opacity-75 transition-opacity" aria-label="Comment">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button className="hover:opacity-75 transition-opacity" aria-label="Share">
            <Send className="w-4 h-4" />
          </button>
        </div>

        <button className="text-[var(--ink)] hover:opacity-75 transition-opacity" aria-label="Save">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* IG Caption & Metric Preview */}
      <div className="px-3 pb-2.5 pt-0.5 text-left bg-[var(--paper-surface)]">
        <p className="text-[11px] font-semibold text-[var(--ink)] tabular-nums">
          1,842 likes
        </p>
        <p className="text-[11px] text-[var(--ink)] leading-snug mt-0.5 line-clamp-1">
          <span className="font-semibold mr-1">willitcrop</span>
          {t.mockup.igCaption}
        </p>
      </div>
    </div>
  );
}
