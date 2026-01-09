import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      // Prompt user when update is available (you already handle UI)
      registerType: "prompt",
      injectRegister: "auto",

      // Enable SW only in dev when explicitly needed
      devOptions: {
        enabled: mode === "development",
        type: "module",
        navigateFallback: "index.html",
      },

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "maskable_icon.png",
      ],

      manifest: {
        name: "Hicool Fan Selection",
        short_name: "Hicool",
        description:
          "A modern fan selection and configuration tool for Hicool fans.",

        display: "standalone",
        display_override: ["window-controls-overlay", "standalone", "browser"],
        start_url: "/",
        scope: "/",

        theme_color: "#f7f7f9",
        background_color: "#f7f7f9",

        orientation: "any",
        lang: "en",
        dir: "ltr",
        categories: ["utilities", "engineering"],

        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false, // controlled via updateServiceWorker(true)

        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],

        runtimeCaching: [
          // HTML – always try network first (important for updates)
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              networkTimeoutSeconds: 3,
            },
          },

          // JS & CSS – fast load with background update
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
            },
          },

          // Images – aggressive caching
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],

  build: {
    target: "es2018", // better for modern browsers & smaller bundles
    sourcemap: false,
    minify: "esbuild",
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },

  server: {
    historyApiFallback: true,
    port: 5173,
  },
}));
