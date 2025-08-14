/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: []
};
