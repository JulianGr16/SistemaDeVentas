import MenuCard from '../components/MenuCard'
import './MainMenu.css'

const menuItems = [
  {
    id: 'nota-venta',
    path: '/nota-venta',
    title: 'Nota de venta',
    description: 'Registrá productos, cantidades y medios de pago.',
    icon: 'NV',
    color: 'blue',
  },
  {
    id: 'recaudado',
    path: '/recaudado',
    title: 'Recaudado',
    description: 'Consultá los ingresos y el total de la jornada.',
    icon: '$',
    color: 'green',
  },
  {
    id: 'usuarios',
    path: '/usuarios',
    title: 'Usuarios',
    description: 'Administrá las personas que usan el sistema.',
    icon: 'US',
    color: 'violet',
  },
  {
    id: 'estadisticas',
    path: '/estadisticas',
    title: 'Estadísticas de ventas',
    description: 'Revisá el rendimiento y las ventas por producto.',
    icon: 'ES',
    color: 'orange',
  },
]

function MainMenu() {
  return (
    <nav className="main-menu" aria-label="Menú principal">
      {menuItems.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </nav>
  )
}

export default MainMenu
