import fs from 'fs'
import path from 'path'
import pkg from 'glob'
const { glob } = pkg

// 配置
const CONTENT_DIR = 'data'
const FILE_PATTERNS = ['**/*.md', '**/*.mdx']
const PUBLIC_IMAGE_PATH = 'public/static/images'

// 图片路径正则匹配：![alt](path)
const IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g

/**
 * 转换图片路径
 * 从 Obsidian 相对路径：../../../public/static/images/xxx.png
 * 转为 Next.js 路径：/static/images/xxx.png
 */
function convertImagePath(originalPath) {
  // 如果已经是正确格式，跳过
  if (originalPath.startsWith('/static/images/') || originalPath.startsWith('static/images/')) {
    return originalPath
  }

  // 查找 public/static/images 的位置
  const publicImageIndex = originalPath.indexOf(PUBLIC_IMAGE_PATH)
  if (publicImageIndex !== -1) {
    // 提取 public/static/images 之后的部分
    const relativePath = originalPath.substring(publicImageIndex + 'public'.length)
    return relativePath
  }

  // 如果路径包含 static/images 但没有 public 前缀
  if (originalPath.includes('static/images/') && !originalPath.startsWith('/')) {
    const staticImageIndex = originalPath.indexOf('static/images/')
    if (staticImageIndex !== -1) {
      return '/' + originalPath.substring(staticImageIndex)
    }
  }

  return originalPath
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    let modified = false
    let newContent = content

    // 替换所有图片路径
    newContent = content.replace(IMAGE_REGEX, (match, alt, src) => {
      const newSrc = convertImagePath(src)
      if (newSrc !== src) {
        modified = true
        console.log(`  转换: ${src}`)
        console.log(`    -> ${newSrc}`)
        return `![${alt}](${newSrc})`
      }
      return match
    })

    // 如果有修改，写回文件
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf-8')
      return true
    }
    return false
  } catch (error) {
    console.error(`处理文件失败: ${filePath}`, error.message)
    return false
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('开始转换图片路径...\n')

  // 查找所有文件
  const files = []
  for (const pattern of FILE_PATTERNS) {
    const matched = glob.sync(pattern, { cwd: CONTENT_DIR, absolute: true })
    files.push(...matched)
  }

  console.log(`找到 ${files.length} 个文件\n`)

  let convertedCount = 0

  // 处理每个文件
  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file)
    console.log(`处理: ${relativePath}`)

    if (processFile(file)) {
      convertedCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`完成！共转换 ${convertedCount} 个文件的图片路径`)
  console.log('='.repeat(50))
}

main().catch(console.error)
