import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#121212', // Material Dark
        surface: '#1e1e1e', // Slightly lighter
        // Audiobookshelf native primary is roughly Amber/Orange
        primary: {
            DEFAULT: '#dca54c', 
            foreground: '#000000'
        },
        secondary: '#2f2f2f', 
        accent: '#dca54c',
        muted: {
            DEFAULT: '#2f2f2f',
            foreground: '#a1a1aa'
        },
        card: {
            DEFAULT: '#1e1e1e',
            foreground: '#ededed'
        },
        border: '#2f2f2f',
        input: '#2f2f2f',
        ring: '#dca54c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [tailwindAnimate],
};
export default config;