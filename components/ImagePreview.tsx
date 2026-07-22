'use client'

import { useEffect, useCallback } from 'react'

interface ImagePreviewProps {
  images: { src: string; alt: string }[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function ImagePreview({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: ImagePreviewProps) {
  const currentImage = images[currentIndex]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          onPrev()
          break
        case 'ArrowRight':
          onNext()
          break
      }
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || !currentImage) return null

  return (
    <div
      className="fixed z-[9999] bg-black/80 backdrop-blur-sm"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition-colors hover:bg-white"
        aria-label="关闭预览"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 上一张按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg transition-all hover:scale-110 hover:bg-white"
        aria-label="上一张"
      >
        <span className="text-2xl font-bold">&lt;</span>
      </button>

      {/* 图片 */}
      <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        />
        {currentImage.alt && (
          <div className="mt-4 text-center text-sm text-white/80">{currentImage.alt}</div>
        )}
        <div className="mt-2 text-xs text-white/50">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* 下一张按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg transition-all hover:scale-110 hover:bg-white"
        aria-label="下一张"
      >
        <span className="text-2xl font-bold">&gt;</span>
      </button>
    </div>
  )
}
