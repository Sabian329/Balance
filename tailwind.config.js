/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#e8e8ed',
          blue: '#007aff',
          fill: '#636366',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)',
        'card-lg': '0 4px 20px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}

