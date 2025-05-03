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
  title: "Pricing - Open-Launch",
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
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Choose Your Launch Plan</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Get the visibility your project deserves with our flexible launch options. All launches
          happen at 8:00 AM UTC.
        </p>
      </div>

      <div className="mx-auto mb-16 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
        {/* Free Launch Option */}
        <div className="hover:border-foreground/10 hover:bg-foreground/5 rounded-md border p-4 transition-all">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h5 className="font-medium">Free Launch</h5>
            </div>
          </div>
          <div className="mb-3 text-xl font-medium">
            $0 <span className="text-muted-foreground text-xs">/ launch</span>
          </div>
          <p className="text-muted-foreground mb-3 text-xs">
            Standard launch with up to {LAUNCH_SETTINGS.MAX_DAYS_AHEAD} days scheduling window.
          </p>
          <ul className="mb-6 space-y-1.5 text-xs">
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="text-foreground/50 h-3.5 w-3.5" />
              <span>{LAUNCH_LIMITS.FREE_DAILY_LIMIT} slots available daily</span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="text-foreground/50 h-3.5 w-3.5" />
              <span>Standard launch queue</span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="text-foreground/50 h-3.5 w-3.5" />
              <span>Featured on homepage</span>
            </li>
          </ul>

          <Button variant="outline" className="mt-6 w-full" asChild>
            <Link href="/projects/submit">Launch for Free</Link>
          </Button>
        </div>

        {/* Premium Launch Option */}
        <div className="hover:border-primary/50 border-primary/30 hover:bg-primary/5 rounded-md border p-4 transition-all">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h5 className="font-medium">Premium</h5>
            </div>
          </div>
          <div className="mb-3 text-xl font-medium">
            ${LAUNCH_SETTINGS.PREMIUM_PRICE}{" "}
            <span className="text-muted-foreground text-xs">/ launch</span>
          </div>
          <p className="text-muted-foreground mb-3 text-xs">
            Skip the free queue with priority scheduling.
          </p>
          <ul className="mb-6 space-y-1.5 text-xs">
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="text-primary/80 h-3.5 w-3.5" />
              <span>{LAUNCH_LIMITS.PREMIUM_DAILY_LIMIT} premium slots daily</span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="text-primary/80 h-3.5 w-3.5" />
              <span>Earlier launch dates</span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="text-primary/80 h-3.5 w-3.5" />
              <span>Featured on homepage</span>
            </li>
          </ul>

          <Button className="mt-6 w-full" asChild>
            <Link href="/projects/submit">Get Premium</Link>
          </Button>
        </div>

        {/* Premium Plus Launch Option */}
        <div className="hover:border-primary border-primary/50 hover:bg-primary/5 relative rounded-md border p-4 transition-all">
          <div className="bg-primary text-primary-foreground hidden rounded-md px-3 py-1 text-xs font-medium shadow-sm sm:absolute sm:-top-3 sm:-right-3 sm:block">
            Special Spot
          </div>
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h5 className="font-medium">Premium Plus</h5>
            </div>
            <div className="bg-primary text-primary-foreground rounded-md px-3 py-1 text-xs font-medium shadow-sm sm:hidden">
              Special Spot
            </div>
          </div>
          <div className="mb-3 text-xl font-medium">
            ${LAUNCH_SETTINGS.PREMIUM_PLUS_PRICE}{" "}
            <span className="text-muted-foreground text-xs">/ launch</span>
          </div>
          <p className="text-muted-foreground mb-3 text-xs">
            Ultimate visibility with homepage featuring.
          </p>
          <ul className="mb-6 space-y-1.5 text-xs">
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="text-primary h-3.5 w-3.5" />
              <span>{LAUNCH_LIMITS.PREMIUM_PLUS_DAILY_LIMIT} exclusive slots daily</span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="text-primary h-3.5 w-3.5" />
              <span>Fastest launch dates</span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="text-primary h-3.5 w-3.5" />
              <span>Premium spotlight placement</span>
            </li>
          </ul>

          <Button className="mt-6 w-full" variant="default" asChild>
            <Link href="/projects/submit">Get Premium Plus</Link>
          </Button>
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
