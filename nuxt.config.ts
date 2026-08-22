import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  ssr: false,
  devtools: { enabled: false },
  css: ["~/assets/main.css"], 
  modules: ["@vite-pwa/nuxt"],
  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: "Todolist",
      meta: [
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "Todolist" },
      ],
      link: [
        { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      ],
    },
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Todolist",
      short_name: "Todolist",
      description: "اپلیکیشن مدیریت کارها",
      theme_color: "#111827",
      background_color: "#111827",
      display: "standalone",
      start_url: "/",
      lang: "fa",
      dir: "rtl",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2,ttf}"],
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
      pusherKey: process.env.NUXT_PUBLIC_PUSHER_KEY,
      pusherCluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER,
    },
  },
});