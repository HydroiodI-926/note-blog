/**
 * 笔记仓库同步脚本
 *
 * 在构建时从另一个 Git 仓库拉取笔记，合并到 data/blog 目录。
 * 通过环境变量配置：
 *   NOTES_REPO_URL  - 笔记仓库地址（如 https://github.com/user/notes.git）
 *   NOTES_BRANCH    - 分支名（默认 main）
 *   NOTES_SUBDIR    - 仓库内存放笔记的子目录（默认为仓库根目录）
 *   NOTES_TARGET    - 本地目标目录（默认 data/blog/notes-synced）
 *
 * 用法：
 *   NOTES_REPO_URL=https://github.com/user/notes.git node scripts/sync-notes.mjs
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const REPO_URL = process.env.NOTES_REPO_URL || ''
const BRANCH = process.env.NOTES_BRANCH || 'main'
const SUBDIR = process.env.NOTES_SUBDIR || ''
const TARGET = process.env.NOTES_TARGET || path.join(rootDir, 'data/blog/notes-synced')
const TMP_DIR = path.join(rootDir, '.tmp-notes-sync')

if (!REPO_URL) {
  console.log('[sync-notes] NOTES_REPO_URL 未设置，跳过笔记同步')
  process.exit(0)
}

console.log(`[sync-notes] 开始同步笔记仓库: ${REPO_URL}`)

// 清理临时目录
if (fs.existsSync(TMP_DIR)) {
  fs.rmSync(TMP_DIR, { recursive: true, force: true })
}

try {
  // 浅克隆笔记仓库
  console.log(`[sync-notes] 克隆分支 ${BRANCH} ...`)
  execSync(`git clone --depth 1 --branch ${BRANCH} "${REPO_URL}" "${TMP_DIR}"`, {
    stdio: 'inherit',
    cwd: rootDir,
  })
} catch (err) {
  // 如果指定分支失败，尝试 master
  if (BRANCH !== 'master') {
    console.log(`[sync-notes] 分支 ${BRANCH} 不存在，尝试 master ...`)
    execSync(`git clone --depth 1 --branch master "${REPO_URL}" "${TMP_DIR}"`, {
      stdio: 'inherit',
      cwd: rootDir,
    })
  } else {
    console.error('[sync-notes] 克隆失败:', err.message)
    process.exit(1)
  }
}

// 确定源目录
const sourceDir = SUBDIR ? path.join(TMP_DIR, SUBDIR) : TMP_DIR

if (!fs.existsSync(sourceDir)) {
  console.warn(`[sync-notes] 源目录不存在: ${sourceDir}`)
  process.exit(0)
}

// 确保目标目录存在
if (!fs.existsSync(TARGET)) {
  fs.mkdirSync(TARGET, { recursive: true })
}

// 复制 markdown/mdx 文件（保留目录结构）
function copyMarkdownFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      // 跳过隐藏目录和 node_modules
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true })
      }
      copyMarkdownFiles(srcPath, destPath)
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
      }
      fs.copyFileSync(srcPath, destPath)
      console.log(`[sync-notes] 同步: ${path.relative(TMP_DIR, srcPath)}`)
    }
  }
}

// 同步图片等静态资源到 public 目录
function copyStaticAssets(src, dest) {
  const imageExts = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true })
      }
      copyStaticAssets(srcPath, destPath)
    } else if (imageExts.test(entry.name)) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
      }
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

console.log('[sync-notes] 复制笔记文件 ...')
copyMarkdownFiles(sourceDir, TARGET)

// 如果笔记仓库有 images 目录，复制到 public/static/images/notes
const imagesDir = path.join(sourceDir, 'images')
if (fs.existsSync(imagesDir)) {
  const publicImagesDir = path.join(rootDir, 'public/static/images/notes')
  console.log('[sync-notes] 复制图片资源 ...')
  copyStaticAssets(imagesDir, publicImagesDir)
}

// 清理临时目录
fs.rmSync(TMP_DIR, { recursive: true, force: true })
console.log('[sync-notes] 同步完成！')
