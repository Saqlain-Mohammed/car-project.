const pulse = {
  background: 'linear-gradient(90deg, #2a2f40 25%, #353b50 50%, #2a2f40 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeletonPulse 1.5s ease-in-out infinite',
  borderRadius: 8,
}

// Inject keyframe once
if (typeof document !== 'undefined' && !document.getElementById('skeleton-style')) {
  const s = document.createElement('style')
  s.id = 'skeleton-style'
  s.textContent = `@keyframes skeletonPulse { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`
  document.head.appendChild(s)
}

export function Skeleton({ width = '100%', height = 16, radius = 8, style = {} }) {
  return <div style={{ ...pulse, width, height, borderRadius: radius, ...style }} />
}

export function CardSkeleton() {
  return (
    <div style={{ background: '#2a2f40', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(191,192,192,0.12)' }}>
      <Skeleton height={180} radius={0} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Skeleton height={20} width="70%" />
        <Skeleton height={14} width="45%" />
        <Skeleton height={28} width="40%" />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton height={12} width="30%" />
          <Skeleton height={12} width="25%" />
          <Skeleton height={12} width="20%" />
        </div>
        <Skeleton height={36} radius={10} />
      </div>
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div style={{ background: '#2a2f40', borderRadius: 14, padding: '1rem 1.25rem', border: '1px solid rgba(191,192,192,0.12)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Skeleton width={48} height={48} radius={12} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Skeleton height={16} width="60%" />
        <Skeleton height={12} width="40%" />
      </div>
      <Skeleton width={80} height={32} radius={8} />
    </div>
  )
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  )
}
