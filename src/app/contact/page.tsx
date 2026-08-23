import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/siteConfig';

export const metadata: Metadata = { title: 'Contact — LuminarGuide' };

export default function ContactPage() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Get in Touch</p>
        <h1 className="text-section-heading text-foreground mb-5">Ready to transform how you support students?</h1>
        <p className="text-base leading-relaxed text-muted-foreground mb-10">
          Whether you're a school administrator, educator, parent, or counselor — we'd love to show you how Luminar's
          Guide can work for your students. Send us a message and we'll be in touch within one business day.
        </p>
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-4 items-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-600">Email Us</p>
          <a href={`mailto:${siteConfig.contact.email}`} className="text-lg font-700 text-primary">{siteConfig.contact.email}</a>
          <p className="text-xs text-muted-foreground">{siteConfig.contact.responseTime}</p>
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Looking to work with us as a mentor, counselor, or school — or get started as a parent? Visit{' '}
          <a href="/get-started" className="text-primary font-600 hover:underline">Get Started</a> instead.
        </p>
      </div>
    </section>
  );
}