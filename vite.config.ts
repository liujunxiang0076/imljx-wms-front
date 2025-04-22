import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import DefineOptions from 'unplugin-vue-define-options/vite'

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
    // Vue插件
    vue(),
    // defineOptions 支持
    DefineOptions(),
    // 自动导入
    AutoImport({
      resolvers: [AntDesignVueResolver()],
      imports: ['vue', 'vue-router'],
      // 自动导入类型
      dts: 'src/auto-imports.d.ts',
    }),
    // 自动导入组件
    Components({
      // 自动导入组件类型
      resolvers: [
        // 自动导入组件类型
        AntDesignVueResolver({
          importStyle: false, // 已全局引入样式
        }),
      ],
      // 组件目录
      dirs: ['src/components', 'src/layouts/components', 'src/layouts/templates'],
      // 组件扩展名
      extensions: ['vue'],
      // 组件类型
      dts: 'src/components.d.ts',
    }),
  ],
})
