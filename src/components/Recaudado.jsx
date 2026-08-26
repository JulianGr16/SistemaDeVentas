import SectionPage from './SectionPage'

function Recaudado() {
  return (
    <SectionPage
      eyebrow="Caja"
      title="Recaudado"
      description="Consultá los ingresos y el total acumulado de la jornada."
      icon="$"
      color="green"
    >
      <div className="empty-state"><p>El resumen de recaudación se mostrará aquí.</p></div>
    </SectionPage>
  )
}

export default Recaudado
