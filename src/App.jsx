import { useState } from 'react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-1 transition-all duration-300 min-h-screen ${
            isSidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/ventas/:id" element={<VentaDetalle />} />
            <Route path="/movimientos" element={<Movimientos />} />
            <Route path="/parametros" element={<Parametros />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;