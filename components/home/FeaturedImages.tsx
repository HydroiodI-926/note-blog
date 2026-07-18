import siteMetadata from '@/data/siteMetadata'

export default function FeaturedImages() {
  const images = (siteMetadata as any).featuredImages as { src: string; alt: string }[] | undefined
  if (!images || images.length === 0) return null

  return (
    <div className="glass-card-strong p-4 md:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
        <svg
          className="text-primary-500 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 000-2-2H6a2 2 0 00-2 2v12a2 2 0000 2z"
          />
        </svg>
        精选图片
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((img, i) => (
          <div
            key={i}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-end bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
              <span className="p-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {img.alt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
