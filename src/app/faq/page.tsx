import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

export const metadata: Metadata = { title: 'FAQ — LuminarGuide' };

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqGroup {
  label: string;
  items: FaqItem[];
}

const faqGroups: FaqGroup[] = [
  {
    label: 'The Program',
    items: [
      {
        question: 'What is LuminarGuide?',
        answer:
          "A mentor-led development program for students in grades 6–12, focused on the growth that happens outside the textbook — self-awareness, resilience, and the real-world skills that grades don't measure. Every session is run by a trained mentor, with counselors, parents, and schools all working from the same picture.",
      },
      {
        question: 'Is this an AI program, or real people?',
        answer:
          "Real people. Every one-on-one and group session is run by a trained mentor, and hard conversations happen with an experienced counselor. There's no substitute for that in the program — technology supports the mentors' work, it doesn't replace them.",
      },
      {
        question: "What's actually available right now, versus still being built?",
        answer:
          "LuminarGuide develops students in three stages: Intrinsic Development (understanding yourself), Interpersonal Development (relating to others), and Social Development (contributing to society). Right now, we're piloting Stage 1 only, across all three grade bands — Classes 6–8, 9–10, and 11–12. Stages 2 and 3 are on the roadmap and always presented as in development, never as available today.",
      },
      {
        question: 'How is the program different for a Class 7 student versus a Class 12 student?',
        answer:
          "Each grade band works through a different set of pillars, chosen for what students in that age range are actually facing — things like speaking up in class and digital habits in Classes 6–8, board-exam pressure and stream selection in Classes 9–10, and college transitions and independence in Classes 11–12. You can see the full breakdown for any grade on the About page.",
      },
    ],
  },
  {
    label: 'For Parents',
    items: [
      {
        question: 'How do I get started as a parent?',
        answer: (
          <>
            Fill out the short form on the <Link href="/get-started" className="text-primary hover:underline">Get Started</Link> page —
            your name, email, and your child's grade is enough to begin. We read every submission ourselves and
            follow up within {siteConfig.contact.responseTime.toLowerCase()}. Sharing the form doesn't commit you to anything.
          </>
        ),
      },
      {
        question: "What will I actually see as a parent — do I see my child's private conversations?",
        answer:
          "No — you see a clear, approval-protected summary of your child's growth, never raw session transcripts. You'll also get suggested conversation starters based on what your child is working on, so you can support them at home without hovering.",
      },
      {
        question: 'What does a typical session look like for my child?',
        answer:
          "It depends on the pillar and format — one-on-one mentor conversations, small group sessions, and offline classes and activities are all part of the program. It's built to be interactive and human, not a student sitting alone with an app.",
      },
    ],
  },
  {
    label: 'For Mentors, Counselors & Schools',
    items: [
      {
        question: 'How do I apply to work with LuminarGuide as a mentor, counselor, or school?',
        answer: (
          <>
            Visit <Link href="/get-started" className="text-primary hover:underline">Get Started</Link> and switch to
            "Work With Us." Mentors and counselors can tell us about their background directly; schools can reach
            out to bring the Stage 1 pilot to their students.
          </>
        ),
      },
      {
        question: 'What do schools get access to?',
        answer:
          "Aggregate, de-identified well-being trends across your student body — never individual session details — so administrators can spot patterns early. This includes admin-level oversight, cohort-level reporting, and tools designed to support your existing counseling team, not replace it.",
      },
      {
        question: "What do counselors get that a single meeting with a student can't provide?",
        answer:
          "Longitudinal context — how a student has been trending over weeks and months, not just a single check-in. That makes it easier to spot students who may need earlier support and to coordinate with mentors and parents on next steps.",
      },
    ],
  },
  {
    label: 'Practical Questions',
    items: [
      {
        question: 'How much does LuminarGuide cost?',
        answer: (
          <>
            We're finalizing pricing tiers. In the meantime, reach out through{' '}
            <Link href="/contact" className="text-primary hover:underline">Contact</Link> and we'll quote based on
            your cohort size.
          </>
        ),
      },
      {
        question: 'Can I see the platform before committing to anything?',
        answer: (
          <>
            Yes — visit <Link href="/book-demo" className="text-primary hover:underline">Book a Demo</Link> and
            email us your preferred day and time. We'll walk you through the platform tailored to your role —
            school, mentorship program, or district.
          </>
        ),
      },
      {
        question: 'How quickly do you respond to messages?',
        answer: `We read every message ourselves — no ticketing queue — and reply ${siteConfig.contact.responseTime.toLowerCase()}.`,
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">FAQ</p>
          <h1 className="text-section-heading text-foreground mb-5">Questions, answered.</h1>
          <p className="text-base leading-relaxed text-muted-foreground max-w-xl mx-auto">
            Can't find what you're looking for?{' '}
            <Link href="/contact" className="text-primary hover:underline">Send us a message</Link> — we read every
            one ourselves.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {faqGroups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-4">{group.label}</p>
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <details
                    key={item.question}
                    className="group bg-card border border-border rounded-2xl px-5 py-4 open:shadow-sm transition-shadow"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-sm font-700 text-foreground">
                      {item.question}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="flex-shrink-0 transition-transform duration-200 group-open:rotate-45"
                      >
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </summary>
                    <p className="text-sm leading-relaxed text-muted-foreground mt-3">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/get-started" className="btn-primary">Get Started</Link>
        </div>
      </div>
    </section>
  );
}