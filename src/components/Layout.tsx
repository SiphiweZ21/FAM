import SubjectProgrammeLink from './SubjectProgrammeLink'
import GradePremiumGate from './GradePremiumGate'
import type { User } from '@supabase/supabase-js'
import { BookOpen, Gauge, GraduationCap, Home, LogIn, LogOut, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const shopLinks = [
  ['Buy Stationery', '/shop/stationery'], ['Books', '/shop/books'], ['Workbooks', '/shop/workbooks'], ['Labels & Covers', '/shop/labels-and-covers']
] as const

const searchItems = [
  { label: 'Choose a grade', detail: 'Grade 1 to Grade 12', to: '/', group: 'Learning' },
  { label: 'Subjects', detail: 'Lessons, missions and video lessons', to: '/subjects', group: 'Learning' },
  { label: 'Homework & Assignment Help', detail: 'Premium guided support', to: '/homework-help', group: 'Learning' },
  { label: 'Past papers', detail: 'Exam questions and memorandums', to: '/subjects', group: 'Learning' },
  { label: 'Progress dashboard', detail: 'See learning progress', to: '/dashboard', group: 'Learning' },
  ...shopLinks.map(([label, to]) => ({ label, detail: 'FAM Shop · Coming soon', to, group: 'Shop' }))
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setAccountOpen(false); setQuery('') }, [location.pathname])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    return term ? searchItems.filter(item => `${item.label} ${item.detail}`.toLowerCase().includes(term)) : searchItems
  }, [query])

  async function signOut() { await supabase.auth.signOut(); setAccountOpen(false); navigate('/') }

  return <div className="app-shell">
    <header className="site-header">
      <div className="topbar">
        <button className="header-icon-button" type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={23} /></button>
        <Link to="/" className="brand"><span className="brand-mark">FAM</span><span><strong>FutureAfricaMinds</strong><small>Learn Today. Lead Tomorrow.</small></span></Link>
        <div className="header-actions">
          <button className="header-icon-button" type="button" aria-label="Search FAM" onClick={() => setSearchOpen(true)}><Search size={22} /></button>
          {!user ? <><Link className="header-auth-button login" to="/account"><LogIn size={17} /> Log in</Link><Link className="header-auth-button signup" to="/account?mode=signup">Sign up</Link></> : <div className="account-menu-wrap">
            <button className="header-account-button" type="button" aria-label="Open my account menu" aria-expanded={accountOpen} onClick={() => setAccountOpen(value => !value)}><UserRound size={21} /></button>
            {accountOpen && <div className="account-popover"><span>{user.email}</span><Link to="/account"><UserRound size={16} /> My account</Link><Link to="/my-subjects"><BookOpen size={16} /> My subjects</Link><Link to="/dashboard"><Gauge size={16} /> Progress</Link><button type="button" onClick={signOut}><LogOut size={16} /> Log out</button></div>}
          </div>}
        </div>
      </div>
      <nav className="category-nav" aria-label="Quick links"><NavLink to="/">Home</NavLink><NavLink to="/subjects">Learn</NavLink><NavLink to="/homework-help">Homework Help</NavLink>{shopLinks.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
    </header>

    <main className="page"><GradePremiumGate><SubjectProgrammeLink /><Outlet /></GradePremiumGate></main>
    <footer className="site-policy-footer"><span>FutureAfricaMinds</span><Link to="/refund-policy">Refund and cancellation policy</Link></footer>
    <nav className="bottom-nav" aria-label="Primary navigation"><NavLink to="/"><Home size={20} /><span>Home</span></NavLink><NavLink to="/subjects"><BookOpen size={20} /><span>Learn</span></NavLink><NavLink to="/dashboard"><Gauge size={20} /><span>Progress</span></NavLink><NavLink to="/shop"><ShoppingBag size={20} /><span>Shop</span></NavLink></nav>

    {menuOpen && <div className="drawer-layer" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setMenuOpen(false) }}><aside className="side-drawer" aria-label="FAM menu">
      <header><Link to="/" className="brand"><span className="brand-mark">FAM</span><span><strong>FutureAfricaMinds</strong><small>Learn Today. Lead Tomorrow.</small></span></Link><button className="header-icon-button" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={22} /></button></header>
      <div className="drawer-section"><span>LEARNING</span><Link to="/"><Home size={18} /> Home</Link><Link to="/"><GraduationCap size={18} /> Choose grade</Link><Link to="/subjects"><BookOpen size={18} /> Subjects</Link><Link to="/homework-help"><b className="drawer-sparkle">✦</b> Homework & assignment help</Link><Link to="/dashboard"><Gauge size={18} /> My progress</Link></div>
      <div className="drawer-section"><span>FAM SHOP</span><Link to="/shop"><ShoppingBag size={18} /> Shop home</Link>{shopLinks.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}<Link to="/shop/second-hand-books">Buy second-hand books</Link><Link to="/shop/sell-books">Sell your books</Link></div>
      <div className="drawer-section"><span>ACCOUNT & SUPPORT</span><Link to="/account"><UserRound size={18} /> My account</Link><Link to="/parent-dashboard">Parent dashboard</Link><Link to="/account">Help and support</Link><Link to="/refund-policy">Refunds and cancellations</Link>{user && <button type="button" onClick={signOut}><LogOut size={17} /> Log out</button>}</div>
    </aside></div>}

    {searchOpen && <div className="search-layer" role="dialog" aria-modal="true" aria-label="Search FAM"><div className="search-panel">
      <header><div><span className="eyebrow">SEARCH FAM</span><h2>What are you looking for?</h2></div><button className="header-icon-button" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={22} /></button></header>
      <label className="global-search"><Search size={20} /><input autoFocus type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search lessons, past papers or products" /></label>
      <div className="search-results">{results.map(item => <Link to={item.to} key={`${item.group}-${item.label}`}><span>{item.group}</span><strong>{item.label}</strong><small>{item.detail}</small></Link>)}{results.length === 0 && <p>No matching FAM content found.</p>}</div>
    </div></div>}
  </div>
}
