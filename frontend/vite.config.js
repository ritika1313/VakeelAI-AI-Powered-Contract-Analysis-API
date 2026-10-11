import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Two plugins: one lets Vite understand JSX, the other turns on Tailwind.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
