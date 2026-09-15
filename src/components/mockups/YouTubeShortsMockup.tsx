import { ComponentChildren } from 'preact';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreVertical, Search, ArrowLeft } from 'lucide-preact';
import { useI18n } from '../../i18n';

interface YouTubeShortsMockupProps {
  children: ComponentChildren;
}

export function YouTubeShortsMockup({ children }: YouTubeShortsMockupProps) {
  const { t } = useI18n();
  return (
    <div className="relative w-full overflow-hidden select-none bg-black text-white rounded-2xl border border-[var(--rule)]" style={{ aspectRatio: '9 / 16' }}>
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {children}
      </div>

      {/* Top Header */}
      <div className="absolute top-0 inset-x-0 pt-2 px-3 flex items-center justify-between z-10 pointer-events-none bg-gradient-to-b from-black/60 to-transparent pb-6">
        <ArrowLeft className="w-4 h-4 text-white/90" />
        <div className="flex items-center gap-4 text-white/90">
          <Search className="w-4 h-4" />
          <MoreVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Right Action Rail */}
      <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3.5 z-10 pointer-events-none">
        {/* Thumbs Up */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <ThumbsUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">88K</span>
        </div>

        {/* Thumbs Down */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <ThumbsDown className="w-4 h-4 text-white" />
          </div>
          <span className="text-[9px] font-medium drop-shadow-sm mt-0.5">{t.mockup.dislike}</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">940</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <Share2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-[9px] font-medium drop-shadow-sm mt-0.5">{t.mockup.share}</span>
        </div>

        {/* Audio Square */}
        <div className="w-7 h-7 rounded border border-white/60 bg-neutral-900 flex items-center justify-center text-[10px] font-bold">
          ♫
        </div>
      </div>

      {/* Bottom Creator Bar */}
      <div className="absolute bottom-2 inset-x-2.5 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-1 pr-14 text-left">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[9px] font-bold">
            YT
          </div>
          <span className="text-xs font-bold text-white drop-shadow-sm">
            @WillItCrop
          </span>
          <span className="text-[10px] font-bold text-black bg-white px-2 py-0.5 rounded-full">
            {t.mockup.subscribe}
          </span>
        </div>
        <p className="text-[11px] text-white/90 drop-shadow-sm leading-snug line-clamp-1">
          {t.mockup.ytCaption}
        </p>
      </div>
    </div>
  );
}
