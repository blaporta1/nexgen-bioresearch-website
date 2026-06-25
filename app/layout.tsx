import type { Metadata } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/SiteShell'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'NexGen BioResearch — Precision Peptide Science',
    template: '%s | NexGen BioResearch',
  },
  description:
    'Research-grade peptides with ISO 17025 third-party COA verification. BPC-157, TB-500, Semaglutide, CJC-1295 and more. For in-vitro laboratory research use only.',
  keywords: [
    'research peptides',
    'buy BPC-157 research',
    'HPLC tested peptides',
    'research grade TB-500',
    'peptide COA',
    'laboratory peptides',
    'NexGen BioResearch',
  ],
  openGraph: {
    type: 'website',
    siteName: 'NexGen BioResearch',
    title: 'NexGen BioResearch — Precision Peptide Science',
    description:
      'Research-grade peptides with ISO 17025 third-party COA verification. For in-vitro laboratory research use only.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
