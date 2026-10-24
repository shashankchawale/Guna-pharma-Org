/**
 * GUNA PHARMA - Brand Configuration
 * Single source of truth for brand constants
 */

export const brandConfig = {
  name: 'GUNA PHARMA',
  tagline: 'Trusted Healthcare, Wherever You Are',
  description: 'Quality-assured healthcare, wellness and skincare essentials for customers and trade buyers worldwide.',

  // Contact & Legal
  contact: {
    phone: '+91 92267 24651',
    email: 'gunapharma4@gmail.com',
    whatsapp: '919226724651',
    address: 'GUNA PHARMA, Registered Office, Mumbai, Maharashtra, India',
  },

  // Legal/Compliance placeholders
  compliance: {
    drugLicenseNumber: 'DL-XXXXXXXXX',
    gstNumber: '27XXXXXXXXXXXXXZX',
    pharmacistName: 'Dr. [Registered Pharmacist Name]',
    pharmacistRegistration: 'MPC-XXXXX',
  },

  // Business
  freeDeliveryThreshold: 499,
  currency: 'INR',
  currencySymbol: '₹',

  // Social
  social: {
    instagram: 'https://instagram.com/gunapharma',
    facebook: 'https://facebook.com/gunapharma',
    twitter: 'https://twitter.com/gunapharma',
    youtube: 'https://youtube.com/gunapharma',
  },

  // App
  app: {
    name: 'GUNA PHARMA',
    shortName: 'GUNA PHARMA',
    description: 'Skincare, Medicines & Wellness',
    themeColor: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
} as const;

export type BrandConfig = typeof brandConfig;
