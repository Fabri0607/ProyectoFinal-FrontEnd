import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPages from './pages/AuthPages'; // Tu componente de login/registro
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import VentaDetalle from './pages/VentaDetalle';
import Movimientos from './pages/Movimientos';
import Parametros from './pages/Parametros';
import Reportes from './pages/Reportes';

// Hook personalizado para manejar la autenticación
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token válido al cargar la aplicación
    const checkAuth = () => {
      const token = sessionStorage.getItem('authToken');
      const expiration = sessionStorage.getItem('tokenExpiration');
      
      if (token && expiration) {
        const expirationDate = new Date(expiration);
        const now = new Date();
        
        if (expirationDate > now) {
          setIsAuthenticated(true);
        } else {
          // Token expirado, limpiar storage
          sessionStorage.clear();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();

    // Listener para cambios en sessionStorage (útil para múltiples pestañas)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (tokenData) => {
    sessionStorage.setItem('authToken', tokenData.token);
    sessionStorage.setItem('tokenExpiration', tokenData.expiration);
    if (tokenData.userName) {
      sessionStorage.setItem('userName', tokenData.userName);
    }
    if (tokenData.roles) {
      sessionStorage.setItem('userRoles', JSON.stringify(tokenData.roles));
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
};

// Componente para proteger rutas
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Layout del Dashboard
const DashboardLayout = ({ children, onLogout }) => {
  return (
    <div className="flex">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

function App() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Toaster position="top-right" />
        
        {!isAuthenticated ? (
          // Mostrar solo las páginas de autenticación
          <Routes>
            <Route 
              path="*" 
              element={<AuthPages onLogin={login} />} 
            />
          </Routes>
        ) : (
          // Mostrar el dashboard con rutas protegidas
          <DashboardLayout onLogout={logout}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/ventas/:id" element={<VentaDetalle />} />
              <Route path="/movimientos" element={<Movimientos />} />
              <Route path="/parametros" element={<Parametros />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DashboardLayout>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;