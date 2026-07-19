import { visit } from 'unist-util-visit'

/**
 * Remark 插件：将单个换行转换为 <br> 标签
 * 这样在 Obsidian 中使用一个回车换行，在网页上也能正确显示
 */
export default function remarkLineBreaks() {
  return (tree) => {
    visit(tree, (node) => {
      // 处理段落中的换行
      if (node.type === 'paragraph' && node.children) {
        const newChildren = []
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i]
          newChildren.push(child)

          // 如果当前是文本节点且包含换行符，将其拆分
          if (child.type === 'text' && child.value.includes('\n')) {
            const lines = child.value.split('\n')
            // 替换原来的文本节点
            newChildren.pop()

            for (let j = 0; j < lines.length; j++) {
              if (j > 0) {
                // 在换行处插入 <br> 节点
                newChildren.push({ type: 'break' })
              }
              if (lines[j]) {
                newChildren.push({ type: 'text', value: lines[j] })
              }
            }
          }
        }
        node.children = newChildren
      }
    })
  }
}
