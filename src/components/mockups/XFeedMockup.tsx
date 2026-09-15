import { ComponentChildren } from 'preact';
import { MessageCircle, Repeat2, Heart, BarChart2, Bookmark, Share, MoreHorizontal } from 'lucide-preact';
import { useI18n } from '../../i18n';

interface XFeedMockupProps {
  children: ComponentChildren;
  label: string;
}

export function XFeedMockup({ children, label }: XFeedMockupProps) {
  const { t } = useI18n();
  return (
    <div className="w-full flex flex-col bg-[var(--paper)] text-[var(--ink)] select-none border border-[var(--rule)] p-3">
      {/* Tweet Author Row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-neutral-900 border border-[var(--rule)] text-white flex items-center justify-center font-bold text-xs shrink-0">
            𝕏
          </div>
          <div className="flex items-center gap-1 min-w-0 flex-wrap leading-none">
            <span className="text-xs font-bold text-[var(--ink)] truncate">
              WillItCrop
            </span>
            {/* Blue Verified Badge */}
            <svg viewBox="0 0 22 22" aria-label="Verified account" className="w-3.5 h-3.5 text-[#1d9bf0] shrink-0 fill-current">
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.136 2.136 5.385-5.386 1.302 1.293-6.687 6.687z" />
            </svg>
            <span className="text-[11px] text-[var(--ink-muted)] font-mono">
              @willitcrop · 2h
            </span>
          </div>
        </div>

        <button className="text-[var(--ink-muted)] hover:text-[var(--ink)]" aria-label="More">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tweet Body Text */}
      <p className="text-xs text-[var(--ink)] mb-2.5 text-left leading-relaxed">
        {t.mockup.xCaption(label)}
      </p>

      {/* Media Attachment Container (Native rounded-2xl border) */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--rule)] bg-black">
        {children}
      </div>

      {/* Engagement Metric Row */}
      <div className="flex items-center justify-between text-[var(--ink-muted)] pt-2.5 px-1">
        <div className="flex items-center gap-1 hover:text-[#1d9bf0] transition-colors cursor-pointer">
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono tabular-nums">48</span>
        </div>

        <div className="flex items-center gap-1 hover:text-[#00ba7c] transition-colors cursor-pointer">
          <Repeat2 className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono tabular-nums">124</span>
        </div>

        <div className="flex items-center gap-1 hover:text-[#f91880] transition-colors cursor-pointer">
          <Heart className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono tabular-nums">1.8K</span>
        </div>

        <div className="flex items-center gap-1 hover:text-[#1d9bf0] transition-colors cursor-pointer">
          <BarChart2 className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono tabular-nums">42K</span>
        </div>

        <div className="flex items-center gap-3">
          <Bookmark className="w-3.5 h-3.5 hover:text-[var(--ink)] transition-colors cursor-pointer" />
          <Share className="w-3.5 h-3.5 hover:text-[var(--ink)] transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
