export type SupportedLocale =
  | 'en'
  | 'zh-CN'
  | 'zh-TW'
  | 'ja'
  | 'ko'
  | 'es'
  | 'pt'
  | 'de'
  | 'fr';

export interface LanguageOption {
  code: SupportedLocale;
  label: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
];

export interface TranslationDictionary {
  header: {
    subtitle: string;
    toggleTheme: string;
    selectLanguage: string;
  };
  uploader: {
    dropzoneTitle: string;
    dropzoneSub: (max: number) => string;
    selectFiles: string;
    resolution: string;
    sampleVertical: string;
    sampleLandscape: string;
    sampleSquare: string;
    add: string;
    clear: string;
    keyboardHint: (max: number) => string;
    limitReached: (max: number) => string;
    unsupportedType: string;
    removeItem: string;
    addMore: string;
    cover: string;
    video: string;
  };
  controlBar: {
    mode: string;
    fit: string;
    crop: string;
    inspect: string;
    platforms: string;
    platformsTitle: string;
    carouselTitle: string;
    carousel: string;
    mockupOn: string;
    mockupOff: string;
    mockupTitle: string;
    safeZonesOn: string;
    safeZonesOff: string;
    safeZonesTitle: string;
    focal: string;
    resetFocal: string;
    platform: string;
    aspect: string;
    allPlatforms: string;
    allAspects: string;
    aspectVertical: string;
    aspectPortrait: string;
    aspectSquare: string;
    aspectLandscape: string;
  };
  grid: {
    formats: (count: number) => string;
    oneCol: string;
    twoCol: string;
    threeCols: string;
    grid: string;
    noMatch: string;
    resetFilters: string;
  };
  status: {
    passFull: string;
    passShort: string;
    barsFull: (percent: number) => string;
    barsShort: (percent: number) => string;
    cropFull: (percent: number) => string;
    cropShort: (percent: number) => string;
    letterboxed: string;
    widthOverflow: string;
    heightOverflow: string;
    croppedArea: (percent: number) => string;
    panAdjust: string;
  };
  carousel: {
    title: string;
    master: string;
    slide: (index: number, w: number, h: number) => string;
    slideLabel: (index: number) => string;
    slides: string;
    cover: string;
    video: string;
    pass: string;
    crop: (percent: number) => string;
    bars: (percent: number) => string;
    barsLabel: string;
    batchMatrix: (slides: number, formats: number) => string;
    passRate: string;
  };
  footer: {
    copyright: (year: number) => string;
  };
  platforms: {
    // TikTok
    ttFullScreen: string;
    // Instagram
    igReelsStories: string;
    igFeedPortrait: string;
    igProfileGrid: string;
    igFeedSquare: string;
    igFeedLandscape: string;
    // X
    xVertical: string;
    xPortrait: string;
    xSquare: string;
    xLandscape: string;
    xLinkCard: string;
    // YouTube
    ytShorts: string;
    ytVideo: string;
    // Threads
    thVertical: string;
    thFeedPortrait: string;
    thFeedSquare: string;
    thLandscape: string;
    // Facebook
    fbStoriesReels: string;
    fbMobileFeed: string;
  };
  mockup: {
    following: string;
    forYou: string;
    follow: string;
    originalAudio: string;
    originalSound: string;
    dislike: string;
    share: string;
    subscribe: string;
    reels: string;
    tiktokCaption: string;
    igCaption: string;
    xCaption: (label: string) => string;
    xVertCaption: string;
    ytCaption: string;
  };
}
