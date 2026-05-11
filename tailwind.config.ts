import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af"
        },
        violetpro: {
          500: "#7c3aed",
          600: "#6d28d9"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.09)"
      }
    }
  },
  plugins: []
};

export default config;
