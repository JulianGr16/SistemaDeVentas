import './ProductCard.css'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

function ProductCard({ product, onAdd }) {
  const hasPrice = product.price > 0
  const hasStock = product.quantity > 0

  return (
    <article
      className="product-card"
    >
      <span className="product-card__icon" aria-hidden="true">
        {product.icon}
      </span>
      <span className="product-card__name">{product.name}</span>
      <strong className={!hasPrice ? 'product-card__pending-price' : ''}>
        {hasPrice ? currencyFormatter.format(product.price) : 'Precio pendiente'}
      </strong>
      <span className="product-card__stock">
        {product.quantity} {product.quantity === 1 ? 'unidad' : 'unidades'} disponibles
      </span>
      <button
        className="product-card__action"
        type="button"
        onClick={() => onAdd(product)}
        disabled={!hasPrice || !hasStock}
        aria-label={`Agregar ${product.name} al carrito`}
      >
        {!hasPrice ? 'Precio pendiente' : hasStock ? '+ Agregar' : 'Sin stock'}
      </button>
    </article>
  )
}

export default ProductCard
