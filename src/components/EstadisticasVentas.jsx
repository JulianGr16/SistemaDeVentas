import SectionPage from './SectionPage'

function EstadisticasVentas() {
  return (
    <SectionPage
      eyebrow="Reportes"
      title="Estadísticas de ventas"
      description="Analizá el rendimiento y las ventas de cada producto."
      icon="ES"
      color="orange"
    >
      <div className="empty-state"><p>Los gráficos y métricas se mostrarán aquí.</p></div>
    </SectionPage>
  )
}

export default EstadisticasVentas
