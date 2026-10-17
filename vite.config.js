import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import staticPages, { getResumeVersion } from './scripts/vite-plugin-static-pages.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), staticPages()],
  base: '/',
  define: {
    // Content hash of the resume PDF, so the link cache-busts only when the file changes
    'import.meta.env.VITE_RESUME_VERSION': JSON.stringify(getResumeVersion()),
  },
})
