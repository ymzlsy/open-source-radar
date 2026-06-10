#!/usr/bin/env node
/**
 * 拉取 zarazhangrui/follow-builders 中央 feed（MIT），转换入库：
 *   - feed-podcasts / feed-blogs → data/feed/articles.json（模块4，status=feed）
 *   - feed-x 中已关注开发者的高赞推文 → data/developers/<id>.json 的 dynamics
 *   - 三个 feed 原样存 data/feed/raw/YYYY-MM-DD/（只追加层）
 * 幂等：按 id / source_url 去重，可重复运行。
 * 新鲜度：feed generatedAt 超过 48h 则跳过该源。
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FEED_BASE = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main'
const MAX_AGE_H = 48
const today = new Date().toISOString().slice(0, 10)

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))
const writeJson = (p, d) => writeFileSync(p, JSON.stringify(d, null, 2) + '\n')

async function fetchFeed(name) {
  const res = await fetch(`${FEED_BASE}/${name}`)
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`)
  const data = await res.json()
  const ageH = (Date.now() - new Date(data.generatedAt).getTime()) / 36e5
  if (ageH > MAX_AGE_H) {
    console.log(`[skip] ${name} 已过期 ${ageH.toFixed(0)}h（>${MAX_AGE_H}h）`)
    return null
  }
  return data
}

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)

const stripHtml = (s) =>
  (s || '').replace(/<[^>]+>/g, '').replace(/&#x27;|&apos;/g, "'").replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()

function toDate(v) {
  const d = new Date(v)
  return isNaN(d) ? today : d.toISOString().slice(0, 10)
}

async function main() {
  const [fx, fp, fb] = await Promise.all(
    ['feed-x.json', 'feed-podcasts.json', 'feed-blogs.json'].map((n) => fetchFeed(n).catch((e) => (console.error(`[err] ${e.message}`), null))),
  )

  // 原始层快照
  const rawDir = join(ROOT, 'data/feed/raw', today)
  mkdirSync(rawDir, { recursive: true })
  for (const [name, data] of [['followbuilders-x', fx], ['followbuilders-podcasts', fp], ['followbuilders-blogs', fb]]) {
    if (data) writeJson(join(rawDir, `${name}.json`), data)
  }

  // ---- 模块4：podcasts + blogs → articles.json ----
  const articlesPath = join(ROOT, 'data/feed/articles.json')
  const articles = readJson(articlesPath)
  const seen = new Set(articles.map((a) => a.id))
  let added = 0

  for (const ep of fp?.podcasts ?? []) {
    const id = `fb-pod-${slug(ep.guid || ep.title)}`
    if (seen.has(id)) continue
    seen.add(id)
    articles.push({
      id,
      title: `${ep.name}: ${ep.title}`,
      url: ep.url,
      type: 'article',
      author: ep.name,
      author_developer_id: null,
      source_platform: 'YouTube Podcast',
      summary: stripHtml(ep.transcript).slice(0, 300) + '…（follow-builders feed 含全文 transcript）',
      tags: ['podcast', 'AI'],
      why_useful: `头部 AI 播客「${ep.name}」最新单集`,
      discovered_at: today,
      source: 'follow-builders',
      status: 'feed',
      my_take: '',
    })
    added++
  }

  for (const post of fb?.blogs ?? []) {
    const id = `fb-blog-${slug(post.title)}`
    if (seen.has(id)) continue
    seen.add(id)
    articles.push({
      id,
      title: post.title,
      url: post.url,
      type: 'article',
      author: post.author || post.name,
      author_developer_id: null,
      source_platform: post.name,
      summary: stripHtml(post.content || post.description).slice(0, 300),
      tags: ['blog', 'AI'],
      why_useful: `官方博客「${post.name}」新文章`,
      discovered_at: today,
      source: 'follow-builders',
      status: 'feed',
      my_take: '',
    })
    added++
  }
  writeJson(articlesPath, articles)
  console.log(`articles: +${added}`)

  // ---- 模块1：feed-x 命中已关注开发者 → dynamics ----
  const devDir = join(ROOT, 'data/developers')
  const handleToFile = {}
  for (const f of readdirSync(devDir).filter((f) => f.endsWith('.json'))) {
    const dev = readJson(join(devDir, f))
    for (const b of dev.bases ?? []) {
      const m = b.url.match(/x\.com\/([A-Za-z0-9_]+)/)
      if (m) handleToFile[m[1].toLowerCase()] = f
    }
  }

  for (const builder of fx?.x ?? []) {
    const file = handleToFile[(builder.handle || '').toLowerCase()]
    if (!file) continue
    const devPath = join(devDir, file)
    const dev = readJson(devPath)
    dev.dynamics ??= []
    const known = new Set(dev.dynamics.map((d) => d.source_url))
    const top = [...(builder.tweets ?? [])].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)).slice(0, 2)
    let n = 0
    for (const t of top) {
      if (known.has(t.url)) continue
      dev.dynamics.push({
        date: toDate(t.createdAt),
        type: 'post',
        content: t.text.length > 200 ? t.text.slice(0, 200) + '…' : t.text,
        source_url: t.url,
      })
      n++
    }
    if (n) {
      dev.updated_at = today
      writeJson(devPath, dev)
      console.log(`dynamics: ${dev.id} +${n}`)
    }
  }

  console.log('done.')
}

main()
