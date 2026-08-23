import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { programStages, gradeBands, stakeholders, stakeholderDetails } from '@/lib/siteConfig';

export const metadata: Metadata = { title: 'About — LuminarGuide' };

function RoleCard({ role }: { role: 'Mentors' | 'Parents' | 'Schools' | 'Counselors' }) {
  const icon = stakeholders.find((s) => s.label === role)?.icon ?? '';
  const detail = stakeholderDetails.find((s) => s.role === role);
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 h-full">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <p className="text-sm font-700 text-foreground" style={{ fontWeight: 700 }}>{role}</p>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{detail?.description}</p>
    </div>
  );
}

function StudentHub() {
  return (
    <div
      className="rounded-2xl p-7 text-center flex flex-col items-center justify-center gap-2 h-full"
      style={{ backgroundColor: 'var(--primary)' }}
    >
      <span className="text-3xl">🎒</span>
      <p className="text-sm font-700 uppercase tracking-wide" style={{ fontWeight: 700, color: 'var(--primary-foreground)' }}>
        The Student
      </p>
      <p className="text-xs leading-relaxed max-w-[22ch]" style={{ color: 'var(--primary-foreground)', opacity: 0.85 }}>
        Every role around them exists to support one shared, honest view of how they're doing.
      </p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">About the Program</p>
          <h1 className="text-section-heading text-foreground mb-5">Development that happens outside the textbook.</h1>
          <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
            A student who can solve any equation on the board but freezes when asked what they actually want. A group
            chat that goes silent for two days after a disagreement no one knows how to have out loud. A college
            application asking "what are your goals?" to someone who's never once been asked that by an adult.
            LuminarGuide exists for exactly this — the growth a report card never measures — guided by trained
            mentors and experienced counselors who know each student as a person, not just a set of grades.
          </p>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-card border border-border rounded-2xl p-8">
            <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Our Approach</p>
            <p className="text-lg leading-relaxed text-foreground mb-4" style={{ fontWeight: 500 }}>
              We think of becoming a responsible, grounded person as a journey in three stages: first understanding
              yourself, then learning to relate to others, and finally learning to contribute to society. Classes 6
              through 12 are where all three stages begin — but the adults who care about a student's growth usually
              only see a fragment of the picture.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              LuminarGuide is currently piloting <strong className="text-foreground">Stage 1: Intrinsic Development</strong> in
              schools. Stages 2 and 3 build directly on top of it and are actively in development.
            </p>
          </div>
        </div>
      </section>

      {/* Three-stage roadmap */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-3">The Roadmap</p>
          <h2 className="text-section-heading text-foreground mb-10">Three stages toward becoming a responsible person in society.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {programStages.map((stage) =>
              stage.status === 'live' ? (
                <div key={stage.id} className="bento-card flex flex-col gap-3 relative">
                  <span
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2"
                    style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-700 text-muted-foreground tabular-nums">Stage {stage.order}</span>
                    <span
                      className="text-[10px] font-600 uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 600 }}
                    >
                      {stage.statusLabel}
                    </span>
                  </div>
                  <h3 className="text-card-heading text-foreground">{stage.name}</h3>
                  <p className="text-xs font-600 text-primary">{stage.tagline}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground flex-1">{stage.description}</p>
                </div>
              ) : (
                <div key={stage.id} className="flex flex-col gap-3 border border-border p-8" style={{ borderRadius: 'var(--radius)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-700 text-muted-foreground tabular-nums">Stage {stage.order}</span>
                    <span
                      className="text-[10px] font-600 uppercase tracking-wide px-2 py-0.5 rounded-full border border-border"
                      style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}
                    >
                      {stage.statusLabel}
                    </span>
                  </div>
                  <h3 className="text-card-heading text-muted-foreground">{stage.name}</h3>
                  <p className="text-xs font-600 text-muted-foreground">{stage.tagline}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground flex-1">{stage.description}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Grade band deep dives */}
      {gradeBands.map((band, bandIndex) => (
        <section key={band.id} className={`py-20 ${bandIndex % 2 === 0 ? 'bg-muted' : 'bg-background'}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <p className="text-xs font-600 text-primary uppercase tracking-widest">{band.gradesLabel} · {band.bandLabel}</p>
              <span
                className="text-[10px] font-600 uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: band.status === 'live' ? 'var(--primary)' : 'var(--card)',
                  color: band.status === 'live' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  border: band.status === 'live' ? 'none' : '1px solid var(--border)',
                }}
              >
                {band.statusLabel}
              </span>
            </div>
            <h2
              className="font-700 text-foreground mb-5 max-w-3xl leading-snug"
              style={{ fontWeight: 700, fontSize: 'clamp(1.375rem, 2.2vw, 1.75rem)', letterSpacing: '-0.015em' }}
            >
              {band.ageContext}
            </h2>

            <div className="flex flex-wrap gap-3">
              {band.challenges.map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-2.5 bg-card border-2 border-border rounded-full px-4 py-2.5 text-base font-800 shadow-sm"
                  style={{ fontWeight: 800, color: 'var(--foreground)' }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-3">Who We Work With</p>
          <h2 className="text-section-heading text-foreground mb-10">Everyone around the student, one shared view.</h2>

          {/* Desktop: a real relationship diagram — the student in the center,
              the four roles around them — instead of a flat row of labels. */}
          <div className="hidden md:grid grid-cols-3 gap-5">
            <div style={{ gridColumn: 1, gridRow: 1 }}><RoleCard role="Mentors" /></div>
            <div style={{ gridColumn: 2, gridRow: '1 / 3' }}><StudentHub /></div>
            <div style={{ gridColumn: 3, gridRow: 1 }}><RoleCard role="Parents" /></div>
            <div style={{ gridColumn: 1, gridRow: 2 }}><RoleCard role="Counselors" /></div>
            <div style={{ gridColumn: 3, gridRow: 2 }}><RoleCard role="Schools" /></div>
          </div>

          {/* Mobile: student first, then the four roles in a 2x2 grid below —
              same hierarchy, just stacked instead of arranged spatially. */}
          <div className="md:hidden flex flex-col gap-4">
            <StudentHub />
            <div className="grid grid-cols-2 gap-3">
              <RoleCard role="Mentors" />
              <RoleCard role="Parents" />
              <RoleCard role="Counselors" />
              <RoleCard role="Schools" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background text-center">
        <Link href="/get-started" className="btn-primary">Get Started</Link>
      </section>
    </>
  );
}