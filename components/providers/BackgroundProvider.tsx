'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import siteMetadata from '@/data/siteMetadata'

interface BackgroundContextType {
  bgImage: string
  bgBlur: number
  setBgImage: (img: string) => void
  setBgBlur: (blur: number) => void
}

const BackgroundContext = createContext<BackgroundContextType>({
  bgImage: '',
  bgBlur: 20,
  setBgImage: () => {},
  setBgBlur: () => {},
})

export function useBackground() {
  return useContext(BackgroundContext)
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [bgImage, setBgImage] = useState('')
  const [bgBlur, setBgBlur] = useState(20)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const typedMetadata = siteMetadata as { bgImages?: string[]; bgBlur?: number }
    const bgImages: string[] = typedMetadata.bgImages ?? []
    const defaultBlur: number = typedMetadata.bgBlur ?? 20

    const savedImg = localStorage.getItem('bg-image')
    const savedBlur = localStorage.getItem('bg-blur')

    if (savedImg && bgImages.includes(savedImg)) {
      setBgImage(savedImg)
    } else if (bgImages.length > 0) {
      setBgImage(bgImages[0])
    }

    setBgBlur(savedBlur ? Number(savedBlur) : defaultBlur)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('bg-image', bgImage)
    }
  }, [bgImage, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('bg-blur', String(bgBlur))
    }
  }, [bgBlur, mounted])

  if (!mounted) return null

  return (
    <BackgroundContext.Provider value={{ bgImage, bgBlur, setBgImage, setBgBlur }}>
      {children}
    </BackgroundContext.Provider>
  )
}
