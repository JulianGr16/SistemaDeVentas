import { Navigate, Route, Routes } from 'react-router-dom'
import MainMenu from './common/MainMenu'
import EstadisticasVentas from './components/EstadisticasVentas'
import NotaVenta from './components/NotaVenta'
import Recaudado from './components/Recaudado'
import Usuarios from './components/Usuarios'
import './App.css'

function Home() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Puesto de feria</p>
          <h1>Sistema de ventas</h1>
          <p className="welcome">Seleccioná una opción para comenzar.</p>
        </div>
      </header>

      <MainMenu />
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nota-venta" element={<NotaVenta />} />
      <Route path="/recaudado" element={<Recaudado />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/estadisticas" element={<EstadisticasVentas />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
