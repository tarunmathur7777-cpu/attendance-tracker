/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // Indigo 500
          hover: '#4f46e5', // Indigo 600
        },
        secondary: {
          DEFAULT: '#818cf8', // Indigo 400
          hover: '#6366f1', // Indigo 500
        },
        accent: {
          DEFAULT: '#f43f5e', // Rose 500
        },
        background: {
          light: '#f8fafc', // Slate 50
          dark: '#0f172a', // Slate 900
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b', // Slate 800
        },
        surfaceVariant: {
          light: '#f1f5f9', // Slate 100
          dark: '#334155', // Slate 700
        },
        text: {
          light: '#0f172a',
          dark: '#f8fafc',
          muted: {
            light: '#64748b',
            dark: '#cbd5e1',
          }
        },
        border: {
          light: '#e2e8f0', // Slate 200
          dark: '#334155', // Slate 700
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
      }
    },
  },
  plugins: [],
}
