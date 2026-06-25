'use client'

import Link from 'next/link'
import { ArrowRight, FlaskConical, Shield, Truck, FileCheck, ChevronRight, Download, Star, CheckCircle, Microscope, Zap } from 'lucide-react'
import { PRODUCTS, getFeaturedProducts } from '@/lib/products'
import { NexGenMark } from '@/components/NexGenLogo'

const FEATURED = getFeaturedProducts().slice(0, 4)

const VALUE_PROPS = [
  {
    icon: FlaskConical,
    title: '≥99% Purity',
    sub: 'HPLC & MS Verified',
    desc: 'Every batch is independently tested by ISO 17025 accredited third-party laboratories. We publish the results whether they pass or fail.',
    color: '#1568D3',
    bg: '#E8F1FB',
  },
  {
    icon: FileCheck,
    title: 'Full COA Access',
    sub: 'Every Batch, Public',
    desc: 'Scan the QR code on any vial to access your batch-specific Certificate of Analysis in our searchable COA database.',
    color: '#0F4FA8',
    bg: '#E8F1FB',
  },
  {
    icon: Truck,
    title: 'Cold Chain Shipping',
    sub: '2-Day US Delivery',
    desc: 'Temperature-sensitive compounds ship with cold packs and tamper-evident packaging from our climate-controlled facility.',
    color: '#1568D3',
    bg: '#E8F1FB',
  },
  {
    icon: Shield,
    title: 'Research Compliant',
    sub: 'FDA-Aligned Labeling',
    desc: 'All compounds are labeled and sold strictly for in-vitro laboratory research. We maintain rigorous researcher attestation protocols.',
    color: '#0F4FA8',
    bg: '#E8F1FB',
  },
]

const TRUST_BADGES = [
  'ISO 17025 Third-Party Tested',
  'HPLC + Mass Spectrometry',
  'Batch-Level COA Published',
  'U.S.-Based Operations',
  'Cold Chain Shipping',
  'Researcher Attestation Required',
]

const CATEGORIES = [
  {
    id: 'single-peptides',
    label: 'Single Peptides',
    desc: 'Individual research compounds with individual COA verification',
    count: 9,
    gradient: 'from-navy to-navy-light',
    icon: '⬡',
  },
  {
    id: 'peptide-blends',
    label: 'Peptide Blends',
    desc: 'Research-formulated multi-compound combinations',
    count: 2,
    gradient: 'from-signal-dark to-signal',
    icon: '◎',
  },
  {
    id: 'wolverine-stack',
    label: 'Wolverine Stack',
    desc: 'BPC-157 + TB-500 — the most studied dual-peptide research protocol',
    count: 1,
    gradient: 'from-navy to-signal-dark',
    icon: '✕',
  },
  {
    id: 'reconstitution',
    label: 'Reconstitution Supplies',
    desc: 'USP-grade bacteriostatic water and lab-grade equipment',
    count: 3,
    gradient: 'from-slate to-navy',
    icon: '◈',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section
        className="hero-section relative overflow-hidden"
        aria-label="Unlock 25% Off Your First Order — Subscribe for exclusive offers"
        style={{ aspectRatio: '16 / 9', minHeight: '520px', maxHeight: '90vh' }}
      >
        {/* ── MOBILE hero content (gradient bg, HTML text) ── */}
        <div className="md:hidden relative z-10 px-6 pt-10 pb-20">
          <h1
            className="text-white font-extrabold leading-tight mb-6"
            style={{ fontSize: 'clamp(34px, 10vw, 48px)', letterSpacing: '-0.025em' }}
          >
            Unlock 25% Off<br />Your First Order!
          </h1>

          {/* Trust badges */}
          <div className="flex gap-5 mb-8">
            {[
              { icon: Shield, label: 'Research\nGrade' },
              { icon: FlaskConical, label: 'Third-Party\nTested' },
              { icon: CheckCircle, label: 'Trusted\nQuality' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <Icon size={22} style={{ color: '#3A85E0' }} />
                <span className="text-white/70 leading-tight whitespace-pre-line"
                  style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Subscribe form */}
          <form onSubmit={e => e.preventDefault()} className="flex items-center mb-2" style={{ maxWidth: 360 }}>
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 outline-none"
              style={{
                padding: '13px 18px',
                fontSize: 14,
                background: 'rgba(255,255,255,0.96)',
                borderRadius: '50px 0 0 50px',
                border: 'none',
                color: '#0E1B2E',
                fontFamily: 'inherit',
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              style={{
                padding: '13px 20px',
                fontSize: 14,
                fontWeight: 700,
                background: '#0E1B2E',
                borderRadius: '0 50px 50px 0',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                fontFamily: 'inherit',
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1568D3' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0E1B2E' }}
            >
              Subscribe
            </button>
          </form>

          <div className="flex gap-3 mt-6">
            <Link href="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#1568D3' }}>
              Shop Peptides <ArrowRight size={15} />
            </Link>
            <Link href="/coa"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white/80 border"
              style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.07)' }}>
              <FileCheck size={15} /> COA Library
            </Link>
          </div>
        </div>

        {/* ── DESKTOP: image form overlay ── */}
        <div
          className="hero-form-wrapper absolute left-0 hidden md:block"
          style={{ top: '63%', width: '44%', padding: '0 3% 0 5%' }}
        >
          <form
            onSubmit={e => e.preventDefault()}
            className="flex items-center"
            style={{ maxWidth: 420 }}
          >
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 outline-none"
              style={{
                padding: 'clamp(10px, 1.1vw, 14px) clamp(12px, 1.5vw, 20px)',
                fontSize: 'clamp(12px, 1vw, 14px)',
                background: 'rgba(255,255,255,0.96)',
                borderRadius: '50px 0 0 50px',
                border: 'none',
                color: '#0E1B2E',
                fontFamily: 'inherit',
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              style={{
                padding: 'clamp(10px, 1.1vw, 14px) clamp(14px, 1.8vw, 24px)',
                fontSize: 'clamp(12px, 1vw, 14px)',
                fontWeight: 700,
                background: '#0E1B2E',
                borderRadius: '0 50px 50px 0',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                fontFamily: 'inherit',
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1568D3' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0E1B2E' }}
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom fade to white */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }}
        />
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="bg-white border-b border-frost overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-wrap gap-x-10 gap-y-3 items-center justify-center">
            {TRUST_BADGES.map(badge => (
              <div key={badge} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-signal flex-shrink-0" />
                <span
                  className="text-slate"
                  style={{ fontSize: 12, fontFamily: 'var(--font-jetbrains)', letterSpacing: '0.04em', textTransform: 'uppercase' }}
                >
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="section-gradient py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <p className="data-label mb-2">Most Researched</p>
              <h2 className="text-navy" style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 680, letterSpacing: '-0.02em' }}>
                Featured Compounds
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-signal hover:text-signal-dark transition-colors"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED.map(product => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="product-card bg-white rounded-2xl border border-frost overflow-hidden h-full cursor-pointer flex flex-col">
                  {/* Product image */}
                  <div
                    className="relative overflow-hidden flex-shrink-0"
                    style={{ height: 180, background: '#F4F7FB' }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                    />
                    {product.category === 'wolverine-stack' && (
                      <span
                        className="absolute top-2 right-2 tag"
                        style={{ background: '#0F4FA8', color: 'white', fontFamily: 'var(--font-jetbrains)' }}
                      >
                        BUNDLE
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                  <p className="data-label mb-1.5">{product.categoryLabel}</p>
                  <h3
                    className="text-navy font-semibold mb-2"
                    style={{ fontSize: 15, fontWeight: 600 }}
                  >
                    {product.name}
                  </h3>

                  {/* Purity */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="purity-badge">{product.purity}</span>
                    <span
                      className="text-slate"
                      style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains)' }}
                    >
                      HPLC Verified
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-navy font-bold" style={{ fontSize: 20 }}>
                      ${product.sizes[0].price.toFixed(2)}
                    </span>
                    <span
                      className="text-signal text-sm font-medium flex items-center gap-1"
                    >
                      View Details
                      <ChevronRight size={14} />
                    </span>
                  </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium text-signal"
            >
              View All Products
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="bg-white py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 md:mb-12">
            <p className="data-label mb-2">Browse by Type</p>
            <h2 style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 680, letterSpacing: '-0.02em', color: '#0E1B2E' }}>
              Research Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/shop?category=${cat.id}`}>
                <div
                  className="group rounded-2xl p-5 md:p-8 cursor-pointer transition-all duration-250 hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, #0E1B2E 0%, #162440 100%)',
                    boxShadow: '0 4px 24px rgba(14,27,46,0.12)',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(14,27,46,0.2)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(14,27,46,0.12)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div
                        className="mb-4"
                        style={{
                          fontSize: 28,
                          color: '#1568D3',
                          fontWeight: 300,
                        }}
                      >
                        {cat.icon}
                      </div>
                      <h3
                        className="text-white mb-2"
                        style={{ fontSize: 20, fontWeight: 600 }}
                      >
                        {cat.label}
                      </h3>
                      <p
                        className="text-white/50 text-sm max-w-xs"
                        style={{ lineHeight: 1.6 }}
                      >
                        {cat.desc}
                      </p>
                    </div>
                    <div
                      className="text-signal opacity-60 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 transition-transform"
                    >
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span
                      className="tag"
                      style={{
                        background: 'rgba(21,104,211,0.15)',
                        color: '#3A85E0',
                        border: '1px solid rgba(21,104,211,0.25)',
                        fontFamily: 'var(--font-jetbrains)',
                      }}
                    >
                      {cat.count} {cat.count === 1 ? 'compound' : 'compounds'}
                    </span>
                    <span
                      className="text-signal text-sm font-medium"
                    >
                      Shop Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS ─── */}
      <section className="py-12 md:py-24" style={{ background: '#F4F7FB' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-16">
            <p className="data-label mb-2">Why Researchers Choose NexGen</p>
            <h2
              style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 680, letterSpacing: '-0.02em', color: '#0E1B2E' }}
            >
              Built for the Laboratory
            </h2>
            <p className="text-slate mt-3 max-w-lg mx-auto text-sm" style={{ lineHeight: 1.7 }}>
              We built the transparency infrastructure we wished existed when we started
              sourcing research peptides. Every decision optimizes for data integrity, not marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map(vp => (
              <div
                key={vp.title}
                className="bg-white rounded-2xl p-6 border border-frost hover:border-signal/30 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: vp.bg }}
                >
                  <vp.icon size={22} style={{ color: vp.color }} />
                </div>
                <h3
                  className="text-navy font-semibold mb-1"
                  style={{ fontSize: 16 }}
                >
                  {vp.title}
                </h3>
                <p
                  className="mb-3"
                  style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains)', color: '#1568D3', letterSpacing: '0.04em', textTransform: 'uppercase' }}
                >
                  {vp.sub}
                </p>
                <p className="text-slate text-sm" style={{ lineHeight: 1.65 }}>
                  {vp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COA TRANSPARENCY BAND ─── */}
      <section
        className="relative overflow-hidden py-10 md:py-20"
        style={{ background: 'linear-gradient(135deg, #0E1B2E 0%, #0D3270 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle, #3A85E0 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="data-label text-signal-60 mb-3" style={{ color: '#3A85E0' }}>
                Radical Transparency
              </p>
              <h2
                className="text-white mb-4"
                style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 680, letterSpacing: '-0.02em' }}
              >
                Every Batch, Every Result.
                <br />
                Publicly Searchable.
              </h2>
              <p className="text-white/55 mb-8 text-sm" style={{ lineHeight: 1.7 }}>
                Our COA database is publicly accessible — no login required. Search by peptide name,
                batch number, or test date. Download any Certificate of Analysis in PDF format.
                If a batch fails our purity threshold, we quarantine it and publish the result.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/coa"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#1568D3' }}
                >
                  <Download size={15} />
                  Search COA Library
                </Link>
                <Link
                  href="/about#lab-standards"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white/70 border border-white/15"
                >
                  Lab Standards
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* COA Sample Card */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#3A85E0', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  Certificate of Analysis
                </span>
                <span
                  className="tag"
                  style={{ background: 'rgba(21,104,211,0.2)', color: '#3A85E0', border: '1px solid rgba(58,133,224,0.3)', fontFamily: 'var(--font-jetbrains)' }}
                >
                  PASSED
                </span>
              </div>
              {[
                { label: 'Product', value: 'BPC-157' },
                { label: 'Batch', value: 'NXG-2026-Q2-001' },
                { label: 'CAS Number', value: '137525-51-0' },
                { label: 'HPLC Purity', value: '99.4%' },
                { label: 'MS Confirmation', value: 'Confirmed ✓' },
                { label: 'Endotoxin', value: '<1 EU/mg' },
                { label: 'Test Date', value: '2026-05-14' },
                { label: 'Lab', value: 'ISO 17025 Accredited' },
              ].map(row => (
                <div
                  key={row.label}
                  className="coa-row flex items-center justify-between py-2.5"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <span
                    style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: 12,
                      color: row.label === 'HPLC Purity' ? '#3A85E0' : 'rgba(255,255,255,0.75)',
                      fontWeight: row.label === 'HPLC Purity' ? 700 : 500,
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <Link
                href="/coa"
                className="mt-5 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white/60 border border-white/10 hover:border-signal/40 hover:text-white transition-all"
              >
                <Download size={14} />
                Download Full PDF
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="bg-white py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-16">
            <p className="data-label mb-2">How It Works</p>
            <h2 style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 680, letterSpacing: '-0.02em', color: '#0E1B2E' }}>
              From Synthesis to Your Lab
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Source & Synthesize', desc: 'Manufactured by ISO 9001-certified facilities with full GMP documentation and facility audit records on file.' },
              { step: '02', title: 'Third-Party Test', desc: 'Every batch is tested by an ISO 17025 accredited external lab via HPLC, mass spectrometry, and endotoxin assay.' },
              { step: '03', title: 'COA Published', desc: 'The full Certificate of Analysis is uploaded to our public database and linked to each product via QR code.' },
              { step: '04', title: 'Cold Chain Ship', desc: 'Orders are packed with cold packs in tamper-evident packaging and shipped within 24–48 hours.' },
            ].map((step, i) => (
              <div key={step.step} className="relative">
                {i < 3 && (
                  <div
                    className="hidden md:block absolute top-6 left-full w-full h-px"
                    style={{ background: 'linear-gradient(90deg, #C2D8E0, transparent)', zIndex: 0 }}
                  />
                )}
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 font-bold"
                    style={{
                      background: '#E8F1FB',
                      color: '#1568D3',
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: 14,
                    }}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-navy font-semibold mb-2" style={{ fontSize: 16 }}>
                    {step.title}
                  </h3>
                  <p className="text-slate text-sm" style={{ lineHeight: 1.65 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESEARCH-USE DISCLAIMER ─── */}
      <section style={{ background: '#F4F7FB' }} className="py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="rounded-xl p-6 border"
            style={{
              background: 'white',
              borderColor: '#C2D8E0',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#E8F1FB' }}
              >
                <Shield size={16} style={{ color: '#1568D3' }} />
              </div>
              <div>
                <h4
                  className="text-navy font-semibold mb-2"
                  style={{ fontSize: 14 }}
                >
                  Research-Use Compliance Statement
                </h4>
                <p
                  className="text-slate"
                  style={{
                    fontSize: 12,
                    lineHeight: 1.7,
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  All products on NexGen BioResearch are for in-vitro research and laboratory use only.
                  They are not intended for human or veterinary use, diagnosis, treatment, or prevention
                  of any disease or condition. These statements have not been evaluated by the FDA.
                  Purchase requires researcher attestation. Not for resale for human consumption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <NexGenMark size={48} navyColor="#0E1B2E" signalColor="#1568D3" />
          <h2
            className="text-navy mt-6 mb-3"
            style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 680, letterSpacing: '-0.02em' }}
          >
            Ready to Advance Your Research?
          </h2>
          <p className="text-slate mb-8 text-sm" style={{ lineHeight: 1.7 }}>
            Browse our complete catalog of ISO 17025-tested research peptides.
            Every order includes access to the full batch COA.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm"
            >
              Shop All Peptides
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="btn-outline inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm"
            >
              Our Lab Standards
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
