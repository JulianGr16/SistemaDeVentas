import './ProductCard.css'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

function ProductCard({ product, onAdd }) {
  return (
    <button
      className="product-card"
      type="button"
      onClick={() => onAdd(product)}
      aria-label={`Agregar ${product.name} al carrito`}
    >
      <span className="product-card__icon" aria-hidden="true">
        {product.icon}
      </span>
      <span className="product-card__name">{product.name}</span>
      <strong>{currencyFormatter.format(product.price)}</strong>
      <span className="product-card__action">+ Agregar</span>
    </button>
  )
}

export default ProductCard
