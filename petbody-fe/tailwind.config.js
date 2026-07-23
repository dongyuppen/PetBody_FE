/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF8A00", // 펫바디의 메인 테마 컬러 (주황색 예시)
        secondary: "#FFC700",
      }
    },
  },
  plugins: [],
}