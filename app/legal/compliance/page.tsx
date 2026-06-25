export const metadata = { title: 'Research-Use Compliance — NexGen BioResearch' }
export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="data-label mb-3">Legal</p>
        <h1 className="text-navy font-bold mb-2" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>Research-Use Compliance</h1>
        <p className="text-slate text-sm mb-10" style={{ fontFamily: 'var(--font-jetbrains)' }}>Last updated: 2026-06-01 · Reviewed by regulatory counsel</p>
        <div className="space-y-6 text-slate text-sm" style={{ lineHeight: 1.8 }}>
          <p>NexGen BioResearch operates in full compliance with applicable FDA guidelines governing the sale of research chemicals for in-vitro laboratory use. This page summarizes our compliance position and the controls we maintain.</p>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Product Classification</h2>
            <p>All NexGen products are classified as research chemicals for in-vitro laboratory use. They are not classified as, and are not marketed as, drugs, dietary supplements, medical devices, cosmetics, or food products under applicable FDA definitions.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Sitewide Compliance Controls</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All pages display a persistent "For Research Use Only — Not for Human or Veterinary Use" notice</li>
              <li>No health claims, treatment claims, or disease prevention language appears anywhere on this site</li>
              <li>No testimonials implying human use or therapeutic benefit are published</li>
              <li>No dosing information, administration protocols, or injection guidance is provided</li>
              <li>No before/after imagery of human subjects is used</li>
              <li>All marketing materials are reviewed by regulatory counsel prior to publication</li>
            </ul>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Regulatory Counsel</h2>
            <p>NexGen maintains an active retainer with a regulatory attorney specializing in FDA enforcement posture for research chemical vendors. All new product descriptions, marketing materials, and policy documents are reviewed prior to publication.</p>
          </section>
          <section>
            <h2 className="text-navy font-semibold text-lg mb-3">Contact for Compliance Inquiries</h2>
            <p>Regulatory inquiries, law enforcement requests, or FDA correspondence: legal@nexgenbio.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
