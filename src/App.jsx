import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import VentaDetalle from './pages/VentaDetalle';
import Movimientos from './pages/Movimientos';
import Parametros from './pages/Parametros';
import Reportes from './pages/Reportes';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/ventas/:id" element={<VentaDetalle />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/parametros" element={<Parametros />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;