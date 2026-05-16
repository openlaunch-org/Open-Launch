import type { ReactNode } from "react"

/**
 * Custom Tailwind overrides for MDX elements rendered through
 * `next-mdx-remote/rsc`. Pass this map as `<MDXRemote components={...}>`
 * in any route that renders MDX content (currently `/blog/[slug]` and
 * `/reviews/[slug]`).
 *
 * Previously this file exported `useMDXComponents` — the hook
 * convention `@next/mdx` consumed automatically. Since the Next.js 16
 * upgrade dropped `@next/mdx` (no .mdx pages exist; blog/reviews
 * render strings at runtime), nothing reads the hook anymore. The
 * map below is the same overrides, now plain-exported so consumers
 * can wire them in explicitly.
 *
 * Loose `unknown` typing — `next-mdx-remote/rsc`'s `MDXRemoteProps`
 * accepts a `components` map of any shape; we don't need to constrain
 * here. `@types/mdx`'s `MDXComponents` would have been tighter but
 * we deleted that dep along with `@next/mdx`.
 */
type Props = { children?: ReactNode; href?: string } & Record<string, unknown>

export const mdxComponents: Record<string, (props: Props) => ReactNode> = {
  h1: ({ children }) => <h1 className="mt-8 mb-6 text-2xl font-bold md:text-3xl">{children}</h1>,
  h2: ({ children }) => (
    <h2 className="border-muted-foreground mt-8 mb-4 border-b pb-2 text-lg font-bold uppercase md:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-6 mb-3 text-lg font-bold md:text-xl">{children}</h3>,
  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="text-primary hover:text-primary/80 transition-colors hover:underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-primary bg-muted/30 my-6 rounded-r-lg border-l-4 px-6 py-4">
      <div className="font-medium italic">{children}</div>
    </blockquote>
  ),
  ul: ({ children }) => <ul className="mb-6 ml-6 list-outside list-disc space-y-3">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mb-6 ml-6 list-outside list-decimal space-y-4">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-2 leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => <code className="bg-muted rounded px-2 py-1 text-sm">{children}</code>,
  pre: ({ children }) => (
    <pre className="bg-muted mb-4 overflow-x-auto rounded-lg p-4">{children}</pre>
  ),
  aside: ({ children }) => (
    <aside className="border-border bg-muted/30 my-8 rounded-lg border p-6">
      <div className="font-medium">{children}</div>
    </aside>
  ),
}
