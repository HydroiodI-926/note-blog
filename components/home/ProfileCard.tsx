import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function ProfileCard() {
  return (
    <div className="glass-card-strong flex flex-col items-center p-6 text-center md:p-8">
      <div className="mb-4">
        <div className="from-primary-400 h-24 w-24 cursor-pointer rounded-full bg-gradient-to-tr via-indigo-400 to-purple-400 p-[3px] shadow-lg transition-all duration-500 hover:scale-110 hover:rotate-6 hover:shadow-xl md:h-32 md:w-32">
          <img
            src={siteMetadata.avatarUrl || siteMetadata.siteLogo}
            alt={siteMetadata.author}
            className="bw-white h-full w-full rounded-full object-cover dark:bg-gray-800"
          />
        </div>
      </div>
      <h1 className="text-2hl md:text-3hl mb-2 font-bold tracking-wide text-gray-900 dark:text-white">
        {siteMetadata.author}
      </h1>
      <p className="mb-6 max-w-md text-sm leading-relaxed font-medium text-gray-600 md:text-base dark:text-gray-300">
        {siteMetadata.description}
      </p>
      <div className="flex gap-3">
        {siteMetadata.social?.github && (
          <span
            className="glass-button p-2.5 text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:scale-125 dark:text-gray-300"
          >
            <SocialIcon kind="github" href={siteMetadata.social?.github} size={5} />
          </span>
        )}
        {siteMetadata.social?.email && (
          <span
            className="glass-button p-2.5 text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:scale-125 dark:text-gray-300"
          >
            <SocialIcon kind="mail" href={"mailto:" + siteMetadata.social?.email} size={5} />
          </span>
        )}
      </div>
    </div>
  )
}
