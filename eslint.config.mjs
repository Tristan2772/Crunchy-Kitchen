import antfu from "@antfu/eslint-config";

// @ts-check
// Only import Nuxt eslint config if .nuxt exists (build time)
let withNuxt = (config) => config;
try {
  const fs = await import("node:fs");
  if (fs.existsSync("./.nuxt/eslint.config.mjs")) {
    const { default: nuxtConfig } = await import("./.nuxt/eslint.config.mjs");
    withNuxt = nuxtConfig;
  }
}
catch {
  // Fallback if .nuxt doesn't exist
}

export default withNuxt(antfu({
  type: "app",
  vue: true,
  typescript: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  ignores: ["**/migrations/*"],
}, {
  rules: {
    "vue/max-attributes-per-line": ["error", {
      singleline: {
        max: 3,
      },
      multiline: {
        max: 1,
      },
    }],
    "ts/no-redeclare": "off",
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": ["warn"],
    "antfu/no-top-level-await": ["off"],
    "node/prefer-global/process": ["off"],
    "node/no-process-env": ["error"],
    "perfectionist/sort-imports": ["error", {
      tsconfigRootDir: ".",
    }],
  },
}));
