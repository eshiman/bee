import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { copyFileSync } from "fs";
import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Use '/bee/' for production (GitHub Pages), '/' for local development
  base: process.env.NODE_ENV === 'production' ? '/bee/' : '/',
  plugins: [
    preact(),
    // Plugin to copy index.html to 404.html for GitHub Pages SPA routing
    {
      name: 'copy-404',
      closeBundle() {
        const distPath = join(process.cwd(), 'dist');
        copyFileSync(join(distPath, 'index.html'), join(distPath, '404.html'));
      },
    },
  ],
});
