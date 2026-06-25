'use client'

import Link from 'next/link'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Shield } from 'lucide-react'
import { NexGenMark } from '@/components/NexGenLogo'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart()
  const shipping = items.length > 0 ? 12.99 : 0

  return (
    <div className="min-h-screen bg-cloud py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-navy font-bold mb-8" style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-frost p-16 text-center">
            <ShoppingCart size={40} className="text-slate mx-auto mb-4" />
            <p className="text-navy font-semibold mb-2">Your cart is empty</p>
            <p className="text-slate text-sm mb-6">Add research compounds to get started.</p>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
              Browse Compounds
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-frost p-5 flex items-center gap-5">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F4F7FB' }}
                  >
                    <NexGenMark size={32} navyColor="#0E1B2E" signalColor="#1568D3" />
                  </div>
                  <div className="flex-1">
                    <p className="data-label mb-0.5">{item.category}</p>
                    <p className="text-navy font-semibold text-sm mb-1">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="purity-badge" style={{ fontSize: 10 }}>{item.purity}</span>
                      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: '#5B6B80' }}>{item.sku}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-frost flex items-center justify-center text-navy hover:bg-cloud">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-navy text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-frost flex items-center justify-center text-navy hover:bg-cloud">
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-navy font-bold w-20 text-right">${(item.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-slate hover:text-red-500 transition-colors ml-2">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-white rounded-2xl border border-frost p-6 sticky top-32">
                <h2 className="text-navy font-semibold mb-5 text-sm">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate">Subtotal ({items.length} items)</span>
                    <span className="text-navy">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate">Shipping (2-day cold chain)</span>
                    <span className="text-navy">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-frost pt-3 flex justify-between">
                    <span className="text-navy font-bold">Total</span>
                    <span className="text-navy font-bold">${(subtotal + shipping).toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white"
                >
                  Proceed to Checkout
                  <ArrowRight size={15} />
                </Link>
                <div className="mt-4 flex items-start gap-2">
                  <Shield size={12} className="text-signal flex-shrink-0 mt-0.5" />
                  <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80', lineHeight: 1.55, letterSpacing: '0.02em' }}>
                    RESEARCHER ATTESTATION REQUIRED AT CHECKOUT · FOR RESEARCH USE ONLY
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
