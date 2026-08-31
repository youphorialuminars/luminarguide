import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Contact — LuminarGuide' };

// This standalone page used to be a bare mailto link, and the site's nav
// used to point here separately from /get-started — two different,
// inconsistent paths to "reach out." That's been consolidated: every
// "Ask Us Anything" button across the site (header, footer, hero, and the
// bottom of every page) now points to the one real form at /get-started
// instead. This page is kept as a soft landing for anyone who reaches
// /contact directly — an old link, a bookmark, a search result — so it's
// a redirect-style page rather than a dead end.
export default function ContactPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Get in Touch</p>
      <h1 className="text-section-heading text-foreground mb-5">Let's talk.</h1>
      <p className="text-base leading-relaxed text-muted-foreground mb-10">
        Whether you're a parent, a mentor, a counselor, or a school — tell us a bit about what
        you're looking for and we'll follow up directly. No commitment either way.
      </p>
      <Link href="/get-started" className="btn-primary">Ask Us Anything</Link>
    </section>
  );
}