import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/adapter-vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: "server",
  adapter: vercel()
});
