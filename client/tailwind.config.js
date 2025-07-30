/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // EDU21 Brand Colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Chilean Education Subject Colors
        subjects: {
          matematica: '#ff6b6b',
          lenguaje: '#4ecdc4',
          ciencias: '#45b7d1',
          historia: '#f9ca24',
          ingles: '#6c5ce7',
          educacion_fisica: '#a29bfe',
          artes: '#fd79a8',
          tecnologia: '#00b894',
          religion: '#fdcb6e',
          filosofia: '#e17055',
        },
        // Game Status Colors
        game: {
          waiting: '#fbbf24',
          active: '#10b981',
          finished: '#6366f1',
          error: '#ef4444',
        },
        // Role Colors
        roles: {
          super_admin: '#dc2626',
          admin_escolar: '#7c3aed',
          bienestar: '#059669',
          teacher: '#2563eb',
          student: '#0891b2',
          guardian: '#ea580c',
          sostenedor: '#be123c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'confetti': 'confetti 3s ease-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        confetti: {
          '0%': { transform: 'translateY(-100vh) rotateZ(0deg)' },
          '100%': { transform: 'translateY(100vh) rotateZ(720deg)' },
        }
      },
      boxShadow: {
        'game': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 