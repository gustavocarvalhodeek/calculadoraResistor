import { DIGITS, MULTIPLIER, TOLERANCE, TCR_PPM } from './colorCode';
import { formatOhms } from './format';

export type DirectResult = {
  nominal: number;
  formatted: string;
  tolerance: number; // fraction
  min: number;
  max: number;
  minFormatted: string;
  maxFormatted: string;
  tcr?: number;
};

export type BandSpec = {
  count: 4|5|6;
  d1: keyof typeof DIGITS;
  d2: keyof typeof DIGITS;
  d3?: keyof typeof DIGITS;
  mult: keyof typeof MULTIPLIER;
  tol: keyof typeof TOLERANCE;
  tcr?: keyof typeof TCR_PPM;
};

export function computeDirect(b: BandSpec): DirectResult {
  const digits = b.count >= 5 ? `${DIGITS[b.d1]}${DIGITS[b.d2]}${DIGITS[b.d3!]}` : `${DIGITS[b.d1]}${DIGITS[b.d2]}`;
  const N = Number(digits);
  const mult = MULTIPLIER[b.mult];
  const nominal = N * mult;
  const tol = TOLERANCE[b.tol];
  const min = nominal * (1 - tol);
  const max = nominal * (1 + tol);
  const tcr = b.count === 6 && b.tcr ? TCR_PPM[b.tcr] : undefined;
  return {
    nominal,
    formatted: formatOhms(nominal),
    tolerance: tol,
    min,
    max,
    minFormatted: formatOhms(min),
    maxFormatted: formatOhms(max),
    tcr,
  };
}

export type Suggestion = {
  colors: string[];
  value: number;
  formatted: string;
  tolerance: number;
  errorRel: number;
  tcr?: number;
  apply: BandSpec;
};

const digitColors = Object.keys(DIGITS) as (keyof typeof DIGITS)[];
const multipliers = Object.keys(MULTIPLIER) as (keyof typeof MULTIPLIER)[];
const tolerances = Object.keys(TOLERANCE) as (keyof typeof TOLERANCE)[];
const tcrColors = Object.keys(TCR_PPM) as (keyof typeof TCR_PPM)[];

export function suggestBands(targetOhms: number, count: 4|5|6, tolPref?: string): Suggestion[] {
  const results: Suggestion[] = [];
  const tolPrefNum = tolPref ? Number(tolPref) : undefined;

  if (count === 4) {
    for (const d1 of digitColors) {
      if (d1 === 'black') continue; // sem preto no 1º dígito por padrão
      for (const d2 of digitColors) {
        for (const mult of multipliers) {
          for (const tol of tolerances) {
            // 4 bandas permite 'none', gold, silver, etc.
            const value = (Number(`${DIGITS[d1]}${DIGITS[d2]}`)) * MULTIPLIER[mult];
            const errorRel = Math.abs(value - targetOhms) / targetOhms;
            const tolF = TOLERANCE[tol];
            results.push({
              colors: [d1, d2, mult, tol],
              value,
              formatted: formatOhms(value),
              tolerance: tolF,
              errorRel,
              apply: { count, d1, d2, mult, tol },
            });
          }
        }
      }
    }
  } else if (count === 5) {
    for (const d1 of digitColors) {
      if (d1 === 'black') continue;
      for (const d2 of digitColors) {
        for (const d3 of digitColors) {
          for (const mult of multipliers) {
            for (const tol of tolerances) {
              if (tol === 'none') continue; // 5 bandas: evitar 'none'
              const value = (Number(`${DIGITS[d1]}${DIGITS[d2]}${DIGITS[d3]}`)) * MULTIPLIER[mult];
              const errorRel = Math.abs(value - targetOhms) / targetOhms;
              const tolF = TOLERANCE[tol];
              results.push({
                colors: [d1, d2, d3, mult, tol],
                value,
                formatted: formatOhms(value),
                tolerance: tolF,
                errorRel,
                apply: { count, d1, d2, d3, mult, tol },
              });
            }
          }
        }
      }
    }
  } else {
    for (const d1 of digitColors) {
      if (d1 === 'black') continue;
      for (const d2 of digitColors) {
        for (const d3 of digitColors) {
          for (const mult of multipliers) {
            for (const tol of tolerances) {
              if (tol === 'none') continue;
              for (const tcr of tcrColors) {
                const value = (Number(`${DIGITS[d1]}${DIGITS[d2]}${DIGITS[d3]}`)) * MULTIPLIER[mult];
                const errorRel = Math.abs(value - targetOhms) / targetOhms;
                const tolF = TOLERANCE[tol];
                results.push({
                  colors: [d1, d2, d3, mult, tol, tcr],
                  value,
                  formatted: formatOhms(value),
                  tolerance: tolF,
                  errorRel,
                  tcr: TCR_PPM[tcr],
                  apply: { count, d1, d2, d3, mult, tol, tcr },
                });
              }
            }
          }
        }
      }
    }
  }

  // Ordenação: menor erro → menor tolerância → multiplicador mais "limpo" (mais próximo de 1)
  results.sort((a, b) => {
    const err = a.errorRel - b.errorRel;
    if (Math.abs(err) > 1e-12) return err;
    const tol = a.tolerance - b.tolerance;
    if (Math.abs(tol) > 1e-12) return tol;
    const multA = Array.isArray(a.colors) ? a.colors.find((c) => (MULTIPLIER as any)[c as any]) : undefined;
    const multB = Array.isArray(b.colors) ? b.colors.find((c) => (MULTIPLIER as any)[c as any]) : undefined;
    const na = multA ? MULTIPLIER[multA as keyof typeof MULTIPLIER] : 1;
    const nb = multB ? MULTIPLIER[multB as keyof typeof MULTIPLIER] : 1;
    return Math.abs(na - 1) - Math.abs(nb - 1);
  });

  // Respeitar preferência de tolerância como desempate adicional (opcional)
  if (tolPrefNum !== undefined) {
    results.sort((a, b) => Math.abs(a.tolerance - tolPrefNum) - Math.abs(b.tolerance - tolPrefNum));
  }

  // Top-3
  return results.slice(0, 3);
}
