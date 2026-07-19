'use client'

import Link from 'next/link'
import MusicPlayer from '@/components/music/MusicPlayer'
import MusicPlaylist from '@/components/music/MusicPlaylist'

export default function MusicPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">音乐</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">聆听旋律，感受代码与音乐的共鸣</p>
      </div>

      <div className="space-y-6">
        {/* 播放器 */}
        <MusicPlayer />

        {/* 播放列表 */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">播放列表</h2>
          <MusicPlaylist />
        </div>
      </div>
    </div>
  )
}
