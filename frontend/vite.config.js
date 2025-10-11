import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api/": "https://ecomex-si8k.onrender.com",
      "/uploads/": "https://ecomex-si8k.onrender.com",
    },
  },
});
