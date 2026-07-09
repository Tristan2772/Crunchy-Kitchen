import tailwindcss from "@tailwindcss/vite";


// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2026-07-08',
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/hints", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      googleAuthEnabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "better-auth/vue",
      ],
    },
    plugins: [
      tailwindcss(),
    ],
  },
});
