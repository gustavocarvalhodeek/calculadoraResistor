export function formatOhms(value: number): string {
  // 3 algarismos significativos
  const abs = Math.abs(value);
  const units = [
    { limit: 1e9, sym: 'GΩ', div: 1e9 },
    { limit: 1e6, sym: 'MΩ', div: 1e6 },
    { limit: 1e3, sym: 'kΩ', div: 1e3 },
  ];
  for (const u of units) {
    if (abs >= u.limit) return sig(value / u.div, 3) + ' ' + u.sym;
  }
  return sig(value, 3) + ' Ω';
}

export function sig(n: number, s: number): string {
  if (n === 0) return '0';
  const d = Math.ceil(Math.log10(Math.abs(n)));
  const pow = s - d;
  const m = Math.pow(10, pow);
  return (Math.round(n * m) / m).toString();
}

export function parseOhms(input: string): number | null {
  if (!input) return null;
  const m = input.trim().toLowerCase().replace(',', '.').match(/^([\d.]+)\s*([kmg]?)(?:ohm|Ω|o|r)?$/i);
  if (!m) return null;
  const num = parseFloat(m[1]);
  const scale = m[2];
  const mult = scale === 'g' ? 1e9 : scale === 'm' ? 1e6 : scale === 'k' ? 1e3 : 1;
  return num * mult;
}
