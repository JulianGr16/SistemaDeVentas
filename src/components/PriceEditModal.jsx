import { useEffect, useRef, useState } from 'react'
import './PriceEditModal.css'

const PRICE_PASSWORD = 'cambioPrecio#123'

function PriceEditModal({ item, onClose, onConfirm }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [price, setPrice] = useState(String(item.price))
  const [error, setError] = useState('')
  const passwordInputRef = useRef(null)

  useEffect(() => {
    passwordInputRef.current?.focus()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const parsedPrice = Number(price)

    if (password !== PRICE_PASSWORD) {
      setError('La clave ingresada es incorrecta.')
      return
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Ingresá un precio mayor a cero.')
      return
    }

    onConfirm(parsedPrice)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="price-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="price-modal__header">
          <div>
            <p>Precio protegido</p>
            <h2 id="price-modal-title">Modificar {item.name}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="price-password">
            Clave de autorización
            <span className="password-input">
              <input
                ref={passwordInputRef}
                id="price-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
                autoComplete="off"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((isVisible) => !isVisible)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <span aria-hidden="true">{showPassword ? '🙈' : '👁'}</span>
              </button>
            </span>
          </label>

          <label htmlFor="new-price">
            Nuevo precio
            <span className="price-input">
              <span>$</span>
              <input
                id="new-price"
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(event) => {
                  setPrice(event.target.value)
                  setError('')
                }}
                required
              />
            </span>
          </label>

          {error && <p className="price-modal__error" role="alert">{error}</p>}

          <div className="price-modal__actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button-primary">
              Guardar precio
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PriceEditModal
