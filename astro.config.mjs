import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import dotenv from 'dotenv';
import compress from "astro-compress";
if (process.env.environment == "development") {
  console.log("Development Environment");
  const envPath = '.env';
  dotenv.config({
    path: envPath
  });
} else {
  console.log("Production Environment");
}


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), compress()]
});