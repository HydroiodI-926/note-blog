import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/** 支持的音频格式 */
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac'])

/** 支持的图片格式 */
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']

/**
 * 解析 LRC 歌词文件
 */
function parseLrc(content: string): { time: number; text: string }[] {
  const result: { time: number; text: string }[] = []
  for (const line of content.split('\n')) {
    const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/)
    if (match) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      const ms = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0
      const text = match[4].trim()
      if (text) {
        result.push({ time: minutes * 60 + seconds + ms / 1000, text })
      }
    }
  }
  return result.sort((a, b) => a.time - b.time)
}

/**
 * 在 covers 目录中查找与歌曲同名的封面图片
 */
function findCover(baseName: string, coversDir: string): string {
  for (const ext of IMAGE_EXTS) {
    const coverPath = path.join(coversDir, baseName + ext)
    if (fs.existsSync(coverPath)) {
      return `/music/covers/${baseName}${ext}`
    }
  }
  return '/music/covers/default.svg'
}

/**
 * 在歌词目录中查找与歌曲同名的 .lrc 文件
 */
function findLyrics(baseName: string, lyricsDir: string): { time: number; text: string }[] {
  const lrcPath = path.join(lyricsDir, baseName + '.lrc')
  if (fs.existsSync(lrcPath)) {
    return parseLrc(fs.readFileSync(lrcPath, 'utf-8'))
  }
  return []
}

export async function GET() {
  try {
    const musicDir = path.join(process.cwd(), 'public/music')
    const coversDir = path.join(musicDir, 'covers')
    const lyricsDir = path.join(process.cwd(), 'data/music/lyrics')

    if (!fs.existsSync(musicDir)) {
      return NextResponse.json({ songs: [] })
    }

    const files = fs.readdirSync(musicDir)
    const songs = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return AUDIO_EXTS.has(ext)
      })
      .map((file, index) => {
        const baseName = path.parse(file).name
        return {
          id: index + 1,
          title: baseName,
          artist: '未知艺术家',
          album: '',
          cover: findCover(baseName, coversDir),
          src: encodeURI(`/music/${file}`),
          duration: '',
          lyrics: findLyrics(baseName, lyricsDir),
        }
      })

    return NextResponse.json({ songs })
  } catch (error) {
    console.error('Failed to scan music directory:', error)
    return NextResponse.json({ songs: [] })
  }
}
