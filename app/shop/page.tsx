'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, ChevronRight, FileCheck, X } from 'lucide-react'
import { PRODUCTS, CATEGORIES, type Product } from '@/lib/products'
import { NexGenMark } from '@/components/NexGenLogo'

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q) ||
          p.cas.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (sortBy === 'price-asc') list.sort((a, b) => a.sizes[0].price - b.sizes[0].price)
    else if (sortBy === 'price-desc') list.sort((a, b) => b.sizes[0].price - a.sizes[0].price)
    else if (sortBy === 'purity') list.sort((a, b) => parseFloat(b.purity) - parseFloat(a.purity))
    else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return list
  }, [activeCategory, searchQuery, sortBy])

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
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
            className="mb-2"
            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#3A85E0', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Research Catalog
          </p>
          <h1
            className="text-white mb-3"
            style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            Peptide Compounds
          </h1>
          <p className="text-white/50 text-sm max-w-md" style={{ lineHeight: 1.6 }}>
            All compounds are tested by ISO 17025 accredited third-party laboratories.
            For in-vitro research use only.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
            <input
              type="text"
              placeholder="Search compounds, CAS numbers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-frost bg-cloud text-navy text-sm placeholder:text-slate focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all"
              style={{ outline: 'none' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-navy"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: activeCategory === cat.id ? '#0E1B2E' : '#F4F7FB',
                  color: activeCategory === cat.id ? '#FFFFFF' : '#5B6B80',
                  border: `1px solid ${activeCategory === cat.id ? '#0E1B2E' : '#C2D8E0'}`,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-frost bg-cloud text-navy text-sm ml-auto"
            style={{ outline: 'none', cursor: 'pointer' }}
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="purity">Highest Purity</option>
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p
            className="text-slate"
            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, letterSpacing: '0.04em' }}
          >
            {filtered.length} COMPOUND{filtered.length !== 1 ? 'S' : ''} FOUND
          </p>
          <div className="flex items-center gap-2">
            <FileCheck size={14} className="text-signal" />
            <span
              className="text-signal"
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, letterSpacing: '0.04em' }}
            >
              ALL COA VERIFIED
            </span>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <NexGenMark size={48} navyColor="#C2D8E0" signalColor="#C2D8E0" />
            <p className="text-slate mt-4 text-sm">No compounds match your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
              className="mt-4 text-signal text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Research disclaimer */}
      <div
        className="mt-12 mx-6 mb-12 max-w-7xl xl:mx-auto rounded-xl p-5 border"
        style={{ background: '#F4F7FB', borderColor: '#C2D8E0' }}
      >
        <p
          className="text-slate text-center"
          style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, lineHeight: 1.7, letterSpacing: '0.02em' }}
        >
          FOR IN-VITRO RESEARCH AND LABORATORY USE ONLY · NOT INTENDED FOR HUMAN OR VETERINARY USE ·
          PURCHASE REQUIRES RESEARCHER ATTESTATION · NOT EVALUATED BY THE FDA
        </p>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="product-card bg-white rounded-2xl border border-frost overflow-hidden h-full flex flex-col cursor-pointer">
        {/* Product image */}
        <div
          className="relative overflow-hidden"
          style={{ height: 200, background: '#F4F7FB' }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
          {product.featured && (
            <span
              className="absolute top-3 left-3 tag"
              style={{
                background: '#1568D3',
                color: 'white',
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              FEATURED
            </span>
          )}
          {product.category === 'wolverine-stack' && (
            <span
              className="absolute top-3 right-3 tag"
              style={{
                background: '#0F4FA8',
                color: 'white',
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              BUNDLE
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <p className="data-label mb-1.5">{product.categoryLabel}</p>
          <h3 className="text-navy font-semibold mb-1" style={{ fontSize: 15, fontWeight: 600 }}>
            {product.name}
          </h3>
          <p
            className="text-slate mb-3"
            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, letterSpacing: '0.04em' }}
          >
            CAS: {product.cas}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="tag"
                style={{ background: '#F4F7FB', color: '#5B6B80', border: '1px solid #C2D8E0', fontFamily: 'var(--font-jetbrains)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Purity + Price */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="purity-badge">{product.purity}</span>
              <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80', letterSpacing: '0.04em' }}>
                HPLC Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy font-bold" style={{ fontSize: 18 }}>
                from ${product.sizes[0].price.toFixed(2)}
              </span>
              <span className="text-signal flex items-center gap-0.5 text-xs font-medium">
                Details
                <ChevronRight size={13} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
