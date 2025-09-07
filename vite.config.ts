import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Set base for GitHub Pages (serving under /bioark-website-renaissance/)
  // Override with env VITE_BASE if needed
  base: '/',
  server: {
    host: "::",
    port: 8080,
    // Proxy backend content API (uploads/static) for dev so that image URLs like
    // /content-api/uploads/... work directly in <img src> without absolute host.
    proxy: {
      "/content-api": {
        target: "http://localhost:4343",
        changeOrigin: true,
      },
      // Optional: forward Stripe API if used with relative paths
      "/stripe-api": {
        target: "http://localhost:4242",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
