import { visitParents as unistVisit } from 'unist-util-visit-parents'
import { visit as estreeVisit } from 'estree-util-visit'

export const defaultOptions = {
  layout: '@odinlin/astro-preview/components/PreviewLayout.astro',
}

export const EXAMPLE_COMPONENT_PREFIX = 'AstroPreviewCodeExample'

export const virtualFiles = new Map()

/**
 * @title 处理路径的斜杠
 */
export function toPOSIX(path) {
  if (!path) return path

  return path.replace(/\\/g, '/')
}

/**
 * @title 获取 code 元素上的属性，部分是配置属性，其他属性全部传递给对应 src 的组件
 * @eg <code layout="..." src="..." xxx="..." />
 */
export function getAttrs(attributes) {
  if (!Array.isArray(attributes)) {
    return { config: {}, props: [] }
  }

  const fields = ['layout', 'src']
  const config = attributes
    .filter(item => fields.includes(item.name))
    .reduce((prev, curr) => {
      prev[curr.name] = curr.value
      return prev
    }, {})
  const props = attributes.filter(item => !fields.includes(item.name))

  return { config, props }
}

/**
 * @title 根据路径和别名导入组件，等价于 `import xxxName from 'xxx'`
 * @description 导入之后在节点可直接通过别名渲染组件
 */
export function ensureImport(tree, imp) {
  let importExists = false

  unistVisit(tree, 'mdxjsEsm', (node) => {
    estreeVisit(node.data.estree, (node) => {
      if (node.type === 'ImportDeclaration') {
        if (node.source.value === imp.from) {
          if (
            imp.default &&
            node.specifiers.find((s) => s.local.name === imp.default)
          ) {
            importExists = true
          }
          if (
            imp.name &&
            node.specifiers.find((s) => s.imported.name === imp.name)
          ) {
            importExists = true
          }
        }
      }
    })
  })

  if (!importExists) {
    tree.children.push({
      type: 'mdxjsEsm',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: imp.default
                    ? 'ImportDefaultSpecifier'
                    : 'ImportSpecifier',
                  imported: {
                    type: 'Identifier',
                    name: imp.name,
                  },
                  local: {
                    type: 'Identifier',
                    name: imp.name,
                  },
                },
              ],
              source: {
                type: 'Literal',
                value: imp.from,
              },
            },
          ],
        },
      },
    })
  }
}


