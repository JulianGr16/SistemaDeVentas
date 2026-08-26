import SectionPage from './SectionPage'

function Usuarios() {
  return (
    <SectionPage
      eyebrow="Administración"
      title="Usuarios"
      description="Administrá las personas que tienen acceso al sistema."
      icon="US"
      color="violet"
    >
      <div className="empty-state"><p>La administración de usuarios se agregará aquí.</p></div>
    </SectionPage>
  )
}

export default Usuarios
