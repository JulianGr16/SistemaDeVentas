import './RevenueDetailModal.css'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' })
const timeFormatter = new Intl.DateTimeFormat('es-AR', { timeStyle: 'short' })

function RevenueDetailModal({ session, onClose }) {
  return (
    <div className="revenue-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="revenue-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="revenue-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="revenue-modal__header">
          <div>
            <p>Detalle de caja</p>
            <h2 id="revenue-modal-title">
              {dateFormatter.format(new Date(session.openedAt))}
            </h2>
            <span>
              Fecha y hora de apertura: {dateFormatter.format(new Date(session.openedAt))}, {timeFormatter.format(new Date(session.openedAt))} · {' '}
              {session.closedAt
                ? `Cierre: ${dateFormatter.format(new Date(session.closedAt))}, ${timeFormatter.format(new Date(session.closedAt))}`
                : 'Caja en curso'}
            </span>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar detalle">×</button>
        </header>

        <div className="revenue-modal__summary">
          <div><span>Total</span><strong>{currencyFormatter.format(session.total)}</strong></div>
          <div><span>Ventas</span><strong>{session.sales.length}</strong></div>
          <div><span>Productos</span><strong>{session.units}</strong></div>
        </div>

        <section className="revenue-modal__section">
          <h3>Productos más vendidos</h3>
          {session.products.length === 0 ? (
            <p className="revenue-modal__empty">No se vendieron productos en esta sesión.</p>
          ) : (
            <div className="revenue-product-list">
              {session.products.map((product) => (
                <div key={product.name}>
                  <strong>{product.name}</strong>
                  <span>{product.quantity} unidades</span>
                  <span>{currencyFormatter.format(product.total)} vendidos</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {session.sales.length > 0 && (
          <section className="revenue-modal__section">
            <h3>Ventas facturadas</h3>
            <div className="invoice-list">
              {session.sales.toReversed().map((sale, index) => (
                <article className="invoice-detail" key={sale.id}>
                  <header>
                    <div>
                      <strong>Venta #{session.sales.length - index}</strong>
                      <time dateTime={sale.createdAt}>{timeFormatter.format(new Date(sale.createdAt))}</time>
                    </div>
                    <strong>{currencyFormatter.format(sale.total)}</strong>
                  </header>
                  <ul>
                    {sale.items.map((item) => (
                      <li key={`${sale.id}-${item.productId}`}>
                        <span>{item.quantity} × {item.name}</span>
                        <span>{currencyFormatter.format(item.subtotal)}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        <footer className="revenue-modal__footer">
          <button type="button" onClick={onClose}>Cerrar</button>
        </footer>
      </div>
    </div>
  )
}

export default RevenueDetailModal
