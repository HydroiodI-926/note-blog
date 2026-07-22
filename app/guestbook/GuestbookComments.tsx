'use client'

import { Comments } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function GuestbookComments() {
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        <p className="text-lg">评论系统尚未配置</p>
        <p className="text-sm mt-2">
          请在 <code>data/siteMetadata.js</code> 中配置 Giscus，或设置对应的环境变量。
        </p>
      </div>
    )
  }

  return (
    <>
      {loadComments ? (
        <Comments commentsConfig={siteMetadata.comments} slug="guestbook" />
      ) : (
        <div className="text-center py-8">
          <button
            onClick={() => setLoadComments(true)}
            className="inline-flex items-center rounded-md bg-primary-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 dark:hover:bg-primary-400"
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
