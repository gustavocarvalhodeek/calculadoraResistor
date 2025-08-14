import React, { useId } from 'react';
import { BandsState, BandCount } from '../App';
import { COLOR_HEX, DIGITS, MULTIPLIER, TCR_PPM, TOLERANCE } from '../lib/colorCode';
import { isValidDigitColor, isValidMultiplierColor, isValidToleranceColor, isValidTcrColor } from '../lib/validate';
import { useT } from '../i18n/i18n';

type Props = {
  bands: BandsState;
  onChange: (b: Partial<BandsState>) => void;
};

const COLORS = Object.keys(COLOR_HEX) as (keyof typeof COLOR_HEX)[];

export default function BandPicker({ bands, onChange }: Props) {
  const t = useT();
  const sections: Array<{
    key: keyof BandsState;
    title: string;
    filter: (c: keyof typeof COLOR_HEX) => boolean;
  }> = [
    { key: 'd1', title: `${t('bands')} 1`, filter: (c) => isValidDigitColor(c, true) },
    { key: 'd2', title: `${t('bands')} 2`, filter: (c) => isValidDigitColor(c, false) },
  ];
  if (bands.count >= 5) sections.push({ key: 'd3', title: `${t('bands')} 3`, filter: (c) => isValidDigitColor(c, false) });
  sections.push(
    { key: 'mult', title: t('multiplier'), filter: (c) => isValidMultiplierColor(c) },
    { key: 'tol', title: t('tolerance'), filter: (c) => isValidToleranceColor(c, bands.count) }
  );
  if (bands.count === 6) sections.push({ key: 'tcr', title: t('tcr'), filter: (c) => isValidTcrColor(c as any) });

  return (
    <div className="space-y-4" aria-label="Band Picker">
      {sections.map((sec, idx) => (
        <SwatchGroup
          key={idx}
          title={sec.title}
          value={bands[sec.key] as any}
          onChange={(v) => onChange({ [sec.key]: v } as any)}
          options={COLORS.filter(sec.filter)}
          bandCount={bands.count}
        />
      ))}
    </div>
  );
}

function SwatchGroup({ title, value, onChange, options, bandCount }: {
  title: string;
  value: keyof typeof COLOR_HEX | undefined;
  onChange: (v: any) => void;
  options: (keyof typeof COLOR_HEX)[];
  bandCount: BandCount;
}) {
  const id = useId();
  return (
    <fieldset aria-labelledby={`${id}-label`} className="border rounded p-3">
      <legend id={`${id}-label`} className="text-sm font-medium">
        {title}
      </legend>
      <div className="grid grid-cols-8 gap-2 mt-2">
        {options.map((c, i) => (
          <button
            key={c}
            role="radio"
            aria-checked={value === c}
            aria-label={`${c}`}
            className="swatch focus-visible:outline-none focus-ring"
            style={{ background: COLOR_HEX[c] }}
            onClick={() => onChange(c)}
            onKeyDown={(e) => handleKeyNav(e, i, options.length, onChange, options)}
          />
        ))}
      </div>
      <div className="mt-2 text-xs opacity-70">
        {value ? labelFor(value, bandCount) : '-'}
      </div>
    </fieldset>
  );
}

function handleKeyNav(
  e: React.KeyboardEvent,
  index: number,
  total: number,
  onChange: (v: any) => void,
  options: any[]
) {
  if (e.key === 'ArrowRight') {
    onChange(options[(index + 1) % total]);
  } else if (e.key === 'ArrowLeft') {
    onChange(options[(index - 1 + total) % total]);
  } else if (e.key === 'ArrowUp') {
    onChange(options[(index - 4 + total) % total]);
  } else if (e.key === 'ArrowDown') {
    onChange(options[(index + 4) % total]);
  }
}

function labelFor(color: keyof typeof COLOR_HEX, _count: BandCount) {
  if ((DIGITS as any)[color] !== undefined) return `${color} • ${DIGITS[color as keyof typeof DIGITS]}`;
  if ((MULTIPLIER as any)[color] !== undefined) return `${color} ×${MULTIPLIER[color as keyof typeof MULTIPLIER]}`;
  if ((TOLERANCE as any)[color] !== undefined) return `${color} ±${(TOLERANCE[color as keyof typeof TOLERANCE] * 100).toFixed(2)}%`;
  if ((TCR_PPM as any)[color] !== undefined) return `${color} ${TCR_PPM[color as keyof typeof TCR_PPM]} ppm/°C`;
  return color;
}
