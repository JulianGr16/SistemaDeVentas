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
    id: 'stock',
    path: '/stock',
    title: 'Stock',
    description: 'Administrá productos, cantidades y precios.',
    icon: 'ST',
    color: 'green',
  },
  {
    id: 'detalle-cajas',
    path: '/detalle-cajas',
    title: 'Detalle de cajas',
    description: 'Consultá ventas, productos y horarios de cada turno.',
    icon: 'DC',
    color: 'violet',
  },
  {
    id: 'movimientos',
    path: '/movimientos',
    title: 'Movimientos',
    description: 'Revisá cada apertura y cierre de caja.',
    icon: 'MV',
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
