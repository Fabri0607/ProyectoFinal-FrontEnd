import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, LogIn, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// Componentes movidos fuera para evitar re-creación
const ErrorMessage = ({ message }) => (
  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
    <AlertCircle className="w-5 h-5" />
    <span className="text-sm">{message}</span>
  </div>
);

const SuccessMessage = ({ message }) => (
  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
    <CheckCircle className="w-5 h-5" />
    <span className="text-sm">{message}</span>
  </div>
);

const LoginPage = ({ 
  loginData, 
  handleLoginChange, 
  handleLoginSubmit, 
  showPassword, 
  setShowPassword, 
  loginLoading, 
  loginError, 
  loginSuccess, 
  setCurrentPage, 
  setLoginError, 
  setLoginSuccess 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
        <p className="text-gray-600 mt-2">Bienvenido de vuelta</p>
      </div>

      <div className="space-y-6">
        {loginError && <ErrorMessage message={loginError} />}
        {loginSuccess && <SuccessMessage message="¡Login exitoso! Redirigiendo..." />}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de Usuario
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="userName"
              value={loginData.userName}
              onChange={handleLoginChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="tu_usuario"
              required
              disabled={loginLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
              disabled={loginLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loginLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              disabled={loginLoading}
            />
            <span className="ml-2 text-sm text-gray-600">Recordarme</span>
          </label>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button
          type="button"
          onClick={handleLoginSubmit}
          disabled={loginLoading || !loginData.userName || !loginData.password}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loginLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={() => {
              setCurrentPage('register');
              setLoginError('');
              setLoginSuccess(false);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
            disabled={loginLoading}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  </div>
);

const RegisterPage = ({ 
  registerData, 
  handleRegisterChange, 
  handleRegisterSubmit, 
  showPassword, 
  setShowPassword, 
  showConfirmPassword, 
  setShowConfirmPassword, 
  registerLoading, 
  registerError, 
  registerSuccess, 
  setCurrentPage, 
  setRegisterError, 
  setRegisterSuccess 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
      <div className="text-center mb-8">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
        <p className="text-gray-600 mt-2">Únete a nosotros</p>
      </div>

      <div className="space-y-6">
        {registerError && <ErrorMessage message={registerError} />}
        {registerSuccess && <SuccessMessage message="¡Registro exitoso! Redirigiendo al login..." />}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de Usuario
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="userName"
              value={registerData.userName}
              onChange={handleRegisterChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="tu_usuario"
              required
              disabled={registerLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="tu@email.com"
              required
              disabled={registerLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
              disabled={registerLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={registerLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
              disabled={registerLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={registerLoading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
            required
            disabled={registerLoading}
          />
          <label className="ml-2 text-sm text-gray-600">
            Acepto los{' '}
            <a href="#" className="text-green-600 hover:text-green-800">
              Términos y Condiciones
            </a>{' '}
            y la{' '}
            <a href="#" className="text-green-600 hover:text-green-800">
              Política de Privacidad
            </a>
          </label>
        </div>

        <button
          type="button"
          onClick={handleRegisterSubmit}
          disabled={registerLoading || !registerData.userName || !registerData.email || !registerData.password || !registerData.confirmPassword}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {registerLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => {
              setCurrentPage('login');
              setRegisterError('');
              setRegisterSuccess(false);
            }}
            className="text-green-600 hover:text-green-800 font-medium"
            disabled={registerLoading}
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  </div>
);

const AuthPages = ({ onLogin }) => {
  const [currentPage, setCurrentPage] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados para los formularios
  const [loginData, setLoginData] = useState({
    userName: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Estados para UI
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Configuración de API
  const API_BASE_URL = 'http://localhost:5151/api';
  
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    if (loginError) setLoginError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
    if (registerError) setRegisterError('');
  };

 const handleLoginSubmit = async () => {
  setLoginLoading(true);
  setLoginError('');
  setLoginSuccess(false);

  try {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: loginData.userName,
        password: loginData.password
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('token', data.token.token);
      
      // Login exitoso
      setLoginSuccess(true);
      
      // Llamar a onLogin pasado desde App.js
      if (onLogin && data.token) {
        onLogin({
          token: data.token.token,
          expiration: data.token.expiration,
          userName: data.userName,
          roles: data.roles
        });
      }
      
      console.log('Login exitoso:', data);
      
    } else {
      const errorText = await response.text();
      let errorMessage = 'Error en el inicio de sesión';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      setLoginError(errorMessage);
    }
  } catch (error) {
    setLoginError('Error de conexión. Por favor, verifica que el servidor esté funcionando.');
    console.error('Error de login:', error);
  } finally {
    setLoginLoading(false);
  }
};

  const handleRegisterSubmit = async () => {
  // Validación local antes de enviar
  if (registerData.password !== registerData.confirmPassword) {
    setRegisterError('Las contraseñas no coinciden');
    return;
  }

  if (registerData.password.length < 6) {
    setRegisterError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  if (!registerData.userName.trim()) {
    setRegisterError('El nombre de usuario es requerido');
    return;
  }

  if (!registerData.email.trim()) {
    setRegisterError('El email es requerido');
    return;
  }

  setRegisterLoading(true);
  setRegisterError('');
  setRegisterSuccess(false);

  try {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: registerData.userName,
        email: registerData.email,
        password: registerData.password,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      // Registro exitoso
      setRegisterSuccess(true);
      
      // Limpiar formulario
      setRegisterData({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Cambiar a login después de 2 segundos
      setTimeout(() => {
        setCurrentPage('login');
        setRegisterSuccess(false);
      }, 2000);
    } else {
      // Error del servidor
      const errorText = await response.text();
      let errorMessage = 'Error en el registro';

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      setRegisterError(errorMessage);
    }
  } catch (error) {
    setRegisterError('Error de conexión. Por favor, verifica que el servidor esté funcionando.');
    console.error('Error de registro:', error);
  } finally {
    setRegisterLoading(false);
  }
};

  return currentPage === 'login' ? (
    <LoginPage 
      loginData={loginData}
      handleLoginChange={handleLoginChange}
      handleLoginSubmit={handleLoginSubmit}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      loginLoading={loginLoading}
      loginError={loginError}
      loginSuccess={loginSuccess}
      setCurrentPage={setCurrentPage}
      setLoginError={setLoginError}
      setLoginSuccess={setLoginSuccess}
    />
  ) : (
    <RegisterPage 
      registerData={registerData}
      handleRegisterChange={handleRegisterChange}
      handleRegisterSubmit={handleRegisterSubmit}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      registerLoading={registerLoading}
      registerError={registerError}
      registerSuccess={registerSuccess}
      setCurrentPage={setCurrentPage}
      setRegisterError={setRegisterError}
      setRegisterSuccess={setRegisterSuccess}
    />
  );
};

export default AuthPages;