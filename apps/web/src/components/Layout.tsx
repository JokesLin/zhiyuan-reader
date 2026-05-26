import { Outlet, NavLink } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/bookshelf', label: '书架', icon: '📚' },
  { path: '/search', label: '搜索', icon: '🔍' },
  { path: '/settings', label: '我的', icon: '👤' },
]

function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1 className="layout-title">致远阅读</h1>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <nav className="layout-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-item${isActive ? ' nav-item--active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Layout