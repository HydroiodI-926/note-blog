'use client'

import { useBackground } from '@/components/providers/BackgroundProvider'
import siteMetadata from '@/data/siteMetadata'

export default function BackgroundRenderer() {
  const { bgImage, bgBlur } = useBackground()

  const typedMetadata = siteMetadata as { bgImages?: string[] }
  const bgImages: string[] = typedMetadata.bgImages ?? []
  const currentBg = bgImage || bgImages[0]

  if (!currentBg) return null

  return (
    <div className="fixed inset-0 -z-10 h-lvh">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${currentBg})` }}
      />
      <div className="absolute inset-0 bg-transparent transition-colors duration-500 dark:bg-black/60" />
      {bgBlur > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${bgBlur}px)`,
            WebkitBackdropFilter: `blur(${bgBlur}px)`,
          }}
        />
      )}
    </div>
  )
}
