module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          300: "#7dd3fc",
          500: "#0f766e",
          600: "#0f766e",
          700: "#115e59"
        },
        ink: "#0f172a"
      },
      boxShadow: {
        soft: "0 18px 45px -24px rgba(15, 23, 42, 0.28)",
        panel: "0 32px 90px -38px rgba(15, 23, 42, 0.42)"
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
