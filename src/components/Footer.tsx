import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

const links = [
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Our Stories', href: '/gamification' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Book a Demo', href: '/book-demo' },
  { label: 'Work With Us', href: '/get-started' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-6 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</p>
      </div>
    </footer>
  );
}