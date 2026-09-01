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

/* The favicon is the site's own mark (no colored backing shape, per how
   the logo already looks) — navy for the light theme, off-white/teal-edged
   for the dark theme, matching each theme's own logo instead of one fixed
   icon. A static <link> can't react to the SITE's own light/dark toggle
   (only to the visitor's OS-level preference), so this is done in two
   places: the inline script below sets the correct one immediately on
   load (before paint, using whichever theme was last saved), and
   ThemeSwitcher.tsx updates it live whenever someone clicks the toggle. */
const FAVICON_BY_THEME = {
  violet: 'https://ldkwhimqenxkloibhwzt.supabase.co/storage/v1/object/public/Branding/faviconlight.png',
  'teal-dark': 'https://ldkwhimqenxkloibhwzt.supabase.co/storage/v1/object/public/Branding/favicondark.png',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="violet" className={`${publicSans.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" id="theme-favicon" href={FAVICON_BY_THEME.violet} />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var t=localStorage.getItem('luminarsguide-theme');t=['violet','teal-dark'].indexOf(t)>-1?t:'violet';document.documentElement.setAttribute('data-theme',t);var l=document.getElementById('theme-favicon');if(l)l.href=" + JSON.stringify(FAVICON_BY_THEME) + "[t];}catch(e){}",
          }}
        />
</head>
      <body className={publicSans.className}>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}