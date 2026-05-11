import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50:  '#fdf2f4',
          100: '#fce7ea',
          200: '#f8cdd3',
          300: '#f2a0ac',
          400: '#e96878',
          500: '#dc3a52',
          600: '#c21833',
          700: '#9a1728',
          800: '#7d1222',
          900: '#660000',
          950: '#3a0710',
        },
      },
    },
  },
  plugins: [typography],
};
