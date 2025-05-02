import Link from "next/link";
import { RiGithubFill, RiTwitterXFill } from "@remixicon/react";

const links = [
  {
    title: "Trending",
    href: "/trending",
  },
  {
    title: "Categories",
    href: "/categories",
  },
  {
    title: "Submit Project",
    href: "/projects/submit",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Terms",
    href: "/legal/terms",
  },
  {
    title: "Privacy",
    href: "/legal/privacy",
  },
];

export default function FooterSection() {
  return (
    <footer className="border-b bg-white py-8 dark:bg-transparent border-t">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Open-Launch
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Open source project - Built by{" "}
                <a
                  href="https://twitter.com/Ericbn09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Eric <RiTwitterXFill className="h-3 w-3" />
                </a>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary block duration-150"
                >
                  <span>{link.title}</span>
                </Link>
              ))}
            </div>
            <a
              href="https://github.com/drdruide/open-launch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary duration-150 flex items-center gap-1"
            >
              <RiGithubFill className="h-4 w-4" />
              <span className="text-muted-foreground hover:text-primary text-sm duration-150">
                GitHub
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
