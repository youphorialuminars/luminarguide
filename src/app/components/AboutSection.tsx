import React from 'react';
import { stakeholders } from '@/lib/siteConfig';
import { StakeholderIcon } from '@/components/Header';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Header — kept to one paragraph on purpose. The deeper
            "psychology behind every pillar" explanation used to live here
            too, duplicating both the Our Approach card and the closing line
            on /about almost word for word. This is a teaser, not the full
            pitch — the full version lives on /about. */}
        <div className="max-w-2xl">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>
            The Program
          </p>
          <h2 className="text-section-heading text-foreground mb-5">
            Development that happens outside the textbook.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            A birthday card that says "so proud of you" with no real conversation behind it about how they're
            actually doing. A parent-teacher meeting that covers grades and behavior but never once asks who this
            student is becoming. LuminarsGuide exists for the part of growing up that happens in between.
          </p>
        </div>

        {/* Stakeholders — supporting mention, not the headline */}
        <div className="mt-10 flex flex-wrap items-center gap-3 pt-8 border-t border-border">
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
                <span style={{ color: 'var(--primary)' }}>
                  <StakeholderIcon role={s.label as 'Students' | 'Mentors' | 'Parents' | 'Schools' | 'Counselors'} size={13} />
                </span>
                {s.label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}