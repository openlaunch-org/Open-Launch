/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { db } from "@/drizzle/db"
import { seoArticle } from "@/drizzle/db/schema"
import { mdxComponents } from "@/mdx-components"
import {
  RiArticleLine,
  RiInformationLine,
  RiLinkM,
  RiSearchLine,
  RiTrophyLine,
  RiUserStarLine,
} from "@remixicon/react"
import { eq } from "drizzle-orm"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"

import { DOMAIN_AUTHORITY, LAUNCH_SETTINGS, SEO_ARTICLE_PAYMENT_LINK } from "@/lib/constants"
import { buildLocaleAlternates, buildLocaleOpenGraph } from "@/lib/i18n-metadata"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TableOfContents } from "@/components/blog/table-of-contents"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params

  const article = await db.select().from(seoArticle).where(eq(seoArticle.slug, slug)).limit(1)

  if (!article[0]) {
    return {
      title: "Review not found | aat.ee",
      description: "The review you're looking for doesn't exist or has been removed.",
    }
  }

  const { title, description, metaTitle, metaDescription } = article[0]
  const path = `/reviews/${slug}`

  return {
    title: metaTitle || `${title} | aat.ee`,
    description: metaDescription || description,
    keywords: "review, product review, analysis, evaluation",
    authors: [{ name: "aat.ee Team" }],
    category: "Technology",
    alternates: buildLocaleAlternates(path, locale),
    openGraph: {
      title: metaTitle || `${title} | aat.ee`,
      description: metaDescription || description,
      type: "article",
      publishedTime: article[0].publishedAt.toISOString(),
      ...buildLocaleOpenGraph(path, locale),
      siteName: "aat.ee",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle || `${title} | aat.ee`,
      description: metaDescription || description,
      creator: "@openlaunch",
      site: "@openlaunch",
    },
  }
}

function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params

  const article = await db.select().from(seoArticle).where(eq(seoArticle.slug, slug)).limit(1)

  if (!article[0]) {
    notFound()
  }

  const { title, description, content, publishedAt } = article[0]
  const readingTime = calculateReadingTime(content)

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/reviews"
            className="text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reviews
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
          {/* Main Content */}
          <div className="lg:col-span-7">
            <article>
              {/* Article Header */}
              <header className="mb-8">
                {/* Meta Information */}
                <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={publishedAt.toISOString()}>
                      {formatDate(publishedAt, locale)}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="mb-4 text-2xl font-bold md:text-4xl">{title}</h1>

                {/* Description */}
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{description}</p>

                {/* Hero Image */}
                {article[0].image && (
                  <div className="bg-muted mb-8 aspect-[16/9] overflow-hidden rounded-lg">
                    <img
                      src={article[0].image}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div className="prose prose-neutral dark:prose-invert [&_table]:border-border [&_thead]:bg-muted/30 [&_th]:border-border [&_th]:text-foreground [&_td]:border-border [&_tbody_tr:hover]:bg-muted/20 [&_img]:border-border max-w-none [&_img]:mx-auto [&_img]:rounded-lg [&_img]:border [&_img]:sm:max-w-xl [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_tbody_tr:last-child_td]:border-b-0 [&_td]:border-r [&_td]:border-b [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_td]:text-sm [&_td:last-child]:border-r-0 [&_th]:border-r [&_th]:border-b [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:align-middle [&_th]:text-sm [&_th]:font-bold [&_th:last-child]:border-r-0">
                <MDXRemote
                  source={content}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }}
                />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              {/* Table of Contents */}
              <TableOfContents />

              {/* CTA Card */}
              <div className="from-primary/5 to-primary/10 rounded-2xl bg-gradient-to-br p-4">
                <div className="mb-4 text-center">
                  <h2 className="text-foreground text-base font-semibold">
                    Want a review like this?
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    Boost your product&apos;s visibility and credibility
                  </p>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <RiSearchLine className="text-primary mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <div>
                      <div className="text-foreground text-xs font-medium">
                        Rank on Google for &ldquo;[product] review&rdquo;
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RiTrophyLine className="text-primary mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <div>
                      <div className="text-foreground text-xs font-medium">
                        Get a High-Quality Backlink
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RiUserStarLine className="text-primary mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <div>
                      <div className="text-foreground text-xs font-medium">
                        Build customer trust with professional reviews
                      </div>
                    </div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                    >
                      Get Your Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto sm:max-w-lg">
                    <DialogHeader className="pb-6">
                      <DialogTitle className="text-xl font-semibold">
                        SEO Growth Package
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Complete SEO solution to rank on Google
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Price */}
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          ${LAUNCH_SETTINGS.ARTICLE_PRICE}
                          <span className="text-muted-foreground ml-2 text-lg font-normal line-through">
                            $199
                          </span>
                        </div>
                      </div>

                      {/* What's included */}
                      <div>
                        <h3 className="mb-4 font-medium">What you get:</h3>
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="bg-primary/10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded">
                              <RiArticleLine className="text-primary h-3 w-3" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium">SEO Article</div>
                              <div className="text-muted-foreground text-xs">
                                Custom &ldquo;[Product] review&rdquo; content
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="bg-primary/10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded">
                              <RiLinkM className="text-primary h-3 w-3" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium">Premium Launch</div>
                              <div className="text-muted-foreground text-xs">
                                DR {DOMAIN_AUTHORITY} dofollow backlink included
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Process */}
                      <div>
                        <h3 className="mb-4 font-medium">What happens next:</h3>
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="bg-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs font-medium text-white">
                              1
                            </div>
                            <div className="text-sm">Pay & secure your slot</div>
                          </div>
                          <div className="flex gap-3">
                            <div className="bg-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs font-medium text-white">
                              2
                            </div>
                            <div className="text-sm">
                              <div>We contact you in 24h</div>
                              <div className="text-muted-foreground text-xs">
                                Product access, keywords, details
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="bg-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs font-medium text-white">
                              3
                            </div>
                            <div className="text-sm">Premium launch next day</div>
                          </div>
                          <div className="flex gap-3">
                            <div className="bg-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs font-medium text-white">
                              4
                            </div>
                            <div className="text-sm">SEO article in 5-7 days</div>
                          </div>
                        </div>
                      </div>

                      {/* Requirement */}
                      <div className="bg-muted/30 rounded p-3">
                        <div className="flex gap-2">
                          <RiInformationLine className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                          <div className="text-sm">
                            <span className="font-medium">Requirement:</span> Free product access
                            for testing
                          </div>
                        </div>
                      </div>

                      {/* Button */}
                      <Button className="h-11 w-full" asChild>
                        <Link href={SEO_ARTICLE_PAYMENT_LINK} target="_blank">
                          Get SEO Package - ${LAUNCH_SETTINGS.ARTICLE_PRICE}
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
