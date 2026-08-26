import SectionPage from './SectionPage'
import './Movimientos.css'

const MOVEMENTS_STORAGE_KEY = 'sistema-ventas-movimientos'

const getMovements = () => {
  try {
    return JSON.parse(localStorage.getItem(MOVEMENTS_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' }).format(new Date(date))

const formatTime = (date) =>
  new Intl.DateTimeFormat('es-AR', { timeStyle: 'medium' }).format(new Date(date))

function Movimientos() {
  const movements = getMovements().toReversed()

  return (
    <SectionPage
      eyebrow="Caja"
      title="Movimientos"
      description="Historial de aperturas y cierres de caja."
      icon="MV"
      color="violet"
    >
      <div className="movements-heading">
        <div>
          <h2>Historial de caja</h2>
          <p>Los movimientos más recientes aparecen primero.</p>
        </div>
        <span>{movements.length} registros</span>
      </div>

      {movements.length === 0 ? (
        <div className="movements-empty">
          <span aria-hidden="true">↕</span>
          <p>Todavía no hay movimientos registrados.</p>
          <small>Las aperturas y cierres de caja aparecerán aquí.</small>
        </div>
      ) : (
        <div className="movements-list">
          {movements.map((movement) => {
            const isOpening = movement.type === 'apertura'

            return (
              <article className="movement-item" key={movement.id}>
                <span
                  className={`movement-item__icon ${
                    isOpening
                      ? 'movement-item__icon--opening'
                      : 'movement-item__icon--closing'
                  }`}
                  aria-hidden="true"
                >
                  {isOpening ? '↗' : '↙'}
                </span>
                <div className="movement-item__info">
                  <strong>{isOpening ? 'Apertura de caja' : 'Cierre de caja'}</strong>
                  <span>{formatDate(movement.date)}</span>
                </div>
                <time dateTime={movement.date}>{formatTime(movement.date)}</time>
              </article>
            )
          })}
        </div>
      )}
    </SectionPage>
  )
}

export default Movimientos
