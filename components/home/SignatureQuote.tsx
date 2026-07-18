import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default function SignatureQuote() {
  // 读取签名文件
  const signaturePath = path.join(process.cwd(), 'data', 'signature.md')
  let signatureText = '代码是诗，逻辑是歌，用心写出每一行。'
  let authorName = 'HydroiodI_926'

  try {
    if (fs.existsSync(signaturePath)) {
      const fileContent = fs.readFileSync(signaturePath, 'utf8')
      const { data, content } = matter(fileContent)
      signatureText = content.trim() || signatureText
      authorName = data.author || authorName
    }
  } catch (error) {
    console.error('读取签名文件失败:', error)
  }

  return (
    <div className="glass-card-strong p-6 text-center md:p-8">
      <svg
        className="text-primary-400 dark:text-primary-300 mx-auto mb-3 h-8 w-8 opacity-60"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
      </svg>
      <p className="font-serif text-lg leading-relaxed text-gray-700 italic md:text-xl dark:text-gray-200">
        {signatureText}
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="bg-primary-300 dark:bg-primary-600 h-px w-12" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {authorName}
        </span>
        <span className="bg-primary-300 dark:bg-primary-600 h-px w-12" />
      </div>
    </div>
  )
}