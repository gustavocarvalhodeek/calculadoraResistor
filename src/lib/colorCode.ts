// IEC 60062 — Constantes e paletas
export const DIGITS = {
  black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
  green: 5, blue: 6, violet: 7, grey: 8, white: 9
} as const;

export const MULTIPLIER = {
  silver: 0.01, gold: 0.1, black: 1, brown: 10, red: 100, orange: 1_000,
  yellow: 10_000, green: 100_000, blue: 1_000_000, violet: 10_000_000,
  grey: 100_000_000, white: 1_000_000_000
} as const;

export const TOLERANCE = {
  brown: 0.01, red: 0.02, green: 0.005, blue: 0.0025,
  violet: 0.001, grey: 0.0005, gold: 0.05, silver: 0.10, none: 0.20
} as const;

export const TCR_PPM = {
  brown: 100, red: 50, orange: 15, yellow: 25, blue: 10, violet: 5
} as const;

export const COLOR_HEX = {
  black:'#000000', brown:'#8B4513', red:'#FF0000', orange:'#FFA500',
  yellow:'#FFD700', green:'#008000', blue:'#0000FF', violet:'#8A2BE2',
  grey:'#808080', white:'#FFFFFF', gold:'#D4AF37', silver:'#C0C0C0', none:'transparent'
} as const;

export type DigitColor = keyof typeof DIGITS;
export type MultiplierColor = keyof typeof MULTIPLIER;
export type ToleranceColor = keyof typeof TOLERANCE;
export type TcrColor = keyof typeof TCR_PPM;
