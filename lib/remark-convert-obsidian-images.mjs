import { visit } from 'unist-util-visit'

/**
 * Remark 插件：将 Obsidian 的图片路径格式转换为 Next.js 格式
 * 从：../../../public/static/images/xxx.png
 * 转为：/static/images/xxx.png
 */
export default function remarkConvertObsidianImages() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      if (node.url) {
        // 处理包含 public/static/images 的路径
        if (node.url.includes('public/static/images/')) {
          const publicImageIndex = node.url.indexOf('public/static/images/')
          if (publicImageIndex !== -1) {
            // 提取 public 之后的部分（包括前导斜杠）
            const afterPublic = node.url.substring(publicImageIndex + 'public'.length)
            // 确保以单个斜杠开头
            node.url = afterPublic.startsWith('/') ? afterPublic : '/' + afterPublic
          }
        }
        // 处理相对路径但不含 public 前缀的情况
        else if (node.url.includes('static/images/') && !node.url.startsWith('/')) {
          const staticImageIndex = node.url.indexOf('static/images/')
          if (staticImageIndex !== -1) {
            node.url = '/' + node.url.substring(staticImageIndex)
          }
        }
      }
    })
  }
}
