'use client';

import { ChevronDown, Globe2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useIsMounted } from '@/lib/utils';
import {
  useLocaleStore,
  supportedLanguages,
  supportedCurrencies,
  type LanguageConfig,
  type CurrencyConfig,
} from '@/store/locale';

export function LocaleSwitcher({ compact = false, dropup = false }: { compact?: boolean; dropup?: boolean }) {
  const [open, setOpen] = useState(false);
  const { language, currency, setLanguage, setCurrency } = useLocaleStore();
  const mounted = useIsMounted();
  const ref = useRef<HTMLDivElement>(null);

  const activeLanguage = mounted ? language : supportedLanguages[0];
  const activeCurrency =
    mounted && currency && currency.code !== 'INR' && supportedCurrencies.some((c) => c.code === currency.code)
      ? currency
      : supportedCurrencies[0];

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const chooseLanguage = (item: LanguageConfig) => {
    setLanguage(item);
    setOpen(false);
  };

  const chooseCurrency = (item: CurrencyConfig) => {
    if (item.code === 'INR') return;
    setCurrency(item);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-semibold text-navy hover:bg-primary-light transition-colors ${
          compact ? 'px-2' : ''
        }`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Globe2 className="h-4 w-4 text-primary shrink-0" />
        <span className="whitespace-nowrap">
          {compact
            ? `${activeLanguage.code.toUpperCase()} · ${activeCurrency.code}`
            : `${activeLanguage.flag} ${activeLanguage.label} · ${activeCurrency.code}`}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className={`absolute right-0 ${
            dropup ? 'bottom-12' : 'top-12'
          } z-[70] w-80 max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-white p-3 shadow-elevated`}
          role="dialog"
          aria-label="Language and currency preferences"
        >
          {/* Language Selection */}
          <p className="px-2 pb-2 pt-1 text-xs font-bold tracking-wider uppercase text-gray-500">
            Language / Idioma / اللغة
          </p>
          <div className="space-y-1">
            {supportedLanguages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => chooseLanguage(item)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  language.code === item.code
                    ? 'bg-primary-light font-semibold text-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <span>{item.label}</span>
                  <span className="text-xs text-gray-400">({item.code.toUpperCase()})</span>
                </span>
                {language.code === item.code && <span className="font-bold text-primary">✓</span>}
              </button>
            ))}
          </div>

          <div className="my-3 border-t border-border" />

          {/* Currency Selection */}
          <p className="px-2 pb-2 text-xs font-bold tracking-wider uppercase text-gray-500">
            Display Currency
          </p>
          <div className="space-y-1">
            {supportedCurrencies
              .filter((item) => item.code !== 'INR')
              .map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => chooseCurrency(item)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    activeCurrency.code === item.code
                      ? 'bg-primary-light font-semibold text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <strong className="inline-block w-9 font-semibold text-navy">{item.symbol}</strong>
                    <span className="font-medium text-navy">{item.code}</span>
                    <span className="text-xs text-gray-400">— {item.name}</span>
                  </span>
                  {activeCurrency.code === item.code && <span className="font-bold text-primary">✓</span>}
                </button>
              ))}
          </div>

          <p className="px-2 pb-1 pt-3 text-[11px] leading-4 text-gray-400">
            Prices are converted live based on market rates. Final payments are securely processed.
          </p>
        </div>
      )}
    </div>
  );
}
