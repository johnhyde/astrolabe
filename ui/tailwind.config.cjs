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
        'gold-s1': '#e3be45',
        'gold-s2': '#caa93e',
        'gold-s3': '#b09436',
        'gold-s4': '#977f2e',
        'gold-s5': '#7e6a27',
        'gold-s6': '#65541f',
        'gold-s7': '#4c3f17',
        'gold-s8': '#322a0f',
        'gold-s9': '#191508',
        'gold-t1': '#fcd75f',
        'gold-t2': '#fddc71',
        // 'gold-t3': 'b09436',
        'gold-t4': '#fde594',
        // 'gold-t5': '7e6a27',
        'gold-t6': '#feedb8',
        // 'gold-t7': '4c3f17',
        'gold-t8': '#fef6db',
        // 'gold-t9': '191508',
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
