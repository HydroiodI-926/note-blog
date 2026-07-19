'use client'

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

export interface Song {
  id: number
  title: string
  artist: string
  album?: string
  cover: string
  src: string
  duration?: string
  lyrics: { time: number; text: string }[]
}

interface AudioState {
  songs: Song[]
  currentSong: Song | null
  currentIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
  progress: number
  volume: number
  isMuted: boolean
  currentLyricIndex: number
}

interface AudioActions {
  play: () => void
  pause: () => void
  togglePlay: () => void
  playNext: () => void
  playPrev: () => void
  playSong: (song: Song) => void
  seekTo: (time: number) => void
  setVolume: (vol: number) => void
  toggleMute: () => void
  loadSongs: (songs: Song[]) => void
}

type AudioContextType = AudioState & AudioActions

const AudioContext = createContext<AudioContextType | null>(null)

export function useAudio(): AudioContextType {
  const ctx = useContext(AudioContext)
  if (!ctx) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return ctx
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1)

  const currentSong = songs[currentIndex] || null

  // 初始化 audio 元素（仅一次）
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = 0.7
    audioRef.current = audio

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }
    const onLoadedMetadata = () => {
      setDuration(audio.duration)
    }
    const onEnded = () => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        return next >= songs.length ? 0 : next
      })
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audio.src = ''
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 歌词同步
  useEffect(() => {
    if (!currentSong?.lyrics || currentSong.lyrics.length === 0) {
      setCurrentLyricIndex(-1)
      return
    }
    let idx = -1
    for (let i = currentSong.lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= currentSong.lyrics[i].time) {
        idx = i
        break
      }
    }
    setCurrentLyricIndex(idx)
  }, [currentTime, currentSong?.lyrics])

  // 切歌时加载新源
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return
    audio.src = currentSong.src
    audio.load()
    setCurrentTime(0)
    setCurrentLyricIndex(-1)
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
  }, [currentSong?.src]) // eslint-disable-line react-hooks/exhaustive-deps

  const play = useCallback(() => {
    audioRef.current
      ?.play()
      .then(() => setIsPlaying(true))
      .catch(() => {})
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        ?.play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }
  }, [isPlaying])

  const playNext = useCallback(() => {
    if (songs.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % songs.length)
  }, [songs.length])

  const playPrev = useCallback(() => {
    if (songs.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length)
  }, [songs.length])

  const playSong = useCallback(
    (song: Song) => {
      const idx = songs.findIndex((s) => s.id === song.id)
      if (idx >= 0) {
        setCurrentIndex(idx)
        // 延迟一帧确保 src 已更新再播放
        requestAnimationFrame(() => {
          audioRef.current
            ?.play()
            .then(() => setIsPlaying(true))
            .catch(() => {})
        })
      }
    },
    [songs]
  )

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol)
    setIsMuted(vol === 0)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume || 0.7
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const loadSongs = useCallback((newSongs: Song[]) => {
    setSongs((prev) => {
      // 避免重复加载
      if (prev.length === newSongs.length && prev.every((s, i) => s.id === newSongs[i].id)) {
        return prev
      }
      return newSongs
    })
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const value: AudioContextType = {
    songs,
    currentSong,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    currentLyricIndex,
    play,
    pause,
    togglePlay,
    playNext,
    playPrev,
    playSong,
    seekTo,
    setVolume,
    toggleMute,
    loadSongs,
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}
