import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@uiw/react-md-editor/dist/mdeditor.css': path.resolve(__dirname, 'node_modules/@uiw/react-md-editor/dist/mdeditor.css'),
    },
  },
})
