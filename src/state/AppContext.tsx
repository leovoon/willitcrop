import { createContext } from 'preact';
import { useContext, useState, useEffect, useCallback } from 'preact/hooks';
import { BatchMode, CategoryFilter, FocalPoint, MediaItem, PlatformFilter, ViewMode } from '../types/presets';
import { SAMPLE_MEDIA } from '../utils/sampleMedia';

const MAX_FILES = 10;

interface AppContextValue {
  // Media tray
  mediaList: MediaItem[];
  activeIndex: number;
  media: MediaItem | null; // derived: mediaList[activeIndex]
  addMedia: (items: MediaItem[]) => void;
  removeMedia: (id: string) => void;
  setActiveIndex: (index: number) => void;
  reorderMedia: (fromIndex: number, toIndex: number) => void;
  clearMedia: () => void;
  loadSample: (type: 'portrait' | 'landscape' | 'square') => void;

  // Mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  batchMode: BatchMode;
  setBatchMode: (mode: BatchMode) => void;

  // Controls
  showSafeZones: boolean;
  setShowSafeZones: (val: boolean | ((prev: boolean) => boolean)) => void;
  showMockupFrame: boolean;
  setShowMockupFrame: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeCategory: CategoryFilter;
  setActiveCategory: (cat: CategoryFilter) => void;
  activePlatform: PlatformFilter;
  setActivePlatform: (platform: PlatformFilter) => void;
  focalPoint: FocalPoint;
  setFocalPoint: (focal: FocalPoint | ((prev: FocalPoint) => FocalPoint)) => void;
  resetFocalPoint: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: preact.ComponentChildren }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([SAMPLE_MEDIA.portrait]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('fit');
  const [batchMode, setBatchMode] = useState<BatchMode>('platform');
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [showMockupFrame, setShowMockupFrame] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>('tiktok');
  const [focalPoint, setFocalPoint] = useState<FocalPoint>({ x: 0.5, y: 0.5 });

  // Revoke blob URLs on cleanup
  useEffect(() => {
    return () => {
      mediaList.forEach((m) => {
        if (m.url.startsWith('blob:')) URL.revokeObjectURL(m.url);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const SAMPLE_IDS = ['sample-portrait', 'sample-landscape', 'sample-square'];

  const addMedia = useCallback((items: MediaItem[]) => {
    setMediaList((prev) => {
      const isSingleSample = prev.length === 1 && SAMPLE_IDS.includes(prev[0].id);
      if (isSingleSample) return items.slice(0, MAX_FILES);
      return [...prev, ...items].slice(0, MAX_FILES);
    });
    setActiveIndex(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeMedia = useCallback((id: string) => {
    setMediaList((prev) => {
      const next = prev.filter((m) => {
        if (m.id === id) {
          if (m.url.startsWith('blob:')) URL.revokeObjectURL(m.url);
          return false;
        }
        return true;
      });
      return next.length > 0 ? next : [SAMPLE_MEDIA.portrait];
    });
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const reorderMedia = useCallback((fromIndex: number, toIndex: number) => {
    setMediaList((prev) => {
      const list = [...prev];
      const [item] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, item);
      return list;
    });
    setActiveIndex(toIndex);
  }, []);

  const clearMedia = useCallback(() => {
    setMediaList((prev) => {
      prev.forEach((m) => {
        if (m.url.startsWith('blob:')) URL.revokeObjectURL(m.url);
      });
      return [SAMPLE_MEDIA.portrait];
    });
    setActiveIndex(0);
    resetFocalPoint();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetFocalPoint = () => setFocalPoint({ x: 0.5, y: 0.5 });

  const loadSample = (type: 'portrait' | 'landscape' | 'square') => {
    const sample = SAMPLE_MEDIA[type];
    setMediaList([sample]);
    setActiveIndex(0);
    resetFocalPoint();
  };

  const media = mediaList[activeIndex] ?? null;

  const value: AppContextValue = {
    mediaList,
    activeIndex,
    media,
    addMedia,
    removeMedia,
    setActiveIndex,
    reorderMedia,
    clearMedia,
    loadSample,
    viewMode,
    setViewMode,
    batchMode,
    setBatchMode,
    showSafeZones,
    setShowSafeZones,
    showMockupFrame,
    setShowMockupFrame,
    activeCategory,
    setActiveCategory,
    activePlatform,
    setActivePlatform,
    focalPoint,
    setFocalPoint,
    resetFocalPoint,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
