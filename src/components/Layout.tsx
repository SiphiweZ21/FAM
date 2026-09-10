import {
  BookOpen,
  Gauge,
  Home,
  UserRound
} from 'lucide-react'

import {
  NavLink,
  Outlet
} from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink
          to="/"
          className="brand"
        >
          <span className="brand-mark">
            FAM
          </span>

          <span>
            <strong>
              FutureAfricaMinds
            </strong>

            <small>
              Learn Today. Lead Tomorrow.
            </small>
          </span>
        </NavLink>
      </header>

      <main className="page">
        <Outlet />
      </main>

      <nav
        className="bottom-nav"
        aria-label="Primary navigation"
      >
        <NavLink to="/">
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/dashboard">
          <Gauge size={20} />
          <span>Progress</span>
        </NavLink>

        <NavLink to="/subjects">
          <BookOpen size={20} />
          <span>Subjects</span>
        </NavLink>

        <NavLink to="/account">
          <UserRound size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  )
}
