import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: "./private.key",
      cert: "./certificate.crt",
    },
  },
  plugins: [react()],
});
