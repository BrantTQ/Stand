import withMT from '@material-tailwind/react/utils/withMT.js';

/** @type {import('tailwindcss').Config} */
export default withMT( {
  darkMode: 'media', // NEW: auto dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // optional custom colors later
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark"], // allow dark theme tokens if you later apply data-theme
  },
});
