'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ThemeSwitcher from '@/components/ThemeSwitcher';
import { siteConfig, supabase, gradeBands, getGradeBand, type GradeBand, type Pillar } from '@/lib/siteConfig';

const navLinks = [
{ label: 'Home', href: '/' },
{ label: 'About', href: '/about' },
{ label: 'Features', href: '/features' },
{ label: 'Solutions', href: '/solutions' },
{ label: 'Work With Us', href: '/get-started' },
{ label: 'Contact', href: '/contact' }];


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
        scrolled || menuOpen ? 'bg-card backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'}`
        }>
        
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
  <img
    src="https://ldkwhimqenxkloibhwzt.supabase.co/storage/v1/object/public/Branding/logofulllight%20(1).svg"
    alt="Luminar's Guide"
    className="logo-light h-9 w-auto transition-transform duration-300 group-hover:scale-105"
  />
  <img
    src="https://ldkwhimqenxkloibhwzt.supabase.co/storage/v1/object/public/Branding/logofulldark.svg"
    alt="Luminar's Guide"
    className="logo-dark h-9 w-auto transition-transform duration-300 group-hover:scale-105"
  />
</Link>

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) =>
            <Link key={link.href} href={link.href} className="nav-link whitespace-nowrap">
                {link.label}
              </Link>
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ReadAloudControl />
            <ThemeSwitcher />
            <Link href="/get-started" className="btn-primary text-sm px-5 py-2.5">
              Ask Us Anything
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <ReadAloudControl />
            <ThemeSwitcher />
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              
              {menuOpen ?
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg> :

              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              }
            </button>
          </div>
        </div>

        {menuOpen &&
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-card backdrop-blur-md border-b border-border px-6 py-6 flex flex-col gap-5 shadow-lg z-50">
            {navLinks.map((link) =>
          <Link key={link.href} href={link.href} className="text-base font-medium text-foreground hover:text-primary transition-colors py-1" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
          )}
            <Link href="/get-started" className="btn-primary justify-center mt-2" onClick={() => setMenuOpen(false)}>
              Ask Us Anything
            </Link>
          </div>
        }
      </header>

      {/* Floating AI pillar chatbot — lives here (rather than its own file) so it
           renders on every page via the Header, which is already global. */}
      <PillarGuideChat />

      {/* Floating pillar discovery game — same reasoning, lives here so it's global. */}
      <PillarDiscoveryGame />
    </>);

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
{id: string;kind: 'bot-text';text: string;} |
{id: string;kind: 'user';text: string;} |
{id: string;kind: 'band-choices';} |
{id: string;kind: 'pillar-choices';bandId: GradeBand['id'];} |
{id: string;kind: 'pillar-answer';bandId: GradeBand['id'];pillarId: string;} |
{id: string;kind: 'next-steps';bandId: GradeBand['id'];};

let chatTurnCounter = 0;
const nextChatId = () => `t${chatTurnCounter++}`;

const CHAT_GREETING =
"Hi, I'm the LuminarGuide Pillar Guide. Tell me which class your child is in, and I'll walk you through what we focus on and why it matters at that age.";

function PillarGuideChat() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [turns, setTurns] = useState<ChatTurnData[]>([
  { id: nextChatId(), kind: 'bot-text', text: CHAT_GREETING },
  { id: nextChatId(), kind: 'band-choices' }]
  );
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
        band.status === 'live' ?
        `Got it — ${band.gradesLabel} (${band.bandLabel}). ${band.ageContext}` :
        `Got it — ${band.gradesLabel} (${band.bandLabel}). Quick note: this band is still ${band.statusLabel.toLowerCase()} for our pilot, but here's the thinking behind it so far. ${band.ageContext}`
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
    { id: nextChatId(), kind: 'band-choices' }]
    );
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
      {open &&
      <div
        className="w-[min(92vw,380px)] h-[min(70vh,560px)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-label="LuminarGuide pillar chatbot">
        
          {/* Header */}
          <div
          className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
          style={{ backgroundColor: 'var(--primary)' }}>
          
            <div className="flex items-center gap-2.5">
              <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
              
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
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
            
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Transcript */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: 'var(--muted)' }}>
            {turns.map((turn) =>
          <ChatTurn key={turn.id} turn={turn} onSelectBand={handleBandSelect} onSelectPillar={handlePillarSelect} onMorePillars={handleMorePillars} onRestart={handleRestart} />
          )}
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
      }

      {/* Launcher — icon-only on phones (w-12 h-12, no text) so it doesn't
          collide with the other floating launcher (Try the Approach) in the
          opposite corner; from the sm breakpoint up there's room for the
          full pill with its label. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close pillar chatbot' : 'Open pillar chatbot'}
        className="relative flex items-center justify-center gap-2.5 shadow-2xl text-white transition-transform hover:scale-105 w-12 h-12 rounded-full sm:w-auto sm:h-auto sm:pl-4 sm:pr-5 sm:py-3.5"
        style={{ backgroundColor: 'var(--primary)' }}>

        {!everOpened &&
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
        }
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2.5 4.5A1.5 1.5 0 014 3h10a1.5 1.5 0 011.5 1.5V11A1.5 1.5 0 0114 12.5H8l-3.5 3V12.5H4A1.5 1.5 0 012.5 11V4.5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:inline text-sm font-700" style={{ fontWeight: 700 }}>
          {open ? 'Close' : 'Which pillars fit my child?'}
        </span>
      </button>
    </div>);

}

function ChatTurn({
  turn,
  onSelectBand,
  onSelectPillar,
  onMorePillars,
  onRestart






}: {turn: ChatTurnData;onSelectBand: (bandId: GradeBand['id']) => void;onSelectPillar: (bandId: GradeBand['id'], pillarId: string) => void;onMorePillars: (bandId: GradeBand['id']) => void;onRestart: () => void;}) {
  if (turn.kind === 'bot-text') {
    return (
      <div className="max-w-[88%] bg-card border border-border rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs leading-relaxed text-foreground shadow-sm">
        {turn.text}
      </div>);

  }

  if (turn.kind === 'user') {
    return (
      <div
        className="max-w-[80%] self-end rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs font-600 text-white shadow-sm"
        style={{ backgroundColor: 'var(--accent)', fontWeight: 600, alignSelf: 'flex-end' }}>
        
        {turn.text}
      </div>);

  }

  if (turn.kind === 'band-choices') {
    return (
      <div className="flex flex-wrap gap-2">
        {gradeBands.map((band) =>
        <button
          key={band.id}
          type="button"
          onClick={() => onSelectBand(band.id)}
          className="growth-pill cursor-pointer bg-card">
          
            {band.gradesLabel}
          </button>
        )}
      </div>);

  }

  if (turn.kind === 'pillar-choices') {
    const band = getGradeBand(turn.bandId);
    if (!band) return null;
    return (
      <div className="flex flex-col gap-1.5">
        {band.pillars.map((pillar) =>
        <button
          key={pillar.id}
          type="button"
          onClick={() => onSelectPillar(band.id, pillar.id)}
          className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2.5 text-left text-xs font-600 text-foreground hover:border-primary transition-colors"
          style={{ fontWeight: 600 }}>
          
            <span className="flex-shrink-0" style={{ color: 'var(--primary)' }}>
              <ScenarioIcon pillarId={pillar.id} size={16} />
            </span>
            {pillar.name}
          </button>
        )}
      </div>);

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
            style={{ backgroundColor: 'rgba(22,33,44,0.08)', color: 'var(--primary)' }}>
            
            <ScenarioIcon pillarId={pillar.id} size={16} />
          </span>
          <p className="text-sm font-700 text-foreground" style={{ fontWeight: 700 }}>
            {pillar.name}
          </p>
          {band.status === 'in-development' &&
          <span className="text-[10px] font-600 uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', fontWeight: 600 }}>
              In development
            </span>
          }
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
      </div>);

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
      </div>);

  }

  return null;
}

/* ------------------------------------------------------------------------
 * PillarDiscoveryGame
 * An exploratory "Try the Approach" game covering all three live grade
 * bands — Classes 6–8, 9–10, and 11–12 (see `gradeBands` in siteConfig).
 * Players pick a grade band first, then a role — the student themselves,
 * or a Mentor / Parent / School / Counselor — from a game-specific role
 * list (GAME_ROLES, deliberately separate from the sitewide `stakeholders`
 * list used elsewhere, since the game also lets the student play as
 * themselves). Each (band, role) combination has its own five scenarios,
 * one per pillar in that band, sourced from BAND_ROLE_SCENARIOS — never the
 * same situation reworded across roles or bands, each written fresh from
 * that vantage point. Both the band and the role can be changed at any
 * point via their tab rows, no page refresh needed, and progress (which
 * scenario you're on, which have been explored) is tracked independently
 * per band+role pair via a composite "bandId:roleId" key, so switching
 * bands or roles never loses your place in another one.
 *
 * For each scenario, players get three real, legitimate response styles —
 * Step In, Ask & Guide, Step Back — drawn from situational-leadership /
 * coaching-stance research. None of the three is "the wrong answer": each
 * option expands on tap to reveal what that style tends to build and what
 * to watch for, on its own terms. Only after exploring does the game
 * reveal the pillar's sweet spot. Players can move between scenarios with
 * the arrow buttons, a swipe gesture on mobile, or by jumping directly to
 * a pillar via the pillar strip. Icons throughout are hand-drawn inline
 * SVGs (no emoji, no image assets) to keep the visual language consistent
 * with the rest of the site.
 *
 * Renders as a full-screen takeover on mobile and a centered floating
 * panel on larger screens, reopened any time from its launcher button
 * (bottom-left, icon-only on mobile to avoid colliding with the pillar
 * chatbot launcher). Kept here (not its own file) for the same reason as
 * PillarGuideChat above.
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
  }}

type ApproachKey = 'stepIn' | 'askGuide' | 'stepBack';

const ARCHETYPE_LABEL: Record<ApproachKey, string> = {
  stepIn: 'Step In',
  askGuide: 'Ask & Guide',
  stepBack: 'Step Back'
};

const ARCHETYPE_RECAP: Record<ApproachKey, string> = {
  stepIn:
  "You lean toward stepping in directly — hands-on and quick to act. That's real support, especially when someone needs steady footing fast.",
  askGuide:
  "You lean toward asking and guiding — drawing the answer out rather than handing it over. That's the scaffolding at the heart of how good mentoring builds lasting judgment.",
  stepBack:
  "You lean toward stepping back and giving space first. That takes real trust, and it's often exactly what an older student needs to build ownership."
};

// Small line-art icons, drawn in-line (no image assets, no emoji) so the game
// reads as a considered piece of the product rather than a generic quiz.
function PathIcon({ size = 18 }: {size?: number;}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.6 16.4L10.5 8M13.5 8l4 8.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>);

}

function CheckBadgeIcon({ size = 36 }: {size?: number;}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="var(--accent)" strokeWidth="1.6" />
      <path d="M8 12.3l2.6 2.6L16.2 9" stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>);

}

// Full custom line-icon set for all 15 pillars across the three grade bands
// (was previously just 4 explicit icons + a fallback, since only the middle
// band had icons drawn). Exported so FeaturesSection and the About pages can
// use the same set instead of the raw pillar emoji. Falls back to the
// self-identity mark for any unrecognized id, same as before.
export function ScenarioIcon({ pillarId, size = 22 }: {pillarId: string;size?: number;}) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };
  const paths: Record<string, React.ReactNode> = {
    'digital-wisdom':
    <>
        <rect x="3.5" y="5.5" width="17" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.5 19.5h7M12 16.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="11" r="1" fill="currentColor" />
        <circle cx="15" cy="11" r="1" fill="currentColor" />
      </>,

    'inner-strength':
    <>
        <path d="M7 3.5h6.5l4 4V20a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13.5 3.5V8h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8.5 13.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>,

    'personal-safety':
    <>
        <path d="M12 3.2l6.5 2.8v4.8c0 4.1-2.8 7.5-6.5 8.6-3.7-1.1-6.5-4.5-6.5-8.6V6l6.5-2.8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>,

    leadership:
    <>
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16.5" cy="10.5" r="2.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 19c.5-3 2.5-4.7 5-4.7s4.5 1.7 5 4.7M14.8 19c.4-2.2 1.7-3.7 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>,

    'self-identity':
    <>
        <path d="M12 21c4-3.2 7-6.6 7-10.7A7 7 0 005 10.3C5 14.4 8 17.8 12 21z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="10.2" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      </>,

    'exam-resilience':
    <>
        <rect x="4.5" y="3.5" width="15" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7.5 7.5h9M7.5 10.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8.3 16.8l2 2 5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>,

    'stream-discovery':
    <>
        <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15.2 8.8l-2 4.7-4.7 2 2-4.7 4.7-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </>,

    'peer-navigation':
    <>
        <circle cx="7" cy="8.5" r="2.3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="8.5" r="2.3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="16.5" r="2.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.7 10.1l2.4 4.3M15.3 10.1l-2.4 4.3M9.3 8.5h5.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </>,

    'digital-self-discovery':
    <>
        <path d="M8.3 11.3a4 4 0 118 0c0 2.6-1.8 3.6-1.8 5.7H10c0-2.1-1.7-3.1-1.7-5.7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9.8 19.5h4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 6.5l1.6 1.3M20 6.5l-1.6 1.3M12 3v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>,

    'generation-gap':
    <>
        <path d="M3 6.3A1.4 1.4 0 014.4 4.9h6.4a1.4 1.4 0 011.4 1.4v4.6a1.4 1.4 0 01-1.4 1.4H7.6L5 14.5v-2.2H4.4A1.4 1.4 0 013 10.9V6.3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M12.2 9.9h6.4A1.4 1.4 0 0120 11.3v4.6a1.4 1.4 0 01-1.4 1.4h-.6v2.2l-2.6-2.2h-3.2a1.4 1.4 0 01-1.4-1.4V13" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </>,

    'performance-pressure':
    <>
        <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="1.1" fill="currentColor" />
      </>,

    'interpersonal-bonds':
    <>
        <circle cx="9" cy="12" r="5.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="12" r="5.2" stroke="currentColor" strokeWidth="1.5" />
      </>,

    independence:
    <>
        <path d="M13.5 3.5H6a1 1 0 00-1 1v15a1 1 0 001 1h7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12.2h8.5M17.3 8.7l3.4 3.5-3.4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.7" cy="12.2" r="0.9" fill="currentColor" />
      </>,

    'peer-pressure-manipulation':
    <>
        <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>,

    'resilience-rejection':
    <>
        <path d="M4.5 12a7.5 7.5 0 0112.6-5.5M19.5 12a7.5 7.5 0 01-12.6 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17.1 3.8v3.2h-3.2M6.9 20.2V17h3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>

  };
  return <svg {...common}>{paths[pillarId] ?? paths['self-identity']}</svg>;
}

// Custom line-icon set for the five stakeholder roles — replaces the emoji
// (🎒🧑‍🏫👨‍👩‍👧🏫💬) used for these everywhere on the site. Exported so
// AboutSection, the /about page, and the Work-With-Us role cards on
// /get-started all draw from the same set.
export function StakeholderIcon({
  role,
  size = 20



}: {role: 'Students' | 'Mentors' | 'Parents' | 'Schools' | 'Counselors';size?: number;}) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };
  const paths: Record<string, React.ReactNode> = {
    Students:
    <>
        <path d="M7 8.5V6.7a5 5 0 0110 0V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4.5" y="8.5" width="15" height="11.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 12.5v3M14.5 12.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>,

    Mentors:
    <>
        <circle cx="12" cy="7.3" r="3.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 20c.6-4.2 3.4-6.5 7-6.5s6.4 2.3 7 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.5 8.2l2.2-1.4M18.7 6.8l.3 2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </>,

    Parents:
    <>
        <circle cx="9" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16.5" cy="10" r="2.1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.3 19.5c.5-3.6 2.7-5.6 5.7-5.6s5.2 2 5.7 5.6M14.3 19.5c.3-2.4 1.6-4 3.7-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>,

    Schools:
    <>
        <path d="M12 3.5l9 4.3-9 4.3-9-4.3 9-4.3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6.5 10.4v4.6c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 8v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>,

    Counselors:
    <>
        <path d="M4.5 6.3A1.8 1.8 0 016.3 4.5h11.4a1.8 1.8 0 011.8 1.8v8.4a1.8 1.8 0 01-1.8 1.8H11l-4.5 3.5v-3.5H6.3a1.8 1.8 0 01-1.8-1.8V6.3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8.5 9.8a1.9 1.9 0 013.4-1.2c.6.5 1.1.8 1.1 1.7 0 1-1.1 1.2-1.1 2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="11.8" cy="15" r="0.9" fill="currentColor" />
      </>

  };
  return <svg {...common}>{paths[role]}</svg>;
}

function ArchetypeIcon({ archetype, size = 22 }: {archetype: ApproachKey;size?: number;}) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };
  if (archetype === 'stepIn') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 12l4.6-4.6M16.8 6.7v4M16.8 6.7h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>);

  }
  if (archetype === 'askGuide') {
    return (
      <svg {...common}>
        <path d="M4.5 5.8A1.6 1.6 0 016.1 4.2h11.8a1.6 1.6 0 011.6 1.6v8.4a1.6 1.6 0 01-1.6 1.6H10l-3.9 3.3v-3.3H6.1a1.6 1.6 0 01-1.6-1.6V5.8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10.4 9.4a1.7 1.7 0 113 1c-.5.4-1 .7-1 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="12.4" cy="13.6" r="0.9" fill="currentColor" />
      </svg>);

  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.2 9l-2.2 3 2.2 3M7 12h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>);

}

// The one hover/tap affordance icon used everywhere a card or tile flips to
// reveal more (the homepage feature cards, the pillar tiles, the role tiles
// on /solutions). Earlier versions of this used an animated hand — first a
// literal 👆 emoji, then a hand-shaped icon with a squash-and-bounce tap
// animation — and both read as a game UI, not a serious product. This is a
// plain "info" glyph in the same thin-line style as every other icon in the
// file: static by default, no continuous looping animation, with only a
// quiet color shift on hover so it doesn't compete for attention when
// several of these are on screen at once. Exported once here and imported
// wherever a flip hint is needed, so there's exactly one implementation to
// keep in sync — not a copy that can quietly drift or get regenerated back
// into an emoji in only one of the two files that used to define it locally.
export function HoverHintIcon({ size = 13 }: {size?: number;}) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0 text-muted-foreground/70 transition-colors group-hover:text-accent group-hover/tile:text-accent"
      style={{ width: size, height: size }}>

      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="5.1" r="0.9" fill="currentColor" />
        <path d="M8 7.6v3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>);

}

/* ------------------------------------------------------------------------
 * TileDemoCursor / useTileDemo
 * A one-time, self-playing demonstration: a small cursor icon slides onto a
 * tile, "clicks" it, holds while the tile's flipped face is visible, then
 * slides off — showing a first-time visitor exactly what "hover or tap"
 * means before they've tried it themselves, instead of relying on the
 * static hint icon/caption alone. Plays once per page load, only on one
 * representative tile (never on every tile at once — that would be the
 * "several things blinking on screen" problem, not a fix for it), and
 * cancels itself the moment a real visitor actually interacts with any
 * tile. Respects prefers-reduced-motion by skipping entirely.
 *
 * `useTileDemo(enabled)` owns the timing; each caller renders the cursor
 * itself (via `tileDemoCursorStyle`) only on the one tile it's demonstrating
 * on, and treats the tile as flipped whenever phase is 'pressing' or
 * 'holding'.
 * ---------------------------------------------------------------------- */

type TileDemoPhase = 'idle' | 'entering' | 'pressing' | 'holding' | 'leaving' | 'done';

export function useTileDemo(enabled: boolean) {
  const [phase, setPhase] = useState<TileDemoPhase>('idle');
  const startedRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancel = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    startedRef.current = true;
    setPhase('done');
  };

  useEffect(() => {
    if (!enabled || startedRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      startedRef.current = true;
      return;
    }
    startedRef.current = true;
    const schedule = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };
    schedule(() => setPhase('entering'), 900);
    schedule(() => setPhase('pressing'), 1400);
    schedule(() => setPhase('holding'), 1750);
    schedule(() => setPhase('leaving'), 3250);
    schedule(() => setPhase('done'), 3850);
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { phase, cancel, isFlipped: phase === 'pressing' || phase === 'holding' };
}

export function tileDemoCursorStyle(phase: TileDemoPhase): React.CSSProperties {
  const base: React.CSSProperties = { transition: 'opacity 480ms ease, transform 480ms cubic-bezier(0.22,0.9,0.32,1)' };
  if (phase === 'entering' || phase === 'holding') return { ...base, opacity: 1, transform: 'translate(0px,0px) scale(1)' };
  if (phase === 'pressing') return { ...base, opacity: 1, transform: 'translate(0px,0px) scale(0.8)' };
  if (phase === 'leaving') return { ...base, opacity: 0, transform: 'translate(16px,12px) scale(0.9)' };
  return { ...base, opacity: 0, transform: 'translate(34px,28px) scale(0.85)' };
}

export function GuideCursorIcon({ size = 30, pressed = false }: {size?: number;pressed?: boolean;}) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      {pressed &&
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ backgroundColor: 'var(--accent)', opacity: 0.4 }} />
      }
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="relative"
        style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}>

        <path
          d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
          fill="var(--accent)"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="1.2"
          strokeLinejoin="round" />

      </svg>
    </span>);

}

type GameRoleId = 'Students' | 'Mentors' | 'Parents' | 'Schools' | 'Counselors';

interface GameRoleInfo {
  id: GameRoleId;
  label: string;
}

// The same five roles as the sitewide `stakeholders`/`StakeholderIcon` set,
// so the game can reuse those icons instead of inventing a second visual
// language. "Students" is the one addition — letting the student play as
// themselves — which is why this stays a separate list from the sitewide one.
const GAME_ROLES: GameRoleInfo[] = [
{ id: 'Students', label: 'Student' },
{ id: 'Mentors', label: 'Mentors' },
{ id: 'Parents', label: 'Parents' },
{ id: 'Schools', label: 'Schools' },
{ id: 'Counselors', label: 'Counselors' }];


interface GameApproach {
  key: ApproachKey;
  action: string;
  insight: string;
}

interface GameScenario {
  pillarId: string;
  prompt: string;
  approaches: [GameApproach, GameApproach, GameApproach];
}

// Every role gets five real moments written from its own vantage point —
// not the same five situations reworded with different pronouns. The five
// pillar ids stay the same across roles (so the pillar strip lines up no
// matter which role is active), but the moment itself, and what each
// response style means inside it, is written fresh per role.
// Every grade band has its own five pillars (see `gradeBands` in siteConfig),
// and every role sees five real moments written from its own vantage point
// within that band — not the same situations reworded. Nested as
// [band id][role id] so switching either the grade band or the role just
// swaps which five-scenario list is showing.
const BAND_ROLE_SCENARIOS: Record<GradeBand['id'], Record<GameRoleId, GameScenario[]>> = {
  middle: {
    Students: [
    {
      pillarId: 'digital-wisdom',
      prompt: 'You ask an AI chatbot to write your entire homework assignment overnight.',
      approaches: [
      { key: 'stepIn', action: 'Redo it yourself before you submit it.', insight: "Fixes tonight, but skips the more useful part — actually practicing the skill." },
      { key: 'askGuide', action: 'Ask yourself what made finishing it honestly feel so hard.', insight: "That honest answer is usually more useful than the assignment itself." },
      { key: 'stepBack', action: 'Turn it in as-is and see what the feedback says.', insight: "You'll learn something either way — but only if you actually read the feedback." }]

    },
    {
      pillarId: 'inner-strength',
      prompt: "You get a poor grade on a test you studied hard for, and don't feel like talking about it.",
      approaches: [
      { key: 'stepIn', action: 'Go through the test and find exactly what went wrong.', insight: "Useful eventually — just notice if you're skipping past the disappointment to get there." },
      { key: 'askGuide', action: 'Name how you actually feel before you try to fix anything.', insight: "Sitting with disappointment on purpose is a real skill, not a delay tactic." },
      { key: 'stepBack', action: 'Take today off from thinking about it, on purpose.', insight: "Fine once — as long as you actually come back to it instead of just avoiding it." }]

    },
    {
      pillarId: 'personal-safety',
      prompt: "You mention an online friend you've never met who wants to video call.",
      approaches: [
      { key: 'stepIn', action: 'Loop someone else in before the first call.', insight: "Costs you nothing, and it's exactly what genuinely careful people do." },
      { key: 'askGuide', action: 'Ask yourself what you actually know about this person.', insight: "If you can't answer that clearly, that's usually the answer." },
      { key: 'stepBack', action: 'Trust your gut and just go for it.', insight: "Your gut is a good start — a second opinion is still worth thirty seconds." }]

    },
    {
      pillarId: 'leadership',
      prompt: "During a group project, you'd rather do the whole thing alone than work with classmates.",
      approaches: [
      { key: 'stepIn', action: 'Ask for one specific, defined role in the group.', insight: "Makes it feel manageable — a good first step, not a permanent workaround." },
      { key: 'askGuide', action: 'Ask yourself what about teamwork actually feels unreliable.', insight: "Usually it's not the group — it's trust, or not knowing how to delegate yet." },
      { key: 'stepBack', action: 'Go solo this once, but plan to try again next time.', insight: "One project alone is fine — just don't let it become the permanent plan." }]

    },
    {
      pillarId: 'self-identity',
      prompt: 'You feel like you don’t know what you’re "good at," compared to your friends.',
      approaches: [
      { key: 'stepIn', action: 'Ask someone close to you what they see in you.', insight: "A good start — the goal is eventually seeing it yourself too." },
      { key: 'askGuide', action: 'Ask yourself what you enjoy, skill aside.', insight: "Enjoyment tends to come before skill — that's actually where to start." },
      { key: 'stepBack', action: 'Let the comparison go, just this once.', insight: "Fine once — if it keeps coming back, it's worth actually sitting with." }]

    }],

    Mentors: [
    {
      pillarId: 'digital-wisdom',
      prompt: 'A mentee shows you an assignment they say an AI chatbot "helped a lot" with — and something about how smoothly it reads doesn’t sit right.',
      approaches: [
      { key: 'stepIn', action: 'Sit down and rebuild the assignment together from scratch.', insight: "Rebuilds the skill fast — just make sure it's their hand doing the work, not yours." },
      { key: 'askGuide', action: 'Ask them to explain their own reasoning behind a few lines, out loud.', insight: "If they can't explain it, that's the real diagnostic — not the polish of the writing." },
      { key: 'stepBack', action: 'Let it go this once and watch how the next unprompted assignment reads.', insight: "Buys you real information — but only if you actually follow up on what you see next time." }]

    },
    {
      pillarId: 'inner-strength',
      prompt: "A mentee who's usually open goes quiet halfway through a session, right after a hard topic comes up.",
      approaches: [
      { key: 'stepIn', action: 'Gently name what you noticed and ask if you should keep going.', insight: "Shows you're paying attention — just be ready to actually stop if they say so." },
      { key: 'askGuide', action: 'Sit in the quiet for a moment before saying anything at all.', insight: "The silence itself is often where the real work happens, not around it." },
      { key: 'stepBack', action: 'Move to something lighter and return to it next session instead.', insight: "Respects their pace — as long as you don't quietly let it drop for good." }]

    },
    {
      pillarId: 'personal-safety',
      prompt: "A mentee mentions, almost in passing, that they've been messaging an adult they met in an online gaming group.",
      approaches: [
      { key: 'stepIn', action: 'Ask directly who this person is and how the messaging started.', insight: "Direct is right here — a mentor's job includes noticing this out loud." },
      { key: 'askGuide', action: 'Ask what makes this relationship feel different from their other friendships.', insight: "Helps them build the judgment to spot this themselves next time, not just this once." },
      { key: 'stepBack', action: 'Make a mental note and see if it comes up again unprompted.', insight: "Risky as a first move — this is usually worth surfacing sooner, not waiting on." }]

    },
    {
      pillarId: 'leadership',
      prompt: 'In a session meant to build their confidence, a mentee keeps deferring every decision back to you instead of making the call themselves.',
      approaches: [
      { key: 'stepIn', action: 'Make the call for them this once, then talk about why.', insight: "Keeps momentum today, but watch that it doesn't become the pattern." },
      { key: 'askGuide', action: "Ask what they'd choose if you weren't in the room at all.", insight: "Separates what they actually think from what they assume you want to hear." },
      { key: 'stepBack', action: 'Let the decision sit unmade until they fill the silence.', insight: "Uncomfortable, but discomfort is often what finally prompts them to decide." }]

    },
    {
      pillarId: 'self-identity',
      prompt: 'A mentee tells you they only really feel good about themselves when they’re achieving something — never just as they are.',
      approaches: [
      { key: 'stepIn', action: 'Point out something you value in them that has nothing to do with achievement.', insight: "A generous, useful start — though it lands more if they eventually notice it themselves." },
      { key: 'askGuide', action: "Ask what they'd still be proud of if no one else ever found out.", insight: "Gets underneath performance to something that's actually theirs." },
      { key: 'stepBack', action: "Let the comment pass and watch whether it's a pattern or a one-off.", insight: "Reasonable once — repeated, it's worth naming directly rather than tracking quietly." }]

    }],

    Parents: [
    {
      pillarId: 'digital-wisdom',
      prompt: 'Your child asks an AI chatbot for advice about a friendship problem instead of coming to you.',
      approaches: [
      { key: 'stepIn', action: 'Bring it up directly and offer your own take on the situation.', insight: "Shows you're available — just watch that it doesn't read as taking over the problem." },
      { key: 'askGuide', action: 'Ask what the chatbot said, and what they thought of its advice.', insight: "Keeps you in the loop without making them feel caught for not asking you first." },
      { key: 'stepBack', action: 'Let them work through it their way, and stay quietly available.', insight: "Respects their independence — as long as 'available' is genuinely felt, not just assumed." }]

    },
    {
      pillarId: 'inner-strength',
      prompt: 'Your child comes home with a poor grade they studied hard for, and shuts the conversation down before it starts.',
      approaches: [
      { key: 'stepIn', action: 'Sit with them and go through the test together, right then.', insight: "Well-intentioned, but pushing before they're ready can shut the door further." },
      { key: 'askGuide', action: 'Ask how they are feeling before asking anything about the test itself.', insight: "Naming the feeling first is usually what actually opens the conversation back up." },
      { key: 'stepBack', action: 'Give it the evening, and check in again once things have settled.', insight: "Often exactly right — just make sure the check-in actually happens." }]

    },
    {
      pillarId: 'personal-safety',
      prompt: "You notice your child has been video-calling someone from an online game you'd never heard them mention before.",
      approaches: [
      { key: 'stepIn', action: 'Ask directly who this is and sit in on the next call together.', insight: "Removes today's uncertainty — the goal is understanding, not confiscation." },
      { key: 'askGuide', action: 'Ask what they know about this person and how the friendship started.', insight: "Builds the judgment they'll need for the times you're not in the room." },
      { key: 'stepBack', action: 'Say nothing for now and see if they mention it themselves.', insight: "Most online friendships are harmless, but this is exactly the kind of moment worth not letting slide." }]

    },
    {
      pillarId: 'leadership',
      prompt: "Your child says they'd rather do a group project entirely alone than deal with classmates.",
      approaches: [
      { key: 'stepIn', action: 'Call the teacher and ask for them to be reassigned individually.', insight: "Solves this project — but skips the harder, more useful conversation underneath." },
      { key: 'askGuide', action: 'Ask what about working with these classmates feels unreliable.', insight: "Usually surfaces a trust or delegation issue that's worth knowing about either way." },
      { key: 'stepBack', action: 'Let them handle it their way and see how the project goes.', insight: "A reasonable stretch of independence — just worth a real debrief once it's done." }]

    },
    {
      pillarId: 'self-identity',
      prompt: 'Your child keeps comparing themselves to a friend who "has it all figured out," and it’s starting to sound less like a phase.',
      approaches: [
      { key: 'stepIn', action: 'Tell them directly what you see in them that this friend does not have.', insight: "Comes from love, but a strength they discover tends to land deeper than one they're handed." },
      { key: 'askGuide', action: 'Ask what specifically about this friend feels like "figured out" to them.', insight: "Often the real issue is one specific thing, not a wholesale gap between them." },
      { key: 'stepBack', action: 'Let the comment go this time without addressing it directly.', insight: "Fine as a one-off — if it becomes a pattern, it's worth naming rather than tracking silently." }]

    }],

    Schools: [
    {
      pillarId: 'digital-wisdom',
      prompt: "Several teachers separately flag a rise in AI-written homework this term, and your school doesn't have a shared stance on it yet.",
      approaches: [
      { key: 'stepIn', action: 'Draft a clear school-wide AI use policy and roll it out this term.', insight: "Solves the ambiguity fast — just be sure teachers and students both understand the reasoning, not just the rule." },
      { key: 'askGuide', action: 'Bring teachers together first to compare what they are actually seeing.', insight: "A shared policy built from real classroom patterns tends to hold up better than one written in the abstract." },
      { key: 'stepBack', action: 'Let individual teachers keep handling it case by case for now.', insight: "Reasonable short-term, but the inconsistency itself becomes the problem the longer it continues." }]

    },
    {
      pillarId: 'inner-strength',
      prompt: "A teacher notices a normally engaged student has gone quiet in class for two weeks straight, and isn't sure whether it's worth involving the counselor yet.",
      approaches: [
      { key: 'stepIn', action: 'Loop the counselor in now, before it becomes a bigger concern.', insight: "Costs little and catches things early — the downside risk here is genuinely small." },
      { key: 'askGuide', action: 'Have the teacher check in directly with the student first.', insight: "Often surfaces enough context to know whether escalation is actually needed." },
      { key: 'stepBack', action: 'Keep watching for now and revisit if the pattern continues.', insight: "Fine briefly — just set an actual date to revisit, not an open-ended 'keep an eye on it.'" }]

    },
    {
      pillarId: 'personal-safety',
      prompt: "A parent calls, concerned their child has been contacted by a stranger online, and asks what your school's actual policy is.",
      approaches: [
      { key: 'stepIn', action: 'Walk the parent through your existing policy and safeguards directly.', insight: "Reassures this parent today — just make sure the policy you're describing is actually solid, not improvised." },
      { key: 'askGuide', action: 'Ask the parent what specifically happened before responding with policy.', insight: "The details often change what the right response actually is." },
      { key: 'stepBack', action: 'Point them to the general handbook section and move on.', insight: "Feels efficient, but a concerned parent usually needs a real conversation, not a document link." }]

    },
    {
      pillarId: 'leadership',
      prompt: 'Group projects across a grade keep splitting into "the kid who does everything" and the kids who coast, and a teacher raises it at a staff meeting.',
      approaches: [
      { key: 'stepIn', action: 'Set a school-wide rubric that grades individual contribution, not just group output.', insight: "Addresses it structurally — just make sure teachers have the support to actually implement it." },
      { key: 'askGuide', action: 'Ask a few teachers what is actually driving the pattern in their classrooms.', insight: "The cause is often different by classroom — worth knowing before applying one fix everywhere." },
      { key: 'stepBack', action: "Leave it to individual teachers' discretion for now.", insight: "Fine if it's genuinely rare — worth revisiting once it's clearly a pattern, not an exception." }]

    },
    {
      pillarId: 'self-identity',
      prompt: "Exam results week reliably brings a spike in counselor visits, and you're deciding whether that's worth getting ahead of structurally.",
      approaches: [
      { key: 'stepIn', action: 'Add extra counselor availability during exam weeks going forward.', insight: "Directly addresses the spike — just make sure it's paired with why the spike happens, not only the symptom." },
      { key: 'askGuide', action: 'Ask the counseling team what students actually raise most during that week.', insight: "Tells you whether this is about the exams themselves or something exam week just surfaces." },
      { key: 'stepBack', action: 'Treat it as a normal seasonal pattern and leave it as-is.', insight: "Understandable if resources are tight — but a predictable spike is usually worth planning for on purpose." }]

    }],

    Counselors: [
    {
      pillarId: 'digital-wisdom',
      prompt: 'A student mentions using an AI chatbot "to vent" most nights — more than they talk to any person about how they are feeling.',
      approaches: [
      { key: 'stepIn', action: 'Ask directly what they get from the chatbot that they do not from people.', insight: "Gets at the real gap without making the chatbot itself the enemy." },
      { key: 'askGuide', action: 'Ask what it would take for a person to feel as safe to talk to as the chatbot does.', insight: "Turns the observation into something they can actually work toward." },
      { key: 'stepBack', action: 'Note it for now and see if it comes up again in future sessions.', insight: "Worth returning to soon — this kind of substitution rarely resolves on its own." }]

    },
    {
      pillarId: 'inner-strength',
      prompt: 'A student waves off a genuinely difficult situation at home with "it’s fine, it’s not a big deal," in a tone that doesn’t quite match the words.',
      approaches: [
      { key: 'stepIn', action: 'Gently name the mismatch between their words and their tone.', insight: "Direct, but said with care — this is often exactly the door someone's waiting for." },
      { key: 'askGuide', action: "Ask what 'fine' actually means to them in this situation.", insight: "Gives them a way to say more without having to abandon 'fine' outright." },
      { key: 'stepBack', action: 'Let it stand for now and leave the door open for later.', insight: "Reasonable once — just make sure they know the door is genuinely still open." }]

    },
    {
      pillarId: 'personal-safety',
      prompt: "A student discloses an online relationship with someone they've never met, and asks you not to tell their parents.",
      approaches: [
      { key: 'stepIn', action: 'Explain clearly, now, what you can and cannot keep confidential here.', insight: "Uncomfortable in the moment, but trust holds up better when the limits are honest upfront." },
      { key: 'askGuide', action: 'Ask what they are most afraid will happen if their parents find out.', insight: "Often reveals the real issue is the fear, not necessarily the relationship itself." },
      { key: 'stepBack', action: 'Agree to hold it for now while you learn more about the situation.', insight: "Risky as a standing position — this is usually a case where the limits need to be named, not deferred." }]

    },
    {
      pillarId: 'leadership',
      prompt: 'A student says they have stopped raising their hand in group settings entirely, "so no one expects anything from me."',
      approaches: [
      { key: 'stepIn', action: "Ask them directly what 'nothing expected of me' feels like right now.", insight: "Names the real fear underneath the behavior instead of just the behavior itself." },
      { key: 'askGuide', action: 'Ask when they last felt like expectations were fair rather than too much.', insight: "Helps locate whether this is about fear of failure or fear of being seen at all." },
      { key: 'stepBack', action: 'Let them stay quiet in groups for now without pushing it.', insight: "Fine short-term — but withdrawal like this tends to deepen the longer it goes unaddressed." }]

    },
    {
      pillarId: 'self-identity',
      prompt: 'A student describes themselves almost entirely in terms of grades and rank, with nothing else volunteered when you ask what else matters to them.',
      approaches: [
      { key: 'stepIn', action: 'Ask them directly to describe themselves without mentioning school at all.', insight: "Puts the gap right in front of them — some students find this genuinely hard to do." },
      { key: 'askGuide', action: 'Ask what they think their friends would say about them, unprompted.', insight: "Borrowing someone else's view of them can be an easier way in than asking directly." },
      { key: 'stepBack', action: 'Let the answer stand for now and revisit the question another time.', insight: "Fine as a single data point — worth returning to if it's still the only answer next time." }]

    }]

  },

  board: {
    Students: [
    {
      pillarId: 'exam-resilience',
      prompt: 'You get back a board-exam mock test score far below what you expected, and it feels like it says something about who you are.',
      approaches: [
      { key: 'stepIn', action: 'Go through the paper right away and mark every mistake.', insight: "Useful information — just notice if you're skipping the sting to get straight to the fixing." },
      { key: 'askGuide', action: 'Ask yourself whether this score is a fact about your effort or a verdict on your worth.', insight: "That distinction is exactly what this pillar is built around." },
      { key: 'stepBack', action: 'Put the paper away for a day before looking at it again.', insight: "Fine once — just make sure you actually come back to it with a clear head, not avoidance." }]

    },
    {
      pillarId: 'stream-discovery',
      prompt: "You're picking a stream mostly because your best friend is picking it too.",
      approaches: [
      { key: 'stepIn', action: 'List what you are actually good at and enjoy, separate from anyone else.', insight: "A solid first pass — the harder part is trusting the list once it's in front of you." },
      { key: 'askGuide', action: "Ask yourself what you'd choose if no one else's choice existed at all.", insight: "Removing the comparison is usually the fastest way to hear your own answer." },
      { key: 'stepBack', action: 'Go with the friend-group choice for now and see how it feels.', insight: "Risky here — a stream choice is one of the harder ones to casually reverse later." }]

    },
    {
      pillarId: 'peer-navigation',
      prompt: 'A friend keeps putting you down in front of others and calling it a joke.',
      approaches: [
      { key: 'stepIn', action: "Tell them directly, next time it happens, that it's not landing as a joke.", insight: "Direct and reasonable — just expect some pushback the first time you say it." },
      { key: 'askGuide', action: 'Ask yourself what you actually want from this friendship going forward.', insight: "Knowing that first makes the harder conversation much clearer when you have it." },
      { key: 'stepBack', action: 'Let it go and hope it stops on its own.', insight: "Rarely works on its own — 'jokes' like this usually need to be named to actually stop." }]

    },
    {
      pillarId: 'digital-self-discovery',
      prompt: 'You catch yourself editing a photo for the fifth time before posting it, and it starts to feel less like fun and more like pressure.',
      approaches: [
      { key: 'stepIn', action: 'Post the unedited version instead, just to see how it feels.', insight: "A small, real experiment — worth noticing what actually happens versus what you feared." },
      { key: 'askGuide', action: "Ask yourself who you're actually trying to look good for right now.", insight: "Usually reveals whether this is about you or about someone specific watching." },
      { key: 'stepBack', action: "Keep editing as usual — it's not hurting anyone.", insight: "True in the short term — worth revisiting if the time spent keeps creeping up." }]

    },
    {
      pillarId: 'generation-gap',
      prompt: "You've stopped telling your parents what's actually going on at school because it feels pointless to explain.",
      approaches: [
      { key: 'stepIn', action: 'Sit down and try to explain one real thing to them this week.', insight: "Braver than it sounds — the first attempt is usually the hardest one." },
      { key: 'askGuide', action: 'Ask yourself what specifically makes it feel pointless to tell them.', insight: "Often it's not that they wouldn't care — it's that you doubt they'd understand, which is a different problem." },
      { key: 'stepBack', action: 'Keep things surface-level with them for now.', insight: "Understandable short-term — just know the distance tends to grow the longer it's the default." }]

    }],

    Mentors: [
    {
      pillarId: 'exam-resilience',
      prompt: 'A student you mentor gets a mock exam score far below what they hoped for, right before the real thing.',
      approaches: [
      { key: 'stepIn', action: 'Go through the paper with them and build a plan for the gaps.', insight: "Useful and concrete — just make room for how they're feeling before diving into the plan." },
      { key: 'askGuide', action: 'Ask them what this score feels like it says about them, before talking strategy.', insight: "Separating the feeling from the fixing is exactly the skill this pillar is about." },
      { key: 'stepBack', action: 'Give them space today and revisit the paper tomorrow.', insight: "Reasonable — just don't let 'tomorrow' quietly become 'never.'" }]

    },
    {
      pillarId: 'stream-discovery',
      prompt: "A student tells you they're choosing a stream mainly because their parents expect it, not because they want it.",
      approaches: [
      { key: 'stepIn', action: "Help them build a case for what they'd choose instead, to bring to their parents.", insight: "Useful groundwork — just make sure it's genuinely their case, not one you've built for them." },
      { key: 'askGuide', action: "Ask what they'd choose if their parents' opinion didn't exist at all.", insight: "Gets at their real answer before the family conversation even happens." },
      { key: 'stepBack', action: 'Let them make the family-pleasing choice and revisit it later.', insight: "Sometimes the reality — just make sure 'later' is a real conversation, not just a hope." }]

    },
    {
      pillarId: 'peer-navigation',
      prompt: 'A student mentions, almost as a throwaway line, that a friend group has started leaving them out.',
      approaches: [
      { key: 'stepIn', action: 'Ask directly how long this has been going on and how they are doing with it.', insight: "Shows you noticed — just be ready for them to not want to say much at first." },
      { key: 'askGuide', action: 'Ask what they think is actually going on with the group.', insight: "Their own read on it often matters more than yours here." },
      { key: 'stepBack', action: "Let them bring it up again if it's still bothering them.", insight: "Risky — social exclusion at this age rarely resolves by waiting it out." }]

    },
    {
      pillarId: 'digital-self-discovery',
      prompt: "A student mentions spending hours getting a single photo 'right' before posting it.",
      approaches: [
      { key: 'stepIn', action: 'Point out directly how much time that actually adds up to.', insight: "Can land as judgment — worth pairing with genuine curiosity, not just a fact." },
      { key: 'askGuide', action: 'Ask what they think would happen if they posted something unedited.', insight: "Their answer usually reveals the actual fear driving the habit." },
      { key: 'stepBack', action: "Let it go — it's a pretty normal habit at this age.", insight: "True to a point — worth a second look if it starts crowding out other things." }]

    },
    {
      pillarId: 'generation-gap',
      prompt: "A student tells you they've basically stopped talking to their parents about anything real.",
      approaches: [
      { key: 'stepIn', action: "Offer to help them plan out what they'd actually want to say.", insight: "Useful scaffolding — the goal is still them having the conversation, not you having it." },
      { key: 'askGuide', action: 'Ask what they think would happen if they tried telling their parents the truth.', insight: "Usually surfaces a specific fear worth naming directly, not just a vague sense of distance." },
      { key: 'stepBack', action: "Leave it alone — it's normal for teenagers to pull back a bit.", insight: "Some distance is normal — total silence on real things is usually worth a gentle nudge." }]

    }],

    Parents: [
    {
      pillarId: 'exam-resilience',
      prompt: 'Your child comes home devastated after a mock exam score far below what they expected.',
      approaches: [
      { key: 'stepIn', action: 'Sit down immediately and start planning how to improve the score.', insight: "Well-meaning, but jumping straight to a plan can skip past how upset they actually are." },
      { key: 'askGuide', action: 'Ask how they are feeling about it before talking about the number itself.', insight: "Naming the feeling first is what actually helps them separate the score from their worth." },
      { key: 'stepBack', action: 'Give them the evening before bringing it up again.', insight: "Often right — just make sure you do circle back, rather than letting it quietly drop." }]

    },
    {
      pillarId: 'stream-discovery',
      prompt: 'Your child seems to be choosing a stream mainly to match what you and your spouse expect.',
      approaches: [
      { key: 'stepIn', action: 'Tell them directly that you want them to choose based on what they want.', insight: "A generous and important thing to say — just watch that it doesn't feel like pressure in the other direction." },
      { key: 'askGuide', action: "Ask what they'd choose if you had no opinion on it at all.", insight: "Removes your influence from the equation long enough to hear their real answer." },
      { key: 'stepBack', action: 'Let them go with the expected choice without raising it.', insight: "Risky — a stream choice made purely to please you is a hard thing to quietly reverse later." }]

    },
    {
      pillarId: 'peer-navigation',
      prompt: 'You notice your child has gone quiet about a friend group they used to talk about constantly.',
      approaches: [
      { key: 'stepIn', action: 'Ask directly what happened with that friend group.', insight: "Direct is fine here — just be ready for a short answer at first, and don't push past it." },
      { key: 'askGuide', action: 'Ask how they are feeling about their friendships generally right now.', insight: "A wider, softer question often gets further than asking about one specific group." },
      { key: 'stepBack', action: 'Wait for them to bring it up on their own.', insight: "Understandable, but this kind of quiet often needs an opening, not just patience." }]

    },
    {
      pillarId: 'digital-self-discovery',
      prompt: 'You notice your child spends a long time perfecting a photo before posting it, more than seems relaxed or fun.',
      approaches: [
      { key: 'stepIn', action: "Bring it up directly and ask what's behind the amount of time it takes.", insight: "Direct and reasonable — just frame it as curiosity, not criticism, so they don't just shut down." },
      { key: 'askGuide', action: "Ask what they think people are actually judging when they look at their posts.", insight: "Gets at the belief driving the behavior, not just the behavior itself." },
      { key: 'stepBack', action: "Say nothing — it's a common habit at this age.", insight: "Mostly true — worth revisiting if it starts to visibly affect their mood or time." }]

    },
    {
      pillarId: 'generation-gap',
      prompt: 'Your child has clearly stopped telling you what is actually going on, and conversations stay surface-level.',
      approaches: [
      { key: 'stepIn', action: "Ask them directly why they've stopped sharing more with you.", insight: "Honest, but can land as pressure — be ready for a defensive first answer." },
      { key: 'askGuide', action: 'Ask what would make it feel worth telling you things again.', insight: "Puts the fix in their hands, which tends to get a more honest answer." },
      { key: 'stepBack', action: 'Let the distance be normal teenage behavior and not push it.', insight: "Some distance is developmentally normal — total silence on real things is worth gently naming." }]

    }],

    Schools: [
    {
      pillarId: 'exam-resilience',
      prompt: 'Mock exam results come out, and the counseling team notices a sharp jump in anxiety-related visits right after.',
      approaches: [
      { key: 'stepIn', action: 'Add structured post-result support sessions for the whole grade immediately.', insight: "Addresses this cycle directly — just make sure it's not framed as remedial, which can stigmatize it." },
      { key: 'askGuide', action: 'Ask the counseling team what students are actually saying drives the anxiety.', insight: "Tells you whether it's the result itself or how results are handled and discussed at school." },
      { key: 'stepBack', action: 'Treat it as a normal, expected reaction to board pressure.', insight: "Understandable, but a predictable spike like this is usually worth planning for on purpose." }]

    },
    {
      pillarId: 'stream-discovery',
      prompt: 'Multiple students report choosing a stream under heavy pressure from family, with little real guidance from school first.',
      approaches: [
      { key: 'stepIn', action: 'Roll out mandatory stream-counseling sessions before the choice is finalized.', insight: "Directly closes the gap — just make sure it's substantive, not a single rushed session." },
      { key: 'askGuide', action: 'Ask a sample of students what would have actually helped them decide.', insight: "Their answer often points to something more specific than 'more counseling.'" },
      { key: 'stepBack', action: 'Leave stream choice entirely to families, as has been done before.', insight: "Reasonable if resources are tight — but this is exactly where foreclosure risk is highest without support." }]

    },
    {
      pillarId: 'peer-navigation',
      prompt: 'Teachers report a rise in subtle social exclusion — group chats, seating, and group work quietly leaving certain students out.',
      approaches: [
      { key: 'stepIn', action: 'Set a clear school policy on inclusive group formation for all group work.', insight: "A real structural fix — just make sure teachers have the training to actually apply it well." },
      { key: 'askGuide', action: 'Ask homeroom teachers which students they are most concerned about, and why.', insight: "Often surfaces the real pattern faster than a policy written from the top down." },
      { key: 'stepBack', action: 'Leave it to individual teachers to manage as they see it.', insight: "Fine if it's rare — worth a structural look once several teachers flag the same pattern." }]

    },
    {
      pillarId: 'digital-self-discovery',
      prompt: 'A parent raises a concern that students seem increasingly anxious about their social media image, and asks if the school addresses this.',
      approaches: [
      { key: 'stepIn', action: 'Add media literacy and digital self-image sessions to the curriculum this term.', insight: "Directly responsive — just make sure it doesn't read as another lecture students tune out." },
      { key: 'askGuide', action: 'Ask students directly, through the counseling team, what is actually driving that anxiety.', insight: "Their answer shapes what kind of session would actually land, rather than guessing." },
      { key: 'stepBack', action: "Note the concern but leave it outside the school's current scope.", insight: "Understandable given competing priorities — but this is a pattern likely to keep surfacing." }]

    },
    {
      pillarId: 'generation-gap',
      prompt: 'Several parents mention, separately, that their teenagers have stopped telling them much of anything real.',
      approaches: [
      { key: 'stepIn', action: 'Offer a parent workshop on communicating with teenagers this term.', insight: "A concrete, useful step — just be sure it's framed as a two-way skill, not a parenting deficiency." },
      { key: 'askGuide', action: 'Ask the counseling team what students say makes it hard to talk to their parents.', insight: "Gives you the student side of the gap, not just the parent side, before designing anything." },
      { key: 'stepBack', action: "Treat it as a normal part of adolescence outside the school's role.", insight: "Partly true — but the school is often well placed to open this channel where a family alone can't." }]

    }],

    Counselors: [
    {
      pillarId: 'exam-resilience',
      prompt: 'A student breaks down over a mock exam score and says they feel like a failure.',
      approaches: [
      { key: 'stepIn', action: 'Help them build a concrete study plan for the next attempt right away.', insight: "Useful eventually — just make room for the feeling first, or the plan won't really land." },
      { key: 'askGuide', action: "Ask what 'failure' means to them in this specific moment.", insight: "Usually reveals the belief underneath the score, which is the real thing worth addressing." },
      { key: 'stepBack', action: 'Let them sit with the disappointment before addressing it directly.', insight: "Reasonable briefly — just make sure you do return to it, not leave it unaddressed." }]

    },
    {
      pillarId: 'stream-discovery',
      prompt: "A student says they're choosing a stream 'because it's what's expected,' with visible resignation.",
      approaches: [
      { key: 'stepIn', action: 'Walk them through the other options directly, right in the session.', insight: "Useful information — just don't let it turn into you deciding for them either." },
      { key: 'askGuide', action: "Ask what they'd choose if expectations weren't part of the equation.", insight: "Gets underneath the resignation to what they might actually want." },
      { key: 'stepBack', action: 'Let the decision stand and revisit it after it is finalized.', insight: "Risky — this is close to the last real window before the choice becomes hard to undo." }]

    },
    {
      pillarId: 'peer-navigation',
      prompt: "A student describes being excluded by a friend group but insists it's 'not a big deal.'",
      approaches: [
      { key: 'stepIn', action: 'Name directly that exclusion like this usually does matter, whatever they are saying.', insight: "Validates what they might not feel able to say themselves — worth doing gently." },
      { key: 'askGuide', action: "Ask what 'not a big deal' would look like if it were actually true for them.", insight: "Often reveals the gap between what they're saying and what they're feeling." },
      { key: 'stepBack', action: 'Take them at their word and move on for now.', insight: "Risky — 'not a big deal' at this age is often exactly the opposite." }]

    },
    {
      pillarId: 'digital-self-discovery',
      prompt: 'A student describes real anxiety about how they look in photos before posting, more than they show about anything else.',
      approaches: [
      { key: 'stepIn', action: 'Address the anxiety directly as its own topic worth focused attention.', insight: "Reasonable — just make sure it doesn't feel like their concern is being treated as trivial by contrast." },
      { key: 'askGuide', action: "Ask what they imagine happens if a photo doesn't get the response they hoped for.", insight: "Usually surfaces the belief about worth that's actually driving the anxiety." },
      { key: 'stepBack', action: 'Note it and see if it comes up again unprompted.', insight: "Worth returning to soon — this kind of image-anxiety rarely resolves quietly on its own." }]

    },
    {
      pillarId: 'generation-gap',
      prompt: 'A student says there is no point talking to their parents because they would not understand anyway.',
      approaches: [
      { key: 'stepIn', action: 'Help them plan one specific thing to try telling their parents this week.', insight: "Concrete and useful — just keep it their plan, not a script you hand them." },
      { key: 'askGuide', action: "Ask what makes them so sure their parents wouldn't understand.", insight: "Often reveals an assumption worth testing, not necessarily a settled fact." },
      { key: 'stepBack', action: "Leave the family relationship outside the session's focus for now.", insight: "Fine short-term — but this gap is often exactly where the most protective support lives." }]

    }]

  },

  senior: {
    Students: [
    {
      pillarId: 'performance-pressure',
      prompt: "You're a week from a major entrance exam, and the fear of not qualifying is all you can think about.",
      approaches: [
      { key: 'stepIn', action: 'Cram every remaining hour on practice papers.', insight: "Feels productive, but exhaustion this close to the exam can cost you more than it gains." },
      { key: 'askGuide', action: "Ask yourself what you'd still be if this exam didn't go the way you want.", insight: "Getting a real answer to that is what actually protects you from the pressure, not more studying." },
      { key: 'stepBack', action: 'Take a full day off to reset before the final stretch.', insight: "Can genuinely help — just make sure it's rest, not avoidance dressed up as rest." }]

    },
    {
      pillarId: 'interpersonal-bonds',
      prompt: 'You are in your first serious relationship, and you notice your mood now depends heavily on how it is going.',
      approaches: [
      { key: 'stepIn', action: 'Talk to your partner directly about how much this is affecting you.', insight: "A real step toward a healthier dynamic — just make sure it's a conversation, not an accusation." },
      { key: 'askGuide', action: 'Ask yourself what you liked about yourself before this relationship started.', insight: "Reconnecting with that is usually the actual fix, more than anything about the relationship itself." },
      { key: 'stepBack', action: "Let it be for now — it's normal to feel intensely at this age.", insight: "Partly true — worth watching if your sense of self keeps shrinking around it." }]

    },
    {
      pillarId: 'independence',
      prompt: "You're heading to college soon and realize you don't actually know how to manage your own money or time without someone reminding you.",
      approaches: [
      { key: 'stepIn', action: 'Ask a parent to walk you through a real budget and schedule right now.', insight: "A solid, concrete start — the goal from here is doing it yourself sooner rather than later." },
      { key: 'askGuide', action: 'Ask yourself which specific skill worries you most, and why.', insight: "Naming the actual gap is more useful than a vague sense of being unready." },
      { key: 'stepBack', action: "Figure it out once you're actually there.", insight: "Some things you will — just know the learning curve is steeper alone than it needs to be." }]

    },
    {
      pillarId: 'peer-pressure-manipulation',
      prompt: "At a party, a friend keeps pushing you to try something you're not comfortable with, framing it as 'everyone does this.'",
      approaches: [
      { key: 'stepIn', action: 'Say no directly and leave if they keep pushing.', insight: "Clear and safe — the discomfort of saying it is smaller than it feels in the moment." },
      { key: 'askGuide', action: "Ask yourself whether 'everyone does this' is even true, or just what it feels like right now.", insight: "That line rarely holds up once you actually look at it." },
      { key: 'stepBack', action: 'Go along with it this once to avoid the tension.', insight: "This is exactly the kind of moment worth not going along with, even once." }]

    },
    {
      pillarId: 'resilience-rejection',
      prompt: "You don't get into the college you'd built your whole plan around.",
      approaches: [
      { key: 'stepIn', action: 'Immediately start researching every backup option available.', insight: "Useful eventually — just notice if you're using it to avoid feeling the disappointment first." },
      { key: 'askGuide', action: 'Ask yourself what this rejection does and does not actually say about you.', insight: "Separating the two is the real work of getting through this well." },
      { key: 'stepBack', action: 'Take real time before deciding anything about what is next.', insight: "Reasonable — just set a point where you do come back and start deciding again." }]

    }],

    Mentors: [
    {
      pillarId: 'performance-pressure',
      prompt: "A mentee tells you they can't think about anything except qualifying their entrance exam.",
      approaches: [
      { key: 'stepIn', action: 'Help them build a structured plan for the remaining time.', insight: "Useful — just make room for the fear itself before jumping to logistics." },
      { key: 'askGuide', action: "Ask what they're afraid it would mean about them if they didn't qualify.", insight: "That fear is usually the real thing to work with, not the exam itself." },
      { key: 'stepBack', action: 'Let them work through it on their own for now.', insight: "Risky at this intensity — this is usually a moment that benefits from you staying close." }]

    },
    {
      pillarId: 'interpersonal-bonds',
      prompt: "A mentee's mood has started tracking almost exactly with how their relationship is going that week.",
      approaches: [
      { key: 'stepIn', action: "Name directly what you've noticed about the pattern.", insight: "Can land well if said with care — risky if it feels like judgment of the relationship itself." },
      { key: 'askGuide', action: 'Ask what they liked about themselves before this relationship began.', insight: "Helps them find footing that doesn't depend on someone else's mood." },
      { key: 'stepBack', action: "Let it play out — it's a normal part of a first serious relationship.", insight: "Partly true — worth revisiting if their sense of self keeps shrinking around it." }]

    },
    {
      pillarId: 'independence',
      prompt: "A mentee heading to college admits they've never managed their own time or money without a parent stepping in.",
      approaches: [
      { key: 'stepIn', action: 'Walk them through a real budget and weekly schedule together.', insight: "Concrete and useful — the goal is them running it themselves soon after." },
      { key: 'askGuide', action: 'Ask which part of independence worries them most, specifically.', insight: "A specific fear is much easier to actually prepare for than a general one." },
      { key: 'stepBack', action: "Trust they'll figure it out once they're there.", insight: "Some of it they will — just know the first months are harder without any groundwork at all." }]

    },
    {
      pillarId: 'peer-pressure-manipulation',
      prompt: 'A mentee mentions, casually, being pressured at parties to try things they are not comfortable with.',
      approaches: [
      { key: 'stepIn', action: 'Talk through exactly what to say and do in that moment, concretely.', insight: "Practical and useful — rehearsing the actual words tends to help more than general advice." },
      { key: 'askGuide', action: 'Ask what makes it hard to say no in that specific group.', insight: "Usually reveals whether this is about the substance or about belonging — different problems." },
      { key: 'stepBack', action: 'Trust their judgment and not bring it up again.', insight: "Risky to leave unaddressed — this is exactly the kind of pressure worth naming directly." }]

    },
    {
      pillarId: 'resilience-rejection',
      prompt: "A mentee doesn't get into the college they'd built their entire plan around, and seems to be spiraling.",
      approaches: [
      { key: 'stepIn', action: 'Help them map out every backup option immediately.', insight: "Useful eventually — just don't let it skip past actually acknowledging how much this hurts." },
      { key: 'askGuide', action: 'Ask what this rejection feels like it says about them.', insight: "Getting that belief out in the open is the real work here, more than the logistics." },
      { key: 'stepBack', action: 'Give them space and check in again in a few days.', insight: "Reasonable — just make sure the check-in is a firm plan, not a vague intention." }]

    }],

    Parents: [
    {
      pillarId: 'performance-pressure',
      prompt: 'Your child is a week from a major entrance exam and seems consumed by fear of not qualifying.',
      approaches: [
      { key: 'stepIn', action: 'Take over managing their schedule to maximize remaining study time.', insight: "Comes from care, but taking over can add pressure instead of relieving it." },
      { key: 'askGuide', action: "Ask them what they're most afraid this exam will mean about them.", insight: "Naming that fear out loud often does more than any amount of extra studying." },
      { key: 'stepBack', action: 'Step back and let them manage this final stretch themselves.', insight: "Can be right — just stay genuinely available rather than fully hands-off." }]

    },
    {
      pillarId: 'interpersonal-bonds',
      prompt: "Your child's mood seems to rise and fall almost entirely with how their relationship is going.",
      approaches: [
      { key: 'stepIn', action: "Tell them directly you're worried about how much this relationship affects their mood.", insight: "Comes from love — just expect it to land better as concern than as criticism." },
      { key: 'askGuide', action: 'Ask what they liked about themselves before this relationship started.', insight: "Helps them reconnect with a sense of self that isn't tied to someone else's mood." },
      { key: 'stepBack', action: "Say nothing — it's a normal part of first relationships.", insight: "Partly true — worth a gentle word if it doesn't seem to level out over time." }]

    },
    {
      pillarId: 'independence',
      prompt: 'Your child is about to leave for college and clearly does not know how to manage money or time without you reminding them.',
      approaches: [
      { key: 'stepIn', action: 'Sit down and teach them a real budget and schedule before they go.', insight: "A genuinely useful gift — just leave room for them to run it themselves once they're there." },
      { key: 'askGuide', action: 'Ask them which part of being on their own worries them most.', insight: "A specific worry is much easier to actually prepare for together." },
      { key: 'stepBack', action: "Let them learn it the hard way once they're there.", insight: "Some lessons do stick better that way — just know the first stretch will be harder without any groundwork." }]

    },
    {
      pillarId: 'peer-pressure-manipulation',
      prompt: 'You overhear that your child has been pressured at parties to try things they were not comfortable with.',
      approaches: [
      { key: 'stepIn', action: 'Sit them down and have a direct conversation about it tonight.', insight: "Reasonable — just aim for a conversation, not an interrogation, or they may shut down." },
      { key: 'askGuide', action: 'Ask them how they actually handled it in the moment.', insight: "Lets you find out what they already know how to do, not just what you assume they don't." },
      { key: 'stepBack', action: 'Say nothing and trust they can handle it.', insight: "Risky to leave fully unaddressed — this is exactly the kind of moment worth checking in on directly." }]

    },
    {
      pillarId: 'resilience-rejection',
      prompt: "Your child doesn't get into the college they'd built their whole plan around, and seems to be taking it very hard.",
      approaches: [
      { key: 'stepIn', action: 'Start researching backup options with them immediately.', insight: "Useful eventually — just don't let it skip past letting them actually feel the disappointment first." },
      { key: 'askGuide', action: 'Ask them what this rejection feels like it says about them.', insight: "Getting that belief into the open matters more right now than the next plan." },
      { key: 'stepBack', action: 'Give them space and let them come to you when ready.', insight: "Reasonable — just make sure you do check back in, rather than waiting indefinitely." }]

    }],

    Schools: [
    {
      pillarId: 'performance-pressure',
      prompt: 'As entrance exams approach, the counseling team reports a sharp rise in acute anxiety cases among senior students.',
      approaches: [
      { key: 'stepIn', action: 'Deploy additional counseling support immediately for the exam period.', insight: "Addresses the immediate need — just make sure it continues past the exam date itself." },
      { key: 'askGuide', action: "Ask the counseling team what's driving the anxiety this year specifically.", insight: "Tells you whether it's the exams themselves or something about how this year's pressure is being handled." },
      { key: 'stepBack', action: 'Treat it as an expected, temporary spike tied to exam season.', insight: "Understandable, but a predictable spike like this is usually worth planning for on purpose." }]

    },
    {
      pillarId: 'interpersonal-bonds',
      prompt: 'Teachers report several senior students visibly distracted or distressed over relationship issues during a high-stakes term.',
      approaches: [
      { key: 'stepIn', action: 'Offer a workshop on healthy relationships as part of the senior program.', insight: "A real, useful step — just make sure it's framed with respect, not lecture." },
      { key: 'askGuide', action: 'Ask the counseling team what patterns they are actually seeing in these cases.', insight: "Shapes what kind of support would genuinely help, rather than a generic session." },
      { key: 'stepBack', action: "Treat it as a personal matter outside the school's role.", insight: "Understandable, but when it's visibly affecting several students' term, it's arguably already the school's business." }]

    },
    {
      pillarId: 'independence',
      prompt: 'Alumni feedback suggests many students arrive at college academically strong but struggling with basic independence.',
      approaches: [
      { key: 'stepIn', action: 'Add a practical life-skills unit to the senior year curriculum.', insight: "Directly closes the gap — just make sure it's practical time, not another lecture." },
      { key: 'askGuide', action: "Ask recent alumni specifically what they wish they'd been taught before leaving.", insight: "Gets you a concrete list instead of a general impression of the gap." },
      { key: 'stepBack', action: 'Leave it as a family responsibility, as has been assumed before.', insight: "Reasonable if resources are tight — but this is a gap the school is well placed to help close." }]

    },
    {
      pillarId: 'peer-pressure-manipulation',
      prompt: 'A parent raises a concern about peer pressure around substances at school-adjacent social events.',
      approaches: [
      { key: 'stepIn', action: 'Address it directly in an assembly this term.', insight: "Direct and visible — just make sure the tone respects students rather than lecturing down at them." },
      { key: 'askGuide', action: 'Ask students, through the counseling team, what these situations actually look like for them.', insight: "Gets you the real picture before designing a response that might miss it." },
      { key: 'stepBack', action: "Note the concern but leave it outside the school's scope, since it happens off-campus.", insight: "Understandable boundary — but the pressure itself often follows students back onto campus regardless." }]

    },
    {
      pillarId: 'resilience-rejection',
      prompt: 'College rejection season brings a predictable wave of distress among senior students each year.',
      approaches: [
      { key: 'stepIn', action: 'Set up dedicated support sessions during the weeks results are expected.', insight: "Directly useful — just make sure it's proactive, available before results land, not only after." },
      { key: 'askGuide', action: 'Ask the counseling team what actually helped students get through it in past years.', insight: "Builds on what's already been learned instead of starting from scratch each year." },
      { key: 'stepBack', action: 'Continue handling it case by case as it comes up.', insight: "Fine if it's manageable — worth a structural look given how predictable this wave actually is." }]

    }],

    Counselors: [
    {
      pillarId: 'performance-pressure',
      prompt: "A student describes entrance-exam pressure as feeling like their entire identity is on the line.",
      approaches: [
      { key: 'stepIn', action: 'Help them build a concrete pressure-management plan for exam week.', insight: "Useful — just make sure the identity piece gets addressed too, not only the logistics." },
      { key: 'askGuide', action: "Ask what they'd still be if the exam didn't go the way they hope.", insight: "Getting a real answer to that is the actual protective work here." },
      { key: 'stepBack', action: 'Let them process it in their own way for now.', insight: "Risky at this intensity — this is usually a moment worth staying closely involved in." }]

    },
    {
      pillarId: 'interpersonal-bonds',
      prompt: "A student's sense of self-worth seems to rise and fall entirely with their relationship status.",
      approaches: [
      { key: 'stepIn', action: "Name the pattern directly and ask if they've noticed it too.", insight: "Direct, but often exactly what helps someone see a pattern they're inside of." },
      { key: 'askGuide', action: 'Ask what they valued about themselves before this relationship began.', insight: "Reconnecting with that is the real anchor, more than anything about the relationship." },
      { key: 'stepBack', action: "Let it be — it's common at this age.", insight: "Partly true — worth returning to if their self-worth keeps tracking the relationship this closely." }]

    },
    {
      pillarId: 'independence',
      prompt: 'A student admits real anxiety about managing life alone after graduation, beyond just academics.',
      approaches: [
      { key: 'stepIn', action: 'Walk through concrete independence skills together in session.', insight: "Useful and practical — just leave room to name the anxiety itself, not only the skills gap." },
      { key: 'askGuide', action: 'Ask which part of being on their own worries them most.', insight: "A specific worry is far more workable than a vague sense of being unready." },
      { key: 'stepBack', action: "Reassure them it'll come naturally once they're there.", insight: "Well-intentioned, but this usually needs more than reassurance to actually feel resolved." }]

    },
    {
      pillarId: 'peer-pressure-manipulation',
      prompt: "A student describes repeated pressure to go along with things at parties that don't sit right with them.",
      approaches: [
      { key: 'stepIn', action: 'Practice concrete responses they could use in the moment, right in session.', insight: "Practical and genuinely useful — rehearsing real words tends to help more than general advice." },
      { key: 'askGuide', action: 'Ask what makes it hardest to say no in that specific group.', insight: "Usually reveals whether it's about the substance or about belonging — different problems to solve." },
      { key: 'stepBack', action: 'Trust they will navigate it and leave it be.', insight: "Risky to leave unaddressed — this is exactly the kind of pattern worth actively working through." }]

    },
    {
      pillarId: 'resilience-rejection',
      prompt: 'A student is struggling to move past a college rejection weeks after it happened.',
      approaches: [
      { key: 'stepIn', action: 'Help them build a concrete plan for what comes next.', insight: "Useful eventually — just make sure the grief of the rejection has genuinely been acknowledged first." },
      { key: 'askGuide', action: 'Ask what this rejection feels like it says about them, specifically.', insight: "Getting that belief into the open is the real work, more than the next steps." },
      { key: 'stepBack', action: 'Give it more time before addressing it directly.', insight: "Reasonable briefly — but weeks in, it's probably time to actively engage with it." }]

    }]

  }
};

// Composite "bandId:roleId" keys (15 total — 3 grade bands × 5 roles) so
// progress through one band/role combination never bleeds into another,
// without needing a nested-Record shape for what's otherwise flat state.
const progressKey = (bandId: GradeBand['id'], roleId: GameRoleId) => `${bandId}:${roleId}`;

const INITIAL_INDEX_BY_KEY: Record<string, number> = {};
const INITIAL_EXPLORED_BY_KEY: Record<string, boolean[]> = {};
gradeBands.forEach((b) => {
  GAME_ROLES.forEach((r) => {
    const k = progressKey(b.id, r.id);
    INITIAL_INDEX_BY_KEY[k] = 0;
    INITIAL_EXPLORED_BY_KEY[k] = [false, false, false, false, false];
  });
});

export function PillarDiscoveryGame() {
  const [open, setOpen] = useState(false);
  const [bandId, setBandId] = useState<GradeBand['id']>('middle');
  const [roleId, setRoleId] = useState<GameRoleId>('Students');
  const [indexByKey, setIndexByKey] = useState<Record<string, number>>(INITIAL_INDEX_BY_KEY);
  const [exploredByKey, setExploredByKey] = useState<Record<string, boolean[]>>(INITIAL_EXPLORED_BY_KEY);
  const [tappedKeys, setTappedKeys] = useState<ApproachKey[]>([]);
  const touchStartX = useRef<number | null>(null);

  const band = gradeBands.find((b) => b.id === bandId);
  const pillarLabel = (pillarId: string) => band?.pillars.find((p) => p.id === pillarId)?.name ?? pillarId;

  const key = progressKey(bandId, roleId);
  const scenarios = BAND_ROLE_SCENARIOS[bandId][roleId];
  const index = indexByKey[key] ?? 0;
  const scenario = scenarios[index];
  const isExplored = exploredByKey[key]?.[index] ?? false;
  const pillar = band?.pillars.find((p) => p.id === scenario.pillarId);

  const goTo = (newIndex: number) => {
    const len = scenarios.length;
    const wrapped = (newIndex % len + len) % len;
    setIndexByKey((prev) => ({ ...prev, [key]: wrapped }));
    setTappedKeys([]);
    playChime('flip');
  };

  const selectBand = (id: GradeBand['id']) => {
    setBandId(id);
    setTappedKeys([]);
    playChime('click');
  };

  const selectRole = (id: GameRoleId) => {
    setRoleId(id);
    setTappedKeys([]);
    playChime('click');
  };

  const jumpToPillar = (i: number) => {
    setIndexByKey((prev) => ({ ...prev, [key]: i }));
    setTappedKeys([]);
    playChime('click');
  };

  const toggleTap = (key: ApproachKey) => {
    setTappedKeys((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
    playChime('flip');
  };

  const reveal = () => {
    setExploredByKey((prev) => {
      const next = { ...prev, [key]: [...(prev[key] ?? [false, false, false, false, false])] };
      next[key][index] = true;
      return next;
    });
    playChime('success');
  };

  const handleOpen = () => {
    setOpen(true);
    playChime('click');
  };

  const handleClose = () => {
    setOpen(false);
    playChime('click');
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goTo(index + 1);else
    goTo(index - 1);
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} aria-hidden="true" />}

      {open &&
      <div
        className="fixed inset-0 z-50 bg-card flex flex-col sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[min(92vw,820px)] sm:max-h-[88vh] sm:rounded-3xl sm:shadow-2xl sm:border sm:border-border"
        role="dialog"
        aria-label="Try the Approach — LuminarGuide">

        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--muted)', color: 'var(--primary)' }}>
              <PathIcon size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-700 text-foreground truncate" style={{ fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                Try the Approach
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {band?.gradesLabel} &middot; {GAME_ROLES.find((r) => r.id === roleId)?.label} &middot; {pillarLabel(scenario.pillarId)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0">

            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div
          className="flex gap-1.5 px-5 pt-3 overflow-x-auto flex-shrink-0 sm:justify-center [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}>

          {gradeBands.map((b) =>
          <button
            key={b.id}
            type="button"
            onClick={() => selectBand(b.id)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-600 whitespace-nowrap transition-colors"
            style={{
              fontWeight: 600,
              backgroundColor: bandId === b.id ? 'var(--accent)' : 'var(--card)',
              color: bandId === b.id ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
              border: `1px solid ${bandId === b.id ? 'var(--accent)' : 'var(--border)'}`
            }}>

              {b.gradesLabel}
            </button>
          )}
        </div>

        <div
          className="flex gap-1.5 px-5 pt-2 overflow-x-auto flex-shrink-0 sm:justify-center [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}>

          {GAME_ROLES.map((r) =>
          <button
            key={r.id}
            type="button"
            onClick={() => selectRole(r.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-600 whitespace-nowrap transition-colors"
            style={{
              fontWeight: 600,
              backgroundColor: roleId === r.id ? 'var(--primary)' : 'var(--card)',
              color: roleId === r.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              border: `1px solid ${roleId === r.id ? 'var(--primary)' : 'var(--border)'}`
            }}>

              <StakeholderIcon role={r.id} size={13} />
              {r.label}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous moment"
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card border border-border shadow-lg items-center justify-center text-foreground z-10">

              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next moment"
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card border border-border shadow-lg items-center justify-center text-foreground z-10">

              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            <div
              key={`${roleId}-${index}`}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="rounded-2xl p-6 sm:p-7 relative overflow-hidden animate-fade-scale"
              style={{ background: 'linear-gradient(150deg, var(--primary) 0%, #2b3b47 100%)' }}>

              <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 45% at 88% 5%, rgba(230,192,101,0.28) 0%, transparent 65%)' }} />
              <div className="relative">
                <p className="text-[11px] font-700 uppercase tracking-widest mb-2.5" style={{ fontWeight: 700, color: 'var(--accent)' }}>
                  A moment worth pausing on &middot; {index + 1} of {scenarios.length}
                </p>
                <p className="text-lg sm:text-xl leading-snug" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: '#fff' }}>
                  {scenario.prompt}
                </p>
              </div>
            </div>
          </div>

          <div className="flex sm:hidden items-center justify-center gap-4 pt-4">
            <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous moment" className="w-8 h-8 rounded-full bg-card border border-border shadow flex items-center justify-center text-foreground flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="flex gap-1.5">
              {scenarios.map((s, i) =>
              <span
                key={s.pillarId}
                className="rounded-full transition-all"
                style={{ width: i === index ? 14 : 5, height: 5, backgroundColor: i === index ? 'var(--accent)' : 'var(--border)' }} />

              )}
            </div>
            <button type="button" onClick={() => goTo(index + 1)} aria-label="Next moment" className="w-8 h-8 rounded-full bg-card border border-border shadow flex items-center justify-center text-foreground flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          <p className="hidden sm:block text-center text-xs text-muted-foreground pt-3">
            Use the arrows, or swipe the card on your phone
          </p>

          <div className="flex flex-col gap-2.5 mt-5">
            {scenario.approaches.map((appr) => {
              const unlocked = isExplored || tappedKeys.includes(appr.key);
              return (
                <button
                  key={appr.key}
                  type="button"
                  onClick={() => toggleTap(appr.key)}
                  className="text-left rounded-xl px-4 py-3 transition-colors"
                  style={{
                    border: `1.5px solid ${unlocked ? 'var(--accent)' : 'var(--border)'}`,
                    backgroundColor: unlocked ? 'var(--muted)' : 'var(--card)'
                  }}>

                  <div className="flex items-center gap-2.5">
                    <span className="flex-shrink-0" style={{ color: 'var(--primary)' }}>
                      <ArchetypeIcon archetype={appr.key} size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-700 uppercase tracking-wide" style={{ fontWeight: 700, color: 'var(--accent)' }}>
                        {ARCHETYPE_LABEL[appr.key]}
                      </p>
                      <p className="text-sm leading-snug text-foreground">{appr.action}</p>
                    </div>
                    {!unlocked &&
                    <span className="ml-auto text-[10px] text-muted-foreground flex-shrink-0">Tap</span>
                    }
                  </div>
                  {unlocked &&
                  <p className="text-xs leading-relaxed text-muted-foreground mt-2 pl-[29px]">{appr.insight}</p>
                  }
                </button>);

            })}
          </div>

          {!isExplored &&
          <button
            type="button"
            onClick={reveal}
            disabled={tappedKeys.length === 0}
            className="btn-secondary justify-center text-center w-full mt-4"
            style={tappedKeys.length === 0 ? { opacity: 0.5, cursor: 'default' } : undefined}>

            {tappedKeys.length > 0 ? 'Show what tends to help most here →' : 'Tap an option first to unlock this'}
          </button>
          }

          {isExplored && pillar &&
          <div className="rounded-2xl p-5 mt-4 animate-fade-up" style={{ backgroundColor: 'var(--primary)' }}>
            <div className="flex items-center gap-2.5 mb-2">
              <span style={{ color: 'var(--primary-foreground)' }}>
                <ScenarioIcon pillarId={scenario.pillarId} size={19} />
              </span>
              <p className="text-sm font-700" style={{ fontWeight: 700, color: 'var(--primary-foreground)' }}>
                The sweet spot: {pillar.name}
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--primary-foreground)', opacity: 0.95 }}>
              In practice, it's rarely just one of the three — it's knowing which to lean on and when. {pillar.whyItMatters}
            </p>
          </div>
          }

          <div className="mt-6">
            <p className="text-[11px] font-700 uppercase tracking-wide text-muted-foreground mb-2.5 text-center" style={{ fontWeight: 700 }}>
              Jump to a pillar
            </p>
            <div
              className="flex gap-1.5 overflow-x-auto sm:flex-wrap sm:justify-center pb-1 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}>

              {scenarios.map((s, i) =>
              <button
                key={s.pillarId}
                type="button"
                onClick={() => jumpToPillar(i)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-600 whitespace-nowrap transition-colors"
                style={{
                  fontWeight: 600,
                  backgroundColor: i === index ? 'var(--primary)' : 'var(--card)',
                  color: i === index ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  border: `1px solid ${i === index ? 'var(--primary)' : 'var(--border)'}`
                }}>

                  <ScenarioIcon pillarId={s.pillarId} size={12} />
                  {pillarLabel(s.pillarId)}
                  {exploredByKey[key]?.[i] && i !== index &&
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                }
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-6 pt-5 border-t border-border">
            <Link href="/about" className="btn-secondary">See the full pillar guide</Link>
            <Link href="/get-started" className="btn-primary">Ask Us Anything</Link>
          </div>
        </div>
      </div>
      }

      {!open &&
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open the pillar discovery game"
        className="fixed bottom-5 left-5 z-50 flex items-center justify-center gap-2 shadow-2xl transition-transform hover:scale-105 w-12 h-12 rounded-full sm:w-auto sm:h-auto sm:pl-4 sm:pr-5 sm:py-3.5"
        style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>

        <PathIcon size={16} />
        <span className="hidden sm:inline text-sm font-700" style={{ fontWeight: 700 }}>Try the Approach</span>
      </button>
      }
    </>);

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
    message: ''
  });
  const [documentName, setDocumentName] = useState('');
  const [documentPath, setDocumentPath] = useState('');
  const [docUploadStatus, setDocUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle');
  const [ciStatus, setCiStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  {
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
      document_path: documentPath || null
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
              placeholder="e.g. Ananya Sharma" />
            
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
              placeholder="School, practice, or organization" />
            
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
              placeholder="you@example.com" />
            
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
            placeholder="https://..." />
          
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
            className="contact-input" />
          
          <p className="text-xs text-muted-foreground">
            {docUploadStatus === 'uploading' && 'Uploading…'}
            {docUploadStatus === 'uploaded' &&
            <>Got it — <span className="font-600 text-foreground">{documentName}</span> is attached to your submission.</>
            }
            {docUploadStatus === 'error' &&
            <>Couldn&apos;t upload <span className="font-600 text-foreground">{documentName}</span> — you can send it along by email once we reply instead.</>
            }
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
            placeholder="A bit about your background and why you'd like to work with us..." />
          
        </div>
        <button type="submit" disabled={ciStatus === 'submitting'} className="btn-primary justify-center text-center disabled:opacity-60">
          {ciStatus === 'submitting' ? 'Sending…' : 'Share My Interest'}
        </button>
        {ciStatus === 'success' &&
        <p className="text-xs text-center" style={{ color: 'var(--primary)' }}>
            Thanks — we&apos;ve got your interest and will be in touch.
          </p>
        }
        {ciStatus === 'error' &&
        <p className="text-xs text-muted-foreground text-center">
            Something went wrong sending that. You can also{' '}
            <a href={mailtoFallback} className="text-primary hover:underline">email us directly</a>.
          </p>
        }
        {ciStatus === 'idle' &&
        <p className="text-xs text-muted-foreground text-center">
            If anything goes wrong, email us directly at{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        }
      </form>
    </div>);

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
  showDemo = false




}: {points: string[];theoryName: string;theoryDescription: string;showDemo?: boolean;}) {
  const [flipped, setFlipped] = useState(false);
  const demo = useTileDemo(showDemo);
  const isFlipped = flipped || demo.isFlipped;

  return (
    <div
      className="group/tile [perspective:1200px] cursor-pointer relative"
      onClick={() => {
        demo.cancel();
        setFlipped((v) => !v);
      }}
      onMouseEnter={demo.cancel}
      role="button"
      tabIndex={0}
      aria-label="Tap or hover to see the psychology behind this role"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          demo.cancel();
          setFlipped((v) => !v);
        }
      }}>

      {showDemo && demo.phase !== 'done' &&
      <div
        className="pointer-events-none absolute z-20"
        style={{ right: '10%', bottom: '14%', ...tileDemoCursorStyle(demo.phase) }}>

        <GuideCursorIcon pressed={demo.phase === 'pressing'} />
      </div>
      }

      <div
        className={`grid grid-cols-1 transition-transform duration-500 [transform-style:preserve-3d] ${
        isFlipped ? '[transform:rotateY(180deg)]' : 'group-hover/tile:[transform:rotateY(180deg)]'}`
        }>

        <div className="[grid-area:1/1] [backface-visibility:hidden] bg-card border border-border rounded-2xl p-7 flex flex-col gap-5">
          <ul className="flex flex-col gap-3.5">
            {points.map((point) =>
            <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: 'var(--accent)' }} />
                {point}
              </li>
            )}
          </ul>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-3 border-t border-border">
            <HoverHintIcon />
            Hover or tap to see the psychology behind this
          </p>
        </div>
        <div
          className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl p-7 flex flex-col gap-3 justify-center"
          style={{ backgroundColor: 'var(--primary)' }}>

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
    </div>);

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
            {gradeBands.map((b) =>
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveId(b.id)}
              className="px-4 py-1.5 rounded-full text-xs font-600 transition-colors"
              style={{
                fontWeight: 600,
                backgroundColor: activeId === b.id ? 'var(--primary)' : 'transparent',
                color: activeId === b.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
              }}>
              
                {b.gradesShort}
              </button>
            )}
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
                border: band.status === 'live' ? 'none' : '1px solid var(--border)'
              }}>
              
              {band.statusLabel}
            </span>
          </div>
          <h2
            className="font-700 text-foreground mb-5 max-w-3xl leading-snug"
            style={{ fontWeight: 700, fontSize: 'clamp(1.375rem, 2.2vw, 1.75rem)', letterSpacing: '-0.015em' }}>
            
            {band.ageContext}
          </h2>

          <div className="flex flex-wrap gap-3">
            {band.challenges.map((c) =>
            <div
              key={c}
              className="flex items-center gap-2.5 bg-card border-2 border-border rounded-full px-4 py-2.5 text-base font-800 shadow-sm"
              style={{ fontWeight: 800, color: 'var(--foreground)' }}>
              
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                {c}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

/* ------------------------------------------------------------------------
 * OurStoriesGallery
 * The dedicated "Our Stories" page content, rendered by /gamification (that
 * route's folder can't be renamed without creating a new one, since this * project can't add files — so the page is repurposed in place; visitors
 * only ever see it through the "Our Stories" nav link, never by typing the
 * URL). The original /gamification content — the "Try the Approach" pillar
 * game — isn't lost: the same game already floats on every page as a
 * dismissible full-screen launcher (PillarDiscoveryGame, bottom left), so
 * nothing here removes that feature, only its dedicated inline showcase
 * page.
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

type StoryItem = {kind: 'testimonial' | 'photo' | 'video';text: string;};

const storyItems: StoryItem[] = [
{ kind: 'testimonial', text: "Real stories from our mentors, parents, and schools are on their way — this space is reserved for the first ones we publish." },
{ kind: 'photo', text: 'Photos from the program — coming soon' },
{ kind: 'video', text: 'Videos from the program — coming soon' },
{ kind: 'testimonial', text: "We'd rather wait and show you something real than fill this with something that isn't. Check back soon." },
{ kind: 'photo', text: 'Photos from the program — coming soon' },
{ kind: 'testimonial', text: "Been part of the pilot? Your story could be one of the first to appear here — share it below." }];


function QuoteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 8c-1.7 0-3 1.3-3 3v3h4v-3H5a1.5 1.5 0 011.5-1.5V8zm9 0c-1.7 0-3 1.3-3 3v3h4v-3h-2a1.5 1.5 0 011.5-1.5V8z" fill="var(--accent)" opacity="0.5" />
    </svg>);

}

function PlayIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M11 8.5l7 4.5-7 4.5v-9z" fill="currentColor" opacity="0.6" />
    </svg>);

}

export function OurStoriesGallery() {
  const [form, setForm] = useState({ name: '', role: 'Parent', story: '' });
  const [photoName, setPhotoName] = useState('');
  const [photoPath, setPhotoPath] = useState('');
  const [photoUploadStatus, setPhotoUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle');
  const [storyStatus, setStoryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  {
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
      photo_path: photoPath || null
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
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors">
              
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByPage('right')}
              aria-label="Scroll stories right"
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors">
              
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}>
            
            {storyItems.map((item, i) =>
            <div key={i} className="snap-start shrink-0 w-full md:w-[calc(33.333%-0.667rem)]">
                {item.kind === 'testimonial' ?
              <div className="bento-card h-full flex flex-col gap-3 justify-center min-h-[200px]">
                    <QuoteIcon />
                    <p className="text-sm leading-relaxed text-muted-foreground italic">{item.text}</p>
                  </div> :

              <div className="aspect-[4/5] rounded-xl border border-dashed border-border bg-card flex flex-col items-center justify-center gap-3 text-center p-4 text-muted-foreground">
                    {item.kind === 'video' && <PlayIcon />}
                    <span className="text-xs">{item.text}</span>
                  </div>
              }
              </div>
            )}
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
                  placeholder="e.g. Ananya Sharma" />
                
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
                placeholder="What changed, or what stood out to you?" />
              
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
                className="contact-input" />
              
              <p className="text-xs text-muted-foreground">
                {photoUploadStatus === 'uploading' && 'Uploading…'}
                {photoUploadStatus === 'uploaded' &&
                <>Got it — <span className="font-600 text-foreground">{photoName}</span> is attached to your story.</>
                }
                {photoUploadStatus === 'error' &&
                <>Couldn&apos;t upload <span className="font-600 text-foreground">{photoName}</span> — no worries, we&apos;ll follow up about it if we&apos;d love to include one.</>
                }
                {photoUploadStatus === 'idle' && 'JPG, PNG, or GIF, up to 8MB.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleStorySubmit}
              disabled={storyStatus === 'submitting'}
              className="btn-primary justify-center text-center mt-1 disabled:opacity-60">
              
              {storyStatus === 'submitting' ? 'Sending…' : 'Send Your Story'}
            </button>
            {storyStatus === 'success' &&
            <p className="text-xs text-center" style={{ color: 'var(--primary)' }}>
                Thanks for sharing — we read every story.
              </p>
            }
            {storyStatus === 'error' &&
            <p className="text-xs text-muted-foreground text-center">
                Something went wrong sending that. You can also{' '}
                <a href={mailtoHref} className="text-primary hover:underline">email it to us directly</a>.
              </p>
            }
          </div>
        </div>
      </section>
    </>);

}

/* ------------------------------------------------------------------------
 * ReadAloudControl
 * An accessibility control that lives in the header (top of every page) and
 * uses the browser's built-in speech synthesis — no external API, no audio * files — to read the current page's content out loud. Built primarily for
 * visitors who are blind or have low vision, and useful for anyone who'd
 * rather listen. Offers "read the whole page" plus a per-section list, so
 * someone can choose exactly which part gets read.
 * ---------------------------------------------------------------------- */

function getPageSections(): {label: string;text: string;}[] {
  if (typeof document === 'undefined') return [];
  const main = document.querySelector('main');
  if (!main) return [];
  const sections = Array.from(main.querySelectorAll('section'));
  if (sections.length === 0) {
    const text = (main as HTMLElement).innerText || '';
    return text.trim() ? [{ label: 'Page content', text }] : [];
  }
  return sections.
  map((sec, i) => {
    const heading = sec.querySelector('h1, h2, h3');
    const label = heading?.textContent?.trim() || `Section ${i + 1}`;
    return { label, text: (sec as HTMLElement).innerText || '' };
  }).
  filter((s) => s.text.trim().length > 0);
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
    /google uk english/i];

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

function splitIntoSpeechChunks(text: string): {text: string;pauseAfter: number;final: boolean;}[] {
  const PAUSE_COMMA = 30;
  const PAUSE_LINE = 50;
  const PAUSE_PARAGRAPH = 300;

  const paragraphs = text.
  split(/\n\s*\n+/).
  map((p) => p.trim()).
  filter(Boolean);
  const chunks: {text: string;pauseAfter: number;final: boolean;}[] = [];

  paragraphs.forEach((paragraph, pIndex) => {
    const isLastParagraph = pIndex === paragraphs.length - 1;
    const lines = paragraph.
    split(/\n+/).
    map((l) => l.trim()).
    filter(Boolean);

    lines.forEach((line, lIndex) => {
      const isLastLine = lIndex === lines.length - 1;
      const sentences = (line.match(/[^.!?]+[.!?]*(\s+|$)/g) || [line]).
      map((s) => s.trim()).
      filter(Boolean);

      sentences.forEach((sentence, sIndex) => {
        const isLastSentence = sIndex === sentences.length - 1;
        const clauses = sentence.
        split(/(?<=[,;:])\s+/).
        map((c) => c.trim()).
        filter(Boolean);

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
function prosodyFor(clauseText: string, isSentenceFinal: boolean): {pitch: number;rate: number;} {
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

  if (wordCount >= 12) rate -= 0.04;else
  if (wordCount <= 3) rate += 0.03;

  return { pitch: pitch + jitter, rate };
}

export function ReadAloudControl() {
  const pathname = usePathname();
  const [openPanel, setOpenPanel] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sections, setSections] = useState<{label: string;text: string;}[]>([]);
  const cancelledRef = useRef(false);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      // Chrome in particular loads its voice list asynchronously — this warms
      // it up so the very first "Read aloud" click can already pick a good one.
      window.speechSynthesis.getVoices();
    } catch {

      // Speech synthesis unavailable — nothing to warm up.
    }return () => {
      cancelledRef.current = true;
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
      try {
        window.speechSynthesis.cancel();
      } catch {

        // Speech synthesis unavailable — nothing to clean up.
      }};
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
    }setSpeaking(false);
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
    }if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
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
      }};

    speakNext();
  };

  const stop = () => {
    cancelledRef.current = true;
    if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
    try {
      window.speechSynthesis.cancel();
    } catch {

      // Nothing to stop.
    }setSpeaking(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={togglePanel}
        aria-label="Read this page aloud"
        aria-expanded={openPanel}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors flex-shrink-0">
        
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M3 7v6h4l5 4V3L7 7H3z" fill="currentColor" />
          <path d="M14.5 7a4 4 0 010 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={speaking ? 1 : 0.45} />
          <path d="M16.5 5a7 7 0 010 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={speaking ? 1 : 0.25} />
        </svg>
      </button>

      {openPanel &&
      <div className="absolute right-0 top-12 w-72 bg-card border border-border rounded-2xl shadow-2xl p-4 flex flex-col gap-3 z-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-700 text-foreground" style={{ fontWeight: 700 }}>
              Read this page aloud
            </p>
            <button
            type="button"
            onClick={() => setOpenPanel(false)}
            aria-label="Close"
            className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0">
            
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
          className="btn-secondary justify-center text-center text-sm">
          
            ▶ Read whole page
          </button>
          {sections.length > 1 &&
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              <p className="text-[11px] font-600 text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 600 }}>
                Or just one section
              </p>
              {sections.map((s) =>
          <button
            key={s.label}
            type="button"
            onClick={() => speak(s.text)}
            className="text-left text-xs text-foreground bg-muted hover:bg-border rounded-lg px-3 py-2 transition-colors">
            
                  ▶ {s.label}
                </button>
          )}
            </div>
        }
          {speaking &&
        <button type="button" onClick={stop} className="btn-primary justify-center text-center text-sm">
              ⏹ Stop
            </button>
        }
        </div>
      }
    </div>);

}