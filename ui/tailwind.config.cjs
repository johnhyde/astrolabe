const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,svelte,css}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1f243c',
        gold: '#fcd34d',
      }
    },
    screens: {
      '2xs': '360px',
      'xs': '475px',
      ...defaultTheme.screens,
    },
  },
  screens: {
  },
  plugins: []
};
