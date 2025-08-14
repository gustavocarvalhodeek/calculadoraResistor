import React from 'react';
import { dictPT } from './pt';
import { dictEN } from './en';

type Locale = 'pt' | 'en';
const DICTS = { pt: dictPT, en: dictEN } as const;

export const I18nContext = React.createContext({
  locale: 'pt' as Locale,
  setLocale: (_: Locale) => {},
  t: (k: keyof typeof dictPT) => k as unknown as string,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>((localStorage.getItem('lang') as Locale) || 'pt');
  const t = React.useCallback((k: keyof typeof dictPT) => {
    return (DICTS[locale] as any)[k] ?? (dictPT as any)[k] ?? String(k);
  }, [locale]);
  const value = React.useMemo(() => ({ locale, setLocale, t }), [locale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const { t } = React.useContext(I18nContext);
  return t as (k: keyof typeof dictPT) => string;
}
