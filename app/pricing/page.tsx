import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiCheckboxCircleFill } from "@remixicon/react";
import { LAUNCH_LIMITS, LAUNCH_SETTINGS } from "@/lib/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "Pricing - Open-Launch",
  description: "Choose the perfect plan for your project launch",
};

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
];

export default function PricingPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Choose Your Launch Plan
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get the visibility your project deserves with our flexible launch
          options. All launches happen at 8:00 AM UTC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 max-w-3xl mx-auto">
        {/* Free Launch Option */}
        <div className=" border rounded-md p-4 transition-all hover:border-foreground/10 hover:bg-foreground/5">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <h5 className="font-medium">Free Launch</h5>
            </div>
          </div>
          <div className="text-xl mb-3 font-medium">
            $0 <span className="text-muted-foreground text-xs">/ launch</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Standard launch with up to {LAUNCH_SETTINGS.MAX_DAYS_AHEAD} days
            scheduling window.
          </p>
          <ul className="text-xs space-y-1.5 mb-6">
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="h-3.5 w-3.5 text-foreground/50" />
              <span>
                {LAUNCH_LIMITS.FREE_DAILY_LIMIT} slots available daily
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="h-3.5 w-3.5 text-foreground/50" />
              <span>Standard launch queue</span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="h-3.5 w-3.5 text-foreground/50" />
              <span>Featured on homepage</span>
            </li>
          </ul>

          <Button variant="outline" className="w-full mt-6" asChild>
            <Link href="/projects/submit">Launch for Free</Link>
          </Button>
        </div>

        {/* Premium Launch Option */}
        <div className="border rounded-md p-4 transition-all hover:border-primary/50 border-primary/30 hover:bg-primary/5">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <h5 className="font-medium">Premium</h5>
            </div>
          </div>
          <div className="text-xl mb-3 font-medium">
            ${LAUNCH_SETTINGS.PREMIUM_PRICE}{" "}
            <span className="text-muted-foreground text-xs">/ launch</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Skip the free queue with priority scheduling.
          </p>
          <ul className="text-xs space-y-1.5 mb-6">
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="h-3.5 w-3.5 text-primary/80" />
              <span>
                {LAUNCH_LIMITS.PREMIUM_DAILY_LIMIT} premium slots daily
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="h-3.5 w-3.5 text-primary/80" />
              <span>Earlier launch dates</span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="h-3.5 w-3.5 text-primary/80" />
              <span>Featured on homepage</span>
            </li>
          </ul>

          <Button className="w-full mt-6" asChild>
            <Link href="/projects/submit">Get Premium</Link>
          </Button>
        </div>

        {/* Premium Plus Launch Option */}
        <div className="border rounded-md p-4 transition-all hover:border-primary border-primary/50 hover:bg-primary/5 relative">
          <div className="hidden sm:block sm:absolute sm:-top-3 sm:-right-3 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium shadow-sm">
            Special Spot
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <h5 className="font-medium">Premium Plus</h5>
            </div>
            <div className="sm:hidden bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium shadow-sm">
              Special Spot
            </div>
          </div>
          <div className="text-xl mb-3 font-medium">
            ${LAUNCH_SETTINGS.PREMIUM_PLUS_PRICE}{" "}
            <span className="text-muted-foreground text-xs">/ launch</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Ultimate visibility with homepage featuring.
          </p>
          <ul className="text-xs space-y-1.5 mb-6">
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="h-3.5 w-3.5 text-primary" />
              <span>
                {LAUNCH_LIMITS.PREMIUM_PLUS_DAILY_LIMIT} exclusive slots daily
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="h-3.5 w-3.5 text-primary" />
              <span>Fastest launch dates</span>
            </li>
            <li className="flex items-center gap-1.5">
              <RiCheckboxCircleFill className="h-3.5 w-3.5 text-primary" />
              <span>Premium spotlight placement</span>
            </li>
          </ul>

          <Button className="w-full mt-6" variant="default" asChild>
            <Link href="/projects/submit">Get Premium Plus</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full -space-y-px"
          defaultValue="1"
        >
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
  );
}
