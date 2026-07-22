'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ScheduleItem {
  id: string
  time: string
  title: string
  completed: boolean
  category: 'work' | 'study' | 'life'
}

type Category = ScheduleItem['category']

const categoryColors: Record<Category, string> = {
  work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  study: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  life: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
}

const categoryLabels: Record<Category, string> = {
  work: '工作',
  study: '学习',
  life: '生活',
}

const STORAGE_KEY = 'ssgbok-schedule'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function Modal({
  show,
  onClose,
  onSave,
  formData,
  setFormData,
  isEditing,
}: {
  show: boolean
  onClose: () => void
  onSave: () => void
  formData: { time: string; title: string; category: Category }
  setFormData: (data: { time: string; title: string; category: Category }) => void
  isEditing: boolean
}) {
  if (typeof document === 'undefined' || !show) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-card-strong mx-4 w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          {isEditing ? '编辑计划' : '添加计划'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">时间</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">内容</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="输入计划内容"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">分类</label>
            <div className="flex gap-2">
              {(['work', 'study', 'life'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    formData.category === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            保存
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ time: string; title: string; category: Category }>({
    time: '',
    title: '',
    category: 'work',
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSchedule(JSON.parse(stored))
      } catch {
        setSchedule([])
      }
    }
  }, [])

  useEffect(() => {
    if (schedule.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule))
    }
  }, [schedule])

  const toggleComplete = (id: string) => {
    setSchedule((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const openAddModal = () => {
    setEditingId(null)
    setFormData({ time: '', title: '', category: 'work' })
    setShowModal(true)
  }

  const openEditModal = (item: ScheduleItem) => {
    setEditingId(item.id)
    setFormData({ time: item.time, title: item.title, category: item.category })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.time || !formData.title) return
    if (editingId) {
      setSchedule((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      setSchedule((prev) => [...prev, { ...formData, id: generateId(), completed: false }])
    }
    setShowModal(false)
    setFormData({ time: '', title: '', category: 'work' })
    setEditingId(null)
  }

  const deleteItem = (id: string) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id))
  }

  const completedCount = schedule.filter((item) => item.completed).length

  return (
    <div className="glass-card-strong p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">今日计划</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {completedCount}/{schedule.length}
        </span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-500"
          style={{ width: schedule.length > 0 ? `${(completedCount / schedule.length) * 100}%` : '0%' }}
        />
      </div>
      <div className="max-h-48 space-y-2 overflow-y-auto">
        {schedule.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400">暂无计划，点击下方添加</p>
        ) : (
          schedule.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2 rounded-lg p-2 transition-all ${item.completed ? 'opacity-60' : ''}`}
            >
              <button
                type="button"
                onClick={() => toggleComplete(item.id)}
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  item.completed ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {item.completed && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <span
                  className={`text-xs font-medium ${
                    item.completed ? 'line-through' : ''
                  } text-gray-800 dark:text-gray-200`}
                >
                  {item.title}
                </span>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${categoryColors[item.category]}`}
              >
                {categoryLabels[item.category]}
              </span>
              <span className="flex-shrink-0 text-xs text-gray-500">{item.time}</span>
              <button type="button" onClick={() => openEditModal(item)} className="text-gray-400 hover:text-blue-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button type="button" onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
      <button
        type="button"
        onClick={openAddModal}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 p-2 text-xs text-gray-500 transition-colors hover:border-primary-500 hover:text-primary-500 dark:border-gray-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        添加计划
      </button>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingId}
      />
    </div>
  )
}
