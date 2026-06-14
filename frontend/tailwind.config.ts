import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base
        bg: {
          primary:   '#0C0C0E',
          secondary: '#131316',
          tertiary:  '#1A1A1F',
          hover:     '#21212A',
        },
        border: {
          subtle:  'rgba(255,255,255,0.06)',
          DEFAULT: 'rgba(255,255,255,0.10)',
          strong:  'rgba(255,255,255,0.18)',
        },
        text: {
          primary:   '#FFFFFF',
          secondary: 'rgba(255,255,255,0.60)',
          muted:     'rgba(255,255,255,0.35)',
          disabled:  'rgba(255,255,255,0.20)',
        },
        // Brand accent — electric violet
        brand: {
          50:  '#F0EFFE',
          100: '#DDD9FD',
          200: '#BBB4FB',
          400: '#7B6CF7',
          500: '#6356F5',
          600: '#4D42D4',
          700: '#3A30A8',
          800: '#29217C',
          900: '#1A1552',
        },
        // Status
        success: '#22C55E',
        warning: '#F59E0B',
        error:   '#EF4444',
        info:    '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        'xs':  ['12px', { lineHeight: '16px' }],
        'sm':  ['14px', { lineHeight: '20px' }],
        'base':['16px', { lineHeight: '24px' }],
        'lg':  ['18px', { lineHeight: '28px' }],
        'xl':  ['20px', { lineHeight: '30px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '38px' }],
        '4xl': ['36px', { lineHeight: '44px' }],
        '5xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        '6xl': ['60px', { lineHeight: '68px', letterSpacing: '-0.025em' }],
        '7xl': ['72px', { lineHeight: '80px', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        'sm':  '6px',
        'md':  '10px',
        'lg':  '14px',
        'xl':  '18px',
        '2xl': '24px',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
        'glow':       'glow 2s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glow:    { '0%,100%': { boxShadow: '0 0 20px rgba(99,86,245,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(99,86,245,0.6)' } },
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'radial-brand': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,86,245,0.15), transparent)',
      },
    },
  },
  plugins: [],
}
export default config
