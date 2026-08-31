'use client';

import React, { useState } from 'react';
import { siteConfig, supabase } from '@/lib/siteConfig';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const mailtoHref = `mailto:${siteConfig.contact.email}?subject=Inquiry from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )}`;

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    const { error } = await supabase.from('lg_contact_messages').insert({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });
    if (error) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 bg-background scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-7">
            <div>
              <p className="text-xs font-600 text-primary uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>
                Get in Touch
              </p>
              <h2 className="text-section-heading text-foreground mb-5">
                Ready to transform how you support students?
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                                Whether you are a school administrator, educator, or counselor, we would love to show you how LuminarsGuide can work for your students. Send us a message and we will be in touch.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="icon-wrapper" style={{ color: 'var(--primary)', backgroundColor: 'var(--muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.5 12.5l-2.5-2.5a1 1 0 00-1.4 0l-1.1 1.1a9.5 9.5 0 01-4.1-4.1l1.1-1.1a1 1 0 000-1.4L5 2C4.5 1.5 3.5 1.5 3 2L2 3C1 4 1.5 7 5.5 11S14 17 15 16l1-1c.5-.5.5-1.5 0-2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-500 uppercase tracking-wider mb-0.5" style={{ fontWeight: 500 }}>Email</p>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-sm font-600 text-foreground hover:text-primary transition-colors" style={{ fontWeight: 600 }}>
                    {siteConfig.contact.email}
                  </a>
                </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-7 shadow-sm">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Ms. Sarah Thompson"
                  value={formData.name}
                  onChange={handleChange}
                  className="contact-input"
                  autoComplete="name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@school.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="contact-input"
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-600 text-foreground" style={{ fontWeight: 600 }}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about your school, the number of students, and what you're hoping to achieve with LuminarGuide..."
                  value={formData.message}
                  onChange={handleChange}
                  className="contact-input"
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
              </div>

                <button
                type="button"
                onClick={handleSubmit}
                disabled={status === 'submitting'}
                className="btn-primary justify-center text-center mt-1 disabled:opacity-60"
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 2L2 6.5l5 2 2 5L14 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>
              {status === 'success' && (
                <p className="text-xs text-center" style={{ color: 'var(--primary)' }}>
                  Thanks — we&apos;ve got your message and will be in touch.
                </p>
              )}
              {status === 'error' && (
                <p className="text-xs text-muted-foreground text-center">
                  Something went wrong sending that. You can also{' '}
                  <a href={mailtoHref} className="text-primary hover:underline">email us directly</a>.
                </p>
              )}
              {status === 'idle' && (
                <p className="text-xs text-muted-foreground text-center">
                We read every message ourselves and reply personally.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}