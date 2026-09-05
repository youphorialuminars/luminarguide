import React from 'react';
import { purpose } from '@/lib/siteConfig';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-background">
      
      {/* Subtle background blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          transform: 'translate(30%, -30%)'
        }} />
      
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-8 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
          opacity: 0.06
        }} />
      

      <div className="max-w-6xl mx-auto px-6 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left: Text Content — 7 cols */}
          <div className="lg:col-span-7 flex flex-col gap-7">

            {/* Eyebrow badge */}
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-1.5 text-xs font-600 text-secondary-foreground tracking-wide uppercase" style={{ fontWeight: 600 }}>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }} />

                Development Beyond the Textbook · Grades 6–12
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-hero-display text-foreground animate-fade-up delay-100">
              Meeting children{' '}
              <span className="gradient-text-gold">where growing up gets heavy.</span>
            </h1>

            {/* Parent-facing positioning line — short on purpose, this is the
                one line every visitor sees without scrolling. The fuller
                version of this same message lives in the Purpose section
                just below the hero, for anyone who wants the full case. */}
            <p
              className="text-base font-600 animate-fade-up delay-150"
              style={{ fontWeight: 600, color: 'var(--accent)' }}>

              {purpose.messageToParents.heading}
            </p>

            {/* Subheading */}
            <p className="text-base leading-relaxed text-muted-foreground max-w-xl animate-fade-up delay-200 font-700" style={{ fontSize: '1.0625rem', fontWeight: 700 }}>
              The child who goes quiet in class and won't say why. The teenager who measures their whole life
              against someone else's social feed. The senior heading off to college with no real practice at
              being on their own. LuminarsGuide is a mentor-led development program that meets each of them
              exactly where they are — with trained mentors, parents, schools, and counselors all working from
              the same picture.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 animate-fade-up delay-300">
              <a href="/get-started" className="btn-primary">
                Ask Us Anything
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#about" className="btn-secondary">
                See How It Works
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-4 animate-fade-up delay-400">
              <div className="stat-badge">
                <span className="text-2xl font-700 text-foreground tracking-tight" style={{ fontWeight: 700 }}>3</span>
                <span className="text-xs text-muted-foreground font-500 uppercase tracking-wider" style={{ fontWeight: 500 }}>Age Groups</span>
              </div>
              <div className="w-px bg-border self-stretch" />
              <div className="stat-badge">
                <span className="text-2xl font-700 text-foreground tracking-tight" style={{ fontWeight: 700 }}>5</span>
                <span className="text-xs text-muted-foreground font-500 uppercase tracking-wider" style={{ fontWeight: 500 }}>Pillars Per Age Group</span>
              </div>
              <div className="w-px bg-border self-stretch" />
              <div className="stat-badge">
                <span className="text-2xl font-700 text-foreground tracking-tight" style={{ fontWeight: 700 }}>3</span>
                <span className="text-xs text-muted-foreground font-500 uppercase tracking-wider" style={{ fontWeight: 500 }}>Development Stages</span>
              </div>
              <div className="w-px bg-border self-stretch" />
              <div className="stat-badge">
                <span className="text-2xl font-700 text-foreground tracking-tight" style={{ fontWeight: 700 }}>1:1</span>
                <span className="text-xs text-muted-foreground font-500 uppercase tracking-wider" style={{ fontWeight: 500 }}>Mentoring, Tasks & Group Work</span>
              </div>
            </div>
          </div>

          {/* Right: Visual Panel — 5 cols */}
          <div className="lg:col-span-5 animate-fade-scale delay-200">
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ minHeight: '480px' }}>
              
              {/* Solid brand-gradient panel — replaces the old placeholder photo.
                  Three flat layers, no image request, no loading state:
                  1) the base gradient, running the deep --panel-deep anchor
                     into --panel-accent's gold — --panel-deep/--panel-accent
                     rather than --primary/--accent specifically because
                     this is one of the site's few deliberate gold
                     "statement" moments, kept separate from the general
                     (now neutral, black-and-white) --primary/--accent pair
                     used everywhere else (see tailwind.css)
                  2) a soft top-right glow for a little depth
                  3) a dark wash so the white text/cards on top stay legible
                     against either theme's gold */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(160deg, var(--panel-deep) 0%, var(--panel-accent) 100%)',
                }} />
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(60% 50% at 78% 12%, rgba(255,255,255,0.16) 0%, transparent 60%)',
                }} />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(175deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.48) 100%)',
                }} />


              {/* Content overlay */}
              <div className="absolute inset-0 p-7 flex flex-col justify-between">
                {/* Top badge */}
                <div className="flex justify-end">
                  <span
                    className="text-xs font-600 text-white px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
                    style={{ fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                    
                    Luminar's Guide
                  </span>
                </div>

                {/* Middle: Program pillars card */}
                <div
                  className="rounded-2xl p-5 border border-white/15"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent)' }}>

                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1L2 5.4l4.2-.8L8 1z" fill="white" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-xs font-600" style={{ fontWeight: 600 }}>Stage 1 · Classes 6–10</p>
                      <p className="text-white/60 text-xs">A glimpse of what we help students build</p>
                    </div>
                  </div>

                  {/* Pillars */}
                  <div className="flex flex-col gap-0.5">
                    {[
                    { label: 'Self-Identity', note: 'Knowing what you value, and why' },
                    { label: 'Inner Strength', note: 'Sitting with hard feelings, not around them' },
                    { label: 'Leadership & Teamwork', note: 'Speaking up in a group, not just going along' }]?.
                    map((item) =>
                    <div key={item?.label} className="flex items-start gap-2.5 py-2 border-b border-white/10 last:border-0">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0">
                          <path d="M2.5 7.5l3 3 6-6.5" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div>
                          <p className="text-white text-xs font-600" style={{ fontWeight: 600 }}>{item?.label}</p>
                          <p className="text-white/60 text-xs leading-snug">{item?.note}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom: Program stage */}
                <div
                  className="rounded-xl px-4 py-3 flex items-center justify-between border border-white/10"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>

                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-700 text-white flex-shrink-0"
                      style={{ fontWeight: 700, backgroundColor: 'var(--accent)' }}>
                      1
                    </div>
                    <p className="text-white text-xs font-600" style={{ fontWeight: 600 }}>Stage 1 · Intrinsic Development</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xs font-600" style={{ fontWeight: 600 }}>Piloting Now</p>
                    <p className="text-white/60 text-xs">Classes 6–10 live · 11–12 coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>);

}