import { ComponentChildren } from 'preact';
import { Heart, MessageCircle, Bookmark, Share2, Music2, Plus, Search } from 'lucide-preact';
import { useI18n } from '../../i18n';

interface TikTokMockupProps {
  children: ComponentChildren;
}

export function TikTokMockup({ children }: TikTokMockupProps) {
  const { t } = useI18n();
  return (
    <div className="relative w-full overflow-hidden select-none bg-black text-white rounded-2xl border border-[var(--rule)]" style={{ aspectRatio: '9 / 16' }}>
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {children}
      </div>

      {/* Top Bar: Tabs & Search */}
      <div className="absolute top-0 inset-x-0 pt-2 px-3 flex items-center justify-between z-10 pointer-events-none bg-gradient-to-b from-black/60 via-black/20 to-transparent pb-6">
        <span className="text-[10px] font-bold tracking-tight text-white/70">LIVE</span>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="text-white/60">{t.mockup.following}</span>
          <span className="text-white border-b-2 border-white pb-0.5 font-bold">{t.mockup.forYou}</span>
        </div>
        <Search className="w-4 h-4 text-white/90" />
      </div>

      {/* Right Action Rail */}
      <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3.5 z-10 pointer-events-none">
        {/* Creator Avatar with Red Plus */}
        <div className="relative mb-1">
          <div className="w-8 h-8 rounded-full border border-white bg-neutral-900 flex items-center justify-center text-[10px] font-bold">
            TT
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#fe2c55] flex items-center justify-center">
            <Plus className="w-2.5 h-2.5 text-white stroke-[3]" />
          </div>
        </div>

        {/* Like */}
        <div className="flex flex-col items-center">
          <Heart className="w-5 h-5 drop-shadow-md fill-white/20 text-white" />
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">482K</span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center">
          <MessageCircle className="w-5 h-5 drop-shadow-md fill-white/20 text-white" />
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">3,892</span>
        </div>

        {/* Bookmark */}
        <div className="flex flex-col items-center">
          <Bookmark className="w-5 h-5 drop-shadow-md fill-white/20 text-white" />
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">64K</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center">
          <Share2 className="w-5 h-5 drop-shadow-md fill-white/20 text-white" />
          <span className="text-[10px] font-semibold drop-shadow-sm tabular-nums mt-0.5">21K</span>
        </div>

        {/* Rotating Music Disc */}
        <div className="w-6 h-6 rounded-full border-2 border-neutral-700 bg-black flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
          <Music2 className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Bottom Creator Bar */}
      <div className="absolute bottom-2 inset-x-2.5 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-1 pr-14 text-left">
        <span className="text-xs font-bold text-white drop-shadow-sm block mb-1">
          @willitcrop
        </span>
        <p className="text-[11px] text-white/90 drop-shadow-sm leading-snug line-clamp-1">
          {t.mockup.tiktokCaption}
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-white/80 font-mono">
          <Music2 className="w-3 h-3 shrink-0" />
          <span className="truncate">{t.mockup.originalSound}</span>
        </div>
      </div>
    </div>
  );
}
