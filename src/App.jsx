import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPages from './pages/AuthPages';
import ChangePassword from './pages/ChangePassword'; // Necesitarás crear este componente
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
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const rolesStored = JSON.parse(localStorage.getItem('roles') || '[]');
      const mustChange = JSON.parse(sessionStorage.getItem('mustChangePassword') || 'false');
      
      console.log('Token:', token);
      console.log('Roles:', rolesStored);
      console.log('Must change password:', mustChange);

      if (token) {
        setIsAuthenticated(true);
        setRoles(rolesStored);
        setMustChangePassword(mustChange);
      } else {
        setIsAuthenticated(false);
        setRoles([]);
        setMustChangePassword(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (tokenData) => {
    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('userName', tokenData.userName);
    localStorage.setItem('roles', JSON.stringify(tokenData.roles));
    
    // Guardar el estado de cambio obligatorio de contraseña
    const mustChange = tokenData.mustChangePassword || false;
    sessionStorage.setItem('mustChangePassword', JSON.stringify(mustChange));
    
    console.log('Login roles:', tokenData.roles);
    console.log('Must change password:', mustChange);
    
    setIsAuthenticated(true);
    setRoles(tokenData.roles);
    setMustChangePassword(mustChange);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
    setRoles([]);
    setMustChangePassword(false);
  };

  const passwordChanged = () => {
    sessionStorage.setItem('mustChangePassword', 'false');
    setMustChangePassword(false);
  };

  return { 
    isAuthenticated, 
    isLoading, 
    roles, 
    mustChangePassword, 
    login, 
    logout, 
    passwordChanged 
  };
};

const ProtectedRoute = ({ children, allowedRoles, userRoles, isAuthenticated, mustChangePassword }) => {
  // Si el usuario debe cambiar la contraseña, redirigir a change-password
  if (isAuthenticated && mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

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
  const { 
    isAuthenticated, 
    isLoading, 
    roles, 
    mustChangePassword, 
    login, 
    logout, 
    passwordChanged 
  } = useAuth();

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
        ) : mustChangePassword ? (
          // Si el usuario debe cambiar la contraseña, solo mostrar esa página
          <Routes>
            <Route 
              path="/change-password" 
              element={<ChangePassword onPasswordChanged={passwordChanged} />} 
            />
            <Route path="*" element={<Navigate to="/change-password" replace />} />
          </Routes>
        ) : (
          <DashboardLayout onLogout={logout}>
            <Routes>
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route
                path="/productos"
                element={
                  <ProtectedRoute 
                    allowedRoles={['Admin', 'Colaborador']} 
                    userRoles={roles} 
                    isAuthenticated={isAuthenticated}
                    mustChangePassword={mustChangePassword}
                  >
                    <ErrorBoundary><Productos /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ventas"
                element={
                  <ProtectedRoute 
                    allowedRoles={['Admin', 'Colaborador', 'Vendedor']} 
                    userRoles={roles} 
                    isAuthenticated={isAuthenticated}
                    mustChangePassword={mustChangePassword}
                  >
                    <ErrorBoundary><Ventas /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ventas/:id"
                element={
                  <ProtectedRoute 
                    allowedRoles={['Admin', 'Colaborador', 'Vendedor']} 
                    userRoles={roles} 
                    isAuthenticated={isAuthenticated}
                    mustChangePassword={mustChangePassword}
                  >
                    <ErrorBoundary><VentaDetalle /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movimientos"
                element={
                  <ProtectedRoute 
                    allowedRoles={['Admin', 'Colaborador', 'Vendedor']} 
                    userRoles={roles} 
                    isAuthenticated={isAuthenticated}
                    mustChangePassword={mustChangePassword}
                  >
                    <ErrorBoundary><Movimientos /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parametros"
                element={
                  <ProtectedRoute 
                    allowedRoles={['Admin', 'Colaborador']} 
                    userRoles={roles} 
                    isAuthenticated={isAuthenticated}
                    mustChangePassword={mustChangePassword}
                  >
                    <ErrorBoundary><Parametros /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reportes"
                element={
                  <ProtectedRoute 
                    allowedRoles={['Admin', 'Colaborador', 'Vendedor']} 
                    userRoles={roles} 
                    isAuthenticated={isAuthenticated}
                    mustChangePassword={mustChangePassword}
                  >
                    <ErrorBoundary><Reportes /></ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute 
                    allowedRoles={['Admin']} 
                    userRoles={roles} 
                    isAuthenticated={isAuthenticated}
                    mustChangePassword={mustChangePassword}
                  >
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