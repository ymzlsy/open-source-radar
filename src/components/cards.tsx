import { Link, useNavigate } from 'react-router-dom'
import type { Article, Developer, Project, RecommendedDeveloper } from '../types'
import { projectsOf, starDelta, getDeveloper } from '../lib/data'
import { BaseLinks, IntentBadge, Sparkline, Stars, Tag, formatNum } from './ui'

const statusLabel: Record<string, string> = {
  candidate: '候选·待补全',
  tracking: '关注中',
  archived: '已归档',
  feed: '新进',
  shortlisted: '已收藏',
  replicated: '已复刻',
  saved: '已收藏',
  consumed: '已读',
}

export function DeveloperCard({ dev }: { dev: Developer }) {
  const navigate = useNavigate()
  const projs = projectsOf(dev)
  const topStars = projs.reduce((s, p) => s + (p.stars ?? 0), 0)
  const isDraft = dev.status === 'candidate'
  return (
    <div
      onClick={() => navigate(`/developers/${dev.id}`)}
      className={`group cursor-pointer rounded-xl border border-line bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-acc/50 ${
        isDraft ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {dev.avatar ? (
          <img src={dev.avatar} alt={dev.name} className="h-12 w-12 rounded-full border border-line object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-panel-2 text-lg text-mut">
            {dev.name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold group-hover:text-acc">{dev.name}</h3>
            {dev.tier === 'core' && (
              <span className="rounded bg-acc/15 px-1.5 py-0.5 text-[10px] font-medium text-acc">CORE</span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-sm text-mut">{dev.oneliner}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <BaseLinks bases={dev.bases} compact />
        <div className="flex items-center gap-2">
          {topStars > 0 && <span className="font-mono text-xs text-warn">★ {formatNum(topStars)}</span>}
          <IntentBadge intent={dev.replicate_intent} />
        </div>
      </div>
      {isDraft && <p className="mt-2 text-[11px] text-warn/80">{statusLabel[dev.status]}</p>}
    </div>
  )
}

export function RecommendedCard({ rec }: { rec: RecommendedDeveloper }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{rec.name}</h3>
        {rec.handle && <span className="font-mono text-xs text-mut">@{rec.handle}</span>}
      </div>
      {rec.oneliner && <p className="mt-1 text-sm text-mut">{rec.oneliner}</p>}
      <div className="mt-3">
        <BaseLinks bases={rec.bases} />
      </div>
      {rec.why_recommended && (
        <p className="mt-3 border-l-2 border-acc/40 pl-2 text-xs leading-relaxed text-fg/80">{rec.why_recommended}</p>
      )}
    </div>
  )
}

export function ProjectRow({ p }: { p: Project }) {
  const dev = p.author_developer_id ? getDeveloper(p.author_developer_id) : undefined
  return (
    <Link
      to={`/projects/${p.id}`}
      className="flex items-center gap-4 rounded-lg border border-line bg-panel px-4 py-3 transition-colors hover:border-acc/50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold">{p.name}</span>
          {p.category && <Tag>{p.category}</Tag>}
          {p.status !== 'feed' && <span className="text-[10px] text-acc">{statusLabel[p.status]}</span>}
          <IntentBadge intent={p.replicate_intent} />
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm text-mut">{p.why_interesting || p.description}</p>
        <p className="mt-0.5 text-xs text-mut/70">
          {p.author}
          {dev && <span className="ml-1 text-acc">· 已关注</span>}
          <span className="ml-2">{p.discovered_at} 收录</span>
        </p>
      </div>
      <div className="hidden sm:block">
        <Sparkline history={p.stars_history} />
      </div>
      <Stars stars={p.stars} delta={starDelta(p)} />
    </Link>
  )
}

const typeLabel: Record<string, string> = {
  article: '文章',
  tutorial: '教程',
  course: '课程',
  tool: '工具',
  report: '报告',
}

export function ArticleRow({ a }: { a: Article }) {
  return (
    <Link
      to={`/articles/${a.id}`}
      className="flex items-start gap-3 rounded-lg border border-line bg-panel px-4 py-3 transition-colors hover:border-acc/50"
    >
      <span className="mt-0.5 shrink-0 rounded bg-acc-2/15 px-1.5 py-0.5 text-[10px] font-medium text-acc-2">
        {typeLabel[a.type] ?? a.type}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-medium">{a.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-mut">{a.why_useful || a.summary}</p>
        <p className="mt-0.5 text-xs text-mut/70">
          {a.author} · {a.source_platform} · {a.discovered_at}
        </p>
      </div>
      {a.status !== 'feed' && <span className="shrink-0 text-[10px] text-acc">{statusLabel[a.status]}</span>}
    </Link>
  )
}
