import SectionPage from './SectionPage'
import './EstadisticasVentas.css'

const SALES_STORAGE_KEY = 'sistema-ventas-facturaciones'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const getProductStatistics = () => {
  try {
    const sales = JSON.parse(localStorage.getItem(SALES_STORAGE_KEY) || '[]')
    const products = new Map()

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const id = item.productId || item.name
        const product = products.get(id) || {
          id,
          name: item.name,
          quantity: 0,
          revenue: 0,
          appearances: 0,
        }

        product.quantity += item.quantity
        product.revenue += item.subtotal
        product.appearances += 1
        products.set(id, product)
      })
    })

    return [...products.values()].sort((a, b) =>
      b.quantity - a.quantity || b.revenue - a.revenue,
    )
  } catch {
    return []
  }
}

function EstadisticasVentas() {
  const products = getProductStatistics()
  const topProduct = products[0]
  const totalUnits = products.reduce((total, product) => total + product.quantity, 0)
  const totalRevenue = products.reduce((total, product) => total + product.revenue, 0)
  const maximumQuantity = topProduct?.quantity || 1

  return (
    <SectionPage
      eyebrow="Reportes"
      title="Estadísticas de ventas"
      description="Conocé cuáles son los productos más elegidos por tus clientes."
      icon="ES"
      color="orange"
    >
      {products.length === 0 ? (
        <div className="statistics-empty">
          <span aria-hidden="true">↗</span>
          <p>Todavía no hay estadísticas disponibles.</p>
          <small>Facturá una venta para comenzar a generar el ranking.</small>
        </div>
      ) : (
        <>
          <div className="statistics-summary">
            <article className="top-product-card">
              <span className="top-product-card__badge">Más vendido</span>
              <strong>{topProduct.name}</strong>
              <p>{topProduct.quantity} unidades vendidas</p>
            </article>
            <article>
              <span>Productos vendidos</span>
              <strong>{totalUnits}</strong>
            </article>
            <article>
              <span>Ingresos registrados</span>
              <strong>{currencyFormatter.format(totalRevenue)}</strong>
            </article>
          </div>

          <div className="ranking-heading">
            <div>
              <h2>Ranking de productos</h2>
              <p>Ordenado por cantidad de unidades vendidas.</p>
            </div>
            <span>{products.length} productos</span>
          </div>

          <div className="product-ranking">
            {products.map((product, index) => {
              const percentage = totalUnits
                ? (product.quantity / totalUnits) * 100
                : 0
              const barWidth = (product.quantity / maximumQuantity) * 100

              return (
                <article className="ranking-item" key={product.id}>
                  <span className={`ranking-item__position ${index < 3 ? 'ranking-item__position--top' : ''}`}>
                    {index + 1}
                  </span>
                  <div className="ranking-item__product">
                    <div className="ranking-item__name">
                      <strong>{product.name}</strong>
                      <span>{percentage.toFixed(1)}% del total</span>
                    </div>
                    <div className="ranking-item__bar" aria-hidden="true">
                      <span style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                  <div className="ranking-item__quantity">
                    <strong>{product.quantity}</strong>
                    <span>unidades</span>
                  </div>
                  <div className="ranking-item__revenue">
                    <strong>{currencyFormatter.format(product.revenue)}</strong>
                    <span>recaudado</span>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </SectionPage>
  )
}

export default EstadisticasVentas
