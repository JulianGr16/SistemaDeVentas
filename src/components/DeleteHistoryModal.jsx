import { useState } from 'react'
import './DeleteHistoryModal.css'

const DELETE_PASSWORD = 'eliminarHistorial#123'

function DeleteHistoryModal({ session, onCancel, onConfirm }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (password !== DELETE_PASSWORD) {
      setError('La clave ingresada es incorrecta.')
      return
    }
    onConfirm()
  }

  return (
    <div className="delete-history-backdrop" role="presentation" onMouseDown={onCancel}>
      <div className="delete-history-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-history-title" onMouseDown={(event) => event.stopPropagation()}>
        <span className="delete-history-modal__icon" aria-hidden="true">!</span>
        <h2 id="delete-history-title">¿Eliminar este historial?</h2>
        <p>Se eliminarán la sesión y sus {session.sales.length} ventas. Esta acción no se puede deshacer.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="delete-password">Clave de autorización</label>
          <div className="delete-password-input">
            <input id="delete-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} autoComplete="off" autoFocus required />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              <span aria-hidden="true">{showPassword ? '🙈' : '👁'}</span>
            </button>
          </div>
          {error && <p className="delete-history-modal__error" role="alert">{error}</p>}
          <div className="delete-history-modal__actions">
            <button type="button" className="delete-cancel" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="delete-confirm">Eliminar historial</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeleteHistoryModal
