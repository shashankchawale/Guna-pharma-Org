/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', hover: '#1D4ED8', light: '#EFF6FF' },
        navy: { DEFAULT: '#0B1F4B', light: '#1E3A5F' },
        surface: '#FFFFFF', border: '#DBEAFE',
        success: { DEFAULT: '#059669', light: '#D1FAE5' },
        warning: { DEFAULT: '#D97706', light: '#FEF3C7' },
        error: { DEFAULT: '#DC2626', light: '#FEE2E2' },
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(37, 99, 235, 0.08), 0 10px 20px -2px rgba(37, 99, 235, 0.04)',
        card: '0 4px 20px -2px rgba(37, 99, 235, 0.06), 0 2px 8px -2px rgba(37, 99, 235, 0.04)',
        elevated: '0 10px 40px -5px rgba(37, 99, 235, 0.1), 0 4px 15px -3px rgba(37, 99, 235, 0.05)',
      },
      transitionDuration: { fast: '150ms', normal: '200ms', slow: '250ms' },
    },
  },
  plugins: [],
};
