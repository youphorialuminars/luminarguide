'use client';

import React, { useState } from 'react';
import { siteConfig, supabase } from '@/lib/siteConfig';
import { CollaboratorInterestForm } from '@/components/Header';

type Mode = 'parent' | 'collaborate';
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const MODES: { id: Mode; label: string }[] = [
  { id: 'parent', label: 'Get Started as a Parent' },
  { id: 'collaborate', label: 'Work With Us' },
];

const collaboratorRoles = [
  {
    role: 'Mentors',
    icon: '🧑‍🏫',
    blurb: 'Guide students one-on-one or in small groups through the Stage 1 pillars, backed by real session insight instead of guesswork.',
  },
  {
    role: 'Counselors',
    icon: '💬',
    blurb: 'Bring your clinical and developmental expertise into a shared, longitudinal view of student well-being.',
  },
  {
    role: 'Schools',
    icon: '🏫',
    blurb: 'Bring the Stage 1 pilot to your students, with an administrator-level view across your cohort and support for hosting intra- and inter-school events.',
  },
];

export default function GetStartedPage() {
  const [mode, setMode] = useState<Mode>('parent');
  const [parentForm, setParentForm] = useState({ name: '', email: '', childGrade: '', hopingFor: '', notes: '' });
  const [parentStatus, setParentStatus] = useState<SubmitStatus>('idle');

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setParentForm((prev) => ({ ...prev, [name]: value }));
  };

  const parentMailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    `Parent interest — ${parentForm.name || 'New Family'}`
  )}&body=${encodeURIComponent(
    `Name: ${parentForm.name}\nEmail: ${parentForm.email}\nChild's grade: ${parentForm.childGrade || '—'}\n\nWhat are you hoping Luminar's Guide can help with?\n${parentForm.hopingFor}\n\nAnything else we should know?\n${parentForm.notes}`
  )}`;

  const handleParentSubmit = async () => {
    if (!parentForm.name || !parentForm.email) {
      setParentStatus('error');
      return;
    }
    setParentStatus('submitting');
    const { error } = await supabase.from('lg_parent_leads').insert({
      name: parentForm.name,
      email: parentForm.email,
      child_grade: parentForm.childGrade || null,
      hoping_for: parentForm.hopingFor || null,
      notes: parentForm.notes || null,
    });
    if (error) {
      setParentStatus('error');
      return;
    }
    setParentStatus('success');
    setParentForm({ name: '', email: '', childGrade: '', hopingFor: '', notes: '' });
  };

  return (
    <section className="py-20 bg-background">
      <div className={`mx-auto px-6 ${mode === 'parent' ? 'max-w-2xl' : 'max-w-5xl'}`}>
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4">Get Started</p>
          <h1 className="text-section-heading text-foreground mb-5">
            {mode === 'parent' ? "Interested in Luminar's Guide for your child?" : "Let's work together."}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground mb-8">
            {mode === 'parent'
              ? "Tell us a bit about your family — we read every message ourselves and follow up within one business day. Sharing this doesn't commit you to anything."
              : "We're always looking to work with mentors, counselors, and schools who want to help students grow beyond the textbook."}
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className="px-5 py-2.5 rounded-full text-sm font-600"
                style={{
                  fontWeight: 600,
                  backgroundColor: mode === m.id ? 'var(--primary)' : 'transparent',
                  color: mode === m.id ? 'var(--primary-foreground)' : 'var(--foreground)',
                  border: `1.5px solid ${mode === m.id ? 'var(--primary)' : 'var(--border)'}`,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'parent' ? (
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>Your Name</label>
              <input name="name" type="text" value={parentForm.name} onChange={handleParentChange} className="contact-input" placeholder="e.g. Sarah Thompson" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>Email Address</label>
              <input name="email" type="email" value={parentForm.email} onChange={handleParentChange} className="contact-input" placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>Your Child's Grade (optional)</label>
              <input name="childGrade" type="text" value={parentForm.childGrade} onChange={handleParentChange} className="contact-input" placeholder="e.g. Class 8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>What are you hoping Luminar's Guide can help with?</label>
              <textarea name="hopingFor" rows={3} value={parentForm.hopingFor} onChange={handleParentChange} className="contact-input" style={{ resize: 'vertical', minHeight: '80px' }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>Anything else we should know? (optional)</label>
              <textarea name="notes" rows={3} value={parentForm.notes} onChange={handleParentChange} className="contact-input" style={{ resize: 'vertical', minHeight: '80px' }} />
            </div>

            <button
              type="button"
              onClick={handleParentSubmit}
              disabled={parentStatus === 'submitting'}
              className="btn-primary justify-center text-center mt-1 disabled:opacity-60"
            >
              {parentStatus === 'submitting' ? 'Sending…' : "Send to Luminar's Guide"}
            </button>
            {parentStatus === 'success' && (
              <p className="text-xs text-center" style={{ color: 'var(--primary)' }}>
                Thanks — we&apos;ve got it and will follow up within one business day.
              </p>
            )}
            {parentStatus === 'error' && (
              <p className="text-xs text-muted-foreground text-center">
                Something went wrong sending that. You can also{' '}
                <a href={parentMailto} className="text-primary hover:underline">email us directly</a>.
              </p>
            )}
            {parentStatus === 'idle' && (
              <p className="text-xs text-muted-foreground text-center">
                We read every message ourselves — sharing this doesn&apos;t commit you to anything.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {collaboratorRoles.map((c) => (
                <div key={c.role} className="bento-card flex flex-col gap-2.5 p-5">
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="text-card-heading text-foreground">{c.role}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
                </div>
              ))}
            </div>
            <CollaboratorInterestForm />
          </div>
        )}
      </div>
    </section>
  );
}