/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  plugins: [require("@tailwindcss/forms")],
  darkMode: "class",
  theme: {
    extend: {}
  }
};
