/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#32373b",
        contrast: "#f4fff8",
        primary: "#f5b700",
        secondary: "#a50104",
        accent: "#ef2d56",
      },
    },
  },
  plugins: [],
};
