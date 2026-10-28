// File: js/tailwind-config.js

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vintage: {
          cream: '#FDFBF7',
          darkbg: '#121212',
          carddark: '#1E1E1E',
          charcoal: '#1A1A1A',
          brown: '#5C4033',
          accent: 'rgb(var(--accent) / <alpha-value>)',
          action: '#BE5018',
          maroon: '#8B0000',
          paper: '#F4EFE6'
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Instrument Sans', 'sans-serif'],
        display: ['Fraunces', 'serif']
      }
    }
  }
};
