import React from 'react';
import { BandsState, BandCount } from '../App';
import { useT } from '../i18n/i18n';

type Props = { bands: BandsState; onChange: (b: Partial<BandsState>) => void };

export default function ModeToggle({ bands, onChange }: Props) {
  const t = useT();
  const opts: BandCount[] = [4, 5, 6];
  return (
    <div className="flex items-center gap-2" role="group" aria-label={t('bands')}>
      {opts.map((n) => (
        <button
          key={n}
          className={`px-3 py-1 rounded border focus-visible:outline-none focus-ring ${
            bands.count === n ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800'
          }`}
          onClick={() => onChange({ count: n })}
          aria-pressed={bands.count === n}
        >
          {n} {t('bands')}
        </button>
      ))}
    </div>
  );
}
