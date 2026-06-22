import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  server: {
    allowedHosts: true,
  },
  resolve: {
    conditions: ["browser", "module", "node", "development|production"],
  },
  // https://vitest.dev/config/
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    environment: "jsdom",
  },
});
