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
        'cyber-aqua': '#39c5cf',
        'electric-blue': '#00a6ed',
        'soft-teal': '#2dd4bf',
        'deep-cyan': '#007ea7',
        'turquoise-glow': '#3edbf0',
        'cyber-black': '#0b0f14',
        'graphite-gray': '#24292e',
        'cool-silver': '#adb5bd',
        'smoke-gray': '#6c757d',
        'cyber-purple': '#6f42c1',
        'magenta-flash': '#d63384',
        'neon-violet': '#5e60ce',
        'ultraviolet': '#3b2e5a',
        'cyber-orange': '#f77f00',
        'lava-red': '#d62828',
        'amber-glow': '#fcbf49',
        'cyber-gold': '#ffc300',
      },
    },
  },
  plugins: [],
};
