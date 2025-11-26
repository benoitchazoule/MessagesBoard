import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";
import { copyFileSync } from "fs";

// Custom plugin to copy _redirects file
function copyRedirects() {
  return {
    name: "copy-redirects",
    closeBundle() {
      copyFileSync(
        resolve(__dirname, "public/_redirects"),
        resolve(__dirname, "dist/_redirects")
      );
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyRedirects()],
})
