import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  ssr: false,
  devtools: { enabled: false },
  css: ["~/assets/main.css"], 
  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head:{
      title: "Todolist"
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
    },
  },
});