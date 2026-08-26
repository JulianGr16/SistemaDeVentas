import './NoticeModal.css'

function NoticeModal({ title, message, onClose }) {
  return (
    <div className="notice-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="notice-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="notice-title"
        aria-describedby="notice-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="notice-modal__icon" aria-hidden="true">i</span>
        <h2 id="notice-title">{title}</h2>
        <p id="notice-message">{message}</p>
        <button type="button" onClick={onClose} autoFocus>
          Entendido
        </button>
      </div>
    </div>
  )
}

export default NoticeModal
