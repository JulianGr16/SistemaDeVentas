import { useState } from 'react'
import ConfirmModal from './ConfirmModal'
import './CashRegister.css'

const formatDateTime = (date) =>
  new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(date))

function CashRegister({ register, onOpen, onClose }) {
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false)

  const openRegister = () => {
    if (register.isOpen) return
    onOpen()
  }

  const closeRegister = () => {
    if (!register.isOpen) return

    onClose()
    setShowCloseConfirmation(false)
  }

  return (
    <section className="cash-register" aria-labelledby="cash-register-title">
      <div className="cash-register__status">
        <span
          className={`status-dot ${register.isOpen ? 'status-dot--open' : ''}`}
          aria-hidden="true"
        />
        <div>
          <h2 id="cash-register-title">
            Caja {register.isOpen ? 'abierta' : 'cerrada'}
          </h2>
          {register.openedAt ? (
            <p>
              {register.isOpen ? 'Abierta' : 'Última apertura'}: {' '}
              <time dateTime={register.openedAt}>
                {formatDateTime(register.openedAt)}
              </time>
            </p>
          ) : (
            <p>Todavía no se registró una apertura.</p>
          )}
          {!register.isOpen && register.closedAt && (
            <p>
              Último cierre: {' '}
              <time dateTime={register.closedAt}>
                {formatDateTime(register.closedAt)}
              </time>
            </p>
          )}
        </div>
      </div>

      <div className="cash-register__actions">
        <button
          className="cash-button cash-button--open"
          type="button"
          onClick={openRegister}
          disabled={register.isOpen}
        >
          Abrir caja
        </button>
        {register.isOpen && (
          <button
            className="cash-button cash-button--close"
            type="button"
            onClick={() => setShowCloseConfirmation(true)}
          >
            Cerrar caja
          </button>
        )}
      </div>

      {showCloseConfirmation && (
        <ConfirmModal
          title="¿Cerrar la caja?"
          message="Se registrará la fecha y hora del cierre. Esta acción finalizará la caja actual."
          confirmText="Sí, cerrar caja"
          onCancel={() => setShowCloseConfirmation(false)}
          onConfirm={closeRegister}
        />
      )}
    </section>
  )
}

export default CashRegister
