/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        genesis: {
          dark: "#0a1120",
          navy: "#0f2137",
          steel: "#1e3a5f",
          blue: "#0284c7",
          accent: "#f59e0b",
          amber: "#d97706",
          light: "#f8fafc",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
