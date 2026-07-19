'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAudio } from '@/components/audio/AudioProvider'

export default function MusicWidget() {
  const router = useRouter()
  const {
    songs,
    currentSong,
    isPlaying,
    progress,
    loadSongs,
    togglePlay,
    playNext,
    playPrev,
    playSong,
  } = useAudio()
  const [showPlaylist, setShowPlaylist] = useState(false)

  useEffect(() => {
    fetch('/api/music')
      .then((res) => res.json())
      .then((data) => loadSongs(data.songs || []))
      .catch(() => {})
  }, [loadSongs])

  const handleCardClick = useCallback(() => {
    router.push('/music')
  }, [router])

  const stopNav = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const togglePlaylist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPlaylist((prev) => !prev)
  }, [])

  const handleSelectSong = useCallback(
    (e: React.MouseEvent, song: (typeof songs)[0]) => {
      e.stopPropagation()
      playSong(song)
      setShowPlaylist(false)
    },
    [playSong]
  )

  if (songs.length === 0) return null

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCardClick() }}
      className="glass-card-strong group relative flex cursor-pointer flex-col items-center overflow-hidden p-6 text-center transition-all duration-300 hover:shadow-lg md:p-8"
    >
      {/* 标题 */}
      <div className="mb-4 flex items-center gap-2">
        <svg className="text-primary-500 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">正在播放</h2>
      </div>

      {/* 封面 */}
      <div
        className={`music-cover-ring relative h-28 w-28 overflow-hidden rounded-full shadow-lg ${isPlaying ? 'animate-spin-slow' : ''}`}
      >
        <img
          src={currentSong?.cover || '/music/covers/default.svg'}
          alt={currentSong?.title || '封面'}
          className="h-full w-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/music/covers/default.svg'
          }}
        />
        <div className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-inner dark:bg-gray-900/80" />
      </div>

      {/* 歌曲信息 */}
      <div className="mt-3 w-full">
        <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
          {currentSong?.title || '未选择歌曲'}
        </p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          {currentSong?.artist || '未知艺术家'}
        </p>
      </div>

      {/* 进度条 */}
      <div className="mt-3 w-full">
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="from-primary-400 to-primary-600 h-full rounded-full bg-gradient-to-r transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="relative mt-3 flex items-center justify-center gap-3"
        role="presentation"
        onKeyDown={(e) => e.stopPropagation()}
        onClick={stopNav}>
        <button
          onClick={playPrev}
          className="hover:text-primary-500 rounded-full p-1.5 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="上一首"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          onClick={togglePlay}
          className="bg-primary-500 hover:bg-primary-600 rounded-full p-2.5 text-white shadow-md transition-all hover:scale-105 active:scale-95"
          aria-label={isPlaying ? '暂停' : '播放'}
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={playNext}
          className="hover:text-primary-500 rounded-full p-1.5 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="下一首"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        {/* 播放列表按钮 */}
        <button
          onClick={togglePlaylist}
          className={`absolute right-[-48px] rounded-full p-1.5 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
            showPlaylist ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
          }`}
          aria-label="播放列表"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
        </button>
      </div>

      {/* 播放列表浮层 */}
      <div
        role="presentation"
        onKeyDown={(e) => e.stopPropagation()}
        onClick={stopNav}
        className={`absolute inset-x-0 bottom-0 z-10 max-h-[70%] overflow-y-auto rounded-b-2xl bg-white/95 shadow-lg backdrop-blur-md transition-transform duration-300 ease-out dark:bg-gray-900/95 ${
          showPlaylist ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              播放列表 · {songs.length} 首
            </span>
            <button
              onClick={togglePlaylist}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
          {songs.map((song) => {
            const isActive = currentSong?.id === song.id
            return (
              <button
                key={song.id}
                onClick={(e) => handleSelectSong(e, song)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <img
                  src={song.cover}
                  alt={song.title}
                  className="h-8 w-8 flex-shrink-0 rounded-md object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/music/covers/default.svg'
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-xs font-medium ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="truncate text-[10px] text-gray-400 dark:text-gray-500">
                    {song.artist}
                  </p>
                </div>
                {isActive && isPlaying && (
                  <span className="flex flex-shrink-0 gap-0.5">
                    <span
                      className="music-bar bg-primary-500 h-2.5 w-0.5 rounded-full"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="music-bar bg-primary-500 h-2.5 w-0.5 rounded-full"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="music-bar bg-primary-500 h-2.5 w-0.5 rounded-full"
                      style={{ animationDelay: '300ms' }}
                    />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
