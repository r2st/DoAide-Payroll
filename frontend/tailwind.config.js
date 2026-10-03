/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFFBEA",
          100: "#FFF3C4",
          200: "#FCE588",
          300: "#FADB5F",
          400: "#F7C948",
          500: "#F0B429",
          600: "#DE911D",
          700: "#CB6E17",
          800: "#B44D12",
          900: "#8D2B0B",
        },
      },
    },
  },
  plugins: [],
};
