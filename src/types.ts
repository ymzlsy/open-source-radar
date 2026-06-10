export type Platform = 'github' | 'x' | 'website' | 'substack' | 'youtube' | 'producthunt' | 'other'

export interface Base {
  platform: Platform
  url: string
  followers?: number | null
  is_primary?: boolean
}

export type DeveloperStatus = 'candidate' | 'tracking' | 'archived'
export type ReplicateIntent = 'none' | 'watch' | 'fork' | 'build'

export interface Dynamic {
  date: string
  type?: 'release' | 'post' | 'milestone' | 'talk' | 'other'
  content: string
  source_url?: string
}

export interface Developer {
  id: string
  name: string
  handle?: string
  avatar?: string
  oneliner?: string
  status: DeveloperStatus
  tier: 'core' | 'watch'
  location?: string
  company?: string
  tags?: string[]
  bases: Base[]
  summary?: string
  story?: string
  highlights?: string[]
  project_ids?: string[]
  commercialization?: { model?: string; signals?: string[]; notes?: string }
  dynamics?: Dynamic[]
  my_take?: string
  replicate_intent?: ReplicateIntent
  source?: string
  created_at?: string
  updated_at: string
}

export type ProjectStatus = 'feed' | 'shortlisted' | 'replicated' | 'dismissed'

export interface StarSnapshot {
  date: string
  stars: number
}

export interface Project {
  id: string
  name: string
  repo_url: string
  homepage?: string
  author?: string
  author_developer_id?: string | null
  description?: string
  category?: string
  tags?: string[]
  language?: string
  license?: string
  stars?: number
  stars_history?: StarSnapshot[]
  why_interesting?: string
  analysis?: string
  commercialization_signal?: string
  discovered_at: string
  source?: string
  status: ProjectStatus
  my_take?: string
  replicate_intent?: ReplicateIntent
}

export type ArticleStatus = 'feed' | 'saved' | 'consumed' | 'dismissed'
export type ArticleType = 'article' | 'tutorial' | 'course' | 'tool' | 'report'

export interface Article {
  id: string
  title: string
  url: string
  type: ArticleType
  author?: string
  author_developer_id?: string | null
  source_platform?: string
  summary?: string
  tags?: string[]
  why_useful?: string
  discovered_at: string
  source?: string
  status: ArticleStatus
  my_take?: string
}

export interface RecommendedDeveloper {
  id: string
  name: string
  handle?: string
  oneliner?: string
  bases: Base[]
  tags?: string[]
  why_recommended?: string
  related_to?: string
  promoted?: boolean
  promoted_to_developer_id?: string | null
  discovered_at?: string
  source?: string
}
