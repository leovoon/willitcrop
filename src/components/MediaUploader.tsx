import { useState, useRef, useEffect } from 'preact/hooks';
import { Upload, Film, Image as ImageIcon, RefreshCw, X, Plus, Trash2, ArrowUpRight } from 'lucide-preact';
import { useApp } from '../state/AppContext';
import { useI18n } from '../i18n';
import { MediaItem } from '../types/presets';
import { formatAspectRatio } from '../utils/math';

const MAX_FILES = 10;
const ACCEPTED = 'image/*,video/mp4,video/quicktime,video/webm';
const SAMPLE_IDS = new Set(['sample-portrait', 'sample-landscape', 'sample-square']);

function loadFile(file: File): Promise<MediaItem | null> {
  return new Promise((resolve) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) return resolve(null);

    const objectUrl = URL.createObjectURL(file);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = objectUrl;
      video.onloadedmetadata = () =>
        resolve({
          id,
          file,
          url: objectUrl,
          name: file.name,
          type: 'video',
          naturalWidth: video.videoWidth || 1080,
          naturalHeight: video.videoHeight || 1920,
          aspectRatio: (video.videoWidth || 1080) / (video.videoHeight || 1920),
          duration: Math.round(video.duration),
        });
      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
    } else {
      const img = new Image();
      img.src = objectUrl;
      img.onload = () =>
        resolve({
          id,
          file,
          url: objectUrl,
          name: file.name,
          type: 'image',
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
        });
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
    }
  });
}

export function MediaUploader() {
  const {
    mediaList,
    activeIndex,
    media,
    addMedia,
    removeMedia,
    setActiveIndex,
    reorderMedia,
    clearMedia,
    loadSample,
  } = useApp();
  const { t } = useI18n();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const addFileInputRef = useRef<HTMLInputElement | null>(null);

  const hasSamplesOnly =
    mediaList.length === 1 && SAMPLE_IDS.has(mediaList[0].id);

  const processFiles = async (files: FileList | File[]) => {
    setError(null);
    const slots = hasSamplesOnly ? MAX_FILES : MAX_FILES - mediaList.length;
    const arr = Array.from(files).slice(0, slots);
    if (arr.length === 0) {
      setError(t.uploader.limitReached(MAX_FILES));
      return;
    }
    setIsLoading(true);
    const results = await Promise.all(arr.map(loadFile));
    const valid = results.filter(Boolean) as MediaItem[];
    if (valid.length === 0) {
      setError(t.uploader.unsupportedType);
    } else {
      addMedia(valid);
    }
    setIsLoading(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer?.files.length) processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: Event) => {
    const f = (e.target as HTMLInputElement).files;
    if (f?.length) processFiles(f);
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files.length) processFiles(e.clipboardData.files);
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [mediaList]);

  // Keyboard navigation
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setActiveIndex(Math.max(0, activeIndex - 1));
      if (e.key === 'ArrowRight') setActiveIndex(Math.min(mediaList.length - 1, activeIndex + 1));
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= mediaList.length) setActiveIndex(num - 1);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [activeIndex, mediaList.length, setActiveIndex]);

  const showTray = !hasSamplesOnly || mediaList.length > 1;

  return (
    <div className="w-full bg-[var(--paper-elevated)] border border-[var(--rule)] mb-8">
      {/* Drop Zone Area */}
      {hasSamplesOnly ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border border-dashed m-4 p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-[var(--accent)] bg-[var(--accent-muted)]'
              : 'border-[var(--rule)] hover:border-[var(--ink-muted)] bg-[var(--paper)]'
          }`}
        >
          <input ref={fileInputRef} type="file" accept={ACCEPTED} multiple onChange={handleFileInput} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border border-[var(--rule)] bg-[var(--paper-surface)] flex items-center justify-center text-[var(--ink)]">
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent)]" /> : <Upload className="w-4 h-4" />}
            </div>

            <div>
              <p className="text-sm font-medium text-[var(--ink)] tracking-tight">
                {t.uploader.dropzoneTitle}
              </p>
              <p className="text-xs text-[var(--ink-muted)] font-mono mt-1">
                {t.uploader.dropzoneSub(MAX_FILES)}
              </p>
            </div>

            {/* Swiss Signature Arrow-in-Circle CTA */}
            <div className="mt-2">
              <span className="swiss-cta flex items-center gap-2">
                <span>{t.uploader.selectFiles}</span>
                <span className="arrow-circle flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          className={`px-4 pt-3 flex items-center gap-3 transition-all ${
            isDragOver ? 'opacity-60 bg-[var(--accent-muted)]' : ''
          }`}
        >
          <input ref={fileInputRef} type="file" accept={ACCEPTED} multiple onChange={handleFileInput} className="hidden" />
        </div>
      )}

      {error && (
        <div className="mx-4 mb-3 p-3 bg-[var(--accent-muted)] border border-[var(--accent)] text-[var(--accent)] text-xs font-mono flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Media Tray & Specifications */}
      <div className="p-4 border-t border-[var(--rule)] bg-[var(--paper-surface)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          {media && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 border border-[var(--rule)] bg-[var(--paper)] flex items-center justify-center shrink-0">
                {media.type === 'video'
                  ? <Film className="w-3.5 h-3.5 text-[var(--accent)]" />
                  : <ImageIcon className="w-3.5 h-3.5 text-[var(--ink)]" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-[var(--ink)] truncate max-w-[200px]" title={media.name}>
                    {media.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.25 bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] tabular-nums">
                    {formatAspectRatio(media.naturalWidth, media.naturalHeight)}
                  </span>
                  {media.duration && (
                    <span className="text-[10px] font-mono px-1.5 py-0.25 bg-[var(--paper)] text-[var(--ink-muted)] border border-[var(--rule)] tabular-nums">
                      {media.duration}s
                    </span>
                  )}
                  {mediaList.length > 1 && (
                    <span className="text-[10px] font-mono text-[var(--ink-muted)] tabular-nums">
                      {activeIndex + 1}/{mediaList.length}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[var(--ink-muted)] font-mono tabular-nums mt-0.5">
                  {t.uploader.resolution} {media.naturalWidth} × {media.naturalHeight} px
                </p>
              </div>
            </div>
          )}

          {/* Quick Demo Previews */}
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            {(['portrait', 'landscape', 'square'] as const).map((formatKey) => (
              <button
                key={formatKey}
                onClick={() => loadSample(formatKey)}
                className="px-2.5 py-1 text-xs font-mono font-medium border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--ink)] transition-colors tabular-nums"
              >
                {formatKey === 'portrait'
                  ? t.uploader.sampleVertical
                  : formatKey === 'landscape'
                  ? t.uploader.sampleLandscape
                  : t.uploader.sampleSquare}
              </button>
            ))}
          </div>
        </div>

        {/* Filmstrip Reorderable Tray */}
        {showTray && (
          <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1 pt-1 -mx-1 px-1">
            {mediaList.map((item, idx) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragFromIndex(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragFromIndex !== null && dragFromIndex !== idx) {
                    reorderMedia(dragFromIndex, idx);
                  }
                  setDragFromIndex(null);
                }}
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-16 cursor-pointer overflow-hidden border transition-all select-none group ${
                  idx === activeIndex
                    ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                    : 'border-[var(--rule)] opacity-60 hover:opacity-100 hover:border-[var(--ink-muted)]'
                }`}
                style={{ aspectRatio: `${item.naturalWidth} / ${item.naturalHeight}` }}
                title={item.name}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <Film className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                )}

                {/* Slide Number */}
                <div className="absolute bottom-0.5 left-0.5 text-[8px] font-mono font-semibold text-white bg-black/80 px-1 tabular-nums">
                  0{idx + 1}
                </div>

                {/* Cover badge for carousel mode */}
                {idx === 0 && mediaList.length > 1 && (
                  <div className="absolute top-0.5 left-0.5 text-[7px] font-mono uppercase font-bold text-white bg-[var(--accent)] px-1 leading-tight">
                    {t.uploader.cover}
                  </div>
                )}

                {/* Remove button */}
                {!SAMPLE_IDS.has(item.id) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeMedia(item.id); }}
                    className="absolute inset-0 flex items-center justify-center bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t.uploader.removeItem}
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>
            ))}

            {/* Add More Button */}
            {mediaList.length < MAX_FILES && (
              <button
                onClick={() => addFileInputRef.current?.click()}
                className="shrink-0 w-16 h-16 border border-dashed border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--paper)] flex flex-col items-center justify-center gap-1 text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors"
                title={t.uploader.addMore}
              >
                <Plus className="w-4 h-4" />
                <span className="text-[9px] font-mono uppercase">{t.uploader.add}</span>
                <input ref={addFileInputRef} type="file" accept={ACCEPTED} multiple onChange={handleFileInput} className="hidden" />
              </button>
            )}

            {/* Clear All Button */}
            {mediaList.length > 1 && (
              <button
                onClick={clearMedia}
                className="shrink-0 w-16 h-16 border border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--accent)] hover:text-[var(--accent)] flex flex-col items-center justify-center gap-1 text-[var(--ink-muted)] transition-colors"
                title={t.uploader.clear}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono uppercase">{t.uploader.clear}</span>
              </button>
            )}
          </div>
        )}

        {/* Footnote */}
        {mediaList.length > 1 && (
          <p className="text-[11px] font-mono text-[var(--ink-muted)] mt-2.5">
            {t.uploader.keyboardHint(Math.min(mediaList.length, 9))}
          </p>
        )}
      </div>
    </div>
  );
}
