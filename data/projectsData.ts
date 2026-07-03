interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: '博客建设记录',
    description: '记录博客从搭建到上线的全过程，包括技术选型、功能开发和部署配置。',
    href: '/blog',
  },
]

export default projectsData
