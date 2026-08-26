import { Link } from 'react-router-dom'
import './MenuCard.css'

function MenuCard({ item }) {
  return (
    <Link
      className="menu-card"
      to={item.path}
      aria-label={`Abrir ${item.title}`}
    >
      <span className={`menu-card__icon menu-card__icon--${item.color}`}>
        {item.icon}
      </span>
      <span className="menu-card__content">
        <strong>{item.title}</strong>
        <span>{item.description}</span>
      </span>
      <span className="menu-card__arrow" aria-hidden="true">→</span>
    </Link>
  )
}

export default MenuCard
