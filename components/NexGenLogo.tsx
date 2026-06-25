'use client'

interface NexGenLogoProps {
  variant?: 'dark' | 'light' | 'signal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showWordmark?: boolean
  className?: string
}

const sizes = {
  sm: { mark: 20, wordSize: 14 },
  md: { mark: 28, wordSize: 18 },
  lg: { mark: 36, wordSize: 24 },
  xl: { mark: 48, wordSize: 32 },
}

export function NexGenMark({ size = 28, navyColor = '#0E1B2E', signalColor = '#1568D3' }: {
  size?: number
  navyColor?: string
  signalColor?: string
}) {
  // Dotted X mark — two intertwining amino acid chains
  const s = size
  const r = s * 0.072  // dot radius scales with size
  const swellR = s * 0.10  // center swell

  // Strand A (Navy) — top-left to bottom-right
  const strandA = [
    { x: s * 0.14, y: s * 0.10 },
    { x: s * 0.28, y: s * 0.25 },
    { x: s * 0.38, y: s * 0.38 },
    { x: s * 0.50, y: s * 0.50 }, // center swell
    { x: s * 0.62, y: s * 0.62 },
    { x: s * 0.74, y: s * 0.76 },
    { x: s * 0.86, y: s * 0.90 },
  ]

  // Strand B (Signal Blue) — top-right to bottom-left
  const strandB = [
    { x: s * 0.86, y: s * 0.10 },
    { x: s * 0.72, y: s * 0.25 },
    { x: s * 0.62, y: s * 0.38 },
    { x: s * 0.50, y: s * 0.50 }, // center swell
    { x: s * 0.38, y: s * 0.62 },
    { x: s * 0.28, y: s * 0.76 },
    { x: s * 0.14, y: s * 0.90 },
  ]

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strand A — Navy */}
      {strandA.map((dot, i) => (
        <circle
          key={`a-${i}`}
          cx={dot.x}
          cy={dot.y}
          r={i === 3 ? swellR : r * (1 - Math.abs(i - 3) * 0.06)}
          fill={navyColor}
          opacity={i === 3 ? 1 : 0.85 - Math.abs(i - 3) * 0.08}
        />
      ))}
      {/* Strand B — Signal Blue */}
      {strandB.map((dot, i) => (
        <circle
          key={`b-${i}`}
          cx={dot.x}
          cy={dot.y}
          r={i === 3 ? swellR : r * (1 - Math.abs(i - 3) * 0.06)}
          fill={signalColor}
          opacity={i === 3 ? 0 : 0.85 - Math.abs(i - 3) * 0.08}
        />
      ))}
      {/* Extra dots on each strand for density */}
      <circle cx={s * 0.21} cy={s * 0.175} r={r * 0.7} fill={navyColor} opacity={0.5} />
      <circle cx={s * 0.33} cy={s * 0.315} r={r * 0.75} fill={navyColor} opacity={0.6} />
      <circle cx={s * 0.68} cy={s * 0.69} r={r * 0.75} fill={navyColor} opacity={0.6} />
      <circle cx={s * 0.79} cy={s * 0.835} r={r * 0.7} fill={navyColor} opacity={0.5} />

      <circle cx={s * 0.79} cy={s * 0.175} r={r * 0.7} fill={signalColor} opacity={0.5} />
      <circle cx={s * 0.67} cy={s * 0.315} r={r * 0.75} fill={signalColor} opacity={0.6} />
      <circle cx={s * 0.33} cy={s * 0.69} r={r * 0.75} fill={signalColor} opacity={0.6} />
      <circle cx={s * 0.21} cy={s * 0.835} r={r * 0.7} fill={signalColor} opacity={0.5} />
    </svg>
  )
}

export default function NexGenLogo({
  variant = 'dark',
  size = 'md',
  showWordmark = true,
  className = '',
}: NexGenLogoProps) {
  const { mark, wordSize } = sizes[size]

  const colors = {
    dark: { navy: '#0E1B2E', signal: '#1568D3', nexgen: '#0E1B2E', bio: '#5B6B80' },
    light: { navy: '#FFFFFF', signal: '#3A85E0', nexgen: '#FFFFFF', bio: 'rgba(255,255,255,0.65)' },
    signal: { navy: '#0E1B2E', signal: '#1568D3', nexgen: '#0E1B2E', bio: '#0E1B2E' },
  }

  const c = colors[variant]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <NexGenMark size={mark} navyColor={c.navy} signalColor={c.signal} />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            style={{
              fontSize: wordSize,
              fontWeight: 700,
              color: c.nexgen,
              letterSpacing: '-0.01em',
              lineHeight: 1,
              fontFamily: 'var(--font-bricolage)',
            }}
          >
            Ne<span style={{ color: c.signal }}>x</span>Gen
          </span>
          <span
            style={{
              fontSize: wordSize,
              fontWeight: 300,
              color: c.bio,
              letterSpacing: '0.01em',
              lineHeight: 1.2,
              fontFamily: 'var(--font-bricolage)',
            }}
          >
            BioResearch
          </span>
        </div>
      )}
    </div>
  )
}
