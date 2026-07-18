import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import ProfileCard from '@/components/home/ProfileCard'
import SignatureQuote from '@/components/home/SignatureQuote'
import FeaturedImages from '@/components/home/FeaturedImages'
import LatestPosts from '@/components/home/LatestPosts'

export default function Home({ posts }: { posts: any[] }) {
  return (
    <div className="space-y-6 py-6 md:py-10">
      {/* 第一行：你者资施 + 简名 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileCard />
        <SignatureQuote />
      </div>
      {/* 第一补级艺此务 */}
      <FeaturedImages />
      {/* 第一行数报：最新文章 */}
      <LatestPosts posts={posts} />
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </div>
  )
}
