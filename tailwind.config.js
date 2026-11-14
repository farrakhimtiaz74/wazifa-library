/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        deep: '#062C22',
        charcoal: '#121212',
        gold: '#D4AF37',
        cream: '#FAF8F5',
        forest: '#0D4F3C'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', '"Scheherazade New"', 'serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif']
      }
    }
  },
  plugins: []
}
