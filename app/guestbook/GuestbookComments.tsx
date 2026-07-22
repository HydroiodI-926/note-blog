'use client'

import { Comments } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function GuestbookComments() {
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        <p className="mt-2 text-sm">评论系统尚未配置，请在 siteMetadata.js 中配置 Giscus。</p>
      </div>
    )
  }

  return (
    <>
      {loadComments ? (
        <Comments commentsConfig={siteMetadata.comments} slug="guestbook" />
      ) : (
        <div className="py-8 text-center">
          <button
            onClick={() => setLoadComments(true)}
            className="bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-400 inline-flex items-center rounded-md px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors"
          >
            加载留言板
          </button>
          <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
            基于 GitHub Discussions，需要 GitHub 账号
          </p>
        </div>
      )}
    </>
  )
}
