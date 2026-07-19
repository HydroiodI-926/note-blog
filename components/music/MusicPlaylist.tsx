'use client'

import { useAudio } from '@/components/audio/AudioProvider'

export default function MusicPlaylist() {
  const { songs, currentSong, isPlaying, playSong } = useAudio()

  if (songs.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          暂无歌曲，请在 public/music/ 目录添加音频文件
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card-strong overflow-hidden">
      {/* 表头 */}
      <div className="flex items-center border-b border-gray-200/50 px-4 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:border-gray-700/50 dark:text-gray-400">
        <span className="w-10">#</span>
        <span className="flex-1">歌曲</span>
        <span className="hidden w-32 sm:block">专辑</span>
        <span className="w-16 text-right">时长</span>
      </div>

      {/* 歌曲列表 */}
      <div className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
        {songs.map((song, index) => {
          const isActive = currentSong?.id === song.id

          return (
            <button
              key={song.id}
              onClick={() => playSong(song)}
              className={`hover:bg-primary-50/50 dark:hover:bg-primary-900/10 flex w-full items-center px-4 py-3 text-left transition-all duration-200 ${
                isActive ? 'bg-primary-50/80 dark:bg-primary-900/20' : ''
              }`}
            >
              {/* 序号 / 播放指示器 */}
              <span className="w-10 text-sm">
                {isActive && isPlaying ? (
                  <span className="inline-flex gap-0.5">
                    <span
                      className="music-bar bg-primary-500 h-3 w-0.5 rounded-full"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="music-bar bg-primary-500 h-3 w-0.5 rounded-full"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="music-bar bg-primary-500 h-3 w-0.5 rounded-full"
                      style={{ animationDelay: '300ms' }}
                    />
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
              </span>

              {/* 歌曲封面 + 信息 */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="h-10 w-10 flex-shrink-0 rounded-md object-cover shadow-sm"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/music/covers/default.svg'
                  }}
                />
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-medium ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
                </div>
              </div>

              {/* 专辑 */}
              <span className="hidden w-32 truncate text-sm text-gray-500 sm:block dark:text-gray-400">
                {song.album || '-'}
              </span>

              {/* 时长 */}
              <span className="w-16 text-right text-sm text-gray-400 dark:text-gray-500">
                {song.duration || '--:--'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
