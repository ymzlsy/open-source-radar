import { developers } from '../lib/data'
import { DeveloperCard } from '../components/cards'
import { SectionHeader } from '../components/ui'

export default function Developers() {
  return (
    <div>
      <SectionHeader title="我关注的开发者" sub={`共 ${developers.length} 位 · CORE 优先`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {developers.map((d) => (
          <DeveloperCard key={d.id} dev={d} />
        ))}
      </div>
    </div>
  )
}
