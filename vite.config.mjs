import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    server: {
      proxy: {
        "/api": "http://localhost:5001",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [path.resolve(__dirname, "node_modules")],
        },
      },
    },
    plugins: [react()],
  };
});
