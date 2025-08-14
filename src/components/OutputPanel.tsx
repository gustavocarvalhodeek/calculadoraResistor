import React from 'react';
import { useT } from '../i18n/i18n';
import type { BandsState } from '../App';
import type { DirectResult } from '../lib/compute';

export default function OutputPanel({ result, bands }: { result: DirectResult; bands: BandsState }) {
  const t = useT();
  return (
    <section className="border rounded p-3" aria-live="polite">
      <h2 className="text-lg font-semibold mb-2">{t('output')}</h2>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <div>
          <div className="font-medium">{t('nominal')}</div>
          <div>{result.formatted}</div>
        </div>
        <div>
          <div className="font-medium">{t('tolerance')}</div>
          <div>±{(result.tolerance * 100).toFixed(2)}%</div>
        </div>
        <div>
          <div className="font-medium">{t('min')}</div>
          <div>{result.minFormatted}</div>
        </div>
        <div>
          <div className="font-medium">{t('max')}</div>
          <div>{result.maxFormatted}</div>
        </div>
        {bands.count === 6 && bands.tcr && (
          <div>
            <div className="font-medium">{t('tcr')}</div>
            <div>{bands.tcr?.toUpperCase()} • {result.tcr} ppm/°C</div>
          </div>
        )}
      </div>
    </section>
  );
}
