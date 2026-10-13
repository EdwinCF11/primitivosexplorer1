import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(), 
      tailwindcss(), 
      // Solo activamos viteSingleFile cuando hacemos "npm run build", 
      // evitando que rompa el servidor de desarrollo (npm run dev)
      command === 'build' ? viteSingleFile() : null
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});