import Link from "next/link"

import { RiCheckboxCircleFill } from "@remixicon/react"

import { LAUNCH_LIMITS, LAUNCH_SETTINGS } from "@/lib/constants"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Pricing - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Choose the perfect plan for your project launch",
}

const faqItems = [
  {
    id: "1",
    title: "When do launches happen?",
    content: `All launches happen at 8:00 AM UTC. We launch a limited number of projects each day to ensure quality visibility.`,
  },
  {
    id: "2",
    title: "How many projects are launched each day?",
    content: `We launch up to ${LAUNCH_LIMITS.FREE_DAILY_LIMIT} free projects, ${LAUNCH_LIMITS.PREMIUM_DAILY_LIMIT} premium projects, and ${LAUNCH_LIMITS.PREMIUM_PLUS_DAILY_LIMIT} premium plus projects daily.`,
  },
  {
    id: "3",
    title: "How far in advance can I schedule my launch?",
    content: `Free users can schedule up to ${LAUNCH_SETTINGS.MAX_DAYS_AHEAD} days in advance, Premium users up to ${LAUNCH_SETTINGS.PREMIUM_MAX_DAYS_AHEAD} days, and Premium Plus users up to ${LAUNCH_SETTINGS.PREMIUM_PLUS_MAX_DAYS_AHEAD} days.`,
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">Choose Your Launch Plan</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-sm">
          Get the visibility your project deserves with our flexible launch options. All launches
          happen at 8:00 AM UTC.
        </p>
      </div>

      {/* First row: Free and Premium */}
      <div className="mx-auto mb-4">
        <div className="grid grid-cols-1 overflow-hidden rounded-lg border md:grid-cols-10">
          {/* Free Launch Option */}
          <div className="flex h-full flex-col p-5 md:col-span-4">
            <div className="flex-grow">
              <h5 className="mb-2 text-base font-medium">Free Launch</h5>
              <div className="mb-2 text-2xl font-bold">
                $0 <span className="text-muted-foreground text-sm font-normal">/launch</span>
              </div>
              <p className="text-muted-foreground mb-3 text-xs">
                Standard launch with up to {LAUNCH_SETTINGS.MAX_DAYS_AHEAD} days scheduling window.
              </p>

              <ul className="mb-5 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <RiCheckboxCircleFill className="text-muted-foreground h-4 w-4" />
                  <span>{LAUNCH_LIMITS.FREE_DAILY_LIMIT} slots available daily</span>
                </li>
                <li className="flex items-center gap-2">
                  <RiCheckboxCircleFill className="text-muted-foreground h-4 w-4" />
                  <span>Standard launch queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <RiCheckboxCircleFill className="text-muted-foreground h-4 w-4" />
                  <span>Featured on homepage</span>
                </li>
                <li className="flex items-center gap-2">
                  <RiCheckboxCircleFill className="text-muted-foreground h-4 w-4" />
                  <span>Dofollow Backlink if Top 3 daily</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-3">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/projects/submit">Launch for Free</Link>
              </Button>
            </div>
          </div>

          {/* Premium Launch Option */}
          <div className="bg-muted/5 border-t p-5 md:col-span-6 md:border-t-0 md:border-l">
            <div className="flex h-full flex-col">
              <div className="flex-grow">
                <h5 className="mb-2 text-base font-medium">Premium Launch</h5>
                <div className="mb-2 text-2xl font-bold">
                  ${LAUNCH_SETTINGS.PREMIUM_PRICE}{" "}
                  <span className="text-muted-foreground text-sm font-normal">/launch</span>
                </div>
                <p className="text-muted-foreground mb-3 text-xs">
                  Priority scheduling with faster launch dates.
                </p>

                <ul className="mb-5 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <RiCheckboxCircleFill className="text-primary h-4 w-4" />
                    <span className="font-semibold">Skip the Free Queue - Priority access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RiCheckboxCircleFill className="text-primary h-4 w-4" />
                    <span className="font-semibold">Guaranteed Dofollow Backlink</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RiCheckboxCircleFill className="text-primary h-4 w-4" />
                    <span>{LAUNCH_LIMITS.PREMIUM_DAILY_LIMIT} premium slots daily</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RiCheckboxCircleFill className="text-primary h-4 w-4" />
                    <span>Earlier launch dates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RiCheckboxCircleFill className="text-primary h-4 w-4" />
                    <span>Featured on homepage</span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-3">
                <Button size="sm" className="w-full" asChild>
                  <Link href="/projects/submit">Get Premium</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second row: Premium Plus - Enterprise Style */}
      <div className="mx-auto mb-12 max-w-3xl">
        <div className="rounded-lg border p-5">
          <div className="flex flex-col md:flex-row">
            <div className="mb-6 flex flex-col md:mb-0 md:w-2/5 md:border-r md:pr-6">
              <div className="flex-grow">
                <h5 className="mb-1 text-lg font-semibold">Premium Plus</h5>

                <div className="mb-4 flex flex-col gap-1">
                  <div className="flex items-baseline text-3xl font-bold">
                    ${LAUNCH_SETTINGS.PREMIUM_PLUS_PRICE}
                    <span className="text-muted-foreground ml-2 text-base font-normal line-through">
                      $25
                    </span>
                  </div>

                  <span className="bg-primary/10 text-primary w-fit rounded-full px-2 py-0.5 text-xs font-medium">
                    -50% with code: OPENLAUNCH
                  </span>
                </div>

                <p className="text-muted-foreground mb-6 text-xs">
                  Ultimate visibility with special homepage spot
                </p>
              </div>

              <div className="mt-auto">
                <Button size="sm" className="w-full" variant="default" asChild>
                  <Link href="/projects/submit">Get Premium Plus</Link>
                </Button>
              </div>
            </div>

            <div className="md:w-3/5 md:pl-6">
              <h6 className="mb-3 text-sm font-semibold">Everything in Premium, plus:</h6>

              <div className="space-y-1">
                <div className="bg-primary/5 border-primary/10 rounded border p-2">
                  <div className="flex items-start gap-2">
                    <RiCheckboxCircleFill className="text-primary mt-0.5 h-4 w-4" />
                    <div>
                      <p className="text-primary text-sm font-semibold">
                        Premium Spotlight Placement
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Most visible position on our platform
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded border p-2">
                  <div className="flex items-start gap-2">
                    <RiCheckboxCircleFill className="text-primary mt-0.5 h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Exclusive Daily Spots</p>
                      <p className="text-muted-foreground text-xs">
                        Only {LAUNCH_LIMITS.PREMIUM_PLUS_DAILY_LIMIT} projects per day
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded border p-2">
                  <div className="flex items-start gap-2">
                    <RiCheckboxCircleFill className="text-primary mt-0.5 h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Fastest Launch Dates</p>
                      <p className="text-muted-foreground text-xs">Top priority for your project</p>
                    </div>
                  </div>
                </div>

                <div className="rounded border p-2">
                  <div className="flex items-start gap-2">
                    <RiCheckboxCircleFill className="text-primary mt-0.5 h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Guaranteed Dofollow Backlink</p>
                      <p className="text-muted-foreground text-xs">
                        Valuable SEO boost for your site
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full -space-y-px" defaultValue="1">
          {faqItems.map((item) => (
            <AccordionItem
              value={item.id}
              key={item.id}
              className="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative border px-4 py-1 outline-none first:rounded-t-md last:rounded-b-md last:border-b has-focus-visible:z-10 has-focus-visible:ring-[3px]"
            >
              <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-2">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
