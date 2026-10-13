import { Navigate, Route, Routes } from 'react-router-dom'
import MainMenu from './common/MainMenu'
import EstadisticasVentas from './components/EstadisticasVentas'
import NotaVenta from './components/NotaVenta'
import Stock from './components/Stock'
import DetalleCajas from './components/Recaudado'
import Movimientos from './components/Movimientos'
import './App.css'

function Home() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Tienda de electrónica</p>
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
      <Route path="/stock" element={<Stock />} />
      <Route path="/detalle-cajas" element={<DetalleCajas />} />
      <Route path="/recaudado" element={<Navigate to="/detalle-cajas" replace />} />
      <Route path="/movimientos" element={<Movimientos />} />
      <Route path="/estadisticas" element={<EstadisticasVentas />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
