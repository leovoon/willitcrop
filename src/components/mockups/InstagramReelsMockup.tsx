import { ComponentChildren } from 'preact';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Music2, Plus } from 'lucide-preact';
import { useI18n } from '../../i18n';

interface InstagramReelsMockupProps {
  children: ComponentChildren;
}

export function InstagramReelsMockup({ children }: InstagramReelsMockupProps) {
  const { t } = useI18n();
  return (
    <div className="relative w-full overflow-hidden select-none bg-black text-white rounded-2xl border border-[var(--rule)]" style={{ aspectRatio: '9 / 16' }}>
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {children}
      </div>

      {/* Top Mobile Chrome: Status Bar & Header */}
      <div className="absolute top-0 inset-x-0 pt-2 px-3 flex items-center justify-between z-10 pointer-events-none bg-gradient-to-b from-black/60 via-black/20 to-transparent pb-6">
        <span className="text-[11px] font-semibold tracking-tight text-white/90">9:41</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-tight uppercase text-white/90">{t.mockup.reels}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/90">
          <span className="text-[10px] font-mono">5G</span>
          <div className="w-4 h-2 border border-white/80 rounded-sm p-0.5 flex items-center">
            <div className="w-full h-full bg-white/90" />
          </div>
        </div>
      </div>

      {/* Right Interaction Rail */}
      <div className="absolute right-2 bottom-16 flex flex-col items-center gap-4 z-10 pointer-events-none">
        {/* Creator Avatar with Follow Plus */}
        <div className="relative mb-1">
          <div className="w-8 h-8 rounded-full border border-white/80 bg-neutral-900 flex items-center justify-center text-[10px] font-bold">
            W
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#0095f6] flex items-center justify-center">
            <Plus className="w-2.5 h-2.5 text-white stroke-[3]" />
          </div>
        </div>

        {/* Like */}
        <div className="flex flex-col items-center">
          <Heart className="w-5 h-5 drop-shadow-md text-white" />
          <span className="text-[10px] font-medium drop-shadow-sm tabular-nums mt-0.5">248K</span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center">
          <MessageCircle className="w-5 h-5 drop-shadow-md text-white" />
          <span className="text-[10px] font-medium drop-shadow-sm tabular-nums mt-0.5">1,420</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center">
          <Send className="w-5 h-5 drop-shadow-md text-white" />
          <span className="text-[10px] font-medium drop-shadow-sm tabular-nums mt-0.5">18.2K</span>
        </div>

        {/* Bookmark */}
        <div className="flex flex-col items-center">
          <Bookmark className="w-5 h-5 drop-shadow-md text-white" />
        </div>

        {/* More */}
        <div className="flex flex-col items-center">
          <MoreVertical className="w-4 h-4 drop-shadow-md text-white/90" />
        </div>

        {/* Audio Vinyl */}
        <div className="w-6 h-6 rounded-full border-2 border-white/80 bg-neutral-900 flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
          <Music2 className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Bottom Creator & Audio Info */}
      <div className="absolute bottom-2 inset-x-2.5 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-1 pr-14 text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-white drop-shadow-sm">
            @willitcrop
          </span>
          <span className="text-[10px] font-semibold text-white border border-white/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
            {t.mockup.follow}
          </span>
        </div>
        <p className="text-[11px] text-white/90 drop-shadow-sm leading-snug line-clamp-1">
          {t.mockup.igCaption}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-white/80 font-mono">
          <Music2 className="w-3 h-3 shrink-0" />
          <span className="truncate">{t.mockup.originalAudio} • {t.mockup.originalSound}</span>
        </div>
      </div>
    </div>
  );
}
