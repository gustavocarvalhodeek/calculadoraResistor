import React, { useMemo, useState } from 'react';
import { suggestBands } from '../lib/compute';
import { parseOhms } from '../lib/format';
import { useT } from '../i18n/i18n';
import type { BandCount, BandsState } from '../App';

export default function InverseMode({ onApply }: { onApply: (b: Partial<BandsState> & { count: BandCount }) => void }) {
  const t = useT();
  const [input, setInput] = useState('4.7k');
  const [tolPref, setTolPref] = useState<string>('');

  const target = useMemo(() => parseOhms(input) ?? 4700, [input]);

  const groups = useMemo(() => {
    return {
      4: suggestBands(target, 4, tolPref || undefined),
      5: suggestBands(target, 5, tolPref || undefined),
      6: suggestBands(target, 6, tolPref || undefined),
    } as Record<BandCount, ReturnType<typeof suggestBands>>;
  }, [target, tolPref]);

  return (
    <section className="border rounded p-3">
      <h2 className="text-lg font-semibold mb-2">{t('targetValue')}</h2>
      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 w-40 focus-visible:outline-none focus-ring"
          placeholder="4.7k, 330, 2.2M..."
          aria-label={t('targetValue')}
        />
        <label className="text-sm inline-flex items-center gap-2">
          {t('tolerance')}
          <select
            value={tolPref}
            onChange={(e) => setTolPref(e.target.value)}
            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 focus-visible:outline-none focus-ring"
          >
            <option value="">{t('any')}</option>
            <option value="0.2">±20%</option>
            <option value="0.1">±10%</option>
            <option value="0.05">±5%</option>
            <option value="0.02">±2%</option>
            <option value="0.01">±1%</option>
            <option value="0.005">±0.5%</option>
            <option value="0.0025">±0.25%</option>
            <option value="0.001">±0.1%</option>
            <option value="0.0005">±0.05%</option>
          </select>
        </label>
        <span className="text-sm opacity-70">{t('bestMatches')}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-3">
        {(Object.keys(groups) as Array<keyof typeof groups>).map((k) => (
          <div key={k} className="border rounded p-2">
            <h3 className="font-medium mb-2">{k} {t('bands')}</h3>
            <ul className="space-y-2">
              {groups[k as 4 | 5 | 6].map((g, idx) => (
                <li key={idx} className="text-sm flex items-center justify-between gap-2">
                  <div>
                    <div>{g.formatted} • {t('error')}: {(g.errorRel * 100).toFixed(2)}%</div>
                    <div className="opacity-70">{g.colors.join('-')} • {t('tolerance')}: ±{(g.tolerance * 100).toFixed(2)}%{g.tcr ? ` • TCR ${g.tcr} ppm/°C` : ''}</div>
                  </div>
                  <button
                    className="px-2 py-1 rounded bg-blue-600 text-white focus-visible:outline-none focus-ring"
                    onClick={() => onApply(g.apply)}
                  >
                    {t('apply')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
