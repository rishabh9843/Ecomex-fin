import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".",
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api/": "https://ecomex-fin.onrender.com/",
      "/uploads/": "https://ecomex-fin.onrender.com/",
    },
  },
});
