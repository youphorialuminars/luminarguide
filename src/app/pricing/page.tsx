import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Pricing — LuminarsGuide' };

// Pricing is deliberately off the public site for now (nav + footer links
// removed) while we're pitching schools and residential communities and
// don't want per-family numbers to be the first thing they see. This page
// is kept as a friendly landing spot for anyone who reaches /pricing
// directly (an old link, a bookmark, a search result) rather than a 404.
//
// The real tier data (Foundation/Ascend/Immersive, the billing-cycle math,
// the Single Pillar Track add-on) is untouched in `pricingPlans` and
// `pillarTrackAddOn` in siteConfig.ts — restoring the full pricing page
// later just means swapping this file's contents back, nothing to rebuild.
export default function PricingPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
        Pricing
      </p>
      <h1 className="text-section-heading text-foreground mb-5">Let's find the right fit first.</h1>
      <p className="text-base leading-relaxed text-muted-foreground mb-10">
        We tailor plans to each family, school, and community rather than a one-size list of numbers.
        Tell us a bit about what you're looking for and we'll walk you through the options and a quote
        that fits — no commitment either way.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/get-started" className="btn-primary">Ask Us Anything</Link>
      </div>
    </section>
  );
}