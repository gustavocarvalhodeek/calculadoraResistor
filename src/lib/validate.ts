import type { DigitColor, MultiplierColor, ToleranceColor, TcrColor } from './colorCode';

export function isValidDigitColor(c: string, first: boolean): c is DigitColor {
  const ok = ['black','brown','red','orange','yellow','green','blue','violet','grey','white'];
  if (!ok.includes(c)) return false as any;
  if (first && c === 'black') return false as any; // regra: desabilitar preto como primeiro dígito por padrão
  return true as any;
}

export function isValidMultiplierColor(c: string): c is MultiplierColor {
  const ok = ['silver','gold','black','brown','red','orange','yellow','green','blue','violet','grey','white'];
  return ok.includes(c) as any;
}

export function isValidToleranceColor(c: string, bandsCount: 4|5|6): c is ToleranceColor {
  const ok = ['brown','red','green','blue','violet','grey','gold','silver','none'];
  if (!ok.includes(c)) return false as any;
  if (bandsCount !== 4 && c === 'none') return false as any; // desencorajado/invalid para 5/6 bandas
  return true as any;
}

export function isValidTcrColor(c: string): c is TcrColor {
  const ok = ['brown','red','orange','yellow','blue','violet'];
  return ok.includes(c) as any;
}
