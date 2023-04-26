/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        contextOpen: {
          from: {
            opacity: 0,
            transform: "translateX(-15px)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        contextClose: {
          from: {
            opacity: 1,
            transform: "translateX(0)",
          },
          to: {
            opacity: 1,
            transform: "translateX(-15px)",
          },
        },
      },
      animation: {
        contextOpen: "contextOpen 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        contextClose: "contextClose 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
