import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel";

// https://astro.build/config
// Updated: 2025-11-14 - Server mode for Vercel deployment
export default defineConfig({
  integrations: [tailwind()],
  output: "server",
  adapter: vercel()
});
