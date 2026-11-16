/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // หัวข้อ/ตัวเลข: Chakra Petch (ฟอนต์ไทยทรงเหลี่ยมสายรถแข่ง)
        display: ['"Chakra Petch"', '"IBM Plex Sans Thai"', 'sans-serif'],
        sans: ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // แดงสดแบบสีรถแข่ง แทน red ของ Tailwind
        red: {
          50: '#FFF1F0',
          100: '#FFE0DE',
          200: '#FFC2BD',
          300: '#FF928A',
          400: '#FF5A4F',
          500: '#FF2E21',
          600: '#E10600',
          700: '#B80500',
          800: '#8F0400',
          900: '#5C0300',
          950: '#330100',
        },
        // เทากลาง ไม่อมน้ำเงิน
        slate: colors.neutral,
        honda: {
          red: '#E10600',
          black: '#0A0A0A',
          dark: '#121212',
          card: '#1A1A1A',
          border: '#2A2A2A',
        },
      },
      borderRadius: {
        // มุมเหลี่ยมทั้งเว็บ
        sm: '1px',
        DEFAULT: '2px',
        md: '2px',
        lg: '3px',
        xl: '4px',
        '2xl': '6px',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
