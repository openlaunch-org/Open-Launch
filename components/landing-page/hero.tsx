import Link from "next/link"

import { RiArrowRightLine } from "@remixicon/react"
import { ZapIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { GlowEffect } from "../ui/glow-effect"

export default function Hero() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          <div>
            <Badge>
              <ZapIcon className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
              Badge
            </Badge>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-heading font-regular max-w-2xl text-center text-5xl tracking-tighter md:text-7xl">
              Boilerplate
            </h1>
            <p className="text-muted-foreground max-w-2xl text-center text-lg leading-relaxed tracking-tight md:text-xl">
              Next.js 15+, TailwindCSS, TypeScript, Shadcn UI, Drizzle ORM, Postgres, Better Auth
            </p>
          </div>
          <div>
            <div className="relative">
              <GlowEffect
                colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
                mode="colorShift"
                blur="soft"
                duration={3}
                scale={0.9}
              />
              <Link
                href="/sign-in"
                className="relative inline-flex items-center gap-1 rounded-md bg-zinc-950 px-2 py-1 text-sm text-zinc-50 outline-1 outline-[#fff2f21f]"
              >
                Get Started <RiArrowRightLine className="h4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
