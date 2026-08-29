import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { pricingPlans } from '@/lib/siteConfig';

export const metadata: Metadata = { title: 'Pricing — LuminarGuide' };

export default function PricingPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
          Pricing
        </p>
        <h1 className="text-section-heading text-foreground mb-4">Simple, honest pricing</h1>
        <p className="text-base text-muted-foreground">
          One nationwide price today — shown monthly, billed once a year. No hidden fees, and
          easy EMI options are available at signup for any plan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="bento-card flex flex-col"
            style={
              plan.highlight
                ? { borderColor: 'var(--primary)', borderWidth: '2px' }
                : undefined
            }>

            {plan.highlight && (
              <span
                className="self-start text-xs px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 600 }}>

                Most Popular
              </span>
            )}

            <h2 className="text-card-heading text-foreground mb-1">{plan.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">{plan.tagline}</p>

            <div className="mb-6">
              <span className="text-3xl text-foreground tracking-tight" style={{ fontWeight: 700 }}>
                ₹{plan.monthlyPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-muted-foreground">/mo</span>
              <p className="text-xs text-muted-foreground mt-1">
                Billed annually at ₹{plan.billedAnnually.toLocaleString('en-IN')}
              </p>
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {plan.features?.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-1 flex-shrink-0">
                    <path d="M2.5 7.5l3 3 6-6.5" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/get-started"
              className={plan.highlight ? 'btn-primary' : 'btn-secondary'}
              style={{ justifyContent: 'center' }}>

              Get Started
            </Link>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-12">
        Have questions about which plan fits your child, need a quote for a school or group, or
        want to ask about EMI options?{' '}
        <Link href="/contact" className="text-primary underline underline-offset-2" style={{ fontWeight: 600 }}>
          Contact us
        </Link>
        .
      </p>
    </section>);

}