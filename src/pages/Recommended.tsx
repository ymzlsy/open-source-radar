import { recommended } from '../lib/data'
import { RecommendedCard } from '../components/cards'
import { SectionHeader, Empty } from '../components/ui'

export default function Recommended() {
  return (
    <div>
      <SectionHeader title="推荐关注" sub="候选池 — 看准了就晋升到关注列表" />
      {recommended.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((r) => (
            <RecommendedCard key={r.id} rec={r} />
          ))}
        </div>
      ) : (
        <Empty text="推荐池为空 — 每日采集会自动填充，也可手动添加到 data/recommended-developers.json" />
      )}
    </div>
  )
}
