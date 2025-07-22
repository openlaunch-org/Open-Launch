import { SponsorCard } from "@/components/home/sponsor-card"

export function SponsorCards() {
  return (
    <>
      <SponsorCard
        name="Nexty.dev"
        url="https://nexty.dev?ref=open-launch"
        imageUrl="https://nexty.dev/logo.png"
        description="Launch Your SaaS Fast & Earn Money Fast."
      />
      <SponsorCard
        name="Findly.tools"
        url="https://findly.tools?ref=open-launch"
        imageUrl="https://yxucdfr9f5.ufs.sh/f/M3RHr0TmpHk58YQSMZbg1XPzV7Kxo25HAvNtwa6hLcRpjB0T"
        description="The best tools, all in one place."
      />
      <SponsorCard
        name="Image Translate AI"
        url="https://imagetranslate.ai?ref=open-launch"
        imageUrl="https://yxucdfr9f5.ufs.sh/f/M3RHr0TmpHk5QfdPFFNjGs3nmiJ1bxOqZfoYRvFaCt7VPMDU"
        description="Translate image text instantly."
      />
    </>
  )
}
