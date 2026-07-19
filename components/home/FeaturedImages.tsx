'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Category {
  name: string
  images: { src: string; alt: string }[]
}

export default function FeaturedImages() {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetch('/api/featured-images')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
  }, [])

  const allImages = categories.flatMap((c) => c.images)

  useEffect(() => {
    if (allImages.length === 0 || isPaused) return

    const duration = 4000
    const interval = 50
    let elapsed = 0

    const progressTimer = setInterval(() => {
      elapsed += interval
      setProgress((elapsed / duration) * 100)

      if (elapsed >= duration) {
        setCurrentIndex((prev) => (prev + 1) % allImages.length)
        elapsed = 0
        setProgress(0)
      }
    }, interval)

    return () => clearInterval(progressTimer)
  }, [allImages.length, isPaused, currentIndex])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
    setProgress(0)
  }, [allImages.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length)
    setProgress(0)
  }, [allImages.length])

  if (allImages.length === 0) return null

  const currentImage = allImages[currentIndex]

  return (
    <Link href="/gallery" className="block h-full">
      <div
        className="glass-card-strong relative flex h-full min-h-[360px] flex-col overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* 图片展示区 */}
        <div className="relative flex-1">
          {allImages.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* 图片信息 */}
          <div className="absolute right-3 bottom-3 left-3">
            <h3 className="text-sm font-semibold text-white drop-shadow-lg">{currentImage.alt}</h3>
            <p className="text-xs text-white/80">
              {currentIndex + 1} / {allImages.length}
            </p>
          </div>

          {/* 左右箭头 */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute top-1/2 left-1 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-black/50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleNext()
            }}
            className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-black/50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 进度条 */}
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
          <div
            className="bg-primary-500 h-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
