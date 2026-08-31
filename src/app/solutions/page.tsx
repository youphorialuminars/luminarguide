import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RoleSolutionTile, StakeholderIcon } from '@/components/Header';
import { purpose } from '@/lib/siteConfig';

export const metadata: Metadata = { title: 'Solutions — LuminarGuide' };

const roles: {
  role: 'Mentors' | 'Parents' | 'Schools' | 'Counselors';
  headline: string;
  points: string[];
  theory: { name: string; description: string };
}[] = [
  {
    role: 'Mentors',
    headline: 'Know exactly where to focus your next conversation.',
    points: [
      'Spend less time reconstructing where a student left off, and more time on the conversation that actually moves them forward',
      "Nothing gets lost between sessions — a running record of observations, grounded in real notes, carries the context forward for you",
      'Walk into every session already knowing what’s trending, instead of starting from a guess',
      'Your work connects to the bigger picture — parents, schools, and counselors are seeing the same story, not a different one',
    ],
    theory: {
      name: "Vygotsky's Zone of Proximal Development",
      description:
        "A mentor's job isn't to solve a problem for a student, or to leave them to struggle alone — it's to work inside their Zone of Proximal Development, the space between what they can do independently and what they can do with the right support. LuminarGuide's session insights exist to help you find that space quickly, so scaffolding can be precise instead of guessed at, and gradually withdrawn as competence grows.",
    },
  },
  {
    role: 'Parents',
    headline: "Stay meaningfully connected to your child's growth.",
    points: [
      "Stay genuinely close to your child's growth without needing to ask, and without hovering",
      'See progress build over months and years, not just isolated snapshots',
      "Nothing is visible to you without your child's own approval too — so trust with your child was never the cost of visibility",
      'A direct line to mentors and counselors means small concerns get caught before they become big ones',
      'Guided activities help you actually understand and appreciate who your child is becoming — not just monitor them',
    ],
    theory: {
      name: 'Authoritative Parenting & Attachment Theory (Baumrind)',
      description:
        'Decades of developmental research consistently point to authoritative parenting — high warmth paired with high structure — as the style most associated with resilience, self-regulation, and healthy identity formation. LuminarGuide is built around that balance: enough visibility to stay warmly engaged with your child\'s growth, without tipping into the surveillance that undermines the very independence they\'re trying to build.',
    },
  },
  {
    role: 'Schools',
    headline:'A unified, administrator-level view of student well-being.',
    points: [
      'See patterns across your whole student body that no single classroom or counselor could catch alone',
      "A consistent, structured approach to student well-being — not scattered efforts that vary teacher to teacher",
      'Real evidence behind your social-emotional learning initiatives, not just good intentions',
      'Admin-level approval keeps every mentor, student, and counselor account accountable to your institution',
      'Support for hosting intra-school and inter-school events that bring the pillars to life beyond the platform',
    ],
    theory: {
      name: "Bronfenbrenner's Ecological Systems Theory",
      description:
        "A student's development doesn't happen in isolation — it's shaped by nested systems (family, peers, classroom, and school culture) that all influence one another. That's why LuminarGuide treats the school as a system-level lever, not just a venue: consistent, structured data at the institutional level strengthens the whole ecosystem around a student, not only the individual interventions inside it.",
    },
  },
  {
    role: 'Counselors',
    headline: 'Spot students who may need support earlier.',
    points: [
      "Catch a student trending toward difficulty earlier — while there's still room to help before a crisis point",
      'Longitudinal context no single session could ever surface on its own',
      "See exactly what's relevant to your role, without sorting through information that isn't",
      'Work from the same picture as mentors and schools, instead of in a separate lane',
    ],
    theory: {
      name: 'Person-Centered Counseling & Early Identification (Rogers)',
      description:
        "Carl Rogers' person-centered approach — built on empathy, unconditional positive regard, and genuineness — remains foundational to effective student counseling, and LuminarGuide is designed to support that relationship, never replace it. Its role is upstream of the conversation: longitudinal context helps a counselor notice a student trending toward difficulty earlier, so the person-centered work can start before a crisis point, not after one.",
    },
  },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Solutions by Role</p>
          <h1 className="text-section-heading text-foreground mb-5">A tailored view for every role in a student's life.</h1>
          <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
            The student's own development is always the focus — here's how each person supporting them plugs in, and
            the developmental psychology behind why each role matters.
          </p>
        </div>
      </section>

      {roles.map((r, i) => (
        <React.Fragment key={r.role}>
          <section className={`py-16 ${i % 2 === 0 ? 'bg-muted' : 'bg-background'}`}>
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex flex-col gap-4 self-start">
                <span style={{ color: 'var(--primary)' }}>
                  <StakeholderIcon role={r.role} size={30} />
                </span>
                <h2 className="text-section-heading text-foreground">{r.headline}</h2>
                <p className="text-sm font-600 text-primary uppercase tracking-wide">{r.role}</p>
              </div>
              <RoleSolutionTile points={r.points} theoryName={r.theory.name} theoryDescription={r.theory.description} />
            </div>
          </section>

          {/* A Note to Schools — the same emotional/positioning core as the
              homepage's "A Note to Parents," so it gets the same strongest
              visual treatment (the gradient panel), placed right after the
              Schools block rather than at the end so it reads as part of
              that section's own case, not a generic closing statement. */}
          {r.role === 'Schools' && (
            <section className={`py-16 ${i % 2 === 0 ? 'bg-background' : 'bg-muted'}`}>
              <div className="max-w-6xl mx-auto px-6">
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

                      A Note to Schools
                    </p>
                    <h3
                      className="mb-4"
                      style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)', lineHeight: 1.25, color: '#FFFFFF' }}>

                      {purpose.messageToSchools.heading}
                    </h3>
                    <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.92)' }}>
                      {purpose.messageToSchools.description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </React.Fragment>
      ))}

      <section className="py-16 bg-background text-center">
        <Link href="/get-started" className="btn-primary">Get Started</Link>
      </section>
    </>
  );
}