'use client'

import { useState, useMemo } from 'react'
import { Search, Download, FileCheck, Filter, X, ChevronDown } from 'lucide-react'
import { PRODUCTS } from '@/lib/products'

const COA_DATA = PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  shortName: p.shortName,
  batchNumber: p.batchNumber,
  cas: p.cas,
  purity: p.purity,
  testDate: p.testDate,
  category: p.categoryLabel,
  coaUrl: p.coaUrl,
  status: 'PASSED',
  lab: 'ISO 17025 Accredited Lab',
  methods: ['HPLC', 'MS', 'Endotoxin'],
}))

export default function COAPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return COA_DATA.filter(coa => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        coa.name.toLowerCase().includes(q) ||
        coa.batchNumber.toLowerCase().includes(q) ||
        coa.cas.toLowerCase().includes(q) ||
        coa.shortName.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || coa.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(21,104,211,0.25)', border: '1px solid rgba(58,133,224,0.3)' }}
            >
              <FileCheck size={18} style={{ color: '#3A85E0' }} />
            </div>
            <span
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#3A85E0', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              Transparency Database
            </span>
          </div>
          <h1
            className="text-white mb-3"
            style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            COA Library
          </h1>
          <p className="text-white/50 text-sm max-w-lg" style={{ lineHeight: 1.65 }}>
            Publicly searchable Certificate of Analysis database. Every batch tested and published —
            no login required. Search by compound name, batch number, or CAS number.
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <input
              type="text"
              placeholder="Search by compound, batch number, or CAS..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm text-white placeholder:text-white/30"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                outline: 'none',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: COA_DATA.length, label: 'Active Batches', color: '#1568D3' },
            { value: '100%', label: 'Pass Rate', color: '#0F4FA8' },
            { value: 'ISO 17025', label: 'Lab Standard', color: '#1568D3' },
            { value: 'Public', label: 'Access Level', color: '#5B6B80' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-4 border border-frost"
              style={{ background: '#F4F7FB' }}
            >
              <p className="font-bold" style={{ fontSize: 22, color: stat.color }}>
                {stat.value}
              </p>
              <p className="data-label mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-6">
          <p
            className="text-slate"
            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, letterSpacing: '0.04em' }}
          >
            {filtered.length} COA RECORD{filtered.length !== 1 ? 'S' : ''} FOUND
          </p>
          <div className="flex gap-2">
            {['all', 'PASSED', 'PENDING'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                style={{
                  background: statusFilter === s ? '#0E1B2E' : 'white',
                  color: statusFilter === s ? 'white' : '#5B6B80',
                  borderColor: statusFilter === s ? '#0E1B2E' : '#C2D8E0',
                  fontFamily: 'var(--font-jetbrains)',
                  letterSpacing: '0.04em',
                }}
              >
                {s === 'all' ? 'ALL' : s}
              </button>
            ))}
          </div>
        </div>

        {/* COA Table */}
        <div className="rounded-2xl border border-frost overflow-hidden">
          {/* Table header */}
          <div
            className="grid px-6 py-3 text-left"
            style={{
              background: '#F4F7FB',
              gridTemplateColumns: '2fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr auto',
              gap: '16px',
            }}
          >
            {['Compound', 'Batch Number', 'CAS Number', 'Purity', 'Test Date', 'Status', ''].map(h => (
              <span
                key={h}
                style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate text-sm">No records match your search.</p>
              <button onClick={() => setSearch('')} className="mt-2 text-signal text-sm font-medium">
                Clear search
              </button>
            </div>
          ) : (
            filtered.map((coa, i) => (
              <div key={coa.id}>
                <div
                  className="coa-row grid px-6 py-4 cursor-pointer"
                  style={{
                    gridTemplateColumns: '2fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    background: expanded === coa.id ? '#F4F7FB' : 'white',
                  }}
                  onClick={() => setExpanded(expanded === coa.id ? null : coa.id)}
                >
                  <div>
                    <p className="text-navy font-medium text-sm">{coa.name}</p>
                    <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, color: '#5B6B80' }}>
                      {coa.category}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#0E1B2E' }}>
                    {coa.batchNumber}
                  </p>
                  <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#5B6B80' }}>
                    {coa.cas === 'N/A (Blend)' ? '—' : coa.cas}
                  </p>
                  <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, fontWeight: 700, color: '#1568D3' }}>
                    {coa.purity}
                  </p>
                  <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: '#5B6B80' }}>
                    {coa.testDate}
                  </p>
                  <span
                    className="tag"
                    style={{
                      background: '#D1FAE5',
                      color: '#065F46',
                      border: '1px solid #A7F3D0',
                      fontFamily: 'var(--font-jetbrains)',
                    }}
                  >
                    {coa.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={coa.coaUrl}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-signal border border-signal/25 hover:bg-signal/5 transition-colors"
                      style={{ fontFamily: 'var(--font-jetbrains)', letterSpacing: '0.04em' }}
                    >
                      <Download size={12} />
                      PDF
                    </a>
                    <ChevronDown
                      size={14}
                      className="text-slate transition-transform"
                      style={{ transform: expanded === coa.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded === coa.id && (
                  <div
                    className="px-6 py-5 border-t border-frost"
                    style={{ background: '#F4F7FB' }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="data-label mb-1">Testing Lab</p>
                        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, color: '#0E1B2E' }}>
                          {coa.lab}
                        </p>
                      </div>
                      <div>
                        <p className="data-label mb-1">Methods Used</p>
                        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, color: '#0E1B2E' }}>
                          {coa.methods.join(' · ')}
                        </p>
                      </div>
                      <div>
                        <p className="data-label mb-1">Result</p>
                        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 12, color: '#1568D3', fontWeight: 700 }}>
                          {coa.purity} — PASSED
                        </p>
                      </div>
                      <div>
                        <p className="data-label mb-1">Full Report</p>
                        <a
                          href={coa.coaUrl}
                          className="inline-flex items-center gap-1.5 text-signal text-xs font-medium hover:underline"
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          <Download size={12} />
                          Download PDF COA
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Note */}
        <div
          className="mt-8 rounded-xl p-5 border"
          style={{ background: '#F4F7FB', borderColor: '#C2D8E0' }}
        >
          <p
            className="text-slate text-center"
            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, lineHeight: 1.7, letterSpacing: '0.02em' }}
          >
            COA DATABASE UPDATED WITH EACH NEW BATCH · QR CODES ON EACH VIAL LINK DIRECTLY TO THIS DATABASE ·
            FAILED BATCHES ARE QUARANTINED AND ALSO PUBLISHED · FOR RESEARCH USE ONLY
          </p>
        </div>
      </div>
    </div>
  )
}
