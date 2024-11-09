/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        fullbg: "#F3EEEE",
        primary: "#484646",
        secondary: "#CBC8C8",
        brandGray: "#777272",
        brandWhite: "#eeeeee",
      },
      fontFamily: {
        verdana: ["Verdana", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
