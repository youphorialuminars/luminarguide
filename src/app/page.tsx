import React from 'react';
import type { Metadata } from 'next';
import HeroSection from '@/app/components/HeroSection';
import AboutSection from '@/app/components/AboutSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import ContactSection from '@/app/components/ContactSection';
import { purpose } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: "LuminarGuide — Development Beyond the Textbook",
  description:
    "LuminarGuide helps students in grades 6–12 grow beyond the textbook — self-awareness, resilience, and practical life skills, guided by trained mentors and a shared view for parents, schools, and counselors.",
  openGraph: {
    title: "LuminarGuide — Development Beyond the Textbook",
    description: "Mentor-guided personal development for students in grades 6–12, starting with self-awareness and inner strength.",
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />

      <div className="max-w-6xl mx-auto px-6">
        <div className="section-divider" />
      </div>

      {/* "Why LuminarGuide" — Vision, Mission, and the fuller Message to
          Parents. Folded directly into this page (no separate component
          file) since new files/folders can't be created on the Rocket.new
          side of this project. Sits right after the Hero because this is
          the "why" — before AboutSection gets into the "what."

          Vision/Mission use the same bento-card + icon-wrapper treatment as
          the "How It Runs" cards in FeaturesSection, and the Note to Parents
          panel reuses the Hero's three-layer gradient technique — so this
          section reads as part of the same design system instead of a
          plain-text block dropped in on its own. */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-6">

          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-10 text-center" style={{ fontWeight: 600 }}>
            Why LuminarGuide
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="bento-card flex flex-col gap-4">
              <div className="icon-wrapper" style={{ backgroundColor: 'rgba(22,33,44,0.08)', color: 'var(--primary)' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M1 11S4.5 5 11 5s10 6 10 6-3.5 6-10 6S1 11 1 11z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-600 text-primary uppercase tracking-widest mb-2" style={{ fontWeight: 600 }}>
                  Vision
                </p>
                <h2 className="text-card-heading text-foreground mb-3">
                  {purpose.vision.heading}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {purpose.vision.description}
                </p>
              </div>
            </div>

            <div className="bento-card flex flex-col gap-4">
              <div className="icon-wrapper" style={{ backgroundColor: 'rgba(166,126,51,0.12)', color: 'var(--accent)' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="11" cy="11" r="1" fill="currentColor" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-600 uppercase tracking-widest mb-2" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                  Mission
                </p>
                <h2 className="text-card-heading text-foreground mb-3">
                  {purpose.mission.heading}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {purpose.mission.description}
                </p>
              </div>
            </div>
          </div>

          {/* Message to parents — the emotional/positioning core, so it gets
              the site's strongest visual treatment: the same gradient panel
              as the Hero's visual, not a flat tinted box. */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }} />
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(60% 60% at 85% 15%, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(175deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.4) 100%)' }} />

            <div className="relative">
              <span
                className="block leading-none mb-2"
                style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', color: 'rgba(255,255,255,0.35)' }}>

                &ldquo;
              </span>
              <p
                className="text-xs font-600 uppercase tracking-widest mb-3 -mt-6"
                style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>

                A Note to Parents
              </p>
              <h3
                className="mb-4"
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)', lineHeight: 1.25, color: '#FFFFFF' }}>

                {purpose.messageToParents.heading}
              </h3>
              <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.92)' }}>
                {purpose.messageToParents.description}
              </p>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="section-divider" />
      </div>

      <AboutSection />

      <div className="max-w-6xl mx-auto px-6">
        <div className="section-divider" />
      </div>

      <FeaturesSection />

      <div className="max-w-6xl mx-auto px-6">
        <div className="section-divider" />
      </div>

      <ContactSection />
    </>
  );
}