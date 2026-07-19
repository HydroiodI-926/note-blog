'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface TocItem {
  value: string
  url: string
  depth: number
}

interface TOCProps {
  toc: TocItem[]
}

export default function TOC({ toc }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const topOffset = 20

    const headingElements = toc
      .map((item) => document.getElementById(item.url.replace('#', '')))
      .filter(Boolean) as HTMLElement[]

    if (headingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id)
        } else if (entries.length > 0) {
          const closest = entries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          )
          if (closest[0]) {
            setActiveId(closest[0].target.id)
          }
        }
      },
      {
        rootMargin: `-${topOffset}px 0px -60% 0px`,
        threshold: 0,
      }
    )

    headingElements.forEach((el) => observer.observe(el))

    const handleScroll = () => {
      if (window.scrollY < 10 && headingElements.length > 0) {
        setActiveId(headingElements[0].id)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    observerRef.current = observer

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [toc])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault()
    const id = url.replace('#', '')
    const el = document.getElementById(id)
    if (!el) return

    const offset = 20
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveId(id)
  }, [])

  const filtered = toc.filter((item) => item.depth >= 2 && item.depth <= 4)
  if (filtered.length === 0) return null

  return (
    <nav aria-label="Table of Contents" className="toc-nav">
      <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">目录</p>
      <ul className="space-y-1.5 text-sm">
        {filtered.map((item) => {
          const id = item.url.replace('#', '')
          const isActive = activeId === id
          const indent = (item.depth - 2) * 0.75

          return (
            <li key={item.url}>
              <a
                href={item.url}
                onClick={(e) => handleClick(e, item.url)}
                className={`block truncate rounded-sm border-l-2 py-0.5 transition-all duration-200 ${indent > 0 ? 'text-[0.8rem]' : ''} ${
                  isActive
                    ? 'border-l-primary-500 text-primary-600 dark:text-primary-400 pl-2.5 font-medium'
                    : 'border-l-transparent pl-2.5 text-gray-500 hover:border-l-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:border-l-gray-600 dark:hover:text-gray-200'
                } `}
                style={{ marginLeft: `${indent}rem` }}
                title={item.value}
              >
                {item.value}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
