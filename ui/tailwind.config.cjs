const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,svelte,css,scss}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1f243c',
        gold: '#fcd34d',
        'orange-gold': '#f7d392',
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
