import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResistorRealistic from '../components/ResistorRealistic';

const bands = { count: 4 as const, d1: 'brown', d2: 'black', mult: 'red', tol: 'gold' };
const result = { nominal: 1000, formatted: '1 kΩ', tolerance: 0.05, min: 950, max: 1050, minFormatted: '950 Ω', maxFormatted: '1.05 kΩ' } as any;

describe('SVG anéis', () => {
  it('renderiza com aria-label contendo valor', () => {
    render(<ResistorRealistic bands={bands as any} result={result} />);
    const fig = screen.getByRole('img');
    expect(fig.getAttribute('aria-label') || '').toContain('1 kΩ');
  });
});
