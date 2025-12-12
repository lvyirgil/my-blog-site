/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/typography')
  ],
  daisyui: {
    themes: [
      "wireframe", // 默认的亮色主题
      "dark", // 默认的暗色主题
    ],
  },
}