/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // slate-200
        input: 'var(--color-input)', // slate-50
        ring: 'var(--color-ring)', // cyan-500
        background: 'var(--color-background)', // slate-50
        foreground: 'var(--color-foreground)', // slate-900
        primary: {
          DEFAULT: 'var(--color-primary)', // blue-800
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // slate-900
          foreground: 'var(--color-secondary-foreground)', // slate-50
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-600
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // slate-200
          foreground: 'var(--color-muted-foreground)', // slate-500
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // cyan-500
          foreground: 'var(--color-accent-foreground)', // white
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)', // slate-900
        },
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)', // slate-900
        },
        success: {
          DEFAULT: 'var(--color-success)', // emerald-600
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-600
          foreground: 'var(--color-warning-foreground)', // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-600
          foreground: 'var(--color-error-foreground)', // white
        },
        surface: 'var(--color-surface)', // slate-200
        'text-primary': 'var(--color-text-primary)', // slate-900
        'text-secondary': 'var(--color-text-secondary)', // slate-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'elevation-3': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        '200': '200ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}