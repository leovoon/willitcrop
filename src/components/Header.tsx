import { useState, useEffect } from 'preact/hooks';
import { Sun, Moon, Globe } from 'lucide-preact';
import { useI18n, SUPPORTED_LANGUAGES, SupportedLocale } from '../i18n';

export function Header() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
    if (current) setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <header className="w-full pt-4 pb-4 mb-6 flex items-center justify-between gap-3 border-b border-[var(--rule)]">
      <div className="flex items-baseline gap-2 min-w-0">
        <h1 className="text-base font-semibold tracking-tight text-[var(--ink)] shrink-0">
          WillItCrop<span className="text-[var(--accent)]">.</span>
        </h1>
        <span className="text-xs font-mono text-[var(--ink-muted)] hidden sm:inline truncate">
          {t.header.subtitle}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Language Selector */}
        <div className="relative flex items-center border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 py-1 text-xs font-mono text-[var(--ink)] hover:border-[var(--ink-muted)] transition-colors">
          <Globe className="w-3.5 h-3.5 mr-1.5 text-[var(--ink-muted)] shrink-0" />
          <select
            value={locale}
            onChange={(e) => setLocale((e.target as HTMLSelectElement).value as SupportedLocale)}
            className="bg-transparent text-[var(--ink)] cursor-pointer focus:outline-none pr-1 appearance-none"
            aria-label={t.header.selectLanguage}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[var(--paper-elevated)] text-[var(--ink)]">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 border border-[var(--rule)] bg-[var(--paper-elevated)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
          title={t.header.toggleTheme}
          aria-label={t.header.toggleTheme}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
}
