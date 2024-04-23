import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'
import vue from '@astrojs/vue'

import preview from './src/lib/index.js'

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: [
        {
          // 别名与包名相同的目的是，开发环境和安装依赖使用两种场景的依赖导入路径一致
          find: '@odinlin/astro-preview',
          replacement: '/src/lib',
        },
      ],
    },
  },
  integrations: [
    starlight({
      title: 'Astro Preview',
      social: {
        github: 'https://github.com/topazur/astro-preview-plugin.git',
      },
      tableOfContents: {
        minHeadingLevel: 1,
      },
      sidebar: [
        {
          label: 'Guides',
          autogenerate: {
            directory: 'guides',
          },
        },
      ],
    }),
    preview({}),
    react(),
    vue(),
  ],
})
