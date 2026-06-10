# Open Source Radar 项目规范

## 项目定位

个人开发者雷达站(open-source.karaithy.com),长期积累型数据项目。核心是 `data/` 下的 JSON,React 只是展示壳。每次会话先读 `progress.txt`。

## 关键约定

- **数据即 SSOT**:所有内容变更优先改 `data/`,字段必须符合 `data/schema/` 的定义
- **生命周期**:developer `candidate→tracking→archived`;project `feed→shortlisted→replicated/dismissed`;article `feed→saved→consumed/dismissed`
- **cron 只捞不晋升**:自动采集的条目一律 `status=feed`,晋升/复刻是 Mike 的人工决策
- **公开站点语气**:`my_take` 客观克制,直白的私人判断不进部署数据
- **未知值用 null**,不要用 0 或空串;抓不到的对象建草稿档(candidate)而非丢弃
- **日期** 一律 `YYYY-MM-DD`

## 部署

- GitHub:ymzlsy/open-source-radar,Cloudflare Pages Git 型,push 即自动部署
- 构建:`npm run build`,输出 `dist/`
- 本地预览:`npm run dev`(.claude/launch.json 已配 radar-dev)

## 不要做

- 不要在前端硬编码数据,一律走 data/ JSON
- 不要改 schema 而不同步 docs/02 数据规范
- 不要未经确认 git push(Mike 说"发布/推送"才推)
