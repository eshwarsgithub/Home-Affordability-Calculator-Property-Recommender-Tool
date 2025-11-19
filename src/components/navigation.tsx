"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/listings", label: "Listings" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agents", label: "Advisors" },
  { href: "/contact", label: "Contact" },
];

export const Navigation = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[rgba(2,4,10,0.86)]/90 border-b border-white/10">
      <div className="page-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(10,93,255,0.2)] border border-[rgba(10,93,255,0.4)]">
            <span className="h-5 w-5 rounded-full bg-[var(--color-royal)] shadow-[0_0_12px_rgba(10,93,255,0.9)]" />
          </span>
          <div>
            <p className="font-serif text-2xl leading-none">Tycoon Estates</p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Private Office</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm uppercase tracking-[0.3em] text-white/60 hover:text-white transition",
                pathname === item.href && "text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild>
            <Link href="/contact">Book A Confidential Briefing</Link>
          </Button>
        </nav>
        <button
          className="lg:hidden inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1">
            {[0, 1, 2].map((line) => (
              <span
                key={line}
                className={cn(
                  "block h-[2px] w-7 bg-white transition",
                  open && line === 0 && "translate-y-1 rotate-45",
                  open && line === 1 && "opacity-0",
                  open && line === 2 && "-translate-y-1 -rotate-45",
                )}
              />
            ))}
          </div>
        </button>
      </div>
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height] duration-300",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="page-shell flex flex-col gap-4 pb-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn("text-base text-white/70", pathname === item.href && "text-white")}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="lg">
            <Link href="/contact" onClick={() => setOpen(false)}>
              Book A Confidential Briefing
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
