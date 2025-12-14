import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "url"
import { resolve } from "path"

const rootDir = fileURLToPath(new URL("./", import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(rootDir),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["tests/setupTests.ts"],
    passWithNoTests: true,
  },
})
