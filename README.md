# 我的博客

基于 [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) 的个人博客，技术栈：Next.js 15、React 19、Tailwind CSS 4、Contentlayer、MDX。

## 快速开始

```bash
# 安装依赖（需要 Node 20+）
npm install

# 本地开发
npm run dev

# 静态构建
EXPORT=1 npm run build
```

详细使用说明请参阅 [docs/blog-debug-guide.md](docs/blog-debug-guide.md)。

## 技术栈

- **框架**：Next.js 15（App Router）
- **UI**：React 19 + Tailwind CSS 4
- **内容管理**：Contentlayer + MDX
- **代码高亮**：Shiki（rehype-pretty-code，双主题明暗切换）
- **图表**：rehype-mermaid（构建期内联 SVG，零客户端运行时）
- **搜索**：kbar
- **部署**：GitHub Pages（静态导出）

## 目录结构

```
├── app/              # Next.js App Router 页面
├── components/       # React 组件
├── css/              # 样式文件
├── data/             # 内容数据（博客、作者、站点配置）
│   ├── blog/         # 博客文章（.mdx / .md）
│   ├── authors/      # 作者信息
│   ├── siteMetadata.js
│   ├── headerNavLinks.ts
│   └── projectsData.ts
├── lib/              # 工具函数与配置
├── layouts/          # 页面布局组件
├── public/           # 静态资源
│   └── admin/        # Decap CMS 后台
├── scripts/          # 构建脚本
└── docs/             # 项目文档
```
