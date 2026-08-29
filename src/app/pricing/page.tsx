import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { pricingPlans, pillarTrackAddOn } from '@/lib/siteConfig';

export const metadata: Metadata = { title: 'Pricing — LuminarGuide' };

export default function PricingPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs font-600 text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
          Pricing
        </p>
        <h1 className="text-section-heading text-foreground mb-4">Plans built around your child's growth</h1>
        <p className="text-base text-muted-foreground">
          Pay monthly, quarterly, or once a year — the longer you commit, the more you save. EMI
          options are available at signup for any plan.
        </p>
      </div>

      {/* Billing-cycle toggle — three hidden radios drive which price block
          shows in each card below via CSS alone (rules live in
          tailwind.css), so this stays a plain Server Component and
          `metadata` above keeps working. Annual is checked by default. */}
      <input type="radio" id="cycle-monthly" name="billing-cycle" className="sr-only" />
      <input type="radio" id="cycle-quarterly" name="billing-cycle" className="sr-only" />
      <input type="radio" id="cycle-annual" name="billing-cycle" defaultChecked className="sr-only" />

      <div className="cycle-toggle flex justify-center gap-1 bg-muted rounded-full p-1 w-max mx-auto mb-12">
        <label htmlFor="cycle-monthly" className="cycle-label">Monthly</label>
        <label htmlFor="cycle-quarterly" className="cycle-label">Quarterly</label>
        <label htmlFor="cycle-annual" className="cycle-label">
          Annual
          <span className="save-badge">2 months free</span>
        </label>
      </div>

      <div className="pricing-cards grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="price-monthly">
                <span className="text-3xl text-foreground tracking-tight" style={{ fontWeight: 700 }}>
                  ₹{plan.price.monthly.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
                <p className="text-xs text-muted-foreground mt-1">Billed monthly</p>
              </div>
              <div className="price-quarterly">
                <span className="text-3xl text-foreground tracking-tight" style={{ fontWeight: 700 }}>
                  ₹{plan.price.quarterly.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Billed ₹{(plan.price.quarterly * 3).toLocaleString('en-IN')} every 3 months
                </p>
              </div>
              <div className="price-annual">
                <span className="text-3xl text-foreground tracking-tight" style={{ fontWeight: 700 }}>
                  ₹{plan.price.annual.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Billed ₹{(plan.price.annual * 12).toLocaleString('en-IN')} once a year
                </p>
              </div>
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

      {/* Single Pillar Track — a standalone, flat-price add-on, not part of
          the Monthly/Quarterly/Annual ladder above (it's a one-time 2-month
          enrollment, not a subscription), so it gets its own simple card
          rather than a fourth column in the toggle grid. */}
      <div className="mt-10 bento-card flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="flex-1">
          <p className="text-xs font-600 uppercase tracking-widest mb-2" style={{ fontWeight: 600, color: 'var(--accent)' }}>
            Standalone Add-On
          </p>
          <h2 className="text-card-heading text-foreground mb-2">{pillarTrackAddOn.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{pillarTrackAddOn.tagline}</p>
          <ul className="flex flex-col gap-2">
            {pillarTrackAddOn.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-1 flex-shrink-0">
                  <path d="M2.5 7.5l3 3 6-6.5" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3 md:min-w-[200px]">
          <div>
            <span className="text-3xl text-foreground tracking-tight" style={{ fontWeight: 700 }}>
              ₹{pillarTrackAddOn.price.toLocaleString('en-IN')}
            </span>
            <p className="text-xs text-muted-foreground mt-1">{pillarTrackAddOn.billingNote}</p>
          </div>
          <Link href="/get-started" className="btn-secondary" style={{ justifyContent: 'center' }}>
            Get Started
          </Link>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-12">
        Not sure which plan fits your child, or need a quote for a school or group?{' '}
        <Link href="/contact" className="text-primary underline underline-offset-2" style={{ fontWeight: 600 }}>
          Contact us
        </Link>
        .
      </p>
    </section>);

}