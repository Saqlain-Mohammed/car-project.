import { C, R } from '../../lib/theme'

/** Pulsing placeholder — pairs with `.t-reveal` on the loaded content. */
export function Skeleton({ width = '100%', height = 14, radius = R.sm, style }) {
  return <div className="t-skel" style={{ width, height, borderRadius: radius, ...style }} />
}

export function CardSkeleton() {
  return (
    <div style={{ background: C.surface, borderRadius: R.lg, overflow: 'hidden' }}>
      <Skeleton height={160} radius={0} />
      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        <Skeleton height={16} width="70%" />
        <Skeleton height={12} width="45%" />
        <Skeleton height={24} width="38%" />
        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
          <Skeleton height={11} width="32%" />
          <Skeleton height={11} width="26%" />
        </div>
      </div>
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div style={{ background: C.surface, borderRadius: R.md, padding: '1rem 1.1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Skeleton width={44} height={44} radius={R.md} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Skeleton height={14} width="55%" />
        <Skeleton height={11} width="35%" />
      </div>
      <Skeleton width={64} height={28} radius={R.sm} />
    </div>
  )
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={12} width={i === lines - 1 ? '55%' : '100%'} />
      ))}
    </div>
  )
}
