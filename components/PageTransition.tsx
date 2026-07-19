'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [animClass, setAnimClass] = useState('animate-page-enter')
  const currentPath = useRef(pathname)
  const isTransitioning = useRef(false)

  useEffect(() => {
    if (currentPath.current !== pathname && !isTransitioning.current) {
      isTransitioning.current = true
      setAnimClass('animate-page-leave')
    }
  }, [pathname])

  const handleLeaveEnd = useCallback(() => {
    if (!isTransitioning.current) return
    currentPath.current = pathname
    setDisplayChildren(children)
    setAnimClass('animate-page-enter')
    isTransitioning.current = false
  }, [pathname, children])

  useEffect(() => {
    if (animClass === 'animate-page-leave') {
      const timer = setTimeout(handleLeaveEnd, 200)
      return () => clearTimeout(timer)
    }
  }, [animClass, handleLeaveEnd])

  return (
    <div onAnimationEnd={() => {}} className={`${animClass} w-full`}>
      {displayChildren}
    </div>
  )
}
