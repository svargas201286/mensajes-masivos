const {nextui} = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        limpiolux: {
          500: '#0075A9',
          600: '#0075A9',
        },
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}