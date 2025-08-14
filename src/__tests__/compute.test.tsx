import { describe, it, expect } from 'vitest';
import { computeDirect, suggestBands } from '../lib/compute';

describe('Casos clássicos IEC 60062', () => {
  it('4 bandas: brown-black-red-gold → 1.0 kΩ ±5%', () => {
    const r = computeDirect({ count: 4, d1: 'brown', d2: 'black', mult: 'red', tol: 'gold' });
    expect(r.formatted).toBe('1 kΩ');
    expect((r.tolerance * 100).toFixed(0)).toBe('5');
  });

  it('5 bandas: brown-black-black-red-brown → 10 kΩ ±1%', () => {
    const r = computeDirect({ count: 5, d1: 'brown', d2: 'black', d3: 'black', mult: 'red', tol: 'brown' });
    expect(r.formatted).toBe('10 kΩ');
    expect((r.tolerance * 100).toFixed(0)).toBe('1');
  });

  it('6 bandas com TCR', () => {
    const r = computeDirect({ count: 6, d1: 'yellow', d2: 'violet', d3: 'black', mult: 'red', tol: 'brown', tcr: 'red' });
    expect(r.formatted).toBe('4.7 kΩ');
    expect(r.tcr).toBe(50);
  });

  it('InverseMode 4.7k sugere yellow-violet-red entre Top-3 (para 4 bandas)', () => {
    const s = suggestBands(4700, 4);
    const colors = s.flatMap((x) => x.colors.join('-'));
    expect(colors.some((c) => c.startsWith('yellow-violet-red'))).toBe(true);
  });
});
