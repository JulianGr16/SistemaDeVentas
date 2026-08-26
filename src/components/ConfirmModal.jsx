import './ConfirmModal.css'

function ConfirmModal({ title, message, confirmText, onCancel, onConfirm }) {
  return (
    <div className="confirm-backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="confirm-modal__icon" aria-hidden="true">!</span>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>

        <div className="confirm-modal__actions">
          <button type="button" className="confirm-cancel" onClick={onCancel} autoFocus>
            Cancelar
          </button>
          <button type="button" className="confirm-accept" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
