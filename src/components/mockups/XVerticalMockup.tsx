import { ComponentChildren } from 'preact';
import { Heart, MessageCircle, Repeat2, Bookmark, Share, Volume2, ArrowLeft, MoreHorizontal } from 'lucide-preact';
import { useI18n } from '../../i18n';

interface XVerticalMockupProps {
  children: ComponentChildren;
}

export function XVerticalMockup({ children }: XVerticalMockupProps) {
  const { t } = useI18n();
  return (
    <div className="relative w-full overflow-hidden select-none bg-black text-white rounded-2xl border border-[var(--rule)]" style={{ aspectRatio: '9 / 16' }}>
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {children}
      </div>

      {/* Top Bar: Back & Audio */}
      <div className="absolute top-0 inset-x-0 pt-2 px-3 flex items-center justify-between z-10 pointer-events-none bg-gradient-to-b from-black/60 to-transparent pb-6">
        <ArrowLeft className="w-4 h-4 text-white/90" />
        <div className="flex items-center gap-3 text-white/90">
          <Volume2 className="w-4 h-4" />
          <MoreHorizontal className="w-4 h-4" />
        </div>
      </div>

      {/* Right Engagement Rail */}
      <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3.5 z-10 pointer-events-none">
        {/* Like */}
        <div className="flex flex-col items-center">
          <Heart className="w-5 h-5 drop-shadow-md text-white" />
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">14.2K</span>
        </div>

        {/* Repost */}
        <div className="flex flex-col items-center">
          <Repeat2 className="w-5 h-5 drop-shadow-md text-white" />
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">1.8K</span>
        </div>

        {/* Reply */}
        <div className="flex flex-col items-center">
          <MessageCircle className="w-5 h-5 drop-shadow-md text-white" />
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">620</span>
        </div>

        {/* Bookmark */}
        <div className="flex flex-col items-center">
          <Bookmark className="w-5 h-5 drop-shadow-md text-white" />
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">3.1K</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center">
          <Share className="w-5 h-5 drop-shadow-md text-white" />
        </div>
      </div>

      {/* Bottom Creator & Progress Scrubber */}
      <div className="absolute bottom-2 inset-x-2.5 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-1 pr-14 text-left">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-bold text-white drop-shadow-sm">
            WillItCrop
          </span>
          <span className="text-[10px] text-white/70 font-mono">
            @willitcrop
          </span>
        </div>
        <p className="text-[11px] text-white/90 drop-shadow-sm leading-snug line-clamp-1 mb-2">
          {t.mockup.xVertCaption}
        </p>
        {/* Scrubber Bar */}
        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}
