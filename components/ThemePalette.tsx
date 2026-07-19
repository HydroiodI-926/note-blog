'use client'

import { Fragment, useEffect, useState, useCallback } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { useBackground } from '@/components/providers/BackgroundProvider'
import siteMetadata from '@/data/siteMetadata'

// ── Color presets ──────────────────────────────────────────────
// Each preset defines oklch values for primary-400/500/600
// that get applied as CSS custom properties at runtime.
interface ColorPreset {
  name: string
  label: string
  swatch: string // CSS color for the preview dot
  vars: Record<string, string>
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'rose',
    label: '玫瑰',
    swatch: 'oklch(0.656 0.241 354.308)',
    vars: {
      '--color-primary-400': 'oklch(0.718 0.202 349.761)',
      '--color-primary-500': 'oklch(0.656 0.241 354.308)',
      '--color-primary-600': 'oklch(0.592 0.249 0.584)',
    },
  },
  {
    name: 'violet',
    label: '紫罗兰',
    swatch: 'oklch(0.541 0.281 293.009)',
    vars: {
      '--color-primary-400': 'oklch(0.627 0.265 303.9)',
      '--color-primary-500': 'oklch(0.541 0.281 293.009)',
      '--color-primary-600': 'oklch(0.491 0.270 292.581)',
    },
  },
  {
    name: 'blue',
    label: '蔚蓝',
    swatch: 'oklch(0.546 0.245 262.881)',
    vars: {
      '--color-primary-400': 'oklch(0.623 0.214 259.815)',
      '--color-primary-500': 'oklch(0.546 0.245 262.881)',
      '--color-primary-600': 'oklch(0.488 0.243 264.376)',
    },
  },
  {
    name: 'cyan',
    label: '青蓝',
    swatch: 'oklch(0.715 0.143 215.221)',
    vars: {
      '--color-primary-400': 'oklch(0.789 0.154 211.53)',
      '--color-primary-500': 'oklch(0.715 0.143 215.221)',
      '--color-primary-600': 'oklch(0.609 0.126 221.723)',
    },
  },
  {
    name: 'teal',
    label: '翠绿',
    swatch: 'oklch(0.637 0.168 170.714)',
    vars: {
      '--color-primary-400': 'oklch(0.704 0.172 171.31)',
      '--color-primary-500': 'oklch(0.637 0.168 170.714)',
      '--color-primary-600': 'oklch(0.542 0.146 172.114)',
    },
  },
  {
    name: 'amber',
    label: '琥珀',
    swatch: 'oklch(0.769 0.188 70.08)',
    vars: {
      '--color-primary-400': 'oklch(0.823 0.174 75.35)',
      '--color-primary-500': 'oklch(0.769 0.188 70.08)',
      '--color-primary-600': 'oklch(0.666 0.169 53.813)',
    },
  },
  {
    name: 'orange',
    label: '橙色',
    swatch: 'oklch(0.705 0.213 47.604)',
    vars: {
      '--color-primary-400': 'oklch(0.783 0.184 57.70)',
      '--color-primary-500': 'oklch(0.705 0.213 47.604)',
      '--color-primary-600': 'oklch(0.646 0.207 41.116)',
    },
  },
]

// ── Palette icon ───────────────────────────────────────────────
const PaletteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
    {/* Palette body - tilted oval */}
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="8"
      transform="rotate(-25 12 12)"
      fill="currentColor"
      fillOpacity="0.12"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    {/* Thumb hole */}
    <ellipse
      cx="5.8"
      cy="15.5"
      rx="1.6"
      ry="1.4"
      transform="rotate(-25 5.8 15.5)"
      fill="currentColor"
    />
    {/* Paint dots */}
    <circle cx="15.2" cy="5.5" r="1.4" fill="#f43f5e" />
    <circle cx="19.5" cy="9" r="1.4" fill="#8b5cf6" />
    <circle cx="18" cy="13.5" r="1.4" fill="#3b82f6" />
    <circle cx="13" cy="14.5" r="1.4" fill="#10b981" />
    <circle cx="9" cy="10.5" r="1.4" fill="#f59e0b" />
  </svg>
)

// ── Helper: apply color vars to :root ──────────────────────────
function applyColorVars(vars: Record<string, string>) {
  const root = document.documentElement
  for (const [key, val] of Object.entries(vars)) {
    root.style.setProperty(key, val)
  }
}

// ── Component ──────────────────────────────────────────────────
export default function ThemePalette() {
  const [mounted, setMounted] = useState(false)
  const { bgImage, bgBlur, setBgImage, setBgBlur } = useBackground()

  const typedMeta = siteMetadata as { bgImages?: string[]; bgBlur?: number }
  const bgImages: string[] = typedMeta.bgImages ?? []

  // Restore saved color on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme-color')
    if (saved) {
      const preset = COLOR_PRESETS.find((p) => p.name === saved)
      if (preset) applyColorVars(preset.vars)
    }
    setMounted(true)
  }, [])

  const handleColorChange = useCallback((preset: ColorPreset) => {
    applyColorVars(preset.vars)
    localStorage.setItem('theme-color', preset.name)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center">
      <Popover as="div" className="relative inline-block text-left">
        <PopoverButton
          aria-label="主题调色盘"
          className="hover:text-primary-500 dark:hover:text-primary-400 flex items-center justify-center"
        >
          <PaletteIcon />
        </PopoverButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            anchor="bottom end"
            className="z-[9999] mt-3 w-72 rounded-xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur-xl dark:bg-gray-800/95"
          >
            {/* ── Section: Theme Colors ─────────────────── */}
            <div className="mb-4">
              <p className="mb-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                主题色
              </p>
              <div className="flex flex-wrap gap-2.5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleColorChange(preset)}
                    aria-label={preset.label}
                    title={preset.label}
                    className="group relative h-7 w-7 rounded-full transition-transform hover:scale-110"
                    style={{ backgroundColor: preset.swatch }}
                  >
                    <span className="absolute inset-0 rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-white transition group-hover:ring-current dark:ring-offset-gray-800" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Section: Background Image ─────────────── */}
            {bgImages.length > 0 && (
              <div className="mb-4">
                <p className="mb-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  背景图
                </p>
                <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                  {bgImages.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setBgImage(img)}
                      className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        bgImage === img
                          ? 'border-primary-500 ring-primary-500/50 ring-1'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Section: Blur Slider ──────────────────── */}
            <div>
              <p className="mb-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                背景模糊
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={bgBlur}
                  onChange={(e) => setBgBlur(Number(e.target.value))}
                  className="accent-primary-500 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-gray-700"
                />
                <span className="w-8 text-right text-xs text-gray-500 tabular-nums dark:text-gray-400">
                  {bgBlur}
                </span>
              </div>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}
