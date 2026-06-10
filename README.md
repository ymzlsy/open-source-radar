# Open Source Radar

个人开发者雷达 — 追踪关注的 indie builder 与他们的项目,沉淀深度分析,最终目标:动手实践、复刻改造、找到自己的项目并商业化落地。

线上地址:https://open-source.karaithy.com

## 技术栈

React 18 + Vite + TypeScript + Tailwind CSS v4 + React Router(HashRouter)。纯静态,零后端,数据即 JSON。

## 目录结构

```
data/                    数据层(SSOT,前端直接读)
  schema/                三套 JSON Schema(developer/project/article)
  developers/            开发者档案,一人一档,新增 JSON 即自动上墙
  feed/projects.json     模块3 热门项目流
  feed/articles.json     模块4 文章/教程流
  feed/raw/              每日采集原始快照(只追加)
  recommended-developers.json  模块2 推荐池
src/                     React 应用
docs/                    价值边界/信息架构/数据规范/维护流程 四件套
progress.txt             项目进度(每次会话先读这个)
```

## 开发与发布

```bash
npm install
npm run dev      # 本地预览,端口 5191
npm run build    # 构建到 dist/
```

发布:`git push origin main` → Cloudflare Pages 自动构建部署(构建命令 `npm run build`,输出 `dist`)。

## 改内容先改哪里

- 加/改开发者档案 → `data/developers/<id>.json`(参照 schema)
- 加项目/文章 → `data/feed/projects.json` / `articles.json`
- 字段与生命周期规则 → 见 `docs/02-数据规范-字段与生命周期.md`

改完 push 即上线,无需动 src/。
