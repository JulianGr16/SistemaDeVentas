import './Cart.css'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

function Cart({
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  onInvoice,
  canInvoice,
}) {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  return (
    <section className="cart" aria-labelledby="cart-title">
      <div className="cart__header">
        <div>
          <h2 id="cart-title">Carrito</h2>
          <p>{totalItems === 1 ? '1 producto' : `${totalItems} productos`}</p>
        </div>
        {items.length > 0 && (
          <button className="cart__clear" type="button" onClick={onClear}>
            Vaciar carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="cart__empty">
          <span aria-hidden="true">🛒</span>
          <p>El carrito está vacío.</p>
          <small>Los productos que selecciones aparecerán aquí.</small>
        </div>
      ) : (
        <>
          <div className="cart__items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <span className="cart-item__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="cart-item__info">
                  <strong>{item.name}</strong>
                  <span>{currencyFormatter.format(item.price)} c/u</span>
                </div>
                <div className="quantity-control" aria-label={`Cantidad de ${item.name}`}>
                  <button type="button" onClick={() => onUpdateQuantity(item.id, -1)} aria-label={`Quitar un ${item.name}`}>−</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => onUpdateQuantity(item.id, 1)} aria-label={`Agregar otro ${item.name}`}>+</button>
                </div>
                <strong className="cart-item__subtotal">
                  {currencyFormatter.format(item.price * item.quantity)}
                </strong>
                <button className="cart-item__remove" type="button" onClick={() => onRemove(item.id)} aria-label={`Eliminar ${item.name}`}>×</button>
              </article>
            ))}
          </div>

          <footer className="cart__footer">
            <div className="cart__total">
              <span>Total</span>
              <strong>{currencyFormatter.format(totalPrice)}</strong>
            </div>
            <button
              className="invoice-button"
              type="button"
              onClick={onInvoice}
              disabled={!canInvoice}
              title={canInvoice ? 'Registrar venta' : 'Primero tenés que abrir la caja'}
            >
              Facturar
            </button>
          </footer>
        </>
      )}

    </section>
  )
}

export default Cart
