import type { HTMLAttributes } from 'react'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

/**
 * code 组件：区分「代码块内的 code」与「行内 code」。
 *
 * rehype-pretty-code 处理后：
 *   - 代码块内的 <code> 带有 data-language / data-theme 属性（Shiki 已注入 token span）；
 *   - 行内 code（段落里的 `foo`）没有任何 data-* 属性。
 * 据此给行内 code 加样式，代码块 code 原样透传（token 已由 Shiki 内联着色）。
 */
const Code = ({ className, children, ...props }: HTMLAttributes<HTMLElement>) => {
  const isCodeBlock = 'data-language' in props || 'data-theme' in props
  if (isCodeBlock) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }
  // 行内 code：浅色圆角胶囊样式
  return (
    <code
      className="rounded bg-gray-200 px-[0.3rem] py-[0.1rem] font-mono text-[0.85em] dark:bg-gray-800"
      {...props}
    >
      {children}
    </code>
  )
}

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  code: Code,
  table: TableWrapper,
  BlogNewsletterForm,
}
