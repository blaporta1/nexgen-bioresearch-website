import Link from 'next/link'
import NexGenLogo from './NexGenLogo'
import { NexGenMark } from './NexGenLogo'

const FOOTER_LINKS = {
  Products: [
    { label: 'Single Peptides', href: '/shop?category=single-peptides' },
    { label: 'Peptide Blends', href: '/shop?category=peptide-blends' },
    { label: 'Wolverine Stack', href: '/shop?category=wolverine-stack' },
    { label: 'Reconstitution Supplies', href: '/shop?category=reconstitution' },
    { label: 'View All', href: '/shop' },
  ],
  Research: [
    { label: 'COA Library', href: '/coa' },
    { label: 'About NexGen', href: '/about' },
    { label: 'Lab Standards', href: '/about#lab-standards' },
    { label: 'FAQ', href: '/faq' },
  ],
  Legal: [
    { label: 'Terms of Sale', href: '/legal/terms' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Refund Policy', href: '/legal/refunds' },
    { label: 'Shipping Policy', href: '/legal/shipping' },
    { label: 'Research-Use Compliance', href: '/legal/compliance' },
  ],
  Contact: [
    { label: 'support@nexgenbio.com', href: 'mailto:support@nexgenbio.com' },
    { label: 'Wholesale Inquiries', href: '/wholesale' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <NexGenLogo variant="light" size="md" />
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
              Advancing peptide science through rigorous third-party testing,
              complete COA transparency, and research-grade standards.
            </p>
            <div className="mt-6 flex gap-3">
              <span className="tag bg-signal-10/10 text-signal-60 border border-signal/20">
                ISO 17025 Tested
              </span>
              <span className="tag bg-white/5 text-white/40 border border-white/10">
                US-Based
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4
                className="text-[11px] font-mono uppercase tracking-widest text-white/30 mb-4"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Disclaimer */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white/4 border border-white/8 rounded-xl p-5">
            <p
              className="text-[11px] text-white/40 leading-relaxed"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              <span className="text-white/60 font-semibold">RESEARCH USE ONLY DISCLAIMER:</span>{' '}
              All products sold by NexGen BioResearch are strictly for in-vitro research and laboratory
              use only. They are not intended for human or veterinary use, diagnosis, treatment, or
              prevention of any disease or condition. These statements have not been evaluated by the
              Food and Drug Administration (FDA). NexGen BioResearch products are not drugs, supplements,
              or medical devices. By purchasing, you acknowledge that you are a qualified researcher and
              that these compounds will be used solely in a controlled laboratory setting in accordance with
              all applicable local, state, and federal laws and regulations. Misuse of research compounds
              is strictly prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-[11px] text-white/30"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            © 2026 NEXGEN BIORESEARCH LLC. ALL RIGHTS RESERVED. · NEXGENBIO.COM
          </p>
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
              Terms
            </Link>
            <Link href="/legal/compliance" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
              Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
