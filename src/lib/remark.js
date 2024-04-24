import path from 'path'
import fs from 'fs'
import { visitParents as unistVisit } from 'unist-util-visit-parents'
import { EXAMPLE_COMPONENT_PREFIX, virtualFiles, toPOSIX, getAttrs, ensureImport } from './helper.js'

/**
 * @title 修改 markdown 节点
 * @param {import('./index.js').PreviewOptions} options
 * @returns
 */
export default function remark(options) {
  return function transformer(tree, file) {
    let examples = []

    unistVisit(tree, 'mdxJsxFlowElement', (node, parents) => {

      // 仅处理 <code src="..." /> 的元素
      if (node.name === 'code') {
        const { config, props } = getAttrs(node.attributes)

        if (config.src) {
          // 基于 cwd 的绝对路径
          const absolutePath = path.join(process.cwd(), config.src)
          const content = fs.readFileSync(absolutePath, { encoding: 'utf8' })
            .toString()
            .replace(/\n/g, '\r\n')

          // eg: .tsx => tsx
          const lang = path.extname(config.src).replace('.', '')
          // eg: src/content/docs/index.mdx
          const parentId = toPOSIX(file.history[0].split(toPOSIX(process.cwd()))[1].slice(1))
          // eg: ${EXAMPLE_COMPONENT_PREFIX}_NO_0
          const exampleComponentName = `${EXAMPLE_COMPONENT_PREFIX}_NO_${examples.length}`
          // eg: src/content/docs/index-${EXAMPLE_COMPONENT_PREFIX}_0.tsx
          const filename = toPOSIX(`${parentId.replace(path.extname(parentId), '')}-${exampleComponentName}.${lang}`,)

          examples.push({ filename, src: content })
          virtualFiles.set(filename, {
            src: content,
            parent: parentId,
            updated: Date.now(),
          })

          // 导入预览布局组件（可以是默认的options.layout；也可以是自定义attr.layout）
          const layout = toPOSIX(config.layout || options.layout)
          const layoutName = layout === options.layout ? 'Example' : `Example${i}`
          ensureImport(tree, {
            from: layout,
            name: layoutName,
            default: true,
          })

          // 导入预览组件（来源于 code 节点的 src 属性）
          ensureImport(tree, {
            from: absolutePath,
            name: exampleComponentName,
            default: true,
          })

          // 重新包装的新节点，外层是布局组件，children是通过插槽传递的预览组件和代码展示组件
          // eg: <code layout="..." src="..." xxx="...">子节点</code>
          // 注意：预览组件接受来自 code 节点的部分属性和所有子节点
          const newNode = {
            type: 'mdxJsxFlowElement',
            name: layoutName,
            data: { _mdxExplicitJsx: true, _example: true },
            attributes: [
              { type: 'mdxJsxAttribute', name: 'content', value: content },
              { type: 'mdxJsxAttribute', name: 'exampleName', value: exampleComponentName },
            ],
            children: [
              {
                type: 'mdxJsxFlowElement',
                name: 'slot',
                data: { _mdxExplicitJsx: true },
                attributes: [
                  { type: 'mdxJsxAttribute', name: 'slot', value: 'example' },
                ],
                children: [
                  {
                    type: 'mdxJsxFlowElement',
                    name: exampleComponentName,
                    attributes: props,
                    children: node.children,
                  },
                ],
              },
              {
                type: 'mdxJsxFlowElement',
                name: 'slot',
                data: { _mdxExplicitJsx: true },
                attributes: [
                  { type: 'mdxJsxAttribute', name: 'slot', value: 'code' },
                ],
                children: [
                  { type: 'code', lang: lang, value: content }
                ],
              },
            ],
          }

          const parent = parents[parents.length - 1]
          const childIndex = parent.children.indexOf(node)
          parent.children.splice(childIndex, 1, newNode)
        }

      }

    })
  }
}
