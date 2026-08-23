import React from 'react';
import { stakeholders } from '@/lib/siteConfig';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>
            The Program
          </p>
          <h2 className="text-section-heading text-foreground mb-5">
            Development that happens outside the textbook.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            A birthday card that says "so proud of you" with no real conversation behind it about how they're
            actually doing. A parent-teacher meeting that covers grades and behavior but never once asks who this
            student is becoming. LuminarGuide exists for the part of growing up that happens in between — guided by
            trained mentors and experienced counselors who know each student as a person, not just a set of grades.
          </p>
        </div>

        {/* Psychology grounding — replaces the old grade-band/"live in
            pilot" recap here (that's covered with more depth on /about and
            in the Features section further down the page). This just makes
            the "why" behind the pillars clear without repeating either. */}
        <div className="max-w-3xl">
          <h3 className="text-card-heading text-foreground mb-4">
            The psychology of growing up, built into every session.
          </h3>
          <p className="text-base leading-relaxed text-muted-foreground">
            Every pillar is built on real psychology — how a student's sense of who they are takes shape, why
            small wins and recognition keep someone motivated, how identity forms through the teenage years.
            None of it is guesswork. It's the same thinking a child psychologist would bring to the room,
            translated into something a mentor can actually run with a student, every week.
          </p>
        </div>

        {/* Stakeholders — supporting mention, not the headline */}
        <div className="mt-14 flex flex-wrap items-center gap-3 pt-8 border-t border-border">
          <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>
            Built with everyone around the student:
          </p>
          <div className="flex flex-wrap gap-2">
            {stakeholders.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-1.5 bg-muted border border-border rounded-full px-3 py-1 text-xs font-500 text-foreground"
                style={{ fontWeight: 500 }}
              >
                <span>{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}