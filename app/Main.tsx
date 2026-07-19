import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import ProfileCard from '@/components/home/ProfileCard'
import MusicWidget from '@/components/home/MusicWidget'
import SignatureQuote from '@/components/home/SignatureQuote'
import FeaturedImages from '@/components/home/FeaturedImages'
import LatestArticle from '@/components/home/LatestArticle'
import LatestPosts from '@/components/home/LatestPosts'

export default function Home({ posts }: { posts: { slug: string; date: string; title: string; summary?: string; tags?: string[] }[] }) {
  return (
    <div className="space-y-6 py-6 md:py-10">
      {/* 第一行：个人资料 + 音乐小组件 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileCard />
        <MusicWidget />
      </div>

      {/* 第二行：签名语（独占全宽） */}
      <SignatureQuote />

      {/* 第三行：精选图片 + 最新文章 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-8">
        <div className="lg:col-span-3">
          <FeaturedImages />
        </div>
        <div className="lg:col-span-5">
          <LatestArticle posts={posts} />
        </div>
      </div>

      {/* 最新文章列表 */}
      <LatestPosts posts={posts} />

      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </div>
  )
}

