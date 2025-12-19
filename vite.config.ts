import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  // Use '/bee/' for production (GitHub Pages), '/' for local development
  base: process.env.NODE_ENV === 'production' ? '/bee/' : '/',
  plugins: [preact()],
});
