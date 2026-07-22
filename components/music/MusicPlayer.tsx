'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useAudio } from '@/components/audio/AudioProvider'

export default function MusicPlayer() {
  const {
    songs,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    currentLyricIndex,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    setVolume,
    toggleMute,
    loadSongs,
  } = useAudio()

  const progressRef = useRef<HTMLDivElement>(null)
  const lyricsRef = useRef<HTMLDivElement>(null)

  // 加载歌曲列表
  useEffect(() => {
    fetch('/api/music')
      .then((res) => res.json())
      .then((data) => loadSongs(data.songs || []))
      .catch(() => {})
  }, [loadSongs])

  // 歌词自动滚动
  useEffect(() => {
    if (currentLyricIndex >= 0 && lyricsRef.current) {
      const activeLine = lyricsRef.current.querySelector('.lyric-active')
      if (activeLine) {
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentLyricIndex])

  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return '00:00'
    const m = Math.floor(time / 60)
    const s = Math.floor(time % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [])

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return
      const rect = progressRef.current.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      seekTo(percent * duration)
    },
    [duration, seekTo]
  )

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(parseFloat(e.target.value))
    },
    [setVolume]
  )

  if (songs.length === 0) {
    return (
      <div className="glass-card-strong flex h-64 items-center justify-center">
        <p className="text-gray-500">暂无歌曲，请在 public/music/ 目录添加音频文件</p>
      </div>
    )
  }

  return (
    <div className="glass-card-strong p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* 左侧：封面 */}
        <div className="flex flex-shrink-0 flex-col items-center">
          <div
            className={`music-cover-ring relative h-48 w-48 overflow-hidden rounded-full shadow-xl md:h-56 md:w-56 ${isPlaying ? 'animate-spin-slow' : ''}`}
          >
            <img
              src={currentSong?.cover || '/music/covers/default.svg'}
              alt={currentSong?.title || '专辑封面'}
              className="h-full w-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/music/covers/default.svg'
              }}
            />
            <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-inner dark:bg-gray-900/80" />
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {currentSong?.title || '未选择歌曲'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentSong?.artist || '未知艺术家'}
            </p>
            {currentSong?.album && (
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{currentSong.album}</p>
            )}
          </div>
        </div>

        {/* 右侧：控制面板 + 歌词 */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
          {/* 进度条 */}
          <div className="space-y-1">
            <div
              ref={progressRef}
              className="group relative h-2 cursor-pointer overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
              role="slider"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') seekTo(Math.min(1, (progress + 5) / 100) * duration)
                if (e.key === 'ArrowLeft') seekTo(Math.max(0, (progress - 5) / 100) * duration)
              }}
              onClick={handleProgressClick}
            >
              <div
                className="from-primary-400 to-primary-600 h-full rounded-full bg-gradient-to-r transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div
                className="bg-primary-500 absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                style={{ left: `calc(${progress}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={playPrev}
              className="hover:text-primary-500 dark:hover:text-primary-400 rounded-full p-2 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="上一首"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="bg-primary-500 hover:bg-primary-600 rounded-full p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={playNext}
              className="hover:text-primary-500 dark:hover:text-primary-400 rounded-full p-2 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="下一首"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            {/* 音量控制 */}
            <div className="ml-4 flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="hover:text-primary-500 text-gray-500 dark:text-gray-400"
                aria-label={isMuted ? '取消静音' : '静音'}
              >
                {isMuted || volume === 0 ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider h-1 w-16 cursor-pointer appearance-none rounded-full bg-gray-300 dark:bg-gray-600"
                aria-label="音量"
              />
            </div>
          </div>

          {/* 歌词区域 */}
          {currentSong?.lyrics && currentSong.lyrics.length > 0 ? (
            <div
              ref={lyricsRef}
              className="lyrics-container max-h-48 overflow-y-auto rounded-xl bg-gray-50/50 p-4 dark:bg-gray-800/30"
            >
              {currentSong.lyrics.map((line, index) => (
                <p
                  key={index}
                  className={`py-1 text-center text-sm transition-all duration-300 ${
                    index === currentLyricIndex
                      ? 'lyric-active text-primary-500 dark:text-primary-400 scale-105 font-bold'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {line.text}
                </p>
              ))}
            </div>
          ) : (
            currentSong && (
              <div className="flex h-32 items-center justify-center rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
                <p className="text-sm text-gray-400">暂无歌词</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
