'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

export default function LatestArticle({ posts }: { posts: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const recentPosts = posts.filter((post) => {
    const postDate = new Date(post.date)
    return postDate >= oneMonthAgo
  })

  useEffect(() => {
    if (recentPosts.length === 0 || isPaused) return

    const duration = 5000
    const interval = 50
    let elapsed = 0

    const progressTimer = setInterval(() => {
      elapsed += interval
      setProgress((elapsed / duration) * 100)

      if (elapsed >= duration) {
        setCurrentIndex((prev) => (prev + 1) % recentPosts.length)
        elapsed = 0
        setProgress(0)
      }
    }, interval)

    return () => clearInterval(progressTimer)
  }, [recentPosts.length, isPaused, currentIndex])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? recentPosts.length - 1 : prev - 1))
    setProgress(0)
  }, [recentPosts.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % recentPosts.length)
    setProgress(0)
  }, [recentPosts.length])

  if (recentPosts.length === 0) return null

  return (
    <div
      className="glass-card-strong relative flex h-full min-h-[360px] flex-col overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 标题 */}
      <div className="flex items-center justify-between px-6 pt-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <svg
            className="text-primary-500 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          最新文章
        </h2>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {recentPosts.length}
        </span>
      </div>

      {/* 文章展示区 */}
      <div className="relative flex-1">
        {recentPosts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`absolute inset-0 flex flex-col p-6 transition-opacity duration-1000 ${
              i === currentIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <div className="flex flex-1 flex-col">
              <time className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {formatDate(post.date, siteMetadata.locale)}
              </time>
              <h3 className="mt-2 text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                {post.title}
              </h3>
              {post.summary && (
                <p className="mt-3 line-clamp-5 flex-1 text-base text-gray-600 dark:text-gray-300">
                  {post.summary}
                </p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}

        {/* 左右箭头 */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  )
}
