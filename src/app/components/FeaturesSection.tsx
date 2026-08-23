'use client';

import React, { useState } from 'react';
import { gradeBands, type GradeBand } from '@/lib/siteConfig';
import { ScenarioIcon } from '@/components/Header';

interface FeatureCard {
  title: string;
  description: string;
  accentColor: string;
  iconColor: string;
  detail?: string;
  icon: React.ReactNode;
  deepDive: string;
}

const features: FeatureCard[] = [
  {
    title: 'People First, Always',
    description:
      "Every student gets one-on-one mentor sessions, regular conversations with a counselor, and group work built for peer learning — the human connection every student needs, at every age.",
    accentColor: 'rgba(22,33,44,0.08)',
    iconColor: 'var(--primary)',
    detail: 'Trained mentors, experienced counselors, peer groups',
    deepDive:
      "A mentor runs every session. A counselor has every hard conversation. Peers work through group tasks together in person and online. The growth that matters most here happens between people, because that's where it's always happened.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3C7.13 3 4 6.13 4 10c0 2.39 1.19 4.5 3 5.74V18h8v-2.26C16.81 14.5 18 12.39 18 10c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 18h6M9 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Beyond the Screen',
    description:
      "Group tasks, mentor calls, offline classes and activities, and learning that stays fun and interactive — not a student alone with an app. Intra-school and inter-school events let students see their growth shared and complemented by others, too.",
    accentColor: 'rgba(59,130,246,0.08)',
    iconColor: '#3B82F6',
    detail: 'Group work, mentor calls, school events',
    deepDive:
      "A pillar isn't learned by reading about it — it's practiced. That's why sessions include group tasks worked through with classmates, live mentor calls, and offline activities, not just screen time. Intra-school and inter-school events carry the same growth out into the wider community, so a student's progress is something they see reflected in others, not something that happens to them alone.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="8.5" r="2.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.5 18c.5-3.3 2.6-5.1 5.5-5.1s5 1.8 5.5 5.1M13.5 18c.4-2.3 1.8-4 3.8-4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Longitudinal Progress Tracking',
    description:
      "Track each student's growth over weeks, months, and years. Spot trends early, celebrate milestones, and build a rich developmental record that travels with the student from Class 6 to Class 12.",
    accentColor: 'rgba(166,126,51,0.1)',
    iconColor: 'var(--accent)',
    detail: 'Full history from Class 6 onward',
    deepDive:
      "Classes 6 through 12 span the fastest developmental years a student will ever have. A single check-in can't capture that arc, but a running record can. Mentors can see exactly when a student's confidence dipped, when leadership skills clicked, or when a pillar needs renewed focus — turning scattered observations into one coherent story of a student's growth, stage by stage.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 17l4-5 4 3 4-6 4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 3v16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

// A small static cursor/pointer icon used anywhere the page hints "hover or
// tap this" — replaces an animated 👆 emoji that read as childish and, at a
// glance, was easy to mistake for something else entirely.
function HoverHintIcon() {
  return (
    <span className="relative inline-flex items-center justify-center w-4 h-4 flex-shrink-0">
      <span
        className="absolute w-2 h-2 rounded-full animate-tap-ripple"
        style={{ backgroundColor: 'var(--accent)', bottom: -1, left: 0 }}
      />
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 animate-tap-hand"
      >
        <rect x="9.3" y="2.5" width="3.2" height="10" rx="1.6" />
        <rect x="12.3" y="5" width="3" height="7.8" rx="1.5" />
        <rect x="15.2" y="6.6" width="2.8" height="6.4" rx="1.4" />
        <rect x="4.9" y="12.6" width="4.4" height="2.8" rx="1.4" transform="rotate(-28 4.9 12.6)" />
        <path d="M7.3 14.2v1.5c0 3.1 2.5 5.7 5.7 5.7h.5c3 0 5.1-2.2 5.1-5.4v-3.4" />
      </svg>
    </span>
  );
}

export default function FeaturesSection() {
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const [activeBand, setActiveBand] = useState<GradeBand['id']>('middle');

  const toggleTile = (id: string) => {
    setActiveTile((prev) => (prev === id ? null : id));
  };

  const flipTransform = (id: string) =>
    activeTile === id ? '[transform:rotateY(180deg)]' : 'group-hover:[transform:rotateY(180deg)]';

  const band = gradeBands.find((b) => b.id === activeBand) ?? gradeBands[0];

  // Pillar tiles — flip on hover/tap to reveal why each one matters. Uses a
  // CSS-grid stack (both faces share one grid cell via grid-area:1/1) instead
  // of absolute-positioned faces, so the tile's height grows to fit whichever
  // face has more to say — the flip-back explanation used to be one clipped
  // sentence; now it's the full psychology rationale, and the tile just grows
  // to hold it instead of truncating.
  const renderPillarTile = (pillar: (typeof band.pillars)[number]) => {
    const id = `pillar-${band.id}-${pillar.id}`;
    return (
      <div
        key={id}
        className="group/tile [perspective:1000px] cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          toggleTile(id);
        }}
      >
        <div
          className={`relative w-full grid transition-transform duration-500 [transform-style:preserve-3d] ${
            activeTile === id ? '[transform:rotateY(180deg)]' : 'group-hover/tile:[transform:rotateY(180deg)]'
          }`}
        >
          <div className="[grid-area:1/1] [backface-visibility:hidden] flex flex-col items-center justify-center gap-2 text-center p-4 rounded-xl border border-border bg-card min-h-[160px]">
            <span style={{ color: 'var(--primary)' }}>
              <ScenarioIcon pillarId={pillar.id} size={26} />
            </span>
            <span className="text-sm font-600 text-foreground leading-tight" style={{ fontWeight: 600 }}>
              {pillar.name}
            </span>
            <span className="text-[11px] text-muted-foreground leading-snug">{pillar.short}</span>
          </div>
          <div
            className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center rounded-xl p-4"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <p className="text-[11px] leading-relaxed text-center" style={{ color: 'var(--primary-foreground)' }}>
              {pillar.whyItMatters}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderFeatureCard = (feature: FeatureCard, id: string) => (
    <div className="group min-h-[280px] [perspective:1200px] cursor-pointer" onClick={() => toggleTile(id)}>
      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipTransform(id)}`}>
        <div className="absolute inset-0 [backface-visibility:hidden] bento-card flex flex-col gap-5 min-h-[280px]">
          <div className="icon-wrapper" style={{ backgroundColor: feature.accentColor, color: feature.iconColor }}>
            {feature.icon}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-card-heading text-foreground">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground flex-1">{feature.description}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <HoverHintIcon /> Tap or hover for deeper insight
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
            <span className="text-xs text-muted-foreground">{feature.detail}</span>
          </div>
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl p-6 flex flex-col justify-center gap-3" style={{ backgroundColor: 'var(--primary)' }}>
          <h3 className="text-card-heading" style={{ color: 'var(--primary-foreground)' }}>{feature.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--primary-foreground)', opacity: 0.95 }}>
            {feature.deepDive}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section id="features" className="py-20 bg-muted scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-xs font-600 text-primary uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>
              The Program
            </p>
            <h2 className="text-section-heading text-foreground mb-4">
              Five pillars. Three stages. One student, followed the whole way.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              A Tuesday session that's just a mentor and a student talking, no textbook involved. A Thursday task
              worked through with four classmates over video call. A parent and a counselor comparing notes by the
              weekend. None of it looks like homework — all of it is the program. Pick a grade band below to see
              which five pillars a session like this is actually built around.
            </p>
          </div>
          <a href="#contact" className="flex items-center gap-2 text-sm font-600 text-primary hover:text-secondary-foreground transition-colors group whitespace-nowrap" style={{ fontWeight: 600 }}>
            Request a demo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Grade-band pillar picker — the section's opening structure now,
            not a buried fourth card. This is the actual product. */}
        <div className="bento-card flex flex-col gap-5 min-h-[280px] mb-8" style={{ overflow: 'visible' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="icon-wrapper" style={{ backgroundColor: 'rgba(22,33,44,0.06)', color: 'var(--primary)' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 19.5C11 19.5 3 14 3 8.5C3 6.01 5.01 4 7.5 4C9.24 4 10.75 4.96 11.5 6.36C12.25 4.96 13.76 4 15.5 4C17.99 4 20 6.01 20 8.5C20 14 12 19.5 11 19.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-card-heading text-foreground">Pillars That Grow With the Student</h3>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <HoverHintIcon /> Pick a grade band, then tap or hover a pillar to see why it matters
                </p>
              </div>
            </div>
            {/* Grade band tabs */}
            <div className="flex gap-1.5 bg-muted rounded-full p-1">
              {gradeBands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveBand(b.id);
                    setActiveTile(null);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-600 transition-colors"
                  style={{
                    fontWeight: 600,
                    backgroundColor: activeBand === b.id ? 'var(--primary)' : 'transparent',
                    color: activeBand === b.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  }}
                >
                  {b.gradesShort}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>{band.gradesLabel} — {band.bandLabel}</p>
              <span
                className="text-[10px] font-600 uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  fontWeight: 600,
                  backgroundColor: band.status === 'live' ? 'var(--primary)' : 'var(--muted)',
                  color: band.status === 'live' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                {band.statusLabel}
              </span>
            </div>

            {/* First 4 pillars run two-per-row on a real grid; the 5th sits in
                the same grid (col-span-2) and is width-matched to exactly one
                column via calc(), then centered — so it's never a visually
                shrunken leftover next to full-width siblings. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {band.pillars.slice(0, 4).map((pillar) => renderPillarTile(pillar))}
              {band.pillars[4] && (
                <div className="sm:col-span-2 flex justify-center">
                  <div className="w-full sm:w-[calc(50%-0.375rem)]">{renderPillarTile(band.pillars[4])}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
            <span className="text-xs text-muted-foreground">Move beyond grades — real challenges, addressed by age.</span>
          </div>
        </div>

        {/* Supporting cards: how the program actually runs day to day */}
        <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
          How It Runs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderFeatureCard(features[0], 'card-0')}
          {renderFeatureCard(features[1], 'card-1')}
          {renderFeatureCard(features[2], 'card-2')}
        </div>

      </div>
    </section>
  );
}