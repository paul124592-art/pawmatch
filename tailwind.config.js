/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        paw: {
          green: '#2E7D5B',
          dark: '#1F3D2B',
          cream: '#FFF8EC',
          gold: '#F2B705',
          coral: '#E86A5A',
        },
      },
    },
  },
  plugins: [],
}
