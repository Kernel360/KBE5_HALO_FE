import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  // 프록시 설정을 통해 아래와 같이 처리된다
  // 브라우저 요청: http://localhost:3000/api/users
  // 실제 전송됨:   http://localhost:8080/api/users
  server: {
    port: 5173, // 프론트 개발 서버 포트(Vite)
    proxy: {
      "/api": {
        target: "http://localhost:8080", // TODO: 백엔드 서버 주소, 추후 변경 필요
        changeOrigin: true, // CORS 우회용 (Origin 헤더 변경)
      },
    },
  },
});
