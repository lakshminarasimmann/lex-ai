import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core Backgrounds
        'bg-primary': '#090B0F',
        'bg-secondary': '#11151C',
        'bg-elevated': '#171C25',
        'bg-card': '#1A202B',
        'bg-hover': '#242B36',

        // Legal Accent Colors
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FBF6E7',
          100: '#F5EACC',
          200: '#EBD599',
          300: '#E1C066',
          400: '#D4AF37',
          500: '#B8960E',
          600: '#8C720A',
          700: '#604E07',
          800: '#342B04',
          900: '#1A1502',
        },
        bronze: {
          DEFAULT: '#B8860B',
          400: '#D4A033',
          500: '#B8860B',
          600: '#8C6608',
        },
        accent: {
          emerald: '#10B981',
          crimson: '#EF4444',
          amber: '#F59E0B',
          blue: '#3B82F6',
          purple: '#7C3AED',
        },

        // Risk colors
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#f97316',
          critical: '#EF4444',
        },

        // Surface colors
        surface: {
          50: 'rgba(255, 255, 255, 0.02)',
          100: 'rgba(255, 255, 255, 0.04)',
          200: 'rgba(255, 255, 255, 0.06)',
          300: 'rgba(255, 255, 255, 0.08)',
        },

        // Text colors
        'text-primary': '#F8FAFC',
        'text-secondary': '#A8B3C7',
        'text-muted': '#667085',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        label: ['var(--font-ibm-plex-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #090B0F 0%, #11151C 25%, #090B0F 50%, #171C25 75%, #11151C 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(212, 175, 55, 0.04) 0%, rgba(212, 175, 55, 0.01) 100%)',
        'risk-gradient': 'linear-gradient(135deg, #EF4444 0%, #F59E0B 50%, #10B981 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
        'gold-subtle': 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 134, 11, 0.05) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'slide-up': 'slide-up 0.35s ease-out',
        'slide-down': 'slide-down 0.35s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'needle-sweep': 'needle-sweep 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'border-flow': 'border-flow 3s linear infinite',
        'scan-line': 'scan-line 3s ease-in-out infinite',
        'counter-up': 'counter-up 0.8s ease-out forwards',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.25)' },
        },
        'needle-sweep': {
          '0%': { transform: 'rotate(-90deg)' },
          '100%': { transform: 'rotate(var(--needle-angle, 0deg))' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        'counter-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
        'glow-gold': '0 0 30px rgba(212, 175, 55, 0.15)',
        'glow-gold-lg': '0 0 60px rgba(212, 175, 55, 0.2)',
        'glow-risk': '0 0 20px rgba(239, 68, 68, 0.15)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.15)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
