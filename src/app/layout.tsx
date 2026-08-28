import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Public_Sans, Lora } from 'next/font/google';
import '../styles/tailwind.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "LuminarGuide — Development Beyond the Textbook",
  description:
    "LuminarGuide helps students in grades 6–12 grow beyond the textbook — building self-awareness, resilience, and the skills to face their real challenges, with mentors, parents, schools, and counselors all in the loop.",
  openGraph: {
    title: "LuminarGuide — Development Beyond the Textbook",
    description: "Mentor-led personal development for students in grades 6–12, starting with self-awareness and inner strength.",
    images: [{ url: 'https://ldkwhimqenxkloibhwzt.supabase.co/storage/v1/object/public/Branding/combined_logo%20(2).png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="violet" className={`${publicSans.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var t=localStorage.getItem('luminarsguide-theme');document.documentElement.setAttribute('data-theme',['violet','teal-dark'].indexOf(t)>-1?t:'violet');}catch(e){}",
          }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fluminargui9141back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body className={publicSans.className}>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}