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
        'l1-blue': '#1792c7',
        'l2-green': '#17c76a',
        'you': '#b01',
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
