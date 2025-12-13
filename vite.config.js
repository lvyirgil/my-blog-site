import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 本地开发环境下应为根路径
  plugins: [react()],
  resolve: {
    alias: {
      '@uiw/react-md-editor/dist/mdeditor.css': path.resolve(__dirname, 'node_modules/@uiw/react-md-editor/dist/mdeditor.css'),
    },
  },
})
