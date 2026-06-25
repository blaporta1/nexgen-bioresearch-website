export const metadata = { title: 'Terms of Sale — NexGen BioResearch' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="data-label mb-3">Legal</p>
        <h1 className="text-navy font-bold mb-2" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>Terms of Sale</h1>
        <p className="text-slate text-sm mb-10" style={{ fontFamily: 'var(--font-jetbrains)' }}>
          Last updated: 2026-06-01 · Reviewed by regulatory counsel
        </p>
        <div className="prose prose-sm max-w-none text-slate space-y-6" style={{ lineHeight: 1.8 }}>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">1. Research Use Only</h2>
            <p>All products sold by NexGen BioResearch LLC ("NexGen," "we," "us") are sold strictly and exclusively for in-vitro laboratory research purposes. These products are NOT intended for human or animal consumption, administration, therapeutic use, diagnostic use, or any other non-research purpose. By completing a purchase, you represent and warrant that you are a qualified researcher purchasing these compounds for legitimate scientific research conducted in a proper laboratory setting.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">2. No Medical Claims</h2>
            <p>NexGen makes no representations that any product sold has been approved by the FDA or any other regulatory agency for human or veterinary use. No product on this site is a drug, supplement, medical device, or dietary supplement as defined by applicable law. Nothing on this website constitutes medical advice.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">3. Buyer Liability</h2>
            <p>The buyer assumes sole and complete responsibility for compliance with all applicable local, state, and federal laws and regulations regarding the purchase, possession, and use of research compounds. NexGen shall not be liable for any misuse of products sold. The buyer indemnifies and holds harmless NexGen, its officers, employees, and agents from any claims arising from buyer's use of products outside the stated research-only scope.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">4. No Resale for Human Use</h2>
            <p>Resale or transfer of any NexGen product for human or animal consumption is strictly prohibited and constitutes a material breach of these Terms. Buyers who resell products for non-research purposes waive all rights to returns or refunds and may be reported to relevant regulatory authorities.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">5. Attestation Logging</h2>
            <p>All purchase transactions require a researcher attestation. This attestation is logged with the order timestamp, buyer email address, IP address, and order ID. This information is retained in accordance with our Privacy Policy and may be disclosed to law enforcement or regulatory agencies if required by law.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">6. Jurisdiction</h2>
            <p>These Terms are governed by the laws of the United States and the state in which NexGen BioResearch LLC is incorporated, without regard to conflicts of law principles. Disputes shall be resolved through binding arbitration in accordance with AAA Commercial Arbitration Rules.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
