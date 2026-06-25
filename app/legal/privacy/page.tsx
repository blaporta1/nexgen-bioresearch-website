export const metadata = { title: 'Privacy Policy — NexGen BioResearch' }
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="data-label mb-3">Legal</p>
        <h1 className="text-navy font-bold mb-2" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>Privacy Policy</h1>
        <p className="text-slate text-sm mb-10" style={{ fontFamily: 'var(--font-jetbrains)' }}>Last updated: 2026-06-01</p>
        <div className="space-y-6 text-slate text-sm" style={{ lineHeight: 1.8 }}>
          <p>NexGen BioResearch LLC ("NexGen") is committed to protecting your privacy. This policy describes how we collect, use, and protect your personal information.</p>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Information We Collect</h2>
            <p>We collect information you provide directly: name, email address, shipping address, payment information (processed by our payment processor — we do not store card numbers), researcher attestation records, institution name, and order details. We also collect automatically: IP address, browser type, pages visited, and transaction timestamps.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">How We Use Your Information</h2>
            <p>We use your information to: process and fulfill orders, send order confirmations and tracking information, maintain researcher attestation logs (required for compliance), respond to support inquiries, send research newsletters (with consent), and comply with legal obligations including responses to law enforcement and regulatory agency requests.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Attestation Record Retention</h2>
            <p>Researcher attestation records (including timestamp, IP address, order ID, and buyer email) are retained for a minimum of 3 years from the date of purchase. These records may be disclosed to law enforcement, regulatory agencies (including the FDA), or courts when required by applicable law or valid legal process.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">California Privacy Rights (CCPA)</h2>
            <p>California residents have the right to request disclosure of personal information collected, request deletion of personal information, and opt out of sale of personal information. NexGen does not sell personal information to third parties. To exercise your rights, contact privacy@nexgenbio.com.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Contact</h2>
            <p>Privacy inquiries: privacy@nexgenbio.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
