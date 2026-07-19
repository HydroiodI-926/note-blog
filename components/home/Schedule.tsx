'use client'

import { useState } from 'react'

interface ScheduleItem {
  id: number
  time: string
  title: string
  completed: boolean
  category: 'work' | 'study' | 'life'
}

const categoryColors = {
  work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  study: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  life: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
}

const categoryLabels = {
  work: '工作',
  study: '学习',
  life: '生活',
}

const initialSchedule: ScheduleItem[] = [
  { id: 1, time: '09:00', title: '写博客文章', completed: false, category: 'work' },
  { id: 2, time: '11:00', title: '学习 React 新特性', completed: true, category: 'study' },
  { id: 3, time: '14:00', title: '代码审查', completed: false, category: 'work' },
  { id: 4, time: '16:00', title: '阅读技术文档', completed: false, category: 'study' },
  { id: 5, time: '19:00', title: '运动健身', completed: false, category: 'life' },
]

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule)

  const toggleComplete = (id: number) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  const completedCount = schedule.filter((item) => item.completed).length

  return (
    <div className="glass-card-strong p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">今日计划</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {completedCount}/{schedule.length} 已完成
        </span>
      </div>

      {/* 进度条 */}
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / schedule.length) * 100}%` }}
        />
      </div>

      {/* 计划列表 */}
      <div className="space-y-2">
        {schedule.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 rounded-lg p-2 transition-all ${
              item.completed ? 'opacity-60' : ''
            }`}
          >
            <button
              onClick={() => toggleComplete(item.id)}
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                item.completed
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {item.completed && (
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${item.completed ? 'line-through' : ''} text-gray-800 dark:text-gray-200`}
                >
                  {item.title}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${categoryColors[item.category]}`}
                >
                  {categoryLabels[item.category]}
                </span>
              </div>
            </div>

            <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
