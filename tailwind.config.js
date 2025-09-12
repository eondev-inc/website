/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  darkMode: 'class', // Habilita dark mode con clase CSS
  theme: {
    extend: {
      colors: {
        // Paleta inspirada en la imagen principal Coding.png
        primary: {
          50: '#f0fdfa', // Turquesa muy claro - del personaje
          100: '#ccfbf1', // Turquesa claro
          200: '#99f6e4', // Turquesa suave
          300: '#5eead4', // Turquesa medio claro
          400: '#2dd4bf', // Turquesa medio
          500: '#14b8a6', // Turquesa principal - color dominante del personaje
          600: '#0d9488', // Turquesa oscuro
          700: '#0f766e', // Turquesa muy oscuro
          800: '#115e59', // Turquesa profundo
          900: '#134e4a', // Turquesa muy profundo
          950: '#042f2e' // Turquesa extremo
        },
        secondary: {
          50: '#fdf4ff', // Malva muy claro - elementos decorativos
          100: '#fae8ff', // Malva claro
          200: '#f5d0fe', // Malva suave
          300: '#f0abfc', // Malva medio claro
          400: '#e879f9', // Malva medio
          500: '#d946ef', // Malva principal - de los elementos decorativos
          600: '#c026d3', // Malva oscuro
          700: '#a21caf', // Malva muy oscuro
          800: '#86198f', // Malva profundo
          900: '#701a75', // Malva muy profundo
          950: '#4a044e' // Malva extremo
        },
        accent: {
          50: '#fff7ed', // Naranja muy claro - del código
          100: '#ffedd5', // Naranja claro
          200: '#fed7aa', // Naranja suave
          300: '#fdba74', // Naranja medio claro
          400: '#fb923c', // Naranja medio
          500: '#f97316', // Naranja principal - del elemento de código
          600: '#ea580c', // Naranja oscuro
          700: '#c2410c', // Naranja muy oscuro
          800: '#9a3412', // Naranja profundo
          900: '#7c2d12', // Naranja muy profundo
          950: '#431407' // Naranja extremo
        },
        // Neutros cálidos inspirados en la imagen
        neutral: {
          50: '#fafaf9', // Casi blanco con ligero toque cálido
          100: '#f5f5f4', // Gris muy claro cálido
          200: '#e7e5e4', // Gris claro cálido
          300: '#d6d3d1', // Gris medio claro cálido
          400: '#a8a29e', // Gris medio cálido
          500: '#78716c', // Gris principal - tonos neutros de la imagen
          600: '#57534e', // Gris oscuro cálido
          700: '#44403c', // Gris muy oscuro cálido
          800: '#292524', // Gris profundo cálido
          900: '#1c1917', // Casi negro cálido
          950: '#0c0a09' // Negro cálido
        },

        // Verde menta elegante - del escritorio y elementos
        tertiary: {
          50: '#f0fdf4', // Verde menta muy claro - del escritorio
          100: '#dcfce7', // Verde menta claro
          200: '#bbf7d0', // Verde menta suave
          300: '#86efac', // Verde menta medio claro
          400: '#4ade80', // Verde menta medio
          500: '#22c55e', // Verde menta principal - de elementos del escritorio
          600: '#16a34a', // Verde menta oscuro
          700: '#15803d', // Verde menta muy oscuro
          800: '#166534', // Verde menta profundo
          900: '#14532d', // Verde menta muy profundo
          950: '#052e16' // Verde menta extremo
        },

        // Tonos cálidos de la imagen - sombras y detalles
        earth: {
          50: '#fefdf8', // Beige muy claro - tonos cálidos de la imagen
          100: '#fef9e7', // Beige claro
          200: '#fef3c7', // Beige suave
          300: '#fde68a', // Amarillo suave
          400: '#fcd34d', // Amarillo medio
          500: '#fbbf24', // Amarillo principal - acentos cálidos
          600: '#f59e0b', // Amarillo oscuro
          700: '#d97706', // Amarillo muy oscuro
          800: '#b45309', // Amarillo profundo
          900: '#92400e', // Amarillo muy profundo
          950: '#78350f' // Amarillo extremo
        },

        // Colores de estado refinados
        success: {
          50: '#f0fdf4',
          500: '#10b981',
          600: '#059669',
          700: '#047857'
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      fontFamily: {
        // Tipografía moderna y profesional
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'monospace']
      },
      fontSize: {
        // Sistema de tipografía escalable
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      spacing: {
        // Sistema de espaciado consistente
        18: '4.5rem',
        88: '22rem',
        128: '32rem'
      },
      borderRadius: {
        // Bordes modernos
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      boxShadow: {
        // Sombras modernas y sutiles
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        large: '0 10px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.15)'
      },
      backgroundImage: {
        // Gradientes modernos
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #ec4899 50%, #f97316 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
      },
      animation: {
        // Animaciones suaves y profesionales
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
        shimmer: 'shimmer 2s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: [
    require('flowbite/plugin'),
    // Plugin para mejor tipografía
    require('@tailwindcss/typography')
  ]
}
