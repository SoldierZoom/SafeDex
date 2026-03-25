module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        silkscreen: ['Silkscreen', 'cursive'],
      },
      colors: {
        hc: {
          bg: "#000000",
          text: "#ffe066",
          border: "#ffe066",
          layer: "#111111",
        }
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('hc', '.high-contrast &')
    },
  ],
}


