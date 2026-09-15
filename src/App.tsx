import { I18nProvider, useI18n } from './i18n';
import { AppProvider, useApp } from './state/AppContext';
import { Header } from './components/Header';
import { MediaUploader } from './components/MediaUploader';
import { ControlBar } from './components/ControlBar';
import { ViewportGrid } from './components/ViewportGrid';
import { CarouselCohesionView } from './components/CarouselCohesionView';

function MainContent() {
  const { batchMode, mediaList } = useApp();
  const showCarousel = batchMode === 'carousel' && mediaList.length > 1;
  return showCarousel ? <CarouselCohesionView /> : <ViewportGrid />;
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-[var(--rule)] py-4 px-4">
      <p className="text-center text-[11px] font-mono text-[var(--ink-muted)]">
        {t.footer.copyright(new Date().getFullYear())}
      </p>
    </footer>
  );
}

export function App() {
  return (
    <I18nProvider>
      <AppProvider>
        <div className="min-h-[100dvh] flex flex-col bg-[var(--paper)] text-[var(--ink)]">
          <main className="flex-1 max-w-[1360px] w-full mx-auto px-3 sm:px-6 lg:px-10 pb-16">
            <Header />
            <MediaUploader />
            <ControlBar />
            <MainContent />
          </main>
          <Footer />
        </div>
      </AppProvider>
    </I18nProvider>
  );
}
