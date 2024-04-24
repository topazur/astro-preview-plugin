# Astro Preview

Forked from [astro-live-code](https://github.com/mattjennings/astro-live-code) by [Matt Jennings](https://github.com/mattjennings).

## Install

[![npm](https://img.shields.io/npm/v/@odinlin/astro-preview?color=blue&label=npm)](https://www.npmjs.com/package/@odinlin/astro-preview)

```bash
npm install @odinlin/astro-preview
```

```js {2,7} title="astro.config.mjs"
import { defineConfig } from 'astro/config'
import preview from '@odinlin/astro-preview'

export default defineConfig({
  integrations: [
    // ... other integrations
    preview({
      // layout: './src/MyLayout.astro',
    }),
  ],
})
```

## Useage

```html
<!-- React case -->
<code client:only="react" src="src/components/ReactDemo.tsx" propA="a" style={{ width:'80%' }}>
  <span>子节点</span>
</code>

<!-- Vue case -->
<code client:only="vue" src="src/components/VueDemo.vue" propA="a" style="width: 80%">
  <span>子节点</span>
</code>
```
