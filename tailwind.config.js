/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./index.tsx", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        yellowSoft: "#FFD700", // par exemple, saffron
        green800: "#166534",
        dark: "#0D0D0D",
      },
    },
  },
};