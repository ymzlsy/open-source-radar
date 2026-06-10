import { useState } from 'react'
import { projects } from '../lib/data'
import { ProjectRow } from '../components/cards'
import { SectionHeader, Tag } from '../components/ui'

export default function Projects() {
  const [cat, setCat] = useState<string | null>(null)
  const cats = [...new Set(projects.map((p) => p.category).filter(Boolean))] as string[]
  const list = cat ? projects.filter((p) => p.category === cat) : projects

  return (
    <div>
      <SectionHeader title="热门开源项目" sub={`共 ${projects.length} 个 · 按 star 排序 · 每日采集更新`} />
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setCat(null)} className={`cursor-pointer ${cat === null ? 'opacity-100' : 'opacity-50'}`}>
          <Tag>全部</Tag>
        </button>
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`cursor-pointer ${cat === c ? 'opacity-100' : 'opacity-50'}`}>
            <Tag>{c}</Tag>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {list.map((p) => (
          <ProjectRow key={p.id} p={p} />
        ))}
      </div>
    </div>
  )
}
