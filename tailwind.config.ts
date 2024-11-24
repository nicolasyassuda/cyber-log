/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#0d1117',
        'cyber-gray': '#161b22',
        'cyber-green': '#1f6feb',
      },
    },
  },
  plugins: [],
};
