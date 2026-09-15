import { ComponentChildren } from 'preact';
import { PlatformPreset } from '../../types/presets';
import { useI18n } from '../../i18n';
import { InstagramFeedMockup } from './InstagramFeedMockup';
import { InstagramReelsMockup } from './InstagramReelsMockup';
import { XFeedMockup } from './XFeedMockup';
import { XVerticalMockup } from './XVerticalMockup';
import { TikTokMockup } from './TikTokMockup';
import { YouTubeShortsMockup } from './YouTubeShortsMockup';

interface AppMockupFrameProps {
  preset: PlatformPreset;
  children: ComponentChildren;
}

export function AppMockupFrame({ preset, children }: AppMockupFrameProps) {
  const { t } = useI18n();
  const isVertical916 = preset.aspectRatio.w === 9 && preset.aspectRatio.h === 16;
  const presetLabel = preset.labelKey ? t.platforms[preset.labelKey] : preset.label;

  if (preset.platform === 'instagram') {
    if (isVertical916) {
      return <InstagramReelsMockup>{children}</InstagramReelsMockup>;
    }
    return <InstagramFeedMockup>{children}</InstagramFeedMockup>;
  }

  if (preset.platform === 'x') {
    if (isVertical916) {
      return <XVerticalMockup>{children}</XVerticalMockup>;
    }
    return <XFeedMockup label={presetLabel}>{children}</XFeedMockup>;
  }

  if (preset.platform === 'tiktok' && isVertical916) {
    return <TikTokMockup>{children}</TikTokMockup>;
  }

  if (preset.platform === 'youtube' && isVertical916) {
    return <YouTubeShortsMockup>{children}</YouTubeShortsMockup>;
  }

  return <>{children}</>;
}
