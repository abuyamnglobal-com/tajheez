import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Added src directory for completeness
  ],
  theme: {
    extend: {
      colors: {
        'tajheez-dark-navy': '#0A1A2F', // Primary UI, typography, cards
        'tajheez-orange': '#F26A1A',    // Buttons, highlights
        'tajheez-green': '#22C55E',     // Approved status (Tailwind default green-500)
        'tajheez-red': '#EF4444',       // Rejected status (Tailwind default red-500)
        'tajheez-orange-darker': '#D95C17', // Darker shade for orange hover
        'tajheez-green-light': '#D1FAE5', // Light shade for green status background
        'tajheez-orange-light': '#FFEAD5', // Light shade for orange status background
        'tajheez-red-light': '#FEE2E2',   // Light shade for red status background
        // Gray/White are typically covered by Tailwind's default palette,
        // but can be extended if specific shades are needed.
      },
    },
  },
  plugins: [],
};

export default config;
