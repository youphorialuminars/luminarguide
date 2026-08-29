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
          the "why" — before AboutSection gets into the "what." */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">

          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-3 text-center" style={{ fontWeight: 600 }}>
            Why LuminarGuide
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div>
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>
                Vision
              </p>
              <h2 className="text-card-heading text-foreground mb-3" style={{ lineHeight: 1.35 }}>
                {purpose.vision.heading}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {purpose.vision.description}
              </p>
            </div>

            <div>
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>
                Mission
              </p>
              <h2 className="text-card-heading text-foreground mb-3" style={{ lineHeight: 1.35 }}>
                {purpose.mission.heading}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {purpose.mission.description}
              </p>
            </div>
          </div>

          {/* Message to parents — the emotional/positioning core, so it gets
              the most visual weight: a highlighted card, not just a paragraph. */}
          <div
            className="rounded-2xl p-8 md:p-10 border border-border"
            style={{ backgroundColor: 'var(--muted)' }}>

            <p className="text-xs font-600 uppercase tracking-widest mb-3" style={{ fontWeight: 600, color: 'var(--accent)' }}>
              A Note to Parents
            </p>
            <h3 className="text-section-heading text-foreground mb-4" style={{ fontSize: 'clamp(1.375rem, 2.4vw, 1.875rem)' }}>
              {purpose.messageToParents.heading}
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
              {purpose.messageToParents.description}
            </p>
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