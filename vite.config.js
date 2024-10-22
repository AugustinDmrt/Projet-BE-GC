import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/Projet-BE-GC/", // Ajoute le nom de ton repo ici
});
