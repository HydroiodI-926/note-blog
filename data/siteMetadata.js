/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Hydroiody的博客',
  author: 'HydroiodI_926',
  headerTitle: 'Hydroiody的博客',
  description: '一个基于 Next.js 和 Tailwind CSS 的个人博客',
  language: 'zh-cn',
  theme: 'system',
  siteUrl: 'https://your-domain.com',
  siteRepo: '',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: '',
  github: '',
  locale: 'zh-CN',
  stickyNav: false,
  analytics: {
    // 如需使用分析服务，请同时在 next.config.js 的 CSP 中添加对应域名
  },
  newsletter: {
    provider: '',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'zh-CN',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
