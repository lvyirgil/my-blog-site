import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/my-blog-site/', // 关键：为 GitHub Pages 设置正确的资源路径前缀
  plugins: [react()],
  resolve: {
    alias: {
      '@uiw/react-md-editor/dist/mdeditor.css': path.resolve(__dirname, 'node_modules/@uiw/react-md-editor/dist/mdeditor.css'),
    },
  },
})
