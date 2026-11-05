/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#090d16',
        surface: {
          DEFAULT: '#0f172a',
          card: '#1e293b',
          elevated: '#273549',
          border: '#334155',
        },
        cyber: {
          sky: '#38bdf8',
          amber: '#f59e0b',
          emerald: '#10b981',
          indigo: '#818cf8',
          purple: '#a855f7',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
