/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        primary: {
          light: "#EAF4FB",
          DEFAULT: "#3B9EE8",
          dark: "#2478C4",
        },
        secondary: {
          DEFAULT: "#16233A",
          dark: "#0F1826",
        },
        neutral: {
          heading: "#16233A",
          body: "#5B7A99",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ['"Space Grotesk"', "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(14, 165, 233, 0.05)",
        md: "0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)",
        lg: "0 10px 15px -3px rgba(14, 165, 233, 0.1), 0 4px 6px -2px rgba(14, 165, 233, 0.05)",
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'blob': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up-delay-1': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards',
        'blob': 'blob 7s infinite',
      },
    },
  },
  plugins: [],
};