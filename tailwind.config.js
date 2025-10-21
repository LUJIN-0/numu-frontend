/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 👈 crucial
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          light: "#f9fafb", // very light gray
          dark: "#111827", // dark slate
        },
        sidebarText: {
          light: "#374151", // neutral text
          dark: "#e5e7eb", // light gray text
        },
        hover: {
          light: "#e5e7eb", // hover for light theme
          dark: "#1f2937", // hover for dark theme
        },
      },
    },
  },
  plugins: [],
};
