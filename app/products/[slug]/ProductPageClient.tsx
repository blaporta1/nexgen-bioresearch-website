'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Download, ShoppingCart, ChevronRight, Shield, Thermometer, FlaskConical, QrCode, Info, CheckCircle, Plus, Minus } from 'lucide-react'
import { type Product } from '@/lib/products'
import { NexGenMark } from '@/components/NexGenLogo'
import { useCart } from '@/lib/cart-context'

interface Props {
  product: Product
  related: Product[]
}

export default function ProductPageClient({ product, related }: Props) {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-frost">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-slate">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-navy transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-navy">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left — Visual */}
          <div>
            <div
              className="rounded-2xl relative overflow-hidden"
              style={{ background: '#F4F7FB' }}
            >
              {/* Product image */}
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  padding: '24px',
                }}
              />
              {/* Purity overlay badge */}
              <div
                className="absolute top-4 left-4 rounded-xl px-3 py-2"
                style={{ background: 'rgba(14,27,46,0.75)', border: '1px solid rgba(21,104,211,0.4)', backdropFilter: 'blur(8px)' }}
              >
                <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#6BA3E2', letterSpacing: '0.06em' }}>HPLC PURITY</p>
                <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 22, fontWeight: 700, color: '#3A85E0' }}>{product.purity}</p>
              </div>
              {/* Batch overlay */}
              <div
                className="absolute bottom-4 right-4 rounded-xl px-3 py-2 text-right"
                style={{ background: 'rgba(14,27,46,0.75)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
              >
                <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>BATCH</p>
                <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{product.batchNumber}</p>
              </div>
            </div>

            {/* Spec table */}
            <div className="mt-6 rounded-2xl overflow-hidden border border-frost">
              <div className="px-5 py-3 flex items-center gap-2 border-b border-frost" style={{ background: '#F4F7FB' }}>
                <FlaskConical size={14} className="text-signal" />
                <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#5B6B80', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Technical Specifications
                </span>
              </div>
              {[
                { label: 'CAS Number', value: product.cas },
                { label: 'Molecular Formula', value: product.formula },
                { label: 'Molecular Weight', value: product.molecularWeight },
                { label: 'Purity (HPLC)', value: product.purity },
                { label: 'Batch Number', value: product.batchNumber },
                { label: 'Test Date', value: product.testDate },
                ...(product.sequence ? [{ label: 'Sequence', value: product.sequence }] : []),
              ].map(row => (
                <div key={row.label} className="flex items-start justify-between px-5 py-3 border-b border-frost last:border-0">
                  <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#5B6B80', letterSpacing: '0.04em', flexShrink: 0 }}>{row.label}</span>
                  <span style={{
                    fontFamily: 'var(--font-jetbrains)', fontSize: 11,
                    color: row.label === 'Purity (HPLC)' ? '#1568D3' : '#0E1B2E',
                    fontWeight: row.label === 'Purity (HPLC)' ? 700 : 500,
                    textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all',
                  }}>{row.value}</span>
                </div>
              ))}
            </div>

            <Link
              href={product.coaUrl}
              className="mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-medium text-signal border-signal/30 hover:bg-signal/5 transition-colors"
            >
              <Download size={16} />
              Download Certificate of Analysis (PDF)
              <span className="tag ml-1" style={{ background: '#E8F1FB', color: '#1568D3', border: '1px solid #B3CDEF', fontFamily: 'var(--font-jetbrains)' }}>COA</span>
            </Link>
          </div>

          {/* Right — Purchase */}
          <div>
            <div className="mb-1">
              <Link href={`/shop?category=${product.category}`} className="data-label hover:text-signal transition-colors">
                {product.categoryLabel}
              </Link>
            </div>
            <h1 className="text-navy mb-2" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {product.name}
            </h1>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="purity-badge">{product.purity} Purity</span>
              {product.tags.map(tag => (
                <span key={tag} className="tag" style={{ background: '#F4F7FB', color: '#5B6B80', border: '1px solid #C2D8E0', fontFamily: 'var(--font-jetbrains)' }}>{tag}</span>
              ))}
            </div>
            <p className="text-slate mb-8 text-sm" style={{ lineHeight: 1.75 }}>{product.description}</p>

            <PurchaseWidget product={product} />

            <div className="mt-6 rounded-xl p-4 border flex items-start gap-3" style={{ background: '#F4F7FB', borderColor: '#C2D8E0' }}>
              <Shield size={16} className="text-signal flex-shrink-0 mt-0.5" />
              <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80', lineHeight: 1.6, letterSpacing: '0.02em' }}>
                FOR IN-VITRO RESEARCH USE ONLY · NOT FOR HUMAN OR VETERINARY USE · PURCHASE REQUIRES RESEARCHER ATTESTATION
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: CheckCircle, label: 'ISO 17025 Tested' },
                { icon: Shield, label: 'Researcher Attested' },
                { icon: Thermometer, label: 'Cold Chain Shipped' },
                { icon: QrCode, label: 'COA QR on Every Vial' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon size={14} className="text-signal flex-shrink-0" />
                  <span className="text-slate text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductTabs product={product} />

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-navy mb-6" style={{ fontSize: 24, fontWeight: 680 }}>Frequently Bought Together</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(rp => (
                <Link key={rp.id} href={`/products/${rp.slug}`}>
                  <div className="product-card bg-white rounded-2xl border border-frost overflow-hidden cursor-pointer">
                    <div className="overflow-hidden" style={{ height: 140, background: '#F4F7FB' }}>
                      <img
                        src={rp.image}
                        alt={rp.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', padding: '12px' }}
                      />
                    </div>
                    <div className="p-4">
                      <p className="data-label mb-1">{rp.categoryLabel}</p>
                      <h3 className="text-navy font-semibold mb-2 text-sm">{rp.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="purity-badge">{rp.purity}</span>
                        <span className="text-navy font-bold">${rp.sizes[0].price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PurchaseWidget({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  const size = product.sizes[selectedSize]
  const total = (size.price * qty).toFixed(2)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addItem(product, size)
    router.push('/checkout')
  }

  return (
    <div className="rounded-2xl border border-frost p-6" style={{ background: '#FAFBFD' }}>
      {product.sizes.length > 1 && (
        <div className="mb-5">
          <p className="data-label mb-3">Select Size</p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s, i) => (
              <button
                key={s.sku}
                onClick={() => setSelectedSize(i)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                style={{
                  background: selectedSize === i ? '#0E1B2E' : 'white',
                  color: selectedSize === i ? 'white' : '#0E1B2E',
                  borderColor: selectedSize === i ? '#0E1B2E' : '#C2D8E0',
                }}
              >
                {s.mg > 0 ? `${s.mg}mg` : 'Kit'} — ${s.price.toFixed(2)}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mb-5">
        <p className="data-label mb-3">Quantity</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-lg border border-frost flex items-center justify-center text-navy hover:bg-cloud transition-colors">
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-navy font-semibold">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-lg border border-frost flex items-center justify-center text-navy hover:bg-cloud transition-colors">
            <Plus size={14} />
          </button>
          <span className="ml-2 text-slate text-sm">Total: <strong className="text-navy">${total}</strong></span>
        </div>
      </div>
      <p className="mb-4" style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80', letterSpacing: '0.06em' }}>
        SKU: {product.sizes[selectedSize]?.sku || product.batchNumber}
      </p>
      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all"
        style={{ background: added ? '#0F4FA8' : '#1568D3', boxShadow: '0 4px 16px rgba(21,104,211,0.3)' }}
      >
        <ShoppingCart size={16} />
        {added ? 'Added to Cart ✓' : 'Add to Cart'}
      </button>
      <button
        onClick={handleBuyNow}
        className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-navy border border-navy/20 hover:bg-cloud transition-colors"
      >
        Buy Now →
      </button>
    </div>
  )
}

function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState('mechanism')
  const tabs = [
    { id: 'mechanism', label: 'Mechanism' },
    { id: 'storage', label: 'Storage' },
    { id: 'compliance', label: 'Compliance' },
  ]

  return (
    <div className="mt-16 border-t border-frost pt-12">
      <div className="flex gap-1 mb-8 border-b border-frost">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="px-5 py-3 text-sm font-medium transition-all relative"
            style={{
              color: active === tab.id ? '#1568D3' : '#5B6B80',
              borderBottom: active === tab.id ? '2px solid #1568D3' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="max-w-3xl">
        {active === 'mechanism' && (
          <div>
            <h3 className="text-navy font-semibold mb-3" style={{ fontSize: 18 }}>Research Mechanism</h3>
            <p className="text-slate text-sm" style={{ lineHeight: 1.8 }}>{product.mechanism}</p>
            <div className="mt-6 rounded-xl p-4 border flex items-start gap-3" style={{ background: '#E8F1FB', borderColor: '#B3CDEF' }}>
              <Info size={15} className="text-signal flex-shrink-0 mt-0.5" />
              <p style={{ fontSize: 12, color: '#0F4FA8', lineHeight: 1.65 }}>
                This information is provided for research reference only. No claims are made regarding therapeutic efficacy or safety for human use.
              </p>
            </div>
          </div>
        )}
        {active === 'storage' && (
          <div>
            <h3 className="text-navy font-semibold mb-3" style={{ fontSize: 18 }}>Storage & Handling</h3>
            <div className="rounded-xl p-5 border mb-4" style={{ background: '#F4F7FB', borderColor: '#C2D8E0' }}>
              <div className="flex items-start gap-3">
                <Thermometer size={18} className="text-signal flex-shrink-0 mt-0.5" />
                <div>
                  <p className="data-label mb-2">Storage Protocol</p>
                  <p className="text-slate text-sm" style={{ lineHeight: 1.8 }}>{product.storage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {active === 'compliance' && (
          <div>
            <h3 className="text-navy font-semibold mb-3" style={{ fontSize: 18 }}>Research-Use Compliance</h3>
            <div className="space-y-4">
              {[
                'This compound is sold strictly for in-vitro laboratory and research purposes only.',
                'Not intended for human or veterinary use, consumption, or administration.',
                'Not a drug, supplement, or medical device as defined by the FDA.',
                'Purchase requires completion and logging of researcher attestation.',
                'Resale for human consumption is strictly prohibited.',
                'Buyer assumes all responsibility for legal and compliant use within their jurisdiction.',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Shield size={15} className="text-signal flex-shrink-0 mt-0.5" />
                  <p className="text-slate text-sm" style={{ lineHeight: 1.6 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
