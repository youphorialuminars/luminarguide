import React from 'react';
import type { Metadata } from 'next';
import HeroSection from '@/app/components/HeroSection';
import AboutSection from '@/app/components/AboutSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import ContactSection from '@/app/components/ContactSection';

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