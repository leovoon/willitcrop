import { AspectRatio, CropMetrics, FocalPoint } from '../types/presets';

/**
 * Greatest Common Divisor helper to simplify ratios
 */
export function gcd(a: number, b: number): number {
  a = Math.round(Math.abs(a));
  b = Math.round(Math.abs(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

/**
 * Returns a human-friendly aspect ratio string, e.g. "16:9", "1:1", "4:5", "9:16"
 */
export function formatAspectRatio(w: number, h: number): string {
  if (!w || !h) return '—';
  const divisor = gcd(w, h);
  const sw = Math.round(w / divisor);
  const sh = Math.round(h / divisor);

  // Common standard approximations for float or high-res dimensions
  const ratio = w / h;
  if (Math.abs(ratio - 16 / 9) < 0.02) return '16:9';
  if (Math.abs(ratio - 9 / 16) < 0.02) return '9:16';
  if (Math.abs(ratio - 4 / 5) < 0.02) return '4:5';
  if (Math.abs(ratio - 1) < 0.02) return '1:1';
  if (Math.abs(ratio - 4 / 3) < 0.02) return '4:3';
  if (Math.abs(ratio - 3 / 4) < 0.02) return '3:4';
  if (Math.abs(ratio - 2.39) < 0.04) return '21:9';

  if (sw <= 20 && sh <= 20) {
    return `${sw}:${sh}`;
  }
  return `${ratio >= 1 ? ratio.toFixed(2) : `1:${(1 / ratio).toFixed(2)}`}`;
}

/**
 * Calculates crop loss and letterboxing metrics for a given media against a target aspect ratio.
 */
export function calculateMetrics(
  mediaW: number,
  mediaH: number,
  target: AspectRatio
): CropMetrics {
  if (!mediaW || !mediaH || !target.w || !target.h) {
    return {
      fitType: 'exact',
      cropLossPercent: 0,
      pillarboxPercent: 0,
      letterboxPercent: 0,
      severity: 'optimal',
      summary: 'Native Aspect Fit',
    };
  }

  const mediaRatio = mediaW / mediaH;
  const targetRatio = target.w / target.h;
  const diff = Math.abs(mediaRatio - targetRatio);

  if (diff < 0.015) {
    return {
      fitType: 'exact',
      cropLossPercent: 0,
      pillarboxPercent: 0,
      letterboxPercent: 0,
      severity: 'optimal',
      summary: 'Exact Native Aspect Ratio',
    };
  }

  const ratioFactor = Math.min(mediaRatio, targetRatio) / Math.max(mediaRatio, targetRatio);
  const lossPercent = Math.round((1 - ratioFactor) * 100);

  const severity: CropMetrics['severity'] =
    lossPercent <= 12 ? 'optimal' : lossPercent <= 30 ? 'warning' : 'critical';

  if (mediaRatio > targetRatio) {
    // Media is wider: horizontal sides are cropped in cover mode
    return {
      fitType: 'crop_horizontal',
      cropLossPercent: lossPercent,
      pillarboxPercent: 0,
      letterboxPercent: lossPercent,
      severity,
      summary: `Wider than frame: ~${lossPercent}% width cropped in Cover mode`,
    };
  } else {
    // Media is taller: top & bottom are cropped in cover mode
    return {
      fitType: 'crop_vertical',
      cropLossPercent: lossPercent,
      pillarboxPercent: lossPercent,
      letterboxPercent: 0,
      severity,
      summary: `Taller than frame: ~${lossPercent}% height cropped in Cover mode`,
    };
  }
}

/**
 * Formats a focal point into CSS object-position string
 */
export function getObjectPosition(focal: FocalPoint): string {
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v * 100)));
  return `${clamp(focal.x)}% ${clamp(focal.y)}%`;
}
