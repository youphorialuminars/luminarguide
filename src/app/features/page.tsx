import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { exclusivePillar } from '@/lib/siteConfig';
import { ScenarioIcon } from '@/components/Header';

export const metadata: Metadata = { title: 'Features — LuminarsGuide' };

// What actually sets this apart — deliberately not a pillar list (that's
// covered on /about) and not a repeat of the home page's cards. "People
// First" and "AI, Balanced" used to be one combined tile; they're split so
// each idea gets room to breathe instead of competing for the same sentence.
const features = [
  {
    title: 'People First, Always',
    description:
      "Every session is run by a trained mentor. Every hard conversation happens with an experienced counselor. Every group task is worked through with peers, together. That's the part that doesn't change, whatever else does.",
    detail: 'Trained mentors, experienced counselors, peer groups',
  },
  {
    title: 'Beyond the Screen',
    description:
      "Group tasks, mentor calls, offline classes and activities, and learning that stays fun and interactive — not a student alone with an app. Regional and national Luminar'sGuide meets let students see their growth shared and complemented by peers from far beyond their own city, too.",
    detail: 'Group work, mentor calls, regional meets',
  },
  {
    title: 'A Record That Grows With the Student',
    description:
      "A single check-in can't capture how much a student changes between Class 6 and Class 12. This builds a running record instead — mentor notes, milestones, and trends across years, not just the last session.",
    detail: 'Full history from Class 6 onward',
  },
  {
    title: 'Privacy by Design',
    description:
      'Parents see a protected summary of progress — never raw session transcripts. Schools see aggregate, de-identified trends — never a single student\'s private details. Every role sees exactly what helps them support the student, and nothing more.',
    detail: 'Role-appropriate access, always',
  },
  {
    title: 'One Shared Picture, No Silos',
    description:
      'Mentors, parents, schools, and counselors all work from the same student profile — each seeing only the slice that\'s relevant to their role, so no one is working from outdated information.',
    detail: 'Mentors, parents, schools, and counselors, aligned',
  },
];

const steps = [
  { title: 'A student is onboarded', body: 'An admin approves the student account, and mentors, parents, and counselors are linked with appropriate role-based access.' },
  { title: 'Activity generates insight', body: "As mentors log observations and students engage with the platform, a clear picture builds across the student's pillars." },
  { title: 'Every stakeholder sees their view', body: 'Mentors get actionable recommendations, parents get a digestible summary, schools get an aggregate view, counselors get context.' },
  { title: 'Progress compounds over time', body: 'The record travels with the student from Class 6 onward, so growth is visible over years, not just weeks.' },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Platform Features</p>
          <h1 className="text-section-heading text-foreground mb-5">Everything it takes to grow a student beyond the textbook.</h1>
          <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
            Core capabilities that work together to give every student — and everyone who supports them — the full picture, at every stage of school.
          </p>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`bento-card flex flex-col gap-3 ${i === features.length - 1 ? 'md:col-span-2' : ''}`}
            >
              <h3 className="text-card-heading text-foreground">{f.title}</h3>
              <p className={`text-sm leading-relaxed text-muted-foreground flex-1 ${i === features.length - 1 ? 'md:max-w-2xl' : ''}`}>{f.description}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                <span className="text-xs text-muted-foreground">{f.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bento-card flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="icon-wrapper flex-shrink-0" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.12)', color: 'var(--accent)' }}>
              <ScenarioIcon pillarId={exclusivePillar.id} size={22} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-card-heading text-foreground">{exclusivePillar.name}</h3>
                <span
                  className="text-[10px] font-600 uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ fontWeight: 600, backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                >
                  Any grade, on request
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground mt-1">{exclusivePillar.whyItMatters}</p>
            </div>
            <Link href="/get-started" className="btn-secondary flex-shrink-0 whitespace-nowrap">Ask about it</Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-section-heading text-foreground mb-10">From onboarding to ongoing insight.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={s.title} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-3">
                <span className="text-xs font-700 text-primary">Step {i + 1}</span>
                <h3 className="text-card-heading text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background text-center">
                <Link href="/get-started" className="btn-primary">Ask Us Anything</Link>
      </section>
    </>
  );
}