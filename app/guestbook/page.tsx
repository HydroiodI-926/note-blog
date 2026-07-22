import { genPageMetadata } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'
import GuestbookComments from './GuestbookComments'

export const metadata = genPageMetadata({
  title: '留言板',
  description: '欢迎在这里留下你的足迹～',
})

export default function GuestbookPage() {
  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            留言板
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            欢迎在这里留下你的足迹，交流想法、建议或者随便聊聊天～
          </p>
        </div>
        <div className="py-8">
          <GuestbookComments />
        </div>
      </div>
    </SectionContainer>
  )
}
