/**
 * rehype-pretty-code (Shiki) 配置。
 *
 * 取代了模板原有的 rehype-prism-plus。Shiki 直接复用 VS Code 的 TextMate 语法，
 * 因此 C++ / Python / Rust 等语言能获得与 VS Code 一致的着色，无需任何额外语法包。
 *
 * 双主题（dual theme）方案：构建期同时生成亮/暗两套 token 颜色，写入 CSS 变量
 *   --shiki-light / --shiki-dark  与  --shiki-light-bg / --shiki-dark-bg
 * 再由 css/code.css 根据根元素的 dark class 切换。
 * 模板已通过 next-themes 管理 .dark class（见 css/tailwind.css 的 @custom-variant dark），
 * 因此这套配色会自动跟随站点的明暗主题。
 *
 * 配合 Mermaid：在 contentlayer.config.ts 中，rehype-mermaid 被放在本插件之前运行，
 * `mermaid 代码块会被先烘成 <svg>，因此 Shiki 永远碰不到它们（等价于 Astro 的 excludeLangs）。
 */
export const rehypePrettyCodeOptions = {
  // 同时生成亮/暗两套主题，与 VS Code 默认主题一致
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  // 让 CSS 控制背景，便于明暗切换（否则 Shiki 会把单主题背景内联进 style）
  keepBackground: false,
  // 默认按代码块标注的语言高亮；未标注语言的代码块当作纯文本
  defaultLang: {
    block: ['plaintext', ''],
  },
  // 行级元数据：把行号写入 data-line，便于行高亮样式定位
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onVisitLine(node: any) {
    node.properties['data-line'] = node.position?.start.line
  },
  // 显式高亮行（如 `js {2,4-6}）加标记类，对接 css/code.css 的 .highlighted
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onVisitHighlightedLine(node: any) {
    node.properties.className = [...(node.properties.className || []), 'highlighted']
  },
  // 显式高亮单词（如 // [!highlight word]）加标记类
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onVisitHighlightedChars(node: any) {
    node.properties.className = ['highlighted-chars']
  },
} as const
