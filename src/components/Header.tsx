'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { siteConfig, supabase, gradeBands, getGradeBand, type GradeBand, type Pillar } from '@/lib/siteConfig';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Work With Us', href: '/get-started' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || menuOpen ? 'bg-card backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
            <span
              className="flex items-center justify-center rounded-xl p-1.5 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <AppLogo size={40} />
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ReadAloudControl />
            <ThemeSwitcher />
            <Link href="/get-started" className="btn-primary text-sm px-5 py-2.5">
              Get Started
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <ReadAloudControl />
            <ThemeSwitcher />
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-card backdrop-blur-md border-b border-border px-6 py-6 flex flex-col gap-5 shadow-lg z-50">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-medium text-foreground hover:text-primary transition-colors py-1" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/get-started" className="btn-primary justify-center mt-2" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* Floating AI pillar chatbot — lives here (rather than its own file) so it
          renders on every page via the Header, which is already global. */}
      <PillarGuideChat />

      {/* Floating pillar discovery game — same reasoning, lives here so it's global. */}
      <PillarDiscoveryGame variant="modal" />
    </>
  );
}

/* ------------------------------------------------------------------------
 * PillarGuideChat
 * The AI chatbot widget: asks a parent which class their child is in, shows
 * that grade band's pillars, and explains why the chosen pillar matters.
 * Kept in this file (instead of its own component file) because this
 * project's page/file count can't be expanded — it's a fixed-position
 * widget, so where it lives in the file tree doesn't affect where it shows
 * up on screen.
 * ---------------------------------------------------------------------- */

type ChatTurnData =
  | { id: string; kind: 'bot-text'; text: string }
  | { id: string; kind: 'user'; text: string }
  | { id: string; kind: 'band-choices' }
  | { id: string; kind: 'pillar-choices'; bandId: GradeBand['id'] }
  | { id: string; kind: 'pillar-answer'; bandId: GradeBand['id']; pillarId: string }
  | { id: string; kind: 'next-steps'; bandId: GradeBand['id'] };

let chatTurnCounter = 0;
const nextChatId = () => `t${chatTurnCounter++}`;

const CHAT_GREETING =
  "Hi, I'm the LuminarGuide Pillar Guide. Tell me which class your child is in, and I'll walk you through what we focus on and why it matters at that age.";

function PillarGuideChat() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [turns, setTurns] = useState<ChatTurnData[]>([
    { id: nextChatId(), kind: 'bot-text', text: CHAT_GREETING },
    { id: nextChatId(), kind: 'band-choices' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setEverOpened(true);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, open]);

  const push = (...newTurns: ChatTurnData[]) => setTurns((prev) => [...prev, ...newTurns]);

  const handleBandSelect = (bandId: GradeBand['id']) => {
    const band = getGradeBand(bandId);
    if (!band) return;
    push(
      { id: nextChatId(), kind: 'user', text: band.gradesLabel },
      {
        id: nextChatId(),
        kind: 'bot-text',
        text:
          band.status === 'live'
            ? `Got it — ${band.gradesLabel} (${band.bandLabel}). ${band.ageContext}`
            : `Got it — ${band.gradesLabel} (${band.bandLabel}). Quick note: this band is still ${band.statusLabel.toLowerCase()} for our pilot, but here's the thinking behind it so far. ${band.ageContext}`,
      },
      { id: nextChatId(), kind: 'bot-text', text: 'Which pillar would you like me to explain?' },
      { id: nextChatId(), kind: 'pillar-choices', bandId }
    );
  };

  const handlePillarSelect = (bandId: GradeBand['id'], pillarId: string) => {
    const band = getGradeBand(bandId);
    const pillar = band?.pillars.find((p) => p.id === pillarId);
    if (!band || !pillar) return;
    push(
      { id: nextChatId(), kind: 'user', text: pillar.name },
      { id: nextChatId(), kind: 'pillar-answer', bandId, pillarId },
      { id: nextChatId(), kind: 'next-steps', bandId }
    );
  };

  const handleRestart = () => {
    setTurns([
      { id: nextChatId(), kind: 'bot-text', text: "Sure — let's start over. Which class is your child in?" },
      { id: nextChatId(), kind: 'band-choices' },
    ]);
  };

  const handleMorePillars = (bandId: GradeBand['id']) => {
    push(
      { id: nextChatId(), kind: 'user', text: 'Ask about another pillar' },
      { id: nextChatId(), kind: 'bot-text', text: 'Sure — which one next?' },
      { id: nextChatId(), kind: 'pillar-choices', bandId }
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="w-[min(92vw,380px)] h-[min(70vh,560px)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="LuminarGuide pillar chatbot"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1L2 5.4l4.2-.8L8 1z" fill="white" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-700 text-white" style={{ fontWeight: 700 }}>
                  Pillar Guide
                </p>
                <p className="text-[11px] text-white/70">Ask which pillars fit your child</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Transcript */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: 'var(--muted)' }}>
            {turns.map((turn) => (
              <ChatTurn key={turn.id} turn={turn} onSelectBand={handleBandSelect} onSelectPillar={handlePillarSelect} onMorePillars={handleMorePillars} onRestart={handleRestart} />
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border flex items-center justify-between flex-shrink-0 bg-card">
            <button type="button" onClick={handleRestart} className="text-xs font-600 text-muted-foreground hover:text-primary transition-colors" style={{ fontWeight: 600 }}>
              ↺ Start over
            </button>
            <Link href="/contact" className="text-xs font-600 text-primary hover:underline" style={{ fontWeight: 600 }}>
              Talk to our team →
            </Link>
          </div>
        </div>
      )}

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close pillar chatbot' : 'Open pillar chatbot'}
        className="relative flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full shadow-2xl text-white transition-transform hover:scale-105"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        {!everOpened && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
        )}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2.5 4.5A1.5 1.5 0 014 3h10a1.5 1.5 0 011.5 1.5V11A1.5 1.5 0 0114 12.5H8l-3.5 3V12.5H4A1.5 1.5 0 012.5 11V4.5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span className="text-sm font-700" style={{ fontWeight: 700 }}>
          {open ? 'Close' : 'Which pillars fit my child?'}
        </span>
      </button>
    </div>
  );
}

function ChatTurn({
  turn,
  onSelectBand,
  onSelectPillar,
  onMorePillars,
  onRestart,
}: {
  turn: ChatTurnData;
  onSelectBand: (bandId: GradeBand['id']) => void;
  onSelectPillar: (bandId: GradeBand['id'], pillarId: string) => void;
  onMorePillars: (bandId: GradeBand['id']) => void;
  onRestart: () => void;
}) {
  if (turn.kind === 'bot-text') {
    return (
      <div className="max-w-[88%] bg-card border border-border rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs leading-relaxed text-foreground shadow-sm">
        {turn.text}
      </div>
    );
  }

  if (turn.kind === 'user') {
    return (
      <div
        className="max-w-[80%] self-end rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs font-600 text-white shadow-sm"
        style={{ backgroundColor: 'var(--accent)', fontWeight: 600, alignSelf: 'flex-end' }}
      >
        {turn.text}
      </div>
    );
  }

  if (turn.kind === 'band-choices') {
    return (
      <div className="flex flex-wrap gap-2">
        {gradeBands.map((band) => (
          <button
            key={band.id}
            type="button"
            onClick={() => onSelectBand(band.id)}
            className="growth-pill cursor-pointer bg-card"
          >
            {band.gradesLabel}
          </button>
        ))}
      </div>
    );
  }

  if (turn.kind === 'pillar-choices') {
    const band = getGradeBand(turn.bandId);
    if (!band) return null;
    return (
      <div className="flex flex-col gap-1.5">
        {band.pillars.map((pillar) => (
          <button
            key={pillar.id}
            type="button"
            onClick={() => onSelectPillar(band.id, pillar.id)}
            className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2.5 text-left text-xs font-600 text-foreground hover:border-primary transition-colors"
            style={{ fontWeight: 600 }}
          >
            <span className="flex-shrink-0" style={{ color: 'var(--primary)' }}>
              <ScenarioIcon pillarId={pillar.id} size={16} />
            </span>
            {pillar.name}
          </button>
        ))}
      </div>
    );
  }

  if (turn.kind === 'pillar-answer') {
    const band = getGradeBand(turn.bandId);
    const pillar = band?.pillars.find((p) => p.id === turn.pillarId) as Pillar | undefined;
    if (!band || !pillar) return null;
    return (
      <div className="max-w-[92%] bg-card border border-border rounded-2xl rounded-tl-sm p-4 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(22,33,44,0.08)', color: 'var(--primary)' }}
          >
            <ScenarioIcon pillarId={pillar.id} size={16} />
          </span>
          <p className="text-sm font-700 text-foreground" style={{ fontWeight: 700 }}>
            {pillar.name}
          </p>
          {band.status === 'in-development' && (
            <span className="text-[10px] font-600 uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', fontWeight: 600 }}>
              In development
            </span>
          )}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-600 text-foreground" style={{ fontWeight: 600 }}>
            The real challenge:{' '}
          </span>
          {pillar.challenge}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-600 text-foreground" style={{ fontWeight: 600 }}>
            Why it matters:{' '}
          </span>
          {pillar.whyItMatters}
        </p>
      </div>
    );
  }

  if (turn.kind === 'next-steps') {
    return (
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onMorePillars(turn.bandId)} className="growth-pill cursor-pointer bg-card">
          Ask about another pillar
        </button>
        <button type="button" onClick={onRestart} className="growth-pill cursor-pointer bg-card">
          Choose a different class
        </button>
      </div>
    );
  }

  return null;
}

/* ------------------------------------------------------------------------
 * PillarDiscoveryGame
 * An exploratory "Try the Approach" game for the live Classes 6–8 pillars.
 * Players pick their role first — the student themselves, or a Mentor /
 * Parent / School / Counselor — from a game-specific role list (GAME_ROLES,
 * deliberately separate from the sitewide `stakeholders` list used
 * elsewhere, since the game also lets the student play as themselves). The
 * chosen role changes how each scenario is framed (second person for the
 * student, third person otherwise) and can be changed at any point via
 * "Change role" / "Switch role", no page refresh needed. For each scenario,
 * players get three real, legitimate response styles — Step In, Ask & Guide,
 * Step Back — drawn from situational-leadership / coaching-stance research.
 * None of the three is "the wrong answer": each card flips to reveal what
 * that style tends to build and what to watch for, on its own terms. Only
 * after exploring does the game reveal the pillar's sweet spot. Players can
 * mark whichever style feels most like them, purely for a light,
 * non-judgmental recap at the end — never a score. Players can go back and
 * revisit any earlier scenario. Icons throughout are hand-drawn inline SVGs
 * (no emoji, no image assets) to keep the visual language consistent with
 * the rest of the site.
 *
 * variant="modal" is the floating, dismissible popup that shows itself once
 * per browser (via localStorage) and can be reopened any time from its
 * launcher button. variant="inline" is the same game embedded directly in
 * the /gamification page, always visible, no popup chrome. Kept here (not
 * its own file) for the same reason as PillarGuideChat above.
 * ---------------------------------------------------------------------- */

function playChime(kind: 'click' | 'success' | 'flip' = 'click') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const notes = kind === 'success' ? [523.25, 659.25, 783.99] : kind === 'flip' ? [440] : [660, 880];
    const peak = kind === 'flip' ? 0.08 : 0.16;
    const playNotes = () => {
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(peak, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.22);
      });
      setTimeout(() => ctx.close(), notes.length * 90 + 300);
    };
    // Many browsers (Safari/iOS especially) create a new AudioContext already
    // "suspended" even inside a click handler — it has to be resumed once
    // before any sound is audible. Without this, the chime can silently do
    // nothing on exactly the browsers that need it fixed most.
    if (ctx.state === 'suspended') {
      ctx.resume().then(playNotes).catch(playNotes);
    } else {
      playNotes();
    }
  } catch {
    // Web Audio unavailable in this browser — sound is a nice-to-have only.
  }
}

type ApproachKey = 'stepIn' | 'askGuide' | 'stepBack';

const ARCHETYPE_LABEL: Record<ApproachKey, string> = {
  stepIn: 'Step In',
  askGuide: 'Ask & Guide',
  stepBack: 'Step Back',
};

const ARCHETYPE_RECAP: Record<ApproachKey, string> = {
  stepIn:
    "You lean toward stepping in directly — hands-on and quick to act. That's real support, especially when someone needs steady footing fast.",
  askGuide:
    "You lean toward asking and guiding — drawing the answer out rather than handing it over. That's the scaffolding at the heart of how good mentoring builds lasting judgment.",
  stepBack:
    "You lean toward stepping back and giving space first. That takes real trust, and it's often exactly what an older student needs to build ownership.",
};

// Small line-art icons, drawn in-line (no image assets, no emoji) so the game
// reads as a considered piece of the product rather than a generic quiz.
function PathIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.6 16.4L10.5 8M13.5 8l4 8.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckBadgeIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="var(--accent)" strokeWidth="1.6" />
      <path d="M8 12.3l2.6 2.6L16.2 9" stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Full custom line-icon set for all 15 pillars across the three grade bands
// (was previously just 4 explicit icons + a fallback, since only the middle
// band had icons drawn). Exported so FeaturesSection and the About pages can
// use the same set instead of the raw pillar emoji. Falls back to the
// self-identity mark for any unrecognized id, same as before.
export function ScenarioIcon({ pillarId, size = 22 }: { pillarId: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };
  const paths: Record<string, React.ReactNode> = {
    'digital-wisdom': (
      <>
        <rect x="3.5" y="5.5" width="17" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.5 19.5h7M12 16.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="11" r="1" fill="currentColor" />
        <circle cx="15" cy="11" r="1" fill="currentColor" />
      </>
    ),
    'inner-strength': (
      <>
        <path d="M7 3.5h6.5l4 4V20a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13.5 3.5V8h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8.5 13.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    'personal-safety': (
      <>
        <path d="M12 3.2l6.5 2.8v4.8c0 4.1-2.8 7.5-6.5 8.6-3.7-1.1-6.5-4.5-6.5-8.6V6l6.5-2.8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    leadership: (
      <>
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16.5" cy="10.5" r="2.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 19c.5-3 2.5-4.7 5-4.7s4.5 1.7 5 4.7M14.8 19c.4-2.2 1.7-3.7 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    'self-identity': (
      <>
        <path d="M12 21c4-3.2 7-6.6 7-10.7A7 7 0 005 10.3C5 14.4 8 17.8 12 21z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="10.2" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
    'exam-resilience': (
      <>
        <rect x="4.5" y="3.5" width="15" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7.5 7.5h9M7.5 10.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8.3 16.8l2 2 5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    'stream-discovery': (
      <>
        <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15.2 8.8l-2 4.7-4.7 2 2-4.7 4.7-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </>
    ),
    'peer-navigation': (
      <>
        <circle cx="7" cy="8.5" r="2.3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="8.5" r="2.3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="16.5" r="2.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.7 10.1l2.4 4.3M15.3 10.1l-2.4 4.3M9.3 8.5h5.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
    'digital-self-discovery': (
      <>
        <path d="M8.3 11.3a4 4 0 118 0c0 2.6-1.8 3.6-1.8 5.7H10c0-2.1-1.7-3.1-1.7-5.7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9.8 19.5h4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 6.5l1.6 1.3M20 6.5l-1.6 1.3M12 3v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    'generation-gap': (
      <>
        <path d="M3 6.3A1.4 1.4 0 014.4 4.9h6.4a1.4 1.4 0 011.4 1.4v4.6a1.4 1.4 0 01-1.4 1.4H7.6L5 14.5v-2.2H4.4A1.4 1.4 0 013 10.9V6.3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M12.2 9.9h6.4A1.4 1.4 0 0120 11.3v4.6a1.4 1.4 0 01-1.4 1.4h-.6v2.2l-2.6-2.2h-3.2a1.4 1.4 0 01-1.4-1.4V13" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </>
    ),
    'performance-pressure': (
      <>
        <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="1.1" fill="currentColor" />
      </>
    ),
    'interpersonal-bonds': (
      <>
        <circle cx="9" cy="12" r="5.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="12" r="5.2" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
    independence: (
      <>
        <path d="M13.5 3.5H6a1 1 0 00-1 1v15a1 1 0 001 1h7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12.2h8.5M17.3 8.7l3.4 3.5-3.4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.7" cy="12.2" r="0.9" fill="currentColor" />
      </>
    ),
    'peer-pressure-manipulation': (
      <>
        <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    'resilience-rejection': (
      <>
        <path d="M4.5 12a7.5 7.5 0 0112.6-5.5M19.5 12a7.5 7.5 0 01-12.6 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17.1 3.8v3.2h-3.2M6.9 20.2V17h3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };
  return <svg {...common}>{paths[pillarId] ?? paths['self-identity']}</svg>;
}

// Custom line-icon set for the five stakeholder roles — replaces the emoji
// (🎒🧑‍🏫👨‍👩‍👧🏫💬) used for these everywhere on the site. Exported so
// AboutSection, the /about page, and the Work-With-Us role cards on
// /get-started all draw from the same set.
export function StakeholderIcon({
  role,
  size = 20,
}: {
  role: 'Students' | 'Mentors' | 'Parents' | 'Schools' | 'Counselors';
  size?: number;
}) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };
  const paths: Record<string, React.ReactNode> = {
    Students: (
      <>
        <path d="M7 8.5V6.7a5 5 0 0110 0V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4.5" y="8.5" width="15" height="11.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 12.5v3M14.5 12.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    Mentors: (
      <>
        <circle cx="12" cy="7.3" r="3.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 20c.6-4.2 3.4-6.5 7-6.5s6.4 2.3 7 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.5 8.2l2.2-1.4M18.7 6.8l.3 2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    Parents: (
      <>
        <circle cx="9" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16.5" cy="10" r="2.1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.3 19.5c.5-3.6 2.7-5.6 5.7-5.6s5.2 2 5.7 5.6M14.3 19.5c.3-2.4 1.6-4 3.7-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    Schools: (
      <>
        <path d="M12 3.5l9 4.3-9 4.3-9-4.3 9-4.3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6.5 10.4v4.6c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 8v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    Counselors: (
      <>
        <path d="M4.5 6.3A1.8 1.8 0 016.3 4.5h11.4a1.8 1.8 0 011.8 1.8v8.4a1.8 1.8 0 01-1.8 1.8H11l-4.5 3.5v-3.5H6.3a1.8 1.8 0 01-1.8-1.8V6.3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8.5 9.8a1.9 1.9 0 013.4-1.2c.6.5 1.1.8 1.1 1.7 0 1-1.1 1.2-1.1 2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="11.8" cy="15" r="0.9" fill="currentColor" />
      </>
    ),
  };
  return <svg {...common}>{paths[role]}</svg>;
}

function ArchetypeIcon({ archetype, size = 22 }: { archetype: ApproachKey; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };
  if (archetype === 'stepIn') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 12l4.6-4.6M16.8 6.7v4M16.8 6.7h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (archetype === 'askGuide') {
    return (
      <svg {...common}>
        <path d="M4.5 5.8A1.6 1.6 0 016.1 4.2h11.8a1.6 1.6 0 011.6 1.6v8.4a1.6 1.6 0 01-1.6 1.6H10l-3.9 3.3v-3.3H6.1a1.6 1.6 0 01-1.6-1.6V5.8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10.4 9.4a1.7 1.7 0 113 1c-.5.4-1 .7-1 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="12.4" cy="13.6" r="0.9" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.2 9l-2.2 3 2.2 3M7 12h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface GameRole {
  id: string;
  label: string;
  badge: string;
  subject: string;
  isSelf: boolean;
}

// A game-specific role list, kept separate from the sitewide `stakeholders`
// list (Mentors/Parents/Schools/Counselors) used elsewhere on the site — the
// game also lets the student themselves play, which the sitewide list
// intentionally doesn't include.
const GAME_ROLES: GameRole[] = [
  { id: 'Students', label: 'I am the student', badge: 'ST', subject: 'You', isSelf: true },
  { id: 'Mentors', label: 'Mentor', badge: 'MN', subject: 'A student you mentor', isSelf: false },
  { id: 'Parents', label: 'Parent', badge: 'PR', subject: 'Your child', isSelf: false },
  { id: 'Schools', label: 'School', badge: 'SC', subject: 'A student at your school', isSelf: false },
  { id: 'Counselors', label: 'Counselor', badge: 'CN', subject: "A student you're counseling", isSelf: false },
];

interface GameApproach {
  key: ApproachKey;
  action: string;
  insight: string;
  selfAction: string;
  selfInsight: string;
}

interface GameScenario {
  pillarId: string;
  promptFor: (subject: string, isSelf: boolean) => string;
  approaches: [GameApproach, GameApproach, GameApproach];
}

const GAME_SCENARIOS: GameScenario[] = [
  {
    pillarId: 'digital-wisdom',
    promptFor: (subject, isSelf) =>
      isSelf
        ? `${subject} ask an AI chatbot to write your entire homework assignment overnight.`
        : `${subject} asks an AI chatbot to write their entire homework assignment overnight.`,
    approaches: [
      {
        key: 'stepIn',
        action: 'Redo the assignment together, right now.',
        insight: "Solves tonight fast — but lean on it too often and the skill never really transfers.",
        selfAction: 'Redo it yourself before you submit it.',
        selfInsight: "Fixes tonight, but skips the more useful part — actually practicing the skill.",
      },
      {
        key: 'askGuide',
        action: 'Ask what made finishing it honestly feel so hard.',
        insight: "Slower, but it's where real judgment about using the tool well actually gets built.",
        selfAction: 'Ask yourself what made finishing it honestly feel so hard.',
        selfInsight: "That honest answer is usually more useful than the assignment itself.",
      },
      {
        key: 'stepBack',
        action: 'Let it go, and see how the feedback lands.',
        insight: "Natural consequences teach fast — but only with a real follow-up chat after.",
        selfAction: 'Turn it in as-is and see what the feedback says.',
        selfInsight: "You'll learn something either way — but only if you actually read the feedback.",
      },
    ],
  },
  {
    pillarId: 'inner-strength',
    promptFor: (subject, isSelf) =>
      isSelf
        ? `${subject} get a poor grade on a test you studied hard for, and don't feel like talking about it.`
        : `${subject} comes home with a poor grade on a test they studied hard for, and won't talk about it.`,
    approaches: [
      {
        key: 'stepIn',
        action: 'Sit down and go through the test together.',
        insight: "Useful eventually — but rushing here can skip past feeling the disappointment first.",
        selfAction: 'Go through the test and find exactly what went wrong.',
        selfInsight: "Useful eventually — just notice if you're skipping past the disappointment to get there.",
      },
      {
        key: 'askGuide',
        action: "Ask how they're feeling before asking about the test.",
        insight: "Naming the feeling first is what actually builds resilience, not toughing it out.",
        selfAction: 'Name how you actually feel before you try to fix anything.',
        selfInsight: "Sitting with disappointment on purpose is a real skill, not a delay tactic.",
      },
      {
        key: 'stepBack',
        action: 'Give space today, check in again tomorrow.',
        insight: "Right for some — just make sure tomorrow's check-in actually happens.",
        selfAction: 'Take today off from thinking about it, on purpose.',
        selfInsight: "Fine once — as long as you actually come back to it instead of just avoiding it.",
      },
    ],
  },
  {
    pillarId: 'personal-safety',
    promptFor: (subject, isSelf) =>
      isSelf
        ? `${subject} mention an online friend you've never met who wants to video call.`
        : `${subject} mentions an online friend they've never met who wants to video call.`,
    approaches: [
      {
        key: 'stepIn',
        action: 'Sit in on the call together, at least once.',
        insight: "Removes today's guesswork — just don't let it become the only safety plan long-term.",
        selfAction: 'Loop someone else in before the first call.',
        selfInsight: "Costs you nothing, and it's exactly what genuinely careful people do.",
      },
      {
        key: 'askGuide',
        action: "Ask what they know about this person, and what'd make them pause.",
        insight: "Builds the judgment they'll need for the moment you're not there to check.",
        selfAction: 'Ask yourself what you actually know about this person.',
        selfInsight: "If you can't answer that clearly, that's usually the answer.",
      },
      {
        key: 'stepBack',
        action: 'Trust their judgment, let the call happen.',
        insight: "Most online friendships are harmless — this is still the moment guidance helps most.",
        selfAction: 'Trust your gut and just go for it.',
        selfInsight: "Your gut is a good start — a second opinion is still worth thirty seconds.",
      },
    ],
  },
  {
    pillarId: 'leadership',
    promptFor: (subject, isSelf) =>
      isSelf
        ? `During a group project, you'd rather do the whole thing alone than work with classmates.`
        : `${subject}, during a group project, says they'd rather do the whole thing alone than work with classmates.`,
    approaches: [
      {
        key: 'stepIn',
        action: 'Assign them a specific, structured role in the group.',
        insight: "Makes collaborating feel safer — though they'll still need to navigate friction eventually.",
        selfAction: 'Ask for one specific, defined role in the group.',
        selfInsight: "Makes it feel manageable — a good first step, not a permanent workaround.",
      },
      {
        key: 'askGuide',
        action: 'Ask what about working with others feels unreliable.',
        insight: "Usually surfaces the real issue — trust or delegation, not the group work itself.",
        selfAction: 'Ask yourself what about teamwork actually feels unreliable.',
        selfInsight: "Usually it's not the group — it's trust, or not knowing how to delegate yet.",
      },
      {
        key: 'stepBack',
        action: 'Let them go solo this time, revisit it next project.',
        insight: "Fine once — risky if 'this time' quietly becomes 'always.'",
        selfAction: 'Go solo this once, but plan to try again next time.',
        selfInsight: "One project alone is fine — just don't let it become the permanent plan.",
      },
    ],
  },
  {
    pillarId: 'self-identity',
    promptFor: (subject, isSelf) =>
      isSelf
        ? `${subject} feel like you don't know what you're "good at," compared to your friends.`
        : `${subject} says they don't know what they're "good at," compared to their friends.`,
    approaches: [
      {
        key: 'stepIn',
        action: 'Tell them the strengths you already see in them.',
        insight: "Generous and true — but a strength they discover lands differently than one they're handed.",
        selfAction: 'Ask someone close to you what they see in you.',
        selfInsight: "A good start — the goal is eventually seeing it yourself too.",
      },
      {
        key: 'askGuide',
        action: "Ask what they enjoy, even if they're not 'good' at it yet.",
        insight: "Enjoyment usually shows up before skill does — that's the real starting point.",
        selfAction: 'Ask yourself what you enjoy, skill aside.',
        selfInsight: "Enjoyment tends to come before skill — that's actually where to start.",
      },
      {
        key: 'stepBack',
        action: 'Let the comparison pass without addressing it.',
        insight: "Fine once — repeated, it quietly hardens into a belief about themselves.",
        selfAction: 'Let the comparison go, just this once.',
        selfInsight: "Fine once — if it keeps coming back, it's worth actually sitting with.",
      },
    ],
  },
];

export function PillarDiscoveryGame({ variant = 'modal' }: { variant?: 'modal' | 'inline' }) {
  const [open, setOpen] = useState(variant === 'inline');
  const [roleId, setRoleId] = useState<string | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [flipped, setFlipped] = useState<boolean[][]>(() => GAME_SCENARIOS.map(() => [false, false, false]));
  const [revealed, setRevealed] = useState<boolean[]>(() => GAME_SCENARIOS.map(() => false));
  const [favorite, setFavorite] = useState<(0 | 1 | 2 | null)[]>(() => GAME_SCENARIOS.map(() => null));

  useEffect(() => {
    if (variant !== 'modal') return;
    try {
      const seen = window.localStorage.getItem('lg_seen_pillar_game');
      if (!seen) {
        const t = setTimeout(() => {
          setOpen(true);
          window.localStorage.setItem('lg_seen_pillar_game', '1');
        }, 1600);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable — skip auto-open, the launcher button still works.
    }
  }, [variant]);

  const middleBand = gradeBands.find((b) => b.id === 'middle');
  const role = roleId ? GAME_ROLES.find((r) => r.id === roleId) ?? null : null;
  const isComplete = roleId !== null && roundIndex >= GAME_SCENARIOS.length;
  const scenario = !isComplete ? GAME_SCENARIOS[roundIndex] : undefined;
  const scenarioFlipped = !isComplete ? flipped[roundIndex] : undefined;
  const scenarioRevealed = !isComplete ? revealed[roundIndex] : false;
  const scenarioFavorite = !isComplete ? favorite[roundIndex] : null;
  const pillar = scenario ? middleBand?.pillars.find((p) => p.id === scenario.pillarId) : undefined;
  const anyFlipped = scenarioFlipped ? scenarioFlipped.some(Boolean) : false;

  const flipCard = (cardIdx: 0 | 1 | 2) => {
    setFlipped((prev) => {
      const next = prev.map((row) => [...row]);
      next[roundIndex] = [...next[roundIndex]];
      next[roundIndex][cardIdx] = !next[roundIndex][cardIdx];
      return next;
    });
    playChime('flip');
  };

  const pickFavorite = (cardIdx: 0 | 1 | 2) => {
    setFavorite((prev) => {
      const next = [...prev];
      next[roundIndex] = cardIdx;
      return next;
    });
    playChime('click');
  };

  const reveal = () => {
    setRevealed((prev) => {
      const next = [...prev];
      next[roundIndex] = true;
      return next;
    });
    playChime('click');
  };

  const goNext = () => {
    if (roundIndex === GAME_SCENARIOS.length - 1) {
      playChime('success');
    } else {
      playChime('click');
    }
    setRoundIndex((i) => i + 1);
  };

  const goBack = () => {
    playChime('click');
    setRoundIndex((i) => Math.max(0, i - 1));
  };

  const selectRole = (id: string) => {
    playChime('click');
    setRoleId(id);
  };

  const handleOpen = () => {
    playChime('click');
    setOpen(true);
  };

  const handleClose = () => {
    playChime('click');
    setOpen(false);
  };

  const restart = () => {
    playChime('click');
    setRoleId(null);
    setRoundIndex(0);
    setFlipped(GAME_SCENARIOS.map(() => [false, false, false]));
    setRevealed(GAME_SCENARIOS.map(() => false));
    setFavorite(GAME_SCENARIOS.map(() => null));
  };

  const archetypeCounts: Partial<Record<ApproachKey, number>> = {};
  favorite.forEach((favIdx, i) => {
    if (favIdx === null) return;
    const key = GAME_SCENARIOS[i].approaches[favIdx].key;
    archetypeCounts[key] = (archetypeCounts[key] ?? 0) + 1;
  });
  const dominantEntry = (Object.entries(archetypeCounts) as [ApproachKey, number][]).sort((a, b) => b[1] - a[1])[0];
  const dominantKey = dominantEntry ? dominantEntry[0] : null;

  const gameBody = (
    <div className="flex flex-col gap-5">
      {!roleId && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-700 uppercase tracking-wide mb-2" style={{ fontWeight: 700, color: 'var(--primary)' }}>
              Who's playing?
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Pick a role — including your own, if you're the student — and the five moments will speak to what you
              actually see. There's no scoring here, just real approaches to explore.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {GAME_ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => selectRole(r.id)}
                className="flex flex-col items-center gap-2 bg-card border border-border rounded-2xl px-4 py-5 text-center transition-colors hover:border-primary"
              >
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                  style={{ backgroundColor: 'var(--muted)', color: 'var(--primary)', fontWeight: 700 }}
                >
                  {r.badge}
                </span>
                <span className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {roleId && !isComplete && scenario && role && scenarioFlipped && (
        <>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => (roundIndex === 0 ? restart() : goBack())}
              className="text-xs font-600 transition-colors"
              style={{ fontWeight: 600, color: 'var(--muted-foreground)' }}
            >
              {roundIndex === 0 ? '← Change role' : '← Back'}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">
                Scenario {roundIndex + 1} of {GAME_SCENARIOS.length}
              </span>
              {roundIndex > 0 && (
                <button
                  type="button"
                  onClick={restart}
                  className="text-[11px] font-600 hover:underline"
                  style={{ fontWeight: 600, color: 'var(--primary)' }}
                >
                  Switch role
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {GAME_SCENARIOS.map((s, i) => (
              <div key={s.pillarId} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: revealed[i] ? '100%' : i === roundIndex ? '35%' : '0%',
                    backgroundColor: 'var(--accent)',
                  }}
                />
              </div>
            ))}
          </div>

          <div key={roundIndex} className="rounded-2xl p-5 animate-fade-scale" style={{ backgroundColor: 'var(--muted)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--card)', color: 'var(--primary)' }}
              >
                <ScenarioIcon pillarId={scenario.pillarId} />
              </span>
              <p className="text-xs font-700 uppercase tracking-wide" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                A moment worth pausing on
              </p>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{scenario.promptFor(role.subject, role.isSelf)}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-600 text-muted-foreground" style={{ fontWeight: 600 }}>
              Three real ways people respond — tap each to see what it tends to build. None of them is "the wrong one."
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {scenario.approaches.map((appr, i) => {
                const isFlipped = scenarioFlipped[i];
                const isFavorite = scenarioFavorite === i;
                const actionText = role.isSelf ? appr.selfAction : appr.action;
                const insightText = role.isSelf ? appr.selfInsight : appr.insight;
                return (
                  <div
                    key={appr.key}
                    className="min-h-[104px] [perspective:1000px] cursor-pointer"
                    onClick={() => flipCard(i as 0 | 1 | 2)}
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                        isFlipped ? '[transform:rotateY(180deg)]' : ''
                      }`}
                    >
                      <div
                        className="absolute inset-0 [backface-visibility:hidden] flex items-center gap-3 rounded-xl px-4 py-3.5"
                        style={{
                          border: `1.5px solid ${isFavorite ? 'var(--accent)' : 'var(--border)'}`,
                          backgroundColor: 'var(--card)',
                        }}
                      >
                        <span className="flex-shrink-0" style={{ color: 'var(--primary)' }}>
                          <ArchetypeIcon archetype={appr.key} />
                        </span>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="text-xs font-700 uppercase tracking-wide" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {ARCHETYPE_LABEL[appr.key]}
                          </p>
                          <p className="text-sm leading-snug text-foreground">{actionText}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-auto">Tap</span>
                      </div>
                      <div
                        className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center gap-2.5 rounded-xl px-4 py-3.5"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <p className="text-sm leading-snug" style={{ color: 'var(--primary-foreground)' }}>
                          {insightText}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            pickFavorite(i as 0 | 1 | 2);
                          }}
                          className="text-[10px] font-700 uppercase tracking-wide self-start px-2 py-1 rounded-full transition-colors"
                          style={{
                            fontWeight: 700,
                            backgroundColor: isFavorite ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                            color: isFavorite ? 'var(--accent-foreground)' : 'var(--primary-foreground)',
                          }}
                        >
                          {isFavorite ? '✓ Feels like me' : 'This feels like me'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!scenarioRevealed && (
            <button
              type="button"
              onClick={reveal}
              className="btn-secondary justify-center text-center"
              disabled={!anyFlipped}
              style={!anyFlipped ? { opacity: 0.5, cursor: 'default' } : undefined}
            >
              {anyFlipped ? 'Show what tends to help most here →' : 'Tap a card first to unlock this'}
            </button>
          )}

          {scenarioRevealed && pillar && (
            <div className="flex flex-col gap-3 animate-fade-up">
              <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--primary)' }}>
                <div className="flex items-center gap-2.5 mb-2.5">
                <span style={{ color: 'var(--primary-foreground)' }}>
                      <ScenarioIcon pillarId={pillar.id} size={20} />
                    </span>
                  <p className="text-sm font-700" style={{ fontWeight: 700, color: 'var(--primary-foreground)' }}>
                    The sweet spot: {pillar.name}
                  </p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--primary-foreground)', opacity: 0.95 }}>
                  In practice, it's rarely just one of the three — it's knowing which to lean on and when. {pillar.whyItMatters}
                </p>
              </div>
              <button type="button" onClick={goNext} className="btn-primary justify-center text-center">
                {roundIndex === GAME_SCENARIOS.length - 1 ? 'See my results' : 'Next scenario →'}
              </button>
            </div>
          )}
        </>
      )}

      {isComplete && (
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <CheckBadgeIcon />
          <p className="text-lg font-700 text-foreground" style={{ fontWeight: 700 }}>
            You've explored all {GAME_SCENARIOS.length} Class 6–8 pillars!
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
            This is exactly what LuminarGuide works on with students every day — the everyday moments a report card never shows.
          </p>
          {dominantKey && (
            <div className="rounded-2xl p-5 max-w-sm w-full" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="flex items-center justify-center gap-2 mb-2" style={{ color: 'var(--primary)' }}>
                <ArchetypeIcon archetype={dominantKey} />
                <p className="text-xs font-700 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                  Your natural style: {ARCHETYPE_LABEL[dominantKey]}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{ARCHETYPE_RECAP[dominantKey]}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-1">
            <Link href="/about" className="btn-secondary">See the full pillar guide</Link>
            <Link href="/get-started" className="btn-primary">Get Started</Link>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <button type="button" onClick={goBack} className="text-xs font-600 text-muted-foreground hover:text-primary transition-colors" style={{ fontWeight: 600 }}>
              ← Review my answers
            </button>
            <button type="button" onClick={restart} className="text-xs font-600 text-muted-foreground hover:text-primary transition-colors" style={{ fontWeight: 600 }}>
              ↺ Play again / switch role
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (variant === 'inline') {
    return <div className="bg-card border border-border rounded-2xl p-7 max-w-xl mx-auto">{gameBody}</div>;
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} aria-hidden="true" />}

      {open && (
        <div
          className="fixed left-1/2 top-1/2 z-50 w-[min(94vw,460px)] max-h-[88vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl flex flex-col"
          style={{ transform: 'translate(-50%, -50%)' }}
          role="dialog"
          aria-label="Try the Approach — LuminarGuide"
        >
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
                <span style={{ color: 'white' }}>
                  <PathIcon size={16} />
                </span>
              </div>
              <div>
                <p className="text-sm font-700 text-white" style={{ fontWeight: 700 }}>Try the Approach</p>
                <p className="text-[11px] text-white/70">Explore how different people respond</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="p-5">{gameBody}</div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open the pillar discovery game"
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full shadow-2xl transition-transform hover:scale-105"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
        >
          <PathIcon size={16} />
          <span className="text-sm font-700" style={{ fontWeight: 700 }}>Try the Approach</span>
        </button>
      )}
    </>
  );
}

/* ------------------------------------------------------------------------
 * CollaboratorInterestForm
 * The form used on /contact for mentors, counselors, and schools to share
 * their interest and portfolio. For now (no backend wired up yet) it
 * collects everything in real form fields, then opens the visitor's email
 * client with all of it filled in — a real upgrade over a plain mailto
 * button, and a straightforward swap-in point for Supabase later.
 * ---------------------------------------------------------------------- */

export function CollaboratorInterestForm() {
  const [form, setForm] = useState({
    name: '',
    role: 'Mentor',
    organization: '',
    portfolio: '',
    email: '',
    message: '',
  });
  const [documentName, setDocumentName] = useState('');
  const [documentPath, setDocumentPath] = useState('');
  const [docUploadStatus, setDocUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle');
  const [ciStatus, setCiStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Uploads straight into Supabase Storage (lg-collaborator-documents, a
  // private bucket with an insert-only policy) so it actually reaches us
  // instead of just being remembered as a filename to email later.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setDocumentName('');
      setDocumentPath('');
      setDocUploadStatus('idle');
      return;
    }
    setDocumentName(file.name);
    setDocUploadStatus('uploading');
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const { error } = await supabase.storage.from('lg-collaborator-documents').upload(path, file);
    if (error) {
      setDocUploadStatus('error');
      return;
    }
    setDocumentPath(path);
    setDocUploadStatus('uploaded');
  };

  const mailtoFallback = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    `${form.role} interest — Luminar's Guide`
  )}&body=${encodeURIComponent(
    `Name: ${form.name}\nRole: ${form.role}\nOrganization: ${form.organization || '—'}\nPortfolio / LinkedIn / Website: ${form.portfolio || '—'}\nReply-to email: ${form.email}\n\nMessage:\n${form.message}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setCiStatus('error');
      return;
    }
    setCiStatus('submitting');
    const { error } = await supabase.from('lg_collaborator_leads').insert({
      name: form.name,
      role: form.role,
      organization: form.organization || null,
      portfolio_url: form.portfolio || null,
      email: form.email,
      message: form.message || null,
      document_name: documentName || null,
      document_path: documentPath || null,
    });
    if (error) {
      setCiStatus('error');
      return;
    }
    setCiStatus('success');
    setForm({ name: '', role: 'Mentor', organization: '', portfolio: '', email: '', message: '' });
    setDocumentName('');
    setDocumentPath('');
    setDocUploadStatus('idle');
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-7 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ci-name" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
              Your Name
            </label>
            <input
              id="ci-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="contact-input"
              placeholder="e.g. Ananya Sharma"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ci-role" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
              I'm interested as a
            </label>
            <select id="ci-role" name="role" value={form.role} onChange={handleChange} className="contact-input">
              <option value="Mentor">Mentor</option>
              <option value="Counselor">Counselor</option>
              <option value="School">School</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ci-org" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
              Organization (optional)
            </label>
            <input
              id="ci-org"
              name="organization"
              type="text"
              value={form.organization}
              onChange={handleChange}
              className="contact-input"
              placeholder="School, practice, or organization"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ci-email" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
              Your Email
            </label>
            <input
              id="ci-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="contact-input"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ci-portfolio" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
            Portfolio, LinkedIn, or Website Link
          </label>
          <input
            id="ci-portfolio"
            name="portfolio"
            type="text"
            value={form.portfolio}
            onChange={handleChange}
            className="contact-input"
            placeholder="https://..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ci-document" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
            Or Upload a PDF / Document (optional)
          </label>
          <input
            id="ci-document"
            name="document"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="contact-input"
          />
          <p className="text-xs text-muted-foreground">
            {docUploadStatus === 'uploading' && 'Uploading…'}
            {docUploadStatus === 'uploaded' && (
              <>Got it — <span className="font-600 text-foreground">{documentName}</span> is attached to your submission.</>
            )}
            {docUploadStatus === 'error' && (
              <>Couldn&apos;t upload <span className="font-600 text-foreground">{documentName}</span> — you can send it along by email once we reply instead.</>
            )}
            {docUploadStatus === 'idle' && 'PDF or Word document, up to 10MB.'}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ci-message" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
            Tell us about yourself
          </label>
          <textarea
            id="ci-message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            className="contact-input"
            style={{ resize: 'vertical', minHeight: '100px' }}
            placeholder="A bit about your background and why you'd like to work with us..."
          />
        </div>
        <button type="submit" disabled={ciStatus === 'submitting'} className="btn-primary justify-center text-center disabled:opacity-60">
          {ciStatus === 'submitting' ? 'Sending…' : 'Share My Interest'}
        </button>
        {ciStatus === 'success' && (
          <p className="text-xs text-center" style={{ color: 'var(--primary)' }}>
            Thanks — we&apos;ve got your interest and will be in touch within one business day.
          </p>
        )}
        {ciStatus === 'error' && (
          <p className="text-xs text-muted-foreground text-center">
            Something went wrong sending that. You can also{' '}
            <a href={mailtoFallback} className="text-primary hover:underline">email us directly</a>.
          </p>
        )}
        {ciStatus === 'idle' && (
          <p className="text-xs text-muted-foreground text-center">
            If anything goes wrong, email us directly at{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        )}
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------------
 * RoleSolutionTile
 * Used on /solutions: previously each role showed its solution points in one
 * card with a "grounded in developmental psychology" theory card stacked
 * right below it. Reworked into a single flip tile — front shows the
 * solution points, back (on hover, or tap on touch devices) reveals the
 * theory — matching the flip-tile interaction already used for pillars and
 * stakeholders in FeaturesSection. Kept here (not its own file) for the same
 * reason as the other client-side pieces in this file.
 * ---------------------------------------------------------------------- */

export function RoleSolutionTile({
  points,
  theoryName,
  theoryDescription,
}: {
  points: string[];
  theoryName: string;
  theoryDescription: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group/tile [perspective:1200px] cursor-pointer"
      onClick={() => setFlipped((v) => !v)}
      role="button"
      tabIndex={0}
      aria-label="Tap or hover to see the psychology behind this role"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
    >
      <div
        className={`grid grid-cols-1 transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : 'group-hover/tile:[transform:rotateY(180deg)]'
        }`}
      >
        <div className="[grid-area:1/1] [backface-visibility:hidden] bg-card border border-border rounded-2xl p-7 flex flex-col gap-5">
          <ul className="flex flex-col gap-3.5">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: 'var(--accent)' }} />
                {point}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-3 border-t border-border">
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
            Hover or tap to see the psychology behind this
          </p>
        </div>
        <div
          className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl p-7 flex flex-col gap-3 justify-center"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <p className="text-[11px] font-700 uppercase tracking-widest" style={{ fontWeight: 700, color: 'var(--primary-foreground)', opacity: 0.8 }}>
            Grounded in developmental psychology
          </p>
          <p className="text-sm font-700" style={{ fontWeight: 700, color: 'var(--primary-foreground)' }}>
            {theoryName}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--primary-foreground)', opacity: 0.95 }}>
            {theoryDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------
 * GradeBandDeepDive
 * Used on /about. Used to be three full-width sections stacked back to
 * back — Classes 6-8, then 9-10, then 11-12 — each repeating the exact same
 * layout (label, status pill, heading, challenge chips), which made the
 * page a long scroll of near-identical blocks. Collapsed into one section
 * with the same grade-band tab picker already used in FeaturesSection, so
 * a visitor sees one band in full at a time instead of scrolling past all
 * three whether they care about all three ages or not.
 * ---------------------------------------------------------------------- */

export function GradeBandDeepDive() {
  const [activeId, setActiveId] = useState<GradeBand['id']>('middle');
  const band = gradeBands.find((b) => b.id === activeId) ?? gradeBands[0];

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="text-xs font-600 text-primary uppercase tracking-widest" style={{ fontWeight: 600 }}>
            A Closer Look, Band by Band
          </p>
          <div className="flex gap-1.5 bg-card border border-border rounded-full p-1">
            {gradeBands.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveId(b.id)}
                className="px-4 py-1.5 rounded-full text-xs font-600 transition-colors"
                style={{
                  fontWeight: 600,
                  backgroundColor: activeId === b.id ? 'var(--primary)' : 'transparent',
                  color: activeId === b.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                {b.gradesShort}
              </button>
            ))}
          </div>
        </div>

        <div key={band.id} className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <p className="text-xs font-600 text-primary uppercase tracking-widest">
              {band.gradesLabel} · {band.bandLabel}
            </p>
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
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------
 * OurStoriesGallery
 * The dedicated "Our Stories" page content, rendered by /gamification (that
 * route's folder can't be renamed without creating a new one, since this
 * project can't add files — so the page is repurposed in place; visitors
 * only ever see it through the "Our Stories" nav link, never by typing the
 * URL). The original /gamification content — the "Try the Approach" pillar
 * game — isn't lost: the same game already floats on every page as a
 * dismissible modal launcher (PillarDiscoveryGame variant="modal", bottom
 * left), so nothing here removes that feature, only its dedicated inline
 * showcase page.
 *
 * A horizontally-scrolling carousel — testimonial, photo, and video cards
 * side by side, with left/right arrow controls, three cards visible at once
 * on desktop and one at a time on mobile (via CSS scroll-snap) — plus the
 * "share your story" submission form underneath, so gallery and submission
 * stay together in one place. No real testimonials, photos, or videos exist
 * yet, so every card here is framed honestly as "coming soon" instead of
 * invented to look genuine. Like the other forms on this site, there's no
 * backend yet, so submitting falls back to a pre-filled mailto — and a
 * browser can't attach a photo to a mailto draft, so the photo upload only
 * captures the filename and the pre-filled email reminds the sender to
 * attach it themselves.
 * ---------------------------------------------------------------------- */

type StoryItem = { kind: 'testimonial' | 'photo' | 'video'; text: string };

const storyItems: StoryItem[] = [
  { kind: 'testimonial', text: "Real stories from our mentors, parents, and schools are on their way — this space is reserved for the first ones we publish." },
  { kind: 'photo', text: 'Photos from the program — coming soon' },
  { kind: 'video', text: 'Videos from the program — coming soon' },
  { kind: 'testimonial', text: "We'd rather wait and show you something real than fill this with something that isn't. Check back soon." },
  { kind: 'photo', text: 'Photos from the program — coming soon' },
  { kind: 'testimonial', text: "Been part of the pilot? Your story could be one of the first to appear here — share it below." },
];

function QuoteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 8c-1.7 0-3 1.3-3 3v3h4v-3H5a1.5 1.5 0 011.5-1.5V8zm9 0c-1.7 0-3 1.3-3 3v3h4v-3h-2a1.5 1.5 0 011.5-1.5V8z" fill="var(--accent)" opacity="0.5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M11 8.5l7 4.5-7 4.5v-9z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function OurStoriesGallery() {
  const [form, setForm] = useState({ name: '', role: 'Parent', story: '' });
  const [photoName, setPhotoName] = useState('');
  const [photoPath, setPhotoPath] = useState('');
  const [photoUploadStatus, setPhotoUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle');
  const [storyStatus, setStoryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Uploads straight into Supabase Storage (lg-story-photos, a private
  // bucket with an insert-only policy) instead of just remembering the
  // filename for later.
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoName('');
      setPhotoPath('');
      setPhotoUploadStatus('idle');
      return;
    }
    setPhotoName(file.name);
    setPhotoUploadStatus('uploading');
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const { error } = await supabase.storage.from('lg-story-photos').upload(path, file);
    if (error) {
      setPhotoUploadStatus('error');
      return;
    }
    setPhotoPath(path);
    setPhotoUploadStatus('uploaded');
  };

  const scrollByPage = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const mailtoHref = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    `Story from a ${form.role} — LuminarGuide`
  )}&body=${encodeURIComponent(
    `Name: ${form.name}\nRole: ${form.role}\n${photoName ? `\nDon't forget to attach: ${photoName}\n` : ''}\nStory:\n${form.story}`
  )}`;

  const handleStorySubmit = async () => {
    if (!form.story) {
      setStoryStatus('error');
      return;
    }
    setStoryStatus('submitting');
    const { error } = await supabase.from('lg_story_submissions').insert({
      name: form.name || null,
      role: form.role,
      story: form.story,
      photo_name: photoName || null,
      photo_path: photoPath || null,
    });
    if (error) {
      setStoryStatus('error');
      return;
    }
    setStoryStatus('success');
    setForm({ name: '', role: 'Parent', story: '' });
    setPhotoName('');
    setPhotoPath('');
    setPhotoUploadStatus('idle');
  };

  return (
    <>
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Our Stories</p>
          <h1 className="text-section-heading text-foreground mb-5">Stories from the Luminar's Guide community.</h1>
          <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
            Photos, videos, and testimonials from mentors, parents, schools, and students — scroll through with the
            arrows, or add your own below.
          </p>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-end gap-2 mb-5">
            <button
              type="button"
              onClick={() => scrollByPage('left')}
              aria-label="Scroll stories left"
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByPage('right')}
              aria-label="Scroll stories right"
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {storyItems.map((item, i) => (
              <div key={i} className="snap-start shrink-0 w-full md:w-[calc(33.333%-0.667rem)]">
                {item.kind === 'testimonial' ? (
                  <div className="bento-card h-full flex flex-col gap-3 justify-center min-h-[200px]">
                    <QuoteIcon />
                    <p className="text-sm leading-relaxed text-muted-foreground italic">{item.text}</p>
                  </div>
                ) : (
                  <div className="aspect-[4/5] rounded-xl border border-dashed border-border bg-card flex flex-col items-center justify-center gap-3 text-center p-4 text-muted-foreground">
                    {item.kind === 'video' && <PlayIcon />}
                    <span className="text-xs">{item.text}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="bg-card border border-border rounded-2xl p-7 max-w-2xl mx-auto">
          <h3 className="text-card-heading text-foreground mb-1">Share your story</h3>
          <p className="text-sm text-muted-foreground mb-5">Tell us what your experience with Luminar's Guide has been like — we read every one.</p>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tg-name" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
                  Your Name
                </label>
                <input
                  id="tg-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="e.g. Ananya Sharma"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tg-role" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
                  I'm a
                </label>
                <select id="tg-role" name="role" value={form.role} onChange={handleChange} className="contact-input">
                  <option value="Parent">Parent</option>
                  <option value="Mentor">Mentor</option>
                  <option value="School">School</option>
                  <option value="Student">Student</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tg-story" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
                Your Story
              </label>
              <textarea
                id="tg-story"
                name="story"
                rows={4}
                value={form.story}
                onChange={handleChange}
                className="contact-input"
                style={{ resize: 'vertical', minHeight: '100px' }}
                placeholder="What changed, or what stood out to you?"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tg-photo" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
                Add a Photo (optional)
              </label>
              <input
                id="tg-photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="contact-input"
              />
              <p className="text-xs text-muted-foreground">
                {photoUploadStatus === 'uploading' && 'Uploading…'}
                {photoUploadStatus === 'uploaded' && (
                  <>Got it — <span className="font-600 text-foreground">{photoName}</span> is attached to your story.</>
                )}
                {photoUploadStatus === 'error' && (
                  <>Couldn&apos;t upload <span className="font-600 text-foreground">{photoName}</span> — no worries, we&apos;ll follow up about it if we&apos;d love to include one.</>
                )}
                {photoUploadStatus === 'idle' && 'JPG, PNG, or GIF, up to 8MB.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleStorySubmit}
              disabled={storyStatus === 'submitting'}
              className="btn-primary justify-center text-center mt-1 disabled:opacity-60"
            >
              {storyStatus === 'submitting' ? 'Sending…' : 'Send Your Story'}
            </button>
            {storyStatus === 'success' && (
              <p className="text-xs text-center" style={{ color: 'var(--primary)' }}>
                Thanks for sharing — we read every story.
              </p>
            )}
            {storyStatus === 'error' && (
              <p className="text-xs text-muted-foreground text-center">
                Something went wrong sending that. You can also{' '}
                <a href={mailtoHref} className="text-primary hover:underline">email it to us directly</a>.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------------
 * ReadAloudControl
 * An accessibility control that lives in the header (top of every page) and
 * uses the browser's built-in speech synthesis — no external API, no audio
 * files — to read the current page's content out loud. Built primarily for
 * visitors who are blind or have low vision, and useful for anyone who'd
 * rather listen. Offers "read the whole page" plus a per-section list, so
 * someone can choose exactly which part gets read.
 * ---------------------------------------------------------------------- */

function getPageSections(): { label: string; text: string }[] {
  if (typeof document === 'undefined') return [];
  const main = document.querySelector('main');
  if (!main) return [];
  const sections = Array.from(main.querySelectorAll('section'));
  if (sections.length === 0) {
    const text = (main as HTMLElement).innerText || '';
    return text.trim() ? [{ label: 'Page content', text }] : [];
  }
  return sections
    .map((sec, i) => {
      const heading = sec.querySelector('h1, h2, h3');
      const label = heading?.textContent?.trim() || `Section ${i + 1}`;
      return { label, text: (sec as HTMLElement).innerText || '' };
    })
    .filter((s) => s.text.trim().length > 0);
}

// Browsers ship several installed voices, and the default one picked
// automatically is usually the flattest, most robotic-sounding option. This
// looks for a noticeably more natural-sounding voice among whatever the
// visitor's device/browser already has installed (no external API, no key,
// no backend — genuinely human-quality neural voices like ElevenLabs would
// need a paid API and a server to call it from, which isn't wired up yet).
function pickBestVoice(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const englishVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith('en'));
    const pool = englishVoices.length ? englishVoices : voices;

    const localVoices = pool.filter((v) => v.localService);
    const niceNamePatterns = [/natural/i, /neural/i, /enhanced/i, /premium/i];

    for (const pattern of niceNamePatterns) {
      const match = localVoices.find((v) => pattern.test(v.name));
      if (match) return match;
    }
    if (localVoices.length) return localVoices[0];

    const networkNamePatterns = [
      /natural/i,
      /neural/i,
      /enhanced/i,
      /premium/i,
      /online \(natural\)/i,
      /google us english/i,
      /google uk english/i,
    ];
    for (const pattern of networkNamePatterns) {
      const match = pool.find((v) => pattern.test(v.name));
      if (match) return match;
    }

    return pool[0] || null;
  } catch {
    return null;
  }
}
// Breaks a block of text into short clause-sized chunks and pairs each with
// how long to pause after it. The Web Speech API doesn't support SSML-style
// <break> pauses inside a single utterance in most browsers, so this is what
// actually shapes the read-aloud voice's rhythm — like a vocal coach marking
// up a script, it uses three distinct pause lengths instead of one flat gap:
//   - a light breath at a comma/semicolon (mid-sentence),
//   - a slightly longer beat between sentences/lines within the same
//     paragraph (a "line change" — noticeable, but doesn't drag),
//   - a fuller breath when the paragraph itself changes (a real topic/idea
//     change, where a longer pause actually reads as natural).
// Text pulled from the page (via innerText) already carries blank lines
// between paragraphs and single line breaks between things like separate
// list items or a heading sitting on its own line — that structure is what
// this function reads to tell paragraph breaks apart from line breaks.

function splitIntoSpeechChunks(text: string): { text: string; pauseAfter: number; final: boolean }[] {
  const PAUSE_COMMA = 30;
  const PAUSE_LINE = 50;
  const PAUSE_PARAGRAPH = 300;

  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const chunks: { text: string; pauseAfter: number; final: boolean }[] = [];

  paragraphs.forEach((paragraph, pIndex) => {
    const isLastParagraph = pIndex === paragraphs.length - 1;
    const lines = paragraph
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    lines.forEach((line, lIndex) => {
      const isLastLine = lIndex === lines.length - 1;
      const sentences = (line.match(/[^.!?]+[.!?]*(\s+|$)/g) || [line])
        .map((s) => s.trim())
        .filter(Boolean);

      sentences.forEach((sentence, sIndex) => {
        const isLastSentence = sIndex === sentences.length - 1;
        const clauses = sentence
          .split(/(?<=[,;:])\s+/)
          .map((c) => c.trim())
          .filter(Boolean);

        clauses.forEach((clause, cIndex) => {
          const isLastClause = cIndex === clauses.length - 1;
          let pauseAfter: number = PAUSE_COMMA;

          if (isLastClause) {
            if (!isLastSentence || !isLastLine) {
              pauseAfter = PAUSE_LINE;
            } else if (!isLastParagraph) {
              pauseAfter = PAUSE_PARAGRAPH;
            } else {
              pauseAfter = 0;
            }
          }

          chunks.push({ text: clause, pauseAfter, final: isLastClause });
        });
      });
    });
  });

  for (let idx = 1; idx < chunks.length; idx++) {
    const nextWordCount = chunks[idx].text.split(/\s+/).filter(Boolean).length;
    if (nextWordCount >= 12) {
      chunks[idx - 1].pauseAfter += 60;
    }
  }

  return chunks;
}

// Browser TTS has no real concept of emphasis or intonation — it just reads
// back whatever flat pitch/rate value you hand it for an entire clause. This
// is the closest approximation available without a paid neural voice model:
// nudging pitch and rate per clause based on how it ends (a question trails
// upward, an exclamation gets a touch more energy, a parenthetical aside
// drops into a lower, slower "by the way" register), plus a small random
// drift on every clause so consecutive lines don't all land on the exact
// same flat tone the way a robotic voice does.
function prosodyFor(clauseText: string, isSentenceFinal: boolean): { pitch: number; rate: number } {
  const trimmed = clauseText.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const jitter = (Math.random() - 0.5) * 0.05;

  let pitch: number;
  let rate: number;

  if (/\?\s*$/.test(trimmed)) {
    pitch = 1.1;
    rate = 0.92;
  } else if (/!\s*$/.test(trimmed)) {
    pitch = 1.05;
    rate = 0.97;
  } else if (/^[-—(]/.test(trimmed) || /[-—)]\s*$/.test(trimmed)) {
    pitch = 0.96;
    rate = 0.89;
  } else if (isSentenceFinal) {
    pitch = 0.95;
    rate = 0.93;
  } else {
    pitch = 1.04;
    rate = 0.95;
  }

  if (wordCount >= 12) rate -= 0.04;
  else if (wordCount <= 3) rate += 0.03;

  return { pitch: pitch + jitter, rate };
}

export function ReadAloudControl() {  
  const pathname = usePathname();
  const [openPanel, setOpenPanel] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sections, setSections] = useState<{ label: string; text: string }[]>([]);
  const cancelledRef = useRef(false);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      // Chrome in particular loads its voice list asynchronously — this warms
      // it up so the very first "Read aloud" click can already pick a good one.
      window.speechSynthesis.getVoices();
    } catch {
      // Speech synthesis unavailable — nothing to warm up.
    }
    return () => {
      cancelledRef.current = true;
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Speech synthesis unavailable — nothing to clean up.
      }
    };
  }, []);

  // The header stays mounted across page navigations, so without this the
  // panel would keep showing (and reading) whichever page was open when it
  // was first used. Recomputing on every route change is what makes "Read
  // this page aloud" actually reflect the page you're currently on.
  useEffect(() => {
    cancelledRef.current = true;
    if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Nothing to stop.
    }
    setSpeaking(false);
    setOpenPanel(false);
    setSections(getPageSections());
  }, [pathname]);

  const togglePanel = () => {
    if (!openPanel) setSections(getPageSections());
    setOpenPanel((v) => !v);
  };

  const speak = (text: string) => {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Speech synthesis unavailable in this browser.
    }
    if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
    cancelledRef.current = false;

    const voice = pickBestVoice();
    const chunks = splitIntoSpeechChunks(text);
    let i = 0;

    const speakNext = () => {
      if (cancelledRef.current || i >= chunks.length) {
        setSpeaking(false);
        return;
      }
      const chunk = chunks[i];
      i += 1;
      try {
        const utterance = new SpeechSynthesisUtterance(chunk.text);
        const { pitch, rate } = prosodyFor(chunk.text, chunk.final);
        utterance.rate = rate;
        utterance.pitch = pitch;
        if (voice) utterance.voice = voice;

        let advanced = false;
        const advance = () => {
          if (advanced || cancelledRef.current) return;
          advanced = true;
          pendingTimeoutRef.current = setTimeout(speakNext, chunk.pauseAfter);
        };
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = advance;
        utterance.onerror = advance;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis unavailable in this browser.
      }
    };

    speakNext();
  };

  const stop = () => {
    cancelledRef.current = true;
    if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Nothing to stop.
    }
    setSpeaking(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={togglePanel}
        aria-label="Read this page aloud"
        aria-expanded={openPanel}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors flex-shrink-0"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M3 7v6h4l5 4V3L7 7H3z" fill="currentColor" />
          <path d="M14.5 7a4 4 0 010 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={speaking ? 1 : 0.45} />
          <path d="M16.5 5a7 7 0 010 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={speaking ? 1 : 0.25} />
        </svg>
      </button>

      {openPanel && (
        <div className="absolute right-0 top-12 w-72 bg-card border border-border rounded-2xl shadow-2xl p-4 flex flex-col gap-3 z-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-700 text-foreground" style={{ fontWeight: 700 }}>
              Read this page aloud
            </p>
            <button
              type="button"
              onClick={() => setOpenPanel(false)}
              aria-label="Close"
              className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Built for anyone who'd rather listen — including visitors who are blind or have low vision.
          </p>
          <button
            type="button"
            onClick={() => speak(sections.map((s) => s.text).join('. '))}
            className="btn-secondary justify-center text-center text-sm"
          >
            ▶ Read whole page
          </button>
          {sections.length > 1 && (
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              <p className="text-[11px] font-600 text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 600 }}>
                Or just one section
              </p>
              {sections.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => speak(s.text)}
                  className="text-left text-xs text-foreground bg-muted hover:bg-border rounded-lg px-3 py-2 transition-colors"
                >
                  ▶ {s.label}
                </button>
              ))}
            </div>
          )}
          {speaking && (
            <button type="button" onClick={stop} className="btn-primary justify-center text-center text-sm">
              ⏹ Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
}