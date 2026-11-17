import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 相对路径：dist 里的 index.html 双击（file://）也能找到资源
  base: './',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5179,
    strictPort: true,
    watch: {
      // 编辑器写文件时会先在 .xxx.tmpdir/ 里落临时文件再改名，
      // Vite 的 watcher 去 watch 这种瞬间消失的临时文件会 EBUSY 把 dev 进程带走。
      // 干脆忽略所有点开头的东西（临时脚本、临时目录都在里面）。
      ignored: ['**/.shots/**', '**/.edge-profile/**', '**/dist/**', '**/.tmp*/**', '**/.*'],
    },
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      // 多页：首页 + 作品集 + 关于
      input: {
        main: resolve(__dirname, 'index.html'),
        works: resolve(__dirname, 'works.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
})
