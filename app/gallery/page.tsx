'use client'

import { useState, useEffect } from 'react'
import ImagePreview from '@/components/ImagePreview'
import Link from 'next/link'

interface Category {
  name: string
  images: { src: string; alt: string }[]
}

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetch('/api/featured-images')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
  }, [])

  const currentCategory = categories.find((c) => c.name === selectedCategory)
  const displayImages = currentCategory?.images || categories.flatMap((c) => c.images)

  const handlePrev = () => {
    if (previewIndex === null) return
    setPreviewIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev! - 1))
  }

  const handleNext = () => {
    if (previewIndex === null) return
    setPreviewIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev! + 1))
  }

  // 复制图片用于无缝滚动
  const scrollImages = [...displayImages, ...displayImages]

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      {/* 头部 */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-primary-500 hover:text-primary-600 mb-4 inline-flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回首页
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">照片墙</h1>
      </div>

      {/* 分类选择 */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category.name
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 滚动展示区 */}
      {displayImages.length > 0 && (
        <div className="glass-card-strong mb-8 p-6">
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 渐变遮罩 */}
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-white/90 to-transparent dark:from-gray-900/90" />
            <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-white/90 to-transparent dark:from-gray-900/90" />

            {/* 滚动轨道 */}
            <div
              className={`flex gap-6 ${isPaused ? '' : 'animate-scroll'}`}
              style={{ width: `${scrollImages.length * 320}px` }}
            >
              {scrollImages.map((img, i) => (
                <div
                  key={i}
                  className="group relative h-64 w-72 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setPreviewIndex(i % displayImages.length)
                  }}
                  onClick={() => setPreviewIndex(i % displayImages.length)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-end bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                    <span className="p-4 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {img.alt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 图片网格 */}
      {categories.map((category) => (
        <div key={category.name} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {category.name}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {category.images.map((img, i) => (
              <div
                key={i}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedCategory(category.name)
                    setPreviewIndex(i)
                  }
                }}
                onClick={() => {
                  setSelectedCategory(category.name)
                  setPreviewIndex(i)
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-end bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                  <span className="p-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {img.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 空状态 */}
      {categories.length === 0 && (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">暂无图片</p>
        </div>
      )}

      {/* 图片预览 */}
      <ImagePreview
        images={displayImages}
        currentIndex={previewIndex ?? 0}
        isOpen={previewIndex !== null}
        onClose={() => setPreviewIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}
