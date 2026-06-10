import { useState } from 'react'
import { articles } from '../lib/data'
import { ArticleRow } from '../components/cards'
import { SectionHeader, Tag } from '../components/ui'

const typeLabel: Record<string, string> = {
  article: '文章',
  tutorial: '教程',
  course: '课程',
  tool: '工具',
  report: '报告',
}

export default function Articles() {
  const [type, setType] = useState<string | null>(null)
  const types = [...new Set(articles.map((a) => a.type))]
  const list = type ? articles.filter((a) => a.type === type) : articles

  return (
    <div>
      <SectionHeader title="文章 · 教程 · 课程 · 报告" sub={`共 ${articles.length} 条 · 按收录时间倒序`} />
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setType(null)} className={`cursor-pointer ${type === null ? 'opacity-100' : 'opacity-50'}`}>
          <Tag>全部</Tag>
        </button>
        {types.map((t) => (
          <button key={t} onClick={() => setType(t)} className={`cursor-pointer ${type === t ? 'opacity-100' : 'opacity-50'}`}>
            <Tag>{typeLabel[t] ?? t}</Tag>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {list.map((a) => (
          <ArticleRow key={a.id} a={a} />
        ))}
      </div>
    </div>
  )
}
