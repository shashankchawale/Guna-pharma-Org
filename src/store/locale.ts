'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rate: number; // multiplier from base INR
  locale: string;
}

export const supportedCurrencies: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1, locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012, locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011, locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0093, locale: 'en-GB' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 0.018, locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 0.016, locale: 'en-CA' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 0.044, locale: 'ar-AE' },
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
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'gunapharma-locale',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : dummyStorage)),
    }
  )
);

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function formatPriceValue(inrAmount: number, currency: CurrencyConfig): string {
  const converted = inrAmount * currency.rate;
  if (currency.code === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(converted));
  }
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}

export function useFormatPrice() {
  const currency = useLocaleStore((state) => state.currency);
  return (inrAmount: number) => formatPriceValue(inrAmount, currency);
}

export function useTranslation() {
  const language = useLocaleStore((state) => state.language);
  const dict = translations[language.code] || translations.en;
  return {
    t: (key: string, fallback?: string): string => dict[key] || fallback || key,
    language,
    dir: language.dir,
  };
}
