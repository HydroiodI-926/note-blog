'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { allBlogs } from 'contentlayer/generated'

const MONTH_NAMES = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]
const WEEKDAY_NAMES = ['日', '一', '二', '三', '四', '五', '六']

function getIntensity(count: number): string {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
  if (count === 1) return 'bg-primary-200 dark:bg-primary-900'
  if (count === 2) return 'bg-primary-400 dark:bg-primary-700'
  if (count === 3) return 'bg-primary-500 dark:bg-primary-600'
  return 'bg-primary-700 dark:bg-primary-400'
}

function getMonthWeeks(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const weeks: (Date | null)[][] = []
  let currentWeek: (Date | null)[] = []

  const startDayOfWeek = firstDay.getDay()
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null)
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    currentWeek.push(new Date(year, month, d))
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  return weeks
}

export default function Heatmap() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentMonth, setCurrentMonth] = useState(11)
  const hasScrolled = useRef(false)

  const posts = useMemo(() => allBlogs.map((p) => ({ date: p.date })), [])

  const postCountMap = useMemo(() => {
    const countMap: Record<string, number> = {}
    posts.forEach((post) => {
      const dateStr = post.date.split('T')[0]
      countMap[dateStr] = (countMap[dateStr] || 0) + 1
    })
    return countMap
  }, [posts])

  const monthsData = useMemo(() => {
    const today = new Date()
    const result: { year: number; month: number; weeks: (Date | null)[][] }[] = []

    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      result.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        weeks: getMonthWeeks(date.getFullYear(), date.getMonth()),
      })
    }

    return result
  }, [])

  // 组件挂载后滚动到当前月份（最后一个）
  useEffect(() => {
    if (scrollRef.current && !hasScrolled.current) {
      hasScrolled.current = true
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [])

  const totalCount = Object.values(postCountMap).reduce((sum, count) => sum + count, 0)

  const scrollToMonth = (index: number) => {
    if (scrollRef.current) {
      const monthWidth = scrollRef.current.scrollWidth / 12
      scrollRef.current.scrollTo({
        left: monthWidth * index,
        behavior: 'smooth',
      })
      setCurrentMonth(index)
    }
  }

  const handlePrev = () => {
    const newIndex = Math.max(0, currentMonth - 1)
    scrollToMonth(newIndex)
  }

  const handleNext = () => {
    const newIndex = Math.min(11, currentMonth + 1)
    scrollToMonth(newIndex)
  }

  return (
    <div className="glass-card-strong p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">文章发布热力图</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">共 {totalCount} 篇</span>
      </div>

      {/* 导航按钮和月份指示器 */}
      <div className="mb-2 flex items-center justify-between -ml-3">
        <button
          onClick={handlePrev}
          disabled={currentMonth === 0}
          className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex gap-1">
          {monthsData.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToMonth(index)}
              className={`h-1.5 w-3 rounded-full transition-colors ${
                index === currentMonth ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentMonth === 11}
          className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 横向滚动容器 */}
      <div
        ref={scrollRef}
        className="scrollbar-hide overflow-x-auto"
        onScroll={(e) => {
          const scrollLeft = e.currentTarget.scrollLeft
          const monthWidth = e.currentTarget.scrollWidth / 12
          setCurrentMonth(Math.round(scrollLeft / monthWidth))
        }}
      >
        <div className="flex gap-4" style={{ width: `${monthsData.length * 100}%` }}>
          {monthsData.map(({ year, month, weeks }, index) => (
            <div
              key={`${year}-${month}`}
              className="flex-shrink-0"
              style={{ width: `${100 / monthsData.length}%` }}
            >
              {/* 月份标题 */}
              <div className="mb-2 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
                {year}年{MONTH_NAMES[month]}
              </div>

              {/* 星期标识 */}
              <div className="mb-1 flex gap-0.5">
                <div className="w-4" />
                <div className="flex flex-1 justify-around text-[10px] text-gray-400">
                  {WEEKDAY_NAMES.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>

              {/* 日期网格 */}
              <div className="space-y-0.5">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex items-center gap-0.5">
                    <div className="w-4 text-[10px] text-gray-400">{weekIndex + 1}</div>
                    <div className="flex flex-1 justify-around gap-0.5">
                      {week.map((day, dayIndex) => {
                        if (!day) {
                          return <div key={dayIndex} className="h-4 w-4" />
                        }
                        const dateStr = day.toISOString().split('T')[0]
                        const count = postCountMap[dateStr] || 0
                        return (
                          <div
                            key={dayIndex}
                            title={`${dateStr}: ${count} 篇文章`}
                            className={`h-4 w-4 rounded-sm transition-transform hover:scale-125 ${getIntensity(count)}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-3 flex items-center justify-end gap-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">少</span>
        <div className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
        <div className="bg-primary-200 dark:bg-primary-900 h-3 w-3 rounded-sm" />
        <div className="bg-primary-400 dark:bg-primary-700 h-3 w-3 rounded-sm" />
        <div className="bg-primary-500 dark:bg-primary-600 h-3 w-3 rounded-sm" />
        <div className="bg-primary-700 dark:bg-primary-400 h-3 w-3 rounded-sm" />
        <span className="text-xs text-gray-500 dark:text-gray-400">多</span>
      </div>
    </div>
  )
}
