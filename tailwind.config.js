/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [ './src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
  plugins: [],
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['active'],
      borderColor: ['active'],
    },
  },
}

