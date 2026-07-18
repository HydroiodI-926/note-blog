"use client"

import { slug } from 'github-slugger'
import { useRouter } from 'next/navigation'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/tags/${slug(text)}`)
  }

  return (
    <span
      onClick={handleClick}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase cursor-pointer"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as any)
        }
      }}
    >
      {text.split(' ').join('-')}
    </span>
  )
}

export default Tag