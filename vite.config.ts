import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  // 别名
  resolve: {
    // 路径别名
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue-router': 'vue-router/dist/vue-router.esm-bundler.js',
    },
    // 优化依赖
    dedupe: ['vue', 'vue-router']
  },
  // 开发服务器
  server: {
    port: 8080, // 端口
    hmr: {
      overlay: false, // 禁用HMR错误覆盖
    },
  },
  // 优化依赖
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'ant-design-vue',
      '@ant-design/icons-vue'
    ]
  },
  // 插件
  plugins: [
    vue(),
    AutoImport({
      resolvers: [AntDesignVueResolver()],
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // 已全局引入样式
        }),
      ],
      dirs: ['src/components', 'src/layouts/components'],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
    }),
  ],
})
