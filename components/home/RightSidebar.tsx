import Calendar from './Calendar'
import Heatmap from './Heatmap'
import Schedule from './Schedule'

interface RightSidebarProps {
  posts: { date: string }[]
}

export default function RightSidebar({ posts }: RightSidebarProps) {
  return (
    <div className="space-y-6">
      <Calendar />
      <Heatmap posts={posts} />
      <Schedule />
    </div>
  )
}
