/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};
