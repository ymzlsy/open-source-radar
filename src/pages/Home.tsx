import { developers, recommended, projects, articles } from '../lib/data'
import { DeveloperCard, RecommendedCard, ProjectRow, ArticleRow } from '../components/cards'
import { SectionHeader, Empty } from '../components/ui'

export default function Home() {
  const latestDate = [...projects.map((p) => p.discovered_at), ...articles.map((a) => a.discovered_at)]
    .sort()
    .at(-1)
  const newProjects = projects.filter((p) => p.discovered_at === latestDate)
  const newArticles = articles.filter((a) => a.discovered_at === latestDate)

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl border border-line bg-gradient-to-br from-panel to-panel-2 p-8">
        <h1 className="text-2xl font-bold tracking-tight">
          个人开发者雷达 <span className="text-acc">/</span> Open Source Radar
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mut">
          追踪值得学习的 indie builder 与他们的项目，沉淀深度分析，最终目标：动手实践、复刻改造、找到自己的项目并商业化落地。
        </p>
        <p className="mt-3 font-mono text-xs text-mut/70">
          最近更新 {latestDate ?? '—'} · 新增 {newProjects.length} 个项目 / {newArticles.length} 篇内容 ·
          追踪 {developers.length} 位开发者
        </p>
      </section>

      {/* 模块1 我关注的开发者 */}
      <section>
        <SectionHeader title="我关注的开发者" sub="深度档案：简介 / 事迹 / 动态 / 项目 / 商业化分析" to="/developers" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {developers.map((d) => (
            <DeveloperCard key={d.id} dev={d} />
          ))}
        </div>
      </section>

      {/* 模块2 推荐开发者 */}
      <section>
        <SectionHeader title="推荐关注" sub="候选池：快速了解阵地与价值，判断是否纳入关注" to="/recommended" />
        {recommended.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.slice(0, 6).map((r) => (
              <RecommendedCard key={r.id} rec={r} />
            ))}
          </div>
        ) : (
          <Empty text="推荐池为空 — 每日采集会自动填充候选开发者" />
        )}
      </section>

      {/* 模块3 热门开源项目 */}
      <section>
        <SectionHeader title="热门开源项目" sub="每日更新 · star 趋势 · 来源 GitHub / X" to="/projects" />
        <div className="space-y-2">
          {projects.slice(0, 6).map((p) => (
            <ProjectRow key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* 模块4 文章/教程/课程 */}
      <section>
        <SectionHeader title="文章 · 教程 · 课程 · 报告" sub="每日更新的学习情报流" to="/articles" />
        <div className="space-y-2">
          {articles.slice(0, 6).map((a) => (
            <ArticleRow key={a.id} a={a} />
          ))}
        </div>
      </section>
    </div>
  )
}
