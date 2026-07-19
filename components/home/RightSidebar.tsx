import Calendar from './Calendar'
import Heatmap from './Heatmap'
import Schedule from './Schedule'

export default function RightSidebar() {
  return (
    <div className="space-y-6">
      <Calendar />
      <Heatmap />
      <Schedule />
    </div>
  )
}
