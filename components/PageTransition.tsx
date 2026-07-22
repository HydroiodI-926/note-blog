'use client'

import { usePathname } from 'next/navigation'

/**
 * Light page transition: key-driven remount with a single short fade-in.
 * - Content swaps immediately, no render blocking
 * - ~150ms animation, snappy feel
 * - Respects prefers-reduced-motion
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="animate-page-enter w-full">
      {children}
    </div>
  )
}
