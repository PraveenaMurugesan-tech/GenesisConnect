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
          // Primary: Deep Navy / Dark Blue
          navy: {
            DEFAULT: "#0f2137",
            dark: "#0a1628",
            deep: "#060d19",
            light: "#1e3553",
            subtle: "#eef2f6",
          },
          // Secondary: Technical / Professional Blue
          blue: {
            DEFAULT: "#0284c7",
            dark: "#0369a1",
            light: "#38bdf8",
            50: "#f0f9ff",
            100: "#e0f2fe",
            600: "#0284c7",
            700: "#0369a1",
          },
          // Accent: Industrial Amber / Warm Gold
          accent: {
            DEFAULT: "#d97706",
            hover: "#b45309",
            light: "#fef3c7",
            amber: "#f59e0b",
          },
          // Neutrals & Surfaces
          bg: "#f8fafc",
          surface: {
            DEFAULT: "#ffffff",
            subtle: "#f8fafc",
            alt: "#f1f5f9",
          },
          border: {
            DEFAULT: "#e2e8f0",
            dark: "#cbd5e1",
            subtle: "#f1f5f9",
          },
          text: {
            primary: "#0f172a",
            secondary: "#334155",
            muted: "#64748b",
            subtle: "#94a3b8",
            inverse: "#ffffff",
          },
          // Status
          status: {
            success: "#16a34a",
            "success-bg": "#f0fdf4",
            error: "#dc2626",
            "error-bg": "#fef2f2",
            warning: "#d97706",
            "warning-bg": "#fffbeb",
            info: "#0284c7",
            "info-bg": "#f0f9ff",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        industrial: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        "industrial-md": "0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)",
        "industrial-lg": "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)",
        "industrial-card": "0 0 0 1px rgba(15, 23, 42, 0.05), 0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        "industrial-elevated": "0 10px 25px -5px rgba(15, 33, 55, 0.1), 0 8px 10px -6px rgba(15, 33, 55, 0.06)",
      },
    },
  },
  plugins: [],
};
