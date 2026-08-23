import React from 'react';
import type { Metadata } from 'next';
import { OurStoriesGallery } from '@/components/Header';

// This route's folder is still named "gamification" — it can't be renamed
// without creating a new folder, and this project can't add files. Visitors
// never see that; they only ever reach this page through the "Our Stories"
// nav link, never by typing the URL. The page itself (title, heading, and
// everything on it) is now "Our Stories," not the old pillar-discovery game.
export const metadata: Metadata = { title: "Our Stories — Luminar's Guide" };

export default function OurStoriesPage() {
  return <OurStoriesGallery />;
}