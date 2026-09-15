import { describe, it, expect } from 'vitest';
import { calculateMetrics, formatAspectRatio, gcd, getObjectPosition } from './math';

describe('gcd', () => {
  it('computes greatest common divisor correctly', () => {
    expect(gcd(1920, 1080)).toBe(120);
    expect(gcd(1080, 1920)).toBe(120);
    expect(gcd(1080, 1080)).toBe(1080);
    expect(gcd(1080, 1350)).toBe(270);
  });
});

describe('formatAspectRatio', () => {
  it('formats common video and photo resolutions', () => {
    expect(formatAspectRatio(1920, 1080)).toBe('16:9');
    expect(formatAspectRatio(1080, 1920)).toBe('9:16');
    expect(formatAspectRatio(1080, 1350)).toBe('4:5');
    expect(formatAspectRatio(1080, 1080)).toBe('1:1');
    expect(formatAspectRatio(1200, 675)).toBe('16:9');
  });
});

describe('calculateMetrics', () => {
  it('detects exact aspect match', () => {
    const metrics = calculateMetrics(1920, 1080, { w: 16, h: 9 });
    expect(metrics.fitType).toBe('exact');
    expect(metrics.cropLossPercent).toBe(0);
    expect(metrics.severity).toBe('optimal');
  });

  it('calculates horizontal crop when media is wider than target frame (16:9 into 1:1)', () => {
    const metrics = calculateMetrics(1920, 1080, { w: 1, h: 1 });
    expect(metrics.fitType).toBe('crop_horizontal');
    // 16:9 is 1.777. Target 1:1 is 1.0. Factor = 1.0 / 1.777 = 0.5625. Loss = ~44%
    expect(metrics.cropLossPercent).toBe(44);
    expect(metrics.pillarboxPercent).toBe(0);
    expect(metrics.letterboxPercent).toBe(44);
    expect(metrics.severity).toBe('critical');
  });

  it('calculates vertical crop when media is taller than target frame (9:16 into 1:1)', () => {
    const metrics = calculateMetrics(1080, 1920, { w: 1, h: 1 });
    expect(metrics.fitType).toBe('crop_vertical');
    // 9:16 is 0.5625. Target 1:1 is 1.0. Factor = 0.5625 / 1.0 = 0.5625. Loss = ~44%
    expect(metrics.cropLossPercent).toBe(44);
    expect(metrics.pillarboxPercent).toBe(44);
    expect(metrics.letterboxPercent).toBe(0);
    expect(metrics.severity).toBe('critical');
  });

  it('detects minor crop between 4:5 and 1:1', () => {
    // 4:5 is 0.8. 1:1 is 1.0. Factor = 0.8. Loss = 20%
    const metrics = calculateMetrics(1080, 1350, { w: 1, h: 1 });
    expect(metrics.fitType).toBe('crop_vertical');
    expect(metrics.cropLossPercent).toBe(20);
    expect(metrics.severity).toBe('warning');
  });
});

describe('getObjectPosition', () => {
  it('formats normalized coords to percentage', () => {
    expect(getObjectPosition({ x: 0.5, y: 0.5 })).toBe('50% 50%');
    expect(getObjectPosition({ x: 0, y: 1 })).toBe('0% 100%');
    expect(getObjectPosition({ x: 0.254, y: 0.758 })).toBe('25% 76%');
  });
});
