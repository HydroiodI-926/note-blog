import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 5

export default function LatestPosts({ posts }: { posts: { slug: string; date: string; title: string; summary?: string; tags?: string[] }[] }) {
  return (
    <div className="glass-card-strong p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
          <svg
            className="text-primary-500 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          最新文章
        </h2>
        {posts.length > MAX_DISPLAY && (
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium"
          >
            查看全部 &rarr;
          </Link>
        )}
      </div>
      {!posts.length && <p className="text-gray-500 dark:text-gray-400">暂无文章。</p>}
      <ul className="space-y-4">
        {posts.slice(0, MAX_DISPLAY).map((post) => {
          const { slug, date, title, summary, tags } = post
          return (
            <li key={slug}>
              <Link href={`/blog/${slug}`} className="group block">
                <article className="-mx-4 rounded-xl p-4 transition-all duration-300 hover:bg-white/30 dark:hover:bg-white/5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                    <time
                      dateTime={date}
                      className="shrink-0 text-xs font-medium text-gray-500 sm:w-24 dark:text-gray-400"
                    >
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                    <div className="min-w-0 flex-1">
                      <h3 className="group-hover:text-primary-500 dark:group-hover:text-primary-400 truncate text-base font-bold text-gray-900 transition-colors duration-200 md:text-lg dark:text-gray-100">
                        {title}
                      </h3>
                      {summary && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {summary}
                        </p>
                      )}
                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {tags.map((tag: string) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

