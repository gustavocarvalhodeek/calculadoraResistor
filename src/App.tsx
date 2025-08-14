import React, { useMemo, useState, useContext } from 'react';
import ResistorRealistic from './components/ResistorRealistic';
import BandPicker from './components/BandPicker';
import ModeToggle from './components/ModeToggle';
import InverseMode from './components/InverseMode';
import OutputPanel from './components/OutputPanel';
import { useT, I18nContext } from './i18n/i18n';
import { COLOR_HEX, TOLERANCE } from './lib/colorCode';
import { computeDirect } from './lib/compute';
import { isValidToleranceColor } from './lib/validate';

export type BandCount = 4 | 5 | 6;

export type BandsState = {
  count: BandCount;
  d1: keyof typeof COLOR_HEX;
  d2: keyof typeof COLOR_HEX;
  d3?: keyof typeof COLOR_HEX;
  mult: keyof typeof COLOR_HEX;
  tol: keyof typeof TOLERANCE;
  tcr?: 'brown' | 'red' | 'orange' | 'yellow' | 'blue' | 'violet';
};

const initial: BandsState = {
  count: 4,
  d1: 'brown',
  d2: 'black',
  mult: 'red',
  tol: 'gold',
}; // 1.0k ±5%

export default function App() {
  const t = useT();
  const [dark, setDark] = useState<boolean>(false);
  const [bands, setBands] = useState<BandsState>(initial);

  const result = useMemo(() => computeDirect(bands), [bands]);

  const applySuggestion = (s: Partial<BandsState> & { count: BandCount }) => {
    setBands((prev) => adaptBands({ ...prev, ...s }));
  };

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen px-4 py-6 sm:p-8 max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <div className="flex gap-2 items-center">
            <LangSwitcher />
            <button
              onClick={() => setDark((d) => !d)}
              className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 focus-visible:outline-none focus-ring"
              aria-pressed={dark}
            >
              {dark ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        <main className="grid lg:grid-cols-2 gap-6 items-start">
          <section className="space-y-4">
            <ResistorRealistic bands={bands} result={result} />
            <OutputPanel result={result} bands={bands} />
          </section>

          <section className="space-y-6">
            <ModeToggle bands={bands} onChange={(b) => setBands((prev) => adaptBands({ ...prev, ...b }))} />
            <BandPicker bands={bands} onChange={(b) => setBands((prev) => adaptBands({ ...prev, ...b }))} />
            <InverseMode onApply={applySuggestion} />
            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 focus-visible:outline-none focus-ring"
                onClick={() => navigator.clipboard.writeText(result.formatted)}
              >
                {t('copy')} ({result.formatted})
              </button>
              <button
                className="px-3 py-2 rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 focus-visible:outline-none focus-ring"
                onClick={() => setBands(initial)}
              >
                {t('reset')}
              </button>
            </div>
          </section>
        </main>

        <footer className="mt-8 text-sm opacity-70">
          IEC 60062 • {t('bands')}: 4/5/6 • {t('tolerance')} & {t('tcr')} • {t('bestMatches')}
        </footer>
      </div>
    </div>
  );
}

function LangSwitcher() {
  const { setLocale } = useContext(I18nContext);
  const [lang, setLang] = React.useState(localStorage.getItem('lang') || 'pt');
  React.useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    localStorage.setItem('lang', lang);
  }, [lang]);
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span>{lang === 'pt' ? 'pt-BR' : 'en'}</span>
      <select
        aria-label="Language"
        className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 focus-visible:outline-none focus-ring"
        value={lang}
        onChange={(e) => {
          setLang(e.target.value);
          setLocale(e.target.value as 'pt' | 'en');
        }}
      >
        <option value="pt">pt-BR</option>
        <option value="en">en</option>
      </select>
    </label>
  );
}

function adaptBands(b: BandsState): BandsState {
  // Garantir compatibilidade ao alternar 4/5/6
  if (b.count === 4) {
    return { count: 4, d1: b.d1, d2: b.d2, mult: b.mult, tol: ensureTol4(b.tol) };
  }
  if (b.count === 5) {
    const tol = b.tol === 'none' ? 'brown' : b.tol;
    return { count: 5, d1: b.d1, d2: b.d2, d3: b.d3 ?? 'black', mult: b.mult, tol };
  }
  const tol = b.tol === 'none' ? 'brown' : b.tol;
  return {
    count: 6,
    d1: b.d1,
    d2: b.d2,
    d3: b.d3 ?? 'black',
    mult: b.mult,
    tol,
    tcr: (b.tcr as any) ?? 'brown',
  } as BandsState;
}

function ensureTol4(c: keyof typeof TOLERANCE): keyof typeof TOLERANCE {
  // Para 4 bandas, 'none' é permitido; demais já são válidos
  return isValidToleranceColor(c, 4) ? c : 'gold';
}
