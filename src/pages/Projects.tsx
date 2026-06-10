import { useState } from 'react'
import { feedProjects } from '../lib/data'
import { ProjectRow } from '../components/cards'
import { SectionHeader, Tag } from '../components/ui'

export default function Projects() {
  const [cat, setCat] = useState<string | null>(null)
  const cats = [...new Set(feedProjects.map((p) => p.category).filter(Boolean))] as string[]
  const list = cat ? feedProjects.filter((p) => p.category === cat) : feedProjects

  return (
    <div>
      <SectionHeader
        title="热门开源项目"
        sub={`共 ${feedProjects.length} 个 · 全网趋势探索流（GitHub Trending / X）· 已关注开发者的作品见其档案页`}
      />
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
