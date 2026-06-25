export const metadata = { title: 'Refund Policy — NexGen BioResearch' }
export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="data-label mb-3">Legal</p>
        <h1 className="text-navy font-bold mb-2" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>Refund & Return Policy</h1>
        <p className="text-slate text-sm mb-10" style={{ fontFamily: 'var(--font-jetbrains)' }}>Last updated: 2026-06-01</p>
        <div className="space-y-6 text-slate text-sm" style={{ lineHeight: 1.8 }}>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Return Eligibility</h2>
            <p>Due to the nature of research chemical products, we do not accept returns of opened or used compounds. Unopened products in original sealed packaging may be eligible for return within 7 days of delivery, subject to evaluation.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Damaged or Incorrect Orders</h2>
            <p>If your order arrives damaged, temperature-compromised, or contains incorrect items, contact support@nexgenbio.com within 48 hours of delivery with photographic evidence. We evaluate all claims individually and typically provide replacement shipment for verified issues at no charge.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Quality Issues</h2>
            <p>If you believe a compound does not meet the purity specifications stated in the COA, contact us with specific test data from an ISO 17025 accredited laboratory. We investigate all quality complaints and will provide resolution including replacement or refund for verified quality failures.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Non-Returnable Items</h2>
            <p>Bacteriostatic water, syringes, and other consumable supplies that have been opened cannot be returned. All sales of opened research compounds are final.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Contact</h2>
            <p>For refund or return inquiries: support@nexgenbio.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
