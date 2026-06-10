import type { Developer, Project, Article, RecommendedDeveloper } from '../types'
import projectsJson from '../../data/feed/projects.json'
import articlesJson from '../../data/feed/articles.json'
import recommendedJson from '../../data/recommended-developers.json'

// 开发者一人一档，用 glob 全量加载
const developerModules = import.meta.glob<Developer>('../../data/developers/*.json', {
  eager: true,
  import: 'default',
})

export const developers: Developer[] = Object.values(developerModules).sort((a, b) => {
  // core 在前，其余按更新时间倒序
  if (a.tier !== b.tier) return a.tier === 'core' ? -1 : 1
  return b.updated_at.localeCompare(a.updated_at)
})

export const projects: Project[] = (projectsJson as Project[])
  .filter((p) => p.status !== 'dismissed')
  .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))

export const articles: Article[] = (articlesJson as Article[])
  .filter((a) => a.status !== 'dismissed')
  .sort((a, b) => b.discovered_at.localeCompare(a.discovered_at))

export const recommended: RecommendedDeveloper[] = (recommendedJson as RecommendedDeveloper[]).filter(
  (r) => r.id !== '_template' && !r.promoted,
)

export function getDeveloper(id: string): Developer | undefined {
  return developers.find((d) => d.id === id)
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

export function getArticle(id: string): Article | undefined {
  return articles.find((a) => a.id === id)
}

export function projectsOf(dev: Developer): Project[] {
  const ids = new Set(dev.project_ids ?? [])
  return projects.filter((p) => ids.has(p.id) || p.author_developer_id === dev.id)
}

/** star 增量：最近两次快照之差 */
export function starDelta(p: Project): number | null {
  const h = p.stars_history
  if (!h || h.length < 2) return null
  return h[h.length - 1].stars - h[h.length - 2].stars
}

export function todayCounts(date: string) {
  return {
    projects: projects.filter((p) => p.discovered_at === date).length,
    articles: articles.filter((a) => a.discovered_at === date).length,
  }
}
