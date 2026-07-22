/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Hydroiody的博客',
  author: 'HydroiodI_926',
  headerTitle: 'Hydroiody的博客',
  description: '一个基于 Next.js 和 Tailwind CSS 的个人博客',
  language: 'zh-cn',
  theme: 'system',
  siteUrl: 'https://hydroiodi-926.github.io/note-blog',
  siteRepo: '',
  siteLogo: `/static/images/logo.png`,
  socialBanner: `/static/images/twitter-card.png`,
  email: '',
  github: '',
  locale: 'zh-CN',
  stickyNav: false,
  analytics: {},
  newsletter: {
    provider: '',
  },
  comments: {
    provider: 'giscus',
    giscConfig: {
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
  // 背景图片配置
  bgImages: [`/static/images/ocean.jpeg`],
  bgBlur: 20,

  // 首页个人资料卡配置
  avatarUrl: `/static/images/avatar.png`,
  signature: '代码是诗，逻辑是歌，用心写出每一行。',
  social: {
    github: 'https://github.com/HydroiodI-926',
    email: '',
  },

  // 精选图片配置
  featuredImages: [{ src: `/static/images/ocean.jpeg`, alt: '海洋' }],

  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `/search.json`,
    },
  },
}

module.exports = siteMetadata
