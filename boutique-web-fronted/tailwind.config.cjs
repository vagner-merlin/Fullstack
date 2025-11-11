/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
      },
      colors: {
        // Paleta de boutique moderna
        boutique: {
          'rose-pastel': '#F4C2C2',
          'rose-light': '#FFE5E5',
          'rose-dark': '#E8A4A4',
          'beige': '#F5E6D3',
          'gold': '#D4AF37',
          'black-matte': '#1A1A1A',
          'gray-soft': '#F5F5F5',
          'white': '#FFFFFF',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'hover': '0 6px 20px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'card': '16px',
      },
    },
  },
  plugins: [],
}
