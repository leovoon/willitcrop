# WillItCrop? — Architecture & Implementation Plan

A lightweight, client-side web utility that dynamically renders user-uploaded images or videos inside viewports pre-configured to major social media aspect ratios, visually highlighting crop overflow, letterboxing, and platform UI safe zones in real time.

---

## 1. Architectural Review of Original Proposal

### 1.1 Original vs. Improved Architecture

| Dimension | Original Proposal | Improved Agent-Friendly Architecture | Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (React) | **Vite + Preact** (or React) + **TypeScript** | Eliminates SSR/hydration bugs for client APIs (`URL.createObjectURL`, `<video>`, `<canvas>`); sub-second HMR; tiny bundle (< 5KB Preact runtime). |
| **Rendering Engine** | Fabric.js / Canvas API | **Modern CSS + SVG Overlays** | Fabric.js is ~300KB+ imperative baggage. Playing multiple `<video>` streams in Canvas requires heavy `requestAnimationFrame` loops. CSS hardware acceleration (`aspect-ratio`, `object-position`, transforms) renders at 60 FPS with 90% less code. |
| **Safe Zones** | Canvas drawing routines | **Responsive SVG Masks** | Declarative vector overlays with `vector-effect="non-scaling-stroke"`. Clean separation of UI coordinates from rendering logic. |
| **Video Processing** | `ffmpeg.wasm` (future) | **Native HTML5 Video Element** | Avoids 25MB+ wasm binaries and strict COOP/COEP header requirements. Instant metadata extraction (`videoWidth`, `videoHeight`, duration). |
| **Testing Strategy** | Manual verification | **Vitest (Headless Unit Testing)** | Decouples crop math and preset validation into pure functions for automated agent testing. |

---

## 2. Core Design Principles for Agent-Friendly Development

1. **Pure Data Contracts (Single Source of Truth):**
   * Platform presets, resolutions, and safe zone coordinates live in isolated, strictly typed configuration files. Adding or updating platforms requires zero changes to UI components.
2. **Pure Math Decoupled from DOM:**
   * All aspect-ratio comparison, crop percentage calculations, and warning severities are pure mathematical functions. Agents can execute deterministic unit tests in milliseconds without launching a browser.
3. **Flat, Single-Responsibility Component Tree:**
   * Components are kept under 120 lines each, with distinct responsibilities (e.g., uploader, viewport card, safe zone overlay, status badge).
4. **Zero Imperative Canvas Logic:**
   * CSS `object-fit` and `object-position` handle scaling and focal point repositioning natively, supporting both static images and playing videos with identical code.

---

## 3. Project Structure

```text
social-what-size/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── presets.ts         # Type definitions for platforms, media, safe zones, metrics
│   ├── config/
│   │   └── platforms.ts       # Preset definitions (Instagram, TikTok, X, etc.)
│   ├── utils/
│   │   ├── math.ts            # Pure geometry, aspect ratio diff & crop loss calculations
│   │   └── math.test.ts       # Vitest unit tests for calculations
│   ├── state/
│   │   └── store.ts           # Simple reactive state (media, focal point, global view mode)
│   └── components/
│       ├── Header.tsx         # App branding & actions
│       ├── MediaUploader.tsx  # Drag & drop / file picker + metadata reader
│       ├── ControlBar.tsx     # View mode switch (Crop/Fit), safe zone toggle, filters
│       ├── ViewportGrid.tsx   # Responsive grid of preview cards
│       ├── ViewportCard.tsx   # Single platform viewport with focal drag
│       ├── SafeZoneOverlay.tsx# SVG safe zone overlay
│       └── StatusBadge.tsx    # "Fits Native", "25% Cropped", etc.
```

---

## 4. Data Contracts & Schemas

### 4.1 Type Definitions (`src/types/presets.ts`)

```typescript
export type PlatformId = 'instagram' | 'tiktok' | 'facebook' | 'x' | 'threads' | 'youtube';

export type ViewMode = 'crop' | 'fit' | 'inspect';

export interface AspectRatio {
  w: number;
  h: number;
}

export interface SafeZoneElement {
  id: string;
  name: string;
  // Normalized coordinates in percentage (0 to 100)
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  width?: number;
  height?: number;
  description: string;
}

export interface PlatformPreset {
  id: string;
  platform: PlatformId;
  label: string;
  category: 'feed' | 'story' | 'reels' | 'card' | 'shorts';
  aspectRatio: AspectRatio; // e.g., { w: 9, h: 16 }
  recommendedResolution: { w: number; h: number }; // e.g., { w: 1080, h: 1920 }
  safeZones?: SafeZoneElement[];
}

export interface MediaItem {
  file: File;
  url: string;
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
  cropLossPercent: number;      // % of media cut off in cover mode
  pillarboxPercent: number;     // % side letterboxing in contain mode
  letterboxPercent: number;     // % top/bottom letterboxing in contain mode
  severity: 'optimal' | 'warning' | 'critical';
}
```

---

## 5. Pure Math Engine (`src/utils/math.ts`)

```typescript
import { CropMetrics, AspectRatio } from '../types/presets';

/**
 * Calculates crop loss and letterboxing metrics for a given media against a target aspect ratio.
 */
export function calculateMetrics(
  mediaW: number,
  mediaH: number,
  targetRatio: AspectRatio
): CropMetrics {
  const mediaRatio = mediaW / mediaH;
  const target = targetRatio.w / targetRatio.h;
  const diff = Math.abs(mediaRatio - target);

  if (diff < 0.01) {
    return {
      fitType: 'exact',
      cropLossPercent: 0,
      pillarboxPercent: 0,
      letterboxPercent: 0,
      severity: 'optimal',
    };
  }

  if (mediaRatio > target) {
    // Media is wider than target frame: sides get cropped in cover mode
    const visibleWidth = mediaH * target;
    const cropLossPercent = Math.round(((mediaW - visibleWidth) / mediaW) * 100);
    const letterboxPercent = Math.round(((target - mediaRatio) / target) * 100);

    return {
      fitType: 'crop_horizontal',
      cropLossPercent,
      pillarboxPercent: 0,
      letterboxPercent: Math.abs(letterboxPercent),
      severity: cropLossPercent > 30 ? 'critical' : cropLossPercent > 10 ? 'warning' : 'optimal',
    };
  } else {
    // Media is taller than target frame: top/bottom get cropped in cover mode
    const visibleHeight = mediaW / target;
    const cropLossPercent = Math.round(((mediaH - visibleHeight) / mediaH) * 100);
    const pillarboxPercent = Math.round(((target - mediaRatio) / target) * 100);

    return {
      fitType: 'crop_vertical',
      cropLossPercent,
      pillarboxPercent: Math.abs(pillarboxPercent),
      letterboxPercent: 0,
      severity: cropLossPercent > 30 ? 'critical' : cropLossPercent > 10 ? 'warning' : 'optimal',
    };
  }
}
```

---

## 6. Viewport Card & Interactions

### 6.1 Interactive Focal Dragging with Zero Canvas
Uses CSS `object-position` with normalized focal points (`x: 0..1`, `y: 0..1`):

```tsx
// Inside ViewportCard.tsx
<div
  className="relative overflow-hidden bg-neutral-950 rounded-lg shadow-inner cursor-grab active:cursor-grabbing border border-neutral-800"
  style={{ aspectRatio: `${preset.aspectRatio.w} / ${preset.aspectRatio.h}` }}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
>
  {media.type === 'video' ? (
    <video
      src={media.url}
      autoPlay
      loop
      muted
      playsInline
      className={`w-full h-full select-none ${viewMode === 'crop' ? 'object-cover' : 'object-contain'}`}
      style={{ objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%` }}
    />
  ) : (
    <img
      src={media.url}
      alt={preset.label}
      draggable={false}
      className={`w-full h-full select-none ${viewMode === 'crop' ? 'object-cover' : 'object-contain'}`}
      style={{ objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%` }}
    />
  )}

  {/* SVG Safe Zone Overlay */}
  {showSafeZones && preset.safeZones && (
    <SafeZoneOverlay safeZones={preset.safeZones} />
  )}
</div>
```

### 6.2 Overflow Visualization Mode
In **Inspect Mode**:
* The viewport card expands its outer container.
* The original uncropped image is displayed dimmed (`opacity-40` with a red tint).
* A crisp highlighted border represents the target frame viewport over the media, showing exactly which regions are lost without canvas pixel-manipulation.

---

## 7. Phased Implementation Roadmap

### Phase 1: Foundation & Tooling
- [x] Initialize project with `vite` (`preact-ts` template), `tailwindcss` (v4), and `lucide-preact`.
- [x] Configure `vitest` for fast unit test execution.
- [x] Create `src/types/presets.ts`.

### Phase 2: Preset Registry & Pure Math
- [x] Create `src/config/platforms.ts` with comprehensive presets:
  - **Instagram**: Feed 1:1, Portrait 4:5, Stories/Reels 9:16 (with safe zone headers/footers).
  - **TikTok**: Full-screen 9:16 (with right-rail engagement icons & bottom caption safe zones).
  - **Facebook**: Feed 1:1, Feed 4:5, Stories 9:16, Landscape 16:9.
  - **X (Twitter)**: Feed 16:9, Square 1:1.
  - **Threads**: Feed 1:1, Portrait 4:5, Vertical 9:16.
  - **YouTube**: Shorts 9:16, Landscape 16:9.
- [x] Implement `src/utils/math.ts` and write thorough test cases in `src/utils/math.test.ts`.

### Phase 3: Media Ingestion & Metadata Extraction
- [x] Build `MediaUploader.tsx` supporting:
  - Drag-and-drop zone + file picker.
  - Formats: PNG, JPG, WebP, MP4, MOV.
  - Instant client-side dimension extraction via `Image()` or `document.createElement('video')`.
  - Object URL memory cleanup (`URL.revokeObjectURL`).
  - Clipboard paste support (Cmd+V / Ctrl+V) for instant screenshot testing.

### Phase 4: Viewport Grid & Card Rendering
- [x] Build `ViewportGrid.tsx` with responsive layout and aspect-ratio containment.
- [x] Build `ViewportCard.tsx`:
  - Platform header with icon, resolution, and aspect badge.
  - Live preview with `object-fit: cover` and `contain`.
  - `StatusBadge.tsx` displaying calculated loss percentage and severity.

### Phase 5: Interactivity & Safe Zone Overlays
- [x] Add normalized pointer-event focal dragging (`focalPoint` state).
- [x] Implement `SafeZoneOverlay.tsx` using SVG with non-scaling strokes and platform UI element annotations.
- [x] Add `ControlBar.tsx` for global toggles:
  - Mode: Crop (`cover`), Fit (`contain`), Inspect (`overflow highlight`).
  - Safe Zones: On / Off.
  - Category Filters: All, Vertical (9:16), Square (1:1), Landscape (16:9).
  - Reset Focal Point to center.

### Phase 6: Polish & Accessibility
- [x] Add sample media presets (16:9 landscape photo, 9:16 reel, 1:1 square) for 1-click testing without file upload.
- [x] Keyboard navigation and mobile touch handling for focal drag.
- [x] Verification on major desktop & mobile viewport widths.

