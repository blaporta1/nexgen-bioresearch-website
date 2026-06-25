'use client'

import { useState } from 'react'
import { ChevronDown, Truck, Thermometer, FlaskConical, FileCheck, Shield } from 'lucide-react'

const FAQ_SECTIONS = [
  {
    id: 'shipping',
    icon: Truck,
    title: 'Shipping',
    color: '#1568D3',
    faqs: [
      {
        q: 'What shipping methods do you offer?',
        a: 'We ship via UPS and FedEx with 2-day delivery as the standard for all orders. Overnight shipping is available at checkout for an additional fee. All peptide orders include cold pack insulation and tamper-evident packaging. A tracking number is emailed upon fulfillment.',
      },
      {
        q: 'Do you ship temperature-sensitive peptides with cold packs?',
        a: 'Yes — all lyophilized peptide orders include validated cold pack insulation sufficient for 2-day transit. For particularly heat-sensitive compounds (e.g., Follistatin 344, CJC-1295), we include additional insulation and recommend immediate refrigeration upon receipt.',
      },
      {
        q: 'What states do you ship to?',
        a: 'We currently ship to all 50 U.S. states. We monitor state-level legislative developments and may implement geographic restrictions for specific compounds as the regulatory landscape evolves. International shipping is not currently available.',
      },
      {
        q: 'How quickly do orders ship?',
        a: 'Orders placed before 12:00 PM EST on business days are typically fulfilled and shipped same-day. Orders placed after 12:00 PM or on weekends ship the next business day. You will receive a tracking number via email when your order ships.',
      },
      {
        q: 'What if my package arrives damaged or thawed?',
        a: 'Contact our support team within 48 hours of delivery with photos of the packaging and product condition. We evaluate all claims individually and typically provide replacement shipment for verified temperature excursion or damage incidents.',
      },
    ],
  },
  {
    id: 'storage',
    icon: Thermometer,
    title: 'Storage & Handling',
    color: '#0F4FA8',
    faqs: [
      {
        q: 'How should I store lyophilized peptides?',
        a: 'Lyophilized (freeze-dried) peptides should be stored at −20°C for general long-term storage. For very long-term storage (12+ months), −80°C is recommended for optimal stability. Keep vials sealed, protected from light, and away from moisture until ready for use.',
      },
      {
        q: 'What should I use to reconstitute peptides for laboratory use?',
        a: 'For in-vitro research applications, sterile bacteriostatic water (0.9% benzyl alcohol, USP grade) is the standard reconstitution vehicle for most peptides. Some compounds require specific buffer systems — consult the product\'s COA and technical documentation. We offer USP-grade bacteriostatic water in our reconstitution supplies category.',
      },
      {
        q: 'How long are reconstituted peptides stable?',
        a: 'Stability varies by compound, but most reconstituted peptide solutions maintain quality for 14–30 days when refrigerated at 2–8°C and protected from light. Avoid repeated freeze-thaw cycles of reconstituted solutions. Single-use aliquoting is recommended for compounds requiring extended storage post-reconstitution.',
      },
      {
        q: 'What happens if peptides are exposed to heat during shipping?',
        a: 'Lyophilized peptides are generally more heat-stable than liquid formulations. Brief temperature excursions during transit are typically not damaging to lyophilized compounds. However, if you observe signs of degradation (discoloration, clumping, unusual odor), contact us before use and do not proceed with the research batch.',
      },
    ],
  },
  {
    id: 'purity',
    icon: FlaskConical,
    title: 'Purity Testing',
    color: '#1568D3',
    faqs: [
      {
        q: 'What testing methods do you use to verify purity?',
        a: 'Every batch undergoes: (1) HPLC (High-Performance Liquid Chromatography) for quantitative purity determination, (2) Mass Spectrometry for molecular identity confirmation, (3) LAL Endotoxin Assay for endotoxin levels, and (4) Residual Solvent Screening. The full panel is reported in the Certificate of Analysis.',
      },
      {
        q: 'Do you test in-house or use third-party labs?',
        a: 'We use exclusively third-party ISO 17025 accredited laboratories. We do not perform in-house testing. This is a deliberate policy to eliminate any conflict of interest in our purity reporting. The testing lab is identified in each COA.',
      },
      {
        q: 'What is your minimum purity threshold?',
        a: 'Our minimum release threshold is 98.5% purity by HPLC. Any batch that falls below this threshold is quarantined and not released for sale. The failed Certificate of Analysis is still published in our COA database — we do not suppress failed results.',
      },
      {
        q: 'What does "HPLC purity" actually measure?',
        a: 'HPLC purity measures the percentage of the target peptide relative to all UV-absorbing species detected in the chromatogram. A 99.4% HPLC purity result means that 99.4% of detectable material is the correct compound. Mass spectrometry confirms the molecular weight matches the theoretical value for the compound.',
      },
      {
        q: 'Can I request additional testing on a specific batch?',
        a: 'Wholesale accounts with established relationships can request additional batch-specific testing (e.g., additional endotoxin quantification, sterility testing). Contact our wholesale team to discuss custom testing requirements.',
      },
    ],
  },
  {
    id: 'coa',
    icon: FileCheck,
    title: 'Certificates of Analysis',
    color: '#0F4FA8',
    faqs: [
      {
        q: 'Where can I find the COA for my order?',
        a: 'COAs are accessible three ways: (1) Scan the QR code printed on each vial label, (2) Search our public COA Library at nexgenbio.com/coa using your batch number, (3) The COA download link is included in your order confirmation email. No account login is required to access COAs.',
      },
      {
        q: 'What information is included in the COA?',
        a: 'Each COA includes: compound name, CAS number, batch/lot number, synthesis date, test date, testing laboratory identity, HPLC purity percentage with chromatogram, mass spectrometry data, endotoxin result, residual solvent results, storage recommendations, and pass/fail determination.',
      },
      {
        q: 'Are COAs publicly accessible?',
        a: 'Yes. Our COA database is publicly accessible with no login required. We believe COA transparency is a fundamental right for researchers — not a gated feature. Search by compound name, batch number, or CAS number at nexgenbio.com/coa.',
      },
      {
        q: 'What happens if a batch fails testing?',
        a: 'The batch is immediately quarantined and placed on hold. It is not released for sale under any circumstances. The failed COA is uploaded to the public database and marked as "FAILED" — we do not delete or hide failed results. Inventory from failed batches is destroyed, and our supplier is notified for investigation.',
      },
      {
        q: 'How often are batches tested?',
        a: 'Every new production batch is tested before release. We do not test representative samples — every lot that enters inventory undergoes the full testing panel. For high-turnover compounds, this means quarterly or more frequent batch testing depending on inventory cycles.',
      },
    ],
  },
  {
    id: 'compliance',
    icon: Shield,
    title: 'Research-Use Compliance',
    color: '#1568D3',
    faqs: [
      {
        q: 'Who can purchase from NexGen BioResearch?',
        a: 'Our compounds are sold to licensed researchers, scientists, laboratory professionals, and qualified individuals purchasing for legitimate in-vitro research purposes. All purchasers must complete our researcher attestation at checkout. We reserve the right to refuse orders that appear inconsistent with research use.',
      },
      {
        q: 'What is the researcher attestation?',
        a: 'The researcher attestation is a mandatory, non-pre-checked checkbox at checkout requiring the buyer to confirm: (1) they are a qualified researcher purchasing for laboratory use only, (2) the compound will not be used for human or animal administration, (3) they are 18 years of age or older. This attestation is timestamped and logged with every order.',
      },
      {
        q: 'Are these compounds legal to purchase?',
        a: 'Research peptides occupy a complex regulatory position that varies by compound and jurisdiction. These compounds are not FDA-approved drugs, and selling them as such would be illegal. As research chemicals for in-vitro use, most peptides are legal to purchase and possess in the United States. However, regulatory status can change, and we strongly recommend consulting with legal counsel if you have specific compliance questions.',
      },
      {
        q: 'Do you sell to international customers?',
        a: 'We currently ship within the United States only. International regulatory frameworks for research peptides vary significantly by country, and we do not ship internationally at this time.',
      },
      {
        q: 'Can I use these compounds for animal research?',
        a: 'Our compounds are sold for in-vitro (cell culture, biochemical assay) laboratory research only. They are not sold for use in live animal research, veterinary applications, or human subjects. Any use in live animals would require IACUC approval and falls outside the scope of our approved use case.',
      },
      {
        q: 'What should I do if I have a regulatory or legal question?',
        a: 'For general compliance questions, our support team can share our compliance documentation. For legal advice specific to your situation or institution, please consult with a regulatory attorney. We cannot provide legal advice.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openSections, setOpenSections] = useState<Record<string, string | null>>(
    Object.fromEntries(FAQ_SECTIONS.map(s => [s.id, null]))
  )

  const toggle = (sectionId: string, q: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] === q ? null : q,
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div
        className="relative overflow-hidden pt-14 pb-12"
        style={{ background: 'linear-gradient(135deg, #0E1B2E 0%, #0D2A60 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle, #3A85E0 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p
            className="mb-3"
            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#3A85E0', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Support Center
          </p>
          <h1
            className="text-white mb-3"
            style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-white/50 text-sm max-w-md" style={{ lineHeight: 1.65 }}>
            Technical, compliance, and operational information for researchers working with
            NexGen BioResearch compounds.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-frost sticky top-[89px] z-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-1">
            {FAQ_SECTIONS.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-slate hover:text-navy hover:bg-cloud"
              >
                <section.icon size={14} />
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {FAQ_SECTIONS.map(section => (
            <div key={section.id} id={section.id}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#E8F1FB' }}
                >
                  <section.icon size={18} style={{ color: section.color }} />
                </div>
                <h2
                  className="text-navy"
                  style={{ fontSize: 24, fontWeight: 680, letterSpacing: '-0.01em' }}
                >
                  {section.title}
                </h2>
              </div>

              {/* FAQs */}
              <div className="space-y-2">
                {section.faqs.map(faq => (
                  <div
                    key={faq.q}
                    className="rounded-2xl border overflow-hidden transition-colors"
                    style={{
                      borderColor: openSections[section.id] === faq.q ? '#B3CDEF' : '#E8EEF4',
                      background: openSections[section.id] === faq.q ? '#FAFCFF' : 'white',
                    }}
                  >
                    <button
                      onClick={() => toggle(section.id, faq.q)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left"
                    >
                      <span className="text-navy font-medium text-sm pr-4" style={{ lineHeight: 1.5 }}>
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={16}
                        className="text-slate flex-shrink-0 transition-transform"
                        style={{
                          transform: openSections[section.id] === faq.q ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>
                    {openSections[section.id] === faq.q && (
                      <div className="px-6 pb-5">
                        <div className="h-px bg-frost mb-4" />
                        <p className="text-slate text-sm" style={{ lineHeight: 1.8 }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div
          className="mt-16 rounded-2xl p-8 text-center border"
          style={{ background: '#F4F7FB', borderColor: '#C2D8E0' }}
        >
          <h3 className="text-navy font-semibold mb-2" style={{ fontSize: 20 }}>
            Still have questions?
          </h3>
          <p className="text-slate text-sm mb-6" style={{ lineHeight: 1.7 }}>
            Our research support team responds within 2 business hours Monday–Friday.
          </p>
          <a
            href="mailto:support@nexgenbio.com"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm"
          >
            Email Support Team
          </a>
        </div>
      </div>
    </div>
  )
}
