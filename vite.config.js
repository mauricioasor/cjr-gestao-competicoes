import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` gera dist/index.html em arquivo único (fácil de publicar/abrir offline)
export default defineConfig({
  plugins: [react(), viteSingleFile()],
})
