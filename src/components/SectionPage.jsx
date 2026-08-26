import { Link } from 'react-router-dom'
import './SectionPage.css'

function SectionPage({ eyebrow, title, description, icon, color, children }) {
  return (
    <main className="section-page">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span> Volver al inicio
      </Link>

      <header className="section-header">
        <span className={`section-icon section-icon--${color}`}>{icon}</span>
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>

      <section className="section-content">{children}</section>
    </main>
  )
}

export default SectionPage
