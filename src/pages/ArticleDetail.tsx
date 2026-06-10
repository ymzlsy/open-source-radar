import { Link, useParams } from 'react-router-dom'
import { getArticle, getDeveloper } from '../lib/data'
import { Markdownish, Tag, Empty } from '../components/ui'

const typeLabel: Record<string, string> = {
  article: '文章',
  tutorial: '教程',
  course: '课程',
  tool: '工具',
  report: '报告',
}

export default function ArticleDetail() {
  const { id } = useParams()
  const a = id ? getArticle(id) : undefined
  if (!a) return <Empty text="未找到该内容" />

  const dev = a.author_developer_id ? getDeveloper(a.author_developer_id) : undefined

  return (
    <div className="space-y-8">
      <Link to="/articles" className="text-sm text-mut hover:text-acc">
        ← 返回列表
      </Link>

      <header className="rounded-2xl border border-line bg-panel p-6">
        <span className="rounded bg-acc-2/15 px-2 py-0.5 text-xs font-medium text-acc-2">
          {typeLabel[a.type] ?? a.type}
        </span>
        <h1 className="mt-3 text-xl font-bold leading-snug">{a.title}</h1>
        <p className="mt-2 text-sm text-mut">
          {a.author}
          {dev && (
            <Link to={`/developers/${dev.id}`} className="ml-2 text-xs text-acc hover:underline">
              已在关注列表 →
            </Link>
          )}
          <span className="ml-2">· {a.source_platform}</span>
          <span className="ml-2">· {a.discovered_at} 收录</span>
        </p>
        <a
          href={a.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-lg bg-acc px-4 py-1.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
        >
          阅读原文 ↗
        </a>
      </header>

      {a.summary && (
        <section>
          <h2 className="mb-2 font-semibold">摘要</h2>
          <Markdownish text={a.summary} />
        </section>
      )}

      {a.why_useful && (
        <section>
          <h2 className="mb-2 font-semibold">为什么有用</h2>
          <p className="text-sm leading-relaxed text-fg/90">{a.why_useful}</p>
        </section>
      )}

      {a.my_take && (
        <section className="rounded-xl border border-acc/30 bg-acc/5 p-5">
          <h2 className="mb-2 font-semibold text-acc">我的判断</h2>
          <Markdownish text={a.my_take} />
        </section>
      )}

      {a.tags && a.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {a.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
    </div>
  )
}
