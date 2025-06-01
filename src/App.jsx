import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPages from './pages/AuthPages';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import VentaDetalle from './pages/VentaDetalle';
import Movimientos from './pages/Movimientos';
import Parametros from './pages/Parametros';
import Reportes from './pages/Reportes';
import UserManagement from './pages/UserManagement';
import ErrorBoundary from './components/ErrorBoundary';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const rolesStored = JSON.parse(localStorage.getItem('roles') || '[]');
      console.log('Token:', token);
      console.log('Roles:', rolesStored);

      if (token) {
        setIsAuthenticated(true);
        setRoles(rolesStored);
      } else {
        setIsAuthenticated(false);
        setRoles([]);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (tokenData) => {
    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('userName', tokenData.userName);
    localStorage.setItem('roles', JSON.stringify(tokenData.roles));
    console.log('Login roles:', tokenData.roles);
    setIsAuthenticated(true);
    setRoles(tokenData.roles);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRoles([]);
  };

  return { isAuthenticated, isLoading, roles, login, logout };
};

const ProtectedRoute = ({ children, allowedRoles, userRoles, isAuthenticated }) => {
  const isAllowed = allowedRoles.some(role => userRoles.includes(role));
  console.log('ProtectedRoute - Allowed Roles:', allowedRoles, 'User Roles:', userRoles, 'Is Allowed:', isAllowed, 'Is Authenticated:', isAuthenticated);
  return isAuthenticated && isAllowed ? children : <Navigate to="/login" replace />;
};

const DashboardLayout = ({ children, onLogout }) => {
  return (
    <div className="flex">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1">{children}</main>
    </div>
  );
};

function App() {
  const { isAuthenticated, isLoading, roles, login, logout } = useAuth();

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
          <Routes>
            <Route path="*" element={<AuthPages onLogin={login} />} />
          </Routes>
        ) : (
          <DashboardLayout onLogout={logout}>
            <Routes>
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route
                path="/productos"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Colaborador']} userRoles={roles} isAuthenticated={isAuthenticated}>
                    <ErrorBoundary><Productos /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ventas"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Colaborador', 'Vendedor']} userRoles={roles} isAuthenticated={isAuthenticated}>
                    <ErrorBoundary><Ventas /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ventas/:id"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Colaborador', 'Vendedor']} userRoles={roles} isAuthenticated={isAuthenticated}>
                    <ErrorBoundary><VentaDetalle /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movimientos"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Colaborador', 'Vendedor']} userRoles={roles} isAuthenticated={isAuthenticated}>
                    <ErrorBoundary><Movimientos /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parametros"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Colaborador']} userRoles={roles} isAuthenticated={isAuthenticated}>
                    <ErrorBoundary><Parametros /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reportes"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Colaborador', 'Vendedor']} userRoles={roles} isAuthenticated={isAuthenticated}>
                    <ErrorBoundary><Reportes /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute allowedRoles={['Admin']} userRoles={roles} isAuthenticated={isAuthenticated}>
                    <ErrorBoundary><UserManagement /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DashboardLayout>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;