 import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Pricing — LuminarGuide' };

export default function PricingPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Pricing</p>
      <h1 className="text-section-heading text-foreground mb-4">Pricing</h1>
      <p className="text-base text-muted-foreground max-w-xl mx-auto mb-6">
        Detailed pricing tiers are coming soon. Reach out and we'll quote based on your cohort size.
      </p>
      <Link href="/contact" className="btn-secondary">Contact Us</Link>
    </section>
  );
}