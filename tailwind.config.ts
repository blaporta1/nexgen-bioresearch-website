import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0E1B2E',
          deep: '#0E1B2E',
          light: '#162440',
          lighter: '#1D3057',
        },
        signal: {
          DEFAULT: '#1568D3',
          dark: '#0F4FA8',
          deeper: '#0A3880',
          light: '#3A85E0',
          '10': '#E8F1FB',
          '30': '#B3CDEF',
          '60': '#6BA3E2',
        },
        slate: '#5B6B80',
        frost: '#C2D8E0',
        cloud: '#F4F7FB',
      },
      fontFamily: {
        sans: ['var(--font-bricolage)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display': ['72px', { lineHeight: '1.05', fontWeight: '780' }],
        'h1': ['52px', { lineHeight: '1.1', fontWeight: '680' }],
        'h2': ['36px', { lineHeight: '1.15', fontWeight: '680' }],
        'h3': ['24px', { lineHeight: '1.2', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
