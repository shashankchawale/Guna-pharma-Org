'use client';

import * as React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useIsMounted } from '@/lib/utils';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rate: number; // multiplier from base USD (USD = 1)
  locale: string;
}

export const supportedCurrencies: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, locale: 'en-GB' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52, locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36, locale: 'en-CA' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67, locale: 'ar-AE' },
];

export interface LanguageConfig {
  code: string;
  label: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪', dir: 'rtl' },
];

export const translations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    medicines: 'Medicines',
    wellness: 'Wellness',
    aboutUs: 'About us',
    contact: 'Contact',
    cart: 'Cart',
    account: 'Account',
    searchPlaceholder: 'Search medicines, skincare, wellness...',
    shoppingPreferences: 'Shopping Preferences',
    language: 'Language',
    currency: 'Display Currency',
    currencyNotice: 'Prices are displayed for convenience. Final charges are confirmed at checkout.',
    yourCart: 'Your cart',
    cartEmpty: 'Your cart is empty',
    continueShopping: 'Continue shopping',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    free: 'Free',
    total: 'Total',
    secureCheckout: 'Secure checkout',
    add: 'Add',
    off: 'OFF',
    inStock: 'In stock · usually dispatched in 24 hours',
    prescriptionRequired: 'Prescription required',
    prescriptionNotice: 'Upload a valid prescription at checkout. This item can only be dispatched after pharmacist approval.',
    fastDelivery: 'Fast delivery',
    genuineProducts: 'Genuine products',
    securePayments: 'Secure payments',
    checkout: 'Checkout',
    placeOrder: 'Place secure order',
    deliveryDetails: 'Delivery details',
    paymentMethod: 'Payment method',
  },
  es: {
    home: 'Inicio',
    medicines: 'Medicamentos',
    wellness: 'Bienestar',
    aboutUs: 'Sobre nosotros',
    contact: 'Contacto',
    cart: 'Carrito',
    account: 'Mi Cuenta',
    searchPlaceholder: 'Buscar medicamentos, cuidado facial, bienestar...',
    shoppingPreferences: 'Preferencias de compra',
    language: 'Idioma',
    currency: 'Moneda de visualización',
    currencyNotice: 'Los precios se muestran para su comodidad. Cargos finales confirmados al pagar.',
    yourCart: 'Tu carrito',
    cartEmpty: 'Tu carrito está vacío',
    continueShopping: 'Seguir comprando',
    subtotal: 'Subtotal',
    delivery: 'Envío',
    free: 'Gratis',
    total: 'Total',
    secureCheckout: 'Pago seguro',
    add: 'Añadir',
    off: 'DTO',
    inStock: 'En stock · enviado en 24 horas',
    prescriptionRequired: 'Receta médica obligatoria',
    prescriptionNotice: 'Sube una receta médica válida al finalizar. Requiere aprobación farmacéutica.',
    fastDelivery: 'Entrega rápida',
    genuineProducts: 'Productos 100% originales',
    securePayments: 'Pagos seguros',
    checkout: 'Finalizar compra',
    placeOrder: 'Realizar pedido seguro',
    deliveryDetails: 'Datos de envío',
    paymentMethod: 'Método de pago',
  },
  fr: {
    home: 'Accueil',
    medicines: 'Médicaments',
    wellness: 'Bien-être',
    aboutUs: 'À propos',
    contact: 'Contact',
    cart: 'Panier',
    account: 'Mon Compte',
    searchPlaceholder: 'Rechercher médicaments, soins de peau, bien-être...',
    shoppingPreferences: 'Préférences d’achat',
    language: 'Langue',
    currency: 'Devise d’affichage',
    currencyNotice: 'Les prix sont affichés à titre indicatif. Montant final validé au paiement.',
    yourCart: 'Votre panier',
    cartEmpty: 'Votre panier est vide',
    continueShopping: 'Continuer les achats',
    subtotal: 'Sous-total',
    delivery: 'Livraison',
    free: 'Gratuit',
    total: 'Total',
    secureCheckout: 'Paiement sécurisé',
    add: 'Ajouter',
    off: 'RÉDUC',
    inStock: 'En stock · expédié sous 24h',
    prescriptionRequired: 'Ordonnance requise',
    prescriptionNotice: 'Veuillez télécharger une ordonnance valide lors du paiement.',
    fastDelivery: 'Livraison rapide',
    genuineProducts: 'Produits 100% authentiques',
    securePayments: 'Paiements sécurisés',
    checkout: 'Commander',
    placeOrder: 'Passer la commande',
    deliveryDetails: 'Détails de livraison',
    paymentMethod: 'Mode de paiement',
  },
  de: {
    home: 'Startseite',
    medicines: 'Medikamente',
    wellness: 'Wellness',
    aboutUs: 'Über uns',
    contact: 'Kontakt',
    cart: 'Warenkorb',
    account: 'Mein Konto',
    searchPlaceholder: 'Medikamente, Hautpflege, Wellness suchen...',
    shoppingPreferences: 'Einkaufseinstellungen',
    language: 'Sprache',
    currency: 'Währung',
    currencyNotice: 'Preise dienen der Übersicht. Endbetrag wird an der Kasse bestätigt.',
    yourCart: 'Ihr Warenkorb',
    cartEmpty: 'Ihr Warenkorb ist leer',
    continueShopping: 'Weiter einkaufen',
    subtotal: 'Zwischensumme',
    delivery: 'Versand',
    free: 'Kostenlos',
    total: 'Gesamt',
    secureCheckout: 'Sicher zur Kasse',
    add: 'Hinzufügen',
    off: 'RABATT',
    inStock: 'Auf Lager · Versand innerhalb von 24 Std.',
    prescriptionRequired: 'Rezeptpflichtig',
    prescriptionNotice: 'Laden Sie an der Kasse ein gültiges Rezept hoch. Prüfung durch Apotheker erforderlich.',
    fastDelivery: 'Schnelle Lieferung',
    genuineProducts: '100% Originalprodukte',
    securePayments: 'Sichere Zahlung',
    checkout: 'Zur Kasse',
    placeOrder: 'Bestellung aufgeben',
    deliveryDetails: 'Lieferadresse',
    paymentMethod: 'Zahlungsart',
  },
  ar: {
    home: 'الرئيسية',
    medicines: 'الأدوية',
    wellness: 'الصحة والعافية',
    aboutUs: 'من نحن',
    contact: 'اتصل بنا',
    cart: 'عربة التسوق',
    account: 'حسابي',
    searchPlaceholder: 'ابحث عن الأدوية، مستحضرات التجميل، الفيتامينات...',
    shoppingPreferences: 'تفضيلات التسوق',
    language: 'اللغة',
    currency: 'عملة العرض',
    currencyNotice: 'الأسعار معروضة للتيسير. يتم تأكيد القيمة النهائية عند الدفع.',
    yourCart: 'سلة مشترياتك',
    cartEmpty: 'سلتك فارغة حالياً',
    continueShopping: 'متابعة التسوق',
    subtotal: 'المجموع الفرعي',
    delivery: 'الشحن',
    free: 'مجاني',
    total: 'الإجمالي',
    secureCheckout: 'إتمام الطلب بأمان',
    add: 'إضافة',
    off: 'خصم',
    inStock: 'متوفر في المخزون · يتم الشحن خلال 24 ساعة',
    prescriptionRequired: 'يتطلب وصفة طبية',
    prescriptionNotice: 'يرجى تحميل وصفة طبية سارية عند إتمام الدفع. تخضع لموافقة الصيدلي.',
    fastDelivery: 'شحن سريع وموثوق',
    genuineProducts: 'منتجات أصلية 100%',
    securePayments: 'دفع آمن ومعتمد',
    checkout: 'الدفع',
    placeOrder: 'تأكيد الطلب بأمان',
    deliveryDetails: 'بيانات التوصيل',
    paymentMethod: 'طريقة الدفع',
  },
};

interface LocaleState {
  language: LanguageConfig;
  currency: CurrencyConfig;
  setLanguage: (language: LanguageConfig) => void;
  setCurrency: (currency: CurrencyConfig) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      language: supportedLanguages[0],
      currency: supportedCurrencies[0],
      setLanguage: (language) => {
        set({ language });
        if (typeof document !== 'undefined') {
          document.documentElement.lang = language.code;
          document.documentElement.dir = language.dir;
        }
      },
      setCurrency: (currency) => {
        if (!currency || currency.code === 'INR' || !supportedCurrencies.some((c) => c.code === currency.code)) {
          set({ currency: supportedCurrencies[0] });
          return;
        }
        set({ currency });
      },
    }),
    {
      name: 'gunapharma-locale-v2',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          try {
            // Clean up legacy v1 storage that might have had INR cached
            window.localStorage.removeItem('gunapharma-locale');
          } catch {
            // ignore
          }
          return localStorage;
        }
        return dummyStorage;
      }),
      onRehydrateStorage: () => (state) => {
        if (
          state &&
          (!state.currency ||
            state.currency.code === 'INR' ||
            !supportedCurrencies.some((c) => c.code === state.currency.code))
        ) {
          state.currency = supportedCurrencies[0];
        }
      },
    }
  )
);

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function formatPriceValue(amount: number, currency?: CurrencyConfig): string {
  const active =
    currency && currency.code !== 'INR' && supportedCurrencies.some((c) => c.code === currency.code)
      ? currency
      : supportedCurrencies[0];
  const rate = active?.rate || 1;
  const converted = amount * rate;
  return `${active.symbol}${converted.toLocaleString(active.locale || 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function useFormatPrice() {
  const currency = useLocaleStore((state) => state.currency);
  const mounted = useIsMounted();

  return React.useCallback(
    (amount: number) => {
      // During SSR and initial client hydration pass, use default base currency (USD)
      // so server HTML and client initial DOM match 100%
      const activeCurrency =
        mounted && currency && currency.code !== 'INR' && supportedCurrencies.some((c) => c.code === currency.code)
          ? currency
          : supportedCurrencies[0];
      return formatPriceValue(amount, activeCurrency);
    },
    [currency, mounted]
  );
}

export function useTranslation() {
  const language = useLocaleStore((state) => state.language);
  const mounted = useIsMounted();

  // During SSR and initial client hydration pass, use default base language (English)
  const activeLanguage = mounted ? language : supportedLanguages[0];
  const dict = translations[activeLanguage.code] || translations.en;

  return {
    t: (key: string, fallback?: string): string => dict[key] || fallback || key,
    language: activeLanguage,
    dir: activeLanguage.dir,
  };
}
