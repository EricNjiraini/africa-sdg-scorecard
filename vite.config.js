import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Change 'africa-sdg-scorecard' to match your actual GitHub repo name
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/africa-sdg-scorecard/',
})
