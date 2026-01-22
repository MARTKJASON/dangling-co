import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4fd',
          100: '#e0e9fb',
          200: '#c1d3f7',
          300: '#a2bdf3',
          400: '#7da1ed',
          500: '#5b72cf',
          600: '#4a5ca8',
          700: '#384681',
          800: '#26305a',
          900: '#141a33',
        },
        secondary: {
          50: '#fffbf0',
          100: '#fff7e0',
          200: '#ffe9c1',
          300: '#ffdba2',
          400: '#ffcd83',
          500: '#ffd372',
          600: '#ffb840',
          700: '#ff9d0e',
          800: '#cc7d0b',
          900: '#805d08',
        },
        accent: {
          50: '#fffcf9',
          100: '#faf9f3',
          200: '#f5f3e7',
          300: '#f0eddb',
          400: '#ebe7cf',
          500: '#faf4dc',
          600: '#e8e1c3',
          700: '#d6ceaa',
          800: '#c4bb91',
          900: '#b2a878',
        },
      },
    },
  },
  plugins: [],
};

export default config;