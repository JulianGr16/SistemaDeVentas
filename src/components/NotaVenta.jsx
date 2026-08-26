import SectionPage from './SectionPage'

function NotaVenta() {
  return (
    <SectionPage
      eyebrow="Ventas"
      title="Nota de venta"
      description="Registrá los productos y el pago de una nueva venta."
      icon="NV"
      color="blue"
    >
      <div className="empty-state"><p>El formulario de venta se agregará aquí.</p></div>
    </SectionPage>
  )
}

export default NotaVenta
