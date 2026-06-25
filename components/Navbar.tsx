'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'
import NexGenLogo from './NexGenLogo'
import { useCart } from '@/lib/cart-context'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'COA Library', href: '/coa' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count: cartCount } = useCart()
  const pathname = usePathname()

  useEffect(() => {
    // Set initial state based on current scroll position
    setScrolled(window.scrollY > 20)
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isHeroPage = pathname === '/'
  // True when we want the dark-hero treatment (top of homepage only)
  const heroMode = isHeroPage && !scrolled

  return (
    <>
      {/* Compliance Banner */}
      <div className="compliance-banner">
        FOR IN-VITRO RESEARCH AND LABORATORY USE ONLY · NOT FOR HUMAN OR VETERINARY USE ·{' '}
        <span style={{ color: '#3A85E0' }}>NEXGENBIORESEARCH.COM</span>
      </div>

      {/* Main Nav */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: heroMode
            ? 'rgba(10, 18, 36, 0.82)'
            : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: heroMode
            ? '1px solid rgba(255,255,255,0.07)'
            : '1px solid rgba(14,27,46,0.08)',
          boxShadow: heroMode ? 'none' : '0 1px 20px rgba(14,27,46,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo — always visible: white on dark hero, navy on white nav */}
          <Link href="/" className="flex-shrink-0">
            <NexGenLogo
              variant={heroMode ? 'light' : 'dark'}
              size="sm"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-150"
                style={{
                  color: pathname === link.href
                    ? '#1568D3'
                    : heroMode
                    ? 'rgba(255,255,255,0.75)'
                    : 'rgba(14,27,46,0.65)',
                }}
                onMouseEnter={e => {
                  if (pathname !== link.href)
                    (e.currentTarget as HTMLElement).style.color = heroMode ? '#fff' : '#0E1B2E'
                }}
                onMouseLeave={e => {
                  if (pathname !== link.href)
                    (e.currentTarget as HTMLElement).style.color = heroMode
                      ? 'rgba(255,255,255,0.75)'
                      : 'rgba(14,27,46,0.65)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: heroMode ? 'rgba(255,255,255,0.75)' : 'rgba(14,27,46,0.65)' }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-signal text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* CTA */}
            <Link
              href="/shop"
              className="hidden md:flex btn-primary px-4 py-2 rounded-lg text-sm"
            >
              Shop Peptides
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: heroMode ? '#fff' : '#0E1B2E' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-frost">
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-2 border-b border-cloud ${
                    pathname === link.href ? 'text-signal' : 'text-navy/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="btn-primary px-4 py-3 rounded-lg text-sm text-center mt-2"
              >
                Shop Peptides
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
