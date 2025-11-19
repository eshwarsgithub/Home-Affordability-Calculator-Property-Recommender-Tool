import Link from "next/link";

const footerLinks = [
  {
    title: "Platform",
    items: [
      { label: "Product Overview", href: "/" },
      { label: "Listings", href: "/listings" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Admin", href: "/admin" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/agents" },
      { label: "Leadership", href: "/agents" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Privacy", href: "#" },
      { label: "Security", href: "#" },
      { label: "Accessibility", href: "/style-guide" },
      { label: "Disclosures", href: "#" },
    ],
  },
];

export const Footer = () => (
  <footer className="mt-24 border-t border-white/10 bg-[rgba(5,8,16,0.9)]">
    <div className="page-shell py-12 grid gap-8 md:grid-cols-[2fr,1fr,1fr,1fr]">
      <div className="space-y-4">
        <p className="font-serif text-3xl">Tycoon Estates</p>
        <p className="text-sm text-white/70">
          Bespoke acquisition, disposition, and asset-performance intelligence for ultra-high-net-worth investors.
        </p>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">WCAG 2.1 AA • ISO 27001 • RERA Verified</p>
      </div>
      {footerLinks.map((column) => (
        <div key={column.title} className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">{column.title}</p>
          <ul className="space-y-2 text-sm text-white/70">
            {column.items.map((item) => (
              <li key={item.label}>
                <Link className="hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="page-shell border-t border-white/10 py-6 text-xs text-white/60 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <span>© {new Date().getFullYear()} Tycoon Estates Private Limited. All rights reserved.</span>
      <span>Designed for Lighthouse ≥ 90 • CLS &lt; 0.1 • Keyboard-first accessible</span>
    </div>
  </footer>
);
