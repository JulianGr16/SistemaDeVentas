import './ProductCard.css'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

function ProductCard({ product, onAdd, onEdit }) {
  return (
    <article
      className="product-card"
    >
      <button
        className="product-card__edit"
        type="button"
        onClick={() => onEdit(product)}
        aria-label={`Modificar precio de ${product.name}`}
        title="Modificar precio"
      >
        ✎
      </button>
      <span className="product-card__icon" aria-hidden="true">
        {product.icon}
      </span>
      <span className="product-card__name">{product.name}</span>
      <strong>{currencyFormatter.format(product.price)}</strong>
      <button
        className="product-card__action"
        type="button"
        onClick={() => onAdd(product)}
        aria-label={`Agregar ${product.name} al carrito`}
      >
        + Agregar
      </button>
    </article>
  )
}

export default ProductCard
