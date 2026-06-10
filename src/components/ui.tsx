import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Base, ReplicateIntent, StarSnapshot } from '../types'

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-line bg-panel-2 px-2 py-0.5 text-xs text-mut">
      {children}
    </span>
  )
}

const intentLabel: Record<ReplicateIntent, { text: string; cls: string }> = {
  none: { text: '不动', cls: 'text-mut border-line' },
  watch: { text: '观望', cls: 'text-warn border-warn/40' },
  fork: { text: 'Fork 改造', cls: 'text-acc border-acc/40' },
  build: { text: '借鉴自建', cls: 'text-acc-2 border-acc-2/40' },
}

export function IntentBadge({ intent }: { intent?: ReplicateIntent }) {
  if (!intent || intent === 'none') return null
  const it = intentLabel[intent]
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 text-[11px] font-medium ${it.cls}`}>
      {it.text}
    </span>
  )
}

const platformIcon: Record<string, string> = {
  github: 'GitHub',
  x: '𝕏',
  website: 'Web',
  substack: 'Substack',
  youtube: 'YouTube',
  producthunt: 'PH',
  other: 'Link',
}

export function BaseLinks({ bases, compact = false }: { bases: Base[]; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {bases.map((b) => (
        <a
          key={b.url}
          href={b.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`rounded border border-line bg-panel-2 px-2 py-0.5 text-xs transition-colors hover:border-acc hover:text-acc ${
            b.is_primary ? 'text-fg' : 'text-mut'
          }`}
        >
          {platformIcon[b.platform] ?? b.platform}
          {!compact && b.followers ? ` · ${formatNum(b.followers)}` : ''}
        </a>
      ))}
    </div>
  )
}

export function formatNum(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function Stars({ stars, delta }: { stars?: number; delta?: number | null }) {
  if (stars == null) return null
  return (
    <span className="inline-flex items-center gap-1 font-mono text-sm text-warn">
      ★ {formatNum(stars)}
      {delta != null && delta !== 0 && (
        <span className={delta > 0 ? 'text-acc' : 'text-mut'}>
          {delta > 0 ? `+${formatNum(delta)}` : formatNum(delta)}
        </span>
      )}
    </span>
  )
}

/** star 趋势迷你折线，纯 SVG 自绘 */
export function Sparkline({ history, width = 96, height = 28 }: { history?: StarSnapshot[]; width?: number; height?: number }) {
  if (!history || history.length < 2) {
    return <span className="font-mono text-[10px] text-mut">趋势积累中</span>
  }
  const vals = history.map((h) => h.stars)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const span = max - min || 1
  const pts = vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * (width - 4) + 2
      const y = height - 4 - ((v - min) / span) * (height - 8)
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke="var(--color-acc)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function SectionHeader({ title, sub, to }: { title: string; sub?: string; to?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-wide">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-mut">{sub}</p>}
      </div>
      {to && (
        <Link to={to} className="text-sm text-acc hover:underline">
          全部 →
        </Link>
      )}
    </div>
  )
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-mut">{text}</div>
  )
}

export function Markdownish({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div className="space-y-2 text-sm leading-relaxed text-fg/90">
      {text.split('\n').filter(Boolean).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}
