import { describe, it, expect } from 'vitest';
import { formatOhms, sig } from '../lib/format';

describe('Formatação SI', () => {
  it('menor que 1k', () => {
    expect(formatOhms(330)).toBe('330 Ω');
  });
  it('>=1k', () => {
    expect(formatOhms(4700)).toBe('4.7 kΩ');
  });
  it('>=1M', () => {
    expect(formatOhms(2_200_000)).toBe('2.2 MΩ');
  });
  it('3 sig figs', () => {
    expect(sig(12345, 3)).toBe('12300');
  });
});
