import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ruipeng: {
          blue: "#0054a6",
          dark: "#063b73",
          pale: "#eef6ff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
