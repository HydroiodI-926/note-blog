'use client'

import { usePathname } from 'next/navigation'
import Calendar from './Calendar'
import Heatmap from './Heatmap'
import Schedule from './Schedule'

export default function HomeSidebar() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  if (!isHome) return null

  return (
    <aside className="hidden xl:fixed xl:top-0 xl:right-0 xl:z-50 xl:block xl:h-screen xl:w-72 xl:overflow-y-auto xl:border-l xl:border-gray-200 xl:bg-white/80 xl:backdrop-blur-sm xl:dark:border-gray-700 xl:dark:bg-gray-900/80">
      <div className="space-y-6 px-4 pt-[73px] pb-6">
        <Calendar />
        <Heatmap />
        <Schedule />
      </div>
    </aside>
  )
}
