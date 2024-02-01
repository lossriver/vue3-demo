import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // port: 8080 //指定端口号

    proxy: {
      '/user': {
        target: "http://localhost:3001/"
      }
    }
  },

  base: './', //打包相对路径
})
