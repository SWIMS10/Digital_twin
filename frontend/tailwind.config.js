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
        space: {
          950: '#040711',
          900: '#080e1e',
          850: '#0d162c',
          800: '#121f3d',
          750: '#17274c',
          700: '#1f3363',
          600: '#2a4380',
          500: '#3b5fa8',
        },
        navy: {
          900: '#060d1f',
          800: '#0b162f',
          700: '#102043',
          600: '#193061',
        },
        cyber: {
          cyan: '#00f2fe',
          teal: '#4facfe',
          blue: '#2563eb',
          neon: '#00ffc8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.35)',
        'glow-blue': '0 0 20px -5px rgba(59, 130, 246, 0.35)',
        'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.35)',
        'panel': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.1)',
      }
    },
  },
  plugins: [],
}

