import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/excel-to-jaz/",
  plugins: [react()],
  define: {
    __BASE_URL__: JSON.stringify("/excel-to-jaz-api"),
  },
});
