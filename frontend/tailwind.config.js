/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: {
          900: "#4051B5",
          800: "#4C5FBB",
          700: "#5A6DC0",
          600: "#6B7CC5",
          500: "#7C8BCA",
          400: "#8E9AD0",
          300: "#A1A9D6",
          200: "#B5B9DB",
          100: "#D1D4E6",
        },
        neutral: {
          900: "#111329",
          800: "#1E2749",
          700: "#2E3968",
          600: "#3E4A87",
          500: "#525C96",
          400: "#6B74A9",
          300: "#858DBC",
          200: "#AFB5D1",
          100: "#D9DCE6",
        },
        white: {
          400: "#F5F7FC",
          300: "#F7F9FD",
          200: "#FAFBFE",
          100: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
