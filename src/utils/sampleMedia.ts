import { MediaItem } from '../types/presets';

function createSvgDataUrl(width: number, height: number, title: string, subtitle: string, accentColor: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#grad)" />
  <rect width="100%" height="100%" fill="url(#grid)" />
  <circle cx="${width / 2}" cy="${height * 0.45}" r="${Math.min(width, height) * 0.4}" fill="url(#glow)" />

  <!-- Rule of thirds guide lines -->
  <line x1="${width / 3}" y1="0" x2="${width / 3}" y2="${height}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="8 8" stroke-width="2" />
  <line x1="${(width * 2) / 3}" y1="0" x2="${(width * 2) / 3}" y2="${height}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="8 8" stroke-width="2" />
  <line x1="0" y1="${height / 3}" x2="${width}" y2="${height / 3}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="8 8" stroke-width="2" />
  <line x1="0" y1="${(height * 2) / 3}" x2="${width}" y2="${(height * 2) / 3}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="8 8" stroke-width="2" />

  <!-- Focal Point Target (Subject placeholder) -->
  <g transform="translate(${width / 2}, ${height * 0.45})">
    <circle r="60" fill="${accentColor}" fill-opacity="0.2" stroke="${accentColor}" stroke-width="3" />
    <circle r="20" fill="${accentColor}" />
    <line x1="-80" y1="0" x2="80" y2="0" stroke="${accentColor}" stroke-width="2" />
    <line x1="0" y1="-80" x2="0" y2="80" stroke="${accentColor}" stroke-width="2" />
    <text y="105" text-anchor="middle" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="28" font-weight="600">
      Focal Subject
    </text>
  </g>

  <!-- Typography Banner -->
  <g transform="translate(${width / 2}, ${height * 0.82})">
    <text text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="${Math.max(32, Math.round(width * 0.038))}" font-weight="bold" letter-spacing="1">
      ${title}
    </text>
    <text y="${Math.max(36, Math.round(height * 0.04))}" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="${Math.max(20, Math.round(width * 0.022))}">
      ${subtitle} • ${width} × ${height}
    </text>
  </g>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_MEDIA: Record<'portrait' | 'landscape' | 'square', MediaItem> = {
  portrait: {
    id: 'sample-portrait',
    file: null,
    url: createSvgDataUrl(1080, 1920, 'Vertical Story / Reel Sample', '9:16 Mobile Native', '#38bdf8'),
    name: 'Sample-Vertical-9x16.svg',
    type: 'image',
    naturalWidth: 1080,
    naturalHeight: 1920,
    aspectRatio: 1080 / 1920,
  },
  landscape: {
    id: 'sample-landscape',
    file: null,
    url: createSvgDataUrl(1920, 1080, 'Widescreen 16:9 Sample', 'Landscape Desktop & Video', '#ec4899'),
    name: 'Sample-Landscape-16x9.svg',
    type: 'image',
    naturalWidth: 1920,
    naturalHeight: 1080,
    aspectRatio: 1920 / 1080,
  },
  square: {
    id: 'sample-square',
    file: null,
    url: createSvgDataUrl(1080, 1080, 'Square 1:1 Sample', 'Classic Feed & Carousel', '#10b981'),
    name: 'Sample-Square-1x1.svg',
    type: 'image',
    naturalWidth: 1080,
    naturalHeight: 1080,
    aspectRatio: 1,
  },
};
