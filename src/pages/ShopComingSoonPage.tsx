import { ArrowRight, BookOpen, ShoppingBag, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

const labels: Record<string, string> = {
  stationery: 'Stationery', books: 'Books', workbooks: 'Workbooks', 'labels-and-covers': 'Labels & Covers', 'second-hand-books': 'Second-hand Books', 'sell-books': 'Sell Your Books'
}

export default function ShopComingSoonPage() {
  const { category } = useParams()
  const selected = category ? labels[category] : undefined
  return <div className="shop-coming-page">
    <section className="shop-coming-hero">
      <div className="shop-coming-icon"><ShoppingBag size={38} /></div>
      <span className="eyebrow"><Sparkles size={14} /> FAM SHOP</span>
      <h1>{selected ?? 'The FAM Shop'} is coming soon</h1>
      <p>Stationery, books, workbooks, labels and affordable second-hand learning materials—all in one trusted place.</p>
      {selected && <div className="shop-selection">You selected: <strong>{selected}</strong></div>}
      <div className="shop-coming-actions"><Link className="button primary" to="/subjects"><BookOpen size={18} /> Continue learning</Link><Link className="button secondary" to="/">Return home <ArrowRight size={18} /></Link></div>
    </section>
  </div>
}
