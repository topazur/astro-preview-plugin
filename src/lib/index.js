import remark from './remark.js'
import vite from './vite.js'
import { defaultOptions } from './helper.js'

/**
 * @typedef {{
 * layout?: string
 * }} PreviewOptions
 */

/**
 * @title 插件主要逻辑
 * @param {PreviewOptions} options
 * @returns {import('astro').AstroIntegration}
 */
export default function (options = {}) {
  const newOptions = Object.assign({}, defaultOptions, options)

  return {
    name: '@odinlin/astro-preview',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [
              [remark, newOptions],
            ],
          },
          vite: {
            plugins: [
              vite(newOptions),
            ],
          },
        })
      },
    },
  }
}
