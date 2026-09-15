export type PlatformId =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'x'
  | 'threads'
  | 'youtube'
  | 'linkedin';

export type ViewMode = 'crop' | 'fit' | 'inspect';

export type CategoryFilter = 'all' | 'vertical' | 'square' | 'portrait' | 'landscape';

export type PlatformFilter = PlatformId | 'all';

export interface AspectRatio {
  w: number;
  h: number;
}

export interface SafeZoneElement {
  id: string;
  name: string;
  top?: number;      // 0-100%
  bottom?: number;   // 0-100%
  left?: number;     // 0-100%
  right?: number;    // 0-100%
  width?: number;    // 0-100%
  height?: number;   // 0-100%
  description: string;
  badge?: string;
}

export interface PlatformPreset {
  id: string;
  platform: PlatformId;
  label: string;
  labelKey?: keyof import('../i18n/types').TranslationDictionary['platforms'];
  category: 'vertical' | 'square' | 'portrait' | 'landscape';
  aspectRatio: AspectRatio;
  recommendedResolution: { w: number; h: number };
  safeZones?: SafeZoneElement[];
  description: string;
}

export type BatchMode = 'platform' | 'carousel';

export interface MediaItem {
  id: string;
  file: File | null;
  url: string;
  name: string;
  type: 'image' | 'video';
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number; // width / height
  duration?: number;   // seconds (for video)
}

export interface FocalPoint {
  x: number; // 0.0 to 1.0 (0.5 = center)
  y: number; // 0.0 to 1.0 (0.5 = center)
}

export interface CropMetrics {
  fitType: 'exact' | 'crop_horizontal' | 'crop_vertical';
  cropLossPercent: number;      // % of original content cut off in cover mode
  pillarboxPercent: number;     // % side letterboxing in contain mode
  letterboxPercent: number;     // % top/bottom letterboxing in contain mode
  severity: 'optimal' | 'warning' | 'critical';
  summary: string;
}
