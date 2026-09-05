import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

export const metadata: Metadata = { title: 'Contact — LuminarsGuide' };

export default function ContactPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Get in Touch</p>
      <h1 className="text-section-heading text-foreground mb-5">Let's talk.</h1>
      <p className="text-base leading-relaxed text-muted-foreground mb-8">
        Whether you're a parent, a mentor, a counselor, or a school — mail us directly, or reach
        out through Get Started and we'll follow up personally. No commitment either way.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a href={`mailto:${siteConfig.contact.email}`} className="btn-primary">
          Mail Us at {siteConfig.contact.email}
        </a>
        <span className="text-sm text-muted-foreground">or</span>
        <Link href="/get-started" className="btn-primary">Ask Us Anything</Link>
      </div>
    </section>
  );
}