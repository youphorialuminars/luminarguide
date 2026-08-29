import { createClient } from '@supabase/supabase-js';

/**
 * Central place for site-wide facts AND all program content: brand name,
 * Central place for site-wide facts AND all program content: brand name,
 * contact details, and — because this project can't add new files — the
 * entire pillar/program data model that used to live in a separate
 * `program.ts`. Everything below is imported by the home page sections and
 * the /about, /features, /faq pages, and the Header's pillar chatbot.
 *
 * NOTE: phone, LinkedIn, and Instagram are placeholders. Fill in the real
 * values here before launch — everywhere these appear on the site (footer,
 * contact page) reads from this one file.
 *
 * ---------------------------------------------------------------------
 * THE PROGRAM
 * LuminarGuide develops students outside the textbook, in three stages:
 *   1. Intrinsic Development     — how a student sees and understands themselves
 *   2. Interpersonal Development — how a student relates to and communicates with others
 *   3. Social Development        — how a student shows up as a responsible member of society
 *
 * The pilot launch covers Stage 1 (Intrinsic Development) only. Stages 2 and 3
 * are on the roadmap and should always be presented as "in development," never
 * as available today.
 *
 * WITHIN STAGE 1, pillars differ by developmental stage/grade band, because a
 * 12-year-old and an 18-year-old are working through very different challenges:
 *   - Classes 6–8  (~11–13 yrs): identity formation begins, social anxiety,
 *     fear of speaking up / being judged, first real technology & friendship
 *     responsibilities. Live in the pilot.
 *   - Classes 9–10 (~14–16 yrs): board-exam pressure intensifies, stream/subject
 *     decisions loom, peer comparison peaks, identity exploration is in full
 *     swing (Erikson's identity-vs-role-confusion). Live in the pilot.
 *   - Classes 11–12 (~16–18 yrs): high-stakes qualifying exams, the transition
 *     to college/career and a much bigger world, independence, and the first
 *     real experience of public rejection or failure. Live in the pilot.
 *
 * Edit the content below to update copy everywhere it's used.
 * ---------------------------------------------------------------------
 */

export const siteConfig = {
  brandName: "Luminar's Guide",
  brandNameShort: 'LuminarGuide',
  tagline: 'Development Beyond the Textbook — Grades 6–12',

  contact: {
    email: 'contact@luminarsguide.app',
    phone: '+91 9696402289',
    linkedinUrl: 'https://www.linkedin.com/company/luminarsguide',
    responseTime: 'Within 48 business hours',
  },

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4028',
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Shared Supabase client for the site's forms (Contact, Get Started,
 * Work With Us, Our Stories). This project reuses the same Supabase
 * project as the Luminar's Guide web app so contact details stay in one
 * place — these four tables are namespaced `lg_*` and are separate from
 * the web app's own tables. The anon key below can only INSERT into
 * those four tables (see the RLS policies on each) — it cannot read,
 * update, or delete anything, so it's safe to expose in the browser.
 */
// Falls back to a syntactically valid placeholder instead of an empty
// string — an empty URL makes the Supabase client throw immediately on
// import, and since this file loads on every single page (via Header.tsx
// in the root layout), that one missing env var was capable of taking
// down the entire site, not just the forms. With a placeholder, a missing
// or misnamed env var just makes form submissions fail gracefully into
// the "email us directly" fallback every form already has — never a dead
// site.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
);

export type ProgramStatus = 'live' | 'in-development';

export interface Pillar {
  id: string;
  name: string;
  /** A single emoji, used as a lightweight icon (matches the emoji already
   * used for stakeholders elsewhere on the site — no icon component needed). */
  icon: string;
  /** One line for cards/lists. */
  short: string;
  /** The real, "outside the textbook" challenge this pillar responds to. */
  challenge: string;
  /** Deeper, developmental-psychology-grounded explanation. Used on /about,
   * /features, and by the chatbot when a parent asks "why does this matter?" */
  whyItMatters: string;
}

export interface GradeBand {
  id: 'middle' | 'board' | 'senior';
  gradesLabel: string;
  gradesShort: string;
  bandLabel: string;
  ageRange: string;
  status: ProgramStatus;
  statusLabel: string;
  /** Short framing of the developmental stage, used as section intros. */
  ageContext: string;
  /** Real, everyday challenges students in this band face outside the textbook. */
  challenges: string[];
  pillars: Pillar[];
}

export const programStages = [
  {
    id: 'intrinsic',
    order: 1,
    name: 'Intrinsic Development',
    tagline: 'How a student sees themselves',
    description:
      "The foundation stage — helping a student build self-awareness, emotional resilience, and a clear sense of identity, separate from grades or comparison. This is the stage LuminarGuide is piloting with schools right now.",
    status: 'live' as ProgramStatus,
    statusLabel: 'Piloting Now',
  },
  {
    id: 'interpersonal',
    order: 2,
    name: 'Interpersonal Development',
    tagline: 'How a student relates to others',
    description:
      'Communication, collaboration, healthy boundaries, and the relationship skills a student needs with peers, family, and mentors. Builds directly on the self-awareness developed in Stage 1.',
    status: 'in-development' as ProgramStatus,
    statusLabel: 'In Development',
  },
  {
    id: 'social',
    order: 3,
    name: 'Social Development',
    tagline: 'How a student contributes to society',
    description:
      'Civic awareness, empathy at scale, and the judgment to act as a responsible, contributing member of a wider community — the culmination of the journey that starts with knowing yourself.',
    status: 'in-development' as ProgramStatus,
    statusLabel: 'In Development',
  },
];

export const gradeBands: GradeBand[] = [
  {
    id: 'middle',
    gradesLabel: 'Classes 6–8',
    gradesShort: '6–8',
    bandLabel: 'Middle School Years',
    ageRange: 'Roughly 11–13 years old',
    status: 'live',
    statusLabel: 'Live in Pilot',
    ageContext:
      "This is when a child first starts asking who they are outside of parents and grades — and, just as often, when they first go quiet in class out of fear of being judged. Five pillars meet them exactly here.",
    challenges: [
      'Shying away from speaking up or answering in class',
      'Feeling judged or comparing themselves to classmates',
      'Uncertainty about who they are outside of grades or their friend group',
      'Learning to use phones, social media, and AI tools responsibly for the first time',
      'Understanding healthy boundaries with peers and adults',
    ],
    pillars: [
      {
        id: 'digital-wisdom',
        name: 'Digital Wisdom',
        icon: '💻',
        short: 'Using technology and AI tools safely, wisely, and without losing focus.',
        challenge: 'Homework research, group chats, and AI tools are now part of daily academic life — often before a student has the judgment to navigate them well.',
        whyItMatters:
          "Digital Wisdom builds the judgment to use technology well: telling reliable sources from misinformation, using AI to support learning instead of shortcutting it, and protecting focus from distraction. For a Class 6–8 student, these habits form early and stick — students who learn this now typically show stronger research skills, better academic integrity, and fewer of the focus and screen-time struggles that quietly drag down grades later on.",
      },
      {
        id: 'inner-strength',
        name: 'Inner Strength',
        icon: '💪',
        short: 'Building the emotional resilience to bounce back from a bad day or a bad grade.',
        challenge: 'Harder coursework, shifting friendships, and a student’s first real experience of failure and comparison all land in these years.',
        whyItMatters:
          "Inner Strength builds the resilience to treat a bad test score or a tough week as something to work through, not something that defines them. Students with stronger emotional regulation consistently show better performance under pressure, fewer motivation dips, and a faster bounce-back after setbacks — which compounds enormously across the years of schooling ahead.",
      },
      {
        id: 'personal-safety',
        name: 'Personal Safety',
        icon: '🛡️',
        short: 'The awareness and confidence to recognize and respond to unsafe situations.',
        challenge: 'Independence is growing faster than judgment often does — online and off.',
        whyItMatters:
          "This covers the judgment students need both online and offline: recognizing risky situations, understanding healthy boundaries with peers and adults, and knowing when and how to ask for help. Roughly 11 to 13 years old is exactly the window where independence grows faster than judgment — building this awareness protects a student's ability to stay safe, focused, and present enough to actually learn. All guidance is written and reviewed to be age-appropriate for Classes 6–8.",
      },
      {
        id: 'leadership',
        name: 'Leadership & Teamwork',
        icon: '🤝',
        short: 'Finding the confidence to speak up, collaborate, and lead in a group.',
        challenge: 'Group projects and class discussions increasingly grade participation and collaboration, not just individual work — and quiet students fall behind on skills no one explicitly teaches them.',
        whyItMatters:
          "This pillar builds the practical side of working with others: communicating clearly, taking initiative without dominating a group, and resolving disagreements productively. Students who build these skills early tend to participate more confidently in class and handle group work far better than peers who never got explicit practice — directly countering the instinct to shrink and stay silent.",
      },
      {
        id: 'self-identity',
        name: 'Self-Identity',
        icon: '🌱',
        short: 'Helping a student name their own values and strengths — not just their comparisons.',
        challenge: 'This is when students start asking who they actually are, separate from parents, friend groups, or grades — often while feeling judged for not having an answer.',
        whyItMatters:
          "Self-Identity work gives that process some structure — helping a student name their own values, strengths, and interests instead of only defining themselves by comparison to classmates. Students with a clearer sense of identity tend to choose goals that genuinely fit them, stay motivated for reasons beyond grades alone, and handle social and academic pressure with far more stability.",
      },
    ],
  },
  {
    id: 'board',
    gradesLabel: 'Classes 9–10',
    gradesShort: '9–10',
    bandLabel: 'Board Exam Years',
    ageRange: 'Roughly 14–16 years old',
    status: 'live',
    statusLabel: 'Live in Pilot',
    ageContext:
      "Board exams and stream choices arrive right as identity exploration is peaking (Erikson's identity-vs-role-confusion stage). Academic pressure and self-worth start to fuse for the first time — this band's pillars are being built to pull them apart.",
    challenges: [
      'Mounting board-exam pressure and fear of not measuring up',
      'Comparing themselves to classmates over grades, looks, and popularity',
      'Communication issues — struggling to express disagreement or ask for help',
      "Choosing a stream or subjects under pressure from family or peers, before they've had time to know themselves",
      'Intensifying mood swings and stress that go unspoken',
    ],
    pillars: [
      {
        id: 'exam-resilience',
        name: 'Exam Resilience',
        icon: '📝',
        short: 'Facing board-exam pressure without letting one test define self-worth.',
        challenge: 'As academic stakes rise sharply, a single test result starts to feel like a verdict on who a student is, not just how they performed.',
        whyItMatters:
          "As academic stakes rise sharply in Classes 9 and 10, students who haven't been taught to separate their effort from a single result are far more prone to test anxiety, burnout, and a fragile sense of self-worth tied entirely to marks. This pillar teaches structured coping — reframing a bad result as feedback, managing pre-exam anxiety, and protecting identity from being reduced to a percentage.",
      },
      {
        id: 'stream-discovery',
        name: 'Stream & Self-Discovery',
        icon: '🧭',
        short: 'Choosing subjects and streams from genuine self-knowledge, not panic or comparison.',
        challenge: "Stream selection is often the first decision that feels permanent — made under pressure, without real time to reflect.",
        whyItMatters:
          "Psychologically, forcing a life-shaping choice before genuine identity exploration often produces what developmental psychologists call foreclosure — picking a stream to please parents or match a friend group rather than out of self-knowledge. This pillar slows the decision down long enough for a student to reflect honestly on their own interests and strengths first.",
      },
      {
        id: 'peer-navigation',
        name: 'Peer Navigation',
        icon: '👥',
        short: 'Handling social comparison, peer pressure, and early relationships with maturity.',
        challenge: 'Peer approval becomes a primary currency at this age, and social comparison — over grades, looks, and popularity — accelerates fast.',
        whyItMatters:
          "Teaching boundary-setting and healthy comparison habits now prevents patterns of people-pleasing, unhealthy competitiveness, or peer-pressure-driven risk-taking later. It also gives students language for the communication issues that come with disagreeing with a friend, saying no, or asking for help without feeling weak.",
      },
      {
        id: 'digital-self-discovery',
        name: 'Digital & Self-Discovery',
        icon: '🎭',
        short: 'Understanding the gap between real life and "reel" life — and taking responsibility for a healthy digital identity.',
        challenge: 'Social media rewards a curated, highlight-reel version of a life that rarely matches how a student actually feels day to day — and at 14 to 16, the line between the two starts to blur into their sense of self.',
        whyItMatters:
          "Festinger's social comparison theory explains why constant exposure to curated \"highlight reels\" quietly erodes self-esteem — students compare their own unfiltered inner life to everyone else's edited best moments and consistently come out feeling short-changed. This pillar builds the media literacy and self-awareness to recognize that gap for what it is, take real responsibility for how they show up online, and keep their sense of self anchored in more than a feed.",
      },
      {
        id: 'generation-gap',
        name: 'Bridging the Generation Gap',
        icon: '🌉',
        short: 'Learning to communicate with parents honestly, even across a real generational divide.',
        challenge: "A student's instinct at this age is to stop telling parents what's actually going on — not out of secrecy, but because the gap in lived experience makes it feel pointless to even try.",
        whyItMatters:
          "Research on adolescent-parent communication consistently shows that teens don't stop confiding in parents because they stop caring what parents think — they stop because they doubt they'll be understood. This pillar builds the specific skill of translating a real problem across a generational and experiential gap: naming what's actually wrong, choosing the right moment, and staying in the conversation instead of shutting down. Keeping that channel open, even imperfectly, remains one of the strongest protective factors through the teenage years.",
      },
    ],
  },
  {
    id: 'senior',
    gradesLabel: 'Classes 11–12',
    gradesShort: '11–12',
    bandLabel: 'Launch Years',
    ageRange: 'Roughly 16–18 years old',
    status: 'live',
    statusLabel: 'Live in Pilot',
    ageContext:
      "The highest-stakes exams of a student's school life collide with the first real decisions about an independent future — college, career, and a much bigger world. This band's pillars are being built to carry students through that launch.",
    challenges: [
      'The pressure of not being able to qualify board or competitive entrance exams',
      'Anxiety about the next step — college, and a far bigger, less structured world',
      'Teamwork and communication needed for group work, interviews, and college life',
      'Fear of failure or rejection shaping self-worth, often for the first time',
      'Making career and life decisions without a clear sense of self yet',
    ],
    pillars: [
      {
        id: 'performance-pressure',
        name: 'Performance Under Pressure',
        icon: '🎯',
        short: 'Coping with qualifying-exam anxiety without it consuming identity.',
        challenge: 'The fear of "not qualifying" can start to feel like a threat to who a student is, not just an academic setback.',
        whyItMatters:
          "This is frequently the single most psychologically intense stretch of a student's schooling — the fear of not qualifying board or entrance exams can become an identity threat, not just an academic one. This pillar builds performance psychology: managing pressure in the moment, keeping perspective, and preventing self-worth from becoming outcome-based.",
      },
      {
        id: 'interpersonal-bonds',
        name: 'Interpersonal Bond Management',
        icon: '💞',
        short: 'Understanding what a mature relationship looks like — and that self-worth was never meant to depend on having one.',
        challenge: "First serious relationships often arrive with no real model for what healthy actually looks like, and a student's sense of self-worth can quietly start attaching itself to whether they're in one at all.",
        whyItMatters:
          "Contingent self-worth research shows that when self-esteem gets tied to something as unstable as a relationship's status, it produces exactly the anxiety and people-pleasing patterns it was trying to avoid. This pillar draws on attachment psychology to teach what a genuinely healthy, mature bond actually looks like — communication, boundaries, mutual respect — while anchoring a student's sense of worth in themselves first, so a relationship becomes something they choose, not something they need.",
      },
      {
        id: 'independence',
        name: 'Independence & Life Skills',
        icon: '🗝️',
        short: 'Practical and emotional readiness for life beyond school.',
        challenge: 'Many students are academically prepared for college but practically unready for the independence it demands.',
        whyItMatters:
          "Decision-making, responsibility, and self-management are rarely taught explicitly in a curriculum focused on exam performance. This pillar closes that gap deliberately, so the jump to college, a hostel, or a first job doesn't have to be figured out entirely from scratch.",
      },
      {
        id: 'peer-pressure-manipulation',
        name: 'Peer Pressure & Manipulation',
        icon: '🚫',
        short: "Recognizing manipulation and peer pressure before it leads somewhere a student wouldn't choose sober and alone.",
        challenge: 'The pressure to drink, use substances, or go along with something that feels wrong rarely arrives as an obvious threat — it shows up disguised as belonging, dressed up as "everyone does this."',
        whyItMatters:
          "Adolescent brain development research (Steinberg's dual-systems model) explains why 16-to-18-year-olds are genuinely more vulnerable to peer influence in exactly this window — the brain's reward system matures years before the prefrontal cortex that governs impulse control catches up, and that gap peaks precisely at this age. This pillar names manipulation tactics explicitly, builds the confidence to recognize pressure disguised as belonging, and practices saying no in a way that doesn't cost the friendship — because a student's worth was never supposed to be the price of fitting in.",
      },
      {
        id: 'resilience-rejection',
        name: 'Resilience & Rejection',
        icon: '🔁',
        short: 'Handling exam results or college rejections without it becoming a defining failure.',
        challenge: 'A missed cutoff or a college "no" is often a student’s first real, public rejection.',
        whyItMatters:
          "How a student processes that first real rejection shapes their relationship with risk and failure for years to come. This pillar builds the resilience to see a setback as one result, not a verdict — and to keep trying rather than internalizing it as a statement about their worth.",
      },
    ],
  },
];

/**
 * PRICING
 * Three nationwide tiers, each available at three billing cadences —
 * monthly, quarterly, annual. All three numbers below are per-month
 * figures; the actual amount charged at signup is:
 *   monthly:   price.monthly charged every month
 *   quarterly: price.quarterly * 3 charged every 3 months
 *   annual:    price.annual * 12 charged once a year
 *
 * The spread between them is deliberate, not arbitrary: quarterly is ~8%
 * cheaper than monthly (standard "step up your commitment" reward),
 * annual is ~17% cheaper than monthly — which works out to almost exactly
 * "2 months free" (annual * 12 ≈ monthly * 10) across all three plans, a
 * clean, sayable number rather than an odd percentage. Keep that ~2-month
 * relationship if these numbers ever change — it's what makes the annual
 * discount easy to explain to a parent in one sentence.
 *
 * Location-based pricing (e.g. a different rate per city) is planned but
 * NOT live yet — these are single nationwide prices. When city pricing is
 * ready, add a separate `cityOverrides`-style structure rather than
 * duplicating these plans, and gate it behind a "where are you located?"
 * picker on the pricing page — never a public city-by-city comparison
 * table, which is what makes differential pricing feel unjust to visitors.
 *
 * `features` below is a first-draft placeholder (session counts, cadence,
 * etc. aren't finalized) — replace with the real inclusions before launch.
 */
export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  /** INR, per month, at each billing cadence. See note above for how the
   * actual charged amount is derived from each of these. */
  price: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  /** Shows a "Most Popular" badge — put this on the plan you want most
   * visitors to pick (the classic three-tier pricing pattern). */
  highlight?: boolean;
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    tagline: 'Start building the fundamentals',
    price: { monthly: 1800, quarterly: 1650, annual: 1500 },
    features: [
      "Full curriculum access for your child's grade band",
      'Weekly group classes, both offline and online',
      'A Certificate of Growth on completing each stage',
      'Regular parent progress summaries',
      'Email support, within 1 business day',
    ],
  },
  {
    id: 'ascend',
    name: 'Ascend',
    tagline: 'The most popular starting point',
    price: { monthly: 4799, quarterly: 4399, annual: 3999 },
    highlight: true,
    features: [
      'Everything in Foundation',
      'Every-two-weeks 1:1 mentor review calls',
      "Priority counselor sessions, arranged whenever the mentor recommends it",
      "Personalized tasks and sessions built around your child",
      "A Mentor's Letter — a personal, written reflection from their mentor",
      'Regional and national LuminarGuide meets, not just their own city',
      'A Growth & Wellbeing Report — plain-language updates on what\'s going well, patterns worth watching, and specific next steps',
      'A Pillar Showcase Workshop after completing each pillar',
    ],
  },
  {
    id: 'immersive',
    name: 'Immersive',
    tagline: 'The deepest level of support',
    price: { monthly: 7199, quarterly: 6599, annual: 5999 },
    features: [
      'Everything in Ascend',
      'Weekly 1:1 mentor reviews and coaching',
      'Dedicated counselor support, with regular monthly check-ins',
      "Parallel sessions for parents, alongside your child's own",
      'About 2–2.5 months of dedicated depth on each pillar',
    ],
  },
];

/**
 * SINGLE PILLAR TRACK
 * A standalone add-on, not part of the Foundation/Ascend/Immersive ladder
 * above — a bounded, one-time enrollment rather than a subscription, so it
 * gets a flat price instead of a monthly/quarterly/annual cadence. Pitched
 * at a family that wants focused help on one specific pillar (a rough
 * patch with confidence, a specific social skill) without a year-round
 * commitment — summer break is the obvious moment for this.
 *
 * Deliberately priced at Ascend-level depth (1:1 mentor + counselor access),
 * just narrowed to one pillar instead of five: 2 months of full Ascend is
 * ₹9,598, so this sits at roughly half that — about ₹2,500 per pillar per
 * month, well above Ascend's own ~₹960-per-pillar rate. That's the point:
 * it should always cost MORE per pillar than committing to a full tier, so
 * it reads as a premium, no-commitment option rather than a cheap way to
 * get Ascend's attention piecemeal. Keep that relationship if this number
 * changes. The Mentor's Letter, Growth & Wellbeing Report, regional meets,
 * and Pillar Showcase Workshop stay exclusive to Ascend/Immersive on
 * purpose — those are rewards for the longer relationship, not something
 * a 2-month track should also come with.
 */
export const pillarTrackAddOn = {
  name: 'Single Pillar Track',
  tagline: 'Ascend-level mentor and counselor access, focused on one pillar for 2 months',
  /** INR. Flat price for the full 2-month enrollment — not a per-month rate. */
  price: 4999,
  billingNote: 'One-time enrollment, 2 months',
  features: [
    'Two months of focused 1:1 mentor sessions on one pillar of your choice',
    'Every-two-weeks mentor review calls',
    'Priority counselor sessions, arranged whenever the mentor recommends it',
    'A Certificate of Growth on completion',
  ],
};

/**
 * PURPOSE
 * Vision, mission, and the parent-facing positioning statement. Each has a
 * short `heading` (the one-liner — used as a pull-quote / hero line where
 * space is tight) and a longer `description` (the full paragraph — used
 * wherever there's room to actually make the case). Kept in one place so
 * the same wording stays consistent everywhere it's quoted, instead of
 * drifting into three slightly-different versions across pages.
 */
export const purpose = {
  vision: {
    heading: 'A generation of students who grow up knowing themselves — not just their scores.',
    description:
      "Every child deserves a childhood that isn't measured only in marks. We want a generation of students who leave school knowing who they are as clearly as they know their subjects.",
  },
  mission: {
    heading: "Mentor-led development, one student at a time, so growing up doesn't have to happen alone.",
    description:
      'To give every student, from Class 6 through 12, a mentor who walks alongside them through identity, resilience, and real-world readiness — treated with the same seriousness as academics, in partnership with parents, schools, and counselors.',
  },
  messageToParents: {
    heading: 'For parents who see their child as more than a rank.',
    description:
      "Grades will always matter — we're not asking you to forget that. But most programs stop there. We're built for something harder to measure and just as important: helping your child know who they are before the world tells them who to be. If you've ever wished someone paid as much attention to your child's confidence and character as their marksheet, that's exactly where we start.",
  },
} as const;

export const stakeholders = [
  { icon: '🎒', label: 'Students' },
  { icon: '🧑‍🏫', label: 'Mentors' },
  { icon: '👨‍👩‍👧', label: 'Parents' },
  { icon: '🏫', label: 'Schools' },
  { icon: '💬', label: 'Counselors' },
];

export const stakeholderDetails = [
  {
    role: 'Mentors',
    description:
      "Run one-on-one or small-group sessions across the pillars a student is working on, so you always know what to focus on next. Every session's notes and progress roll into a longitudinal record, you get suggested talking points, and you can loop in a parent, school, or counselor directly when it's relevant.",
  },
  {
    role: 'Parents',
    description:
      "See a clear, approval-protected summary of your child's growth — never raw session transcripts, just the insights that matter. Get suggested conversation starters based on what your child is working on, so you can support them at home without hovering, and stay confident they're growing in a safe, structured environment.",
  },
  {
    role: 'Schools',
    description:
      'Access aggregate, de-identified well-being trends across your student body — not individual session details — so administrators can spot patterns early and direct resources where they matter most. Includes admin-level oversight, cohort-level reporting, and tools that support your existing counseling team rather than replace it.',
  },
  {
    role: 'Counselors',
    description:
      'Get longitudinal context a single meeting can’t provide — how a student has been trending over weeks and months. This helps you spot students who may need earlier support, walk into conversations already informed, and coordinate more easily with mentors and parents on next steps.',
  },
];

export function getGradeBand(id: GradeBand['id']): GradeBand | undefined {
  return gradeBands.find((b) => b.id === id);
}

export function getAllPillars(): { band: GradeBand; pillar: Pillar }[] {
  return gradeBands.flatMap((band) => band.pillars.map((pillar) => ({ band, pillar })));
}