/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0062E6',
          light: '#3D85FF',
          dark: '#0046A8',
        },
        secondary: {
          DEFAULT: '#F5F9FF',
          dark: '#E6F0FF',
        },
        accent: {
          DEFAULT: '#FF5757',
          light: '#FF7878',
          dark: '#E63939',
        },
        success: {
          DEFAULT: '#28C76F',
          light: '#4AD890',
          dark: '#1EA45A',
        },
        warning: {
          DEFAULT: '#FFC107',
          light: '#FFCE39',
          dark: '#E6AC00',
        },
        info: {
          DEFAULT: '#17A2B8',
          light: '#40BFD2',
          dark: '#0D8A9A',
        },
        danger: {
          DEFAULT: '#DC3545',
          light: '#E25D6A',
          dark: '#B02A37',
        },
        dark: '#1D2939',
        gray: {
          light: '#F8F9FA',
          DEFAULT: '#8A94A6',
          dark: '#344054',
        },
        white: '#FFFFFF',
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      width: {
        '250': '250px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'button': '0 4px 12px rgba(0, 98, 230, 0.15)',
        'navbar': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 10px 25px rgba(0, 0, 0, 0.12)',
      },
      fontFamily: {
        'sans': ['Inter', 'Noto Sans KR', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

