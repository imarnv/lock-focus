/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#000000',
        primary: {
           DEFAULT: '#2563EB',
           foreground: '#ffffff'
        },
        secondary: {
            DEFAULT: '#f3f4f6',
            foreground: '#1f2937'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
