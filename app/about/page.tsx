import Link from 'next/link'
import { Shield, FlaskConical, Award, Microscope, CheckCircle, ArrowRight, FileCheck } from 'lucide-react'
import { NexGenMark } from '@/components/NexGenLogo'

export const metadata = {
  title: 'About — NexGen BioResearch',
  description: 'Our mission, quality standards, and commitment to research-grade transparency.',
}

const LAB_STANDARDS = [
  {
    icon: Microscope,
    title: 'Third-Party Testing Only',
    desc: 'We do not perform in-house purity testing. Every batch is sent to an ISO 17025 accredited external laboratory. No exceptions. This eliminates any conflict of interest in our results.',
  },
  {
    icon: FileCheck,
    title: 'Full-Panel Analysis',
    desc: 'Each batch undergoes HPLC purity determination, mass spectrometry identity confirmation, endotoxin testing (LAL assay), and residual solvent screening. The full panel is published.',
  },
  {
    icon: Award,
    title: 'Minimum 99% Purity Standard',
    desc: 'Any batch that tests below 98.5% purity is quarantined and never released for sale. The failed COA is still published in our database — we do not hide failed results.',
  },
  {
    icon: Shield,
    title: 'Dual Supplier Chain',
    desc: 'We maintain relationships with multiple ISO 9001-certified manufacturers. Each supplier provides facility documentation, GMP compliance evidence, and is subject to our testing protocol before any batch is accepted.',
  },
  {
    icon: FlaskConical,
    title: 'Cold Chain Integrity',
    desc: 'Temperature-sensitive peptides ship with validated cold pack insulation systems. All packaging is tamper-evident. QR codes on each vial link directly to the batch COA record.',
  },
  {
    icon: CheckCircle,
    title: 'Researcher Attestation Required',
    desc: 'Every order requires a timestamped digital researcher attestation confirming laboratory research use. This log is maintained and associated with each order record.',
  },
]

const QUALITY_STEPS = [
  { num: '01', title: 'Supplier Qualification', body: 'ISO 9001 certification, facility audit documentation, and sample testing before establishing a supplier relationship.' },
  { num: '02', title: 'Incoming Quarantine', body: 'All inventory is quarantined upon receipt pending third-party lab results. Nothing ships until testing is complete and passes.' },
  { num: '03', title: 'ISO 17025 Lab Testing', body: 'Full panel: HPLC purity, mass spectrometry, endotoxin, residual solvents. Results typically returned in 7–14 business days.' },
  { num: '04', title: 'COA Publication', body: 'Passing batches receive a QR-coded lot label. The COA is uploaded to the public database before the batch is released for sale.' },
  { num: '05', title: 'Cold Chain Packaging', body: 'Tamper-evident packaging with validated cold insulation. QR code on each vial links to the live COA database.' },
  { num: '06', title: 'Compliance Review', body: 'Each product page and order communication is reviewed against our attorney-drafted compliance checklist before and after launch.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div
        className="relative overflow-hidden pt-20 pb-24"
        style={{ background: 'linear-gradient(135deg, #0E1B2E 0%, #0D2A60 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle, #3A85E0 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 opacity-8"
          style={{ width: '40%' }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <NexGenMark size={400} navyColor="rgba(255,255,255,0.3)" signalColor="rgba(21,104,211,0.4)" />
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p
            className="mb-4"
            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#3A85E0', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Our Mission
          </p>
          <h1
            className="text-white mb-6 max-w-2xl"
            style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 }}
          >
            Advancing Research Through
            <br />
            <span style={{ background: 'linear-gradient(90deg, #3A85E0, #1568D3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Uncompromising Purity.
            </span>
          </h1>
          <p className="text-white/55 text-sm max-w-xl" style={{ lineHeight: 1.75 }}>
            NexGen BioResearch was founded on a single conviction: researchers deserve complete
            transparency about the compounds they work with. Every operational decision we make
            — from supplier selection to COA publication — flows from that commitment.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-24" style={{ background: '#F4F7FB' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="data-label mb-3">Why We Exist</p>
              <h2
                className="text-navy mb-6"
                style={{ fontSize: 36, fontWeight: 680, letterSpacing: '-0.02em' }}
              >
                The Research Peptide Market Needed a Different Standard
              </h2>
              <div className="space-y-4 text-slate text-sm" style={{ lineHeight: 1.8 }}>
                <p>
                  When we began researching the peptide supply chain, we found a category defined
                  by opacity: compounds sold without independent verification, COAs that appeared
                  self-generated, and vendors with no disclosed quality control protocol.
                </p>
                <p>
                  We built NexGen BioResearch to be the alternative. Every compound we sell is
                  tested by an ISO 17025 accredited external laboratory before release.
                  Every Certificate of Analysis is published in our publicly searchable database —
                  whether the batch passes or fails.
                </p>
                <p>
                  We operate strictly within FDA guidelines for research chemical suppliers.
                  All compounds are sold for in-vitro laboratory research use only, with mandatory
                  researcher attestation for every order.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '≥99%', label: 'Average Purity', sub: 'Across all active batches' },
                { value: '0', label: 'Hidden Failures', sub: 'Failed COAs are published' },
                { value: '100%', label: 'Third-Party Tested', sub: 'No in-house testing' },
                { value: '48hr', label: 'Fulfillment', sub: 'From confirmed order' },
              ].map(s => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl p-6 border border-frost"
                >
                  <p
                    className="font-bold mb-1"
                    style={{ fontSize: 32, color: '#1568D3', letterSpacing: '-0.02em' }}
                  >
                    {s.value}
                  </p>
                  <p className="text-navy font-medium text-sm mb-1">{s.label}</p>
                  <p className="text-slate text-xs">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lab Standards */}
      <section id="lab-standards" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="data-label mb-2">Quality Infrastructure</p>
            <h2
              className="text-navy"
              style={{ fontSize: 36, fontWeight: 680, letterSpacing: '-0.02em' }}
            >
              Our Lab Standards
            </h2>
            <p className="text-slate mt-3 max-w-lg mx-auto text-sm" style={{ lineHeight: 1.7 }}>
              These are not marketing claims. They are operational protocols with documented
              evidence files available to wholesale accounts and institutional partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LAB_STANDARDS.map(std => (
              <div
                key={std.title}
                className="rounded-2xl p-6 border border-frost hover:border-signal/30 transition-colors"
                style={{ background: '#FAFBFD' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: '#E8F1FB' }}
                >
                  <std.icon size={20} style={{ color: '#1568D3' }} />
                </div>
                <h3 className="text-navy font-semibold mb-2" style={{ fontSize: 16 }}>
                  {std.title}
                </h3>
                <p className="text-slate text-sm" style={{ lineHeight: 1.7 }}>
                  {std.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Process */}
      <section className="py-24" style={{ background: '#0E1B2E' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p
              className="mb-2"
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#3A85E0', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              From Supplier to Your Lab
            </p>
            <h2
              className="text-white"
              style={{ fontSize: 36, fontWeight: 680, letterSpacing: '-0.02em' }}
            >
              Quality Control Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUALITY_STEPS.map(step => (
              <div
                key={step.num}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="mb-4 font-bold"
                  style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 13, color: '#1568D3', letterSpacing: '0.06em' }}
                >
                  {step.num}
                </div>
                <h3 className="text-white font-semibold mb-2" style={{ fontSize: 16 }}>
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm" style={{ lineHeight: 1.7 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="data-label mb-2">Regulatory Position</p>
            <h2
              className="text-navy"
              style={{ fontSize: 36, fontWeight: 680, letterSpacing: '-0.02em' }}
            >
              Compliance & Transparency
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Research-Use Classification', body: 'All NexGen BioResearch compounds are classified and sold strictly as in-vitro research chemicals. They are not drugs, supplements, food products, or cosmetics as defined by FDA regulations.' },
              { title: 'Researcher Attestation Protocol', body: 'Every purchase requires a non-pre-checked digital attestation confirming the buyer is a qualified researcher purchasing for laboratory use only. This attestation is timestamped and logged with the order record, IP address, and customer email.' },
              { title: 'Labeling Compliance', body: 'All product labels and marketing copy undergo attorney review prior to publication. Prohibited content includes: health claims, disease treatment or prevention claims, dosing guidance, and testimonials implying human use.' },
              { title: 'Regulatory Attorney on Retainer', body: 'We maintain an active retainer with a regulatory attorney specializing in FDA enforcement and research chemical compliance. All new products and marketing materials are reviewed before publication.' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border border-frost"
                style={{ background: '#FAFBFD' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: '#E8F1FB' }}
                  >
                    <Shield size={15} style={{ color: '#1568D3' }} />
                  </div>
                  <div>
                    <h3 className="text-navy font-semibold mb-2 text-sm">{item.title}</h3>
                    <p className="text-slate text-sm" style={{ lineHeight: 1.7 }}>{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#F4F7FB' }} className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-navy mb-3"
            style={{ fontSize: 28, fontWeight: 680, letterSpacing: '-0.02em' }}
          >
            Ready to Start Your Research?
          </h2>
          <p className="text-slate text-sm mb-8" style={{ lineHeight: 1.7 }}>
            Browse our complete catalog of ISO 17025-verified research compounds.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/shop"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm"
            >
              Shop Compounds
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/coa"
              className="btn-outline inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm"
            >
              View COA Library
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
