import { Link, useParams } from 'react-router-dom'
import { getDeveloper, projectsOf } from '../lib/data'
import { ProjectRow } from '../components/cards'
import { BaseLinks, IntentBadge, Markdownish, Tag, Empty } from '../components/ui'

const dynTypeLabel: Record<string, string> = {
  release: '发布',
  post: '发帖',
  milestone: '里程碑',
  talk: '演讲',
  other: '动态',
}

export default function DeveloperDetail() {
  const { id } = useParams()
  const dev = id ? getDeveloper(id) : undefined
  if (!dev) return <Empty text="未找到该开发者" />

  const projs = projectsOf(dev)
  const dynamics = [...(dev.dynamics ?? [])].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-8">
      <Link to="/developers" className="text-sm text-mut hover:text-acc">
        ← 返回列表
      </Link>

      {/* 头部 */}
      <header className="flex flex-wrap items-start gap-5 rounded-2xl border border-line bg-panel p-6">
        {dev.avatar ? (
          <img src={dev.avatar} alt={dev.name} className="h-20 w-20 rounded-full border border-line object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-panel-2 text-2xl text-mut">
            {dev.name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold">{dev.name}</h1>
            {dev.tier === 'core' && (
              <span className="rounded bg-acc/15 px-1.5 py-0.5 text-[10px] font-medium text-acc">CORE</span>
            )}
            <IntentBadge intent={dev.replicate_intent} />
            {dev.status === 'candidate' && (
              <span className="rounded border border-warn/40 px-1.5 py-0.5 text-[10px] text-warn">候选·待补全</span>
            )}
          </div>
          <p className="mt-1 text-sm text-mut">{dev.oneliner}</p>
          {(dev.location || dev.company) && (
            <p className="mt-1 text-xs text-mut/70">{[dev.location, dev.company].filter(Boolean).join(' · ')}</p>
          )}
          <div className="mt-3">
            <BaseLinks bases={dev.bases} />
          </div>
          {dev.tags && dev.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {dev.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 简介 + 事迹 */}
      {dev.summary && (
        <section>
          <h2 className="mb-2 font-semibold">简介</h2>
          <Markdownish text={dev.summary} />
        </section>
      )}
      {dev.story && (
        <section>
          <h2 className="mb-2 font-semibold">事迹</h2>
          <Markdownish text={dev.story} />
        </section>
      )}

      {/* 代表作 */}
      {dev.highlights && dev.highlights.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">代表作 / 里程碑</h2>
          <ul className="space-y-1.5 text-sm text-fg/90">
            {dev.highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-acc">▹</span>
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 项目 */}
      <section>
        <h2 className="mb-3 font-semibold">开源 & 商业项目</h2>
        {projs.length ? (
          <div className="space-y-2">
            {projs.map((p) => (
              <ProjectRow key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <Empty text="暂无关联项目" />
        )}
      </section>

      {/* 商业化分析 */}
      {dev.commercialization?.model && (
        <section className="rounded-xl border border-line bg-panel p-5">
          <h2 className="mb-2 font-semibold">商业化分析</h2>
          <p className="text-sm text-fg/90">{dev.commercialization.model}</p>
          {dev.commercialization.signals && dev.commercialization.signals.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-mut">
              {dev.commercialization.signals.map((s, i) => (
                <li key={i}>· {s}</li>
              ))}
            </ul>
          )}
          {dev.commercialization.notes && (
            <p className="mt-2 border-t border-line pt-2 text-sm text-mut">{dev.commercialization.notes}</p>
          )}
        </section>
      )}

      {/* 动态时间线 */}
      {dynamics.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold">动态</h2>
          <div className="space-y-3 border-l border-line pl-4">
            {dynamics.map((d, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-acc" />
                <p className="font-mono text-xs text-mut">
                  {d.date} · {dynTypeLabel[d.type ?? 'other']}
                </p>
                <p className="mt-0.5 text-sm">
                  {d.content}
                  {d.source_url && (
                    <a href={d.source_url} target="_blank" rel="noreferrer" className="ml-2 text-xs text-acc hover:underline">
                      来源 ↗
                    </a>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 我的判断 */}
      {dev.my_take && (
        <section className="rounded-xl border border-acc/30 bg-acc/5 p-5">
          <h2 className="mb-2 font-semibold text-acc">我的判断</h2>
          <Markdownish text={dev.my_take} />
        </section>
      )}

      <p className="text-xs text-mut/60">
        {dev.source} · 更新于 {dev.updated_at}
      </p>
    </div>
  )
}
