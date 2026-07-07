/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        primary: {
          DEFAULT: "#0ea5e9", // Bright Ocean Blue
          hover: "#0284c7",
        },
        secondary: {
          DEFAULT: "#0f172a", // Deep Navy
          hover: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(14, 165, 233, 0.05)",
        md: "0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)",
        lg: "0 10px 15px -3px rgba(14, 165, 233, 0.1), 0 4px 6px -2px rgba(14, 165, 233, 0.05)",
      },
    },
  },
  plugins: [],
};