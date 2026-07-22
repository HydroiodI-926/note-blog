import { allAuthors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Link from '@/components/Link'
import Image from '@/components/Image'

export default function ProfileCard() {
  const author = allAuthors.find((p) => p.slug === 'default')

  if (!author) {
    return null
  }

  const { name, avatar, occupation, summary, github, bilibili } = author

  return (
    <div className="glass-card-strong flex flex-col items-center p-6 text-center md:p-8">
      <div className="mb-4">
        <Link href="/about">
          <div className="from-primary-400 h-24 w-24 cursor-pointer rounded-full bg-gradient-to-tr via-indigo-400 to-purple-400 p-[3px] shadow-lg transition-all duration-500 hover:scale-110 hover:rotate-6 hover:shadow-xl md:h-32 md:w-32">
            <Image
              src={avatar || ''}
              alt={name}
              width={128}
              height={128}
              className="bw-white h-full w-full rounded-full object-cover dark:bg-gray-800"
            />
          </div>
        </Link>
      </div>
      <h1 className="text-2hl md:text-3hl mb-2 font-bold tracking-wide text-gray-900 dark:text-white">
        {name}
      </h1>
      {occupation && (
        <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">{occupation}</p>
      )}
      <p className="mb-6 max-w-md text-sm leading-relaxed font-medium text-gray-600 md:text-base dark:text-gray-300">
        {summary}
      </p>
      <div className="flex gap-3">
        {github && (
          <span className="glass-button p-2.5 text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:scale-125 dark:text-gray-300">
            <SocialIcon kind="github" href={github} size={5} />
          </span>
        )}
        {bilibili && (
          <span className="glass-button p-2.5 text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:scale-125 dark:text-gray-300">
            <SocialIcon kind="bilibili" href={bilibili} size={5} />
          </span>
        )}
      </div>
    </div>
  )
}
