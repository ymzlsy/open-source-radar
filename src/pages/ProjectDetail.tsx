import { Link, useParams } from 'react-router-dom'
import { getProject, getDeveloper, starDelta } from '../lib/data'
import { IntentBadge, Markdownish, Sparkline, Stars, Tag, Empty } from '../components/ui'

export default function ProjectDetail() {
  const { id } = useParams()
  const p = id ? getProject(id) : undefined
  if (!p) return <Empty text="未找到该项目" />

  const dev = p.author_developer_id ? getDeveloper(p.author_developer_id) : undefined

  return (
    <div className="space-y-8">
      <Link to="/projects" className="text-sm text-mut hover:text-acc">
        ← 返回列表
      </Link>

      <header className="rounded-2xl border border-line bg-panel p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-xl font-bold">{p.name}</h1>
          {p.category && <Tag>{p.category}</Tag>}
          <IntentBadge intent={p.replicate_intent} />
        </div>
        <p className="mt-2 text-sm text-mut">{p.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Stars stars={p.stars} delta={starDelta(p)} />
          <Sparkline history={p.stars_history} width={160} height={36} />
          {p.language && <span className="text-xs text-mut">{p.language}</span>}
          {p.license && <span className="text-xs text-mut">{p.license}</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={p.repo_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-acc px-4 py-1.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            原项目地址 ↗
          </a>
          {p.homepage && (
            <a
              href={p.homepage}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-line px-4 py-1.5 text-sm text-fg hover:border-acc"
            >
              主页 ↗
            </a>
          )}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-panel p-4">
          <h2 className="text-sm font-semibold text-mut">作者</h2>
          <p className="mt-1 text-sm">
            {p.author}
            {dev ? (
              <Link to={`/developers/${dev.id}`} className="ml-2 text-xs text-acc hover:underline">
                已在关注列表 →
              </Link>
            ) : (
              <span className="ml-2 text-xs text-mut">（未纳入关注 — 看准了可建档）</span>
            )}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-panel p-4">
          <h2 className="text-sm font-semibold text-mut">收录信息</h2>
          <p className="mt-1 text-sm">
            {p.discovered_at} · 来源 {p.source}
          </p>
        </div>
      </section>

      {p.why_interesting && (
        <section>
          <h2 className="mb-2 font-semibold">为什么值得看</h2>
          <p className="text-sm leading-relaxed text-fg/90">{p.why_interesting}</p>
        </section>
      )}

      {p.analysis && (
        <section>
          <h2 className="mb-2 font-semibold">深度分析</h2>
          <Markdownish text={p.analysis} />
        </section>
      )}

      {p.commercialization_signal && (
        <section className="rounded-xl border border-line bg-panel p-5">
          <h2 className="mb-1 font-semibold">商业化信号</h2>
          <p className="text-sm text-fg/90">{p.commercialization_signal}</p>
        </section>
      )}

      {p.my_take && (
        <section className="rounded-xl border border-acc/30 bg-acc/5 p-5">
          <h2 className="mb-2 font-semibold text-acc">我的判断</h2>
          <Markdownish text={p.my_take} />
        </section>
      )}

      {p.tags && p.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
    </div>
  )
}
