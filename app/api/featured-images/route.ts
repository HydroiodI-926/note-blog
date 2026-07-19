import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const imagesDir = path.join(process.cwd(), 'public/static/images/featured')

  if (!fs.existsSync(imagesDir)) {
    return NextResponse.json({ categories: [] })
  }

  const entries = fs.readdirSync(imagesDir, { withFileTypes: true })
  const categories: { name: string; images: { src: string; alt: string }[] }[] = []

  // 读取子目录作为分类
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const categoryPath = path.join(imagesDir, entry.name)
      const files = fs.readdirSync(categoryPath)
      const images = files
        .filter((file) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
        .map((file) => ({
          src: `/static/images/featured/${entry.name}/${file}`,
          alt: path.parse(file).name,
        }))

      if (images.length > 0) {
        categories.push({
          name: entry.name,
          images,
        })
      }
    }
  }

  return NextResponse.json({ categories })
}
