import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Developers from './pages/Developers'
import DeveloperDetail from './pages/DeveloperDetail'
import Recommended from './pages/Recommended'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'

const nav = [
  { to: '/', label: '总览', end: true },
  { to: '/developers', label: '开发者' },
  { to: '/recommended', label: '推荐' },
  { to: '/projects', label: '项目' },
  { to: '/articles', label: '内容' },
]

export default function App() {
  return (
    <HashRouter>
      <div className="mx-auto min-h-screen max-w-5xl px-4 pb-20">
        <nav className="sticky top-0 z-10 -mx-4 mb-8 flex items-center gap-1 border-b border-line bg-ink/90 px-4 py-3 backdrop-blur">
          <span className="mr-4 font-mono text-sm font-bold text-acc">os.karaithy</span>
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive ? 'bg-panel-2 text-fg' : 'text-mut hover:text-fg'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/developers/:id" element={<DeveloperDetail />} />
          <Route path="/recommended" element={<Recommended />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
        </Routes>
        <footer className="mt-16 border-t border-line pt-4 text-center font-mono text-xs text-mut/60">
          open-source.karaithy.com · 每日采集 · 数据即 JSON
        </footer>
      </div>
    </HashRouter>
  )
}
