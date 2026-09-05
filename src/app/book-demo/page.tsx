import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/siteConfig';

export const metadata: Metadata = { title: 'Book a Demo — LuminarsGuide' };

export default function BookDemoPage() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Book a Demo</p>
        <h1 className="text-section-heading text-foreground mb-5">See Luminar's Guide in action.</h1>
        <p className="text-base leading-relaxed text-muted-foreground mb-10">
          We'll walk you through the platform tailored to your role — school, mentorship program, or district. A
          booking form is coming soon; for now, email us your preferred day and time and we'll confirm.
        </p>
        <a href={`mailto:${siteConfig.contact.email}?subject=Demo%20Request`} className="btn-primary">Email Us to Book a Demo</a>
      </div>
    </section>
  );
}