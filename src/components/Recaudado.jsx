import { useState } from 'react'
import DeleteHistoryModal from './DeleteHistoryModal'
import RevenueDetailModal from './RevenueDetailModal'
import SectionPage from './SectionPage'
import './Recaudado.css'

const SALES_STORAGE_KEY = 'sistema-ventas-facturaciones'
const MOVEMENTS_STORAGE_KEY = 'sistema-ventas-movimientos'
const REGISTER_STORAGE_KEY = 'sistema-ventas-caja'

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback
  } catch {
    return fallback
  }
}

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})
const dateFormatter = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' })
const timeFormatter = new Intl.DateTimeFormat('es-AR', { timeStyle: 'short' })

const buildSessions = () => {
  const sales = readStorage(SALES_STORAGE_KEY, [])
  const movements = readStorage(MOVEMENTS_STORAGE_KEY, [])
  const currentRegister = readStorage(REGISTER_STORAGE_KEY, null)
  const sessions = new Map()

  movements.filter(({ type }) => type === 'apertura').forEach((movement) => {
    const id = movement.cashSessionId || movement.date
    sessions.set(id, { id, openedAt: movement.date, closedAt: null, sales: [] })
  })

  movements.filter(({ type }) => type === 'cierre').forEach((movement) => {
    let session = movement.cashSessionId ? sessions.get(movement.cashSessionId) : null
    if (!session) {
      session = [...sessions.values()]
        .filter((candidate) => !candidate.closedAt && candidate.openedAt <= movement.date)
        .sort((a, b) => b.openedAt.localeCompare(a.openedAt))[0]
    }
    if (session) session.closedAt = movement.date
  })

  sales.forEach((sale) => {
    const id = sale.cashSessionId || sale.cashOpenedAt
    if (!sessions.has(id)) {
      sessions.set(id, {
        id,
        openedAt: sale.cashOpenedAt || sale.createdAt,
        closedAt: null,
        sales: [],
      })
    }
    sessions.get(id).sales.push(sale)
  })

  if (currentRegister?.openedAt) {
    const id = currentRegister.sessionId || currentRegister.openedAt
    const session = sessions.get(id) || {
      id, openedAt: currentRegister.openedAt, closedAt: null, sales: [],
    }
    session.closedAt = currentRegister.isOpen ? null : currentRegister.closedAt
    sessions.set(id, session)
  }

  return [...sessions.values()].map((session) => {
    const products = new Map()
    let total = 0
    let units = 0

    session.sales.forEach((sale) => {
      total += sale.total
      sale.items.forEach((item) => {
        units += item.quantity
        const product = products.get(item.name) || { name: item.name, quantity: 0, total: 0 }
        product.quantity += item.quantity
        product.total += item.subtotal
        products.set(item.name, product)
      })
    })

    return {
      ...session,
      total,
      units,
      products: [...products.values()].sort((a, b) => b.total - a.total),
    }
  }).sort((a, b) => b.openedAt.localeCompare(a.openedAt))
}

function Recaudado() {
  const [selectedSession, setSelectedSession] = useState(null)
  const [sessionToDelete, setSessionToDelete] = useState(null)
  const [, setDataVersion] = useState(0)
  const sessions = buildSessions()
  const totalRevenue = sessions.reduce((total, session) => total + session.total, 0)
  const totalSales = sessions.reduce((total, session) => total + session.sales.length, 0)
  const totalUnits = sessions.reduce((total, session) => total + session.units, 0)

  const deleteSession = () => {
    if (!sessionToDelete) return

    const sales = readStorage(SALES_STORAGE_KEY, [])
    const movements = readStorage(MOVEMENTS_STORAGE_KEY, [])
    const currentRegister = readStorage(REGISTER_STORAGE_KEY, null)
    const isSessionSale = (sale) =>
      (sale.cashSessionId || sale.cashOpenedAt) === sessionToDelete.id
    const isSessionMovement = (movement) =>
      movement.cashSessionId === sessionToDelete.id ||
      (!movement.cashSessionId &&
        (movement.date === sessionToDelete.openedAt ||
          movement.date === sessionToDelete.closedAt))

    localStorage.setItem(
      SALES_STORAGE_KEY,
      JSON.stringify(sales.filter((sale) => !isSessionSale(sale))),
    )
    localStorage.setItem(
      MOVEMENTS_STORAGE_KEY,
      JSON.stringify(movements.filter((movement) => !isSessionMovement(movement))),
    )

    if (
      currentRegister &&
      (currentRegister.sessionId || currentRegister.openedAt) === sessionToDelete.id
    ) {
      localStorage.setItem(
        REGISTER_STORAGE_KEY,
        JSON.stringify({ isOpen: false, openedAt: null, closedAt: null }),
      )
    }

    setSessionToDelete(null)
    setSelectedSession(null)
    setDataVersion((version) => version + 1)
  }

  return (
    <SectionPage
      eyebrow="Caja"
      title="Recaudado"
      description="Consultá los ingresos y el detalle de cada jornada."
      icon="$"
      color="green"
    >
      <div className="revenue-summary">
        <article><span>Total recaudado</span><strong>{currencyFormatter.format(totalRevenue)}</strong></article>
        <article><span>Ventas facturadas</span><strong>{totalSales}</strong></article>
        <article><span>Productos vendidos</span><strong>{totalUnits}</strong></article>
      </div>

      <div className="sessions-heading">
        <div><h2>Sesiones de caja</h2><p>Resumen de ventas por cada apertura.</p></div>
        <span>{sessions.length} sesiones</span>
      </div>

      {sessions.length === 0 ? (
        <div className="revenue-empty">
          <span aria-hidden="true">$</span>
          <p>Todavía no hay recaudación registrada.</p>
          <small>Las ventas facturadas aparecerán en esta sección.</small>
        </div>
      ) : (
        <div className="cash-sessions">
          {sessions.map((session) => (
            <div className="cash-session-row" key={session.id}>
            <button
              className="cash-session"
              type="button"
              onClick={() => setSelectedSession(session)}
              aria-label={`Ver detalle de la recaudación del ${dateFormatter.format(new Date(session.openedAt))}`}
            >
              <span className={`cash-session__indicator ${session.closedAt ? 'cash-session__indicator--closed' : ''}`} aria-hidden="true">
                {session.closedAt ? '✓' : '•'}
              </span>
              <div className="cash-session__summary">
                <div>
                  <div className="cash-session__title">
                    <h3>{dateFormatter.format(new Date(session.openedAt))}</h3>
                    <span className={session.closedAt ? 'session-closed' : 'session-open'}>
                      {session.closedAt ? 'Cerrada' : 'Abierta'}
                    </span>
                  </div>
                  <p>
                    Apertura {timeFormatter.format(new Date(session.openedAt))} · {' '}
                    {session.closedAt
                      ? `Cierre ${timeFormatter.format(new Date(session.closedAt))}`
                      : 'En curso'}
                  </p>
                </div>
              </div>
              <span className="cash-session__total">
                <small>{session.sales.length} ventas · {session.units} productos</small>
                <strong>{currencyFormatter.format(session.total)}</strong>
              </span>
              <span className="cash-session__arrow" aria-hidden="true">→</span>
            </button>
              <button
                className="cash-session__delete"
                type="button"
                onClick={() => setSessionToDelete(session)}
                aria-label={`Eliminar registro del ${dateFormatter.format(new Date(session.openedAt))}`}
                title="Eliminar registro"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedSession && (
        <RevenueDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {sessionToDelete && (
        <DeleteHistoryModal
          session={sessionToDelete}
          onCancel={() => setSessionToDelete(null)}
          onConfirm={deleteSession}
        />
      )}
    </SectionPage>
  )
}

export default Recaudado
