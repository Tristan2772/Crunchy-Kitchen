import tailwindcss from "@tailwindcss/vite"
import { resolve } from "node:path"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
  ],
  colorMode: {
    preference: "system",
    fallback: "light",
  },
  css: ["~/assets/css/main.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  // Server runtime config
  runtimeConfig: {
    turso: {
      databaseUrl: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    },
    betterAuth: {
      secret: process.env.BETTER_AUTH_SECRET,
      url: process.env.BETTER_AUTH_URL,
    },
  },
  // Nitro config for Vercel
  nitro: {
    preset: "vercel",
    prerender: {
      routes: ["/", "/login", "/register"],
      crawlLinks: false,
    },
  },
  // App config
  app: {
    head: {
      title: "Crunchy Kitchen",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Kitchen inventory and meal planning" },
      ],
    },
  },
})